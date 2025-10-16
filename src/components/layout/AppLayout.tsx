import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageCircle, Phone } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { TopNavbar } from "./TopNavbar";
// Floating components
import FloatingChatBot from "../floating/FloatingChatBot";
import FloatingVoiceAgent from "../floating/FloatingVoiceAgent";
import { useScrollPosition } from "@/hooks/use-scroll-position";
import { SidebarScrollProvider } from "@/contexts/SidebarScrollContext";

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const { scrollContainerRef } = useScrollPosition();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // Determine user role (default to patient if not specified)
  const userRole = user?.role || "patient";

  return (
    <SidebarScrollProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Sidebar */}
        <Sidebar 
          userRole={userRole} 
          onLogout={handleLogout} 
          isCollapsed={isSidebarCollapsed}
          onToggle={toggleSidebar}
        />

        {/* Main Content */}
        <div 
          className={`transition-all duration-300 ease-in-out ${
            isSidebarCollapsed ? 'ml-0' : 'ml-0 lg:ml-72'
          }`}
        >
          {/* Top Navbar */}
          <TopNavbar userName={user?.name} userRole={userRole} onLogout={handleLogout} isSidebarCollapsed={isSidebarCollapsed} />
          
          {/* Page Content with Scroll Position Memory */}
          <main ref={scrollContainerRef} className="min-h-screen overflow-y-auto">
            {children}
          </main>
        </div>

        {/* Floating Action Buttons */}
        <div className="fixed bottom-4 right-4 z-[9998] flex flex-col gap-3">
          {/* Chat Assistant Button */}
          <Button
            onClick={() => {
              setIsChatOpen(true);
              setIsVoiceOpen(false); // Close voice when opening chat
            }}
            className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300"
            title="Open AI Chat Assistant"
          >
            <MessageCircle className="w-6 h-6 text-white" />
          </Button>

          {/* Voice Assistant Button */}
          <Button
            onClick={() => {
              setIsVoiceOpen(true);
              setIsChatOpen(false); // Close chat when opening voice
            }}
            className="w-14 h-14 rounded-full bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all duration-300"
            title="Open AI Voice Assistant"
          >
            <Phone className="w-6 h-6 text-white" />
          </Button>
        </div>

        {/* Floating Chat Component */}
        <FloatingChatBot 
          isOpen={isChatOpen} 
          onClose={() => setIsChatOpen(false)} 
        />

        {/* Floating Voice Component */}
        <FloatingVoiceAgent 
          isOpen={isVoiceOpen} 
          onClose={() => setIsVoiceOpen(false)} 
        />
      </div>
    </SidebarScrollProvider>
  );
};