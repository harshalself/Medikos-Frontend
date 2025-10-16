import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { AppLayout } from "@/components/layout/AppLayout";
import { 
  Heart, 
  User, 
  LogOut, 
  Search,
  Pill,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Info,
  TrendingDown,
  Clock,
  Star,
  Shield,
  Lightbulb
} from "lucide-react";

interface Medicine {
  id: string;
  prescribedMedicine: string;
  composition: string;
  genericAlternatives: {
    name: string;
    manufacturer: string;
    composition: string;
    availability: 'Available' | 'Limited' | 'Out of Stock';
    rating: number;
    reason: string;
  }[];
  commonUses: string[];
  sideEffects: string[];
  precautions: string[];
}

const GenericMedicine = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Medicine[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);

  // Sample data - in real app this would come from API
  const sampleMedicines: Medicine[] = [
    {
      id: "1",
      prescribedMedicine: "Crocin",
      composition: "Paracetamol 500mg",
      genericAlternatives: [
        {
          name: "Paracetamol Tablets",
          manufacturer: "Sun Pharma",
          composition: "Paracetamol 500mg",
          availability: "Available",
          rating: 4.5,
          reason: "Same active ingredient (Paracetamol) with identical therapeutic effect for fever and pain relief"
        },
        {
          name: "Dolo 650",
          manufacturer: "Micro Labs",
          composition: "Paracetamol 650mg",
          availability: "Available",
          rating: 4.3,
          reason: "Higher strength Paracetamol for more effective pain and fever management"
        }
      ],
      commonUses: ["Fever", "Headache", "Body pain", "Cold symptoms"],
      sideEffects: ["Nausea", "Skin rash (rare)", "Liver damage (overdose)"],
      precautions: ["Do not exceed 4g per day", "Avoid alcohol", "Consult doctor if pregnant"]
    },
    {
      id: "2",
      prescribedMedicine: "Augmentin",
      composition: "Amoxicillin 500mg + Clavulanic Acid 125mg",
      genericAlternatives: [
        {
          name: "Amoxyclav",
          manufacturer: "Cipla",
          composition: "Amoxicillin 500mg + Clavulanic Acid 125mg",
          availability: "Available",
          rating: 4.4,
          reason: "Identical antibiotic combination for bacterial infections with same efficacy profile"
        },
        {
          name: "Clavam",
          manufacturer: "Alkem Laboratories",
          composition: "Amoxicillin 500mg + Clavulanic Acid 125mg",
          availability: "Available",
          rating: 4.2,
          reason: "Bioequivalent formulation with proven effectiveness against resistant bacteria"
        }
      ],
      commonUses: ["Bacterial infections", "Respiratory tract infections", "UTI", "Skin infections"],
      sideEffects: ["Diarrhea", "Nausea", "Abdominal pain", "Skin rash"],
      precautions: ["Complete full course", "Take with food", "Inform about allergies"]
    },
    {
      id: "3",
      prescribedMedicine: "Norvasc",
      composition: "Amlodipine 5mg",
      genericAlternatives: [
        {
          name: "Amlodipine Tablets",
          manufacturer: "Lupin",
          composition: "Amlodipine 5mg",
          availability: "Available",
          rating: 4.3,
          reason: "Generic calcium channel blocker with identical blood pressure lowering effect"
        },
        {
          name: "Amlong",
          manufacturer: "Micro Labs",
          composition: "Amlodipine 5mg",
          availability: "Available",
          rating: 4.1,
          reason: "Proven antihypertensive with same cardiovascular protection benefits"
        }
      ],
      commonUses: ["High blood pressure", "Chest pain (angina)", "Coronary artery disease"],
      sideEffects: ["Swelling of ankles", "Dizziness", "Flushing", "Fatigue"],
      precautions: ["Take regularly", "Monitor blood pressure", "Avoid grapefruit juice"]
    }
  ];

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Search Required",
        description: "Please enter a medicine name to search",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const results = sampleMedicines.filter(med => 
        med.prescribedMedicine.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(results);
      setIsLoading(false);
      
      if (results.length === 0) {
        toast({
          title: "No Results Found",
          description: "Try searching with different prescribed medicine name",
        });
      }
    }, 1500);
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'Available': return 'bg-green-100 text-green-800';
      case 'Limited': return 'bg-yellow-100 text-yellow-800';
      case 'Out of Stock': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 relative overflow-hidden">
        {/* Background Healthcare Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-8"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1559757148-5c9f2214b6e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')"
          }}
        />

      {/* Hero Section with Background Image */}
      <section className="relative z-10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-teal-500 to-cyan-600 mb-6 shadow-xl animate-float">
              <Pill className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 animate-fade-in">
              Generic Medicine Suggester
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto animate-slide-up">
              Find affordable generic alternatives to branded medicines with detailed composition analysis and cost savings
            </p>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="relative z-10 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm animate-slide-up">
            <CardHeader>
              <CardTitle className="text-2xl text-center flex items-center justify-center gap-3">
                <Search className="w-6 h-6 text-teal-600" />
                Search Generic Medicine
              </CardTitle>
              <CardDescription className="text-center text-lg">
                Enter the prescribed medicine to find alternatives
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-4">
                <Input
                  placeholder="e.g., Crocin, Augmentin, Norvasc..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="text-lg py-6 transition-all duration-300 focus:shadow-medical"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button
                  size="lg"
                  onClick={handleSearch}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:shadow-hover transition-all duration-300 px-8"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  ) : (
                    <>
                      <Search className="w-5 h-5 mr-2" />
                      Search Generic Medicine
                    </>
                  )}
                </Button>
              </div>

            </CardContent>
          </Card>
        </div>
      </section>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <section className="relative z-10 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {searchResults.map((medicine) => (
              <div key={medicine.id} className="mb-12">
                {/* Prescribed Medicine Information */}
                <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm mb-6">
                  <CardHeader>
                    <CardTitle className="text-2xl text-blue-700 mb-2">
                      Prescribed Medicine: {medicine.prescribedMedicine}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-blue-50 p-6 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                        <Info className="w-5 h-5" />
                        Active Composition
                      </h4>
                      <p className="text-blue-700 text-lg font-medium">{medicine.composition}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Generic Alternatives */}
                <h3 className="text-2xl font-bold text-foreground mb-6">
                  Suggested Generic Medicine
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {medicine.genericAlternatives.map((alternative, index) => (
                    <Card 
                      key={index}
                      className="shadow-lg border-0 bg-white/95 backdrop-blur-sm hover:shadow-xl transition-all duration-300 card-hover"
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-xl text-teal-700 mb-2">
                              {alternative.name}
                            </CardTitle>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Composition */}
                        <div className="bg-green-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                            <Shield className="w-4 h-4" />
                            Composition
                          </h4>
                          <p className="text-green-700">{alternative.composition}</p>
                        </div>


                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}



      {/* Important Information Section */}
      <section className="py-8 bg-gradient-to-br from-teal-50 to-blue-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-md border border-teal-200">
            <div className="flex items-center mb-3">
              <Info className="w-5 h-5 text-teal-600 mr-2" />
              <h4 className="font-medium text-foreground">Medicine Disclaimer</h4>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Generic medicines contain the same active ingredients as brand medicines. Always consult your healthcare provider before switching to ensure it's appropriate for your condition.
            </p>
          </div>
        </div>
      </section>
      </div>
    </AppLayout>
  );
};

export default GenericMedicine;