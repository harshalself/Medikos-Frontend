/**
 * API Types
 * TypeScript type definitions for API requests and responses
 */

// ============================================
// Common Types
// ============================================

export interface APIResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

// ============================================
// Authentication Types
// ============================================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  full_name: string;
}

export interface AuthResponse {
  message: string;
  user: {
    id: string;
    email: string;
    full_name?: string;
    created_at?: string;
  };
  session: {
    access_token: string;
    refresh_token?: string;
    expires_at: number;
  };
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'patient' | 'doctor' | 'admin';
  profileImage?: string;
  phone?: string;
  dateOfBirth?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// Patient Types
// ============================================

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  address?: string;
  bloodGroup?: string;
  allergies?: string[];
  medicalHistory?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePatientRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  address?: string;
  bloodGroup?: string;
}

// ============================================
// Appointment Types
// ============================================

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  patient?: Patient;
  doctor?: Doctor;
  date: string;
  time: string;
  duration: number;
  type: 'consultation' | 'follow-up' | 'emergency';
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  symptoms?: string;
  diagnosis?: string;
  prescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAppointmentRequest {
  doctorId: string;
  date: string;
  time: string;
  type: 'consultation' | 'follow-up' | 'emergency';
  symptoms?: string;
  notes?: string;
}

// ============================================
// Doctor Types
// ============================================

export interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  specialization: string;
  qualification: string;
  experience: number;
  rating?: number;
  availability?: DoctorAvailability[];
  consultationFee?: number;
  profileImage?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DoctorAvailability {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

// ============================================
// Health Record Types
// ============================================

export interface HealthRecord {
  id: string;
  patientId: string;
  type: 'lab-report' | 'prescription' | 'scan' | 'diagnosis' | 'other';
  title: string;
  description?: string;
  date: string;
  doctor?: Doctor;
  doctorId?: string;
  fileUrl?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateHealthRecordRequest {
  type: 'lab-report' | 'prescription' | 'scan' | 'diagnosis' | 'other';
  title: string;
  description?: string;
  date: string;
  doctorId?: string;
  file?: File;
}

// ============================================
// Health Diary Types
// ============================================

export interface HealthDiaryEntry {
  id: string;
  patientId: string;
  date: string;
  symptoms?: Symptom[];
  vitals?: Vitals;
  medications?: Medication[];
  notes?: string;
  mood?: 'excellent' | 'good' | 'fair' | 'poor';
  createdAt: string;
  updatedAt: string;
}

export interface Symptom {
  name: string;
  severity: 'mild' | 'moderate' | 'severe';
  duration?: string;
  notes?: string;
}

export interface Vitals {
  bloodPressure?: {
    systolic: number;
    diastolic: number;
  };
  heartRate?: number;
  temperature?: number;
  weight?: number;
  height?: number;
  oxygenLevel?: number;
  glucose?: number;
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  taken: boolean;
  time?: string;
}

export interface CreateHealthDiaryRequest {
  date: string;
  symptoms?: Symptom[];
  vitals?: Vitals;
  medications?: Medication[];
  notes?: string;
  mood?: 'excellent' | 'good' | 'fair' | 'poor';
}

// ============================================
// Medical Services Types
// ============================================

export interface GenericMedicineRequest {
  medicineName: string;
}

export interface GenericMedicineResponse {
  brandName: string;
  genericName: string;
  alternatives: {
    name: string;
    manufacturer: string;
    price?: number;
  }[];
}

export interface AllergyDetectionRequest {
  symptoms: string[];
  exposures?: string[];
}

export interface AllergyDetectionResponse {
  possibleAllergies: {
    allergen: string;
    probability: number;
    symptoms: string[];
  }[];
  recommendations: string[];
}

export interface DiseasePredictionRequest {
  symptoms: string[];
  age?: number;
  gender?: string;
  medicalHistory?: string[];
}

export interface DiseasePredictionResponse {
  predictions: {
    disease: string;
    probability: number;
    description: string;
    recommendedTests?: string[];
  }[];
  disclaimer: string;
}

// ============================================
// SHAP Disease Prediction (Backend Contract)
// Endpoint: POST /predict_with_shap
// Request: { symptoms: string[] }
// Response: { prediction: string, symptom_importance: Record<string, number> }
// ============================================
export interface PredictWithShapRequest {
  symptoms: string[];
}

export interface PredictWithShapResponse {
  prediction: string;
  symptom_importance: Record<string, number>;
}

// ============================================
// Admin Types
// ============================================

export interface DashboardStats {
  totalPatients: number;
  totalDoctors: number;
  totalAppointments: number;
  todayAppointments: number;
  revenue?: number;
  activeUsers: number;
}

export interface AnalyticsData {
  appointmentTrends: {
    date: string;
    count: number;
  }[];
  patientGrowth: {
    month: string;
    count: number;
  }[];
  topDoctors: {
    doctor: Doctor;
    appointmentCount: number;
  }[];
}
