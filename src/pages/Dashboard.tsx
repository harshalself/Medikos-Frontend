import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useHealthDiary } from "@/hooks/use-health-diary";
import { useMediVault } from "@/hooks/use-medi-vault";
import { 
  Shield, 
  Pill, 
  MessageCircle, 
  Activity, 
  FileText, 
  Leaf,
  Heart,
  TrendingUp,
  Calendar,
  Stethoscope,
  Upload,
  Plus,
  Brain,
  BookOpen,
  Clock,
  Sparkles,
  Users,
  Target,
  Zap,
  AlertCircle,
  Mic
} from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { fetchEntries, totalCount, entries } = useHealthDiary();
  const { fetchDocuments, documents } = useMediVault();
  const [isLoading, setIsLoading] = useState(true);

  // Fetch real data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          fetchEntries({ limit: 10 }),
          fetchDocuments()
        ]);
      } catch (error) {
        console.error('Dashboard load error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Real data stats
  const totalDocuments = documents.length;
  const totalDiaryEntries = totalCount;

  // Health Summary Cards Data - Using Real Data
  const healthSummaryCards = [
    { 
      title: "Medical Documents", 
      value: isLoading ? "..." : totalDocuments.toString(), 
      subtitle: "Uploaded Files",
      icon: FileText, 
      color: "from-blue-500 to-cyan-500",
      trend: totalDocuments > 0 ? `${totalDocuments} uploaded` : "Upload your first document",
      trendDirection: totalDocuments > 0 ? "up" : "stable"
    },
    { 
      title: "Health Diary", 
      value: isLoading ? "..." : totalDiaryEntries.toString(), 
      subtitle: "Total Entries",
      icon: BookOpen, 
      color: "from-purple-500 to-pink-500",
      trend: totalDiaryEntries > 0 ? `${entries.slice(0, 5).length} recent` : "Start tracking",
      trendDirection: totalDiaryEntries > 0 ? "up" : "stable"
    },
    { 
      title: "Health Passport", 
      value: "1", 
      subtitle: "Active Profile",
      icon: Shield, 
      color: "from-green-500 to-teal-500",
      trend: "Completed",
      trendDirection: "stable"
    },
    { 
      title: "AI Features", 
      value: "5", 
      subtitle: "Available Tools",
      icon: Brain, 
      color: "from-orange-500 to-red-500",
      trend: "Ready to explore",
      trendDirection: "up"
    },
  ];

  // Quick Actions Data - All main features with scrollable design
  const quickActions = [
    { title: "Smart Health Passport", icon: Shield, path: "/passport", color: "from-blue-500 to-cyan-500" },
    { title: "Generic Medicine Suggester", icon: Pill, path: "/generic-medicine", color: "from-green-500 to-emerald-500" },
    { title: "AI Chatbot", icon: MessageCircle, path: "/chatbot", color: "from-purple-500 to-blue-500" },
    { title: "AI Voice Call Agent", icon: Mic, path: "/voice-agent", color: "from-rose-500 to-pink-500" },
    { title: "Infectious Disease Prediction", icon: Brain, path: "/infectious-disease-prediction", color: "from-red-500 to-orange-500" },
    { title: "Natural Remedies & Diet", icon: Leaf, path: "/remedies", color: "from-green-500 to-teal-500" },
    { title: "MediVault", icon: FileText, path: "/medivault", color: "from-indigo-500 to-blue-500" },
    { title: "Health Diary", icon: BookOpen, path: "/health-diary", color: "from-orange-500 to-yellow-500" },
  ];

  const lastLoginTime = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <AppLayout>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {/* 🧍‍♂️ Welcome Banner Section */}
          <section 
            className="relative py-16 overflow-hidden"
            style={{
              background: `linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(20, 184, 166, 0.15) 50%, rgba(147, 51, 234, 0.15) 100%), 
                          url('https://images.unsplash.com/photo-1551601651-2a8555f1a136?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundBlendMode: 'overlay'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-teal-800/60 via-blue-800/50 to-purple-800/60 backdrop-blur-sm"></div>
            
            {/* Healthcare pattern overlay */}
            <div className="absolute inset-0 opacity-10" 
                 style={{
                   backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3Cpath d='M28 28h4v4h-4z'/%3E%3Ccircle cx='10' cy='10' r='1'/%3E%3Ccircle cx='50' cy='50' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                 }} />
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ml-auto"
                 style={{ paddingLeft: 'max(2rem, calc(50vw - 896px + 2rem))' }}>
              <div className="text-center">
                {/* Floating Medikos Logo */}
                <div className="inline-flex items-center justify-center w-24 h-24 mb-6 animate-float relative z-10">
                  <img 
                    src="/medikos-logo.png" 
                    alt="Medikos Logo" 
                    className="w-full h-full object-contain drop-shadow-2xl rounded-3xl"
                  />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in text-white" 
                    style={{
                      textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8), -1px -1px 2px rgba(0, 0, 0, 0.5), 1px -1px 2px rgba(0, 0, 0, 0.5), -1px 1px 2px rgba(0, 0, 0, 0.5)',
                      WebkitTextStroke: '1px rgba(0, 0, 0, 0.3)',
                      paddingBottom: '4px',
                      lineHeight: '1.2'
                    }}>
                  Welcome Back, {user?.name || 'Patient'}!
                </h1>
                <p className="text-xl text-white mb-6 animate-slide-up" 
                   style={{
                     textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8), -1px -1px 2px rgba(0, 0, 0, 0.5), 1px -1px 2px rgba(0, 0, 0, 0.5), -1px 1px 2px rgba(0, 0, 0, 0.5)',
                     WebkitTextStroke: '0.5px rgba(0, 0, 0, 0.3)'
                   }}>
                  Your personalized health summary at a glance
                </p>
                <div className="inline-flex items-center text-white/80 text-sm bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                  <Clock className="w-4 h-4 mr-2" />
                  Last login: {lastLoginTime}
                </div>
              </div>
            </div>
          </section>

          {/* 📊 Health Summary Cards */}
          <section className="py-12 -mt-8 relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
                 style={{ paddingLeft: 'max(1.5rem, calc(50vw - 896px + 1.5rem + 80px))' }}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {healthSummaryCards.map((card, index) => (
                  <Card 
                    key={index} 
                    className="group hover:shadow-2xl transition-all duration-500 cursor-pointer border-0 bg-white/90 backdrop-blur-sm hover:scale-105 animate-slide-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-300`}>
                          <card.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          card.trendDirection === 'up' ? 'bg-green-100 text-green-700' :
                          card.trendDirection === 'down' ? 'bg-red-100 text-red-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {card.trend}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-2xl font-bold text-gray-800">{card.value}</h3>
                        <p className="text-sm font-medium text-gray-600">{card.subtitle}</p>
                        <p className="text-xs text-gray-500">{card.title}</p>
                      </div>
                      {/* Mini trend bar */}
                      <div className="mt-4 w-full bg-gray-100 rounded-full h-2">
                        <div 
                          className={`bg-gradient-to-r ${card.color} h-2 rounded-full transition-all duration-1000 ease-out`}
                          style={{ width: `${Math.min(parseInt(card.value) * 10, 100)}%` }}
                        ></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* 🩺 Quick Actions - Scrollable like Landing Page */}
          <section className="py-12 bg-white/50 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
                 style={{ paddingLeft: 'max(1.5rem, calc(50vw - 896px + 1.5rem + 80px))' }}>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">🩻 Quick Actions</h2>
                <p className="text-lg text-gray-600">Fast access to all your healthcare features</p>
              </div>
              
              {/* Scrollable Container */}
              <div className="relative">
                <div className="flex overflow-x-auto scrollbar-hide gap-6 pb-4">
                  {quickActions.map((action, index) => (
                    <Card
                      key={index}
                      className="flex-shrink-0 w-64 group hover:shadow-hover transition-all duration-300 cursor-pointer border-0 overflow-hidden"
                      onClick={() => navigate(action.path)}
                    >
                      <CardHeader className="pb-4">
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                          <action.icon className="w-8 h-8 text-white" />
                        </div>
                        <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
                          {action.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-sm leading-relaxed">
                          Experience {action.title.toLowerCase()} with AI-powered assistance
                        </CardDescription>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                {/* Scroll indicators */}
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gradient-to-l from-white/50 to-transparent w-12 h-full pointer-events-none" />
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-white/50 to-transparent w-12 h-full pointer-events-none" />
              </div>
            </div>
          </section>

        </main>
    </AppLayout>
  );
};

export default Dashboard;
