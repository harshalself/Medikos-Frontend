import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { AppLayout } from "@/components/layout/AppLayout";
import { 
  User, 
  Edit,
  Save,
  Camera,
  Phone,
  Mail,
  MapPin,
  Shield,
  FileText
} from "lucide-react";

const Profile = () => {
  const { toast } = useToast();
  const [profile, setProfile] = useState({
    name: "Sankalp Sharma",
    email: "sankalp@example.com",
    phone: "+91 98765 43210",
    address: "Mumbai, Maharashtra, India",
    emergencyContact: "Priya Sharma - +91 98765 43211",
    bio: "Software engineer with interest in natural health and wellness practices.",
    dateOfBirth: "1990-05-15",
    bloodType: "O+",
    height: "175 cm",
    weight: "70 kg"
  });

  const [isEditing, setIsEditing] = useState(false);



  const handleSaveProfile = () => {
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved successfully.",
    });
  };

  const handlePhotoUpload = () => {
    toast({
      title: "Photo Upload",
      description: "Profile photo upload feature coming soon!",
    });
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-teal-500 to-cyan-600 mb-6 shadow-xl animate-float">
              <User className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">My Profile</h1>
            <p className="text-xl text-gray-600">Manage your personal information and account settings</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Information Card */}
            <Card className="lg:col-span-2 shadow-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <User className="w-5 h-5 text-teal-600" />
                      <span>Profile Information</span>
                    </CardTitle>
                    <CardDescription>
                      Update your personal information and contact details
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                    className="hover:shadow-lg transition-all duration-300"
                  >
                    {isEditing ? (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </>
                    ) : (
                      <>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Picture */}
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center shadow-xl">
                      <User className="w-10 h-10 text-white" />
                    </div>
                    <button 
                      onClick={handlePhotoUpload}
                      className="absolute -bottom-1 -right-1 w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center hover:bg-teal-700 transition-colors shadow-lg"
                    >
                      <Camera className="w-4 h-4 text-white" />
                    </button>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{profile.name}</h3>
                    <p className="text-gray-600">Profile Photo</p>
                    <Badge variant="outline" className="mt-2">Verified User</Badge>
                  </div>
                </div>

                {/* Profile Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="name"
                        value={profile.name}
                        onChange={(e) => setProfile({...profile, name: e.target.value})}
                        disabled={!isEditing}
                        className="pl-10 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({...profile, email: e.target.value})}
                        disabled={!isEditing}
                        className="pl-10 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="phone"
                        value={profile.phone}
                        onChange={(e) => setProfile({...profile, phone: e.target.value})}
                        disabled={!isEditing}
                        className="pl-10 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input
                      id="dob"
                      type="date"
                      value={profile.dateOfBirth}
                      onChange={(e) => setProfile({...profile, dateOfBirth: e.target.value})}
                      disabled={!isEditing}
                      className="focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emergency">Emergency Contact</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="emergency"
                        value={profile.emergencyContact}
                        onChange={(e) => setProfile({...profile, emergencyContact: e.target.value})}
                        disabled={!isEditing}
                        className="pl-10 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bloodType">Blood Type</Label>
                    <Input
                      id="bloodType"
                      value={profile.bloodType}
                      onChange={(e) => setProfile({...profile, bloodType: e.target.value})}
                      disabled={!isEditing}
                      className="focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Textarea
                      id="address"
                      value={profile.address}
                      onChange={(e) => setProfile({...profile, address: e.target.value})}
                      disabled={!isEditing}
                      className="pl-10 min-h-[80px] focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself..."
                    value={profile.bio}
                    onChange={(e) => setProfile({...profile, bio: e.target.value})}
                    disabled={!isEditing}
                    className="min-h-[100px] focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Account Security Card */}
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  <span>Account Security</span>
                </CardTitle>
                <CardDescription>
                  Manage your account security and privacy settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Two-Factor Authentication</h4>
                    <p className="text-sm text-gray-600">Add an extra layer of security</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Enable
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Password</h4>
                    <p className="text-sm text-gray-600">Last changed 3 months ago</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Change
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Privacy Settings</h4>
                    <p className="text-sm text-gray-600">Control your data visibility</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Manage
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Profile;