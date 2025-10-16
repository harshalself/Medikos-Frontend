import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Brain, Search, AlertTriangle, CheckCircle, Clock, FileText, TrendingUp } from "lucide-react";

const DiagnosisAssistant = () => {
  const [symptoms, setSymptoms] = useState("");
  const [analysisResults, setAnalysisResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const recentCases = [
    {
      id: 1,
      patientName: "Sarah Johnson",
      symptoms: "Fatigue, increased thirst, frequent urination",
      aiSuggestion: "Type 2 Diabetes",
      confidence: 92,
      status: "confirmed",
      date: "2024-01-15"
    },
    {
      id: 2,
      patientName: "Michael Chen",
      symptoms: "Chest pain, shortness of breath, dizziness",
      aiSuggestion: "Hypertensive Crisis",
      confidence: 87,
      status: "under-review",
      date: "2024-01-14"
    },
    {
      id: 3,
      patientName: "Emily Davis",
      symptoms: "Persistent sadness, loss of appetite, sleep issues",
      aiSuggestion: "Major Depressive Disorder",
      confidence: 78,
      status: "confirmed",
      date: "2024-01-12"
    }
  ];

  const handleAnalyze = async () => {
    if (!symptoms.trim()) return;
    
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      setAnalysisResults({
        topDiagnoses: [
          { condition: "Type 2 Diabetes", confidence: 89, reasoning: "Symptoms highly consistent with diabetes mellitus" },
          { condition: "Thyroid Dysfunction", confidence: 67, reasoning: "Fatigue and metabolic symptoms present" },
          { condition: "Chronic Fatigue Syndrome", confidence: 45, reasoning: "Persistent fatigue reported" }
        ],
        recommendations: [
          "Order HbA1c and fasting glucose tests",
          "Check thyroid function (TSH, T3, T4)",
          "Recommend lifestyle modifications",
          "Schedule follow-up in 2 weeks"
        ],
        riskFactors: ["Family history of diabetes", "Sedentary lifestyle", "Age > 40"],
        urgency: "Moderate - Schedule within 48 hours"
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed": return "bg-green-100 text-green-800";
      case "under-review": return "bg-yellow-100 text-yellow-800";
      case "rejected": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return "text-green-600";
    if (confidence >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Brain className="w-8 h-8 text-blue-500" />
        <h2 className="text-2xl font-bold">AI Diagnosis Assistant</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Symptom Input */}
        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5 text-blue-500" />
              Symptom Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Enter patient symptoms (e.g., fatigue, increased thirst, frequent urination, weight loss...)"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              className="min-h-32"
            />
            <Button 
              onClick={handleAnalyze} 
              disabled={!symptoms.trim() || isAnalyzing}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
            >
              {isAnalyzing ? (
                <>
                  <motion.div 
                    className="w-4 h-4 mr-2"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    ⟳
                  </motion.div>
                  Analyzing...
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4 mr-2" />
                  Analyze Symptoms
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Analysis Results */}
        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-500" />
              AI Analysis Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analysisResults ? (
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-3">Top Diagnoses</h4>
                  <div className="space-y-3">
                    {analysisResults.topDiagnoses.map((diagnosis, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">{diagnosis.condition}</span>
                          <span className={`font-bold ${getConfidenceColor(diagnosis.confidence)}`}>
                            {diagnosis.confidence}%
                          </span>
                        </div>
                        <Progress value={diagnosis.confidence} className="h-2 mb-2" />
                        <p className="text-sm text-gray-600">{diagnosis.reasoning}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Recommendations</h4>
                  <ul className="space-y-1">
                    {analysisResults.recommendations.map((rec, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    <span className="font-medium text-yellow-800">Urgency Level</span>
                  </div>
                  <p className="text-sm text-yellow-700">{analysisResults.urgency}</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Enter symptoms above to get AI-powered diagnostic suggestions</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Cases */}
      <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            Recent Diagnostic Cases
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentCases.map((case_, index) => (
              <motion.div
                key={case_.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 border rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold">{case_.patientName}</h4>
                    <p className="text-sm text-gray-600">{case_.date}</p>
                  </div>
                  <div className="text-right">
                    <Badge className={getStatusColor(case_.status)}>
                      {case_.status.replace('-', ' ')}
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Symptoms</p>
                    <p className="text-sm text-gray-600">{case_.symptoms}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">AI Suggestion</p>
                    <p className="text-sm text-gray-600">{case_.aiSuggestion}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Confidence</p>
                    <div className="flex items-center gap-2">
                      <Progress value={case_.confidence} className="h-2 flex-1" />
                      <span className={`text-sm font-bold ${getConfidenceColor(case_.confidence)}`}>
                        {case_.confidence}%
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Performance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">94%</div>
            <p className="text-sm text-gray-600">Diagnostic Accuracy</p>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">156</div>
            <p className="text-sm text-gray-600">Cases Analyzed</p>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">2.3s</div>
            <p className="text-sm text-gray-600">Avg Analysis Time</p>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default DiagnosisAssistant;