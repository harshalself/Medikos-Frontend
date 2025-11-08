import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { usePredictDisease } from "@/hooks/use-predict-disease";
import { AppLayout } from "@/components/layout/AppLayout";
import { 
  Heart, 
  User, 
  LogOut, 
  Activity,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  Calendar,
  MapPin,
  Thermometer,
  Stethoscope,
  Brain,
  Shield,
  X,
  Plus,
  Search,
  PieChart,
  TrendingDown
} from "lucide-react";

interface SymptomContribution {
  symptom: string;
  contribution: number;
  color: string;
}

interface PredictionResult {
  disease: string;
  probability: number;
  confidence: 'High' | 'Medium' | 'Low';
  symptom_contributions: SymptomContribution[];
  symptom_analysis: {
    primary_symptoms: string[];
    secondary_symptoms: string[];
    contributing_factors: string[];
  };
}

const InfectiousDiseasePrediction = () => {
  const { toast } = useToast();
  const { predictDisease, loading: apiLoading } = usePredictDisease();
  const [symptom1, setSymptom1] = useState("");
  const [symptom2, setSymptom2] = useState("");
  const [symptom3, setSymptom3] = useState("");
  const [symptom4, setSymptom4] = useState("");
  const [symptom5, setSymptom5] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [showResults, setShowResults] = useState(false);

  const MAX_SYMPTOMS = 5;

  const commonSymptoms = [
    "fever", "cough", "sore throat", "headache", "fatigue", 
    "body ache", "nausea", "vomiting", "diarrhea", "shortness of breath",
    "chest pain", "abdominal pain", "skin rash", "joint pain", "chills"
  ];

  const getSymptomArray = () => {
    const symptoms = [symptom1, symptom2, symptom3, symptom4, symptom5]
      .map(s => s.trim().toLowerCase())
      .filter(s => s !== '');
    console.log('Collected symptoms:', symptoms);
    return symptoms;
  };

  const analyzePrediction = async () => {
    const symptoms = getSymptomArray();
    
    console.log('Symptoms array before sending:', symptoms);
    
    if (symptoms.length === 0) {
      toast({
        title: "No Symptoms",
        description: "Please add at least one symptom to analyze",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    setShowResults(false);
    setPrediction(null);
    
    try {
      // Call the real API endpoint on port 8002
      const response = await predictDisease(symptoms);
      
      // Transform API response to match our UI structure
      const sentSymptoms = getSymptomArray();
      const symptomImportanceEntries = Object.entries(response.symptom_importance);
      
      // Create contributions for all sent symptoms, using 0% for unrecognized ones
      const colors = ['#dc2626', '#ef4444', '#f97316', '#fb923c', '#fbbf24'];
      const symptomContributions = sentSymptoms.map((symptom, idx) => {
        const importanceEntry = symptomImportanceEntries.find(([s]) => s === symptom);
        const importance = importanceEntry ? importanceEntry[1] : 0;
        
        return {
          symptom,
          contribution: importance,
          color: colors[idx % colors.length]
        };
      });

      // Sort by contribution for better visualization (highest first)
      symptomContributions.sort((a, b) => b.contribution - a.contribution);

      console.log('Final symptom contributions:', symptomContributions);

      const transformedPrediction: PredictionResult = {
        disease: response.prediction,
        probability: Math.round(
          symptomContributions.reduce((sum, s) => sum + s.contribution, 0)
        ),
        confidence: symptomContributions[0]?.contribution > 35 ? 'High' : 
                     symptomContributions[0]?.contribution > 20 ? 'Medium' : 'Low',
        symptom_contributions: symptomContributions,
        symptom_analysis: {
          primary_symptoms: symptomContributions.slice(0, 2).map(s => s.symptom),
          secondary_symptoms: symptomContributions.slice(2, 4).map(s => s.symptom),
          contributing_factors: ['AI-based symptom pattern analysis', 'Medical knowledge base', 'SHAP explainability']
        }
      };

      setPrediction(transformedPrediction);
      setShowResults(true);
      
      toast({
        title: "Analysis Complete",
        description: "Disease prediction results are ready",
      });
    } catch (error) {
      toast({
        title: "Prediction Failed",
        description: error instanceof Error ? error.message : "Unable to connect to the prediction service. Please ensure the service is running on port 8002.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'High': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 relative">
        {/* Background Healthcare Image - Full screen with better visibility */}
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat opacity-10"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?ixlib=rb-4.0.3&auto=format&fit=crop&w=2086&q=80')"
          }}
        />

      {/* Hero Section with Background Image */}
      <section className="relative z-10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-red-500 to-pink-600 mb-6 shadow-xl animate-float">
              <Activity className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 animate-fade-in">
              Infectious Disease Prediction
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto animate-slide-up">
              Advanced AI-powered analysis to predict potential infectious diseases based on your symptoms
            </p>
          </div>
        </div>
      </section>

      {/* Symptom Input Section */}
      <section className="relative z-10 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm animate-slide-up">
            <CardHeader>
              <CardTitle className="text-2xl text-center flex items-center justify-center gap-3">
                <Stethoscope className="w-6 h-6 text-red-600" />
                Add Your Symptoms (Max {MAX_SYMPTOMS})
              </CardTitle>
              <CardDescription className="text-center text-lg">
                Enter symptoms in lowercase (e.g., fever, cough, headache) for best results
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Symptom Input Fields - 5 inputs in one row */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Enter Your Symptoms (Up to 5)</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  <Input
                    placeholder="headache"
                    value={symptom1}
                    onChange={(e) => setSymptom1(e.target.value)}
                    className="transition-all duration-300 focus:shadow-medical"
                  />
                  
                  <Input
                    placeholder="fever"
                    value={symptom2}
                    onChange={(e) => setSymptom2(e.target.value)}
                    className="transition-all duration-300 focus:shadow-medical"
                  />
                  
                  <Input
                    placeholder="cough"
                    value={symptom3}
                    onChange={(e) => setSymptom3(e.target.value)}
                    className="transition-all duration-300 focus:shadow-medical"
                  />
                  
                  <Input
                    placeholder="fatigue"
                    value={symptom4}
                    onChange={(e) => setSymptom4(e.target.value)}
                    className="transition-all duration-300 focus:shadow-medical"
                  />
                  
                  <Input
                    placeholder="body ache"
                    value={symptom5}
                    onChange={(e) => setSymptom5(e.target.value)}
                    className="transition-all duration-300 focus:shadow-medical"
                  />
                </div>
              </div>
              {/* Common Symptoms Quick Add */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-700">Quick Fill Common Symptoms:</p>
                <div className="flex flex-wrap gap-2">
                  {commonSymptoms.map((symptom) => (
                    <Button
                      key={symptom}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // Fill the first empty slot
                        if (!symptom1) setSymptom1(symptom);
                        else if (!symptom2) setSymptom2(symptom);
                        else if (!symptom3) setSymptom3(symptom);
                        else if (!symptom4) setSymptom4(symptom);
                        else if (!symptom5) setSymptom5(symptom);
                      }}
                      className="hover:bg-red-50 hover:border-red-300 text-xs"
                    >
                      {symptom}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Analyze Button */}
              <Button
                onClick={analyzePrediction}
                disabled={isAnalyzing || getSymptomArray().length === 0}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-hover transition-all duration-300 text-lg py-6"
                size="lg"
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                    Analyzing Symptoms...
                  </>
                ) : (
                  <>
                    <Activity className="w-5 h-5 mr-2" />
                    Analyze & Predict Disease ({getSymptomArray().length} symptom{getSymptomArray().length !== 1 ? 's' : ''})
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Prediction Results with Analytics */}
      {showResults && (
        <section className="relative z-10 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                AI Disease Prediction & Analytics
              </h2>
              <p className="text-lg text-muted-foreground">
                Advanced analysis of your symptoms with visual insights
              </p>
            </div>

            <div className="space-y-8">
              {prediction && (
                <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
                  <CardHeader className="border-b border-gray-100">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center text-white">
                        <Brain className="w-8 h-8" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-semibold text-gray-600 mb-1">
                          Predicted Disease
                        </CardTitle>
                        <div className="text-3xl font-bold text-red-700">
                          {prediction.disease}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-8">
                    {/* Symptom Contribution Chart - Full Width */}
                    <div className="max-w-4xl mx-auto">
                      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-200">
                        <h4 className="font-bold text-blue-800 mb-4 flex items-center gap-2 text-lg">
                          <PieChart className="w-5 h-5" />
                          Symptom Analysis
                        </h4>
                        
                        {/* Pie Chart Visualization */}
                        <div className="flex items-center justify-center mb-6">
                          <div className="relative w-64 h-64">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                              {prediction.symptom_contributions
                                .filter(contrib => contrib.contribution > 0) // Only show symptoms with importance > 0
                                .map((contrib, idx) => {
                                const startAngle = prediction.symptom_contributions
                                  .slice(0, idx)
                                  .filter(c => c.contribution > 0)
                                  .reduce((sum, c) => sum + (c.contribution / 100) * 360, 0);
                                const endAngle = startAngle + (contrib.contribution / 100) * 360;
                                
                                const startAngleRad = (startAngle * Math.PI) / 180;
                                const endAngleRad = (endAngle * Math.PI) / 180;
                                
                                const largeArcFlag = contrib.contribution > 50 ? 1 : 0;
                                
                                const x1 = 50 + 40 * Math.cos(startAngleRad);
                                const y1 = 50 + 40 * Math.sin(startAngleRad);
                                const x2 = 50 + 40 * Math.cos(endAngleRad);
                                const y2 = 50 + 40 * Math.sin(endAngleRad);
                                
                                return (
                                  <path
                                    key={idx}
                                    d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                                    fill={contrib.color}
                                    className="hover:opacity-80 transition-opacity cursor-pointer"
                                  />
                                );
                              })}
                              <circle cx="50" cy="50" r="15" fill="white" />
                            </svg>
                          </div>
                        </div>

                        {/* Legend - More Prominent */}
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                          <h5 className="font-semibold text-gray-800 mb-3 text-center">Symptom Importance</h5>
                          <div className="space-y-3">
                            {prediction.symptom_contributions
                              .filter(contrib => contrib.contribution > 0) // Only show recognized symptoms
                              .sort((a, b) => b.contribution - a.contribution) // Sort by importance
                              .map((contrib, idx) => (
                              <div key={idx} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div 
                                    className="w-4 h-4 rounded-full flex-shrink-0"
                                    style={{ backgroundColor: contrib.color }}
                                  />
                                  <span className="font-medium text-gray-700 capitalize">
                                    {contrib.symptom}
                                  </span>
                                </div>
                                <span className="font-bold text-gray-800 text-lg">
                                  {contrib.contribution.toFixed(1)}%
                                </span>
                              </div>
                            ))}
                          </div>
                          
                          {/* Show unrecognized symptoms separately */}
                          {prediction.symptom_contributions.some(contrib => contrib.contribution === 0) && (
                            <div className="mt-4 pt-3 border-t border-gray-200">
                              <p className="text-sm text-gray-500 mb-2">Not recognized by model:</p>
                              <div className="space-y-1">
                                {prediction.symptom_contributions
                                  .filter(contrib => contrib.contribution === 0)
                                  .map((contrib, idx) => (
                                  <div key={`unrecognized-${idx}`} className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full bg-gray-300 flex-shrink-0" />
                                    <span className="text-sm text-gray-500 capitalize">
                                      {contrib.symptom}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>


                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Important Disclaimer */}
      <section className="relative z-10 py-12 bg-red-50/90 backdrop-blur-sm border-t border-red-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-2 border-red-200 bg-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-8 h-8 text-red-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-bold text-red-800 mb-2">Important Medical Disclaimer</h3>
                  <p className="text-red-700 leading-relaxed">
                    For educational purposes only. Always consult healthcare professionals for medical advice. In emergencies, seek immediate medical attention.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
      </div>
    </AppLayout>
  );
};

export default InfectiousDiseasePrediction;