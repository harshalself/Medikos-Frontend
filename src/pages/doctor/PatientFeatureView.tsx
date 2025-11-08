import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AppLayout } from '@/components/layout/AppLayout';
import { 
  Shield, 
  Pill, 
  Leaf, 
  BookOpen, 
  ArrowLeft,
  ChevronRight,
  Activity,
  Calendar,
  TrendingUp
} from "lucide-react";

interface FeatureCard {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  gradient: string;
  route: string;
  available: boolean;
}

const PatientFeatureView = () => {
  const navigate = useNavigate();
  const { patientId } = useParams<{ patientId: string }>();

  const features: FeatureCard[] = [
    {
      id: 'health-passport',
      title: 'Health Passport',
      description: 'View comprehensive health profile including medical history, vitals, lifestyle, and emergency contacts',
      icon: Shield,
      color: 'text-blue-600',
      gradient: 'from-blue-500 to-cyan-500',
      route: `/doctor/patients/${patientId}/health-passport`,
      available: true,
    },
    {
      id: 'medicine-history',
      title: 'Generic Medicine History',
      description: 'Track medicine searches, generic alternatives selected, and medication patterns over time',
      icon: Pill,
      color: 'text-green-600',
      gradient: 'from-green-500 to-emerald-500',
      route: `/doctor/patients/${patientId}/medicine-history`,
      available: true,
    },
    {
      id: 'remedies-history',
      title: 'Natural Remedies History',
      description: 'Review natural remedies searches, symptom patterns, and dietary recommendations history',
      icon: Leaf,
      color: 'text-emerald-600',
      gradient: 'from-emerald-500 to-teal-500',
      route: `/doctor/patients/${patientId}/remedies-history`,
      available: true,
    },
    {
      id: 'health-diary',
      title: 'Health Diary',
      description: 'Monitor daily health entries, symptoms tracking, mood patterns, and vital signs trends',
      icon: BookOpen,
      color: 'text-orange-600',
      gradient: 'from-orange-500 to-amber-500',
      route: `/doctor/patients/${patientId}/health-diary`,
      available: true, // Health Diary feature is now fully implemented
    },
  ];

  const handleFeatureClick = (feature: FeatureCard) => {
    if (feature.available) {
      navigate(feature.route);
    }
  };

  const handleBack = () => {
    navigate('/doctor/patients');
  };

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
           style={{ paddingLeft: 'max(1.5rem, calc(50vw - 896px + 1.5rem + 80px))' }}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
        {/* Header Section */}
        <div className="space-y-4">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="group hover:bg-gray-100 transition-all"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Patients
          </Button>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">Patient Health Records</h1>
            <p className="text-lg text-gray-600">
              Select a feature to view detailed patient information and medical history
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-cyan-50">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Active Records</p>
                    <p className="text-xl font-bold text-gray-900">4</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-emerald-50">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Last Updated</p>
                    <p className="text-xl font-bold text-gray-900">Today</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border-0 shadow-md bg-gradient-to-br from-purple-50 to-pink-50">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Data Quality</p>
                    <p className="text-xl font-bold text-gray-900">High</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.4 }}
              whileHover={{ y: -4, scale: 1.02 }}
            >
              <Card
                className={`border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white/70 backdrop-blur-sm overflow-hidden group ${
                  feature.available ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
                }`}
                onClick={() => handleFeatureClick(feature)}
              >
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-all duration-300`} />
                
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="w-7 h-7 text-white" />
                    </div>
                    {feature.available ? (
                      <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" />
                    ) : (
                      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-yellow-100 text-yellow-700">
                        Coming Soon
                      </span>
                    )}
                  </div>
                  
                  <CardTitle className="text-xl mt-4 group-hover:text-blue-600 transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <CardDescription className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </CardDescription>

                  {feature.available && (
                    <div className="mt-4 flex items-center text-sm font-medium text-blue-600 group-hover:text-blue-700">
                      <span>View Details</span>
                      <ChevronRight className="w-4 h-4 ml-1 group-hover:ml-2 transition-all" />
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Info Banner */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="border-0 shadow-md bg-gradient-to-r from-blue-50 to-cyan-50">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">Medical Data Privacy</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    All patient data is encrypted and access is logged for security compliance. 
                    This information is provided for professional medical purposes only and must be 
                    handled according to HIPAA regulations.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default PatientFeatureView;
