import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Eye, MessageCircle, Phone, Video, Calendar, Shield, CheckCircle, XCircle } from "lucide-react";

const MyPatients = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const patients = [
    {
      id: 1,
      name: "Sarah Johnson",
      age: 34,
      condition: "Diabetes Type 2",
      lastVisit: "2024-01-15",
      nextAppointment: "2024-01-25",
      status: "stable",
      risk: "low",
      avatar: "SJ",
      hasConsent: true
    },
    {
      id: 2,
      name: "Michael Chen",
      age: 45,
      condition: "Hypertension",
      lastVisit: "2024-01-10",
      nextAppointment: "2024-01-22",
      status: "monitoring",
      risk: "medium",
      avatar: "MC",
      hasConsent: true
    },
    {
      id: 3,
      name: "Emily Davis",
      age: 28,
      condition: "Anxiety Disorder",
      lastVisit: "2024-01-18",
      nextAppointment: "2024-01-30",
      status: "improving",
      risk: "low",
      avatar: "ED",
      hasConsent: false
    },
    {
      id: 4,
      name: "Robert Wilson",
      age: 52,
      condition: "Heart Disease",
      lastVisit: "2024-01-12",
      nextAppointment: "2024-01-28",
      status: "stable",
      risk: "medium",
      avatar: "RW",
      hasConsent: true
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "stable": return "bg-green-100 text-green-800";
      case "monitoring": return "bg-yellow-100 text-yellow-800";
      case "improving": return "bg-blue-100 text-blue-800";
      case "critical": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case "low": return "text-green-600";
      case "medium": return "text-yellow-600";
      case "high": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.condition.toLowerCase().includes(searchTerm.toLowerCase())
  );



  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <h2 className="text-2xl font-bold">My Patients</h2>
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search patients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredPatients.map((patient, index) => (
          <motion.div
            key={patient.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4, scale: 1.02 }}
          >
            <Card className="border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white/70 backdrop-blur-sm cursor-pointer"
                  onClick={() => navigate(`/doctor/patients/${patient.id}`)}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-semibold">
                    {patient.avatar}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{patient.name}</h3>
                    <p className="text-sm text-gray-600">Age {patient.age}</p>
                  </div>
                  <Eye className="w-5 h-5 text-gray-400" />
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Primary Condition</p>
                    <p className="font-medium">{patient.condition}</p>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <Badge className={getStatusColor(patient.status)}>{patient.status}</Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Risk Level</p>
                      <p className={`font-semibold ${getRiskColor(patient.risk)}`}>{patient.risk}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Next Appointment</p>
                    <p className="font-medium">{patient.nextAppointment}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Data Access</p>
                      <Badge className={`${patient.hasConsent ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} flex items-center gap-1`}>
                        {patient.hasConsent ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {patient.hasConsent ? 'Granted' : 'Pending'}
                      </Badge>
                    </div>
                    <Shield className={`w-4 h-4 ${patient.hasConsent ? 'text-green-500' : 'text-red-500'}`} />
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button size="sm" variant="outline" className="flex-1">
                      <MessageCircle className="w-4 h-4 mr-1" />
                      Chat
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Calendar className="w-4 h-4 mr-1" />
                      Schedule
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default MyPatients;