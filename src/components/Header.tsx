import { Search, TrendingUp, Menu, X, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ThemeToggle from "./ThemeToggle";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import coinVistaLogo from "@/assets/coinvista-logo.svg";

interface HeaderProps {
  onSearch?: (query: string) => void;
  showSearch?: boolean;
}

const Header = ({ onSearch, showSearch = true }: HeaderProps) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out",
      description: "You've been successfully signed out.",
    });
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 transition-transform hover:scale-105">
          <img src={coinVistaLogo} alt="CoinVista" className="h-10 w-10" />
          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            CoinVista
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className={cn(
              "text-sm font-medium transition-colors",
              location.pathname === "/" ? "text-primary" : "text-muted-foreground hover:text-primary"
            )}
          >
            Home
          </Link>
          <Link
            to="/markets"
            className={cn(
              "text-sm font-medium transition-colors",
              location.pathname === "/markets" ? "text-primary" : "text-muted-foreground hover:text-primary"
            )}
          >
            Markets
          </Link>
          <Link
            to="/portfolio"
            className={cn(
              "text-sm font-medium transition-colors",
              location.pathname === "/portfolio" ? "text-primary" : "text-muted-foreground hover:text-primary"
            )}
          >
            Portfolio
          </Link>
          <Link
            to="/watchlist"
            className={cn(
              "text-sm font-medium transition-colors",
              location.pathname === "/watchlist" ? "text-primary" : "text-muted-foreground hover:text-primary"
            )}
          >
            Watchlist
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {showSearch && (
            <div className="relative w-64 hidden lg:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search coins..."
                className="pl-10 bg-card border-border"
                onChange={(e) => onSearch?.(e.target.value)}
              />
            </div>
          )}
          <ThemeToggle />
          
          {user ? (
            <Button variant="ghost" size="icon" onClick={handleSignOut} className="hidden md:flex">
              <LogOut className="h-5 w-5" />
            </Button>
          ) : (
            <Link to="/auth" className="hidden md:block">
              <Button variant="default" size="sm">Sign In</Button>
            </Link>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <nav className="container py-4 flex flex-col space-y-2">
            <Link
              to="/"
              className={cn(
                "px-4 py-2 rounded-md transition-colors",
                location.pathname === "/" ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent/50"
              )}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/markets"
              className={cn(
                "px-4 py-2 rounded-md transition-colors",
                location.pathname === "/markets" ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent/50"
              )}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Markets
            </Link>
            <Link
              to="/portfolio"
              className={cn(
                "px-4 py-2 rounded-md transition-colors",
                location.pathname === "/portfolio" ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent/50"
              )}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Portfolio
            </Link>
            <Link
              to="/watchlist"
              className={cn(
                "px-4 py-2 rounded-md transition-colors",
                location.pathname === "/watchlist" ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent/50"
              )}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Watchlist
            </Link>
            
            {user ? (
              <Button variant="ghost" onClick={handleSignOut} className="justify-start px-4">
                <LogOut className="h-5 w-5 mr-2" />
                Sign Out
              </Button>
            ) : (
              <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="default" className="w-full mx-4">Sign In</Button>
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
