import React from "react";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { auth, db } from "@/integrations/firebase/client";
import { collection, query, where, getDocs, addDoc, orderBy } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

interface Message {
  id?: string;
  content: string;
  isBot: boolean;
  timestamp: Date;
}

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      onAuthStateChanged(auth, (user) => {
        setUserId(user?.uid || null);
      });
    };
    checkAuth();

    // Load chat history if user is authenticated
    const loadChatHistory = async () => {
      if (!userId) return;
      const q = query(
        collection(db, "chat_history"),
        where("user_id", "==", userId),
        orderBy("created_at", "asc")
      );
      try {
        const querySnapshot = await getDocs(q);
        const history = querySnapshot.docs.map((doc) => doc.data());
        setMessages(history.map((msg) => ({
          id: msg.id,
          content: msg.message,
          isBot: msg.is_bot,
          timestamp: new Date(msg.created_at),
        })));
      } catch (error) {
        if (error.code === 'failed-precondition') {
          console.error("The query requires an index. You can create it here: https://console.firebase.google.com/v1/r/project/capaciti-site-chatbot/firestore/indexes?create_composite=Clpwcm9qZWN0cy9jYXBhY2l0aS1zaXRlLWNoYXRib3QvZGF0YWJhc2VzLyhkZWZhdWx0KS9jb2xsZWN0aW9uR3JvdXBzL2NoYXRfaGlzdG9yeS9pbmRleGVzL18QARoLCgd1c2VyX2lkEAEaDgoKY3JlYXRlZF9hdBABGgwKCF9fbmFtZV9fEAE");
        } else {
          console.error("Error loading chat history:", error);
        }
      }
    };

    loadChatHistory();
  }, [userId]);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setIsLoading(true);   
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!input.trim() || isLoading) return;
    
      const userMessage = input.trim();
      setInput("");
      setIsLoading(true);
    
      const newUserMessage: Message = {
        content: userMessage,
        isBot: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, newUserMessage]);
    
      try {
        const response = await fetch("http://localhost:8081/api/chat", { // Ensure this matches your server endpoint
          method: "POST",
          body: JSON.stringify({ message: userMessage, userId }),
          headers: {
            "Content-Type": "application/json",
          },
        });
    
        if (!response.ok) throw new Error("Error fetching response");
    
        const data = await response.json();
        const botMessage: Message = {
          content: data.response,
          isBot: true,
          timestamp: new Date(),
        };
    
        await addDoc(collection(db, "chat_history"), {
          user_id: userId,
          message: userMessage,
          is_bot: false,
          created_at: new Date(),
        });
    
        await addDoc(collection(db, "chat_history"), {
          user_id: userId,
          message: botMessage.content,
          is_bot: true,
          created_at: new Date(),
        });
    
        setMessages((prev) => [...prev, botMessage]);
      } catch (error) {
        console.error("Error:", error);
        toast({
          title: "Error",
          description: "There was an error sending your message. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    const newUserMessage: Message = {
      content: userMessage,
      isBot: false,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newUserMessage]);

    try {
      const response = await fetch("http://localhost:8081/api/chat", { // Updated port to 8081
        method: "POST",
        body: JSON.stringify({ message: userMessage, userId }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Error fetching response");

      const data = await response.json();
      const botMessage: Message = {
        content: data.response,
        isBot: true,
        timestamp: new Date(),
      };

      await addDoc(collection(db, "chat_history"), {
        user_id: userId,
        message: userMessage,
        is_bot: false,
        created_at: new Date(),
      });

      await addDoc(collection(db, "chat_history"), {
        user_id: userId,
        message: botMessage.content,
        is_bot: true,
        created_at: new Date(),
      });

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "There was an error sending your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        size="lg"
        className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 bg-primary text-primary-foreground"
      >
        <MessageSquare className="h-6 w-6" />
      </Button>
      
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-96 h-[600px] glass rounded-lg shadow-2xl slide-up">
          <div className="p-4 border-b border-white/10">
            <h3 className="text-lg font-semibold">CAPACITI Assistant</h3>
            <p className="text-sm text-white/70">
              Ask me anything about CAPACITI
            </p>
          </div>
          
          <div className="p-4 h-[calc(100%-140px)] overflow-y-auto">
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex gap-2 items-start",
                    msg.isBot ? "flex-row" : "flex-row-reverse"
                  )}
                >
                  <div className={cn(
                    "p-3 rounded-lg max-w-[80%]",
                    msg.isBot ? "bg-muted/50" : "bg-primary text-primary-foreground"
                  )}>
                    {msg.content}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                disabled={isLoading}
                className="flex-1 rounded-md bg-white/5 border border-white/10 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button 
                type="submit" 
                size="icon" 
                disabled={isLoading}
                className="bg-primary text-primary-foreground"
              >
                <MessageSquare className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
