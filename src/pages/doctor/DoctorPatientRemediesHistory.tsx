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
  Leaf, 
  Search,
  Loader2,
  AlertCircle,
  Calendar,
  Clock,
  TrendingUp,
  Sparkles,
  Activity,
  RefreshCw,
  BarChart3,
  Target,
  Heart,
  Wind,
  Apple,
  Flame
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useDoctorRemediesHistory } from '@/hooks/use-doctor-remedies-history';

const DoctorPatientRemediesHistory = () => {
  const navigate = useNavigate();
  const { patientId } = useParams<{ patientId: string }>();
  const [searchQuery, setSearchQuery] = useState('');
  
  const { data, loading, error, refetch } = useDoctorRemediesHistory(patientId);

  const handleBack = () => {
    navigate(`/doctor/patients/${patientId}`);
  };

  // Filter searches by query
  const filteredSearches = data?.searches.filter(search => 
    search.search_query.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get pattern icon
  const getPatternIcon = (pattern: string) => {
    switch (pattern) {
      case 'fever_related': return <Flame className="w-4 h-4" />;
      case 'pain_related': return <AlertCircle className="w-4 h-4" />;
      case 'digestive': return <Apple className="w-4 h-4" />;
      case 'respiratory': return <Wind className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  // Format pattern name
  const formatPatternName = (pattern: string) => {
    return pattern.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

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
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                  <Leaf className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Natural Remedies History</h1>
                  <p className="text-gray-600">Symptom searches and natural remedy recommendations</p>
                </div>
              </div>
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

          {/* Loading State */}
          {loading && (
            <Card className="border-0 shadow-lg">
              <CardContent className="py-12">
                <div className="flex flex-col items-center justify-center gap-4">
                  <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
                  <p className="text-gray-500">Loading remedies history...</p>
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

          {/* Stats Cards */}
          {!loading && !error && data && (
            <>
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-4 gap-4"
              >
                <Card className="border-0 shadow-md">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Total Searches</p>
                        <p className="text-2xl font-bold text-gray-900">{data.total_searches}</p>
                      </div>
                      <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <Search className="w-6 h-6 text-emerald-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-md">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Common Symptoms</p>
                        <p className="text-2xl font-bold text-gray-900">{data.common_symptoms.length}</p>
                      </div>
                      <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                        <Target className="w-6 h-6 text-teal-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-md">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Results Found</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {data.searches.reduce((sum, s) => sum + s.results_count, 0)}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-md">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Avg Response</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {(data.searches.reduce((sum, s) => sum + s.response_time_ms, 0) / data.searches.length).toFixed(0)}ms
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Clock className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Common Symptoms & Search Patterns */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Common Symptoms */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card className="border-0 shadow-md">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Heart className="w-5 h-5 text-emerald-500" />
                        <CardTitle>Most Common Symptoms</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {data.common_symptoms.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {data.common_symptoms.map((symptom, idx) => (
                            <Badge 
                              key={idx} 
                              className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 text-sm"
                            >
                              {symptom}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">No symptoms tracked yet</p>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Search Patterns */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Card className="border-0 shadow-md">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-teal-500" />
                        <CardTitle>Search Patterns</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {Object.entries(data.recommendations_summary.search_patterns).map(([pattern, count]) => (
                          <div key={pattern} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="text-gray-600">
                                {getPatternIcon(pattern)}
                              </div>
                              <span className="text-sm text-gray-700">{formatPatternName(pattern)}</span>
                            </div>
                            <Badge variant="secondary" className="font-semibold">
                              {count}
                            </Badge>
                          </div>
                        ))}
                        {Object.keys(data.recommendations_summary.search_patterns).length === 0 && (
                          <p className="text-gray-500 text-sm">No patterns identified yet</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Date Range Info */}
              {data.recommendations_summary.date_range && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Card className="border-0 shadow-md bg-gradient-to-r from-emerald-50 to-teal-50">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Calendar className="w-5 h-5 text-emerald-600" />
                          <div>
                            <p className="text-sm text-emerald-700 font-semibold">Search History Period</p>
                            <p className="text-xs text-emerald-600 mt-1">
                              From {formatDate(data.recommendations_summary.date_range.oldest)} to {formatDate(data.recommendations_summary.date_range.newest)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-emerald-600">Last Search</p>
                          <p className="text-sm font-semibold text-emerald-900">{formatDate(data.last_search_date)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Search Bar */}
              {data.searches.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Card className="border-0 shadow-md">
                    <CardContent className="pt-6">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          type="text"
                          placeholder="Search by symptoms..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Search History List */}
              {filteredSearches.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="space-y-4"
                >
                  {filteredSearches.map((search, index) => (
                    <motion.div
                      key={search.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * index }}
                    >
                      <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
                        <CardContent className="pt-6">
                          <div className="space-y-4">
                            {/* Search Query */}
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <Leaf className="w-4 h-4 text-emerald-500" />
                                <span className="text-xs text-gray-500 uppercase font-semibold">Symptoms Searched</span>
                              </div>
                              <p className="text-lg font-semibold text-gray-900">{search.search_query}</p>
                            </div>

                            {/* Results Info */}
                            <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Sparkles className="w-4 h-4 text-emerald-600" />
                                  <span className="text-sm text-emerald-700 font-semibold">
                                    {search.results_count} {search.results_count === 1 ? 'Remedy' : 'Remedies'} Found
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-emerald-600">
                                  <Clock className="w-3 h-3" />
                                  {search.response_time_ms}ms
                                </div>
                              </div>
                            </div>

                            {/* Metadata */}
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {formatDate(search.created_at)}
                              </div>
                              <Badge variant="secondary" className="text-xs">
                                {search.search_type}
                              </Badge>
                              <Badge variant="outline" className="font-mono text-xs">
                                ID: {search.id.slice(0, 8)}...
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {/* No Search Results */}
              {data.searches.length > 0 && filteredSearches.length === 0 && (
                <Card className="border-0 shadow-lg">
                  <CardContent className="py-12">
                    <div className="text-center">
                      <Search className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No matches found</h3>
                      <p className="text-gray-500">Try adjusting your search query</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}

          {/* Empty State */}
          {!loading && !error && data && data.searches.length === 0 && (
            <Card className="border-0 shadow-lg">
              <CardContent className="py-12">
                <div className="text-center">
                  <Leaf className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Remedies Searches Yet</h3>
                  <p className="text-gray-500">Patient hasn't searched for any natural remedies based on symptoms</p>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default DoctorPatientRemediesHistory;
