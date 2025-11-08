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
  AlertTriangle,
  Lightbulb,
  Clock
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Message {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: Date;
  type?: 'info' | 'warning' | 'suggestion';
}

interface FloatingChatBotProps {
  isOpen: boolean;
  onClose: () => void;
}

const FloatingChatBot = ({ isOpen, onClose }: FloatingChatBotProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();

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

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

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
        content: "Thank you for your question! I'm here to help with health-related queries. You can ask me about:\n\n• Common health symptoms\n• Natural remedies\n• Diet and nutrition\n• Exercise and wellness\n• Stress management\n\nFor serious medical concerns, please consult a healthcare professional.",
        isBot: true,
        timestamp: new Date(),
        type: 'info'
      };
    }
  };

  const handleQuickQuestion = (question: string) => {
    setInputMessage(question);
    setTimeout(() => handleSendMessage(), 100);
  };

  const getMessageIcon = (type?: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="w-3 h-3 text-orange-500" />;
      case 'suggestion': return <Lightbulb className="w-3 h-3 text-blue-500" />;
      case 'info': return <Clock className="w-3 h-3 text-green-500" />;
      default: return <Bot className="w-3 h-3 text-blue-500" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-24 right-2 sm:right-6 z-[9999]">
      {/* Main Chat Window */}
      <Card className="w-80 sm:w-96 h-[380px] bg-white shadow-2xl border-2 border-primary/10 overflow-hidden animate-fade-in flex flex-col">
        {/* Shimmer Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-slide-left pointer-events-none"></div>
        
        {/* Header */}
        <CardHeader className="bg-gradient-to-r from-purple-500 to-blue-600 text-white p-3 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageCircle className="w-5 h-5" />
              <div>
                <CardTitle className="text-sm font-semibold">AI Health Assistant</CardTitle>
                <div className="flex items-center text-xs text-purple-100">
                  <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                  Online & Ready to Help
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white hover:bg-white/20 w-8 h-8 p-0"
                title="Close chat"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* Messages Area */}
        <CardContent className="p-0 flex flex-col flex-1 min-h-0">
          <div 
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-hide"
          >
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'} animate-fade-in`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div
                  className={`max-w-[85%] rounded-lg px-3 py-2 ${
                    message.isBot
                      ? 'bg-gray-100 text-gray-800 rounded-bl-none'
                      : 'bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-br-none'
                  }`}
                >
                  {message.isBot && (
                    <div className="flex items-center gap-1 mb-1">
                      {getMessageIcon(message.type)}
                      <span className="text-xs font-medium text-gray-600">
                        AI Assistant
                      </span>
                    </div>
                  )}
                  <div className="text-sm whitespace-pre-wrap leading-relaxed">
                    {message.content}
                  </div>
                  <div className={`text-xs mt-1 ${
                    message.isBot ? 'text-gray-500' : 'text-purple-100'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start animate-fade-in">
                <div className="bg-gray-100 rounded-lg rounded-bl-none px-3 py-2 max-w-[85%]">
                  <div className="flex items-center gap-1 mb-1">
                    <Bot className="w-3 h-3 text-blue-500" />
                    <span className="text-xs font-medium text-gray-600">AI Assistant</span>
                  </div>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          <div className="border-t p-2 bg-gray-50 flex-shrink-0">
            <p className="text-xs font-medium text-gray-600 mb-1 flex items-center gap-1">
              <Lightbulb className="w-3 h-3" />
              Quick Questions:
            </p>
            <div className="overflow-x-auto scrollbar-hide">
              <div className="flex gap-2 min-w-max">
                {quickQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickQuestion(question)}
                    className="text-xs h-5 px-2 border-primary/30 text-primary hover:bg-primary/10 whitespace-nowrap flex-shrink-0"
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Input Area */}
          <div className="px-3 py-2 border-t bg-white flex-shrink-0">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                placeholder="Type your health question..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 text-sm"
                disabled={isTyping}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                size="sm"
                className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Export the FloatingChatBot component
export default FloatingChatBot;