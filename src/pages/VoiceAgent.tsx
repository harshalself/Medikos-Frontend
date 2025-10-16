import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AppLayout } from "@/components/layout/AppLayout";
import PhoneCallInterface from "@/components/floating/PhoneCallInterface";
import { 
  Phone, 
  Mic, 
  MicOff,
  Volume2,
  VolumeX,
  Heart,
  Activity,
  User,
  Clock,
  MessageSquare,
  Zap,
  Brain,
  Stethoscope,
  PhoneCall
} from "lucide-react";

const VoiceAgent = () => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentQuery, setCurrentQuery] = useState("");
  const [callDuration, setCallDuration] = useState("00:00");
  const [isPhoneCallOpen, setIsPhoneCallOpen] = useState(false);

  const toggleListening = () => {
    setIsListening(!isListening);
  };

  const toggleSpeaking = () => {
    setIsSpeaking(!isSpeaking);
  };

  const healthTopics = [
    { topic: "Symptom Analysis", icon: Stethoscope, color: "bg-blue-500" },
    { topic: "Medicine Info", icon: Heart, color: "bg-green-500" },
    { topic: "Diet Advice", icon: Activity, color: "bg-orange-500" },
    { topic: "Emergency Help", icon: Zap, color: "bg-red-500" },
  ];

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 relative overflow-hidden">
        {/* Background Pattern */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-5"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')"
          }}
        />
        
        {/* Hero Section */}
        <section className="relative z-10 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 mb-6 shadow-xl animate-float">
                <Phone className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 animate-fade-in">
                AI Voice Call Agent
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto animate-slide-up">
                Speak with our AI health assistant for instant medical guidance, symptom analysis, and health advice
              </p>
            </div>
          </div>
        </section>

        {/* Voice Interface */}
        <section className="relative z-10 py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm animate-slide-up">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold text-foreground mb-2">
                  Voice Health Assistant
                </CardTitle>
                <CardDescription className="text-lg">
                  Tap the microphone and start speaking
                </CardDescription>
                <div className="flex items-center justify-center gap-4 mt-4">
                  <Badge variant="outline" className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Call Duration: {callDuration}
                  </Badge>
                  <Badge variant={isListening ? "default" : "secondary"}>
                    {isListening ? "Listening..." : "Ready to Listen"}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-8">
                {/* Voice Controls */}
                <div className="flex justify-center items-center space-x-8">
                  <Button
                    onClick={toggleListening}
                    size="lg"
                    className={`w-20 h-20 rounded-full ${
                      isListening 
                        ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                        : 'bg-indigo-500 hover:bg-indigo-600'
                    } transition-all duration-300`}
                  >
                    {isListening ? (
                      <MicOff className="w-8 h-8 text-white" />
                    ) : (
                      <Mic className="w-8 h-8 text-white" />
                    )}
                  </Button>

                  {/* Phone Call Button */}
                  <Button
                    onClick={() => setIsPhoneCallOpen(true)}
                    size="lg"
                    className="w-20 h-20 rounded-full bg-green-500 hover:bg-green-600 transition-all duration-300 shadow-lg"
                    title="Start AI Voice Call"
                  >
                    <PhoneCall className="w-8 h-8 text-white" />
                  </Button>
                  
                  <Button
                    onClick={toggleSpeaking}
                    size="lg"
                    variant="outline"
                    className="w-16 h-16 rounded-full border-2"
                  >
                    {isSpeaking ? (
                      <VolumeX className="w-6 h-6" />
                    ) : (
                      <Volume2 className="w-6 h-6" />
                    )}
                  </Button>
                </div>

                {/* Current Query Display */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-indigo-500" />
                    Current Conversation
                  </h3>
                  <div className="bg-white rounded-lg p-4 min-h-[100px]">
                    {isListening ? (
                      <div className="flex items-center gap-3 text-gray-600">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                        <span>Listening to your voice...</span>
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">
                        Press the microphone button and start speaking about your health concerns
                      </p>
                    )}
                  </div>
                </div>

                {/* Quick Health Topics */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Brain className="w-5 h-5 text-purple-500" />
                    Quick Health Topics
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {healthTopics.map((topic, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="h-auto p-4 flex flex-col items-center gap-2 hover:shadow-md transition-all duration-300"
                      >
                        <div className={`w-10 h-10 rounded-full ${topic.color} flex items-center justify-center`}>
                          <topic.icon className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-sm font-medium">{topic.topic}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Features */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-blue-50 rounded-xl">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Mic className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-semibold text-blue-800 mb-2">Voice Recognition</h4>
                    <p className="text-sm text-blue-600">Advanced speech-to-text processing</p>
                  </div>
                  
                  <div className="text-center p-4 bg-purple-50 rounded-xl">
                    <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Brain className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-semibold text-purple-800 mb-2">AI Analysis</h4>
                    <p className="text-sm text-purple-600">Intelligent health assessment</p>
                  </div>
                  
                  <div className="text-center p-4 bg-green-50 rounded-xl">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Volume2 className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-semibold text-green-800 mb-2">Voice Response</h4>
                    <p className="text-sm text-green-600">Natural speech synthesis</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Information Section */}
        <section className="relative z-10 py-16 bg-white/50 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-foreground mb-8">How It Works</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto">
                    <span className="text-2xl font-bold text-white">1</span>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Speak Naturally</h3>
                  <p className="text-muted-foreground">
                    Describe your symptoms or health concerns in your own words
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center mx-auto">
                    <span className="text-2xl font-bold text-white">2</span>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">AI Analysis</h3>
                  <p className="text-muted-foreground">
                    Our AI processes your speech and analyzes your health data
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mx-auto">
                    <span className="text-2xl font-bold text-white">3</span>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Get Guidance</h3>
                  <p className="text-muted-foreground">
                    Receive personalized health advice and recommendations
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Phone Call Interface */}
      <PhoneCallInterface 
        isOpen={isPhoneCallOpen} 
        onClose={() => setIsPhoneCallOpen(false)}
        phoneNumber="+1 (555) AI-HEALTH"
      />
    </AppLayout>
  );
};

export default VoiceAgent;
