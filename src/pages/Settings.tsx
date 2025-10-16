import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { AppLayout } from "@/components/layout/AppLayout";
import { 
  Settings as SettingsIcon,
  Bell,
  Shield,
  Palette,
  Monitor,
  Globe,
  Smartphone,
  Database,
  MessageCircle,
  FileText,
  Brain,
  Leaf,
  Calendar
} from "lucide-react";

const Settings = () => {
  const { toast } = useToast();
  
  const [notifications, setNotifications] = useState({
    aiAssistantUpdates: true,
    healthDiaryReminders: true,
    remedySuggestions: true,
    documentUploadConfirmations: true,
    systemUpdates: false,
    securityAlerts: true
  });

  const [privacy, setPrivacy] = useState({
    allowAIAnalysis: true,
    shareHealthData: false,
    enableDataExport: true,
    allowChatHistory: true,
    enableVoiceRecording: false
  });

  const [preferences, setPreferences] = useState({
    theme: "system",
    language: "en",
    defaultChatMode: "text",
    autoSaveHealthDiary: true,
    reminderFrequency: "daily",
    dataRetention: "1year"
  });

  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-gray-500 to-slate-600 mb-6 shadow-xl animate-float">
              <SettingsIcon className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Settings</h1>
            <p className="text-xl text-gray-600">Customize your Medikos Health Compass experience</p>
          </div>

          <div className="space-y-8">
            {/* AI & Health Features */}
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="w-5 h-5 text-purple-600" />
                  <span>AI & Health Features</span>
                </CardTitle>
                <CardDescription>
                  Configure AI assistants and health analysis features
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Default AI Mode</label>
                    <Select value={preferences.defaultChatMode} onValueChange={(value) => 
                      setPreferences({...preferences, defaultChatMode: value})
                    }>
                      <SelectTrigger>
                        <SelectValue placeholder="Select mode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">💬 Text Chat</SelectItem>
                        <SelectItem value="voice">🎤 Voice Assistant</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Health Diary Frequency</label>
                    <Select value={preferences.reminderFrequency} onValueChange={(value) => 
                      setPreferences({...preferences, reminderFrequency: value})
                    }>
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">📅 Daily</SelectItem>
                        <SelectItem value="weekly">📆 Weekly</SelectItem>
                        <SelectItem value="monthly">🗓️ Monthly</SelectItem>
                        <SelectItem value="none">🚫 None</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Auto-save Health Diary</h4>
                    <p className="text-sm text-gray-600">
                      Automatically save your health diary entries as you type
                    </p>
                  </div>
                  <Switch
                    checked={preferences.autoSaveHealthDiary}
                    onCheckedChange={(checked) => 
                      setPreferences({...preferences, autoSaveHealthDiary: checked})
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Interface Preferences */}
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Palette className="w-5 h-5 text-blue-600" />
                  <span>Interface & Display</span>
                </CardTitle>
                <CardDescription>
                  Customize the app appearance and language settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Theme</label>
                    <div className="flex space-x-2">
                      {["light", "dark", "system"].map((theme) => (
                        <Button
                          key={theme}
                          variant={preferences.theme === theme ? "default" : "outline"}
                          size="sm"
                          onClick={() => setPreferences({...preferences, theme})}
                          className="flex-1"
                        >
                          <Monitor className="w-4 h-4 mr-2" />
                          {theme.charAt(0).toUpperCase() + theme.slice(1)}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Language</label>
                    <div className="flex space-x-2">
                      {[{code: "en", label: "English"}, {code: "hi", label: "हिंदी"}].map((lang) => (
                        <Button
                          key={lang.code}
                          variant={preferences.language === lang.code ? "default" : "outline"}
                          size="sm"
                          onClick={() => setPreferences({...preferences, language: lang.code})}
                          className="flex-1"
                        >
                          <Globe className="w-4 h-4 mr-2" />
                          {lang.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="w-5 h-5 text-orange-600" />
                  <span>Notifications</span>
                </CardTitle>
                <CardDescription>
                  Configure notifications for health features and updates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <MessageCircle className="w-5 h-5 text-purple-600" />
                    <div>
                      <h4 className="font-medium">AI Assistant Updates</h4>
                      <p className="text-sm text-gray-600">Notifications from chat and voice assistants</p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications.aiAssistantUpdates}
                    onCheckedChange={(checked) => 
                      setNotifications({...notifications, aiAssistantUpdates: checked})
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <div>
                      <h4 className="font-medium">Health Diary Reminders</h4>
                      <p className="text-sm text-gray-600">Daily reminders to update your health diary</p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications.healthDiaryReminders}
                    onCheckedChange={(checked) => 
                      setNotifications({...notifications, healthDiaryReminders: checked})
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Leaf className="w-5 h-5 text-green-600" />
                    <div>
                      <h4 className="font-medium">Natural Remedy Suggestions</h4>
                      <p className="text-sm text-gray-600">New remedy recommendations based on your health data</p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications.remedySuggestions}
                    onCheckedChange={(checked) => 
                      setNotifications({...notifications, remedySuggestions: checked})
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-teal-600" />
                    <div>
                      <h4 className="font-medium">Document Upload Confirmations</h4>
                      <p className="text-sm text-gray-600">Confirmations when documents are uploaded to MediVault</p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications.documentUploadConfirmations}
                    onCheckedChange={(checked) => 
                      setNotifications({...notifications, documentUploadConfirmations: checked})
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-red-600" />
                    <div>
                      <h4 className="font-medium">Security Alerts</h4>
                      <p className="text-sm text-gray-600">Important security and account notifications</p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications.securityAlerts}
                    onCheckedChange={(checked) => 
                      setNotifications({...notifications, securityAlerts: checked})
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Privacy & Data Settings */}
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  <span>Privacy & Data Management</span>
                </CardTitle>
                <CardDescription>
                  Control your data privacy and AI analysis permissions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Allow AI Health Analysis</h4>
                    <p className="text-sm text-gray-600">
                      Enable AI to analyze your health patterns and provide insights
                    </p>
                  </div>
                  <Switch
                    checked={privacy.allowAIAnalysis}
                    onCheckedChange={(checked) => 
                      setPrivacy({...privacy, allowAIAnalysis: checked})
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Enable Chat History Storage</h4>
                    <p className="text-sm text-gray-600">
                      Save your AI assistant conversations for future reference
                    </p>
                  </div>
                  <Switch
                    checked={privacy.allowChatHistory}
                    onCheckedChange={(checked) => 
                      setPrivacy({...privacy, allowChatHistory: checked})
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Enable Voice Recording</h4>
                    <p className="text-sm text-gray-600">
                      Allow voice assistant to record and process audio
                    </p>
                  </div>
                  <Switch
                    checked={privacy.enableVoiceRecording}
                    onCheckedChange={(checked) => 
                      setPrivacy({...privacy, enableVoiceRecording: checked})
                    }
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Data Retention Period</label>
                  <Select value={preferences.dataRetention} onValueChange={(value) => 
                    setPreferences({...preferences, dataRetention: value})
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select retention period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3months">3 Months</SelectItem>
                      <SelectItem value="6months">6 Months</SelectItem>
                      <SelectItem value="1year">1 Year</SelectItem>
                      <SelectItem value="2years">2 Years</SelectItem>
                      <SelectItem value="indefinite">Indefinite</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Data Management */}
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="w-5 h-5 text-indigo-600" />
                  <span>Data Export & Management</span>
                </CardTitle>
                <CardDescription>
                  Download your data and manage your health information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="w-full">
                    <FileText className="w-4 h-4 mr-2" />
                    Export Health Data
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Database className="w-4 h-4 mr-2" />
                    Download Chat History
                  </Button>
                </div>
                <div className="pt-4 border-t">
                  <Button onClick={handleSaveSettings} className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700">
                    <SettingsIcon className="w-4 h-4 mr-2" />
                    Save All Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Settings;