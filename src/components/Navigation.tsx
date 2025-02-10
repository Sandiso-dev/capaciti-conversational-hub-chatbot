
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

const Navigation = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <a href="/" className="text-2xl font-clash-display font-bold text-white">
            CAPACITI
          </a>
        </div>
        <Button
          variant="ghost"
          className="font-medium hover:bg-white/10 transition-colors duration-200"
        >
          <LogIn className="mr-2 h-4 w-4" />
          Login
        </Button>
      </div>
    </nav>
  );
};

export default Navigation;
