import React from 'react';
import { motion } from 'framer-motion';
import { AppLayout } from '@/components/layout/AppLayout';
import DashboardOverview from './doctor/DashboardOverview';

const DoctorDashboard = () => {
  return (
    <AppLayout>
      <DashboardOverview />
    </AppLayout>
  );
};

export default DoctorDashboard;