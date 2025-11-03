import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { TopNavbar } from "./TopNavbar";
// Floating components
import FloatingChatBot from "../floating/FloatingChatBot";
import { useScrollPosition } from "@/hooks/use-scroll-position";
import { SidebarScrollProvider } from "@/contexts/SidebarScrollContext";

// Declare ElevenLabs custom element
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'elevenlabs-convai': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        'agent-id': string;
      };
    }
  }
}

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { scrollContainerRef } = useScrollPosition();

  // Load ElevenLabs script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed';
    script.async = true;
    document.head.appendChild(script);

    return () => {
      // Cleanup script when component unmounts
      const existingScript = document.querySelector('script[src="https://unpkg.com/@elevenlabs/convai-widget-embed"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

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
        <div className="fixed bottom-28 right-8 z-[9998] flex flex-col gap-3">
          {/* Chat Assistant Button */}
          <Button
            onClick={() => setIsChatOpen(true)}
            className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300"
            title="Open AI Chat Assistant"
          >
            <MessageCircle className="w-6 h-6 text-white" />
          </Button>
        </div>

        {/* Floating Chat Component */}
        <FloatingChatBot 
          isOpen={isChatOpen} 
          onClose={() => setIsChatOpen(false)} 
        />

        {/* ElevenLabs Conva AI Widget */}
        <elevenlabs-convai agent-id="agent_5701k93w72nte5xr5hk1ge3758pv"></elevenlabs-convai>
      </div>
    </SidebarScrollProvider>
  );
};