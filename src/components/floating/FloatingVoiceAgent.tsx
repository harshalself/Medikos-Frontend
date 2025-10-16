import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Phone, 
  X, 
  Maximize2,
  Mic,
  MicOff,
  Volume2,
  PhoneCall
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import PhoneCallInterface from "./PhoneCallInterface";

interface FloatingVoiceAgentProps {
  isOpen: boolean;
  onClose: () => void;
}

const FloatingVoiceAgent = ({ isOpen, onClose }: FloatingVoiceAgentProps) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentText, setCurrentText] = useState("");
  const [isPhoneCallOpen, setIsPhoneCallOpen] = useState(false);
  const navigate = useNavigate();

  const handleVoiceFullscreen = () => {
    onClose();
    navigate("/voice-agent");
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    if (!isListening) {
      setCurrentText("Listening...");
      // Simulate voice recognition
      setTimeout(() => {
        setCurrentText("I heard: 'Tell me about my health status'");
        setIsListening(false);
        setIsSpeaking(true);
        
        // Simulate AI response
        setTimeout(() => {
          setCurrentText("Based on your recent data, your health metrics are looking good. Would you like me to provide more details?");
          setIsSpeaking(false);
        }, 2000);
      }, 3000);
    } else {
      setCurrentText("");
    }
  };

  const stopSpeaking = () => {
    setIsSpeaking(false);
    setCurrentText("");
  };

  const handlePhoneCall = () => {
    setIsPhoneCallOpen(true);
  };

  const closePhoneCall = () => {
    setIsPhoneCallOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-24 right-4 left-4 sm:left-auto sm:right-6 sm:w-80 h-96 max-h-[70vh] sm:max-h-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-[9999] animate-slide-up">
      <CardHeader className="p-4 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-t-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5" />
            <div>
              <CardTitle className="text-sm font-semibold">AI Voice Assistant</CardTitle>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleVoiceFullscreen}
              className="text-white hover:bg-white/20 w-8 h-8 p-0"
              title="Open in full screen"
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20 w-8 h-8 p-0"
              title="Close voice assistant"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 h-64 flex flex-col items-center justify-center text-center">
        {/* Voice Status Indicator */}
        <div className="mb-6">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${
            isListening 
              ? 'bg-red-100 ring-4 ring-red-500 ring-opacity-50' 
              : isSpeaking
                ? 'bg-blue-100 ring-4 ring-blue-500 ring-opacity-50'
                : 'bg-gray-100'
          }`}>
            {isListening ? (
              <Mic className="w-8 h-8 text-red-500 animate-pulse" />
            ) : isSpeaking ? (
              <Volume2 className="w-8 h-8 text-blue-500 animate-pulse" />
            ) : (
              <Phone className="w-8 h-8 text-gray-500" />
            )}
          </div>
        </div>

        {/* Status Text */}
        <div className="mb-6 min-h-[60px]">
          {currentText && (
            <p className="text-sm text-gray-600 leading-relaxed">
              {currentText}
            </p>
          )}
          {!currentText && !isListening && !isSpeaking && (
            <p className="text-sm text-gray-400">
              Tap the microphone to start talking with your AI health assistant
            </p>
          )}
        </div>

        {/* Control Buttons */}
        <div className="flex gap-4">
          <Button
            onClick={toggleListening}
            disabled={isSpeaking}
            className={`w-12 h-12 rounded-full ${
              isListening 
                ? 'bg-red-500 animate-pulse' 
                : 'bg-indigo-500'
            } hover:scale-105 transition-all`}
          >
            {isListening ? (
              <MicOff className="w-5 h-5 text-white" />
            ) : (
              <Mic className="w-5 h-5 text-white" />
            )}
          </Button>

          {/* Phone Call Button */}
          <Button
            onClick={handlePhoneCall}
            className="w-12 h-12 rounded-full bg-green-500 hover:bg-green-600 hover:scale-105 transition-all"
            title="Start AI Voice Call"
          >
            <PhoneCall className="w-5 h-5 text-white" />
          </Button>
          
          {isSpeaking && (
            <Button
              onClick={stopSpeaking}
              className="w-12 h-12 rounded-full bg-gray-500 hover:bg-gray-600 hover:scale-105 transition-all"
            >
              <X className="w-5 h-5 text-white" />
            </Button>
          )}
        </div>

        {/* Status Indicator */}
        <div className="mt-4">
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
            <div className={`w-2 h-2 rounded-full ${
              isListening ? 'bg-red-500 animate-pulse' : 
              isSpeaking ? 'bg-blue-500 animate-pulse' : 'bg-gray-300'
            }`}></div>
            <span>
              {isListening ? 'Listening...' : 
               isSpeaking ? 'Speaking...' : 'Ready to help'}
            </span>
          </div>
        </div>
      </CardContent>

      {/* Phone Call Interface */}
      <PhoneCallInterface 
        isOpen={isPhoneCallOpen} 
        onClose={closePhoneCall}
        phoneNumber="+1 (555) AI-HEALTH"
      />
    </div>
  );
};

export default FloatingVoiceAgent;