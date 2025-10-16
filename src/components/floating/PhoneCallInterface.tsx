import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Phone, 
  PhoneOff,
  X, 
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Speaker,
  UserCircle,
  Clock
} from "lucide-react";

interface PhoneCallInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
  phoneNumber?: string;
}

const PhoneCallInterface = ({ isOpen, onClose, phoneNumber = "+1 (555) 123-4567" }: PhoneCallInterfaceProps) => {
  const [callStatus, setCallStatus] = useState<'connecting' | 'connected' | 'ended'>('connecting');
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [isVolumeOn, setIsVolumeOn] = useState(true);

  useEffect(() => {
    if (!isOpen) return;

    // Simulate connecting to call
    const connectTimer = setTimeout(() => {
      setCallStatus('connected');
    }, 3000);

    return () => clearTimeout(connectTimer);
  }, [isOpen]);

  useEffect(() => {
    if (callStatus !== 'connected') return;

    // Timer for call duration
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [callStatus]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    setCallStatus('ended');
    setTimeout(() => {
      onClose();
      setCallStatus('connecting');
      setCallDuration(0);
    }, 2000);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleSpeaker = () => {
    setIsSpeakerOn(!isSpeakerOn);
  };

  const toggleVolume = () => {
    setIsVolumeOn(!isVolumeOn);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[10000]">
      <Card className="w-80 sm:w-96 bg-gradient-to-b from-green-900 to-green-800 text-white shadow-2xl border-0 overflow-hidden">
        <CardContent className="p-0">
          {/* Header */}
          <div className="p-4 text-center border-b border-green-700/50">
            <div className="flex items-center justify-between mb-2">
              <div className="w-6"></div> {/* Spacer */}
              <h3 className="text-lg font-semibold">AI Voice Assistant</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white hover:bg-white/20 w-6 h-6 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-sm text-green-200">{phoneNumber}</p>
          </div>

          {/* Call Status */}
          <div className="p-8 text-center">
            {/* Avatar */}
            <div className="w-32 h-32 mx-auto mb-6 relative">
              <div className={`w-32 h-32 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center ${
                callStatus === 'connecting' ? 'animate-pulse' : ''
              }`}>
                <UserCircle className="w-20 h-20 text-white" />
              </div>
              
              {/* Pulse animation for connecting */}
              {callStatus === 'connecting' && (
                <div className="absolute inset-0 rounded-full border-4 border-white/30 animate-ping"></div>
              )}
            </div>

            {/* Status Text */}
            <div className="mb-6">
              {callStatus === 'connecting' && (
                <div>
                  <p className="text-xl font-semibold mb-2">Connecting...</p>
                  <p className="text-green-200">Please wait while we connect you to your AI health assistant</p>
                </div>
              )}
              
              {callStatus === 'connected' && (
                <div>
                  <p className="text-xl font-semibold mb-2">Connected</p>
                  <div className="flex items-center justify-center gap-2 text-green-200">
                    <Clock className="w-4 h-4" />
                    <span>{formatDuration(callDuration)}</span>
                  </div>
                </div>
              )}
              
              {callStatus === 'ended' && (
                <div>
                  <p className="text-xl font-semibold mb-2">Call Ended</p>
                  <p className="text-green-200">Thank you for using our AI health assistant</p>
                </div>
              )}
            </div>

            {/* Call Controls */}
            {callStatus === 'connected' && (
              <div className="flex justify-center gap-4 mb-6">
                {/* Mute Button */}
                <Button
                  onClick={toggleMute}
                  className={`w-14 h-14 rounded-full ${
                    isMuted 
                      ? 'bg-red-500 hover:bg-red-600' 
                      : 'bg-white/20 hover:bg-white/30'
                  }`}
                >
                  {isMuted ? (
                    <MicOff className="w-6 h-6 text-white" />
                  ) : (
                    <Mic className="w-6 h-6 text-white" />
                  )}
                </Button>

                {/* Volume Button */}
                <Button
                  onClick={toggleVolume}
                  className={`w-14 h-14 rounded-full ${
                    !isVolumeOn 
                      ? 'bg-red-500 hover:bg-red-600' 
                      : 'bg-white/20 hover:bg-white/30'
                  }`}
                >
                  {isVolumeOn ? (
                    <Volume2 className="w-6 h-6 text-white" />
                  ) : (
                    <VolumeX className="w-6 h-6 text-white" />
                  )}
                </Button>

                {/* Speaker Button */}
                <Button
                  onClick={toggleSpeaker}
                  className={`w-14 h-14 rounded-full ${
                    isSpeakerOn 
                      ? 'bg-blue-500 hover:bg-blue-600' 
                      : 'bg-white/20 hover:bg-white/30'
                  }`}
                >
                  <Speaker className="w-6 h-6 text-white" />
                </Button>
              </div>
            )}

            {/* End Call Button */}
            {callStatus !== 'ended' && (
              <Button
                onClick={handleEndCall}
                className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 shadow-lg"
              >
                <PhoneOff className="w-8 h-8 text-white" />
              </Button>
            )}
          </div>

          {/* Quick Actions */}
          {callStatus === 'connected' && (
            <div className="px-4 pb-4 border-t border-green-700/50">
              <p className="text-xs text-green-200 text-center mb-2">Quick Actions:</p>
              <div className="flex justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs border-green-600 text-green-200 hover:bg-green-700"
                >
                  Health Check
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs border-green-600 text-green-200 hover:bg-green-700"
                >
                  Symptoms
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs border-green-600 text-green-200 hover:bg-green-700"
                >
                  Emergency
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PhoneCallInterface;