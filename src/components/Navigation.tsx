import { Button } from "@/components/ui/button";
import { LogIn, LogOut, LayoutDashboard, Sun, Moon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import { Toggle } from "@/components/ui/toggle";
import { auth, db } from "@/integrations/firebase/client";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState, useContext, createContext, ReactNode } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Logic to check if the user is authenticated and if they are an admin
    // For example:
    // setIsAuthenticated(true);
    // setIsAdmin(true);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

const Navigation = () => {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    }
  };

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

          {isAuthenticated ? (
            <Button
              variant="ghost"
              className="font-medium hover:bg-muted transition-colors duration-200"
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          ) : (
            <Button
              variant="ghost"
              className="font-medium hover:bg-muted transition-colors duration-200"
              asChild
            >
              <Link to="/auth">
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
