import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Video, Phone, Calendar, Clock, Search, Send, Plus, Filter } from "lucide-react";

const Consultations = () => {
  const [activeChat, setActiveChat] = useState(null);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const consultations = [
    {
      id: 1,
      patientName: "Sarah Johnson",
      type: "video",
      status: "scheduled",
      datetime: "2024-01-25 10:00 AM",
      duration: "30 min",
      reason: "Diabetes follow-up",
      lastMessage: "Looking forward to our appointment",
      unreadCount: 2,
      avatar: "SJ"
    },
    {
      id: 2,
      patientName: "Michael Chen",
      type: "chat",
      status: "active",
      datetime: "Now",
      duration: "Ongoing",
      reason: "Blood pressure monitoring",
      lastMessage: "My readings have been normal this week",
      unreadCount: 1,
      avatar: "MC"
    },
    {
      id: 3,
      patientName: "Emily Davis",
      type: "phone",
      status: "completed",
      datetime: "2024-01-20 2:00 PM",
      duration: "25 min",
      reason: "Anxiety management",
      lastMessage: "Thank you for the session",
      unreadCount: 0,
      avatar: "ED"
    }
  ];

  const upcomingAppointments = [
    {
      time: "10:00 AM",
      patient: "Sarah Johnson",
      type: "Video Call",
      reason: "Diabetes follow-up"
    },
    {
      time: "11:30 AM",
      patient: "Robert Wilson",
      type: "Phone Call", 
      reason: "Lab results discussion"
    },
    {
      time: "2:00 PM",
      patient: "Maria Garcia",
      type: "In-Person",
      reason: "Annual checkup"
    }
  ];

  const chatMessages = [
    {
      id: 1,
      sender: "patient",
      message: "Hello Doctor, my blood pressure readings have been consistently normal this week.",
      timestamp: "10:30 AM"
    },
    {
      id: 2,
      sender: "doctor",
      message: "That's excellent news! Keep up the good work with your medication and lifestyle changes.",
      timestamp: "10:32 AM"
    },
    {
      id: 3,
      sender: "patient",
      message: "Should I continue with the same dosage?",
      timestamp: "10:35 AM"
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "scheduled": return "bg-blue-100 text-blue-800";
      case "active": return "bg-green-100 text-green-800";
      case "completed": return "bg-gray-100 text-gray-800";
      case "missed": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "video": return <Video className="w-4 h-4" />;
      case "phone": return <Phone className="w-4 h-4" />;
      case "chat": return <MessageCircle className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  const filteredConsultations = consultations.filter(consultation =>
    consultation.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    consultation.reason.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (activeChat) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={() => setActiveChat(null)}>
            ← Back to Consultations
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-semibold">
              {activeChat.avatar}
            </div>
            <div>
              <h2 className="text-xl font-bold">{activeChat.patientName}</h2>
              <p className="text-sm text-gray-600">{activeChat.reason}</p>
            </div>
          </div>
          <div className="ml-auto flex gap-2">
            <Button size="sm" variant="outline">
              <Phone className="w-4 h-4 mr-2" />
              Call
            </Button>
            <Button size="sm" variant="outline">
              <Video className="w-4 h-4 mr-2" />
              Video
            </Button>
          </div>
        </div>

        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm h-96">
          <CardContent className="p-0 h-full flex flex-col">
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'doctor' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      msg.sender === 'doctor'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <p className="text-sm">{msg.message}</p>
                    <p className={`text-xs mt-1 ${
                      msg.sender === 'doctor' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {msg.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t p-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && message.trim() && setMessage("")}
                  className="flex-1"
                />
                <Button 
                  onClick={() => message.trim() && setMessage("")}
                  disabled={!message.trim()}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
         style={{ paddingLeft: 'max(1.5rem, calc(50vw - 896px + 1.5rem + 80px))' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Consultations & Communication</h2>
        <Button className="bg-gradient-to-r from-blue-500 to-cyan-500">
          <Plus className="w-4 h-4 mr-2" />
          New Consultation
        </Button>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-6">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search consultations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredConsultations.filter(c => c.status === 'active').map((consultation, index) => (
              <motion.div
                key={consultation.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4, scale: 1.02 }}
              >
                <Card className="border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white/70 backdrop-blur-sm cursor-pointer"
                      onClick={() => setActiveChat(consultation)}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-semibold">
                          {consultation.avatar}
                        </div>
                        <div>
                          <h3 className="font-semibold">{consultation.patientName}</h3>
                          <p className="text-sm text-gray-600">{consultation.reason}</p>
                        </div>
                      </div>
                      {consultation.unreadCount > 0 && (
                        <Badge className="bg-red-500 text-white">
                          {consultation.unreadCount}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(consultation.type)}
                        <span className="text-sm capitalize">{consultation.type}</span>
                      </div>
                      <Badge className={getStatusColor(consultation.status)}>
                        {consultation.status}
                      </Badge>
                    </div>

                    <p className="text-sm text-gray-600 mb-3">{consultation.lastMessage}</p>

                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>{consultation.datetime}</span>
                      <span>{consultation.duration}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredConsultations.filter(c => c.status === 'scheduled').map((consultation, index) => (
              <motion.div
                key={consultation.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-semibold">
                        {consultation.avatar}
                      </div>
                      <div>
                        <h3 className="font-semibold">{consultation.patientName}</h3>
                        <p className="text-sm text-gray-600">{consultation.reason}</p>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Type</span>
                        <div className="flex items-center gap-1">
                          {getTypeIcon(consultation.type)}
                          <span className="text-sm capitalize">{consultation.type}</span>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Date & Time</span>
                        <span className="text-sm font-medium">{consultation.datetime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Duration</span>
                        <span className="text-sm">{consultation.duration}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1">Join</Button>
                      <Button size="sm" variant="outline">Reschedule</Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="space-y-6">
          <div className="space-y-4">
            {filteredConsultations.filter(c => c.status === 'completed').map((consultation, index) => (
              <motion.div
                key={consultation.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-gray-400 to-gray-500 flex items-center justify-center text-white font-semibold">
                          {consultation.avatar}
                        </div>
                        <div>
                          <h3 className="font-semibold">{consultation.patientName}</h3>
                          <p className="text-sm text-gray-600">{consultation.reason}</p>
                          <p className="text-xs text-gray-500">{consultation.datetime} • {consultation.duration}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getTypeIcon(consultation.type)}
                        <Badge className={getStatusColor(consultation.status)}>
                          {consultation.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button size="sm" variant="outline">View Notes</Button>
                      <Button size="sm" variant="outline">Schedule Follow-up</Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-6">
          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-500" />
                Today's Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingAppointments.map((appointment, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="text-center">
                      <Clock className="w-5 h-5 text-gray-500 mx-auto mb-1" />
                      <p className="text-sm font-medium">{appointment.time}</p>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{appointment.patient}</h4>
                      <p className="text-sm text-gray-600">{appointment.reason}</p>
                    </div>
                    <Badge variant="outline">{appointment.type}</Badge>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
    </div>
  );
};

export default Consultations;