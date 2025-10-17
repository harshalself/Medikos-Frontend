import { Button } from "@/components/ui/button";
import { AppLayout } from "@/components/layout/AppLayout";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Heart, 
  User, 
  LogOut, 
  Calendar,
  MapPin,
  Phone,
  Mail,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity,
  Scale,
  Droplets,
  Edit,
  Save,
  X,
  Trash2
} from "lucide-react";
import { useState, useEffect } from "react";
import { api, APIError } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/api-config";
import type { HealthPassport as HealthPassportType } from "@/types/api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";const HealthPassport = () => {
  const { user } = useAuth();
  const [healthPassport, setHealthPassport] = useState<HealthPassportType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [creating, setCreating] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Form data state
  const [formData, setFormData] = useState({
    // Basic Health
    blood_group: '',
    allergies: '',
    chronic_conditions: '',
    current_medications: '',
    past_surgeries: '',
    family_history: '',
    vaccination_status: '',

    // Lifestyle
    smoking_status: '',
    alcohol_consumption: '',
    exercise_frequency: '',
    diet_type: '',

    // Vitals
    height_cm: '',
    weight_kg: '',
    blood_pressure: '',
    heart_rate: '',

    // Address
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    country: '',
    postal_code: '',

    // Emergency Contact
    emergency_contact_name: '',
    emergency_contact_phone: '',
    emergency_contact_relation: ''
  });

  useEffect(() => {
    const checkHealthPassport = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // First check if health passport exists
        const existsResponse = await api.get<{ exists: boolean; user_id?: string }>(API_ENDPOINTS.healthPassport.exists);
        
        if (existsResponse.exists) {
          // Health passport exists, fetch it
          const data = await api.get<HealthPassportType>(API_ENDPOINTS.healthPassport.base);
          setHealthPassport(data);
          setShowCreateForm(false);
        } else {
          // Health passport doesn't exist, show creation form
          setShowCreateForm(true);
          setHealthPassport(null);
        }
      } catch (err) {
        console.error('Error checking health passport:', err);
        setError('Failed to load health passport. Please try again.');
        setShowCreateForm(false);
      } finally {
        setLoading(false);
      }
    };

    checkHealthPassport();
  }, []);

  // Populate form data when health passport loads
  useEffect(() => {
    if (healthPassport) {
      setFormData({
        blood_group: healthPassport.blood_group || '',
        allergies: healthPassport.allergies || '',
        chronic_conditions: healthPassport.chronic_conditions || '',
        current_medications: healthPassport.current_medications || '',
        past_surgeries: healthPassport.past_surgeries || '',
        family_history: healthPassport.family_history || '',
        vaccination_status: healthPassport.vaccination_status || '',
        smoking_status: healthPassport.smoking_status || '',
        alcohol_consumption: healthPassport.alcohol_consumption || '',
        exercise_frequency: healthPassport.exercise_frequency || '',
        diet_type: healthPassport.diet_type || '',
        height_cm: healthPassport.height_cm?.toString() || '',
        weight_kg: healthPassport.weight_kg?.toString() || '',
        blood_pressure: healthPassport.blood_pressure || '',
        heart_rate: healthPassport.heart_rate?.toString() || '',
        address_line1: healthPassport.address_line1 || '',
        address_line2: healthPassport.address_line2 || '',
        city: healthPassport.city || '',
        state: healthPassport.state || '',
        country: healthPassport.country || '',
        postal_code: healthPassport.postal_code || '',
        emergency_contact_name: healthPassport.emergency_contact_name || '',
        emergency_contact_phone: healthPassport.emergency_contact_phone || '',
        emergency_contact_relation: healthPassport.emergency_contact_relation || ''
      });
    }
  }, [healthPassport]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateBasicInfo = async () => {
    const updateData = {
      blood_group: formData.blood_group,
      allergies: formData.allergies,
      chronic_conditions: formData.chronic_conditions,
      current_medications: formData.current_medications,
      past_surgeries: formData.past_surgeries,
      family_history: formData.family_history
    };
    const updatedData = await api.patch<HealthPassportType>(API_ENDPOINTS.healthPassport.basic, updateData);
    setHealthPassport(updatedData);
  };

  const updateVitals = async () => {
    const updateData = {
      height_cm: parseFloat(formData.height_cm),
      weight_kg: parseFloat(formData.weight_kg),
      blood_pressure: formData.blood_pressure,
      heart_rate: parseInt(formData.heart_rate)
    };
    const updatedData = await api.patch<HealthPassportType>(API_ENDPOINTS.healthPassport.vitals, updateData);
    setHealthPassport(updatedData);
  };

  const updateLifestyle = async () => {
    const updateData = {
      smoking_status: formData.smoking_status,
      alcohol_consumption: formData.alcohol_consumption,
      exercise_frequency: formData.exercise_frequency,
      diet_type: formData.diet_type
    };
    const updatedData = await api.patch<HealthPassportType>(API_ENDPOINTS.healthPassport.lifestyle, updateData);
    setHealthPassport(updatedData);
  };

  const updateAddress = async () => {
    const updateData = {
      address_line1: formData.address_line1,
      address_line2: formData.address_line2,
      city: formData.city,
      state: formData.state,
      country: formData.country,
      postal_code: formData.postal_code
    };
    const updatedData = await api.patch<HealthPassportType>(API_ENDPOINTS.healthPassport.address, updateData);
    setHealthPassport(updatedData);
  };

  const updateEmergencyContact = async () => {
    const updateData = {
      emergency_contact_name: formData.emergency_contact_name,
      emergency_contact_phone: formData.emergency_contact_phone,
      emergency_contact_relation: formData.emergency_contact_relation
    };
    const updatedData = await api.patch<HealthPassportType>(API_ENDPOINTS.healthPassport.emergency, updateData);
    setHealthPassport(updatedData);
  };

  const createHealthPassport = async () => {
    try {
      setCreating(true);
      const createData = {
        blood_group: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].includes(formData.blood_group) ? formData.blood_group : undefined,
        allergies: formData.allergies || undefined,
        chronic_conditions: formData.chronic_conditions || undefined,
        current_medications: formData.current_medications || undefined,
        past_surgeries: formData.past_surgeries || undefined,
        family_history: formData.family_history || undefined,
        smoking_status: ['Never', 'Former', 'Current'].includes(formData.smoking_status) ? formData.smoking_status : undefined,
        alcohol_consumption: ['None', 'Occasional', 'Moderate', 'Heavy'].includes(formData.alcohol_consumption) ? formData.alcohol_consumption : undefined,
        exercise_frequency: ['Sedentary', 'Light', 'Moderate', 'Active', 'Very Active'].includes(formData.exercise_frequency) ? formData.exercise_frequency : undefined,
        diet_type: formData.diet_type || undefined,
        height_cm: formData.height_cm ? (isNaN(parseFloat(formData.height_cm)) ? undefined : Math.max(50, Math.min(300, parseFloat(formData.height_cm)))) : undefined,
        weight_kg: formData.weight_kg ? (isNaN(parseFloat(formData.weight_kg)) ? undefined : Math.max(10, Math.min(500, parseFloat(formData.weight_kg)))) : undefined,
        blood_pressure: formData.blood_pressure || undefined,
        heart_rate: formData.heart_rate ? (isNaN(parseInt(formData.heart_rate)) ? undefined : Math.max(30, Math.min(200, parseInt(formData.heart_rate)))) : undefined,
        vaccination_status: ['Up to date', 'Partially vaccinated', 'Not vaccinated'].includes(formData.vaccination_status) ? formData.vaccination_status : undefined,
        address_line1: formData.address_line1 || undefined,
        address_line2: formData.address_line2 || undefined,
        city: formData.city || undefined,
        state: formData.state || undefined,
        country: formData.country || undefined,
        postal_code: formData.postal_code || undefined,
        emergency_contact_name: formData.emergency_contact_name || undefined,
        emergency_contact_phone: formData.emergency_contact_phone || undefined,
        emergency_contact_relation: formData.emergency_contact_relation || undefined
      };

      // Remove undefined values
      Object.keys(createData).forEach(key => {
        if (createData[key] === undefined) {
          delete createData[key];
        }
      });

      // Check if we have at least some data to send
      if (Object.keys(createData).length === 0) {
        toast.error('Please fill in at least one field to create your health passport.');
        setCreating(false);
        return;
      }

      const newHealthPassport = await api.post<HealthPassportType>(API_ENDPOINTS.healthPassport.base, createData);
      setHealthPassport(newHealthPassport);
      setShowCreateForm(false);
      toast.success('Health passport created successfully!');
    } catch (err) {
      console.error('Error creating health passport:', err);
      const errorMessage = err instanceof APIError && err.data?.detail 
        ? Array.isArray(err.data.detail) 
          ? err.data.detail.map(d => d.msg || d.message).join(', ')
          : err.data.detail
        : 'Failed to create health passport. Please try again.';
      toast.error(errorMessage);
    } finally {
      setCreating(false);
    }
  };

  const deleteHealthPassport = async () => {
    try {
      setDeleting(true);
      await api.delete(API_ENDPOINTS.healthPassport.base);
      setHealthPassport(null);
      setShowCreateForm(true);
      toast.success('Health passport deleted successfully');
    } catch (err) {
      console.error('Error deleting health passport:', err);
      toast.error('Failed to delete health passport. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Current": return "bg-success text-success-foreground";
      case "Complete": return "bg-primary text-primary-foreground";
      case "Due Soon": return "bg-warning text-warning-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">

      {/* Loading State */}
      {loading && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading your health passport...</p>
            </div>
          </div>
        </main>
      )}

      {/* Error State */}
      {error && !loading && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <Card className="max-w-md w-full">
              <CardContent className="p-6 text-center">
                <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Error Loading Health Passport</h3>
                <p className="text-muted-foreground mb-4">{error}</p>
                <Button onClick={() => window.location.reload()} variant="outline">
                  Try Again
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      )}

      {/* Create Health Passport Form */}
      {showCreateForm && !loading && !error && (
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="shadow-hover">
            <CardHeader className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 text-white">
              <div className="flex items-center justify-center mb-4">
                <Shield className="w-12 h-12" />
              </div>
              <CardTitle className="text-2xl text-center">Create Your Health Passport</CardTitle>
              <CardDescription className="text-white/80 text-center">
                Fill in your health information to create your digital health passport
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-8">
                {/* Basic Health Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Heart className="w-5 h-5 text-primary mr-2" />
                    Basic Health Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="create_blood_group">Blood Group *</Label>
                      <Select value={formData.blood_group} onValueChange={(value) => handleInputChange('blood_group', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select blood group" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A+">A+</SelectItem>
                          <SelectItem value="A-">A-</SelectItem>
                          <SelectItem value="B+">B+</SelectItem>
                          <SelectItem value="B-">B-</SelectItem>
                          <SelectItem value="AB+">AB+</SelectItem>
                          <SelectItem value="AB-">AB-</SelectItem>
                          <SelectItem value="O+">O+</SelectItem>
                          <SelectItem value="O-">O-</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="create_allergies">Allergies</Label>
                      <Input
                        id="create_allergies"
                        value={formData.allergies}
                        onChange={(e) => handleInputChange('allergies', e.target.value)}
                        placeholder="e.g., Peanuts, Shellfish"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="create_chronic_conditions">Chronic Conditions</Label>
                      <Input
                        id="create_chronic_conditions"
                        value={formData.chronic_conditions}
                        onChange={(e) => handleInputChange('chronic_conditions', e.target.value)}
                        placeholder="e.g., Diabetes, Hypertension"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="create_current_medications">Current Medications</Label>
                      <Input
                        id="create_current_medications"
                        value={formData.current_medications}
                        onChange={(e) => handleInputChange('current_medications', e.target.value)}
                        placeholder="e.g., Metformin 500mg"
                      />
                    </div>
                  </div>
                </div>

                {/* Vital Signs */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Activity className="w-5 h-5 text-primary mr-2" />
                    Vital Signs
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="create_height_cm">Height (cm)</Label>
                      <Input
                        id="create_height_cm"
                        type="number"
                        value={formData.height_cm}
                        onChange={(e) => handleInputChange('height_cm', e.target.value)}
                        placeholder="175.5"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="create_weight_kg">Weight (kg)</Label>
                      <Input
                        id="create_weight_kg"
                        type="number"
                        value={formData.weight_kg}
                        onChange={(e) => handleInputChange('weight_kg', e.target.value)}
                        placeholder="70.2"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="create_blood_pressure">Blood Pressure</Label>
                      <Input
                        id="create_blood_pressure"
                        value={formData.blood_pressure}
                        onChange={(e) => handleInputChange('blood_pressure', e.target.value)}
                        placeholder="120/80"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="create_heart_rate">Heart Rate (bpm)</Label>
                      <Input
                        id="create_heart_rate"
                        type="number"
                        value={formData.heart_rate}
                        onChange={(e) => handleInputChange('heart_rate', e.target.value)}
                        placeholder="72"
                      />
                    </div>
                  </div>
                </div>

                {/* Lifestyle */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Lifestyle Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="create_smoking_status">Smoking Status</Label>
                      <Select value={formData.smoking_status} onValueChange={(value) => handleInputChange('smoking_status', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Never">Never</SelectItem>
                          <SelectItem value="Former">Former</SelectItem>
                          <SelectItem value="Current">Current</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="create_alcohol_consumption">Alcohol Consumption</Label>
                      <Select value={formData.alcohol_consumption} onValueChange={(value) => handleInputChange('alcohol_consumption', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select consumption" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="None">None</SelectItem>
                          <SelectItem value="Occasional">Occasional</SelectItem>
                          <SelectItem value="Moderate">Moderate</SelectItem>
                          <SelectItem value="Heavy">Heavy</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="create_exercise_frequency">Exercise Frequency</Label>
                      <Select value={formData.exercise_frequency} onValueChange={(value) => handleInputChange('exercise_frequency', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Sedentary">Sedentary</SelectItem>
                          <SelectItem value="Light">Light</SelectItem>
                          <SelectItem value="Moderate">Moderate</SelectItem>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Very Active">Very Active</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <MapPin className="w-5 h-5 text-primary mr-2" />
                    Address Information
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="create_address_line1">Address Line 1</Label>
                      <Input
                        id="create_address_line1"
                        value={formData.address_line1}
                        onChange={(e) => handleInputChange('address_line1', e.target.value)}
                        placeholder="123 Main Street"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="create_city">City</Label>
                        <Input
                          id="create_city"
                          value={formData.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          placeholder="New York"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="create_state">State</Label>
                        <Input
                          id="create_state"
                          value={formData.state}
                          onChange={(e) => handleInputChange('state', e.target.value)}
                          placeholder="NY"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="create_country">Country</Label>
                        <Input
                          id="create_country"
                          value={formData.country}
                          onChange={(e) => handleInputChange('country', e.target.value)}
                          placeholder="USA"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="create_postal_code">Postal Code</Label>
                        <Input
                          id="create_postal_code"
                          value={formData.postal_code}
                          onChange={(e) => handleInputChange('postal_code', e.target.value)}
                          placeholder="10001"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Phone className="w-5 h-5 text-primary mr-2" />
                    Emergency Contact
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="create_emergency_name">Name</Label>
                      <Input
                        id="create_emergency_name"
                        value={formData.emergency_contact_name}
                        onChange={(e) => handleInputChange('emergency_contact_name', e.target.value)}
                        placeholder="Jane Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="create_emergency_phone">Phone</Label>
                      <Input
                        id="create_emergency_phone"
                        value={formData.emergency_contact_phone}
                        onChange={(e) => handleInputChange('emergency_contact_phone', e.target.value)}
                        placeholder="+1234567890"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="create_emergency_relation">Relation</Label>
                      <Input
                        id="create_emergency_relation"
                        value={formData.emergency_contact_relation}
                        onChange={(e) => handleInputChange('emergency_contact_relation', e.target.value)}
                        placeholder="Sister"
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4 pt-6 border-t">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setFormData({
                        blood_group: '',
                        allergies: '',
                        chronic_conditions: '',
                        current_medications: '',
                        past_surgeries: '',
                        family_history: '',
                        vaccination_status: '',
                        smoking_status: '',
                        alcohol_consumption: '',
                        exercise_frequency: '',
                        diet_type: '',
                        height_cm: '',
                        weight_kg: '',
                        blood_pressure: '',
                        heart_rate: '',
                        address_line1: '',
                        address_line2: '',
                        city: '',
                        state: '',
                        country: '',
                        postal_code: '',
                        emergency_contact_name: '',
                        emergency_contact_phone: '',
                        emergency_contact_relation: ''
                      });
                    }}
                  >
                    Clear Form
                  </Button>
                  <Button
                    onClick={createHealthPassport}
                    disabled={creating || !formData.blood_group.trim()}
                    className="min-w-[120px]"
                  >
                    {creating ? 'Creating...' : 'Create Passport'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      )}

      {/* Main Content */}
      {!loading && !error && !showCreateForm && healthPassport && (
        <>
          {/* Hero Section */}
          <section className="py-12 bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-xl animate-float">
                  <Shield className="w-8 h-8 text-white" />
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3 animate-fade-in text-center">
                Smart Health Passport
              </h1>
              <p className="text-lg text-muted-foreground mb-6 animate-slide-up text-center max-w-2xl mx-auto">
                Your comprehensive digital health identity with complete medical history, securely encrypted
              </p>
            </div>
          </section>

          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-16">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Health Passport Card */}
          <div className="xl:col-span-3">
            <Card className="shadow-hover border-2 border-primary/20 animate-fade-in overflow-hidden h-full">
              <CardHeader className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 text-white p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-slide-left"></div>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl mb-2">Digital Health Passport</CardTitle>
                    <CardDescription className="text-white/80">
                      Official Medical ID - {healthPassport.id.slice(-8).toUpperCase()}
                    </CardDescription>
                  </div>
                  <Shield className="w-16 h-16 text-white/80" />
                </div>
              </CardHeader>
              <CardContent className="p-6 md:p-8">
                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground mb-3 pb-2 border-b-2 border-primary/20">Personal Information</h3>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg border border-blue-100 dark:border-blue-900">
                        <User className="w-5 h-5 text-primary flex-shrink-0" />
                        <div>
                          <p className="font-medium">{user?.name}</p>
                          <p className="text-sm text-muted-foreground">{user?.email}</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-lg border border-purple-100 dark:border-purple-900">
                        <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        {!isEditing ? (
                          <p className="text-sm">
                            {healthPassport.address_line1}<br />
                            {healthPassport.city}, {healthPassport.state} {healthPassport.postal_code}<br />
                            {healthPassport.country}
                          </p>
                        ) : (
                          <div className="space-y-2 w-full">
                            <Input
                              value={formData.address_line1}
                              onChange={(e) => handleInputChange('address_line1', e.target.value)}
                              placeholder="Address Line 1"
                            />
                            <Input
                              value={formData.city}
                              onChange={(e) => handleInputChange('city', e.target.value)}
                              placeholder="City"
                            />
                            <div className="grid grid-cols-2 gap-2">
                              <Input
                                value={formData.state}
                                onChange={(e) => handleInputChange('state', e.target.value)}
                                placeholder="State"
                              />
                              <Input
                                value={formData.postal_code}
                                onChange={(e) => handleInputChange('postal_code', e.target.value)}
                                placeholder="Postal Code"
                              />
                            </div>
                            <Input
                              value={formData.country}
                              onChange={(e) => handleInputChange('country', e.target.value)}
                              placeholder="Country"
                            />
                          </div>
                        )}
                      </div>
                      {user?.email && (
                        <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg border border-green-100 dark:border-green-900">
                          <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                          <p className="text-sm">{user.email}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground mb-3 pb-2 border-b-2 border-primary/20">Medical Profile</h3>
                    <div className="space-y-3">
                      {!isEditing ? (
                        <>
                          <div className="flex justify-between items-center p-3 bg-primary-soft rounded-lg">
                            <span className="font-medium">Blood Group</span>
                            <Badge className="bg-primary text-primary-foreground text-lg font-bold">
                              {healthPassport.blood_group}
                            </Badge>
                          </div>
                          <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                            <span>Height</span>
                            <span className="font-medium">{healthPassport.height_cm} cm</span>
                          </div>
                          <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                            <span>Weight</span>
                            <span className="font-medium">{healthPassport.weight_kg} kg</span>
                          </div>
                          <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                            <span>BMI</span>
                            <span className="font-medium">{healthPassport.bmi}</span>
                          </div>
                          <div className="p-3 bg-warning/10 rounded-lg border-l-4 border-l-warning">
                            <p className="text-sm font-medium">Emergency Contact</p>
                            <p className="text-sm text-muted-foreground">
                              {healthPassport.emergency_contact_name} ({healthPassport.emergency_contact_relation})<br />
                              {healthPassport.emergency_contact_phone}
                            </p>
                          </div>
                        </>
                      ) : (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="blood_group">Blood Group</Label>
                            <Select value={formData.blood_group} onValueChange={(value) => handleInputChange('blood_group', value)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select blood group" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="A+">A+</SelectItem>
                                <SelectItem value="A-">A-</SelectItem>
                                <SelectItem value="B+">B+</SelectItem>
                                <SelectItem value="B-">B-</SelectItem>
                                <SelectItem value="AB+">AB+</SelectItem>
                                <SelectItem value="AB-">AB-</SelectItem>
                                <SelectItem value="O+">O+</SelectItem>
                                <SelectItem value="O-">O-</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                              <Label htmlFor="height_cm">Height (cm)</Label>
                              <Input
                                id="height_cm"
                                type="number"
                                value={formData.height_cm}
                                onChange={(e) => handleInputChange('height_cm', e.target.value)}
                                placeholder="175.5"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="weight_kg">Weight (kg)</Label>
                              <Input
                                id="weight_kg"
                                type="number"
                                value={formData.weight_kg}
                                onChange={(e) => handleInputChange('weight_kg', e.target.value)}
                                placeholder="70.2"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="emergency_contact_name">Emergency Contact Name</Label>
                            <Input
                              id="emergency_contact_name"
                              value={formData.emergency_contact_name}
                              onChange={(e) => handleInputChange('emergency_contact_name', e.target.value)}
                              placeholder="Jane Doe"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="emergency_contact_phone">Emergency Contact Phone</Label>
                            <Input
                              id="emergency_contact_phone"
                              value={formData.emergency_contact_phone}
                              onChange={(e) => handleInputChange('emergency_contact_phone', e.target.value)}
                              placeholder="+1234567890"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="emergency_contact_relation">Emergency Contact Relation</Label>
                            <Input
                              id="emergency_contact_relation"
                              value={formData.emergency_contact_relation}
                              onChange={(e) => handleInputChange('emergency_contact_relation', e.target.value)}
                              placeholder="Sister"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Health Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center pb-2 border-b-2 border-primary/20">
                      <Heart className="w-5 h-5 text-primary mr-2" />
                      Basic Health Information
                    </h3>
                    <div className="space-y-4">
                      {!isEditing ? (
                        <>
                          {healthPassport.chronic_conditions && (
                            <div className="p-4 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                              <h4 className="font-medium text-sm text-muted-foreground mb-2 flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                CHRONIC CONDITIONS
                              </h4>
                              <p className="text-sm">{healthPassport.chronic_conditions}</p>
                            </div>
                          )}
                          {healthPassport.allergies && (
                            <div className="p-4 border-2 border-destructive/30 rounded-lg bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/20 dark:to-rose-950/20">
                              <h4 className="font-medium text-sm text-muted-foreground mb-2 flex items-center">
                                <AlertTriangle className="w-4 h-4 text-destructive mr-1" />
                                ALLERGIES
                              </h4>
                              <p className="text-sm text-destructive font-medium">{healthPassport.allergies}</p>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="chronic_conditions">Chronic Conditions</Label>
                            <Textarea
                              id="chronic_conditions"
                              value={formData.chronic_conditions}
                              onChange={(e) => handleInputChange('chronic_conditions', e.target.value)}
                              placeholder="e.g., Diabetes, Hypertension"
                              rows={3}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="allergies">Allergies</Label>
                            <Textarea
                              id="allergies"
                              value={formData.allergies}
                              onChange={(e) => handleInputChange('allergies', e.target.value)}
                              placeholder="e.g., Peanuts, Shellfish"
                              rows={2}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="current_medications">Current Medications</Label>
                            <Textarea
                              id="current_medications"
                              value={formData.current_medications}
                              onChange={(e) => handleInputChange('current_medications', e.target.value)}
                              placeholder="e.g., Metformin 500mg, Lisinopril 10mg"
                              rows={3}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center pb-2 border-b-2 border-primary/20">
                      <Activity className="w-5 h-5 text-primary mr-2" />
                      Vital Signs & Lifestyle
                    </h3>
                    <div className="space-y-4">
                      {!isEditing ? (
                        <>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="p-4 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/20 dark:to-blue-950/20 rounded-lg border border-cyan-200 dark:border-cyan-800 text-center">
                              <div className="flex items-center justify-center mb-2">
                                <Activity className="w-5 h-5 text-primary" />
                              </div>
                              <p className="text-xs text-muted-foreground mb-1">Blood Pressure</p>
                              <p className="font-semibold text-lg">{healthPassport.blood_pressure}</p>
                            </div>
                            <div className="p-4 bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20 rounded-lg border border-rose-200 dark:border-rose-800 text-center">
                              <div className="flex items-center justify-center mb-2">
                                <Heart className="w-5 h-5 text-primary" />
                              </div>
                              <p className="text-xs text-muted-foreground mb-1">Heart Rate</p>
                              <p className="font-semibold text-lg">{healthPassport.heart_rate} bpm</p>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex justify-between items-center p-3 bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-950/20 dark:to-gray-950/20 rounded-lg border border-slate-200 dark:border-slate-800">
                              <span className="text-sm font-medium">Smoking Status</span>
                              <Badge variant="outline" className="font-medium">{healthPassport.smoking_status}</Badge>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
                              <span className="text-sm font-medium">Alcohol Consumption</span>
                              <Badge variant="outline" className="font-medium">{healthPassport.alcohol_consumption}</Badge>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg border border-green-200 dark:border-green-800">
                              <span className="text-sm font-medium">Exercise Frequency</span>
                              <Badge variant="outline" className="font-medium">{healthPassport.exercise_frequency}</Badge>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                              <Label htmlFor="blood_pressure">Blood Pressure</Label>
                              <Input
                                id="blood_pressure"
                                value={formData.blood_pressure}
                                onChange={(e) => handleInputChange('blood_pressure', e.target.value)}
                                placeholder="120/80"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="heart_rate">Heart Rate (bpm)</Label>
                              <Input
                                id="heart_rate"
                                type="number"
                                value={formData.heart_rate}
                                onChange={(e) => handleInputChange('heart_rate', e.target.value)}
                                placeholder="72"
                              />
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="space-y-2">
                              <Label htmlFor="smoking_status">Smoking Status</Label>
                              <Select value={formData.smoking_status} onValueChange={(value) => handleInputChange('smoking_status', value)}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select smoking status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Never">Never</SelectItem>
                                  <SelectItem value="Former">Former</SelectItem>
                                  <SelectItem value="Current">Current</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="alcohol_consumption">Alcohol Consumption</Label>
                              <Select value={formData.alcohol_consumption} onValueChange={(value) => handleInputChange('alcohol_consumption', value)}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select alcohol consumption" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="None">None</SelectItem>
                                  <SelectItem value="Occasional">Occasional</SelectItem>
                                  <SelectItem value="Moderate">Moderate</SelectItem>
                                  <SelectItem value="Heavy">Heavy</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="exercise_frequency">Exercise Frequency</Label>
                              <Select value={formData.exercise_frequency} onValueChange={(value) => handleInputChange('exercise_frequency', value)}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select exercise frequency" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Sedentary">Sedentary</SelectItem>
                                  <SelectItem value="Light">Light</SelectItem>
                                  <SelectItem value="Moderate">Moderate</SelectItem>
                                  <SelectItem value="Active">Active</SelectItem>
                                  <SelectItem value="Very Active">Very Active</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Current Medications */}
            <Card className="shadow-card animate-slide-up h-fit sticky top-6">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-lg">
                  <Heart className="w-5 h-5 text-primary mr-2" />
                  Current Medications
                </CardTitle>
              </CardHeader>
              <CardContent>
                {healthPassport.current_medications ? (
                  <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-sm leading-relaxed">{healthPassport.current_medications}</p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">No current medications</p>
                )}
              </CardContent>
            </Card>

            {/* Past Surgeries */}
            {healthPassport.past_surgeries && (
              <Card className="shadow-card animate-slide-up h-fit" style={{ animationDelay: '200ms' }}>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-lg">
                    <Activity className="w-5 h-5 text-primary mr-2" />
                    Past Surgeries
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-purple-50 dark:bg-purple-950/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                    <p className="text-sm leading-relaxed">{healthPassport.past_surgeries}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Family History */}
            {healthPassport.family_history && (
              <Card className="shadow-card animate-slide-up h-fit" style={{ animationDelay: '300ms' }}>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-lg">
                    <User className="w-5 h-5 text-primary mr-2" />
                    Family History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                    <p className="text-sm leading-relaxed">{healthPassport.family_history}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card className="shadow-card animate-slide-up h-fit" style={{ animationDelay: '400ms' }}>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {!isEditing ? (
                  <>
                    <Button 
                      className="w-full justify-start" 
                      variant="outline"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Update Information
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          className="w-full justify-start" 
                          variant="destructive"
                          disabled={deleting}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          {deleting ? 'Deleting...' : 'Delete Passport'}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Health Passport</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete your health passport? This action cannot be undone and all your health information will be permanently removed.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={deleteHealthPassport}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete Passport
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </>
                ) : (
                  <div className="space-y-2">
                    <Button 
                      className="w-full justify-start" 
                      variant="default"
                      onClick={async () => {
                        try {
                          setUpdating(true);
                          // Update all sections
                          await Promise.all([
                            updateBasicInfo(),
                            updateVitals(),
                            updateLifestyle(),
                            updateAddress(),
                            updateEmergencyContact()
                          ]);
                          setIsEditing(false);
                          toast.success('All changes saved successfully');
                        } catch (error) {
                          console.error('Error saving changes:', error);
                          toast.error('Failed to save some changes');
                        } finally {
                          setUpdating(false);
                        }
                      }}
                      disabled={updating}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {updating ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <Button 
                      className="w-full justify-start" 
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                      disabled={updating}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Legal Notice */}
        <div className="mt-12 p-6 bg-muted/50 rounded-lg border-l-4 border-l-primary">
          <div className="flex items-start space-x-3">
            <Shield className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-primary mb-2">Important Legal Notice</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                This digital health passport is for informational purposes and should not replace 
                professional medical consultation. Always verify information with healthcare providers. 
                In case of medical emergencies, contact emergency services immediately.
              </p>
            </div>
          </div>
        </div>
      </main>
      </>
      )}

      </div>
    </AppLayout>
  );
};

export default HealthPassport;