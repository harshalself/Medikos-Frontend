import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3, LineChart, PieChart, TrendingUp, Download, Filter, Calendar } from "lucide-react";

const Analytics = () => {
  const [timeRange, setTimeRange] = useState("month");
  const [selectedMetric, setSelectedMetric] = useState("patients");

  const analyticsData = {
    patients: {
      total: 156,
      growth: 12,
      trend: "up",
      chartData: [
        { month: "Jan", value: 120 },
        { month: "Feb", value: 135 },
        { month: "Mar", value: 145 },
        { month: "Apr", value: 156 }
      ]
    },
    consultations: {
      total: 89,
      growth: 8,
      trend: "up",
      chartData: [
        { month: "Jan", value: 65 },
        { month: "Feb", value: 73 },
        { month: "Mar", value: 81 },
        { month: "Apr", value: 89 }
      ]
    },
    revenue: {
      total: 45200,
      growth: 15,
      trend: "up",
      chartData: [
        { month: "Jan", value: 35000 },
        { month: "Feb", value: 39000 },
        { month: "Mar", value: 42000 },
        { month: "Apr", value: 45200 }
      ]
    }
  };

  const diseaseDistribution = [
    { disease: "Diabetes", count: 45, percentage: 28.8, color: "bg-blue-500" },
    { disease: "Hypertension", count: 38, percentage: 24.4, color: "bg-green-500" },
    { disease: "Heart Disease", count: 25, percentage: 16.0, color: "bg-red-500" },
    { disease: "Anxiety", count: 20, percentage: 12.8, color: "bg-purple-500" },
    { disease: "Other", count: 28, percentage: 17.9, color: "bg-gray-500" }
  ];

  const treatmentOutcomes = [
    { outcome: "Fully Recovered", count: 87, percentage: 55.8, color: "bg-green-500" },
    { outcome: "Improved", count: 45, percentage: 28.8, color: "bg-blue-500" },
    { outcome: "Stable", count: 18, percentage: 11.5, color: "bg-yellow-500" },
    { outcome: "No Change", count: 6, percentage: 3.8, color: "bg-gray-500" }
  ];

  const ageGroupData = [
    { group: "18-30", male: 15, female: 18 },
    { group: "31-45", male: 25, female: 22 },
    { group: "46-60", male: 28, female: 32 },
    { group: "60+", male: 20, female: 16 }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
         style={{ paddingLeft: 'max(1.5rem, calc(50vw - 896px + 1.5rem + 80px))' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Analytics & Reports</h2>
        <div className="flex gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="patients">Patient Analytics</TabsTrigger>
          <TabsTrigger value="treatments">Treatment Outcomes</TabsTrigger>
          <TabsTrigger value="revenue">Financial</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(analyticsData).map(([key, data], index) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-medium text-gray-600 capitalize">{key}</h3>
                      <TrendingUp className={`w-5 h-5 ${data.trend === 'up' ? 'text-green-500' : 'text-red-500'}`} />
                    </div>
                    <div className="space-y-2">
                      <p className="text-3xl font-bold">
                        {key === 'revenue' ? `$${data.total.toLocaleString()}` : data.total}
                      </p>
                      <p className="text-sm text-green-600">
                        +{data.growth}{key === 'revenue' ? '%' : ''} from last {timeRange}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-500" />
                  Patient Growth Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end justify-between gap-2">
                  {analyticsData.patients.chartData.map((item, index) => (
                    <motion.div
                      key={item.month}
                      initial={{ height: 0 }}
                      animate={{ height: `${(item.value / 156) * 100}%` }}
                      transition={{ delay: index * 0.2, duration: 0.5 }}
                      className="bg-gradient-to-t from-blue-500 to-cyan-500 rounded-t-lg flex-1 relative group"
                    >
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        {item.value}
                      </div>
                      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-600">
                        {item.month}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-purple-500" />
                  Disease Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {diseaseDistribution.map((item, index) => (
                    <motion.div
                      key={item.disease}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <div className={`w-4 h-4 rounded ${item.color}`}></div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">{item.disease}</span>
                          <span className="text-sm text-gray-600">{item.percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${item.percentage}%` }}
                            transition={{ delay: index * 0.2, duration: 0.5 }}
                            className={`h-2 rounded-full ${item.color}`}
                          ></motion.div>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">{item.count}</span>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="patients" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Age Group Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {ageGroupData.map((group, index) => (
                    <motion.div
                      key={group.group}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="space-y-2"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{group.group}</span>
                        <span className="text-sm text-gray-600">{group.male + group.female} total</span>
                      </div>
                      <div className="flex gap-1">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(group.male / (group.male + group.female)) * 100}%` }}
                          transition={{ delay: index * 0.2, duration: 0.5 }}
                          className="bg-blue-500 h-4 rounded-l"
                        ></motion.div>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(group.female / (group.male + group.female)) * 100}%` }}
                          transition={{ delay: index * 0.2, duration: 0.5 }}
                          className="bg-pink-500 h-4 rounded-r"
                        ></motion.div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Male: {group.male}</span>
                        <span>Female: {group.female}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-6 flex gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                    <span>Male</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-pink-500 rounded"></div>
                    <span>Female</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Patient Engagement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center">
                    <p className="text-4xl font-bold text-blue-600">87%</p>
                    <p className="text-sm text-gray-600">Active Patients</p>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Daily Check-ins</span>
                      <span className="text-sm font-medium text-green-600">↗ +5%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Appointment Attendance</span>
                      <span className="text-sm font-medium text-green-600">94%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Treatment Compliance</span>
                      <span className="text-sm font-medium text-blue-600">91%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="treatments" className="space-y-6">
          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                Treatment Outcomes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  {treatmentOutcomes.map((outcome, index) => (
                    <motion.div
                      key={outcome.outcome}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <div className={`w-4 h-4 rounded ${outcome.color}`}></div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">{outcome.outcome}</span>
                          <span className="text-sm text-gray-600">{outcome.percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${outcome.percentage}%` }}
                            transition={{ delay: index * 0.2, duration: 0.5 }}
                            className={`h-2 rounded-full ${outcome.color}`}
                          ></motion.div>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">{outcome.count}</span>
                    </motion.div>
                  ))}
                </div>
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-6xl font-bold text-green-600">94%</p>
                    <p className="text-lg text-gray-600 mt-2">Success Rate</p>
                    <p className="text-sm text-gray-500">Overall treatment effectiveness</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">$45,200</div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-xs text-green-600 mt-1">+15% from last month</p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">$508</div>
                <p className="text-sm text-gray-600">Average per Patient</p>
                <p className="text-xs text-blue-600 mt-1">+8% from last month</p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">89</div>
                <p className="text-sm text-gray-600">Consultations</p>
                <p className="text-xs text-purple-600 mt-1">+12 this month</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Generate Custom Report</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Report Type</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="patient-summary">Patient Summary</SelectItem>
                      <SelectItem value="treatment-outcomes">Treatment Outcomes</SelectItem>
                      <SelectItem value="financial">Financial Report</SelectItem>
                      <SelectItem value="performance">Performance Metrics</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date Range</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select date range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="week">Last Week</SelectItem>
                      <SelectItem value="month">Last Month</SelectItem>
                      <SelectItem value="quarter">Last Quarter</SelectItem>
                      <SelectItem value="year">Last Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full">Generate Report</Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Recent Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: "Monthly Patient Summary", date: "2024-01-01", type: "PDF" },
                    { name: "Q4 Financial Report", date: "2023-12-31", type: "Excel" },
                    { name: "Treatment Outcomes", date: "2024-01-15", type: "PDF" }
                  ].map((report, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-sm">{report.name}</p>
                        <p className="text-xs text-gray-500">{report.date}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                          {report.type}
                        </span>
                        <Button size="sm" variant="outline">
                          <Download className="w-3 h-3" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
    </div>
  );
};

export default Analytics;