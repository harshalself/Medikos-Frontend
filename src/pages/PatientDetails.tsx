import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AppLayout } from '@/components/layout/AppLayout';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  ArrowLeft, 
  Shield, 
  CheckCircle, 
  XCircle, 
  Clock, 
  FileText, 
  Heart, 
  BookOpen, 
  Brain, 
  Folder,
  AlertTriangle,
  Eye,
  MessageCircle,
  Phone,
  Video,
  Calendar
} from "lucide-react";

const PatientDetails = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  // Mock patient data with consent information
  const patient = {
    id: patientId,
    name: "Sarah Johnson",
    age: 34,
    gender: "Female",
    bloodGroup: "O+",
    phone: "+1 (555) 123-4567",
    email: "sarah.johnson@email.com",
    avatar: "SJ",
    lastVisit: "2024-01-15",
    nextAppointment: "2024-01-25",
    primaryCondition: "Diabetes Type 2",
    riskLevel: "low",
    consentStatus: {
      healthPassport: true,
      mediVault: true,
      healthDiary: false,
      aiPredictions: true,
      naturalRemedies: true
    }
  };

  const ConsentBadge = ({ hasConsent, label }: { hasConsent: boolean, label: string }) => (
    <Badge className={`${hasConsent ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} flex items-center gap-1`}>
      {hasConsent ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
      {label}
    </Badge>
  );

  const ConsentRequired = ({ section }: { section: string }) => (
    <Alert className="border-amber-200 bg-amber-50">
      <AlertTriangle className="h-4 w-4 text-amber-600" />
      <AlertDescription className="text-amber-800">
        Patient has not granted access to {section}. Consent required to view this information.
      </AlertDescription>
    </Alert>
  );

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-8"
          >
            <Button 
              variant="outline" 
              onClick={() => navigate('/doctor/patients')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Patients
            </Button>
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarFallback className="text-2xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                  {patient.avatar}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">{patient.name}</h1>
                <p className="text-gray-600">{patient.age} years • {patient.gender} • {patient.bloodGroup}</p>
                <p className="text-sm text-gray-500">{patient.primaryCondition}</p>
              </div>
            </div>
            <div className="ml-auto flex gap-3">
              <Button size="sm" className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Chat
              </Button>
              <Button size="sm" variant="outline" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Call
              </Button>
              <Button size="sm" variant="outline" className="flex items-center gap-2">
                <Video className="w-4 h-4" />
                Video
              </Button>
            </div>
          </motion.div>

          {/* Consent Overview */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-500" />
                  Data Access Permissions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <ConsentBadge hasConsent={patient.consentStatus.healthPassport} label="Health Passport" />
                  <ConsentBadge hasConsent={patient.consentStatus.mediVault} label="MediVault" />
                  <ConsentBadge hasConsent={patient.consentStatus.healthDiary} label="Health Diary" />
                  <ConsentBadge hasConsent={patient.consentStatus.aiPredictions} label="AI Predictions" />
                  <ConsentBadge hasConsent={patient.consentStatus.naturalRemedies} label="Natural Remedies" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Patient Details Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="overview" className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="passport" className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Health Passport
                </TabsTrigger>
                <TabsTrigger value="medivault" className="flex items-center gap-2">
                  <Folder className="w-4 h-4" />
                  MediVault
                </TabsTrigger>
                <TabsTrigger value="diary" className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Health Diary
                </TabsTrigger>
                <TabsTrigger value="predictions" className="flex items-center gap-2">
                  <Brain className="w-4 h-4" />
                  AI Predictions
                </TabsTrigger>
                <TabsTrigger value="remedies" className="flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  Remedies
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Card className="lg:col-span-2 border-0 shadow-lg bg-white/70 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle>Patient Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Primary Condition</p>
                          <p className="font-semibold">{patient.primaryCondition}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Risk Level</p>
                          <Badge className="bg-green-100 text-green-800">{patient.riskLevel}</Badge>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Last Visit</p>
                          <p className="font-semibold">{patient.lastVisit}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Next Appointment</p>
                          <p className="font-semibold">{patient.nextAppointment}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Contact Information</p>
                        <div className="space-y-1">
                          <p className="text-sm">{patient.email}</p>
                          <p className="text-sm">{patient.phone}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button variant="outline" className="w-full justify-start">
                        <Calendar className="w-4 h-4 mr-2" />
                        Schedule Appointment
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <FileText className="w-4 h-4 mr-2" />
                        Add Clinical Note
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        Flag for Review
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="passport">
                {patient.consentStatus.healthPassport ? (
                  <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-blue-500" />
                        Health Passport - Read Only
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-2">Medical History</h4>
                          <div className="space-y-2">
                            <div className="p-3 border rounded-lg">
                              <p className="font-medium">Diabetes Type 2</p>
                              <p className="text-sm text-gray-600">Diagnosed: Jan 2023</p>
                            </div>
                            <div className="p-3 border rounded-lg">
                              <p className="font-medium">Hypertension</p>
                              <p className="text-sm text-gray-600">Diagnosed: Mar 2022</p>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Vital Signs (Latest)</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 border rounded-lg text-center">
                              <p className="text-2xl font-bold text-red-600">120/80</p>
                              <p className="text-sm text-gray-600">Blood Pressure</p>
                            </div>
                            <div className="p-3 border rounded-lg text-center">
                              <p className="text-2xl font-bold text-blue-600">98.6°F</p>
                              <p className="text-sm text-gray-600">Temperature</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <ConsentRequired section="Health Passport" />
                )}
              </TabsContent>

              <TabsContent value="medivault">
                {patient.consentStatus.mediVault ? (
                  <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Folder className="w-5 h-5 text-teal-500" />
                        MediVault - Shared Documents
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Lab Results - HbA1c</p>
                              <p className="text-sm text-gray-600">Uploaded: Jan 15, 2024</p>
                            </div>
                            <Button size="sm" variant="outline">View</Button>
                          </div>
                        </div>
                        <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Chest X-Ray</p>
                              <p className="text-sm text-gray-600">Uploaded: Dec 20, 2023</p>
                            </div>
                            <Button size="sm" variant="outline">View</Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <ConsentRequired section="MediVault documents" />
                )}
              </TabsContent>

              <TabsContent value="diary">
                {patient.consentStatus.healthDiary ? (
                  <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-orange-500" />
                        Health Diary Overview
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>Health diary content would be shown here...</p>
                    </CardContent>
                  </Card>
                ) : (
                  <ConsentRequired section="Health Diary entries" />
                )}
              </TabsContent>

              <TabsContent value="predictions">
                {patient.consentStatus.aiPredictions ? (
                  <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Brain className="w-5 h-5 text-purple-500" />
                        AI Predictions & Risk Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="p-4 border rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-semibold">Diabetic Complications Risk</h4>
                            <Badge className="bg-yellow-100 text-yellow-800">Medium Risk</Badge>
                          </div>
                          <p className="text-sm text-gray-600">Based on current HbA1c levels and lifestyle factors</p>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-semibold">Cardiovascular Risk</h4>
                            <Badge className="bg-green-100 text-green-800">Low Risk</Badge>
                          </div>
                          <p className="text-sm text-gray-600">Blood pressure well controlled, good medication compliance</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <ConsentRequired section="AI predictions and risk analysis" />
                )}
              </TabsContent>

              <TabsContent value="remedies">
                {patient.consentStatus.naturalRemedies ? (
                  <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Heart className="w-5 h-5 text-green-500" />
                        Natural Remedies & Diet Preferences
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="p-4 border rounded-lg">
                          <h4 className="font-semibold mb-2">Preferred Remedies</h4>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline">Turmeric</Badge>
                            <Badge variant="outline">Cinnamon</Badge>
                            <Badge variant="outline">Bitter Gourd</Badge>
                            <Badge variant="outline">Fenugreek</Badge>
                          </div>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <h4 className="font-semibold mb-2">Dietary Preferences</h4>
                          <p className="text-sm text-gray-600">Low-carb, Mediterranean diet, Vegetarian</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <ConsentRequired section="natural remedies and diet information" />
                )}
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
};

export default PatientDetails;