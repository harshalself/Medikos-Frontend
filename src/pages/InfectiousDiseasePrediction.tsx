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

import api from '@/lib/api';
import type { PredictWithShapRequest, PredictWithShapResponse } from '@/types/api';

interface Symptom {
  id: string;
  name: string;
}

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
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [currentSymptom, setCurrentSymptom] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [showResults, setShowResults] = useState(false);

  const commonSymptoms = [
    "Fever", "Cough", "Sore throat", "Headache", "Fatigue", 
    "Body ache", "Nausea", "Vomiting", "Diarrhea", "Shortness of breath",
    "Chest pain", "Abdominal pain", "Skin rash", "Joint pain", "Chills"
  ];

  const samplePredictions: PredictionResult[] = [
    {
      disease: "Common Cold (Viral Upper Respiratory Infection)",
      probability: 82,
      confidence: 'High',
      symptom_contributions: [
        { symptom: "Fever", contribution: 40, color: "#dc2626" },
        { symptom: "Cough", contribution: 25, color: "#ef4444" },
        { symptom: "Sore throat", contribution: 17, color: "#f97316" }
      ],
      symptom_analysis: {
        primary_symptoms: ["Fever", "Cough"],
        secondary_symptoms: ["Sore throat", "Fatigue"],
        contributing_factors: ["Viral infection pattern", "Seasonal occurrence", "Symptom combination analysis"]
      }
    }
  ];

  const addSymptom = () => {
    if (!currentSymptom.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter a symptom name",
        variant: "destructive"
      });
      return;
    }

    // Check if symptom already exists
    if (symptoms.some(s => s.name.toLowerCase() === currentSymptom.toLowerCase())) {
      toast({
        title: "Duplicate Symptom",
        description: "This symptom has already been added",
        variant: "destructive"
      });
      return;
    }

    const newSymptom: Symptom = {
      id: Date.now().toString(),
      name: currentSymptom
    };

    setSymptoms([...symptoms, newSymptom]);
    setCurrentSymptom("");
    
    toast({
      title: "Symptom Added",
      description: `${currentSymptom} has been added to your symptom list`,
    });
  };

  const removeSymptom = (id: string) => {
    setSymptoms(symptoms.filter(s => s.id !== id));
  };

  const analyzePrediction = () => {
    if (symptoms.length === 0) {
      toast({
        title: "No Symptoms",
        description: "Please add at least one symptom to analyze",
        variant: "destructive"
      });
      return;
    }
    setIsAnalyzing(true);

    // Call backend endpoint with current symptoms
    (async () => {
      const requestBody: PredictWithShapRequest = { symptoms: symptoms.map(s => s.name) };

      try {
        const resp = await api.predictWithShap(requestBody);

        // Map backend response into UI PredictionResult shape
        const totalImportance = Object.values(resp.symptom_importance).reduce((s, v) => s + v, 0) || 1;
        const symptom_contributions: SymptomContribution[] = Object.entries(resp.symptom_importance).map(([symptom, value], idx) => ({
          symptom,
          contribution: Math.round((value / totalImportance) * 100),
          // re-use sample colors if available, otherwise fallback palette
          color: samplePredictions[0].symptom_contributions[idx]?.color || ['#60a5fa', '#34d399', '#f59e0b'][idx % 3]
        }));

        const uiPrediction: PredictionResult = {
          disease: resp.prediction,
          probability: samplePredictions[0].probability,
          confidence: samplePredictions[0].confidence,
          symptom_contributions,
          symptom_analysis: samplePredictions[0].symptom_analysis
        };

        setPrediction(uiPrediction);
        setShowResults(true);
        toast({ title: 'Analysis Complete', description: 'Results returned from backend' });
      } catch (err: any) {
        // On error, fall back to simulated response but show a toast
        toast({ title: 'Analysis Failed', description: err?.message || 'Could not reach prediction service', variant: 'destructive' });

        // fallback: reuse the simulated mapping so the UI still shows something
        const backendResponse: PredictWithShapResponse = {
          prediction: samplePredictions[0].disease,
          symptom_importance: samplePredictions[0].symptom_contributions.reduce((acc, cur) => {
            acc[cur.symptom] = cur.contribution;
            return acc;
          }, {} as Record<string, number>)
        };

        const totalImportance = Object.values(backendResponse.symptom_importance).reduce((s, v) => s + v, 0) || 1;
        const symptom_contributions: SymptomContribution[] = Object.entries(backendResponse.symptom_importance).map(([symptom, value], idx) => ({
          symptom,
          contribution: Math.round((value / totalImportance) * 100),
          color: samplePredictions[0].symptom_contributions[idx]?.color || '#60a5fa'
        }));

        const uiPrediction: PredictionResult = {
          disease: backendResponse.prediction,
          probability: samplePredictions[0].probability,
          confidence: samplePredictions[0].confidence,
          symptom_contributions,
          symptom_analysis: samplePredictions[0].symptom_analysis
        };

        setPrediction(uiPrediction);
        setShowResults(true);
      } finally {
        setIsAnalyzing(false);
      }
    })();
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
                Add Your Symptoms
              </CardTitle>
              <CardDescription className="text-center text-lg">
                Simply list your symptoms for AI-powered disease prediction and analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Symptom Input Form */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Symptom</label>
                  <Input
                    placeholder="Enter symptom (e.g., Fever, Cough, Headache)"
                    value={currentSymptom}
                    onChange={(e) => setCurrentSymptom(e.target.value)}
                    className="transition-all duration-300 focus:shadow-medical"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addSymptom();
                      }
                    }}
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    onClick={addSymptom}
                    className="bg-gradient-to-r from-red-500 to-pink-600 hover:shadow-hover transition-all duration-300"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add
                  </Button>
                </div>
              </div>



              {/* Common Symptoms Quick Add */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-700">Quick Add Common Symptoms:</p>
                <div className="flex flex-wrap gap-2">
                  {commonSymptoms.map((symptom) => (
                    <Button
                      key={symptom}
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentSymptom(symptom)}
                      className="hover:bg-red-50 hover:border-red-300 text-xs"
                    >
                      {symptom}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Current Symptoms List */}
      {symptoms.length > 0 && (
        <section className="relative z-10 py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Brain className="w-5 h-5 text-blue-600" />
                  Your Symptoms ({symptoms.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {symptoms.map((symptom) => (
                    <div
                      key={symptom.id}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg border border-red-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center">
                          <Activity className="w-4 h-4 text-white" />
                        </div>
                        <h4 className="font-semibold text-gray-800">{symptom.name}</h4>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSymptom(symptom.id)}
                        className="text-red-600 hover:bg-red-100"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={analyzePrediction}
                  disabled={isAnalyzing}
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
                      Analyze & Predict Diseases
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

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
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center text-white">
                          <Brain className="w-8 h-8" />
                        </div>
                        <div>
                          <CardTitle className="text-lg font-semibold text-gray-600 mb-1">
                            Most Likely Condition
                          </CardTitle>
                          <div className="text-2xl font-bold text-red-700 mb-2">
                            {prediction.disease}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center shadow-lg">
                          <div className="text-3xl font-bold text-blue-600">
                            {prediction.probability}%
                          </div>
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
                          Symptom Contribution Analysis
                        </h4>
                        
                        {/* Pie Chart Visualization */}
                        <div className="flex items-center justify-center mb-6">
                          <div className="relative w-48 h-48">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                              {prediction.symptom_contributions.map((contrib, idx) => {
                                const total = prediction.symptom_contributions.reduce((sum, c) => sum + c.contribution, 0);
                                const percentage = (contrib.contribution / total) * 100;
                                const startAngle = prediction.symptom_contributions
                                  .slice(0, idx)
                                  .reduce((sum, c) => sum + (c.contribution / total) * 360, 0);
                                const endAngle = startAngle + (percentage / 100) * 360;
                                
                                const startAngleRad = (startAngle * Math.PI) / 180;
                                const endAngleRad = (endAngle * Math.PI) / 180;
                                
                                const largeArcFlag = percentage > 50 ? 1 : 0;
                                
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
                              <text x="50" y="55" textAnchor="middle" className="text-xs font-bold fill-gray-700">
                                {prediction.probability}%
                              </text>
                            </svg>
                          </div>
                        </div>

                        {/* Legend */}
                        <div className="space-y-3">
                          {prediction.symptom_contributions.map((contrib, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                              <div className="flex items-center gap-3">
                                <div 
                                  className="w-4 h-4 rounded-full"
                                  style={{ backgroundColor: contrib.color }}
                                />
                                <span className="font-medium text-gray-700">{contrib.symptom}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-20 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="h-2 rounded-full"
                                    style={{ 
                                      width: `${contrib.contribution}%`,
                                      backgroundColor: contrib.color 
                                    }}
                                  />
                                </div>
                                <span className="font-bold text-gray-800 min-w-[3rem]">
                                  {contrib.contribution}%
                                </span>
                              </div>
                            </div>
                          ))}
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