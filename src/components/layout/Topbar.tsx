import { Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "./Sidebar";

interface TopbarProps {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
}

export const Topbar = ({
  isDarkMode,
  toggleTheme,
  searchTerm,
  setSearchTerm,
}: TopbarProps) => {
  return (
    <header className="h-16 border-b bg-card/50 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-4 flex-1">
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="w-5 h-5" />
        </Button>

        <div className="relative max-w-md w-full hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search costs (e.g. Rent in Indiranagar)..."
            className="pl-9 bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleTheme}
          className="rounded-full border-muted bg-background hover:bg-muted">
          {isDarkMode ? (
            <Sun className="w-4 h-4 text-amber-500" />
          ) : (
            <Moon className="w-4 h-4 text-slate-700" />
          )}
        </Button>
      </div>
    </header>
  );
};
