import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useHealthDiary } from '@/hooks/use-health-diary';
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
  Search,
  Filter
} from 'lucide-react';
import { DiaryEntry, MoodType } from '@/types/diary';

const HealthDiary = () => {
  const { toast } = useToast();
  const { createEntry, fetchEntries, deleteEntry, fetchHealthSummary, isCreating, isFetching, isDeleting, isFetchingSummary, entries: apiEntries, totalCount, healthSummary } = useHealthDiary();
  
  const [entries, setEntries] = useState<DiaryEntry[]>([]);

  const [newEntry, setNewEntry] = useState<Partial<DiaryEntry>>({
    title: '',
    description: '',
    mood: 'neutral',
    symptoms: ''
  });

  const [currentSymptom, setCurrentSymptom] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    mood: '',
    limit: 20,
    offset: 0
  });

  // Mood options from API
  const MOOD_OPTIONS: MoodType[] = [
    'happy', 'sad', 'anxious', 'neutral', 'excited',
    'tired', 'energetic', 'calm', 'frustrated', 'grateful',
    'stressed', 'relaxed', 'angry', 'peaceful', 'worried'
  ];

  // Fetch entries on mount and when filters change
  useEffect(() => {
    const loadEntries = async () => {
      try {
        await fetchEntries(filters);
      } catch (error) {
        // Error already handled in hook
      }
    };
    
    loadEntries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update local entries when API entries change
  useEffect(() => {
    setEntries(apiEntries);
  }, [apiEntries]);

  // Filter entries based on search query
  const filteredEntries = entries.filter(entry => {
    const matchesSearch = searchQuery === '' ||
      entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (entry.symptoms && entry.symptoms.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (entry.mood && entry.mood.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  const saveEntry = async () => {
    if (!newEntry.title || !newEntry.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in title and description.",
        variant: "destructive"
      });
      return;
    }

    try {
      const entryData = {
        title: newEntry.title,
        description: newEntry.description,
        mood: newEntry.mood || undefined,
        symptoms: newEntry.symptoms || undefined,
      };

      const createdEntry = await createEntry(entryData);

      // Refresh the entries list after creating
      await fetchEntries(filters);
      setNewEntry({ title: '', description: '', symptoms: '', mood: 'neutral' });
      setShowAddForm(false);
    } catch (error) {
      // Error is already handled in the hook
    }
  };

  // Analytics calculations
  const moodStats = MOOD_OPTIONS.map(mood => ({
    name: mood.charAt(0).toUpperCase() + mood.slice(1),
    value: entries.filter(e => e.mood === mood).length,
    color: ['#06b6d4', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#6366f1', '#84cc16', '#ec4899', '#14b8a6', '#f97316', '#8b5cf6', '#06b6d4', '#ef4444', '#10b981', '#f59e0b'][MOOD_OPTIONS.indexOf(mood)]
  })).filter(stat => stat.value > 0);

  const mostCommonMood = moodStats.length > 0 ? moodStats.sort((a, b) => b.value - a.value)[0].name.toLowerCase() : 'neutral';

  const moodTrend = entries.slice(0, 7).reverse().map((entry, index) => ({
    day: `Day ${index + 1}`,
    mood: entry.mood || 'neutral',
    date: entry.entry_date
  }));

  const symptomFrequency = entries
    .filter(entry => entry.symptoms)
    .reduce((acc, entry) => {
      const symptoms = entry.symptoms!.split(',').map(s => s.trim());
      symptoms.forEach(symptom => {
        acc.set(symptom, (acc.get(symptom) || 0) + 1);
      });
      return acc;
    }, new Map<string, number>())
    .entries();

  const symptomStats = Array.from(symptomFrequency)
    .map(([symptom, count]) => ({ symptom, count }))
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
                      value={newEntry.description || ''}
                      onChange={(e) => setNewEntry(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Mood</label>
                    <Select onValueChange={(value) => setNewEntry(prev => ({ ...prev, mood: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="How are you feeling?" />
                      </SelectTrigger>
                      <SelectContent>
                        {MOOD_OPTIONS.map(mood => (
                          <SelectItem key={mood} value={mood}>
                            {mood.charAt(0).toUpperCase() + mood.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Symptoms</label>
                    <Input
                      placeholder="e.g., headache, nausea, fatigue (optional)"
                      value={newEntry.symptoms || ''}
                      onChange={(e) => setNewEntry(prev => ({ ...prev, symptoms: e.target.value }))}
                    />
                  </div>

                    <div className="flex gap-3">
                      <Button 
                        variant="outline" 
                        onClick={() => setShowAddForm(false)} 
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button onClick={saveEntry} className="flex-1" size="lg" disabled={isCreating}>
                        <NotebookPen className="h-4 w-4 mr-2" />
                        {isCreating ? 'Saving...' : 'Save Entry'}
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
                  <h2 className="text-2xl font-semibold">All Health Entries ({totalCount})</h2>
                  <Badge variant="outline" className="text-sm">
                    {filteredEntries.length} of {totalCount} entries
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

                {/* Loading State */}
                {isFetching ? (
                  <Card>
                    <CardContent className="text-center py-12">
                      <div className="flex flex-col items-center gap-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        <p className="text-gray-600">Loading entries...</p>
                      </div>
                    </CardContent>
                  </Card>
                ) : filteredEntries.length === 0 ? (
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
                                {entry.mood && (
                                  <Badge variant="secondary" className="text-xs">
                                    {entry.mood}
                                  </Badge>
                                )}
                              </div>
                              <CardDescription className="flex items-center gap-4">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  {new Date(entry.entry_date).toLocaleDateString()}
                                </span>
                              </CardDescription>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={async () => {
                                  try {
                                    await deleteEntry(entry.id);
                                  } catch (error) {
                                    // Error is already handled in the hook
                                  }
                                }}
                                disabled={isDeleting}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-700 mb-4">{entry.description}</p>

                          {entry.symptoms && (
                            <div className="mb-4">
                              <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                                <ThermometerSun className="h-4 w-4" />
                                Symptoms:
                              </h4>
                              <Badge variant="secondary" className="text-xs">
                                {entry.symptoms}
                              </Badge>
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
                        Most Common Mood
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-pink-600">
                        {moodStats.length > 0 ? moodStats[0].name : 'None'}
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        {moodStats.length > 0 ? `${moodStats[0].value} entries` : 'No entries yet'}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2 text-sm">
                        <ThermometerSun className="h-4 w-4" />
                        Symptom Reports
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-orange-600">
                        {entries.filter(e => e.symptoms).length}
                      </div>
                      <p className="text-xs text-gray-600 mt-1">Entries with symptoms</p>
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
                          const entryDate = new Date(e.entry_date);
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Category Distribution */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <PieChart className="h-5 w-5" />
                        Mood Distribution
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {moodStats.length > 0 ? (
                        <div className="space-y-3">
                          {moodStats.map((stat) => (
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
                                <Badge variant="outline" className="text-xs">
                                  {point.mood || 'Not specified'}
                                </Badge>
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
                      {symptomStats.length > 0 ? (
                        <div className="space-y-3">
                          {symptomStats.map((item, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <span className="text-sm font-medium capitalize">{item.symptom}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">{item.count} times</span>
                                <div className="w-16 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="h-2 rounded-full bg-red-400" 
                                    style={{ width: `${(item.count / Math.max(...symptomStats.map(s => s.count))) * 100}%` }}
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

                  {/* AI Health Summary */}
                  <Card className="lg:col-span-3">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Brain className="h-5 w-5" />
                        AI Health Summary
                      </CardTitle>
                      <CardDescription>
                        Get AI-powered insights about your health patterns and trends
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {healthSummary ? (
                        <div className="space-y-4">
                          <div className="prose prose-sm max-w-none">
                            <div className="text-gray-700 leading-relaxed">
                              {healthSummary.summary.split('\n').map((line, index) => (
                                <p key={index} className="mb-3">
                                  {line.split(/(\*\*.*?\*\*)/g).map((part, partIndex) => {
                                    if (part.startsWith('**') && part.endsWith('**')) {
                                      return (
                                        <strong key={partIndex} className="font-semibold text-gray-900">
                                          {part.slice(2, -2)}
                                        </strong>
                                      );
                                    }
                                    return part;
                                  })}
                                </p>
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center justify-between pt-4 border-t">
                            <div className="text-sm text-gray-500">
                              <span className="font-medium">Based on {healthSummary.total_entries} entries</span>
                              <br />
                              <span>
                                {new Date(healthSummary.date_range.start).toLocaleDateString()} - {new Date(healthSummary.date_range.end).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="text-xs text-gray-400">
                              Generated: {new Date(healthSummary.generated_at).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Brain className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                          <p className="text-gray-600 mb-4">
                            Generate an AI-powered health summary based on your diary entries
                          </p>
                          {entries.length === 0 ? (
                            <p className="text-sm text-gray-500">
                              Add some diary entries first to generate insights
                            </p>
                          ) : (
                            <Button
                              onClick={async () => {
                                try {
                                  await fetchHealthSummary();
                                } catch (error) {
                                  // Error is already handled in the hook
                                }
                              }}
                              disabled={isFetchingSummary}
                              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                            >
                              {isFetchingSummary ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                  Generating...
                                </>
                              ) : (
                                <>
                                  <Brain className="h-4 w-4 mr-2" />
                                  Generate Summary
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      )}
                      {healthSummary && (
                        <div className="pt-4 border-t">
                          <Button
                            variant="outline"
                            onClick={async () => {
                              try {
                                await fetchHealthSummary();
                              } catch (error) {
                                // Error is already handled in the hook
                              }
                            }}
                            disabled={isFetchingSummary}
                            className="w-full"
                          >
                            {isFetchingSummary ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                                Refreshing...
                              </>
                            ) : (
                              <>
                                <Brain className="h-4 w-4 mr-2" />
                                Refresh Summary
                              </>
                            )}
                          </Button>
                        </div>
                      )}
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
