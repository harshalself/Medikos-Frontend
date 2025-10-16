import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import MyPatients from './doctor/MyPatients';

const DoctorPatients = () => {
  return (
    <AppLayout>
      <MyPatients />
    </AppLayout>
  );
};

export default DoctorPatients;