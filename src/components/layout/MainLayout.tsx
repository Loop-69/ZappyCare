
import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="flex h-screen bg-background">
      <div className="fixed inset-y-0 left-0 z-10 w-64 border-r border-border">
        <Sidebar />
      </div>
      
      <div className="flex flex-col flex-1 ml-64">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
