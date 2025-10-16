import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AppLayout } from "@/components/layout/AppLayout";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BackButton } from "@/components/ui/back-button";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { Heart, User, LogOut, Leaf, Check, X, Flower2, Droplets, Sun, Moon } from "lucide-react";
import remediesBg from "@/assets/remedies-bg.jpg";
import { motion } from "framer-motion";

const Remedies = () => {
  const { toast } = useToast();
  const [symptomsInput, setSymptomsInput] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [suggestions] = useState([
    "headache", "fever", "cold", "cough", "acidity", "bloating", "stress", "insomnia", 
    "joint pain", "indigestion", "anxiety", "fatigue", "skin rash", "nausea"
  ]);
  


  const naturalRemedies = [
    "Cool compress on affected area",
    "Apply aloe vera gel",
    "Avoid direct sun exposure",
    "Stay hydrated with plenty of water",
    "Use turmeric paste for inflammation",
    "Take honey with warm water",
    "Practice deep breathing exercises",
    "Get adequate rest and sleep"
  ];

  const dietRecommendations = {
    recommended: [
      "Bland diet with rice and dal",
      "Fresh fruits like bananas and apples", 
      "Warm water throughout the day",
      "Herbal teas (ginger, tulsi)",
      "Light vegetables (bottle gourd, spinach)",
      "Low-FODMAP foods"
    ],
    avoid: [
      "Spicy and oily foods",
      "Onions and garlic in excess",
      "Wheat and refined grains",
      "Beans and legumes (if bloating)",
      "Cold drinks and ice cream",
      "Processed foods"
    ]
  };

  const handleGetRemedies = () => {
    if (!symptomsInput.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter your symptoms or health concerns first.",
        variant: "destructive"
      });
      return;
    }

    setShowResults(true);
    toast({
      title: "Natural Remedies Analysis Complete",
      description: "Personalized remedies and diet suggestions generated based on your symptoms.",
    });
  };

  const filteredSuggestions = suggestions.filter(suggestion =>
    suggestion.toLowerCase().includes(symptomsInput.toLowerCase()) && 
    symptomsInput.length > 0
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
            Get personalized natural healing solutions and dietary guidance based on your symptoms
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
                Enter your symptoms, health conditions, or wellness goals. We'll suggest similar terms to help you.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Textarea
                  placeholder="Type your symptoms here (e.g., headache, stress, digestion issues)..."
                  value={symptomsInput}
                  onChange={(e) => setSymptomsInput(e.target.value)}
                  className="min-h-[100px] transition-all duration-300 focus:shadow-medical"
                />
                

              </div>
              
              <Button 
                onClick={handleGetRemedies}
                className="w-full transition-all duration-300 hover:shadow-medical"
                size="lg"
              >
                <Leaf className="w-4 h-4 mr-2" />
                Get Natural Remedies
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Results Section */}
      {showResults && (
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground flex items-center space-x-2 text-center">
                  <Leaf className="w-6 h-6 text-success" />
                  <span>Natural Remedies</span>
                </h2>
                
                {/* Natural Remedies Card */}
                <Card className="card-hover shadow-card border-t-4 border-t-success">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center space-x-2">
                      <Leaf className="w-6 h-6 text-success" />
                      <span className="gradient-text">Natural Remedies</span>
                    </CardTitle>
                    <CardDescription>Follow these natural healing solutions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {naturalRemedies.map((remedy, index) => (
                        <li 
                          key={index} 
                          className="flex items-start space-x-3 p-2 rounded-lg hover:bg-success/5 transition-colors animate-fade-in"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <Check className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                          <span className="text-sm leading-relaxed">{remedy}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="diet" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Recommended Foods */}
                <Card className="card-hover shadow-card border-t-4 border-t-success">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center space-x-2">
                      <Check className="w-6 h-6 text-success" />
                      <span className="gradient-text">Recommended Foods</span>
                    </CardTitle>
                    <CardDescription>Include these in your daily diet</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {dietRecommendations.recommended.map((item, index) => (
                        <li 
                          key={index} 
                          className="flex items-start space-x-3 p-2 rounded-lg hover:bg-success/5 transition-colors animate-fade-in"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <Check className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                          <span className="text-sm leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Foods to Avoid */}
                <Card className="card-hover shadow-card border-t-4 border-t-destructive">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center space-x-2">
                      <X className="w-6 h-6 text-destructive" />
                      <span>Foods to Avoid</span>
                    </CardTitle>
                    <CardDescription>Minimize or avoid these items</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {dietRecommendations.avoid.map((item, index) => (
                        <li 
                          key={index} 
                          className="flex items-start space-x-3 p-2 rounded-lg hover:bg-destructive/5 transition-colors animate-fade-in"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <X className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                          <span className="text-sm leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Additional Diet Tips */}
              <Card className="shadow-card bg-gradient-healing border-0">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Droplets className="w-5 h-5 text-primary" />
                    <span>Natural Diet Principles</span>
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

          {/* Medical Disclaimer */}
          <div className="mt-12 p-6 bg-muted/50 rounded-lg border-l-4 border-l-warning">
            <h4 className="font-medium text-foreground mb-2">Natural Remedies Disclaimer</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The natural remedies and dietary recommendations provided are for informational purposes only 
              and are not intended to replace professional medical advice, diagnosis, or treatment. These 
              traditional practices should complement, not replace, conventional medical care. Always consult 
              with qualified healthcare providers and certified natural health practitioners before starting any 
              new treatment regimen.
            </p>
          </div>
        </main>
      )}
      </div>
    </AppLayout>
  );
};

export default Remedies;