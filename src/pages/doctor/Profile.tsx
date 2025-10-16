import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, Settings, Bell, Shield, Calendar, Clock, MapPin, Phone, Mail, Award, Stethoscope } from "lucide-react";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [doctorData, setDoctorData] = useState({
    name: "Dr. Sarah Wilson",
    specialization: "Internal Medicine",
    email: "sarah.wilson@medikos.com",
    phone: "+1 (555) 123-4567",
    address: "123 Medical Center Drive, Health City, HC 12345",
    license: "MD123456789",
    experience: "12 years",
    education: "Harvard Medical School",
    certifications: ["Board Certified Internal Medicine", "Advanced Cardiac Life Support", "Clinical Research"],
    bio: "Experienced internal medicine physician with a passion for patient care and medical research. Specialized in preventive medicine and chronic disease management."
  });

  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    appointments: true,
    emergencies: true,
    reports: false
  });

  const [preferences, setPreferences] = useState({
    theme: "light",
    language: "English",
    timezone: "EST",
    defaultView: "dashboard",
    autoSave: true
  });

  const stats = [
    { label: "Total Patients", value: "156", icon: User, color: "text-blue-600" },
    { label: "Years Experience", value: "12", icon: Award, color: "text-green-600" },
    { label: "Success Rate", value: "94%", icon: Stethoscope, color: "text-purple-600" },
    { label: "Consultations", value: "1,250+", icon: Calendar, color: "text-orange-600" }
  ];

  const recentActivity = [
    { action: "Completed consultation with Sarah Johnson", time: "2 hours ago", type: "consultation" },
    { action: "Updated treatment plan for Michael Chen", time: "4 hours ago", type: "treatment" },
    { action: "Reviewed lab results for Emily Davis", time: "6 hours ago", type: "review" },
    { action: "Scheduled follow-up appointment", time: "1 day ago", type: "appointment" }
  ];

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save to backend
  };

  const handleNotificationChange = (key, value) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Profile & Settings</h2>
        <Button
          onClick={() => setIsEditing(!isEditing)}
          variant={isEditing ? "outline" : "default"}
        >
          {isEditing ? "Cancel" : "Edit Profile"}
        </Button>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Info */}
            <Card className="lg:col-span-2 border-0 shadow-lg bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-500" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src="/placeholder-doctor.jpg" alt="Doctor" />
                    <AvatarFallback className="text-2xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                      SW
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    {isEditing ? (
                      <Input
                        value={doctorData.name}
                        onChange={(e) => setDoctorData(prev => ({ ...prev, name: e.target.value }))}
                        className="text-2xl font-bold mb-2"
                      />
                    ) : (
                      <h3 className="text-2xl font-bold">{doctorData.name}</h3>
                    )}
                    <p className="text-gray-600">{doctorData.specialization}</p>
                    <div className="flex gap-2 mt-2">
                      <Badge className="bg-blue-100 text-blue-800">
                        License: {doctorData.license}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email
                      </label>
                      {isEditing ? (
                        <Input
                          value={doctorData.email}
                          onChange={(e) => setDoctorData(prev => ({ ...prev, email: e.target.value }))}
                          className="mt-1"
                        />
                      ) : (
                        <p className="mt-1">{doctorData.email}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Phone
                      </label>
                      {isEditing ? (
                        <Input
                          value={doctorData.phone}
                          onChange={(e) => setDoctorData(prev => ({ ...prev, phone: e.target.value }))}
                          className="mt-1"
                        />
                      ) : (
                        <p className="mt-1">{doctorData.phone}</p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Award className="w-4 h-4" />
                        Experience
                      </label>
                      <p className="mt-1">{doctorData.experience}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Education</label>
                      <p className="mt-1">{doctorData.education}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Address
                  </label>
                  {isEditing ? (
                    <Textarea
                      value={doctorData.address}
                      onChange={(e) => setDoctorData(prev => ({ ...prev, address: e.target.value }))}
                      className="mt-1"
                    />
                  ) : (
                    <p className="mt-1">{doctorData.address}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Bio</label>
                  {isEditing ? (
                    <Textarea
                      value={doctorData.bio}
                      onChange={(e) => setDoctorData(prev => ({ ...prev, bio: e.target.value }))}
                      className="mt-1"
                      rows={3}
                    />
                  ) : (
                    <p className="mt-1 text-gray-600">{doctorData.bio}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Certifications</label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {doctorData.certifications.map((cert, index) => (
                      <Badge key={index} variant="outline" className="bg-green-50 text-green-700">
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>

                {isEditing && (
                  <div className="flex gap-3 pt-4">
                    <Button onClick={handleSave} className="bg-gradient-to-r from-blue-500 to-cyan-500">
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Professional Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="p-2 rounded-lg bg-gray-100">
                      <stat.icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-sm text-gray-600">{stat.label}</p>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-gray-500" />
                Application Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Dark Mode</label>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Auto Save</label>
                    <Switch checked={preferences.autoSave} />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Two-Factor Authentication</label>
                    <Switch />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Default Language</label>
                    <Input value={preferences.language} className="mt-1" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Timezone</label>
                    <Input value={preferences.timezone} className="mt-1" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Default Dashboard View</label>
                    <Input value={preferences.defaultView} className="mt-1" />
                  </div>
                </div>
              </div>
              <Button className="w-full md:w-auto">Save Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-yellow-500" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Email Notifications</label>
                    <p className="text-xs text-gray-500">Receive notifications via email</p>
                  </div>
                  <Switch
                    checked={notifications.email}
                    onCheckedChange={(value) => handleNotificationChange('email', value)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">SMS Notifications</label>
                    <p className="text-xs text-gray-500">Receive notifications via SMS</p>
                  </div>
                  <Switch
                    checked={notifications.sms}
                    onCheckedChange={(value) => handleNotificationChange('sms', value)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Push Notifications</label>
                    <p className="text-xs text-gray-500">Receive push notifications in browser</p>
                  </div>
                  <Switch
                    checked={notifications.push}
                    onCheckedChange={(value) => handleNotificationChange('push', value)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Appointment Reminders</label>
                    <p className="text-xs text-gray-500">Get reminders for upcoming appointments</p>
                  </div>
                  <Switch
                    checked={notifications.appointments}
                    onCheckedChange={(value) => handleNotificationChange('appointments', value)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Emergency Alerts</label>
                    <p className="text-xs text-gray-500">Receive emergency patient alerts</p>
                  </div>
                  <Switch
                    checked={notifications.emergencies}
                    onCheckedChange={(value) => handleNotificationChange('emergencies', value)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Report Notifications</label>
                    <p className="text-xs text-gray-500">Get notified when reports are ready</p>
                  </div>
                  <Switch
                    checked={notifications.reports}
                    onCheckedChange={(value) => handleNotificationChange('reports', value)}
                  />
                </div>
              </div>
              <Button className="w-full md:w-auto">Save Notification Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-green-500" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className={`w-3 h-3 rounded-full ${
                      activity.type === 'consultation' ? 'bg-blue-500' :
                      activity.type === 'treatment' ? 'bg-green-500' :
                      activity.type === 'review' ? 'bg-purple-500' :
                      'bg-orange-500'
                    }`}></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default Profile;