
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-24">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center justify-center px-4 py-1.5 mb-8 text-sm font-medium rounded-full border border-border bg-muted/50 text-foreground/70 backdrop-blur-sm">
          <span className="relative flex h-2 w-2 mr-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          AI-Powered Assistant
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground fade-in">
          Your CAPACITI Guide,{" "}
          <span className="text-transparent bg-clip-text animated-gradient">
            Available 24/7
          </span>
        </h1>
        
        <p className="text-xl text-foreground/70 max-w-2xl mx-auto fade-in">
          Get instant answers about CAPACITI without searching the official site.
          Our AI assistant is here to help you navigate your journey.
        </p>
        
        <div className="flex items-center justify-center gap-4 pt-4 fade-in">
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
            Start Chatting
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button size="lg" variant="ghost" className="hover:bg-muted">
            Learn More
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
