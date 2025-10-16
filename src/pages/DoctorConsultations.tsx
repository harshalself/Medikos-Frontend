import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import Consultations from './doctor/Consultations';

const DoctorConsultations = () => {
  return (
    <AppLayout>
      <Consultations />
    </AppLayout>
  );
};

export default DoctorConsultations;