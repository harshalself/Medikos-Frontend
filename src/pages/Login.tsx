import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Heart, Users, Stethoscope, User, Loader2, AlertCircle, Lock } from "lucide-react";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import medicalBg from "@/assets/medical-bg.jpg";

const Login = () => {
  const [searchParams] = useSearchParams();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole>("patient");
  const [localError, setLocalError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login, signup, isLoading, error, clearError } = useAuth();
  const { toast } = useToast();

  // Check URL parameters to set initial mode
  useEffect(() => {
    const mode = searchParams.get('mode');
    if (mode === 'signup') {
      setIsLogin(false);
    } else {
      setIsLogin(true);
    }
  }, [searchParams]);

  // Clear errors when switching modes
  useEffect(() => {
    setLocalError(null);
    clearError();
  }, [isLogin, clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();
    
    // Validation for signup
    if (!isLogin) {
      if (password !== confirmPassword) {
        setLocalError("Passwords don't match!");
        return;
      }
      if (password.length < 6) {
        setLocalError("Password must be at least 6 characters long!");
        return;
      }
      if (!fullName.trim()) {
        setLocalError("Please enter your full name!");
        return;
      }
      
      // Signup
      try {
        await signup(email, password, fullName);
        
        // After successful signup, navigate to login
        setIsLogin(true);
        setLocalError(null);
        clearError();
        
        return;
      } catch (err) {
        // Error is handled by AuthContext
        console.error("Signup error:", err);
        return;
      }
    }
    
    // Login
    try {
      await login(email, password, selectedRole);
      
      // Navigate based on role
      if (selectedRole === "doctor") {
        navigate("/doctor-dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      // Error is handled by AuthContext
      console.error("Login error:", err);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${medicalBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-medical opacity-80"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo and Brand */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white backdrop-blur-sm mb-4 p-3">
              <img 
                src="/medikos-logo.png" 
                alt="Medikos Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Medikos</h1>
            <p className="text-white/80">Your trusted healthcare companion</p>
          </div>

          {/* Login/Signup Card */}
          <Card className="glass border-0 shadow-hover animate-slide-up">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-3xl text-foreground mb-1">
                {isLogin ? "Welcome Back" : "Create Account"}
              </CardTitle>
              <CardDescription className="text-base">
                {isLogin 
                  ? "Sign in to access your health dashboard" 
                  : "Join thousands who trust their health with us"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Error Alert */}
                {(error || localError) && (
                  <Alert variant="destructive" className="animate-fade-in">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {localError || error}
                    </AlertDescription>
                  </Alert>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-sm font-semibold">{isLogin ? "Login As" : "Register As"}</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      type="button"
                      variant={selectedRole === "patient" ? "default" : "outline"}
                      className={`h-24 flex flex-col items-center justify-center card-hover transition-all duration-300 ${
                        selectedRole === "patient" ? "bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg" : ""
                      }`}
                      onClick={() => setSelectedRole("patient")}
                    >
                      <User className="w-8 h-8 mb-2" />
                      <span className="text-sm font-medium">Patient</span>
                    </Button>
                    <Button
                      type="button"
                      variant={selectedRole === "doctor" ? "default" : "outline"}
                      className={`h-24 flex flex-col items-center justify-center card-hover transition-all duration-300 ${
                        selectedRole === "doctor" ? "bg-gradient-to-br from-blue-500 to-cyan-600 shadow-lg" : ""
                      }`}
                      onClick={() => setSelectedRole("doctor")}
                    >
                      <Stethoscope className="w-8 h-8 mb-2" />
                      <span className="text-sm font-medium">Doctor</span>
                    </Button>
                  </div>
                </div>
                
                {/* Additional fields for signup */}
                {!isLogin && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="Enter your full name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        className="transition-all duration-300 focus:shadow-medical"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <Input
                        id="phoneNumber"
                        type="tel"
                        placeholder="Enter your phone number"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                        className="transition-all duration-300 focus:shadow-medical"
                      />
                    </div>
                  </>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="transition-all duration-300 focus:shadow-medical"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder={isLogin ? "Enter your password" : "Create a password (min 8 characters)"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={isLogin ? undefined : 8}
                    className="transition-all duration-300 focus:shadow-medical"
                  />
                </div>
                
                {/* Confirm password for signup */}
                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="transition-all duration-300 focus:shadow-medical"
                    />
                  </div>
                )}
                
                {/* Terms of Service for signup */}
                {!isLogin && (
                  <div className="text-xs text-muted-foreground text-center">
                    By creating an account, you agree to our{" "}
                    <Link to="#" className="text-primary hover:underline">Terms of Service</Link>{" "}
                    and{" "}
                    <Link to="#" className="text-primary hover:underline">Privacy Policy</Link>
                  </div>
                )}
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-primary to-accent hover:shadow-hover transition-all duration-300 hover-scale text-base py-6"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isLogin ? "Signing In..." : "Creating Account..."}
                    </>
                  ) : (
                    isLogin ? "Sign In to Your Account" : "Create Your Account"
                  )}
                </Button>
                
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-primary hover:text-primary/80 text-sm transition-colors"
                  >
                    {isLogin 
                      ? "Don't have an account? Sign up" 
                      : "Already have an account? Sign in"
                    }
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Trust Indicators */}
          <div className="mt-8 grid grid-cols-3 gap-4 text-center animate-fade-in">
            <div className="text-white/80">
              <Lock className="w-6 h-6 mx-auto mb-2" />
              <p className="text-xs">Secure & Private</p>
            </div>
            <div className="text-white/80">
              <Users className="w-6 h-6 mx-auto mb-2" />
              <p className="text-xs">10K+ Users</p>
            </div>
            <div className="text-white/80">
              <Heart className="w-6 h-6 mx-auto mb-2" />
              <p className="text-xs">Trusted Care</p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-white/60 text-xs space-x-4">
            <Link to="#" className="hover:text-white/80 transition-colors">Terms</Link>
            <Link to="#" className="hover:text-white/80 transition-colors">Privacy</Link>
            <Link to="#" className="hover:text-white/80 transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;