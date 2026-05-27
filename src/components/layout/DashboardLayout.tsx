import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

interface DashboardLayoutProps {
  children: ReactNode;
  isDarkMode: boolean;
  toggleTheme: () => void;
  searchTerm: string;
  setSearchTerm: (val: string) => void;
}

export const DashboardLayout = ({ 
  children, 
  isDarkMode, 
  toggleTheme, 
  searchTerm, 
  setSearchTerm 
}: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar 
          isDarkMode={isDarkMode} 
          toggleTheme={toggleTheme} 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
        <main className="p-4 md:p-6 lg:p-8 flex-1 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};
