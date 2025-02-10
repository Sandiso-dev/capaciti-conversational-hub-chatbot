
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

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
            {/* Chat messages will go here */}
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-1 rounded-md bg-white/5 border border-white/10 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button size="icon" className="bg-primary text-primary-foreground">
                <MessageSquare className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
