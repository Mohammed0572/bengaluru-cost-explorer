import { Link, useLocation } from "react-router-dom";
import { Home, PieChart, Info, Mail, Settings, LogOut, Scale, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

export const Sidebar = ({ className }: { className?: string }) => {
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", path: "/", icon: Home },
    { name: "Analytics", path: "/analytics", icon: PieChart },
    { name: "Compare", path: "/compare", icon: Scale },
    { name: "Budget", path: "/budget", icon: Wallet },
    { name: "About Us", path: "/about", icon: Info },
    { name: "Contact", path: "/contact", icon: Mail },
  ];

  return (
    <aside className={cn("w-64 border-r bg-card flex flex-col justify-between h-screen sticky top-0", className)}>
      <div>
        <div className="h-16 flex items-center px-6 border-b border-sidebar-border/50">
          <h1 className="font-bold text-xl tracking-tight text-primary">Cost Explorer</h1>
        </div>
        <div className="p-4 space-y-6">
          
          {/* Main Features */}
          <div className="space-y-2">
            <h4 className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Overview</h4>
            <nav className="space-y-1">
              {navItems.slice(0, 2).map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 border-l-2",
                      isActive
                        ? "bg-primary/10 text-primary border-primary"
                        : "border-transparent text-muted-foreground hover:bg-muted hover:text-foreground hover:border-border"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Company Links */}
          <div className="space-y-2">
            <h4 className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Company</h4>
            <nav className="space-y-1">
              {navItems.slice(2, 4).map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 border-l-2",
                      isActive
                        ? "bg-primary/10 text-primary border-primary"
                        : "border-transparent text-muted-foreground hover:bg-muted hover:text-foreground hover:border-border"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      <div className="p-4 border-t">
        <button className="flex items-center gap-3 px-3 py-2 w-full rounded-md text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
          <Settings className="w-4 h-4" />
          Settings
        </button>
        <button className="flex items-center gap-3 px-3 py-2 w-full rounded-md text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors mt-1">
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
};
