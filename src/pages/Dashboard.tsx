import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  BarChart3,
  PieChart,
  LineChart,
  Users,
  Target,
  Zap,
  CheckCircle,
  AlertCircle,
  Apple,
  Dumbbell,
  Mic
} from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Health Summary Cards Data
  const healthSummaryCards = [
    { 
      title: "Total Reports Uploaded", 
      value: "24", 
      subtitle: "Reports",
      icon: FileText, 
      color: "from-blue-500 to-cyan-500",
      trend: "+3 this week",
      trendDirection: "up"
    },
    { 
      title: "Active Health Conditions", 
      value: "2", 
      subtitle: "Ongoing Issues",
      icon: AlertCircle, 
      color: "from-orange-500 to-red-500",
      trend: "Stable",
      trendDirection: "stable"
    },
    { 
      title: "Medicines in Use", 
      value: "5", 
      subtitle: "Current Medications",
      icon: Pill, 
      color: "from-green-500 to-teal-500",
      trend: "+1 prescribed",
      trendDirection: "up"
    },
    { 
      title: "Personal Notes", 
      value: "3", 
      subtitle: "Notes Added",
      icon: BookOpen, 
      color: "from-purple-500 to-pink-500",
      trend: "2 recent",
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

  // AI Insights Data
  const aiInsights = [
    {
      type: "positive",
      icon: CheckCircle,
      message: "Your sugar readings have stabilized over the last week.",
      color: "from-green-500 to-emerald-500"
    },
    {
      type: "suggestion",
      icon: Sparkles,
      message: "You may want to log new symptoms for better accuracy.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      type: "achievement",
      icon: Target,
      message: "You've viewed 3 new remedies this week — great consistency!",
      color: "from-purple-500 to-pink-500"
    }
  ];

  // Recent Activity Data
  const recentActivity = [
    { 
      action: "Uploaded Lab Report", 
      time: "3 hours ago", 
      icon: FileText,
      color: "bg-blue-500"
    },
    { 
      action: "Checked Natural Remedies", 
      time: "Yesterday", 
      icon: Leaf,
      color: "bg-green-500"
    },
    { 
      action: "Added Note in Health Diary", 
      time: "2 days ago", 
      icon: BookOpen,
      color: "bg-purple-500"
    },
    { 
      action: "Completed Disease Prediction", 
      time: "3 days ago", 
      icon: Brain,
      color: "bg-pink-500"
    },
    { 
      action: "Consulted AI Assistant", 
      time: "4 days ago", 
      icon: MessageCircle,
      color: "bg-indigo-500"
    }
  ];

  // Activity Timeline data
  const activityTimeline = [
    {
      title: "Health Checkup Completed",
      description: "Completed comprehensive health assessment with AI analysis",
      time: "2 hours ago",
      category: "Assessment",
      icon: Heart,
      color: "bg-gradient-to-br from-red-400 to-pink-500",
      metrics: ["Blood Pressure: Normal", "Heart Rate: 72 bpm"]
    },
    {
      title: "Generic Medicine Search",
      description: "Found 3 alternatives for prescribed medication with cost savings",
      time: "5 hours ago", 
      category: "Medicine",
      icon: Pill,
      color: "bg-gradient-to-br from-blue-400 to-blue-600",
      metrics: ["Saved ₹450", "3 alternatives found"]
    },
    {
      title: "Diet Plan Updated",
      description: "AI recommended Mediterranean diet based on your health profile",
      time: "1 day ago",
      category: "Nutrition",
      icon: Apple,
      color: "bg-gradient-to-br from-green-400 to-green-600",
      metrics: ["Protein: 25g", "Fiber: 35g", "Calories: 1800"]
    },
    {
      title: "Symptom Tracking",
      description: "Logged mild headache and fatigue symptoms for analysis",
      time: "2 days ago",
      category: "Symptoms", 
      icon: Activity,
      color: "bg-gradient-to-br from-yellow-400 to-orange-500",
      metrics: ["Severity: 3/10", "Duration: 2 hours"]
    },
    {
      title: "Health Diary Entry",
      description: "Recorded daily wellness metrics and mood tracking",
      time: "3 days ago",
      category: "Wellness",
      icon: BookOpen,
      color: "bg-gradient-to-br from-purple-400 to-purple-600",
      metrics: ["Mood: 7/10", "Energy: 8/10", "Sleep: 7 hours"]
    }
  ];

  // Chart Data (Mock data for visualization)
  const diseaseRiskTrend = [
    { week: "Week 1", risk: 65 },
    { week: "Week 2", risk: 58 },
    { week: "Week 3", risk: 45 },
    { week: "Week 4", risk: 42 }
  ];

  const healthActivityDistribution = [
    { name: "Physical Activity", value: 30, color: "#10B981" },
    { name: "Sleep Tracking", value: 25, color: "#3B82F6" },
    { name: "Diet Monitoring", value: 20, color: "#F59E0B" },
    { name: "Remedies Used", value: 15, color: "#8B5CF6" },
    { name: "Symptom Logging", value: 10, color: "#EF4444" }
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

          {/* 💹 Analytics Overview */}
          <section className="py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
                 style={{ paddingLeft: 'max(1.5rem, calc(50vw - 896px + 1.5rem + 80px))' }}>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">🧠 Health Analytics Panel</h2>
                <p className="text-lg text-gray-600">Comprehensive insights into your health patterns and trends</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Disease Prediction Trends */}
                <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <LineChart className="w-6 h-6 text-blue-600" />
                      Disease Prediction Trends
                    </CardTitle>
                    <CardDescription>Risk assessment over the last 4 weeks</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {diseaseRiskTrend.map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-600">{item.week}</span>
                          <div className="flex-1 mx-4">
                            <div className="w-full bg-gray-100 rounded-full h-3">
                              <div 
                                className="bg-gradient-to-r from-red-400 to-yellow-400 h-3 rounded-full transition-all duration-1000"
                                style={{ width: `${item.risk}%` }}
                              ></div>
                            </div>
                          </div>
                          <span className="text-sm font-bold text-gray-800">{item.risk}%</span>
                        </div>
                      ))}
                      <div className="mt-4 p-3 bg-green-50 rounded-lg">
                        <p className="text-sm text-green-700 font-medium">
                          ✨ Flu risk decreased by 23% this week - Great improvement!
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Health Activity Distribution */}
                <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <PieChart className="w-6 h-6 text-purple-600" />
                      Health Activity Distribution
                    </CardTitle>
                    <CardDescription>Your wellness engagement breakdown</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {healthActivityDistribution.map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-4 h-4 rounded-full" 
                              style={{ backgroundColor: item.color }}
                            ></div>
                            <span className="text-sm font-medium text-gray-600">{item.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-gray-100 rounded-full h-2">
                              <div 
                                className="h-2 rounded-full transition-all duration-1000"
                                style={{ 
                                  width: `${item.value * 3}%`, 
                                  backgroundColor: item.color 
                                }}
                              ></div>
                            </div>
                            <span className="text-sm font-bold text-gray-800 w-8">{item.value}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Diet & Remedy Engagement */}
              <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <BarChart3 className="w-6 h-6 text-green-600" />
                    Diet & Remedy Engagement
                  </CardTitle>
                  <CardDescription>Your interaction with Ayurvedic and diet suggestions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-green-50 rounded-xl">
                      <div className="text-2xl font-bold text-green-600 mb-2">12</div>
                      <div className="text-sm text-green-700">Remedies Viewed</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-xl">
                      <div className="text-2xl font-bold text-blue-600 mb-2">8</div>
                      <div className="text-sm text-blue-700">Diet Plans Applied</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-xl">
                      <div className="text-2xl font-bold text-purple-600 mb-2">5</div>
                      <div className="text-sm text-purple-700">Symptoms Tracked</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
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

          {/* 🧠 AI Insights */}
          <section className="py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
                 style={{ paddingLeft: 'max(1.5rem, calc(50vw - 896px + 1.5rem + 80px))' }}>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">💡 AI Health Insights</h2>
                <p className="text-lg text-gray-600">Personalized health recommendations from our AI assistant</p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* AI Insights Image */}
                <div className="lg:col-span-1">
                  <Card className="h-full border-0 bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden">
                    <CardContent className="p-0 h-full flex flex-col justify-center">
                      <div className="relative h-64 lg:h-full">
                        <img 
                          src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                          alt="AI Health Insights" 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-blue-600/30 to-transparent flex items-end p-6">
                          <div className="text-white">
                            <h3 className="text-xl font-bold mb-2">AI-Powered Health</h3>
                            <p className="text-sm opacity-90">Smart insights for better health decisions</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* AI Insights Cards */}
                <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
                  {aiInsights.map((insight, index) => (
                    <Card 
                      key={index} 
                      className="group hover:shadow-2xl transition-all duration-500 border-0 bg-white/90 backdrop-blur-sm overflow-hidden animate-slide-up"
                      style={{ animationDelay: `${index * 0.2}s` }}
                    >
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${insight.color} flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-300`}>
                            <insight.icon className="w-6 h-6 text-white" />
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {insight.type}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                          AI {insight.type} Insight
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 leading-relaxed mb-4">{insight.message}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                            <span className="text-xs text-gray-500">AI Recommendation</span>
                          </div>
                          <span className="text-xs text-gray-400">Today</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* 📅 Activity Timeline */}
          <section className="py-12 bg-white/50 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
                 style={{ paddingLeft: 'max(1.5rem, calc(50vw - 896px + 1.5rem + 80px))' }}>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">⏰ Recent Activity Timeline</h2>
                <p className="text-lg text-gray-600">Your health journey over the past week</p>
              </div>
              
              <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="space-y-6">
                    {activityTimeline.map((activity, index) => (
                      <div key={index} className="flex items-start gap-4 relative">
                        {/* Timeline line */}
                        {index !== activityTimeline.length - 1 && (
                          <div className="absolute left-6 top-12 w-0.5 h-16 bg-gradient-to-b from-blue-200 to-transparent"></div>
                        )}
                        
                        {/* Activity icon */}
                        <div className={`w-12 h-12 rounded-full ${activity.color} flex items-center justify-center shadow-lg z-10`}>
                          <activity.icon className="w-6 h-6 text-white" />
                        </div>
                        
                        {/* Activity content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold text-gray-800">{activity.title}</h3>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {activity.category}
                              </Badge>
                              <span className="text-sm text-gray-500">{activity.time}</span>
                            </div>
                          </div>
                          <p className="text-gray-600 mb-3">{activity.description}</p>
                          {activity.metrics && (
                            <div className="flex gap-4 text-sm">
                              {activity.metrics.map((metric, metricIndex) => (
                                <div key={metricIndex} className="flex items-center gap-1">
                                  <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                                  <span className="text-gray-600">{metric}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        </main>
    </AppLayout>
  );
};

export default Dashboard;
