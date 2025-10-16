import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import api, { APIError } from "@/lib/api";

export type UserRole = "patient" | "doctor" | "admin";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  firstName?: string;
  lastName?: string;
  profileImage?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, role?: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already logged in on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("auth_token");
      if (token) {
        try {
          // Verify token and get user info
          // This endpoint will be added when you provide backend docs
          // const userData = await api.get<User>("/api/auth/me");
          // setUser(userData);
          
          // For now, we'll just mark as not loading
          // The actual user data will be set after successful login
        } catch (error) {
          console.error("Auth initialization failed:", error);
          localStorage.removeItem("auth_token");
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string, role?: UserRole) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // This will be updated with actual endpoint from backend docs
      // For now, using a placeholder structure
      const response = await api.post<{
        token: string;
        user: {
          id: string;
          email: string;
          firstName?: string;
          lastName?: string;
          role: UserRole;
          profileImage?: string;
        };
      }>("/api/auth/login", { email, password, role });

      // Store token
      localStorage.setItem("auth_token", response.token);

      // Set user data
      setUser({
        id: response.user.id,
        name: response.user.firstName 
          ? `${response.user.firstName} ${response.user.lastName || ""}`.trim()
          : email.split("@")[0],
        email: response.user.email,
        role: response.user.role,
        firstName: response.user.firstName,
        lastName: response.user.lastName,
        profileImage: response.user.profileImage,
      });

    } catch (err) {
      const errorMessage = err instanceof APIError 
        ? err.data?.message || err.statusText
        : "Login failed. Please try again.";
      
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    
    try {
      // Optional: Call logout endpoint if backend provides one
      // await api.post("/api/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear local state regardless of API call result
      localStorage.removeItem("auth_token");
      setUser(null);
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isLoading, 
        isAuthenticated: !!user,
        login, 
        logout,
        error,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
