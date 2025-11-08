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
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, fullName: string, role: UserRole, phone: string, dateOfBirth: string, gender: string) => Promise<void>;
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
      const storedRole = localStorage.getItem("user_role") as UserRole;
      const storedEmail = localStorage.getItem("user_email");
      const storedName = localStorage.getItem("user_name");

      if (token && storedEmail) {
        // Simple token check - assume valid if it exists
        // Real verification happens during API calls
        setUser({
          id: "temp", // Will be updated when profile is fetched
          name: storedName || storedEmail.split("@")[0],
          email: storedEmail,
          role: storedRole || "patient",
          firstName: storedName || "",
          lastName: "",
        });
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Backend manages roles - just send email and password
      const response = await api.post<{
        message: string;
        user: {
          id: string;
          email: string;
          role: string;
          full_name: string;
        };
        session: {
          access_token: string;
          token_type: string;
        };
      }>(API_ENDPOINTS.auth.login, { email, password });

      // Store tokens
      localStorage.setItem("auth_token", response.session.access_token);

      // Use role from backend response (backend manages roles now)
      const backendRole = response.user.role?.toLowerCase() as UserRole;
      const fullName = response.user.full_name;
      
      // Store user data for session restoration
      localStorage.setItem("user_role", backendRole);
      localStorage.setItem("user_email", response.user.email);
      localStorage.setItem("user_name", fullName || "");
      
      setUser({
        id: response.user.id,
        name: fullName || email.split("@")[0],
        email: response.user.email,
        role: backendRole, // Use the role from backend
        firstName: fullName,
        lastName: "",
      });

      toast({
        title: "Login Successful!",
        description: `Welcome back, ${backendRole === "doctor" ? "Doctor" : "Patient"}!`,
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

  const signup = async (email: string, password: string, userFullName: string, role: UserRole, phone: string, dateOfBirth: string, gender: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Backend signup now accepts role parameter
      const response = await api.post<{
        message: string;
        user: {
          id: string;
          email: string;
          role: string;
          full_name: string;
          created_at: string;
        };
        session: {
          access_token: string;
          token_type: string;
        };
      }>(API_ENDPOINTS.auth.signup, { 
        email, 
        password, 
        full_name: userFullName,
        role: role // Backend now accepts role parameter
      });

      // Store tokens
      localStorage.setItem("auth_token", response.session.access_token);

      // Update profile with additional information
      try {
        await api.put(API_ENDPOINTS.auth.profile, {
          phone: phone,
          date_of_birth: dateOfBirth,
          gender: gender
        });
      } catch (profileError) {
        console.warn("Profile update failed after signup:", profileError);
        // Don't fail signup if profile update fails
      }

      // Use role from backend response (backend should respect the role we sent)
      const backendRole = response.user.role?.toLowerCase() as UserRole;
      const fullName = response.user.full_name;
      
      // Store user data for session restoration
      localStorage.setItem("user_role", backendRole);
      localStorage.setItem("user_email", response.user.email);
      localStorage.setItem("user_name", fullName || "");
      
      setUser({
        id: response.user.id,
        name: fullName || email.split("@")[0],
        email: response.user.email,
        role: backendRole, // Use the role from backend
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
      localStorage.removeItem("user_email");
      localStorage.removeItem("user_name");
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
