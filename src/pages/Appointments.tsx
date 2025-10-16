import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BackButton } from "@/components/ui/back-button";
import { useToast } from "@/hooks/use-toast";
import { 
  Heart, 
  User, 
  LogOut, 
  Search,
  MapPin,
  Calendar,
  Clock,
  Star,
  Filter,
  Map,
  List,
  Phone,
  CheckCircle,
  Award
} from "lucide-react";

const Appointments = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");
  const [viewMode, setViewMode] = useState<"list" | "map">("list");

  const specialties = ["All", "Cardiology", "Dermatology", "Orthopedics", "Pediatrics", "Neurology", "Psychiatry"];

  const doctors = [
    {
      id: 1,
      name: "Dr. Rajesh Kumar",
      specialty: "Cardiology",
      qualification: "MD, DM Cardiology",
      experience: "15 years",
      rating: 4.8,
      reviews: 245,
      hospital: "Apollo Hospital",
      location: "Andheri West, Mumbai",
      distance: "2.3 km",
      fee: "₹800",
      availability: "Today 3:00 PM",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face",
      verified: true,
      languages: ["Hindi", "English", "Marathi"]
    },
    {
      id: 2,
      name: "Dr. Priya Sharma",
      specialty: "Dermatology",
      qualification: "MD Dermatology",
      experience: "12 years",
      rating: 4.9,
      reviews: 180,
      hospital: "Lilavati Hospital",
      location: "Bandra West, Mumbai",
      distance: "4.1 km",
      fee: "₹1200",
      availability: "Tomorrow 10:00 AM",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
      verified: true,
      languages: ["Hindi", "English"]
    },
    {
      id: 3,
      name: "Dr. Amit Patel",
      specialty: "Orthopedics",
      qualification: "MS Orthopedics",
      experience: "18 years",
      rating: 4.7,
      reviews: 320,
      hospital: "Hinduja Hospital",
      location: "Mahim, Mumbai",
      distance: "3.8 km",
      fee: "₹1000",
      availability: "Today 5:30 PM",
      image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face",
      verified: true,
      languages: ["Hindi", "English", "Gujarati"]
    },
    {
      id: 4,
      name: "Dr. Sunita Reddy",
      specialty: "Pediatrics",
      qualification: "MD Pediatrics",
      experience: "10 years",
      rating: 4.6,
      reviews: 150,
      hospital: "Kokilaben Hospital",
      location: "Andheri West, Mumbai",
      distance: "1.9 km",
      fee: "₹600",
      availability: "Tomorrow 2:00 PM",
      image: "https://images.unsplash.com/photo-1594824848637-114eaec451c7?w=150&h=150&fit=crop&crop=face",
      verified: true,
      languages: ["Hindi", "English", "Telugu"]
    },
    {
      id: 5,
      name: "Dr. Vikram Singh",
      specialty: "Neurology",
      qualification: "DM Neurology",
      experience: "20 years",
      rating: 4.9,
      reviews: 290,
      hospital: "Breach Candy Hospital",
      location: "South Mumbai",
      distance: "6.2 km",
      fee: "₹1500",
      availability: "Tomorrow 11:30 AM",
      image: "https://images.unsplash.com/photo-1638202993928-7267aad84c31?w=150&h=150&fit=crop&crop=face",
      verified: true,
      languages: ["Hindi", "English", "Punjabi"]
    },
    {
      id: 6,
      name: "Dr. Meera Joshi",
      specialty: "Psychiatry",
      qualification: "MD Psychiatry",
      experience: "8 years",
      rating: 4.5,
      reviews: 95,
      hospital: "Jaslok Hospital",
      location: "Peddar Road, Mumbai",
      distance: "5.5 km",
      fee: "₹900",
      availability: "Today 4:00 PM",
      image: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=150&h=150&fit=crop&crop=face",
      verified: true,
      languages: ["Hindi", "English", "Marathi"]
    }
  ];

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doctor.hospital.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doctor.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty = selectedSpecialty === "All" || doctor.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="border-b glass sticky top-0 z-50 shadow-hover">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <Heart className="w-8 h-8 text-primary" />
              <span className="text-xl font-bold text-foreground">Medikos</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <BackButton />
              <Link to="/dashboard">
                <Button variant="outline" size="sm">Dashboard</Button>
              </Link>
              <Link to="/">
                <Button variant="outline" size="sm">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </Link>
              <div className="w-8 h-8 rounded-full bg-gradient-medical flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center mb-6">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-xl animate-bounce-slow">
              <Calendar className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 animate-fade-in text-center">
            Book Appointment
          </h1>
          <p className="text-xl text-muted-foreground mb-8 animate-slide-up text-center max-w-2xl mx-auto">
            Find and schedule appointments with verified healthcare professionals near you
          </p>
          <div className="flex justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <span className="font-medium">500+ Doctors</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <span className="font-medium">Instant Booking</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-warning rounded-full animate-pulse"></div>
              <span className="font-medium">Video Consult Available</span>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search doctors, hospitals, or specialties..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 transition-all duration-300 focus:shadow-medical"
              />
            </div>

            {/* View Toggle */}
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4 mr-2" />
                List
              </Button>
              <Button
                variant={viewMode === "map" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("map")}
              >
                <Map className="w-4 h-4 mr-2" />
                Map
              </Button>
            </div>
          </div>

          {/* Specialty Filters */}
          <div className="flex items-center space-x-2 overflow-x-auto">
            <Filter className="w-4 h-4 text-muted-foreground mr-2" />
            {specialties.map((specialty) => (
              <Button
                key={specialty}
                variant={selectedSpecialty === specialty ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedSpecialty(specialty)}
                className="whitespace-nowrap transition-all duration-200"
              >
                {specialty}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Doctors List */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {viewMode === "map" ? (
          /* Map View Placeholder */
          <Card className="h-96 shadow-card animate-fade-in">
            <CardContent className="flex items-center justify-center h-full">
              <div className="text-center">
                <Map className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">Map View</h3>
                <p className="text-muted-foreground">
                  Interactive map showing nearby doctors and hospitals
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          /* List View */
          <div className="space-y-6">
            {filteredDoctors.map((doctor, index) => (
              <Card 
                key={doctor.id} 
                className="group hover:shadow-medical transition-all duration-300 animate-slide-up border-0 shadow-card"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Doctor Image */}
                    <div className="flex-shrink-0">
                      <div className="relative group-hover:scale-105 transition-transform">
                        <img
                          src={doctor.image}
                          alt={doctor.name}
                          className="w-28 h-28 rounded-3xl object-cover border-4 border-primary/20 shadow-lg"
                        />
                        {doctor.verified && (
                          <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-success to-green-600 rounded-full flex items-center justify-center shadow-lg animate-bounce-slow">
                            <CheckCircle className="w-5 h-5 text-white" />
                          </div>
                        )}
                      </div>
                    </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                          <div>
                            <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors mb-2">
                              {doctor.name}
                            </h3>
                            <p className="text-muted-foreground mb-3 font-medium">{doctor.qualification}</p>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                              <div className="flex items-center space-x-2 bg-primary/5 px-3 py-1 rounded-full">
                                <Award className="w-4 h-4 text-primary" />
                                <span className="font-medium">{doctor.experience} experience</span>
                              </div>
                              <div className="flex items-center space-x-2 bg-warning/10 px-3 py-1 rounded-full">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="font-semibold">{doctor.rating}</span>
                                <span className="text-muted-foreground">({doctor.reviews} reviews)</span>
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-3xl font-bold bg-gradient-to-r from-primary to-cyan-600 bg-clip-text text-transparent mb-1">
                              {doctor.fee}
                            </div>
                            <p className="text-sm text-muted-foreground font-medium">Consultation Fee</p>
                          </div>
                        </div>

                      {/* Hospital & Location */}
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-primary" />
                            <span className="text-sm font-medium">{doctor.hospital}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              {doctor.location} • {doctor.distance} away
                            </span>
                          </div>
                        </div>

                        <div className="mt-2 md:mt-0">
                          <Badge className="bg-primary text-primary-foreground">
                            {doctor.specialty}
                          </Badge>
                        </div>
                      </div>

                      {/* Languages & Availability */}
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <span>Languages:</span>
                          <span>{doctor.languages.join(", ")}</span>
                        </div>

                        <div className="flex items-center space-x-2 text-sm font-medium text-success">
                          <Clock className="w-4 h-4" />
                          <span>Available {doctor.availability}</span>
                        </div>
                      </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3">
                          <Button 
                            className="flex-1 bg-gradient-to-r from-primary to-cyan-600 hover:shadow-hover transition-all duration-300 hover-scale text-base py-6"
                            onClick={() => {
                              toast({
                                title: "Appointment Booking",
                                description: `Booking appointment with ${doctor.name}`,
                              });
                            }}
                          >
                            <Calendar className="w-5 h-5 mr-2" />
                            Book Appointment
                          </Button>
                          <Button 
                            variant="outline" 
                            className="flex-1 hover-scale border-2"
                            onClick={() => {
                              toast({
                                title: "Calling Doctor",
                                description: "Connecting your call...",
                              });
                            }}
                          >
                            <Phone className="w-5 h-5 mr-2" />
                            Call Now
                          </Button>
                          <Button 
                            variant="outline"
                            className="hover-scale border-2"
                            onClick={() => {
                              toast({
                                title: "Doctor Profile",
                                description: `Viewing ${doctor.name}'s profile`,
                              });
                            }}
                          >
                            View Profile
                          </Button>
                        </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredDoctors.length === 0 && viewMode === "list" && (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No doctors found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}

          {/* Info Section */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="card-hover shadow-lg border-0 bg-gradient-to-br from-green-50 to-emerald-50 animate-fade-in">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2">Verified Doctors</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  All doctors are verified with valid medical licenses and certifications
                </p>
              </CardContent>
            </Card>

            <Card className="card-hover shadow-lg border-0 bg-gradient-to-br from-blue-50 to-cyan-50 animate-fade-in" style={{ animationDelay: '100ms' }}>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2">Easy Booking</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Book appointments online with instant confirmation and reminders
                </p>
              </CardContent>
            </Card>

            <Card className="card-hover shadow-lg border-0 bg-gradient-to-br from-red-50 to-pink-50 animate-fade-in" style={{ animationDelay: '200ms' }}>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2">Quality Care</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Connect with top-rated healthcare professionals in your area
                </p>
              </CardContent>
            </Card>
          </div>
      </main>
    </div>
  );
};

export default Appointments;