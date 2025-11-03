import { Search, TrendingUp } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Input } from "@/components/ui/input";
import ThemeToggle from "./ThemeToggle";
import { cn } from "@/lib/utils";

interface HeaderProps {
  onSearch?: (query: string) => void;
  showSearch?: boolean;
}

const Header = ({ onSearch, showSearch = true }: HeaderProps) => {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 transition-transform hover:scale-105">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <TrendingUp className="h-6 w-6 text-primary-foreground" />
          </div>
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
        </div>
      </div>
    </header>
  );
};

export default Header;
