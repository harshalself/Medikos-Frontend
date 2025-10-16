import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Users, Calendar, FileText, TrendingUp, PieChart, BarChart3, LineChart } from "lucide-react";

const DashboardOverview = () => {
  const stats = [
    { title: "Total Patients", value: "156", change: "+12 this month", icon: Users, color: "from-blue-500 to-cyan-500" },
    { title: "Active Consultations", value: "8", change: "3 pending", icon: Calendar, color: "from-green-500 to-emerald-500" },
    { title: "Reports Pending", value: "24", change: "5 urgent", icon: FileText, color: "from-orange-500 to-red-500" },
    { title: "Success Rate", value: "94%", change: "+2% this month", icon: TrendingUp, color: "from-purple-500 to-violet-500" }
  ];

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 mb-6 shadow-xl animate-float">
            <TrendingUp className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Doctor Dashboard</h1>
          <p className="text-gray-600">Comprehensive patient care and analytics overview</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4, scale: 1.02 }}
          >
            <Card className="border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white/70 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                      {stat.value}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
                  </div>
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} shadow-lg`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-blue-500" />
              Common Diseases
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Diabetes</span>
                <span className="text-sm font-medium">35%</span>
              </div>
              <Progress value={35} className="h-2" />
              <div className="flex justify-between items-center">
                <span className="text-sm">Hypertension</span>
                <span className="text-sm font-medium">28%</span>
              </div>
              <Progress value={28} className="h-2" />
              <div className="flex justify-between items-center">
                <span className="text-sm">Heart Disease</span>
                <span className="text-sm font-medium">22%</span>
              </div>
              <Progress value={22} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-green-500" />
              Treatment Success
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-4xl font-bold text-green-600">94%</p>
                <p className="text-sm text-gray-600">Overall Success Rate</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>This Month</span>
                  <span className="font-medium text-green-600">96%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Last Month</span>
                  <span className="font-medium">92%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="w-5 h-5 text-purple-500" />
              Patient Engagement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-4xl font-bold text-purple-600">87%</p>
                <p className="text-sm text-gray-600">Active Patients</p>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Daily Check-ins</span>
                <span className="text-green-600 font-medium">↗ +5%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardOverview;