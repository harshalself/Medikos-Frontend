import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
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
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <NotificationProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter future={{ v7_startTransition: true }}>
            <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            
            {/* Doctor Portal Routes */}
            <Route path="/doctor-dashboard" element={<ProtectedRoute><DoctorDashboard /></ProtectedRoute>} />
            <Route path="/doctor/patients" element={<ProtectedRoute><DoctorPatients /></ProtectedRoute>} />
            <Route path="/doctor/patients/:patientId" element={<ProtectedRoute><PatientDetails /></ProtectedRoute>} />
            <Route path="/doctor/diagnosis" element={<ProtectedRoute><DoctorDiagnosis /></ProtectedRoute>} />
            <Route path="/doctor/consultations" element={<ProtectedRoute><DoctorConsultations /></ProtectedRoute>} />
            <Route path="/doctor/analytics" element={<ProtectedRoute><DoctorAnalytics /></ProtectedRoute>} />
            
            <Route path="/admin-dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/remedies" element={<ProtectedRoute><Remedies /></ProtectedRoute>} />
            <Route path="/medivault" element={<ProtectedRoute><MediVault /></ProtectedRoute>} />
            <Route path="/passport" element={<ProtectedRoute><HealthPassport /></ProtectedRoute>} />
            <Route path="/generic-medicine" element={<ProtectedRoute><GenericMedicine /></ProtectedRoute>} />
            <Route path="/disease-prediction" element={<ProtectedRoute><InfectiousDiseasePrediction /></ProtectedRoute>} />
            <Route path="/health-diary" element={<ProtectedRoute><HealthDiary /></ProtectedRoute>} />
            <Route path="/chatbot" element={<ProtectedRoute><ChatBot /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
    </NotificationProvider>
  </QueryClientProvider>
);

export default App;
