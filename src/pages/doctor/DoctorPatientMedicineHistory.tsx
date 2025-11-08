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
  Pill, 
  Search,
  Loader2,
  AlertCircle,
  Calendar,
  Clock,
  TrendingUp,
  CheckCircle2,
  Info,
  Filter,
  RefreshCw,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useDoctorMedicineHistory } from '@/hooks/use-doctor-medicine-history';

const DoctorPatientMedicineHistory = () => {
  const navigate = useNavigate();
  const { patientId } = useParams<{ patientId: string }>();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  
  const { data, loading, error, refetch } = useDoctorMedicineHistory(itemsPerPage, (currentPage - 1) * itemsPerPage);

  const handleBack = () => {
    navigate(`/doctor/patients/${patientId}`);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    refetch(itemsPerPage, (newPage - 1) * itemsPerPage);
  };

  // Filter searches by query
  const filteredSearches = data?.searches.filter(search => 
    search.branded_medicine_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    search.selected_alternative?.generic_name.toLowerCase().includes(searchQuery.toLowerCase())
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

  // Get confidence color
  const getConfidenceColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50';
    if (score >= 70) return 'text-yellow-600 bg-yellow-50';
    return 'text-orange-600 bg-orange-50';
  };

  const totalPages = data ? Math.ceil(data.total_count / itemsPerPage) : 0;

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
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                  <Pill className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Generic Medicine History</h1>
                  <p className="text-gray-600">All medicine searches and generic alternatives</p>
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

          {/* Stats Cards */}
          {!loading && !error && data && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              <Card className="border-0 shadow-md">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Total Searches</p>
                      <p className="text-2xl font-bold text-gray-900">{data.total_count}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Search className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">With Alternatives</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {data.searches.filter(s => s.selected_alternative).length}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Average Confidence</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {(data.searches
                          .filter(s => s.selected_alternative?.confidence_score)
                          .reduce((sum, s) => sum + (s.selected_alternative?.confidence_score || 0), 0) / 
                          data.searches.filter(s => s.selected_alternative?.confidence_score).length || 0
                        ).toFixed(1)}%
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Search Bar */}
          {!loading && !error && data && data.searches.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-0 shadow-md">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Search by branded or generic medicine name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Button variant="outline" className="gap-2">
                      <Filter className="w-4 h-4" />
                      Filter
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Loading State */}
          {loading && (
            <Card className="border-0 shadow-lg">
              <CardContent className="py-12">
                <div className="flex flex-col items-center justify-center gap-4">
                  <Loader2 className="w-12 h-12 text-green-500 animate-spin" />
                  <p className="text-gray-500">Loading medicine history...</p>
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

          {/* Medicine History List */}
          {!loading && !error && filteredSearches.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
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
                      <div className="flex items-start justify-between gap-4">
                        {/* Main Content */}
                        <div className="flex-1 space-y-3">
                          {/* Branded Medicine */}
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Pill className="w-4 h-4 text-gray-500" />
                              <span className="text-xs text-gray-500 uppercase font-semibold">Searched Medicine</span>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">{search.branded_medicine_name}</h3>
                          </div>

                          {/* Generic Alternative */}
                          {search.selected_alternative && (
                            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                                    <span className="text-xs text-green-700 uppercase font-semibold">Generic Alternative Found</span>
                                  </div>
                                  <p className="text-base font-semibold text-green-900">
                                    {search.selected_alternative.generic_name}
                                  </p>
                                </div>
                                <Badge 
                                  className={`${getConfidenceColor(search.selected_alternative.confidence_score)} border-0 font-semibold`}
                                >
                                  {search.selected_alternative.confidence_score.toFixed(1)}% Match
                                </Badge>
                              </div>
                            </div>
                          )}

                          {/* No Alternative */}
                          {!search.selected_alternative && (
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                              <div className="flex items-center gap-2">
                                <Info className="w-4 h-4 text-gray-500" />
                                <span className="text-sm text-gray-600">No generic alternative selected</span>
                              </div>
                            </div>
                          )}

                          {/* Metadata */}
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(search.created_at)}
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {search.search_type}
                            </Badge>
                            {search.session_id && (
                              <span className="text-xs">Session: {search.session_id.slice(0, 8)}...</span>
                            )}
                          </div>
                        </div>

                        {/* Search ID Badge */}
                        <div className="flex flex-col items-end gap-2">
                          <Badge variant="outline" className="font-mono text-xs">
                            ID: {search.id}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Pagination */}
          {!loading && !error && data && data.total_count > itemsPerPage && (
            <Card className="border-0 shadow-md">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, data.total_count)} of {data.total_count} searches
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="gap-1"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const page = i + 1;
                        return (
                          <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(page)}
                            className="w-8 h-8 p-0"
                          >
                            {page}
                          </Button>
                        );
                      })}
                      {totalPages > 5 && <span className="text-gray-500">...</span>}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="gap-1"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Empty State */}
          {!loading && !error && data && data.searches.length === 0 && (
            <Card className="border-0 shadow-lg">
              <CardContent className="py-12">
                <div className="text-center">
                  <Pill className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Medicine Searches Yet</h3>
                  <p className="text-gray-500">Patient hasn't searched for any medicines using the generic medicine suggester</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* No Search Results */}
          {!loading && !error && data && data.searches.length > 0 && filteredSearches.length === 0 && (
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
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default DoctorPatientMedicineHistory;
