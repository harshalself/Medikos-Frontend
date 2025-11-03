import { useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";

// Declare ElevenLabs custom element
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'elevenlabs-convai': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        'agent-id': string;
      };
    }
  }
}

const VoiceAgent = () => {
  // Load ElevenLabs script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed';
    script.async = true;
    document.head.appendChild(script);

    return () => {
      // Cleanup script when component unmounts
      const existingScript = document.querySelector('script[src="https://unpkg.com/@elevenlabs/convai-widget-embed"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center max-w-2xl mx-auto px-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 mb-6 shadow-xl">
            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 1C5.93 1 1 5.93 1 12s4.93 11 11 11 11-4.93 11-11S18.07 1 12 1zm0 20c-4.96 0-9-4.04-9-9s4.04-9 9-9 9 4.04 9 9-4.04 9-9 9zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">AI Voice Assistant</h1>
          <p className="text-xl text-gray-600 mb-8">
            Click the voice assistant button in the bottom right corner to start a conversation with our AI health assistant.
          </p>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">How to Use</h2>
            <div className="text-left space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
                <p className="text-gray-700">Click the microphone icon in the bottom right corner</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
                <p className="text-gray-700">Allow microphone access when prompted</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
                <p className="text-gray-700">Speak naturally about your health concerns</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">4</div>
                <p className="text-gray-700">Get personalized health advice and guidance</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ElevenLabs Conva AI Widget */}
      <elevenlabs-convai agent-id="agent_5701k93w72nte5xr5hk1ge3758pv"></elevenlabs-convai>
    </AppLayout>
  );
};

export default VoiceAgent;
