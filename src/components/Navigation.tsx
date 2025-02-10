
import { Button } from "@/components/ui/button";
import { LogIn, LayoutDashboard } from "lucide-react";
import { Link } from "react-router-dom";

const Navigation = () => {
  // This is a placeholder. In a real app, you'd check if the user is an admin
  const isAdmin = true;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <Link to="/" className="text-2xl font-clash-display font-bold text-white">
            CAPACITI
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          {isAdmin && (
            <Button
              variant="ghost"
              className="font-medium hover:bg-white/10 transition-colors duration-200"
              asChild
            >
              <Link to="/admin">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Admin
              </Link>
            </Button>
          )}
          <Button
            variant="ghost"
            className="font-medium hover:bg-white/10 transition-colors duration-200"
          >
            <LogIn className="mr-2 h-4 w-4" />
            Login
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
