import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  ArrowLeft, 
  Shield, 
  User, 
  Heart, 
  Activity, 
  Leaf, 
  MapPin, 
  Phone,
  Mail,
  Loader2,
  AlertCircle,
  Calendar,
  Droplet,
  Scale,
  Ruler,
  TrendingUp,
  Pill,
  Stethoscope,
  Scissors,
  Users
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useDoctorPatientHealthPassport } from '@/hooks/use-doctor-patient-health-passport';

const DoctorPatientHealthPassport = () => {
  const navigate = useNavigate();
  const { patientId } = useParams<{ patientId: string }>();
  const { data, loading, error, refetch } = useDoctorPatientHealthPassport(patientId);

  const handleBack = () => {
    navigate(`/doctor/patients/${patientId}`);
  };

  // Calculate age from date of birth
  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
           style={{ paddingLeft: 'max(1.5rem, calc(50vw - 896px + 1.5rem + 80px))' }}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="space-y-4">
            <Button
              variant="ghost"
              onClick={handleBack}
              className="group hover:bg-gray-100 transition-all"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Patient Records
            </Button>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Health Passport</h1>
                  <p className="text-gray-600">Comprehensive patient health information</p>
                </div>
              </div>
              {!loading && !error && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={refetch}
                  className="gap-2"
                >
                  <Activity className="w-4 h-4" />
                  Refresh
                </Button>
              )}
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <Card className="border-0 shadow-lg">
              <CardContent className="py-12">
                <div className="flex flex-col items-center justify-center gap-4">
                  <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                  <p className="text-gray-500">Loading health passport...</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Error State */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <span>{error}</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={refetch}
                  className="ml-4"
                >
                  Retry
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Health Passport Content */}
          {!loading && !error && data && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Basic Information */}
              {data.basic_info && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Card className="border-0 shadow-lg h-full">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <User className="w-5 h-5 text-blue-500" />
                        <CardTitle>Basic Information</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Full Name</p>
                          <p className="font-semibold text-gray-900">{data.basic_info.full_name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Gender</p>
                          <Badge variant="secondary">{data.basic_info.gender}</Badge>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Date of Birth
                          </p>
                          <p className="font-semibold text-gray-900">
                            {formatDate(data.basic_info.date_of_birth)}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Age: {data.basic_info.age || calculateAge(data.basic_info.date_of_birth)} years
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                            <Droplet className="w-3 h-3" />
                            Blood Group
                          </p>
                          <Badge className="bg-red-100 text-red-700 hover:bg-red-200">
                            {data.basic_info.blood_group}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Vitals */}
              {data.vitals && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card className="border-0 shadow-lg h-full">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Activity className="w-5 h-5 text-green-500" />
                        <CardTitle>Vital Signs</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        {data.vitals.height && (
                          <div className="bg-gray-50 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <Ruler className="w-4 h-4 text-gray-500" />
                              <p className="text-sm text-gray-500">Height</p>
                            </div>
                            <p className="text-xl font-bold text-gray-900">{data.vitals.height} cm</p>
                          </div>
                        )}
                        {data.vitals.weight && (
                          <div className="bg-gray-50 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <Scale className="w-4 h-4 text-gray-500" />
                              <p className="text-sm text-gray-500">Weight</p>
                            </div>
                            <p className="text-xl font-bold text-gray-900">{data.vitals.weight} kg</p>
                          </div>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {data.vitals.blood_pressure && (
                          <div className="bg-gray-50 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <Heart className="w-4 h-4 text-gray-500" />
                              <p className="text-sm text-gray-500">Blood Pressure</p>
                            </div>
                            <p className="text-xl font-bold text-gray-900">{data.vitals.blood_pressure}</p>
                          </div>
                        )}
                        {data.vitals.heart_rate && (
                          <div className="bg-gray-50 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <Activity className="w-4 h-4 text-gray-500" />
                              <p className="text-sm text-gray-500">Heart Rate</p>
                            </div>
                            <p className="text-xl font-bold text-gray-900">{data.vitals.heart_rate} bpm</p>
                          </div>
                        )}
                      </div>
                      {data.vitals.bmi && (
                        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <TrendingUp className="w-4 h-4 text-blue-500" />
                            <p className="text-sm text-blue-700">Body Mass Index (BMI)</p>
                          </div>
                          <p className="text-xl font-bold text-blue-900">{data.vitals.bmi.toFixed(1)}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Medical History */}
              {data.medical_history && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="lg:col-span-2"
                >
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Stethoscope className="w-5 h-5 text-purple-500" />
                        <CardTitle>Medical History</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Allergies */}
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-red-500" />
                            Allergies
                          </h3>
                          {data.medical_history.allergies && data.medical_history.allergies.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {data.medical_history.allergies.map((allergy, idx) => (
                                <Badge key={idx} variant="destructive" className="text-sm">
                                  {allergy}
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            <p className="text-gray-500 text-sm">No known allergies</p>
                          )}
                        </div>

                        {/* Chronic Conditions */}
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <Heart className="w-4 h-4 text-orange-500" />
                            Chronic Conditions
                          </h3>
                          {data.medical_history.chronic_conditions && data.medical_history.chronic_conditions.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {data.medical_history.chronic_conditions.map((condition, idx) => (
                                <Badge key={idx} className="bg-orange-100 text-orange-700 hover:bg-orange-200 text-sm">
                                  {condition}
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            <p className="text-gray-500 text-sm">No chronic conditions reported</p>
                          )}
                        </div>

                        {/* Current Medications */}
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <Pill className="w-4 h-4 text-green-500" />
                            Current Medications
                          </h3>
                          {data.medical_history.medications && data.medical_history.medications.length > 0 ? (
                            <ul className="space-y-1">
                              {data.medical_history.medications.map((medication, idx) => (
                                <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                                  <span className="text-green-500 mt-1">•</span>
                                  {medication}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-gray-500 text-sm">No current medications</p>
                          )}
                        </div>

                        {/* Surgeries */}
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <Scissors className="w-4 h-4 text-blue-500" />
                            Past Surgeries
                          </h3>
                          {data.medical_history.surgeries && data.medical_history.surgeries.length > 0 ? (
                            <ul className="space-y-1">
                              {data.medical_history.surgeries.map((surgery, idx) => (
                                <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                                  <span className="text-blue-500 mt-1">•</span>
                                  {surgery}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-gray-500 text-sm">No surgical history</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Lifestyle */}
              {data.lifestyle && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Card className="border-0 shadow-lg h-full">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Leaf className="w-5 h-5 text-green-500" />
                        <CardTitle>Lifestyle</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-sm text-gray-500 mb-2">Smoking</p>
                          <Badge variant={data.lifestyle.smoking ? "destructive" : "secondary"}>
                            {data.lifestyle.smoking ? "Yes" : "No"}
                          </Badge>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-sm text-gray-500 mb-2">Alcohol</p>
                          <Badge variant={data.lifestyle.alcohol ? "destructive" : "secondary"}>
                            {data.lifestyle.alcohol ? "Yes" : "No"}
                          </Badge>
                        </div>
                      </div>
                      {data.lifestyle.exercise_frequency && (
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-sm text-gray-500 mb-1">Exercise Frequency</p>
                          <p className="font-semibold text-gray-900">{data.lifestyle.exercise_frequency}</p>
                        </div>
                      )}
                      {data.lifestyle.diet_preference && (
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-sm text-gray-500 mb-1">Diet Preference</p>
                          <p className="font-semibold text-gray-900">{data.lifestyle.diet_preference}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Address */}
              {data.address && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Card className="border-0 shadow-lg h-full">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-blue-500" />
                        <CardTitle>Address</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-gray-900">{data.address.street}</p>
                        <p className="text-gray-900">
                          {data.address.city}, {data.address.state} {data.address.postal_code}
                        </p>
                        <p className="text-gray-700 font-semibold">{data.address.country}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Emergency Contact */}
              {data.emergency_contact && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="lg:col-span-2"
                >
                  <Card className="border-0 shadow-lg bg-gradient-to-r from-red-50 to-orange-50">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-red-500" />
                        <CardTitle className="text-red-900">Emergency Contact</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <p className="text-sm text-red-700 mb-1">Name</p>
                          <p className="font-semibold text-red-900">{data.emergency_contact.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-red-700 mb-1">Relationship</p>
                          <Badge className="bg-red-200 text-red-800 hover:bg-red-300">
                            {data.emergency_contact.relationship}
                          </Badge>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-red-600" />
                            <a 
                              href={`tel:${data.emergency_contact.phone}`}
                              className="text-red-900 hover:text-red-700 font-semibold hover:underline"
                            >
                              {data.emergency_contact.phone}
                            </a>
                          </div>
                          {data.emergency_contact.email && (
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4 text-red-600" />
                              <a 
                                href={`mailto:${data.emergency_contact.email}`}
                                className="text-red-900 hover:text-red-700 hover:underline"
                              >
                                {data.emergency_contact.email}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </div>
          )}

          {/* No Data State */}
          {!loading && !error && !data && (
            <Card className="border-0 shadow-lg">
              <CardContent className="py-12">
                <div className="text-center">
                  <Shield className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">No health passport data available for this patient</p>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default DoctorPatientHealthPassport;
