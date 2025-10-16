import { Button } from "@/components/ui/button";
import { AppLayout } from "@/components/layout/AppLayout";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  Heart, 
  User, 
  LogOut, 
  Download, 
  Share,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  QrCode
} from "lucide-react";

const HealthPassport = () => {
  const userInfo = {
    name: "Sankalp Sharma",
    age: 28,
    bloodGroup: "O+",
    height: "175 cm",
    weight: "68 kg",
    email: "sankalp@example.com",
    phone: "+91 98765 43210",
    address: "Mumbai, Maharashtra, India",
    emergencyContact: "Priya Sharma - +91 98765 43211",
    passportId: "MED2024001234"
  };

  const chronicConditions = [
    { name: "Hypertension", severity: "Mild", controlled: true },
    { name: "Type 2 Diabetes", severity: "Moderate", controlled: true }
  ];

  const allergies = [
    { allergen: "Penicillin", severity: "Severe", reaction: "Anaphylaxis" },
    { allergen: "Shellfish", severity: "Moderate", reaction: "Hives, Swelling" }
  ];

  const vaccinations = [
    { vaccine: "COVID-19 Booster", date: "2024-01-15", status: "Current" },
    { vaccine: "Influenza (Flu)", date: "2023-10-20", status: "Current" },
    { vaccine: "Hepatitis B", date: "2020-03-15", status: "Complete" },
    { vaccine: "Tetanus", date: "2019-06-10", status: "Due Soon" }
  ];

  const medications = [
    { name: "Lisinopril", dosage: "10mg", frequency: "Once daily", purpose: "Blood pressure" },
    { name: "Metformin", dosage: "500mg", frequency: "Twice daily", purpose: "Diabetes management" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Current": return "bg-success text-success-foreground";
      case "Complete": return "bg-primary text-primary-foreground";
      case "Due Soon": return "bg-warning text-warning-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Severe": return "text-destructive";
      case "Moderate": return "text-warning";
      case "Mild": return "text-success";
      default: return "text-muted-foreground";
    }
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center mb-6">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-xl animate-float">
              <Shield className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 animate-fade-in text-center">
            Smart Health Passport
          </h1>
          <p className="text-xl text-muted-foreground mb-8 animate-slide-up text-center max-w-2xl mx-auto">
            Your comprehensive digital health identity with complete medical history, securely encrypted
          </p>
          <div className="flex justify-center space-x-4 animate-scale-in">
            <Button size="lg" className="bg-gradient-to-r from-purple-500 to-blue-600 hover:shadow-hover transition-all duration-300 hover-scale">
              <Download className="w-5 h-5 mr-2" />
              Download PDF
            </Button>
            <Button size="lg" variant="outline" className="hover:shadow-soft transition-all duration-300 border-2">
              <Share className="w-5 h-5 mr-2" />
              Share Passport
            </Button>
            <Button size="lg" variant="outline" className="hover:shadow-soft transition-all duration-300 border-2">
              <QrCode className="w-5 h-5 mr-2" />
              QR Code
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Health Passport Card */}
          <div className="lg:col-span-2">
            <Card className="shadow-hover border-2 border-primary/20 animate-fade-in overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 text-white p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-slide-left"></div>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl mb-2">Digital Health Passport</CardTitle>
                    <CardDescription className="text-white/80">
                      Official Medical ID - {userInfo.passportId}
                    </CardDescription>
                  </div>
                  <QrCode className="w-16 h-16 text-white/80" />
                </div>
              </CardHeader>
              <CardContent className="p-8">
                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4">Personal Information</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <User className="w-5 h-5 text-primary" />
                        <div>
                          <p className="font-medium">{userInfo.name}</p>
                          <p className="text-sm text-muted-foreground">Age: {userInfo.age} years</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <MapPin className="w-5 h-5 text-primary" />
                        <p className="text-sm">{userInfo.address}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Phone className="w-5 h-5 text-primary" />
                        <p className="text-sm">{userInfo.phone}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Mail className="w-5 h-5 text-primary" />
                        <p className="text-sm">{userInfo.email}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4">Medical Profile</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-primary-soft rounded-lg">
                        <span className="font-medium">Blood Group</span>
                        <Badge className="bg-primary text-primary-foreground text-lg font-bold">
                          {userInfo.bloodGroup}
                        </Badge>
                      </div>
                      <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                        <span>Height</span>
                        <span className="font-medium">{userInfo.height}</span>
                      </div>
                      <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                        <span>Weight</span>
                        <span className="font-medium">{userInfo.weight}</span>
                      </div>
                      <div className="p-3 bg-warning/10 rounded-lg border-l-4 border-l-warning">
                        <p className="text-sm font-medium">Emergency Contact</p>
                        <p className="text-sm text-muted-foreground">{userInfo.emergencyContact}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chronic Conditions */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                    <AlertTriangle className="w-5 h-5 text-warning mr-2" />
                    Chronic Conditions
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {chronicConditions.map((condition, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{condition.name}</h4>
                          {condition.controlled ? (
                            <CheckCircle className="w-5 h-5 text-success" />
                          ) : (
                            <AlertTriangle className="w-5 h-5 text-warning" />
                          )}
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className={`font-medium ${getSeverityColor(condition.severity)}`}>
                            {condition.severity}
                          </span>
                          <Badge variant={condition.controlled ? "secondary" : "destructive"}>
                            {condition.controlled ? "Controlled" : "Uncontrolled"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Allergies */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                    <Shield className="w-5 h-5 text-destructive mr-2" />
                    Known Allergies
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {allergies.map((allergy, index) => (
                      <div key={index} className="p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-destructive">{allergy.allergen}</h4>
                          <Badge variant="destructive">{allergy.severity}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{allergy.reaction}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Current Medications */}
            <Card className="shadow-card animate-slide-up">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="w-5 h-5 text-primary mr-2" />
                  Current Medications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {medications.map((med, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <h4 className="font-medium">{med.name}</h4>
                      <p className="text-sm text-muted-foreground">{med.dosage} - {med.frequency}</p>
                      <p className="text-xs text-primary mt-1">{med.purpose}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Vaccination Status */}
            <Card className="shadow-card animate-slide-up" style={{ animationDelay: '200ms' }}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 text-success mr-2" />
                  Vaccination Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {vaccinations.map((vaccine, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium text-sm">{vaccine.vaccine}</h4>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          <span>{vaccine.date}</span>
                        </div>
                      </div>
                      <Badge className={getStatusColor(vaccine.status)}>
                        {vaccine.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-card animate-slide-up" style={{ animationDelay: '400ms' }}>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Share className="w-4 h-4 mr-2" />
                  Share with Doctor
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Clock className="w-4 h-4 mr-2" />
                  Update Information
                </Button>
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
      </div>
    </AppLayout>
  );
};

export default HealthPassport;