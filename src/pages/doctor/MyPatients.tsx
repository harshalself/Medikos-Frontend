import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Eye, Shield } from "lucide-react";
import { useDoctorPatients } from '@/hooks/use-doctor-patients';
import { DoctorPatient } from '@/types/api';

const MyPatients = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { fetchPatients, isFetching, patients } = useDoctorPatients();

  // Fetch patients on component mount
  useEffect(() => {
    fetchPatients();
  }, []); // Remove fetchPatients from dependencies to prevent infinite loop

  const patientsData = patients.map(patient => ({
    id: patient.id,
    name: patient.full_name || 'Unknown Patient',
    email: patient.email,
    phone: patient.phone,
    date_of_birth: patient.date_of_birth,
    gender: patient.gender,
    created_at: patient.created_at,
    avatar: patient.full_name ? patient.full_name.split(' ').map(n => n[0]).join('').toUpperCase() : 'UP',
  }));

  const filteredPatients = patientsData.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (patient.phone && patient.phone.toLowerCase().includes(searchTerm.toLowerCase()))
  );



  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
         style={{ paddingLeft: 'max(1.5rem, calc(50vw - 896px + 1.5rem + 80px))' }}>
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

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-fr">
        {isFetching ? (
          // Loading skeleton
          Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white/70 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : filteredPatients.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-400 mb-4">
              <Shield className="w-16 h-16 mx-auto opacity-50" />
            </div>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No patients found</h3>
            <p className="text-gray-500">
              {searchTerm ? 'Try adjusting your search criteria' : 'No patients registered yet'}
            </p>
          </div>
        ) : (
          filteredPatients.map((patient, index) => (
            <motion.div
              key={patient.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4, scale: 1.02 }}
            >
              <Card className="border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white/70 backdrop-blur-sm cursor-pointer h-full group"
                    onClick={() => navigate(`/doctor/patients/${patient.id}`)}>
                <CardContent className="p-6 h-full flex flex-col">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
                      {patient.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg truncate group-hover:text-blue-600 transition-colors">{patient.name}</h3>
                      <p className="text-sm text-gray-600 truncate">{patient.email}</p>
                    </div>
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                      <Eye className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>

                  <div className="space-y-3 flex-1">
                    <div>
                      <p className="text-sm text-gray-600">Date of Birth</p>
                      <p className="font-medium">
                        {patient.date_of_birth ? new Date(patient.date_of_birth).toLocaleDateString() : 'Not provided'}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600">Gender</p>
                      <p className="font-medium capitalize">
                        {patient.gender || 'Not specified'}
                      </p>
                    </div>

                    {/* Spacer to ensure consistent card height */}
                    <div className="flex-1"></div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
    </div>
  );
};

export default MyPatients;