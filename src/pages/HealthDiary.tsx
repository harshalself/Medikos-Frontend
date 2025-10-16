import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import {
  Plus,
  Calendar,
  Clock,
  Tag,
  NotebookPen,
  Eye,
  BarChart3,
  TrendingUp,
  Activity,
  ThermometerSun,
  Brain,
  Trash2,
  PieChart,
  LineChart,
  Stethoscope,
  Heart,
  Zap,
  Star,
  Search
} from 'lucide-react';

interface DiaryEntry {
  id: string;
  date: string;
  time: string;
  title: string;
  content: string;
  symptoms: string[];
  mood: number;
  category: string;
  tags: string[];
  starred: boolean;
}

const HealthDiary = () => {
  const { toast } = useToast();
  
  // Sample data for demonstration
  const [entries, setEntries] = useState<DiaryEntry[]>([
    {
      id: '1',
      date: '2024-01-15',
      time: '09:30',
      title: 'Morning Headache',
      content: 'Woke up with a mild headache. Possibly due to not drinking enough water yesterday. Took some rest and drank more water.',
      symptoms: ['headache', 'fatigue'],
      mood: 6,
      category: 'symptoms',
      tags: ['morning', 'hydration'],
      starred: false
    },
    {
      id: '2',
      date: '2024-01-14',
      time: '14:20',
      title: 'Afternoon Energy Boost',
      content: 'Had a great workout session. Feeling energized and positive. Heart rate was good during cardio.',
      symptoms: [],
      mood: 8,
      category: 'exercise',
      tags: ['afternoon', 'workout', 'cardio'],
      starred: true
    },
    {
      id: '3',
      date: '2024-01-13',
      time: '20:15',
      title: 'Sleep Quality Check',
      content: 'Had trouble falling asleep last night. Might be due to caffeine intake late in the day.',
      symptoms: ['insomnia', 'restlessness'],
      mood: 4,
      category: 'sleep',
      tags: ['evening', 'sleep', 'caffeine'],
      starred: false
    }
  ]);

  const [newEntry, setNewEntry] = useState<Partial<DiaryEntry>>({
    title: '',
    content: '',
    symptoms: [],
    mood: 5,
    category: '',
    tags: []
  });

  const [currentSymptom, setCurrentSymptom] = useState('');
  const [currentTag, setCurrentTag] = useState('');
  const [selectedEntryForAnalysis, setSelectedEntryForAnalysis] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['symptoms', 'exercise', 'sleep', 'nutrition', 'mental-health', 'medication', 'other'];
  const moodLabels = ['Very Bad', 'Bad', 'Poor', 'Fair', 'Good', 'Great', 'Excellent', 'Amazing', 'Perfect', 'Fantastic'];

  // Filter entries based on search query
  const filteredEntries = entries.filter(entry => {
    const matchesSearch = searchQuery === '' || 
      entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.symptoms.some(symptom => symptom.toLowerCase().includes(searchQuery.toLowerCase())) ||
      entry.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      entry.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const addSymptom = () => {
    if (currentSymptom.trim() && !newEntry.symptoms?.includes(currentSymptom.trim())) {
      setNewEntry(prev => ({
        ...prev,
        symptoms: [...(prev.symptoms || []), currentSymptom.trim()]
      }));
      setCurrentSymptom('');
    }
  };

  const addTag = () => {
    if (currentTag.trim() && !newEntry.tags?.includes(currentTag.trim())) {
      setNewEntry(prev => ({
        ...prev,
        tags: [...(prev.tags || []), currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const removeSymptom = (symptom: string) => {
    setNewEntry(prev => ({
      ...prev,
      symptoms: prev.symptoms?.filter(s => s !== symptom)
    }));
  };

  const removeTag = (tag: string) => {
    setNewEntry(prev => ({
      ...prev,
      tags: prev.tags?.filter(t => t !== tag)
    }));
  };

  const saveEntry = () => {
    if (!newEntry.title || !newEntry.content || !newEntry.category) {
      toast({
        title: "Missing Information",
        description: "Please fill in title, content, and category.",
        variant: "destructive"
      });
      return;
    }

    const entry: DiaryEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      title: newEntry.title || '',
      content: newEntry.content || '',
      symptoms: newEntry.symptoms || [],
      mood: newEntry.mood || 5,
      category: newEntry.category || '',
      tags: newEntry.tags || [],
      starred: false
    };

    setEntries(prev => [entry, ...prev]);
    setNewEntry({ title: '', content: '', symptoms: [], mood: 5, category: '', tags: [] });
    setShowAddForm(false);
    
    toast({
      title: "Entry Saved",
      description: "Your health diary entry has been added successfully."
    });
  };

  const deleteEntry = (id: string) => {
    setEntries(prev => prev.filter(entry => entry.id !== id));
    toast({
      title: "Entry Deleted",
      description: "The diary entry has been removed."
    });
  };

  const toggleStar = (entryId: string) => {
    setEntries(prevEntries => 
      prevEntries.map(entry => 
        entry.id === entryId 
          ? { ...entry, starred: !entry.starred }
          : entry
      )
    );
    
    const entry = entries.find(e => e.id === entryId);
    toast({
      title: entry?.starred ? "Entry Unstarred" : "Entry Starred",
      description: entry?.starred 
        ? "Entry has been removed from starred items"
        : "Entry has been added to starred items",
    });
  };

  const analyzeEntry = (entry: DiaryEntry) => {
    // Calculate analytics for this specific entry
    const entryWordCount = entry.content.split(' ').length;
    const avgMoodAllEntries = entries.length > 0 ? entries.reduce((sum, e) => sum + e.mood, 0) / entries.length : 0;
    const moodComparison = entry.mood > avgMoodAllEntries ? 'Above Average' : entry.mood < avgMoodAllEntries ? 'Below Average' : 'Average';
    
    // Category frequency in user's entries
    const categoryFreq = entries.filter(e => e.category === entry.category).length;
    const totalEntries = entries.length;
    const categoryPercentage = totalEntries > 0 ? Math.round((categoryFreq / totalEntries) * 100) : 0;
    
    // Tag analysis
    const commonTags = entry.tags.filter(tag => 
      entries.some(e => e.id !== entry.id && e.tags.includes(tag))
    );

    const analysis = {
      sentiment: entry.mood >= 7 ? 'Positive' : entry.mood >= 4 ? 'Neutral' : 'Negative',
      keyInsights: [
        `Mood rating: ${entry.mood}/10 (${moodLabels[entry.mood - 1]})`,
        `Category: ${entry.category.replace('-', ' ').toUpperCase()}`,
        entry.symptoms.length > 0 ? `Symptoms reported: ${entry.symptoms.length}` : 'No symptoms reported',
        `Content length: ${entry.content.length} characters`
      ],
      analytics: {
        wordCount: entryWordCount,
        moodComparison: moodComparison,
        categoryUsage: `${categoryPercentage}% of your entries are in this category`,
        timePattern: entry.time < '12:00' ? 'Morning Entry' : entry.time < '18:00' ? 'Afternoon Entry' : 'Evening Entry',
        commonTags: commonTags,
        moodTrend: entry.mood >= 7 ? 'High' : entry.mood >= 4 ? 'Moderate' : 'Low'
      }
    };
    return analysis;
  };

  // Analytics calculations
  const categoryStats = categories.map(cat => ({
    name: cat.replace('-', ' ').toUpperCase(),
    value: entries.filter(e => e.category === cat).length,
    color: ['#06b6d4', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#6366f1', '#84cc16'][categories.indexOf(cat)]
  })).filter(stat => stat.value > 0);

  const moodTrend = entries.slice(0, 7).reverse().map((entry, index) => ({
    day: `Day ${index + 1}`,
    mood: entry.mood,
    date: entry.date
  }));

  const symptomFrequency = Array.from(
    entries.reduce((acc, entry) => {
      entry.symptoms.forEach(symptom => {
        acc.set(symptom, (acc.get(symptom) || 0) + 1);
      });
      return acc;
    }, new Map<string, number>())
  ).map(([symptom, count]) => ({ symptom, count }))
   .sort((a, b) => b.count - a.count)
   .slice(0, 5);

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 mb-6 shadow-xl animate-float">
              <NotebookPen className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800">Health Diary</h1>
          </div>
          
          <Tabs defaultValue="add" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="add" className="flex items-center gap-2 text-sm">
                <Plus className="h-4 w-4" />
                Add Notes
              </TabsTrigger>
              <TabsTrigger value="view" className="flex items-center gap-2 text-sm">
                <Eye className="h-4 w-4" />
                View All Notes
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2 text-sm">
                <BarChart3 className="h-4 w-4" />
                Analytics
              </TabsTrigger>
            </TabsList>

            {/* Add Notes Tab */}
            <TabsContent value="add" className="mt-6">
              {!showAddForm ? (
                <Card className="shadow-hover border-2 border-primary/20">
                  <CardContent className="flex flex-col items-center justify-center py-20">
                    <button
                      onClick={() => setShowAddForm(true)}
                      className="group relative w-40 h-40 rounded-full bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-600 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 animate-fade-in"
                    >
                      <div className="absolute inset-0 rounded-full bg-white/20 animate-pulse"></div>
                      <div className="relative flex items-center justify-center h-full">
                        <Plus className="w-20 h-20 text-white drop-shadow-lg group-hover:rotate-90 transition-transform duration-300" />
                      </div>
                    </button>
                    <p className="mt-8 text-xl font-semibold text-gray-700 animate-slide-up">Add New Health Entry</p>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <NotebookPen className="h-5 w-5" />
                      Add New Health Entry
                    </CardTitle>
                    <CardDescription>
                      Record your daily health observations, symptoms, mood, and notes
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Entry Title</label>
                      <Input
                        placeholder="e.g., Morning symptoms, Exercise routine..."
                        value={newEntry.title || ''}
                        onChange={(e) => setNewEntry(prev => ({ ...prev, title: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Category</label>
                      <Select onValueChange={(value) => setNewEntry(prev => ({ ...prev, category: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="symptoms">Symptoms</SelectItem>
                          <SelectItem value="exercise">Exercise</SelectItem>
                          <SelectItem value="sleep">Sleep</SelectItem>
                          <SelectItem value="nutrition">Nutrition</SelectItem>
                          <SelectItem value="mental-health">Mental Health</SelectItem>
                          <SelectItem value="medication">Medication</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Description</label>
                    <Textarea
                      placeholder="Describe your health status, symptoms, activities, or any observations..."
                      rows={4}
                      value={newEntry.content || ''}
                      onChange={(e) => setNewEntry(prev => ({ ...prev, content: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Mood Rating (1-10)</label>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={newEntry.mood || 5}
                        onChange={(e) => setNewEntry(prev => ({ ...prev, mood: parseInt(e.target.value) }))}
                        className="flex-1"
                      />
                      <div className="min-w-[100px] text-center">
                        <span className="text-lg font-bold">{newEntry.mood}</span>
                        <p className="text-xs text-gray-600">{moodLabels[(newEntry.mood || 5) - 1]}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Symptoms</label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        placeholder="Add a symptom"
                        value={currentSymptom}
                        onChange={(e) => setCurrentSymptom(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addSymptom()}
                      />
                      <Button onClick={addSymptom} size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {newEntry.symptoms?.map((symptom, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          <ThermometerSun className="h-3 w-3" />
                          {symptom}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeSymptom(symptom)}
                            className="h-4 w-4 p-0 ml-1"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Tags</label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        placeholder="Add a tag"
                        value={currentTag}
                        onChange={(e) => setCurrentTag(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addTag()}
                      />
                      <Button onClick={addTag} size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {newEntry.tags?.map((tag, index) => (
                        <Badge key={index} variant="outline" className="flex items-center gap-1">
                          <Tag className="h-3 w-3" />
                          {tag}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeTag(tag)}
                            className="h-4 w-4 p-0 ml-1"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  </div>

                    <div className="flex gap-3">
                      <Button 
                        variant="outline" 
                        onClick={() => setShowAddForm(false)} 
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button onClick={saveEntry} className="flex-1" size="lg">
                        <NotebookPen className="h-4 w-4 mr-2" />
                        Save Entry
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* View All Notes Tab */}
            <TabsContent value="view" className="mt-6">
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <h2 className="text-2xl font-semibold">All Health Entries ({entries.length})</h2>
                  <Badge variant="outline" className="text-sm">
                    {filteredEntries.length} of {entries.length} entries
                  </Badge>
                </div>
                
                {/* Search Bar */}
                <div className="relative max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search entries, symptoms, tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 transition-all duration-300 focus:shadow-md"
                  />
                </div>
                
                {filteredEntries.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-12">
                      <NotebookPen className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-600">
                        {entries.length === 0 
                          ? "No entries yet. Start by adding your first health note!"
                          : `No entries found matching "${searchQuery}". Try adjusting your search.`
                        }
                      </p>
                      {searchQuery && (
                        <Button 
                          variant="outline" 
                          onClick={() => setSearchQuery('')}
                          className="mt-4"
                        >
                          Clear Search
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4">
                    {filteredEntries.map((entry) => (
                      <Card key={entry.id} className="hover:shadow-md transition-shadow">
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <CardTitle className="text-lg">{entry.title}</CardTitle>
                                <Badge variant="secondary" className="text-xs">
                                  {entry.category.replace('-', ' ').toUpperCase()}
                                </Badge>
                                <div className="flex items-center gap-1">
                                  <Heart className="h-4 w-4 text-red-500" />
                                  <span className="text-sm font-medium">{entry.mood}/10</span>
                                </div>
                              </div>
                              <CardDescription className="flex items-center gap-4">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  {entry.date}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {entry.time}
                                </span>
                              </CardDescription>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleStar(entry.id);
                                }}
                                className="p-1 hover:bg-yellow-100"
                              >
                                <Star 
                                  className={`w-5 h-5 ${
                                    entry.starred 
                                      ? 'text-yellow-500 fill-yellow-500' 
                                      : 'text-gray-300 hover:text-yellow-400'
                                  }`} 
                                />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setSelectedEntryForAnalysis(selectedEntryForAnalysis === entry.id ? null : entry.id)}
                                className="flex items-center gap-1"
                              >
                                <Brain className="h-4 w-4" />
                                {selectedEntryForAnalysis === entry.id ? 'Hide' : 'Analyze'}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => deleteEntry(entry.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-700 mb-4">{entry.content}</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            {entry.symptoms.length > 0 && (
                              <div>
                                <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                                  <ThermometerSun className="h-4 w-4" />
                                  Symptoms:
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {entry.symptoms.map((symptom, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                      {symptom}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}

                            {entry.tags.length > 0 && (
                              <div>
                                <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                                  <Tag className="h-4 w-4" />
                                  Tags:
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {entry.tags.map((tag, index) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Individual Entry Analysis */}
                          {selectedEntryForAnalysis === entry.id && (
                            <div className="mt-4 p-4 bg-blue-50 rounded-lg border">
                              <h4 className="font-medium mb-3 flex items-center gap-2">
                                <Brain className="h-4 w-4" />
                                Entry Analysis
                              </h4>
                              {(() => {
                                const analysis = analyzeEntry(entry);
                                return (
                                  <div className="space-y-3">
                                    <div>
                                      <span className="text-sm font-medium">Sentiment: </span>
                                      <Badge variant={analysis.sentiment === 'Positive' ? 'default' : analysis.sentiment === 'Neutral' ? 'secondary' : 'destructive'}>
                                        {analysis.sentiment}
                                      </Badge>
                                    </div>
                                    <div>
                                      <h5 className="text-sm font-medium mb-1">Key Insights:</h5>
                                      <ul className="text-sm text-gray-600 space-y-1">
                                        {analysis.keyInsights.map((insight, index) => (
                                          <li key={index} className="flex items-start gap-1">
                                            <span className="text-blue-500 mt-1">•</span>
                                            {insight}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                    <div>
                                      <h5 className="text-sm font-medium mb-2 flex items-center gap-1">
                                        <BarChart3 className="h-4 w-4" />
                                        Entry Analytics:
                                      </h5>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-3 rounded-lg">
                                          <div className="flex items-center justify-between">
                                            <span className="text-xs text-blue-700">Mood Trend</span>
                                            <Badge variant={analysis.analytics.moodTrend === 'High' ? 'default' : analysis.analytics.moodTrend === 'Moderate' ? 'secondary' : 'destructive'} className="text-xs">
                                              {analysis.analytics.moodTrend}
                                            </Badge>
                                          </div>
                                          <p className="text-sm text-blue-800 mt-1">{analysis.analytics.moodComparison}</p>
                                        </div>
                                        
                                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-lg">
                                          <div className="flex items-center justify-between">
                                            <span className="text-xs text-green-700">Word Count</span>
                                            <span className="text-sm font-bold text-green-800">{analysis.analytics.wordCount}</span>
                                          </div>
                                          <p className="text-sm text-green-800 mt-1">{analysis.analytics.timePattern}</p>
                                        </div>
                                        
                                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-lg">
                                          <div className="flex items-center justify-between">
                                            <span className="text-xs text-purple-700">Category Usage</span>
                                            <PieChart className="h-4 w-4 text-purple-600" />
                                          </div>
                                          <p className="text-sm text-purple-800 mt-1">{analysis.analytics.categoryUsage}</p>
                                        </div>
                                        
                                        <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-3 rounded-lg">
                                          <div className="flex items-center justify-between">
                                            <span className="text-xs text-orange-700">Common Tags</span>
                                            <Tag className="h-4 w-4 text-orange-600" />
                                          </div>
                                          <p className="text-sm text-orange-800 mt-1">
                                            {analysis.analytics.commonTags.length > 0 
                                              ? `${analysis.analytics.commonTags.length} recurring tags` 
                                              : 'No recurring tags'}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })()}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="mt-6">
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold mb-6">Health Analytics Dashboard</h2>
                
                {/* Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2 text-sm">
                        <Activity className="h-4 w-4" />
                        Total Entries
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-teal-600">{entries.length}</div>
                      <p className="text-xs text-gray-600 mt-1">Health diary entries</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2 text-sm">
                        <Heart className="h-4 w-4" />
                        Average Mood
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-pink-600">
                        {entries.length > 0 ? (entries.reduce((sum, e) => sum + e.mood, 0) / entries.length).toFixed(1) : '0'}
                      </div>
                      <p className="text-xs text-gray-600 mt-1">Out of 10</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2 text-sm">
                        <ThermometerSun className="h-4 w-4" />
                        Symptoms Tracked
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-orange-600">
                        {Array.from(new Set(entries.flatMap(e => e.symptoms))).length}
                      </div>
                      <p className="text-xs text-gray-600 mt-1">Unique symptoms</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2 text-sm">
                        <TrendingUp className="h-4 w-4" />
                        This Week
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-blue-600">
                        {entries.filter(e => {
                          const entryDate = new Date(e.date);
                          const weekAgo = new Date();
                          weekAgo.setDate(weekAgo.getDate() - 7);
                          return entryDate >= weekAgo;
                        }).length}
                      </div>
                      <p className="text-xs text-gray-600 mt-1">Recent entries</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Category Distribution */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <PieChart className="h-5 w-5" />
                        Category Distribution
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {categoryStats.length > 0 ? (
                        <div className="space-y-3">
                          {categoryStats.map((stat) => (
                            <div key={stat.name} className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div 
                                  className="w-4 h-4 rounded" 
                                  style={{ backgroundColor: stat.color }}
                                ></div>
                                <span className="text-sm font-medium">{stat.name}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">{stat.value}</span>
                                <div className="w-20 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="h-2 rounded-full" 
                                    style={{ 
                                      backgroundColor: stat.color,
                                      width: `${(stat.value / entries.length) * 100}%`
                                    }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-center py-8">No data to display</p>
                      )}
                    </CardContent>
                  </Card>

                  {/* Mood Trend */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <LineChart className="h-5 w-5" />
                        Mood Trend (Last 7 entries)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {moodTrend.length > 0 ? (
                        <div className="space-y-3">
                          {moodTrend.map((point, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">{point.date}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">{point.mood}/10</span>
                                <div className="w-20 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="h-2 rounded-full bg-gradient-to-r from-red-400 via-yellow-400 to-green-400" 
                                    style={{ width: `${(point.mood / 10) * 100}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-center py-8">No mood data to display</p>
                      )}
                    </CardContent>
                  </Card>

                  {/* Symptom Frequency */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Stethoscope className="h-5 w-5" />
                        Most Common Symptoms
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {symptomFrequency.length > 0 ? (
                        <div className="space-y-3">
                          {symptomFrequency.map((item, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <span className="text-sm font-medium capitalize">{item.symptom}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">{item.count} times</span>
                                <div className="w-16 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="h-2 rounded-full bg-red-400" 
                                    style={{ width: `${(item.count / Math.max(...symptomFrequency.map(s => s.count))) * 100}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-center py-8">No symptoms reported yet</p>
                      )}
                    </CardContent>
                  </Card>

                  {/* Health Insights */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Zap className="h-5 w-5" />
                        Health Insights
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="p-3 bg-teal-50 rounded-lg">
                          <h4 className="font-medium text-teal-800 mb-1">Tracking Consistency</h4>
                          <p className="text-sm text-teal-700">
                            {entries.length >= 7 ? 'Excellent tracking! Keep it up.' : 'Try to log entries more regularly for better insights.'}
                          </p>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <h4 className="font-medium text-blue-800 mb-1">Mood Pattern</h4>
                          <p className="text-sm text-blue-700">
                            {entries.length > 0 && entries.reduce((sum, e) => sum + e.mood, 0) / entries.length >= 6
                              ? 'Your overall mood is positive!' 
                              : 'Consider focusing on activities that boost your mood.'}
                          </p>
                        </div>
                        <div className="p-3 bg-purple-50 rounded-lg">
                          <h4 className="font-medium text-purple-800 mb-1">Category Balance</h4>
                          <p className="text-sm text-purple-700">
                            {categoryStats.length >= 3 
                              ? 'Good variety in health tracking areas.' 
                              : 'Consider tracking different aspects of your health.'}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  );
};

export default HealthDiary;
