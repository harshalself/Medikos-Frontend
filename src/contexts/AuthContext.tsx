import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import api, { APIError } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/api-config";
import { useToast } from "@/hooks/use-toast";

export type UserRole = "patient" | "doctor";

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
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  signup: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Check if user is already logged in on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("auth_token");
      if (token) {
        try {
          // Verify token and get user info
          const userData = await api.get<{
            id: string;
            email: string;
            full_name?: string;
            phone?: string;
            date_of_birth?: string;
            gender?: string;
            avatar_url?: string;
            created_at: string;
            updated_at: string;
          }>(API_ENDPOINTS.auth.profile);

          // Set user data - we need to determine role from somewhere
          // For now, we'll check localStorage for role or default to patient
          const storedRole = localStorage.getItem("user_role") as UserRole || "patient";

          setUser({
            id: userData.id,
            name: userData.full_name || userData.email.split("@")[0],
            email: userData.email,
            role: storedRole,
            firstName: userData.full_name,
            lastName: "",
            profileImage: userData.avatar_url,
          });
        } catch (error) {
          console.error("Auth initialization failed:", error);
          // Clear invalid token
          localStorage.removeItem("auth_token");
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("user_role");
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string, role: UserRole) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Backend doesn't handle roles - send only email and password
      const response = await api.post<{
        message: string;
        user: {
          id: string;
          email: string;
          user_metadata?: {
            full_name?: string;
          };
          app_metadata?: any;
          created_at: string;
        };
        session: {
          access_token: string;
          refresh_token?: string;
          expires_at: number;
        };
      }>(API_ENDPOINTS.auth.login, { email, password });

      // Store tokens
      localStorage.setItem("auth_token", response.session.access_token);
      if (response.session.refresh_token) {
        localStorage.setItem("refresh_token", response.session.refresh_token);
      }
      // Store user role for session restoration
      localStorage.setItem("user_role", role);

      // Set user data with role from frontend selection (backend doesn't handle roles)
      const fullName = response.user.user_metadata?.full_name;
      setUser({
        id: response.user.id,
        name: fullName || email.split("@")[0],
        email: response.user.email,
        role: role, // Use the role selected in frontend
        firstName: fullName,
        lastName: "",
      });

      toast({
        title: "Login Successful!",
        description: `Welcome back, ${role === "doctor" ? "Doctor" : "Patient"}!`,
      });

    } catch (err) {
      let errorMessage = "Login failed. Please try again.";
      
      if (err instanceof APIError) {
        if (err.data?.detail) {
          if (Array.isArray(err.data.detail)) {
            // Handle validation errors (array)
            errorMessage = err.data.detail.map((error: any) => 
              typeof error === 'string' ? error : error.msg || 'Validation error'
            ).join(', ');
          } else {
            // Handle simple string errors
            errorMessage = err.data.detail;
          }
        } else if (err.data?.message) {
          errorMessage = err.data.message;
        } else {
          errorMessage = err.statusText || `Request failed with status ${err.status}`;
        }
      }
      
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, userFullName: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.post<{
        message: string;
        user: {
          id: string;
          email: string;
          user_metadata?: {
            full_name?: string;
          };
          app_metadata?: any;
          created_at: string;
        };
        session: {
          access_token: string;
          refresh_token?: string;
          expires_at: number;
        };
      }>(API_ENDPOINTS.auth.signup, { email, password, full_name: userFullName });

      // Store tokens
      localStorage.setItem("auth_token", response.session.access_token);
      if (response.session.refresh_token) {
        localStorage.setItem("refresh_token", response.session.refresh_token);
      }

      // Set user data - new users don't have a role yet, so we'll set a default
      // The role will be determined by frontend selection during login
      const fullName = response.user.user_metadata?.full_name;
      setUser({
        id: response.user.id,
        name: fullName || email.split("@")[0],
        email: response.user.email,
        role: "patient", // Default role for new users
        firstName: fullName,
        lastName: "",
      });

      toast({
        title: "Account Created Successfully!",
        description: "Welcome to Medikos! Please log in to continue.",
      });

    } catch (err) {
      let errorMessage = "Signup failed. Please try again.";
      
      if (err instanceof APIError) {
        if (err.data?.detail) {
          if (Array.isArray(err.data.detail)) {
            // Handle validation errors (array)
            errorMessage = err.data.detail.map((error: any) => 
              typeof error === 'string' ? error : error.msg || 'Validation error'
            ).join(', ');
          } else {
            // Handle simple string errors
            errorMessage = err.data.detail;
          }
        } else if (err.data?.message) {
          errorMessage = err.data.message;
        } else {
          errorMessage = err.statusText || `Request failed with status ${err.status}`;
        }
      }
      
      console.error("Signup error details:", err);
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
      await api.post(API_ENDPOINTS.auth.logout);
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear local state regardless of API call result
      localStorage.removeItem("auth_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user_role");
      setUser(null);
      setIsLoading(false);
      
      toast({
        title: "Logged Out Successfully",
        description: "You have been logged out of your account.",
      });
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
        signup,
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
