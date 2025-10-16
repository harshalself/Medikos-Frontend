import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import DoctorPatients from "./pages/DoctorPatients";
import DoctorDiagnosis from "./pages/DoctorDiagnosis";
import DoctorConsultations from "./pages/DoctorConsultations";
import DoctorAnalytics from "./pages/DoctorAnalytics";
import PatientDetails from "./pages/PatientDetails";
import AdminDashboard from "./pages/AdminDashboard";
import Remedies from "./pages/Remedies";
import MediVault from "./pages/MediVault";
import HealthPassport from "./pages/HealthPassport";
import ChatBot from "./pages/ChatBot";
import GenericMedicine from "./pages/GenericMedicine";
import InfectiousDiseasePrediction from "./pages/InfectiousDiseasePrediction";
import HealthDiary from "./pages/HealthDiary";
import VoiceAgent from "./pages/VoiceAgent";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter future={{ v7_startTransition: true }}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* Doctor Portal Routes */}
            <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
            <Route path="/doctor/patients" element={<DoctorPatients />} />
            <Route path="/doctor/patients/:patientId" element={<PatientDetails />} />
            <Route path="/doctor/diagnosis" element={<DoctorDiagnosis />} />
            <Route path="/doctor/consultations" element={<DoctorConsultations />} />
            <Route path="/doctor/analytics" element={<DoctorAnalytics />} />
            
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/remedies" element={<Remedies />} />
            <Route path="/medivault" element={<MediVault />} />
            <Route path="/passport" element={<HealthPassport />} />
            <Route path="/generic-medicine" element={<GenericMedicine />} />
            <Route path="/disease-prediction" element={<InfectiousDiseasePrediction />} />
            <Route path="/health-diary" element={<HealthDiary />} />
            <Route path="/voice-agent" element={<VoiceAgent />} />
            <Route path="/chatbot" element={<ChatBot />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
