import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Shield, 
  Pill, 
  MessageCircle, 
  FileText, 
  Leaf,
  Heart,
  Activity,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Brain,
  BookOpen,
  Calendar,
  Apple,
  Phone
} from "lucide-react";
import { UserRole } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { useSidebarScroll } from "@/contexts/SidebarScrollContext";

interface SidebarProps {
  userRole: UserRole;
  onLogout: () => void;
  isCollapsed: boolean;
  onToggle: () => void;
}

interface NavLink {
  path: string;
  label: string;
  icon: any;
  iconColor?: string;
  bgColor?: string;
  gradient?: string;
}

export const Sidebar = ({ userRole, onLogout, isCollapsed, onToggle }: SidebarProps) => {
  const location = useLocation();
  const { sidebarRef, preserveScrollPosition, restoreScrollPosition } = useSidebarScroll();
  
  // Handle scroll preservation across route changes
  useEffect(() => {
    // Restore scroll position when route changes
    restoreScrollPosition();
    
    // Save scroll position before unmounting or route changing
    return () => {
      preserveScrollPosition();
    };
  }, [location.pathname, preserveScrollPosition, restoreScrollPosition]);

  // Continuously save scroll position during scrolling
  useEffect(() => {
    const navElement = sidebarRef.current;
    if (!navElement) return;

    const handleScroll = () => {
      preserveScrollPosition();
    };

    // Throttle scroll events for better performance
    let scrollTimeout: NodeJS.Timeout;
    const throttledScroll = () => {
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(handleScroll, 100);
    };

    navElement.addEventListener('scroll', throttledScroll, { passive: true });
    
    return () => {
      navElement.removeEventListener('scroll', throttledScroll);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, [sidebarRef, preserveScrollPosition]);

  // Prevent auto-scroll on link click
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Save the current scroll position immediately before navigation
    preserveScrollPosition();
    
    // Prevent any auto-scroll behavior
    (e.currentTarget as HTMLAnchorElement).blur();
  };
  
  // Main 6 features for patients with colorful icons - Dashboard first (removed AI Chatbot & Voice Agent)
  const patientLinks: NavLink[] = [
    { 
      path: "/dashboard", 
      label: "Dashboard", 
      icon: LayoutDashboard,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-50 hover:bg-blue-100",
      gradient: "from-blue-400 to-blue-600"
    },
    { 
      path: "/passport", 
      label: "Smart Health Passport", 
      icon: Shield,
      iconColor: "text-blue-500",
      bgColor: "bg-blue-50 hover:bg-blue-100",
      gradient: "from-blue-400 to-blue-600"
    },
    { 
      path: "/generic-medicine", 
      label: "Generic Medicine Suggester", 
      icon: Pill,
      iconColor: "text-green-500",
      bgColor: "bg-green-50 hover:bg-green-100", 
      gradient: "from-green-400 to-green-600"
    },
    { 
      path: "/disease-prediction", 
      label: "Infectious Disease Prediction", 
      icon: Brain,
      iconColor: "text-red-500",
      bgColor: "bg-red-50 hover:bg-red-100",
      gradient: "from-red-400 to-red-600"
    },
    { 
      path: "/remedies", 
      label: "Natural Remedies & Diet Suggester", 
      icon: Leaf,
      iconColor: "text-emerald-500",
      bgColor: "bg-emerald-50 hover:bg-emerald-100",
      gradient: "from-emerald-400 to-emerald-600"
    },
    { 
      path: "/medivault", 
      label: "Medivault", 
      icon: FileText,
      iconColor: "text-teal-500",
      bgColor: "bg-teal-50 hover:bg-teal-100",
      gradient: "from-teal-400 to-teal-600"
    },
    { 
      path: "/health-diary", 
      label: "Health Diary", 
      icon: BookOpen,
      iconColor: "text-orange-500",
      bgColor: "bg-orange-50 hover:bg-orange-100",
      gradient: "from-orange-400 to-orange-600"
    },
  ];

  const doctorLinks: NavLink[] = [
    { 
      path: "/doctor-dashboard", 
      label: "Dashboard", 
      icon: LayoutDashboard,
      iconColor: "text-blue-500",
      bgColor: "bg-blue-50 hover:bg-blue-100",
      gradient: "from-blue-400 to-blue-600"
    },
    { 
      path: "/doctor/patients", 
      label: "My Patients", 
      icon: Users,
      iconColor: "text-teal-500",
      bgColor: "bg-teal-50 hover:bg-teal-100",
      gradient: "from-teal-400 to-teal-600"
    },
    { 
      path: "/doctor/diagnosis", 
      label: "AI Diagnosis Assistant", 
      icon: Brain,
      iconColor: "text-purple-500",
      bgColor: "bg-purple-50 hover:bg-purple-100",
      gradient: "from-purple-400 to-purple-600"
    },
    { 
      path: "/doctor/consultations", 
      label: "Consultations", 
      icon: MessageCircle,
      iconColor: "text-green-500",
      bgColor: "bg-green-50 hover:bg-green-100",
      gradient: "from-green-400 to-green-600"
    },
    { 
      path: "/doctor/analytics", 
      label: "Analytics & Reports", 
      icon: Activity,
      iconColor: "text-orange-500",
      bgColor: "bg-orange-50 hover:bg-orange-100",
      gradient: "from-orange-400 to-orange-600"
    },
  ];

  const links = 
    userRole === "doctor" ? doctorLinks :
    patientLinks;

  const getAccentColor = () => {
    if (userRole === "doctor") return "bg-blue-500";
    return "bg-teal-500";
  };

  return (
    <>
      {/* Hamburger Menu Button - Fixed position, always visible */}
      <button
        onClick={onToggle}
        className="fixed top-4 left-4 z-50 p-2 bg-white/80 backdrop-blur-sm border-0 rounded-lg hover:bg-white/90 transition-all duration-300 hover:scale-105"
        aria-label="Toggle sidebar"
      >
        {isCollapsed ? (
          <Menu className="w-6 h-6 text-foreground" />
        ) : (
          <X className="w-6 h-6 text-foreground" />
        )}
      </button>

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed left-0 top-0 h-screen bg-white border-r border-border shadow-xl z-40 flex flex-col transition-all duration-300 ease-in-out",
          isCollapsed ? "-translate-x-full" : "translate-x-0",
          "w-72"
        )}
      >
        {/* Header with Logo - Same height as top navbar, aligned with close button */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-border">
          {/* Invisible spacer to balance the close button */}
          <div className="w-10 h-10"></div>
          
          {/* Logo and text centered */}
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-lg p-1">
              <img 
                src="/medikos-logo.png" 
                alt="Medikos Logo" 
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
            <h1 className="text-2xl font-bold gradient-text tracking-wide">Medikos</h1>
          </div>
          
          {/* Close button area (button is positioned fixed, so this is just for spacing) */}
          <div className="w-10 h-10"></div>
        </div>

        {/* Navigation */}
        <nav ref={sidebarRef} className="flex-1 p-4 pt-6 space-y-1 overflow-y-scroll" style={{ scrollBehavior: 'auto' }}>
          {/* Dashboard Link */}
          {links.filter(link => link.path.includes("dashboard")).map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={handleLinkClick}
                className={cn(
                  "flex items-center space-x-4 px-4 py-3 mb-4 rounded-xl transition-all duration-300 group",
                  isActive 
                    ? `bg-gradient-to-r ${link.gradient || 'from-primary to-primary/80'} text-white shadow-lg scale-105` 
                    : `${link.bgColor || 'hover:bg-muted'} hover:text-foreground hover:scale-102 hover:shadow-md`
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300",
                  isActive ? "bg-white/20" : "bg-white/80 shadow-sm group-hover:shadow-md"
                )}>
                  <link.icon className={cn(
                    "w-5 h-5 flex-shrink-0 transition-all duration-300",
                    isActive ? "text-white" : link.iconColor || "text-primary"
                  )} />
                </div>
                <div className="flex-1">
                  <span className={cn(
                    "font-semibold text-sm block transition-all duration-300",
                    isActive ? "text-white" : "text-gray-800"
                  )}>{link.label}</span>
                </div>
              </Link>
            );
          })}

          <div className="mb-4">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">
              Main Features
            </h2>
            {links.filter(link => !link.path.includes("dashboard")).map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={handleLinkClick}
                  className={cn(
                    "flex items-center space-x-4 px-4 py-3 mb-3 rounded-xl transition-all duration-300 group",
                    isActive 
                      ? `bg-gradient-to-r ${link.gradient || 'from-primary to-primary/80'} text-white shadow-lg scale-105` 
                      : `${link.bgColor || 'hover:bg-muted'} hover:text-foreground hover:scale-102 hover:shadow-md`
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300",
                    isActive ? "bg-white/20" : "bg-white/80 shadow-sm group-hover:shadow-md"
                  )}>
                    <link.icon className={cn(
                      "w-5 h-5 flex-shrink-0 transition-all duration-300",
                      isActive ? "text-white" : link.iconColor || "text-primary"
                    )} />
                  </div>
                  <div className="flex-1">
                    <span className={cn(
                      "font-semibold text-sm block transition-all duration-300",
                      isActive ? "text-white" : "text-gray-800"
                    )}>{link.label}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Bottom Actions */}
        <div className="p-2 border-t border-border space-y-1">
          <Link
            to="/settings"
            onClick={handleLinkClick}
            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-300"
          >
            <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center">
              <Settings className="w-4 h-4" />
            </div>
            <span className="font-medium text-sm">Settings</span>
          </Link>
          <button
            onClick={onLogout}
            className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-300"
          >
            <div className="w-8 h-8 rounded-lg bg-muted/50 hover:bg-destructive/10 flex items-center justify-center transition-all duration-300">
              <LogOut className="w-4 h-4" />
            </div>
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {!isCollapsed && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
          onClick={onToggle}
        />
      )}
    </>
  );
};
