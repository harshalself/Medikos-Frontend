import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAskChatbot } from "@/hooks/use-ask-chatbot";
import { 
  MessageCircle, 
  X, 
  Send,
  Bot,
  AlertTriangle,
  Lightbulb,
  Clock,
  Sparkles
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Message {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: Date;
  type?: 'info' | 'warning' | 'suggestion';
  suggestions?: string[];
}

interface FloatingChatBotProps {
  isOpen: boolean;
  onClose: () => void;
}

const FloatingChatBot = ({ isOpen, onClose }: FloatingChatBotProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { askQuestion, loading: apiLoading, error: apiError } = useAskChatbot();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your AI Health Assistant powered by RAG technology. I can help you with health information, symptom analysis, and dietary recommendations based on verified medical data. How can I assist you today?",
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

  const handleSendMessage = async (messageToSend?: string) => {
    const message = messageToSend || inputMessage;
    if (!message.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentQuery = message;
    if (!messageToSend) {
      setInputMessage("");
    }
    setIsTyping(true);

    // Keep input focused after sending
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);

    try {
      // Call the real API endpoint on port 8002
      const response = await askQuestion(currentQuery);
      
      const botResponse: Message = {
        id: Date.now().toString(),
        content: response.answer,
        isBot: true,
        timestamp: new Date(),
        type: 'info',
        suggestions: response.suggestions
      };

      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      // Show error message in chat
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: "I apologize, but I'm having trouble connecting to the health database. Please make sure the chatbot service is running on port 8002 and try again.",
        isBot: true,
        timestamp: new Date(),
        type: 'warning'
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Connection Error",
        description: "Unable to reach the AI chatbot service. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsTyping(false);
      
      // Focus input again after response
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
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
      {/* Main Chat Window - Increased height from 380px to 550px */}
      <Card className="w-96 sm:w-[480px] h-[650px] bg-white shadow-2xl border-2 border-primary/10 overflow-hidden animate-fade-in flex flex-col">
        {/* Shimmer Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-slide-left pointer-events-none"></div>
        
        {/* Header */}
        <CardHeader className="bg-gradient-to-r from-purple-500 to-blue-600 text-white p-3 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageCircle className="w-5 h-5" />
              <div>
                <CardTitle className="text-sm font-semibold">diagno-chatbot</CardTitle>
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
                  
                  {/* Display suggestions if available */}
                  {message.isBot && message.suggestions && message.suggestions.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex items-center gap-1 mb-2">
                        <Sparkles className="w-3 h-3 text-purple-500" />
                        <span className="text-xs font-semibold text-gray-700">Suggested follow-ups:</span>
                      </div>
                      <div className="space-y-1.5">
                        {message.suggestions.map((suggestion, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSendMessage(suggestion)}
                            className="w-full text-left text-xs bg-purple-50 hover:bg-purple-100 text-purple-700 rounded px-2 py-1.5 transition-colors border border-purple-200 hover:border-purple-300"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
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
                onClick={() => handleSendMessage()}
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