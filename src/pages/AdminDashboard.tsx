import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopNavbar } from "@/components/layout/TopNavbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  UserCheck,
  Activity,
  Server,
  Search,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  BarChart3,
  Shield,
  Bell,
  Database,
  FileText
} from "lucide-react";

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const systemStats = [
    { label: "Total Users", value: "1,247", icon: Users, color: "text-blue-600", bgColor: "bg-blue-50" },
    { label: "Active Doctors", value: "89", icon: UserCheck, color: "text-teal-600", bgColor: "bg-teal-50" },
    { label: "Active Patients", value: "1,158", icon: Activity, color: "text-purple-600", bgColor: "bg-purple-50" },
    { label: "System Health", value: "98.5%", icon: Server, color: "text-green-600", bgColor: "bg-green-50" },
  ];

  const recentDoctors = [
    { id: 1, name: "Dr. Rajesh Kumar", specialty: "Cardiology", status: "verified", date: "2024-01-18" },
    { id: 2, name: "Dr. Anita Singh", specialty: "Pediatrics", status: "pending", date: "2024-01-17" },
    { id: 3, name: "Dr. Suresh Patel", specialty: "Neurology", status: "verified", date: "2024-01-16" },
  ];

  const platformAnalytics = [
    { feature: "Smart Health Passport", usage: "892 views", trend: "+15%" },
    { feature: "AI Chatbot", usage: "1,234 sessions", trend: "+23%" },
    { feature: "MediVault", usage: "567 uploads", trend: "+8%" },
    { feature: "Natural Remedies", usage: "445 queries", trend: "+12%" },
  ];

  const systemAlerts = [
    { type: "warning", message: "Database backup scheduled in 2 hours", time: "10 min ago" },
    { type: "info", message: "New doctor verification request", time: "25 min ago" },
    { type: "success", message: "System update completed successfully", time: "1 hour ago" },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar userRole="admin" onLogout={handleLogout} isCollapsed={false} onToggle={() => {}} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <TopNavbar userName={user?.name} userRole="admin" onLogout={handleLogout} isSidebarCollapsed={false} />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {/* Hero Section */}
          <section className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-8">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                  <p className="text-white/90 text-lg">System Operations & Platform Management</p>
                </div>
              </div>

              {/* System Stats */}
              <div className="grid grid-cols-4 gap-4 mt-6">
                {systemStats.map((stat, index) => (
                  <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold">{stat.value}</p>
                        <p className="text-white/80 text-sm">{stat.label}</p>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                        <stat.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Main Content Area */}
          <div className="p-8 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Doctor Verification */}
                <Card className="shadow-card">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Doctor Verification Queue</CardTitle>
                      <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          placeholder="Search doctors..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentDoctors.map((doctor) => (
                        <div key={doctor.id} className="p-4 border rounded-lg hover:shadow-md transition-all">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                                <UserCheck className="w-5 h-5 text-orange-600" />
                              </div>
                              <div>
                                <h4 className="font-medium">{doctor.name}</h4>
                                <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-4">
                              <div className="text-right">
                                <p className="text-xs text-muted-foreground">Applied</p>
                                <p className="text-sm font-medium">{doctor.date}</p>
                              </div>
                              <Badge variant={doctor.status === "verified" ? "secondary" : "outline"}>
                                {doctor.status}
                              </Badge>
                              {doctor.status === "pending" && (
                                <div className="flex space-x-2">
                                  <Button variant="default" size="sm">Approve</Button>
                                  <Button variant="outline" size="sm">Review</Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Platform Analytics */}
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <BarChart3 className="w-5 h-5 text-primary" />
                      <span>Feature Usage Analytics</span>
                    </CardTitle>
                    <CardDescription>Platform engagement and feature popularity</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {platformAnalytics.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h4 className="font-medium">{item.feature}</h4>
                            <p className="text-sm text-muted-foreground">{item.usage}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <TrendingUp className="w-4 h-4 text-success" />
                            <span className="text-sm font-medium text-success">{item.trend}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Compliance & Reports */}
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle>Compliance Reports</CardTitle>
                    <CardDescription>System-wide audit logs and compliance tracking</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Button className="w-full justify-start" variant="outline">
                        <FileText className="w-4 h-4 mr-2" />
                        Download Audit Logs
                      </Button>
                      <Button className="w-full justify-start" variant="outline">
                        <Shield className="w-4 h-4 mr-2" />
                        HIPAA Compliance Report
                      </Button>
                      <Button className="w-full justify-start" variant="outline">
                        <Database className="w-4 h-4 mr-2" />
                        Data Access Logs
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* System Alerts */}
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Bell className="w-5 h-5 text-primary" />
                      <span>System Alerts</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {systemAlerts.map((alert, idx) => (
                        <div
                          key={idx}
                          className={`p-3 rounded-lg border-l-4 ${
                            alert.type === "warning" ? "border-l-warning bg-warning/10" :
                            alert.type === "success" ? "border-l-success bg-success/10" :
                            "border-l-blue-600 bg-blue-50"
                          }`}
                        >
                          <div className="flex items-start space-x-2">
                            {alert.type === "warning" && <AlertCircle className="w-4 h-4 text-warning mt-0.5" />}
                            {alert.type === "success" && <CheckCircle className="w-4 h-4 text-success mt-0.5" />}
                            {alert.type === "info" && <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5" />}
                            <div className="flex-1">
                              <p className="text-sm font-medium">{alert.message}</p>
                              <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle>Admin Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button className="w-full justify-start" variant="outline">
                      <Users className="w-4 h-4 mr-2" />
                      Manage Users
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <UserCheck className="w-4 h-4 mr-2" />
                      Verify Doctors
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Server className="w-4 h-4 mr-2" />
                      System Settings
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Bell className="w-4 h-4 mr-2" />
                      Send Announcement
                    </Button>
                  </CardContent>
                </Card>

                {/* Server Status */}
                <Card className="shadow-card border-l-4 border-l-success">
                  <CardHeader>
                    <CardTitle className="text-success flex items-center space-x-2">
                      <Server className="w-5 h-5" />
                      <span>Server Status</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">API Server</span>
                        <Badge className="bg-success text-white">Online</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Database</span>
                        <Badge className="bg-success text-white">Healthy</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Storage</span>
                        <Badge className="bg-success text-white">Active</Badge>
                      </div>
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-xs text-muted-foreground">Last backup: 2 hours ago</p>
                        <p className="text-xs text-muted-foreground">Next backup: in 2 hours</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
