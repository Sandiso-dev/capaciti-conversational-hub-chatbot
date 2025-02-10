
import { Button } from "@/components/ui/button";
import { LogIn, LayoutDashboard, Sun, Moon } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "next-themes";
import { Toggle } from "@/components/ui/toggle";

const Navigation = () => {
  const { theme, setTheme } = useTheme();
  // This is a placeholder. In a real app, you'd check if the user is an admin
  const isAdmin = true;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <Link to="/" className="flex items-center">
            <img
              src="/lovable-uploads/309ac98f-164e-4e65-8983-e1ce1cdac3d9.png"
              alt="CAPACITI Logo"
              className="h-8"
            />
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <Toggle
            pressed={theme === "dark"}
            onPressedChange={(pressed) => setTheme(pressed ? "dark" : "light")}
            className="hover:bg-muted"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Toggle>
          
          {isAdmin && (
            <Button
              variant="ghost"
              className="font-medium hover:bg-muted transition-colors duration-200"
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
            className="font-medium hover:bg-muted transition-colors duration-200"
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
