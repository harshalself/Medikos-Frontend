import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  Pill,
  MessageSquare,
  Activity,
  Mic,
  AlertTriangle,
  FolderOpen,
  Leaf,
  Menu,
  X,
  ChevronRight,
  Star,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Shield,
  Users,
  TrendingUp,
  Clock,
  CheckCircle2,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const Landing = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

  const navItems = [
    { id: "home", label: "Home" },
    { id: "features", label: "Features" },
    { id: "about", label: "About" },
    { id: "analytics", label: "Analytics" },
    { id: "testimonials", label: "Testimonials" },
    { id: "contact", label: "Contact" },
  ];

  const features = [
    {
      icon: Shield,
      title: "Smart Health Passport",
      description: "Secure digital health records accessible anywhere, anytime with complete privacy protection",
      color: "from-blue-500 via-cyan-400 to-teal-500",
      bgGlow: "bg-blue-500/10",
    },
    {
      icon: Pill,
      title: "Generic Medicine Suggester",
      description: "Find affordable alternatives to branded medicines with detailed comparisons",
      color: "from-emerald-500 via-teal-400 to-cyan-500",
      bgGlow: "bg-emerald-500/10",
    },
    {
      icon: MessageSquare,
      title: "AI Chatbot", 
      description: "24/7 intelligent health assistant powered by natural language processing",
      color: "from-purple-500 via-violet-400 to-blue-500",
      bgGlow: "bg-purple-500/10",
    },
    {
      icon: AlertTriangle,
      title: "Infectious Disease Prediction",
      description: "Early detection and prevention of infectious diseases through advanced analytics",
      color: "from-red-500 via-orange-400 to-yellow-500",
      bgGlow: "bg-red-500/10",
    },
    {
      icon: Leaf,
      title: "Natural Remedies & Diet Suggester",
      description: "Personalized natural healing recommendations and dietary guidance",
      color: "from-green-500 via-emerald-400 to-teal-500",
      bgGlow: "bg-green-500/10",
    },
    {
      icon: FolderOpen,
      title: "MediVault",
      description: "Centralized storage for all your medical documents and health records",
      color: "from-indigo-500 via-blue-400 to-cyan-500",
      bgGlow: "bg-indigo-500/10",
    },
    {
      icon: BookOpen,
      title: "Health Diary",
      description: "Track your daily health metrics, symptoms, and wellness journey with AI insights",
      color: "from-orange-500 via-yellow-400 to-amber-500",
      bgGlow: "bg-orange-500/10",
    },
  ];

  const testimonials = [
    {
      name: "Dr. Sarah Johnson",
      role: "Cardiologist",
      avatar: "SJ",
      rating: 5,
      text: "Medikos has transformed how I manage patient records. The AI predictions are remarkably accurate.",
    },
    {
      name: "Michael Chen",
      role: "Patient",
      avatar: "MC",
      rating: 5,
      text: "The generic medicine suggester saved me hundreds of dollars. Highly recommend!",
    },
    {
      name: "Dr. Priya Sharma",
      role: "General Physician",
      avatar: "PS",
      rating: 5,
      text: "The integration of natural remedies with modern medicine is brilliant. My patients love it.",
    },
    {
      name: "James Wilson",
      role: "Patient",
      avatar: "JW",
      rating: 5,
      text: "The AI chatbot is like having a doctor available 24/7. It's incredibly helpful.",
    },
  ];

  const stats = [
    { icon: Users, label: "Active Users", value: "50,000+", color: "text-blue-500" },
    { icon: Heart, label: "Health Records", value: "200,000+", color: "text-red-500" },
    { icon: TrendingUp, label: "AI Predictions", value: "1M+", color: "text-green-500" },
    { icon: Clock, label: "Response Time", value: "<1 min", color: "text-purple-500" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map((item) => item.id);
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Navigation */}
      <motion.nav
        className="fixed top-0 w-full z-50 glass border-b border-border/50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <img 
                src="/medikos-logo.png" 
                alt="Medikos Logo" 
                className="w-12 h-12 object-contain hover:scale-105 transition-transform duration-200 rounded-lg"
              />
              <span className="text-xl font-bold gradient-text">Medikos</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`text-sm font-medium transition-colors relative ${
                    activeSection === item.id ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.label}
                  {activeSection === item.id && (
                    <motion.div
                      layoutId="activeSection"
                      className="absolute -bottom-6 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-cyan-500"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate("/login?mode=login")}
                className="hover:bg-teal-50 hover:text-teal-700 text-gray-700 font-medium"
              >
                Login
              </Button>
              <Button
                onClick={() => navigate("/login?mode=signup")}
                className="bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 hover:shadow-glow hover:scale-105 transition-all text-white font-semibold"
              >
                Sign Up
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-lg"
          >
            <div className="px-4 py-4 space-y-3">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`block w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    activeSection === item.id
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <div className="pt-4 space-y-2">
                <Button
                  variant="outline"
                  className="w-full border-teal-500 text-teal-600 hover:bg-teal-50"
                  onClick={() => navigate("/login?mode=login")}
                >
                  Login
                </Button>
                <Button
                  className="w-full bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 text-white"
                  onClick={() => navigate("/login?mode=signup")}
                >
                  Sign Up
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </motion.nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        {/* Healthcare Background Image with Gradient Overlay */}
        <div className="absolute inset-0">
          {/* Multiple Healthcare Background Images */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url("https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")`,
            }}
          />
          
          {/* Additional healthcare imagery overlay */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30 mix-blend-multiply"
            style={{
              backgroundImage: `url("https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80")`,
            }}
          />
          
          {/* Healthcare-themed background with overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/90 via-teal-50/90 to-cyan-50/90 dark:from-gray-900/95 dark:via-background/95 dark:to-gray-900/95" />
          
          {/* Additional gradient overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/40 via-transparent to-white/40" />
          
          {/* Subtle healthcare pattern overlay */}
          <div className="absolute inset-0 opacity-5" 
               style={{
                 backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23059669' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3Ccircle cx='10' cy='10' r='1'/%3E%3Ccircle cx='50' cy='50' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
               }} />
          
          {/* Animated Healthcare Elements */}
          <div className="absolute inset-0">
            {/* Floating medical cross and plus symbols */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  left: `${Math.random() * 90 + 5}%`,
                  top: `${Math.random() * 90 + 5}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  x: [0, 10, 0],
                  opacity: [0.1, 0.3, 0.1],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 6 + Math.random() * 4,
                  delay: i * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <div className="w-8 h-8 relative">
                  <div className={`absolute inset-0 bg-gradient-to-br ${
                    i % 4 === 0 ? 'from-teal-400 to-cyan-400' :
                    i % 4 === 1 ? 'from-blue-400 to-indigo-400' :
                    i % 4 === 2 ? 'from-emerald-400 to-teal-400' :
                    'from-cyan-400 to-blue-400'
                  } rounded-full`} />
                  <div className="absolute inset-2 bg-white rounded-full" />
                  <div className="absolute inset-3 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full" />
                </div>
              </motion.div>
            ))}
            
            {/* Animated pulse rings */}
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={`ring-${i}`}
                className="absolute rounded-full border-2"
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${30 + (i % 2) * 40}%`,
                  width: 60 + i * 20,
                  height: 60 + i * 20,
                  borderColor: `hsl(${180 + i * 20}, 70%, 70%)`,
                }}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 0.1, 0.3],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 8 + i * 2,
                  delay: i * 1,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
          
          {/* Vibrant gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-teal-500/10 to-cyan-500/5" />
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
            {/* Left Content - Main Hero Text */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              style={{ opacity, scale }}
              className="space-y-8"
            >


              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight"
              >
                <motion.span 
                  className="bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent"
                  animate={{ backgroundPosition: ["0%", "100%", "0%"] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                >
                  Smart, Secure,
                </motion.span>
                <br />
                <span className="text-gray-800">and Personalized</span>
                <br />
                <motion.span 
                  className="bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent"
                  animate={{ backgroundPosition: ["0%", "100%", "0%"] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "linear", delay: 1 }}
                >
                  Healthcare.
                </motion.span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-gray-600 max-w-lg leading-relaxed"
              >
                Experience the future of healthcare with AI-powered diagnostics, personalized treatment plans, and
                seamless health management — all in one revolutionary platform.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Button
                  size="lg"
                  onClick={() => scrollToSection("features")}
                  className="bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 hover:shadow-2xl hover:shadow-teal-500/25 hover:scale-105 transition-all duration-300 text-lg px-8 py-4 text-white font-semibold rounded-xl"
                >
                  Explore Features
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => scrollToSection("about")}
                  className="text-lg px-8 py-4 border-2 border-teal-500 text-teal-600 hover:border-teal-600 hover:bg-gradient-to-r hover:from-teal-50 hover:to-cyan-50 hover:text-teal-700 transition-all duration-300 rounded-xl font-semibold"
                >
                  Learn More
                </Button>
              </motion.div>

              {/* Enhanced Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="grid grid-cols-3 gap-6 pt-8"
              >
                {[
                  { label: "Active Users", value: "50K+", color: "text-teal-600", icon: Users },
                  { label: "Health Records", value: "200K+", color: "text-cyan-600", icon: Shield },
                  { label: "Features", value: "8+", color: "text-blue-600", icon: Activity },
                ].map((stat, index) => (
                  <motion.div 
                    key={index} 
                    className="text-center p-4 rounded-xl bg-white/60 backdrop-blur-sm shadow-lg border border-white/20"
                    whileHover={{ scale: 1.05, y: -2 }}
                    transition={{ duration: 0.2 }}
                  >
                    <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                    <div className={`text-2xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
                    <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Side - Login/Signup Animation */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative hidden lg:flex flex-col items-center justify-center"
            >
              {/* Animated Login/Signup Card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="relative"
              >
                <Card className="w-80 shadow-2xl border-0 bg-white/80 backdrop-blur-lg">
                  <CardContent className="p-8">
                    <motion.div
                      className="text-center mb-6"
                      animate={{ scale: [1, 1.02, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-white flex items-center justify-center shadow-xl p-3 hover:scale-105 transition-transform duration-200">
                        <img 
                          src="/medikos-logo.png" 
                          alt="Medikos Logo" 
                          className="w-full h-full object-contain rounded-xl"
                        />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">Join Medikos Today</h3>
                      <p className="text-sm text-gray-600">Transform your healthcare experience</p>
                    </motion.div>

                    <div className="space-y-4">
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          onClick={() => navigate("/login?mode=signup")}
                          className="w-full bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 hover:shadow-xl hover:shadow-teal-500/25 transition-all duration-300 text-white font-semibold py-3 rounded-lg"
                        >
                          Sign Up Free
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                      </motion.div>
                      
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          variant="outline"
                          onClick={() => navigate("/login?mode=login")}
                          className="w-full border-2 border-teal-500 text-teal-600 hover:bg-gradient-to-r hover:from-teal-50 hover:to-cyan-50 hover:border-teal-600 transition-all duration-300 font-semibold py-3 rounded-lg"
                        >
                          Login
                        </Button>
                      </motion.div>
                    </div>

                    <div className="mt-6 flex items-center justify-center space-x-4 text-xs text-gray-500">
                      <span className="flex items-center">
                        <Shield className="w-3 h-3 mr-1" />
                        Secure
                      </span>
                      <span className="flex items-center">
                        <Heart className="w-3 h-3 mr-1" />
                        HIPAA Compliant
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Floating elements around the card */}
                {[
                  { icon: Activity, position: "top-0 -left-4", color: "from-blue-500 to-cyan-500", delay: 0 },
                  { icon: Shield, position: "top-4 -right-4", color: "from-green-500 to-emerald-500", delay: 0.5 },
                  { icon: Leaf, position: "-bottom-2 -left-2", color: "from-teal-500 to-green-500", delay: 1 },
                  { icon: Pill, position: "-bottom-2 -right-2", color: "from-purple-500 to-pink-500", delay: 1.5 },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className={`absolute ${item.position} w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} shadow-lg flex items-center justify-center`}
                    animate={{
                      y: [0, -10, 0],
                      rotate: [0, 10, 0],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 3,
                      delay: item.delay,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <item.icon className="w-6 h-6 text-white" />
                  </motion.div>
                ))}
              </motion.div>

              {/* Background decoration */}
              <div className="absolute inset-0 -z-10">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute rounded-full"
                    style={{
                      width: 100 + Math.random() * 100,
                      height: 100 + Math.random() * 100,
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      background: `linear-gradient(135deg, 
                        hsl(${180 + Math.random() * 60}, 70%, 85%), 
                        hsl(${200 + Math.random() * 80}, 60%, 95%))`,
                    }}
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.1, 0.3, 0.1],
                      rotate: [0, 180, 360],
                    }}
                    transition={{
                      duration: 10 + Math.random() * 5,
                      delay: i * 1,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 dark:from-gray-900 dark:via-background dark:to-gray-900 relative overflow-hidden">
        {/* Healthcare Background Image */}
        <div className="absolute inset-0 opacity-8">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url("https://images.unsplash.com/photo-1551190822-a9333d879b1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")`,
            }}
          />
        </div>
        
        {/* Background Pattern Overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23059669' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='m0 40 40-40h-40v40zm40 0v-40h-40l40 40z'/%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        
        {/* Additional overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50/70 via-blue-50/70 to-teal-50/70 dark:from-gray-900/70 dark:via-background/70 dark:to-gray-900/70" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <motion.span 
              className="px-6 py-3 rounded-full bg-gradient-to-r from-teal-100 via-cyan-100 to-blue-100 text-teal-700 text-sm font-bold border-2 border-teal-200 shadow-lg backdrop-blur-sm inline-block"
              whileHover={{ scale: 1.05 }}
            >
              🚀 Our Powerful Features
            </motion.span>
            <motion.h2 
              className="text-4xl md:text-5xl font-bold mt-8 mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Comprehensive Healthcare{" "}
              <span className="bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent">
                Solutions
              </span>
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Discover powerful AI-driven tools designed to revolutionize your healthcare experience with cutting-edge technology
            </motion.p>
          </motion.div>

          {/* Scrollable Features Container */}
          <div className="relative">
            {/* Desktop: Horizontal scroll with all cards visible */}
            <div className="hidden lg:block">
              <div className="flex overflow-x-auto scrollbar-hide gap-6 pb-4" style={{ scrollBehavior: 'smooth' }}>
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                    whileHover={{ y: -12, scale: 1.03 }}
                    className="flex-shrink-0 w-80 group"
                  >
                    <Card className="h-full border-0 shadow-xl hover:shadow-2xl cursor-pointer overflow-hidden transition-all duration-500 bg-white/90 backdrop-blur-sm relative">
                      {/* Card glow effect */}
                      <div className={`absolute inset-0 ${feature.bgGlow} opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-lg`} />
                      
                      <CardContent className="p-8 relative z-10">
                        <motion.div
                          className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-2xl relative overflow-hidden`}
                          whileHover={{ rotate: 10, scale: 1.1 }}
                          transition={{ duration: 0.3 }}
                        >
                          {/* Icon glow effect */}
                          <div className="absolute inset-0 bg-white/20 rounded-3xl" />
                          <feature.icon className="w-10 h-10 text-white relative z-10" />
                        </motion.div>
                        
                        <h3 className="text-xl font-bold mb-4 text-gray-800 group-hover:text-teal-700 transition-colors duration-300 leading-tight">
                          {feature.title}
                        </h3>
                        
                        <p className="text-gray-600 leading-relaxed mb-6 line-clamp-3">
                          {feature.description}
                        </p>
                        
                        <motion.div 
                          className="flex items-center text-teal-600 text-sm font-semibold group-hover:translate-x-2 transition-transform duration-300"
                          whileHover={{ x: 4 }}
                        >
                          <span>Explore Feature</span>
                          <ChevronRight className="w-4 h-4 ml-2 group-hover:ml-3 transition-all duration-300" />
                        </motion.div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Mobile/Tablet: Grid layout */}
            <div className="block lg:hidden">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="group"
                  >
                    <Card className="h-full border-0 shadow-lg hover:shadow-2xl cursor-pointer overflow-hidden transition-all duration-300 bg-white/90 backdrop-blur-sm relative">
                      <div className={`absolute inset-0 ${feature.bgGlow} opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-lg`} />
                      
                      <CardContent className="p-6 relative z-10">
                        <motion.div
                          className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg`}
                          whileHover={{ rotate: 5, scale: 1.1 }}
                        >
                          <feature.icon className="w-8 h-8 text-white" />
                        </motion.div>
                        
                        <h3 className="text-lg font-bold mb-3 text-gray-800 group-hover:text-teal-700 transition-colors">
                          {feature.title}
                        </h3>
                        
                        <p className="text-sm text-gray-600 leading-relaxed mb-4">
                          {feature.description}
                        </p>
                        
                        <div className="flex items-center text-teal-600 text-sm font-medium group-hover:translate-x-2 transition-transform">
                          <span>Learn more</span>
                          <ChevronRight className="w-4 h-4 ml-1 group-hover:ml-2 transition-all" />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Scroll indicator for desktop */}
            <div className="hidden lg:flex justify-center mt-8">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span>Scroll to explore all features</span>
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ChevronRight className="w-4 h-4" />
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-gradient-to-br from-white via-blue-50/50 to-teal-50/50 dark:from-gray-900 dark:via-background dark:to-gray-900 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23059669' fill-opacity='0.3'%3E%3Cpath d='M30 30c0-16.569 13.431-30 30-30v60c-16.569 0-30-13.431-30-30z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left - Modern Healthcare Imagery */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative order-2 lg:order-1"
            >
              <div className="relative w-full h-[600px] rounded-3xl overflow-hidden shadow-2xl">
                {/* Real Hospital/Surgery Room Background Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                  style={{
                    backgroundImage: `url("https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&auto=format&fit=crop&w=2080&q=80")`,
                  }}
                />
                
                {/* Gradient overlay to blend with content */}
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-cyan-500/15 to-blue-500/10" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                
                {/* Modern Hospital Scene Elements */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* Central Medical AI Hub */}
                  <motion.div
                    animate={{
                      scale: [1, 1.02, 1],
                      rotate: [0, 1, 0],
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="relative"
                  >
                    <div className="w-56 h-56 rounded-3xl bg-gradient-to-br from-teal-400 via-cyan-500 to-blue-500 flex items-center justify-center shadow-2xl relative overflow-hidden">
                      {/* Inner glow */}
                      <div className="absolute inset-4 rounded-2xl bg-white/10 backdrop-blur-sm" />
                      <div className="absolute inset-8 rounded-xl bg-white/20 backdrop-blur-sm" />
                      
                      {/* AI Neural Network Pattern */}
                      <div className="relative z-10">
                        <Activity className="w-24 h-24 text-white mb-2" />
                        <div className="text-white text-xs font-semibold text-center">AI POWERED</div>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Medical Equipment Icons */}
                {[
                  { icon: Heart, pos: { top: "10%", left: "10%" }, color: "from-red-500 to-rose-400", label: "Cardiology" },
                  { icon: Shield, pos: { top: "15%", right: "15%" }, color: "from-emerald-500 to-teal-400", label: "Security" },
                  { icon: Activity, pos: { bottom: "20%", left: "15%" }, color: "from-blue-500 to-cyan-400", label: "Monitoring" },
                  { icon: Users, pos: { bottom: "15%", right: "20%" }, color: "from-purple-500 to-violet-400", label: "Patients" },
                  { icon: Pill, pos: { top: "40%", left: "5%" }, color: "from-indigo-500 to-blue-400", label: "Pharmacy" },
                  { icon: MessageSquare, pos: { top: "45%", right: "8%" }, color: "from-teal-500 to-cyan-400", label: "Support" },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="absolute"
                    style={item.pos}
                    animate={{
                      y: [0, -20, 0],
                      rotate: [0, 5, 0],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 5 + index * 0.5,
                      delay: index * 0.4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${item.color} shadow-xl flex flex-col items-center justify-center backdrop-blur-sm group hover:scale-110 transition-transform cursor-pointer`}>
                      <item.icon className="w-8 h-8 text-white mb-1" />
                      <span className="text-xs text-white font-semibold">{item.label}</span>
                    </div>
                  </motion.div>
                ))}

                {/* Animated Connection Lines */}
                <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
                  {[...Array(6)].map((_, i) => (
                    <motion.line
                      key={i}
                      x1={`${20 + i * 15}%`}
                      y1={`${25 + i * 10}%`}
                      x2={`${50}%`}
                      y2="50%"
                      stroke="url(#gradient)"
                      strokeWidth="2"
                      strokeDasharray="5,5"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 0.3 }}
                      transition={{
                        duration: 2,
                        delay: i * 0.3,
                        repeat: Infinity,
                        repeatType: "reverse",
                      }}
                    />
                  ))}
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.8" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Glowing Border Effect */}
                <motion.div
                  className="absolute inset-0 rounded-3xl border-2 border-gradient-to-r from-teal-400/40 via-cyan-400/40 to-blue-400/40"
                  animate={{
                    borderColor: [
                      "rgba(20, 184, 166, 0.4)",
                      "rgba(6, 182, 212, 0.4)",
                      "rgba(59, 130, 246, 0.4)",
                      "rgba(20, 184, 166, 0.4)",
                    ],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              </div>
            </motion.div>

            {/* Right Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="order-1 md:order-2"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="inline-block mb-4"
              >
                <span className="px-6 py-3 rounded-full bg-gradient-to-r from-teal-100 to-cyan-100 text-teal-700 text-sm font-bold border border-teal-200">
                  About Medikos
                </span>
              </motion.div>
              
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="text-4xl md:text-5xl font-bold mt-6 mb-6 leading-tight"
              >
                Bridging Healthcare with <span className="bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent">AI Innovation</span>
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="text-lg text-gray-600 mb-6 leading-relaxed"
              >
                Medikos is revolutionizing healthcare delivery by combining cutting-edge artificial intelligence with
                compassionate care. Our platform seamlessly connects patients, doctors, and healthcare systems.
              </motion.p>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="text-lg text-gray-600 mb-8 leading-relaxed"
              >
                From predictive diagnostics to personalized treatment plans, we're making quality healthcare
                accessible, affordable, and efficient for everyone.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                className="inline-block mb-8 p-6 rounded-2xl bg-gradient-to-r from-teal-50 via-cyan-50 to-blue-50 border-2 border-teal-200/50 shadow-lg backdrop-blur-sm"
              >
                <p className="text-xl font-bold bg-gradient-to-r from-teal-700 via-cyan-700 to-blue-700 bg-clip-text text-transparent">
                  "Blending AI with Ayurveda for a Smarter Healthcare Future"
                </p>
              </motion.div>

              <div className="space-y-5">
                {[
                  { text: "Advanced disease prediction and early detection", icon: Activity },
                  { text: "Secure, privacy-focused health records", icon: Shield },
                  { text: "24/7 multilingual health support", icon: MessageSquare },
                  { text: "Integration of traditional and modern medicine", icon: Leaf },
                ].map((point, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className="flex items-center space-x-4 p-3 rounded-xl bg-white/70 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                      <point.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-gray-800 font-medium">{point.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Analytics Section - Transformed to Impact Metrics */}
      <section id="analytics" className="py-24 bg-gradient-to-br from-gray-50 via-slate-50 to-blue-50 dark:from-gray-900 dark:via-background dark:to-gray-900 relative overflow-hidden">
        {/* Healthcare Background Image */}
        <div className="absolute inset-0 opacity-6">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url("https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")`,
            }}
          />
        </div>
        
        {/* Additional overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50/80 via-slate-50/80 to-blue-50/80 dark:from-gray-900/80 dark:via-background/80 dark:to-gray-900/80" />
        
        {/* Background Effects */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3,
                delay: Math.random() * 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.span 
              className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-100 via-pink-100 to-blue-100 text-purple-700 text-sm font-bold border-2 border-purple-200 shadow-lg backdrop-blur-sm inline-block"
              whileHover={{ scale: 1.05 }}
            >
              📊 Our Growing Impact
            </motion.span>
            <motion.h2 
              className="text-4xl md:text-5xl font-bold mt-8 mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Making a{" "}
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                Real Difference
              </span>
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Join thousands of users who trust Medikos for their comprehensive healthcare needs
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                icon: Users, 
                label: "Active Users", 
                value: "50,000+", 
                color: "from-blue-500 to-cyan-500",
                description: "Growing community"
              },
              { 
                icon: Heart, 
                label: "Health Records", 
                value: "200,000+", 
                color: "from-red-500 to-pink-500",
                description: "Securely stored"
              },
              { 
                icon: Activity, 
                label: "AI Predictions", 
                value: "1M+", 
                color: "from-green-500 to-emerald-500",
                description: "Accurate diagnoses"
              },
              { 
                icon: Clock, 
                label: "Response Time", 
                value: "<1 min", 
                color: "from-purple-500 to-violet-500",
                description: "Lightning fast"
              },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8, y: 30 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -8, scale: 1.05 }}
                className="group"
              >
                <Card className="text-center shadow-xl hover:shadow-2xl border-0 transition-all duration-300 bg-white/80 backdrop-blur-sm overflow-hidden relative">
                  {/* Gradient overlay on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-all duration-300`} />
                  
                  <CardContent className="p-8 relative z-10">
                    <motion.div
                      className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}
                      whileHover={{ rotate: 10, scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <stat.icon className="w-8 h-8 text-white" />
                    </motion.div>
                    
                    <motion.div 
                      className="text-4xl font-bold mb-2 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                    >
                      {stat.value}
                    </motion.div>
                    
                    <div className="text-lg font-semibold text-gray-800 mb-1">{stat.label}</div>
                    <div className="text-sm text-gray-500">{stat.description}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 dark:from-gray-900 dark:via-background dark:to-gray-900 relative overflow-hidden">
        {/* Healthcare Background Image */}
        <div className="absolute inset-0 opacity-8">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url("https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80")`,
            }}
          />
        </div>
        
        {/* Additional overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-50/80 via-cyan-50/80 to-blue-50/80 dark:from-gray-900/80 dark:via-background/80 dark:to-gray-900/80" />
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [1, 1.5, 1],
                rotate: [0, 180, 360],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: 8 + Math.random() * 4,
                delay: Math.random() * 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Star className="w-8 h-8 text-yellow-400" />
            </motion.div>
          ))}
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.span 
              className="px-6 py-3 rounded-full bg-gradient-to-r from-yellow-100 via-orange-100 to-pink-100 text-yellow-700 text-sm font-bold border-2 border-yellow-200 shadow-lg backdrop-blur-sm inline-block"
              whileHover={{ scale: 1.05 }}
            >
              ⭐ User Testimonials
            </motion.span>
            <motion.h2 
              className="text-4xl md:text-5xl font-bold mt-8 mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              What Our{" "}
              <span className="bg-gradient-to-r from-yellow-600 via-orange-600 to-pink-600 bg-clip-text text-transparent">
                Users Say
              </span>
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Real stories from real people who've experienced the Medikos difference in their healthcare journey
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40, rotate: -5 }}
                whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                whileHover={{ y: -12, scale: 1.03, rotate: 1 }}
                className="group"
              >
                <Card className="h-full shadow-xl hover:shadow-2xl border-0 transition-all duration-300 bg-white/90 backdrop-blur-sm overflow-hidden relative">
                  {/* Animated gradient background on hover */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-yellow-100/50 via-orange-100/50 to-pink-100/50 opacity-0 group-hover:opacity-100 transition-all duration-300"
                    animate={{
                      background: [
                        "linear-gradient(135deg, rgba(254, 240, 138, 0.5), rgba(253, 186, 116, 0.5), rgba(251, 207, 232, 0.5))",
                        "linear-gradient(135deg, rgba(251, 207, 232, 0.5), rgba(254, 240, 138, 0.5), rgba(253, 186, 116, 0.5))",
                        "linear-gradient(135deg, rgba(253, 186, 116, 0.5), rgba(251, 207, 232, 0.5), rgba(254, 240, 138, 0.5))",
                      ],
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  />
                  
                  <CardContent className="p-8 relative z-10">
                    <div className="flex items-center mb-6">
                      <motion.div 
                        className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg shadow-lg"
                        whileHover={{ scale: 1.1, rotate: 10 }}
                        transition={{ duration: 0.3 }}
                      >
                        {testimonial.avatar}
                      </motion.div>
                      <div className="ml-4">
                        <div className="font-bold text-lg text-gray-800">{testimonial.name}</div>
                        <div className="text-sm text-gray-600 font-medium">{testimonial.role}</div>
                      </div>
                    </div>
                    
                    <motion.div 
                      className="flex mb-4"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 + 0.5, duration: 0.3 }}
                    >
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ rotate: -180, scale: 0 }}
                          animate={{ rotate: 0, scale: 1 }}
                          transition={{ delay: i * 0.1, duration: 0.3 }}
                        >
                          <Star className="w-5 h-5 fill-yellow-400 text-yellow-400 mr-1" />
                        </motion.div>
                      ))}
                    </motion.div>
                    
                    <p className="text-gray-600 leading-relaxed italic relative">
                      <span className="text-teal-500 text-2xl absolute -top-2 -left-2">"</span>
                      {testimonial.text}
                      <span className="text-teal-500 text-2xl absolute -bottom-2 -right-2">"</span>
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-muted/30 relative overflow-hidden">
        {/* Healthcare Background for Contact Section */}
        <div className="absolute inset-0 opacity-6">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url("https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80")`,
            }}
          />
        </div>
        
        {/* Additional overlay for better text readability */}
        <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Left Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                Get in Touch
              </span>
              <h2 className="text-4xl font-bold mt-6 mb-6">
                Ready to Transform Your <span className="gradient-text">Healthcare?</span>
              </h2>
              <p className="text-muted-foreground mb-8">
                Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </p>

              <Card className="shadow-hover border-0">
                <CardContent className="p-6">
                  <form className="space-y-4">
                    <div>
                      <Input placeholder="Your Name" className="bg-background" />
                    </div>
                    <div>
                      <Input type="email" placeholder="Your Email" className="bg-background" />
                    </div>
                    <div>
                      <Input placeholder="Subject" className="bg-background" />
                    </div>
                    <div>
                      <Textarea placeholder="Your Message" rows={4} className="bg-background" />
                    </div>
                    <Button className="w-full bg-gradient-to-r from-primary to-cyan-500 hover:shadow-glow">
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Right Info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <Card className="shadow-hover border-0">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Email Us</h3>
                      <p className="text-muted-foreground">support@medikos.health</p>
                      <p className="text-muted-foreground">contact@medikos.health</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-hover border-0">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Call Us</h3>
                      <p className="text-muted-foreground">+91 (0253) 223-4567</p>
                      <p className="text-muted-foreground">Mon-Fri: 9AM - 6PM IST</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-hover border-0">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Visit Us</h3>
                      <p className="text-muted-foreground">123 Healthcare Ave</p>
                      <p className="text-muted-foreground">Medical District, Nashik, Maharashtra – 422002</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-hover border-0 bg-gradient-to-br from-primary/10 to-cyan-500/10">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Follow Us</h3>
                  <div className="flex space-x-4">
                    {[Facebook, Twitter, Linkedin, Instagram].map((Icon, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-10 h-10 rounded-lg bg-white hover:bg-gradient-to-br hover:from-primary hover:to-cyan-500 hover:text-white transition-all flex items-center justify-center group"
                      >
                        <Icon className="w-5 h-5 text-muted-foreground group-hover:text-white" />
                      </motion.button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground/5 border-t border-border/50 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Logo & Description */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <img 
                  src="/medikos-logo.png" 
                  alt="Medikos Logo" 
                  className="w-12 h-12 object-contain hover:scale-105 transition-transform duration-200 rounded-lg"
                />
                <span className="text-xl font-bold gradient-text">Medikos</span>
              </div>
              <p className="text-muted-foreground max-w-md mb-4">
                Revolutionizing healthcare with AI-powered solutions. Making quality healthcare accessible, affordable,
                and personalized for everyone.
              </p>
              <Button
                onClick={() => navigate("/")}
                className="bg-gradient-to-r from-primary to-cyan-500 hover:shadow-glow"
              >
                Get Started Today
              </Button>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {["Features", "About", "Testimonials", "Contact"].map((link) => (
                  <li key={link}>
                    <button
                      onClick={() => scrollToSection(link.toLowerCase())}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                {["Privacy Policy", "Terms of Service", "Cookie Policy", "HIPAA Compliance"].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm mb-4 md:mb-0">
              © 2024 Medikos Healthcare Platform. All rights reserved.
            </p>
            <div className="flex items-center space-x-4">
             
              
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
