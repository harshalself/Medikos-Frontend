import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, User, Settings, LogOut, ChevronDown } from "lucide-react";
import { UserRole } from "@/contexts/AuthContext";

interface TopNavbarProps {
  userName?: string;
  userRole: UserRole;
  onLogout: () => void;
  isSidebarCollapsed: boolean;
}

export const TopNavbar = ({ userName, userRole, onLogout, isSidebarCollapsed }: TopNavbarProps) => {
  const getRoleColor = () => {
    if (userRole === "admin") return "text-orange-600";
    if (userRole === "doctor") return "text-blue-600";
    return "text-teal-600";
  };

  const getRoleBgGradient = () => {
    if (userRole === "admin") return "bg-gradient-to-r from-orange-500 to-orange-600";
    if (userRole === "doctor") return "bg-gradient-to-r from-blue-500 to-blue-600";
    return "bg-gradient-to-r from-teal-500 to-teal-600";
  };

  const getRoleBgColor = () => {
    if (userRole === "admin") return "bg-orange-500";
    if (userRole === "doctor") return "bg-blue-500";
    return "bg-teal-500";
  };

  return (
    <header className="h-16 bg-white border-b border-border sticky top-0 z-40 shadow-sm">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Page Title / Breadcrumb - with proper margin for hamburger menu and role-based oval */}
        <div 
          style={{ 
            marginLeft: isSidebarCollapsed ? '60px' : '16px'
          }} 
          className="md:ml-4 transition-all duration-300"
        >
          <div className={`inline-flex items-center px-4 py-2 rounded-full ${getRoleBgGradient()} shadow-lg`}>
            <h2 className="text-lg font-semibold text-white">
              {userRole === "admin" && "Admin Dashboard"}
              {userRole === "doctor" && "Doctor Dashboard"}  
              {userRole === "patient" && "Patient Dashboard"}
            </h2>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <Badge className="absolute -top-1 -right-1 w-5 h-5 rounded-full p-0 flex items-center justify-center bg-destructive text-white text-xs">
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 bg-white z-50">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-80 overflow-y-auto">
                <div className="p-3 hover:bg-muted cursor-pointer border-b">
                  <p className="text-sm font-medium">New health tip available</p>
                  <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                </div>
                <div className="p-3 hover:bg-muted cursor-pointer border-b">
                  <p className="text-sm font-medium">Profile update successful</p>
                  <p className="text-xs text-muted-foreground mt-1">1 day ago</p>
                </div>
                <div className="p-3 hover:bg-muted cursor-pointer">
                  <p className="text-sm font-medium">New feature: AI Voice Assistant</p>
                  <p className="text-xs text-muted-foreground mt-1">3 days ago</p>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-full ${getRoleBgColor()} flex items-center justify-center`}>
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="text-left hidden md:block">
                  <p className="text-sm font-medium">{userName || "User"}</p>
                  <p className={`text-xs capitalize ${getRoleColor()}`}>{userRole}</p>
                </div>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white z-50">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link to="/profile">
                <DropdownMenuItem className="cursor-pointer">
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </DropdownMenuItem>
              </Link>
              <Link to="/settings">
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onLogout} className="cursor-pointer text-destructive">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
