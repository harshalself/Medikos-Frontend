import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AppLayout } from "@/components/layout/AppLayout";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Leaf, Check, X, Flower2, Droplets, Sun, Moon, AlertTriangle, TrendingUp } from "lucide-react";
import remediesBg from "@/assets/remedies-bg.jpg";
import { motion } from "framer-motion";
import { useRemediesSuggestion, RemediesSuggestion } from "@/hooks/use-remedies-suggestion";

const Remedies = () => {
  const { toast } = useToast();
  const { suggestRemedies, loading, error } = useRemediesSuggestion();

  const [symptomsInput, setSymptomsInput] = useState("");
  const [remediesResult, setRemediesResult] = useState<RemediesSuggestion | null>(null);
  const [showResults, setShowResults] = useState(false);

  const suggestions = [
    "headache", "fever", "cold", "cough", "acidity", "bloating", "stress", "insomnia",
    "joint pain", "indigestion", "anxiety", "fatigue", "skin rash", "nausea",
    "frequent urination", "excessive thirst", "blurred vision", "slow healing wounds"
  ];

  const handleGetRemedies = async () => {
    if (!symptomsInput.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter your symptoms or health concerns first.",
        variant: "destructive"
      });
      return;
    }

    if (symptomsInput.trim().length < 3) {
      toast({
        title: "Input Too Short",
        description: "Please provide at least 3 characters describing your symptoms.",
        variant: "destructive"
      });
      return;
    }

    try {
      const result = await suggestRemedies(symptomsInput);
      if (result) {
        setRemediesResult(result);
        setShowResults(true);
        toast({
          title: "Remedies Found!",
          description: `Natural remedies for ${result.disease} generated successfully.`,
        });
      }
    } catch (err) {
      // Error is already handled in the hook
      setShowResults(false);
    }
  };

  const getConfidenceColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'high': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getConfidenceTextColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'high': return 'text-green-700';
      case 'medium': return 'text-yellow-700';
      case 'low': return 'text-red-700';
      default: return 'text-gray-700';
    }
  };

  const filteredSuggestions = suggestions.filter(suggestion =>
    suggestion.toLowerCase().includes(symptomsInput.toLowerCase()) && symptomsInput.length > 0
  );

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 relative overflow-hidden">

      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${remediesBg})` }}
        >
          <div className="absolute inset-0 bg-gradient-healing opacity-90"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-green-500 to-emerald-600 mb-6 shadow-xl animate-float">
            <Leaf className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 animate-fade-in">
            Natural Remedies & Diet Suggestions
          </h1>
          <p className="text-xl text-muted-foreground mb-8 animate-slide-up">
            Get AI-powered natural healing solutions and dietary guidance based on traditional Indian medicine
          </p>
        </div>
      </section>

      {/* Input Section */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="shadow-medical">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Leaf className="w-5 h-5 text-primary" />
                <span>Describe Your Symptoms or Health Concerns</span>
              </CardTitle>
              <CardDescription>
                Enter your symptoms, health conditions, or wellness goals. Our AI will match them with traditional remedies and diet suggestions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Textarea
                  placeholder="Describe your symptoms (e.g., frequent urination, excessive thirst, fatigue, blurred vision)..."
                  value={symptomsInput}
                  onChange={(e) => setSymptomsInput(e.target.value)}
                  className="min-h-[100px] transition-all duration-300 focus:shadow-medical"
                />

                {/* Suggestion Pills */}
                {filteredSuggestions.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="text-sm text-muted-foreground">Suggestions:</span>
                    {filteredSuggestions.slice(0, 5).map((suggestion, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                        onClick={() => setSymptomsInput(suggestion)}
                      >
                        {suggestion}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <Button
                onClick={handleGetRemedies}
                className="w-full transition-all duration-300 hover:shadow-medical"
                size="lg"
                disabled={loading || !symptomsInput.trim()}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Analyzing Symptoms...
                  </>
                ) : (
                  <>
                    <Leaf className="w-4 h-4 mr-2" />
                    Get Natural Remedies
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Results Section */}
      {showResults && remediesResult && (
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Disease and Confidence Header */}
            <div className="mb-8 text-center">
              <div className="inline-flex items-center space-x-3 mb-4">
                <Badge className={`${getConfidenceColor(remediesResult.confidence_level)} text-white px-4 py-2`}>
                  <TrendingUp className="w-4 h-4 mr-2" />
                  {remediesResult.confidence_level} Confidence
                </Badge>
                <span className={`text-sm font-medium ${getConfidenceTextColor(remediesResult.confidence_level)}`}>
                  Match Score: {Math.round(remediesResult.match_score * 100)}%
                </span>
              </div>

              <h2 className="text-3xl font-bold text-foreground mb-2">
                Possible Condition: {remediesResult.disease}
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Based on symptoms: {remediesResult.symptoms}
              </p>
            </div>

            <Tabs defaultValue="remedies" className="space-y-8">
              <TabsList className="grid w-full grid-cols-2 lg:w-auto">
                <TabsTrigger value="remedies" className="space-x-2">
                  <Flower2 className="w-4 h-4" />
                  <span>Natural Remedies</span>
                </TabsTrigger>
                <TabsTrigger value="diet" className="space-x-2">
                  <Droplets className="w-4 h-4" />
                  <span>Diet Suggestions</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="remedies" className="space-y-6">
                <Card className="card-hover shadow-card border-t-4 border-t-success">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center space-x-2">
                      <Leaf className="w-6 h-6 text-success" />
                      <span className="gradient-text">🌿 Natural Remedies</span>
                    </CardTitle>
                    <CardDescription>Ayurveda-inspired natural healing solutions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none">
                      <p className="text-sm leading-relaxed whitespace-pre-line">
                        {remediesResult.natural_remedies}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="diet" className="space-y-6">
                <Card className="card-hover shadow-card border-t-4 border-t-primary">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center space-x-2">
                      <Droplets className="w-6 h-6 text-primary" />
                      <span className="gradient-text">🥗 Diet Suggestions</span>
                    </CardTitle>
                    <CardDescription>Traditional dietary recommendations for healing</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none">
                      <p className="text-sm leading-relaxed whitespace-pre-line">
                        {remediesResult.diet_suggestions}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Additional Diet Tips */}
                <Card className="shadow-card bg-gradient-healing border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Flower2 className="w-5 h-5 text-primary" />
                      <span>Ayurvedic Diet Principles</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-white rounded-lg">
                      <h4 className="font-semibold mb-2 flex items-center space-x-2">
                        <Sun className="w-4 h-4 text-warning" />
                        <span>Timing</span>
                      </h4>
                      <p className="text-sm text-muted-foreground">Eat meals at regular times, avoid late-night eating</p>
                    </div>
                    <div className="p-4 bg-white rounded-lg">
                      <h4 className="font-semibold mb-2 flex items-center space-x-2">
                        <Flower2 className="w-4 h-4 text-success" />
                        <span>Mindful Eating</span>
                      </h4>
                      <p className="text-sm text-muted-foreground">Eat slowly, chew thoroughly, avoid distractions</p>
                    </div>
                    <div className="p-4 bg-white rounded-lg">
                      <h4 className="font-semibold mb-2 flex items-center space-x-2">
                        <Droplets className="w-4 h-4 text-primary" />
                        <span>Hydration</span>
                      </h4>
                      <p className="text-sm text-muted-foreground">Drink warm water, avoid cold beverages with meals</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Processing Time */}
            <div className="mt-6 text-center text-sm text-muted-foreground">
              Analysis completed in {remediesResult.processing_time_ms}ms
            </div>
          </motion.div>
        </main>
      )}

      {/* Medical Disclaimer - Always Visible */}
      <div className="mt-12 p-6 bg-amber-50 border-l-4 border-l-amber-400 mx-4 sm:mx-6 lg:mx-8 rounded-lg">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-6 h-6 text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-amber-800 mb-2">⚠️ Medical Disclaimer</h4>
            <p className="text-sm text-amber-700 leading-relaxed">
              This information is for educational purposes only and is not a substitute for professional medical advice.
              Always consult with a qualified healthcare provider before starting any new treatment or remedy.
              Natural remedies may interact with medications or have contraindications. The suggestions are based on
              traditional Indian medicine (Ayurveda) and should complement, not replace, conventional medical care.
            </p>
          </div>
        </div>
      </div>
      </div>
    </AppLayout>
  );
};

export default Remedies;