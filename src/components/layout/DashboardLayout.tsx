import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { Footer } from "./Footer";

export interface DashboardContextType {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
}

export const DashboardLayout = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <Sidebar className="hidden md:flex" />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <div className="flex-1 overflow-y-auto flex flex-col">
          <main className="p-4 md:p-6 lg:p-8 flex-1">
            <Outlet context={{ searchTerm, setSearchTerm } satisfies DashboardContextType} />
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
};
