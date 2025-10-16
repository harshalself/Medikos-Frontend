import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import DiagnosisAssistant from './doctor/DiagnosisAssistant';

const DoctorDiagnosis = () => {
  return (
    <AppLayout>
      <DiagnosisAssistant />
    </AppLayout>
  );
};

export default DoctorDiagnosis;