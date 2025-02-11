
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

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
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user?.id || null);
    });

    // Load chat history if user is authenticated
    const loadChatHistory = async () => {
      const { data: session } = await supabase.auth.getSession();
      if (session?.user?.id) {
        const { data: history } = await supabase
          .from('chat_history')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: true });
        
        if (history) {
          setMessages(history.map(msg => ({
            id: msg.id,
            content: msg.message,
            isBot: msg.is_bot,
            timestamp: new Date(msg.created_at)
          })));
        }
      }
    };

    loadChatHistory();
  }, []);

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

    // Add user message to chat
    setMessages(prev => [...prev, {
      content: userMessage,
      isBot: false,
      timestamp: new Date()
    }]);

    try {
      const response = await supabase.functions.invoke('chat', {
        body: { message: userMessage, userId }
      });

      if (response.error) throw new Error(response.error.message);

      // Add bot response to chat
      setMessages(prev => [...prev, {
        content: response.data.response,
        isBot: true,
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error('Error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send message. Please try again.",
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
