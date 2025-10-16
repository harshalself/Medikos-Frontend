import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AppLayout } from "@/components/layout/AppLayout";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BackButton } from "@/components/ui/back-button";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { 
  Heart, 
  User, 
  LogOut, 
  Send,
  Bot,
  MessageCircle,
  AlertTriangle,
  Lightbulb,
  Clock,
  Stethoscope,
  Mic,
  Image,
  FileText
} from "lucide-react";

interface Message {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: Date;
  type?: 'info' | 'warning' | 'suggestion';
}

const ChatBot = () => {
  const { toast } = useToast();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your AI Health Assistant. I can help you with health information, symptom analysis, and dietary recommendations. How can I assist you today?",
      isBot: true,
      timestamp: new Date(),
      type: 'info'
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  // Removed hasNewMessage state for auto-scroll
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // ChatGPT-like auto-scroll behavior for messages container only
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  // Auto-scroll when new messages arrive or typing
  useEffect(() => {
    scrollToBottom();
  }, [messages.length, isTyping]);

  const quickQuestions = [
    "I have a headache, what should I do?",
    "Natural remedies for common cold",
    "Healthy diet for diabetes",
    "How to improve my sleep quality?",
    "Stress management techniques"
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

    // Keep input focused after sending
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);

    // Simulate AI response
    setTimeout(() => {
      const botResponse = generateBotResponse(inputMessage);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
      
      // Focus input again after bot response
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }, 1500);
  };

  const generateBotResponse = (userInput: string): Message => {
    const input = userInput.toLowerCase();
    
    if (input.includes("headache")) {
      return {
        id: Date.now().toString(),
        content: "For headaches, I recommend:\n\n• Stay hydrated - drink water\n• Rest in a quiet, dark room\n• Apply cold compress to forehead\n• Consider gentle neck stretches\n• Try ginger tea for natural relief\n\n⚠️ If severe or persistent, consult a doctor immediately.",
        isBot: true,
        timestamp: new Date(),
        type: 'suggestion'
      };
    } else if (input.includes("cold") || input.includes("cough")) {
      return {
        id: Date.now().toString(),
        content: "Natural remedies for common cold:\n\n• Honey and ginger tea\n• Steam inhalation\n• Garlic and turmeric paste\n• Warm salt water gargling\n• Increase vitamin C intake\n• Get plenty of rest\n\n💡 These symptoms usually resolve in 7-10 days.",
        isBot: true,
        timestamp: new Date(),
        type: 'info'
      };
    } else if (input.includes("diabetes") || input.includes("sugar")) {
      return {
        id: Date.now().toString(),
        content: "Diabetes-friendly diet tips:\n\n• Choose complex carbohydrates\n• Include fiber-rich foods\n• Opt for lean proteins\n• Healthy fats like nuts, avocado\n• Regular meal timing\n• Monitor blood sugar levels\n\n⚠️ Always consult your doctor for personalized diet plans.",
        isBot: true,
        timestamp: new Date(),
        type: 'warning'
      };
    } else if (input.includes("sleep")) {
      return {
        id: Date.now().toString(),
        content: "Tips for better sleep quality:\n\n• Maintain regular sleep schedule\n• Create a relaxing bedtime routine\n• Limit screen time before bed\n• Keep bedroom cool and dark\n• Try chamomile tea\n• Practice deep breathing\n\n💡 Aim for 7-9 hours of sleep nightly.",
        isBot: true,
        timestamp: new Date(),
        type: 'suggestion'
      };
    } else if (input.includes("stress")) {
      return {
        id: Date.now().toString(),
        content: "Stress management techniques:\n\n• Practice mindfulness meditation\n• Regular physical exercise\n• Deep breathing exercises\n• Connect with friends and family\n• Engage in hobbies\n• Consider yoga or tai chi\n\n💡 Chronic stress can affect physical health - seek professional help if needed.",
        isBot: true,
        timestamp: new Date(),
        type: 'suggestion'
      };
    } else {
      return {
        id: Date.now().toString(),
        content: "I understand you're asking about health concerns. While I can provide general wellness information, I'd recommend:\n\n• Describing your symptoms more specifically\n• Consulting with a healthcare professional\n• Using our appointment booking feature\n• Checking our natural remedies section\n\n⚠️ Remember: I'm here for information only, not medical diagnosis.",
        isBot: true,
        timestamp: new Date(),
        type: 'info'
      };
    }
  };

  const handleQuickQuestion = (question: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content: question,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const botResponse = generateBotResponse(question);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const getMessageIcon = (type?: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="w-4 h-4 text-warning" />;
      case 'suggestion': return <Lightbulb className="w-4 h-4 text-success" />;
      default: return <Bot className="w-4 h-4 text-primary" />;
    }
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-background">

      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-500 to-blue-600 mb-6 shadow-lg animate-bounce-slow">
            <Bot className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 animate-fade-in">
            AI Health Assistant
          </h1>
          <p className="text-xl text-muted-foreground mb-4 animate-slide-up max-w-2xl mx-auto">
            Get instant diagnostic insights, treatment recommendations, and health guidance powered by advanced AI
          </p>
          <div className="flex justify-center gap-6 mt-6 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <span>24/7 Available</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <span>HIPAA Compliant</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-warning rounded-full animate-pulse"></div>
              <span>Instant Responses</span>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Chat Interface */}
          <div className="lg:col-span-3">
            <Card className="shadow-hover h-[700px] flex flex-col animate-fade-in border-2 border-primary/10 overflow-hidden">
              <CardHeader className="border-b bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 text-white p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-slide-left"></div>
                <div className="flex items-center justify-between relative z-10">
                  <CardTitle className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                      <Bot className="w-7 h-7" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">AI Health Assistant</h2>
                      <p className="text-white/90 text-sm font-medium">Powered by Advanced Medical AI</p>
                    </div>
                  </CardTitle>
                  <Badge className="bg-success/90 text-white px-4 py-2 backdrop-blur-sm shadow-lg">
                    <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                    Online
                  </Badge>
                </div>
              </CardHeader>
              
              {/* Messages Area */}
              <CardContent ref={messagesContainerRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-gray-50 to-blue-50/30">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isBot ? 'justify-start' : 'justify-end'} animate-fade-in`}
                  >
                    <div className={`flex items-start space-x-3 max-w-[85%] ${message.isBot ? '' : 'flex-row-reverse space-x-reverse'}`}>
                      {message.isBot && (
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                          {getMessageIcon(message.type)}
                        </div>
                      )}
                      {!message.isBot && (
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                          <User className="w-5 h-5 text-white" />
                        </div>
                      )}
                      <div
                        className={`p-5 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-hover ${
                          message.isBot
                            ? 'bg-white border-2 border-blue-100 text-foreground rounded-tl-sm'
                            : 'bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-tr-sm'
                        }`}
                      >
                        {message.isBot && (
                          <div className="flex items-center space-x-2 mb-3">
                            <span className="text-sm font-semibold text-primary">AI Health Assistant</span>
                            {message.type && (
                              <Badge variant="outline" className="text-xs px-2 py-0">
                                {message.type}
                              </Badge>
                            )}
                          </div>
                        )}
                        <div className="whitespace-pre-line text-sm leading-relaxed">
                          {message.content}
                        </div>
                        <div className={`text-xs mt-3 flex justify-between items-center ${
                          message.isBot ? 'text-muted-foreground' : 'text-white/70'
                        }`}>
                          <span>{message.timestamp.toLocaleTimeString()}</span>
                          {!message.isBot && <span className="text-xs">✓</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start animate-fade-in">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-medical flex items-center justify-center shadow-medical">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-white border border-primary/10 p-4 rounded-2xl rounded-tl-sm shadow-card">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-sm font-semibold text-primary">AI Health Assistant</span>
                          <Badge variant="outline" className="text-xs px-2 py-0">typing...</Badge>
                        </div>
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </CardContent>
              
              {/* Quick Questions Above Input */}
              <div className="border-t bg-gray-50/50 p-4">
                <div className="mb-3">
                  <p className="text-xs font-medium text-muted-foreground mb-2">Quick Questions:</p>
                  <div className="flex flex-wrap gap-2">
                    {quickQuestions.slice(0, 3).map((question, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickQuestion(question)}
                        className="text-xs h-8 px-3 bg-white/80 hover:bg-white border-primary/20 hover:border-primary/40 transition-all duration-200"
                      >
                        {question.length > 30 ? question.substring(0, 30) + '...' : question}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Input Area */}
              <div className="border-t p-6 bg-muted/30">
                <div className="flex space-x-3">
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        toast({
                          title: "Voice Input",
                          description: "Voice recording feature coming soon!",
                        });
                        setIsListening(!isListening);
                      }}
                      className={`hover-scale ${isListening ? 'bg-destructive text-white' : ''}`}
                    >
                      <Mic className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        toast({
                          title: "Image Upload",
                          description: "Image analysis feature coming soon!",
                        });
                      }}
                      className="hover-scale"
                    >
                      <Image className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        toast({
                          title: "File Upload",
                          description: "Document analysis feature coming soon!",
                        });
                      }}
                      className="hover-scale"
                    >
                      <FileText className="w-4 h-4" />
                    </Button>
                  </div>
                  <Input
                    ref={inputRef}
                    placeholder="Describe your symptoms or ask a health question..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1 transition-all duration-300 focus:shadow-medical border-primary/20"
                  />
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isTyping}
                    className="bg-gradient-medical hover:shadow-medical transition-all duration-300 hover-scale px-6"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <div className="mt-3 text-xs text-muted-foreground text-center">
                  Press Enter to send • {isListening ? 'Listening...' : 'Try voice input, images, or documents'}
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Health Tips */}
            <Card className="shadow-card animate-slide-up" style={{ animationDelay: '200ms' }}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lightbulb className="w-5 h-5 text-success" />
                  <span>Health Tips</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-success/10 rounded-lg border-l-4 border-l-success">
                  <h4 className="font-medium text-success mb-1">Stay Hydrated</h4>
                  <p className="text-sm text-muted-foreground">
                    Drink 8-10 glasses of water daily for optimal health.
                  </p>
                </div>
                <div className="p-3 bg-primary/10 rounded-lg border-l-4 border-l-primary">
                  <h4 className="font-medium text-primary mb-1">Regular Exercise</h4>
                  <p className="text-sm text-muted-foreground">
                    30 minutes of activity daily boosts immunity and mood.
                  </p>
                </div>
                <div className="p-3 bg-warning/10 rounded-lg border-l-4 border-l-warning">
                  <h4 className="font-medium text-warning mb-1">Quality Sleep</h4>
                  <p className="text-sm text-muted-foreground">
                    7-9 hours of sleep helps your body recover and heal.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Notice */}
            <Card className="shadow-card border-destructive/20 animate-slide-up" style={{ animationDelay: '400ms' }}>
              <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                  <Stethoscope className="w-6 h-6 text-destructive mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-destructive mb-2">Emergency?</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      For medical emergencies, call your local emergency number immediately. 
                      This AI assistant is for informational purposes only.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-12 p-6 bg-muted/50 rounded-lg border-l-4 border-l-warning">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-6 h-6 text-warning mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-warning mb-2">Medical Disclaimer</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                This AI health assistant provides general information only and is not a substitute 
                for professional medical advice, diagnosis, or treatment. Always consult qualified 
                healthcare providers for medical concerns. In emergencies, contact emergency services immediately.
              </p>
            </div>
          </div>
        </div>
      </main>
      </div>
    </AppLayout>
  );
};

export default ChatBot;