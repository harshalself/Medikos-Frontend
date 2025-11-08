import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { 
  ArrowLeft, 
  BookOpen, 
  Search,
  Loader2,
  AlertCircle,
  Calendar,
  Smile,
  Frown,
  Meh,
  Heart,
  Activity,
  RefreshCw,
  Sparkles,
  TrendingUp,
  FileText,
  ChevronRight,
  Filter,
  Download
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useDoctorPatientHealthDiary } from '@/hooks/use-doctor-patient-health-diary';

const DoctorPatientHealthDiary = () => {
  const navigate = useNavigate();
  const { patientId } = useParams<{ patientId: string }>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMood, setSelectedMood] = useState<string>('');
  
  const { entries, totalCount, loading, error, summary, loadingSummary, refetch, fetchSummary } = 
    useDoctorPatientHealthDiary(patientId);

  const handleBack = () => {
    navigate(`/doctor/patients/${patientId}`);
  };

  // Filter entries by query and mood
  const filteredEntries = entries.filter(entry => {
    const matchesSearch = !searchQuery || 
      entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (entry.symptoms && entry.symptoms.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesMood = !selectedMood || entry.mood === selectedMood;
    
    return matchesSearch && matchesMood;
  });

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    });
  };

  // Format time
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get mood icon and color
  const getMoodDisplay = (mood: string | null) => {
    if (!mood) return { icon: <Meh className="w-4 h-4" />, color: 'bg-gray-100 text-gray-700', label: 'Not specified' };
    
    const moodLower = mood.toLowerCase();
    
    if (['happy', 'excited', 'grateful', 'peaceful', 'energetic'].includes(moodLower)) {
      return { icon: <Smile className="w-4 h-4" />, color: 'bg-green-100 text-green-700', label: mood };
    }
    if (['sad', 'anxious', 'frustrated', 'stressed', 'worried', 'angry'].includes(moodLower)) {
      return { icon: <Frown className="w-4 h-4" />, color: 'bg-red-100 text-red-700', label: mood };
    }
    return { icon: <Meh className="w-4 h-4" />, color: 'bg-yellow-100 text-yellow-700', label: mood };
  };

  // Get unique moods from entries
  const uniqueMoods = Array.from(new Set(entries.map(e => e.mood).filter(Boolean))) as string[];

  // Count mood occurrences
  const moodCounts = entries.reduce((acc, entry) => {
    if (entry.mood) {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  // Get entries with symptoms
  const entriesWithSymptoms = entries.filter(e => e.symptoms);

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
           style={{ paddingLeft: 'max(1.5rem, calc(50vw - 896px + 1.5rem + 80px))' }}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="space-y-4">
            <Button
              variant="ghost"
              onClick={handleBack}
              className="group hover:bg-gray-100 transition-all"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Patient Records
            </Button>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Health Diary</h1>
                  <p className="text-gray-600">Daily health entries and personal reflections</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!loading && !error && entries.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchSummary()}
                    className="gap-2"
                    disabled={loadingSummary}
                  >
                    {loadingSummary ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                    AI Summary
                  </Button>
                )}
                {!loading && !error && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => refetch()}
                    className="gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <Card className="border-0 shadow-lg">
              <CardContent className="py-12">
                <div className="flex flex-col items-center justify-center gap-4">
                  <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
                  <p className="text-gray-500">Loading health diary...</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Error State */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <span>{error}</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => refetch()}
                  className="ml-4"
                >
                  Retry
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* AI Summary */}
          {summary && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-50 to-pink-50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-purple-600" />
                      <CardTitle className="text-purple-900">AI-Generated Health Summary</CardTitle>
                    </div>
                    <Badge className="bg-purple-200 text-purple-800 hover:bg-purple-300">
                      {summary.total_entries} entries analyzed
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-gray-800 leading-relaxed">{summary.summary}</p>
                    <div className="flex items-center gap-4 text-sm text-purple-700">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(summary.date_range.start)} - {formatDate(summary.date_range.end)}
                      </div>
                      <div className="text-xs text-purple-600">
                        Generated: {formatTime(summary.generated_at)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Stats Cards */}
          {!loading && !error && entries.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-4"
            >
              <Card className="border-0 shadow-md">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Total Entries</p>
                      <p className="text-2xl font-bold text-gray-900">{totalCount}</p>
                    </div>
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-orange-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">With Symptoms</p>
                      <p className="text-2xl font-bold text-gray-900">{entriesWithSymptoms.length}</p>
                    </div>
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                      <Activity className="w-6 h-6 text-red-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Mood Tracked</p>
                      <p className="text-2xl font-bold text-gray-900">{uniqueMoods.length}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Heart className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Most Common</p>
                      <p className="text-lg font-bold text-gray-900 capitalize">
                        {Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Search and Filter Bar */}
          {!loading && !error && entries.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border-0 shadow-md">
                <CardContent className="pt-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Search entries by title, description, or symptoms..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <div className="flex gap-2">
                      <select
                        value={selectedMood}
                        onChange={(e) => setSelectedMood(e.target.value)}
                        className="px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="">All Moods</option>
                        {uniqueMoods.map(mood => (
                          <option key={mood} value={mood}>{mood}</option>
                        ))}
                      </select>
                      {(searchQuery || selectedMood) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSearchQuery('');
                            setSelectedMood('');
                          }}
                        >
                          Clear
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Diary Entries */}
          {!loading && !error && filteredEntries.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-4"
            >
              {filteredEntries.map((entry, index) => {
                const moodDisplay = getMoodDisplay(entry.mood);
                return (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * index }}
                  >
                    <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          {/* Header */}
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <Calendar className="w-4 h-4 text-gray-500" />
                                <span className="text-sm font-semibold text-gray-900">
                                  {formatDate(entry.entry_date)}
                                </span>
                                <Badge className={`${moodDisplay.color} border-0 capitalize`}>
                                  <span className="mr-1">{moodDisplay.icon}</span>
                                  {moodDisplay.label}
                                </Badge>
                              </div>
                              <h3 className="text-xl font-bold text-gray-900 mb-2">{entry.title}</h3>
                            </div>
                          </div>

                          {/* Description */}
                          <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                              {entry.description}
                            </p>
                          </div>

                          {/* Symptoms */}
                          {entry.symptoms && (
                            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                              <div className="flex items-start gap-2">
                                <Activity className="w-4 h-4 text-red-600 mt-0.5" />
                                <div className="flex-1">
                                  <p className="text-xs text-red-700 font-semibold uppercase mb-1">Symptoms</p>
                                  <p className="text-sm text-red-900">{entry.symptoms}</p>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Metadata */}
                          <div className="flex items-center gap-4 text-xs text-gray-500 pt-2 border-t">
                            <span>Created: {formatTime(entry.created_at)}</span>
                            {entry.updated_at !== entry.created_at && (
                              <span>Updated: {formatTime(entry.updated_at)}</span>
                            )}
                            <span className="ml-auto font-mono">ID: {entry.id.slice(0, 8)}...</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {/* No Results from Filter */}
          {!loading && !error && entries.length > 0 && filteredEntries.length === 0 && (
            <Card className="border-0 shadow-lg">
              <CardContent className="py-12">
                <div className="text-center">
                  <Search className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No matches found</h3>
                  <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedMood('');
                    }}
                    className="mt-4"
                  >
                    Clear Filters
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Empty State */}
          {!loading && !error && entries.length === 0 && (
            <Card className="border-0 shadow-lg">
              <CardContent className="py-12">
                <div className="text-center">
                  <BookOpen className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Health Diary Entries Yet</h3>
                  <p className="text-gray-500">Patient hasn't created any health diary entries</p>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default DoctorPatientHealthDiary;
