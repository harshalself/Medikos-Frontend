import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { 
  MessageCircle,
  X,
  Send,
  Bot,
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  Minimize2,
  Maximize2,
  AlertTriangle,
  Lightbulb
} from "lucide-react";

interface Message {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: Date;
  type?: 'info' | 'warning' | 'suggestion';
}

interface FloatingChatProps {
  className?: string;
}

export const FloatingChat = ({ className = "" }: FloatingChatProps) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your AI Health Assistant. I can help you with health questions, symptom analysis, and provide general wellness guidance. How can I help you today?",
      isBot: true,
      timestamp: new Date(),
      type: 'info'
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickQuestions = [
    "I have a headache, what should I do?",
    "Natural remedies for common cold",
    "How to improve sleep quality?",
    "Healthy diet tips for better immunity",
    "What are the symptoms of flu?",
    "Home remedies for sore throat",
    "How to reduce stress naturally?",
    "When should I see a doctor?"
  ];

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const botResponse = generateBotResponse(inputMessage);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateBotResponse = (userInput: string): Message => {
    const input = userInput.toLowerCase();
    
    if (input.includes("headache")) {
      return {
        id: Date.now().toString(),
        content: "For headaches, I recommend:\n\n• Stay hydrated - drink water\n• Rest in a quiet, dark room\n• Apply cold compress to forehead\n• Try gentle neck stretches\n• Consider ginger tea\n\n⚠️ If severe or persistent, consult a doctor.",
        isBot: true,
        timestamp: new Date(),
        type: 'suggestion'
      };
    } else if (input.includes("cold") || input.includes("cough")) {
      return {
        id: Date.now().toString(),
        content: "Natural cold remedies:\n\n• Honey and ginger tea\n• Steam inhalation\n• Gargle with warm salt water\n• Increase vitamin C\n• Get plenty of rest\n\n💡 Usually resolves in 7-10 days.",
        isBot: true,
        timestamp: new Date(),
        type: 'info'
      };
    } else if (input.includes("diet") || input.includes("nutrition")) {
      return {
        id: Date.now().toString(),
        content: "Healthy diet tips:\n\n• Eat plenty of fruits and vegetables\n• Choose whole grains\n• Include lean proteins\n• Stay hydrated\n• Limit processed foods\n• Practice portion control",
        isBot: true,
        timestamp: new Date(),
        type: 'suggestion'
      };
    } else {
      return {
        id: Date.now().toString(),
        content: "I'm here to help with health information. For specific medical concerns, please consult with a healthcare professional. Would you like me to help you book an appointment?",
        isBot: true,
        timestamp: new Date(),
        type: 'info'
      };
    }
  };

  const toggleVoiceListening = () => {
    setIsListening(!isListening);
    if (!isListening) {
      // Simulate voice recognition
      toast({
        title: "Voice Recognition",
        description: "Listening... (Feature coming soon)",
      });
      setTimeout(() => setIsListening(false), 3000);
    }
  };

  const toggleVoiceCall = () => {
    setIsCallActive(!isCallActive);
    toast({
      title: isCallActive ? "Call Ended" : "Voice Call Started",
      description: isCallActive ? "Thank you for using AI Voice Assistant" : "AI Voice Assistant is now active",
    });
  };

  const getMessageIcon = (type?: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="w-3 h-3 text-orange-500" />;
      case 'suggestion': return <Lightbulb className="w-3 h-3 text-green-500" />;
      default: return <Bot className="w-3 h-3 text-blue-500" />;
    }
  };

  if (!isOpen) {
    return (
      <div className={`fixed bottom-4 right-2 sm:right-4 z-50 ${className}`}>
        <Button
          onClick={() => setIsOpen(true)}
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 animate-bounce-slow"
          size="lg"
          aria-label="Open AI Health Assistant chat"
          title="Start chatting with AI Health Assistant"
        >
          <MessageCircle className="w-6 h-6 text-white" />
        </Button>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-4 right-2 sm:right-4 z-50 ${className}`}>
      {/* Quick Questions Panel - Always visible like Gemini */}
      {isOpen && !isMinimized && (
        <Card className="mb-3 w-80 sm:w-96 bg-white shadow-lg border border-purple-200 transition-all duration-300">
          <CardContent className="p-3">
            <p className="text-xs text-gray-700 mb-2 font-medium flex items-center gap-1">
              <Lightbulb className="w-3 h-3 text-purple-500" />
              Quick questions:
            </p>
            <div className="grid grid-cols-1 gap-1">
              {quickQuestions.slice(0, 3).map((question, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setInputMessage(question);
                    setTimeout(handleSendMessage, 100);
                  }}
                  className="w-full text-left justify-start h-auto p-2 text-xs text-gray-600 hover:bg-purple-50 hover:text-purple-700 transition-all duration-200 rounded-md border border-transparent hover:border-purple-200"
                  aria-label={`Ask question: ${question}`}
                  title={question}
                >
                  <span className="truncate">{question}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Chat Window */}
      <Card className={`bg-white shadow-2xl border-0 transition-all duration-300 ${
        isMinimized ? 'w-72 sm:w-80 h-12' : 'w-80 sm:w-96 h-[500px]'
      }`}>
        {/* Chat Header */}
        <CardHeader className="p-4 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <CardTitle className="text-sm font-semibold">AI Health Assistant</CardTitle>
                {isCallActive && (
                  <p className="text-xs text-purple-100">Voice call active</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Voice Call Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleVoiceCall}
                className={`text-white hover:bg-white/20 w-8 h-8 p-0 ${
                  isCallActive ? 'bg-red-500/30' : ''
                }`}
                aria-label={isCallActive ? "End voice call" : "Start voice call"}
                title={isCallActive ? "End voice call" : "Start voice call"}
              >
                {isCallActive ? <PhoneOff className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
              </Button>
              
              {/* Minimize/Maximize */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-white hover:bg-white/20 w-8 h-8 p-0"
                aria-label={isMinimized ? "Maximize chat" : "Minimize chat"}
                title={isMinimized ? "Maximize chat" : "Minimize chat"}
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </Button>
              
              {/* Close */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 w-8 h-8 p-0"
                aria-label="Close chat"
                title="Close chat"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <>
            {/* Chat Messages */}
            <CardContent className="p-0 h-80 overflow-y-auto bg-gray-50">
              <div className="p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.isBot ? 'justify-start' : 'justify-end'}`}
                  >
                    {message.isBot && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                        {getMessageIcon(message.type)}
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.isBot
                          ? 'bg-white border shadow-sm'
                          : 'bg-gradient-to-r from-purple-500 to-blue-600 text-white'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.isBot ? 'text-gray-500' : 'text-purple-100'
                      }`}>
                        {message.timestamp.toLocaleTimeString('en-US', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                    {!message.isBot && (
                      <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-semibold text-gray-600">You</span>
                      </div>
                    )}
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex gap-3 justify-start">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-600 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-white border shadow-sm p-3 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </CardContent>

            {/* Input Area */}
            <div className="p-4 border-t bg-white rounded-b-lg">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Input
                    placeholder="Type your health question..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="pr-10 text-sm"
                    disabled={isTyping}
                    aria-label="Type your health question"
                    aria-describedby="chat-input-help"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleVoiceListening}
                    className={`absolute right-1 top-1 h-8 w-8 p-0 ${
                      isListening ? 'text-red-500' : 'text-gray-400'
                    }`}
                    aria-label={isListening ? "Stop voice input" : "Start voice input"}
                    title={isListening ? "Stop voice input" : "Start voice input"}
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </Button>
                </div>
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  aria-label="Send message"
                  title="Send message"
                  className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 w-10 h-10 p-0"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};