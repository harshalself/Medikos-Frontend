import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { AppLayout } from "@/components/layout/AppLayout";
import { api } from "@/lib/api";
import { API_ENDPOINTS, API_BASE_URL } from "@/lib/api-config";
import {
  Search,
  Pill,
  Shield,
  CheckCircle,
  Info
} from "lucide-react";
import {
  MedicineAlternative,
  MedicineSuggestionResponse
} from "@/types/api";

const GenericMedicine = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<MedicineAlternative[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchedMedicine, setSearchedMedicine] = useState<string>("");

  console.log('API_ENDPOINTS:', API_ENDPOINTS);
  console.log('API_BASE_URL:', API_BASE_URL);

  // Get generic alternatives directly
  const handleSearchAlternatives = useCallback(async () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Search Required",
        description: "Please enter a medicine name to search",
        variant: "destructive"
      });
      return;
    }

    if (searchQuery.length < 2) {
      toast({
        title: "Search Too Short",
        description: "Please enter at least 2 characters",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setSuggestions([]);
    setSearchedMedicine(searchQuery);

    try {
      console.log('API Endpoint:', API_ENDPOINTS.medicineSuggester.suggestAlternatives);
      console.log('Search Query:', searchQuery);
      const response: MedicineSuggestionResponse = await api.post(API_ENDPOINTS.medicineSuggester.suggestAlternatives, {
        branded_medicine_name: searchQuery,
        search_type: 'SUGGESTION'
      });
      console.log('Response:', response);

      if (response.alternatives && response.alternatives.length > 0) {
        setSuggestions(response.alternatives);
        toast({
          title: "Alternatives Found",
          description: `Found ${response.alternatives.length} generic alternative(s)`,
        });
      } else {
        toast({
          title: "No Alternatives Found",
          description: "No generic alternatives available for this medicine",
        });
      }
    } catch (error: any) {
      console.error('Suggestions error:', error);
      toast({
        title: "Search Failed",
        description: error.message || "Failed to fetch generic alternatives",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, toast]);

  const getMatchTypeColor = (matchType: string) => {
    switch (matchType) {
      case 'EXACT': return 'bg-green-100 text-green-800';
      case 'FUZZY': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSourceBadgeColor = (source: string) => {
    switch (source.toLowerCase()) {
      case 'nlem': return 'bg-blue-100 text-blue-800';
      case 'jan aushadhi': return 'bg-purple-100 text-purple-800';
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

        {/* Hero Section */}
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
                Find affordable generic alternatives to branded medicines with government-verified data and detailed composition analysis
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
                  Search Generic Alternative
                </CardTitle>
                <CardDescription className="text-center text-lg">
                  Enter a branded medicine name to find generic alternatives
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex gap-4">
                  <Input
                    placeholder="e.g., Crocin, Augmentin, Norvasc..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="text-lg py-6 transition-all duration-300 focus:shadow-medical"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearchAlternatives()}
                  />
                  <Button
                    size="lg"
                    onClick={handleSearchAlternatives}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:shadow-hover transition-all duration-300 px-8"
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                    ) : (
                      <>
                        <Search className="w-5 h-5 mr-2" />
                        Search
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Generic Alternatives */}
        {suggestions.length > 0 && (
          <section className="relative z-10 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Generic Alternatives for "{searchedMedicine}"
                </h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {suggestions.map((alternative, index) => (
                  <Card
                    key={alternative.id || index}
                    className="shadow-lg border-0 bg-white/95 backdrop-blur-sm hover:shadow-xl transition-all duration-300"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-xl text-teal-700 mb-2">
                            {alternative.generic_name}
                          </CardTitle>
                          <div className="flex flex-wrap gap-2 mb-2">
                            <Badge className={getMatchTypeColor(alternative.match_type)}>
                              {alternative.match_type}
                            </Badge>
                            <Badge className={getSourceBadgeColor(alternative.source)}>
                              {alternative.source}
                            </Badge>
                            {alternative.government_verified && (
                              <Badge className="bg-green-100 text-green-800">
                                <Shield className="w-3 h-3 mr-1" />
                                Government Verified
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-muted-foreground">
                            {alternative.confidence_score}% match
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Details */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        {alternative.pack_size && (
                          <div>
                            <span className="font-medium text-muted-foreground">Pack Size:</span>
                            <p>{alternative.pack_size}</p>
                          </div>
                        )}
                        {alternative.drug_code && (
                          <div>
                            <span className="font-medium text-muted-foreground">Drug Code:</span>
                            <p>{alternative.drug_code}</p>
                          </div>
                        )}
                      </div>

                      {/* NLEM Medicine */}
                      {alternative.nlem_medicine && (
                        <div className="bg-green-50 p-3 rounded-lg">
                          <h4 className="font-semibold text-green-800 mb-1 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            NLEM Equivalent
                          </h4>
                          <p className="text-green-700 text-sm">{alternative.nlem_medicine}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Important Information Section */}
        <section className="py-8 bg-gradient-to-br from-teal-50 to-blue-50">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-md border border-teal-200">
              <div className="flex items-center mb-4">
                <Info className="w-5 h-5 text-teal-600 mr-2" />
                <h4 className="font-medium text-foreground">Important Information</h4>
              </div>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>
                  <strong>Government Verification:</strong> All medicine data is sourced from official government databases including NLEM (National List of Essential Medicines) and Jan Aushadhi.
                </p>
                <p>
                  <strong>Generic Medicines:</strong> Generic medicines contain the same active ingredients as branded medicines and are equally effective and safe.
                </p>
                <p>
                  <strong>Medical Advice:</strong> Always consult your healthcare provider before switching medicines to ensure it's appropriate for your condition.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </AppLayout>
  );
};

export default GenericMedicine;