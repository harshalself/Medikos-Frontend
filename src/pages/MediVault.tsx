import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useMediVault } from "@/hooks/use-medi-vault";
import { 
  Upload, 
  FileText, 
  Calendar, 
  Search,
  Filter,
  Trash2,
  Shield,
  Clock,
  Tag,
  Plus,
  X,
  MoreVertical,
  Download
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const MediVault = () => {
  const { toast } = useToast();
  const { 
    isUploading, 
    documents, 
    totalDocuments, 
    isLoadingDocuments, 
    uploadDocument, 
    fetchDocuments,
    downloadDocument,
    deleteDocument 
  } = useMediVault();
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isUploadFormOpen, setIsUploadFormOpen] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    description: ""
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch documents on component mount
  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  // Helper function to format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Helper function to get icon based on file type
  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return FileText; // Could use a different icon for images
    if (fileType === 'application/pdf') return FileText;
    return FileText; // Default icon
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.original_filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (doc.description && doc.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesSearch;
  });

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setSelectedFiles([files[0]]);
      setIsUploadDialogOpen(false);
      setIsUploadFormOpen(true);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      setSelectedFiles([files[0]]);
      setIsUploadDialogOpen(false);
      setIsUploadFormOpen(true);
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast({
        title: "File Required",
        description: "Please select at least one file to upload",
        variant: "destructive"
      });
      return;
    }

    try {
      const file = selectedFiles[0];
      const result = await uploadDocument({ file, description: uploadForm.description });

      toast({
        title: "Upload Successful",
        description: `Successfully uploaded "${file.name}"`,
      });

      // Reset form
      setUploadForm({
        description: ""
      });
      setSelectedFiles([]);
      setIsUploadFormOpen(false);
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Failed to upload document",
        variant: "destructive"
      });
    }
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-background">

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left flex-1">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 mb-4 shadow-lg animate-float">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 animate-fade-in">
                MediVault
              </h1>
              <p className="text-xl text-muted-foreground mb-6 animate-slide-up">
                Securely store and manage your medical documents with advanced encryption
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Upload className="w-5 h-5" />
                        Upload Medical Documents
                      </DialogTitle>
                      <DialogDescription>
                        Securely upload your medical documents with detailed information and tags for easy organization.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-6 py-4">
                      {/* File Selection */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Select Files</label>
                        <div 
                          onClick={handleFileSelect}
                          onDragOver={handleDragOver}
                          onDragEnter={handleDragEnter}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                          className="border-2 border-dashed border-teal-300 rounded-lg p-4 sm:p-6 text-center cursor-pointer hover:border-teal-500 transition-all duration-300 hover:bg-teal-50/50"
                        >
                          <Upload className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-teal-600" />
                          <p className="text-sm font-medium">Drop files here or click to select</p>
                          <p className="text-xs text-gray-500 mt-1">PDF, DOC, JPG, PNG (Max 10MB each)</p>
                          <Button 
                            className="mt-3 bg-gradient-to-r from-teal-500 to-cyan-600 hover:shadow-hover transition-all duration-300"
                            size="sm"
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            Upload Documents
                          </Button>
                        </div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          multiple
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        {selectedFiles.length > 0 && (
                          <div className="mt-4 space-y-3">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-medium text-gray-700">Selected Files ({selectedFiles.length})</h4>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => setSelectedFiles([])}
                                className="text-xs text-red-600 hover:text-red-800"
                              >
                                Clear All
                              </Button>
                            </div>
                            <div className="max-h-40 overflow-y-auto space-y-2">
                              {selectedFiles.map((file, index) => {
                                const fileType = file.type.includes('image') ? 'image' : 
                                               file.type.includes('pdf') ? 'pdf' : 'document';
                                const fileIcon = fileType === 'image' ? '🖼️' : 
                                               fileType === 'pdf' ? '📄' : '📋';
                                
                                return (
                                  <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                      <div className="text-lg">{fileIcon}</div>
                                      <div>
                                        <p className="text-sm font-medium text-gray-800 truncate max-w-[200px]" title={file.name}>
                                          {file.name}
                                        </p>
                                        <p className="text-xs text-gray-600">
                                          {file.type} • {(file.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                      </div>
                                    </div>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => setSelectedFiles(prev => prev.filter((_, i) => i !== index))}
                                      className="text-red-600 hover:text-red-800 hover:bg-red-50"
                                    >
                                      <X className="w-4 h-4" />
                                    </Button>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Document Title */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Document Title *</label>
                        <Input
                          placeholder="e.g., Blood Test Results - January 2024"
                          value={selectedFiles[0]?.name || ""}
                          disabled
                        />
                      </div>

                      {/* Description */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Description (Optional)</label>
                        <Textarea
                          placeholder="Brief description of the document..."
                          rows={3}
                          value={uploadForm.description}
                          onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                        />
                      </div>

                      {/* Upload Button */}
                      <div className="flex flex-col sm:flex-row justify-end gap-3">
                        <Button 
                          variant="outline" 
                          onClick={() => setIsUploadDialogOpen(false)}
                          className="w-full sm:w-auto"
                        >
                          Cancel
                        </Button>
                        <Button 
                          onClick={handleUpload}
                          className="bg-gradient-to-r from-teal-500 to-cyan-600 w-full sm:w-auto"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Document
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                
                {/* Upload Form Dialog - Opens after file selection */}
                <Dialog open={isUploadFormOpen} onOpenChange={setIsUploadFormOpen}>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Upload Document Details
                      </DialogTitle>
                      <DialogDescription>
                        Complete the details for your selected document
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-6 py-4">
                      {/* Selected File Display */}
                      {selectedFiles.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="text-sm font-medium text-gray-700">Selected File</h4>
                          <div className="p-3 bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="text-lg">
                                {selectedFiles[0].type.includes('image') ? '🖼️' : 
                                 selectedFiles[0].type.includes('pdf') ? '📄' : '📋'}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-800">{selectedFiles[0].name}</p>
                                <p className="text-xs text-gray-600">
                                  {selectedFiles[0].type} • {(selectedFiles[0].size / 1024 / 1024).toFixed(2)} MB
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Filename Display */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Filename</label>
                        <Input
                          value={selectedFiles[0]?.name || ""}
                          disabled
                          className="bg-gray-50"
                        />
                        <p className="text-xs text-gray-500">This is the original filename of your document</p>
                      </div>

                      {/* Description */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Description (Optional)</label>
                        <Textarea
                          placeholder="Brief description of the document..."
                          rows={3}
                          value={uploadForm.description}
                          onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                        />
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            setIsUploadFormOpen(false);
                            setSelectedFiles([]);
                            setUploadForm({
                              description: ""
                            });
                          }}
                          className="w-full sm:w-auto"
                        >
                          Cancel
                        </Button>
                        <Button 
                          onClick={handleUpload}
                          className="bg-gradient-to-r from-teal-500 to-cyan-600 w-full sm:w-auto"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Document
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            <div className="flex-1">
              <div className="relative w-full max-w-md mx-auto">
                <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
                  <DialogTrigger asChild>
                    <div 
                      className="w-full aspect-square rounded-3xl bg-gradient-to-br from-teal-100 to-cyan-100 border-4 border-dashed border-teal-300 flex flex-col items-center justify-center p-4 sm:p-8 hover:border-teal-500 transition-all duration-300 cursor-pointer card-hover"
                      onDragOver={handleDragOver}
                      onDragEnter={handleDragEnter}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => {
                        handleDrop(e);
                        setIsUploadDialogOpen(true);
                      }}
                    >
                      <Upload className="w-12 h-12 sm:w-16 sm:h-16 text-teal-600 mb-2 sm:mb-4 animate-bounce-slow" />
                      <p className="text-base sm:text-lg font-semibold text-foreground mb-1 sm:mb-2 text-center">Drag & Drop Files Here</p>
                      <p className="text-xs sm:text-sm text-muted-foreground text-center">or click to browse from your device</p>
                      <p className="text-xs text-muted-foreground mt-2 sm:mt-4 text-center">Supports: PDF, DOC, JPG, PNG (Max 10MB)</p>
                    </div>
                  </DialogTrigger>
                </Dialog>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 transition-all duration-300 focus:shadow-medical"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Documents Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Document List */}
        <div className="space-y-4">
          {isLoadingDocuments ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading your medical documents...</p>
              </div>
            </div>
          ) : filteredDocuments.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No documents found</h3>
              <p className="text-muted-foreground">
                {searchQuery ? 'Try adjusting your search terms.' : 'Upload your first medical document to get started.'}
              </p>
            </div>
          ) : (
            filteredDocuments.map((doc, index) => (
            <Card 
              key={doc.id} 
              className="group card-hover cursor-pointer animate-slide-up border-0 shadow-lg relative"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      {/* Document Icon */}
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-100 to-cyan-100 flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform">
                        {React.createElement(getFileIcon(doc.file_type), { className: "w-8 h-8 text-teal-600" })}
                      </div>

                    {/* Document Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-medium text-foreground group-hover:text-primary transition-colors truncate pr-8">
                          {doc.original_filename}
                        </h3>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3">{doc.description}</p>
                      
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(doc.uploaded_at).toLocaleDateString()}</span>
                        </div>
                        <span>•</span>
                        <span>{formatFileSize(doc.file_size)}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary">
                            Document
                          </Badge>
                        </div>

                        {/* Action Menu */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => downloadDocument(doc.id, doc.original_filename)}>
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-destructive" 
                              onClick={async () => {
                                if (window.confirm(`Are you sure you want to delete "${doc.original_filename}"? This action cannot be undone.`)) {
                                  try {
                                    await deleteDocument(doc.id);
                                  } catch (error) {
                                    // Error is already handled in the hook
                                  }
                                }
                              }}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
          )}
        </div>

        {/* Security Notice */}
        <div className="mt-12 p-6 bg-primary-soft rounded-lg border-l-4 border-l-primary">
          <div className="flex items-start space-x-3">
            <Shield className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-primary mb-2">Secure & Private Storage</h4>
              <p className="text-sm text-primary/80 leading-relaxed">
                Your medical documents are encrypted and stored securely. Only you have access to your 
                personal health information. We comply with HIPAA regulations to ensure your privacy 
                and data protection.
              </p>
            </div>
          </div>
        </div>
      </main>
      </div>
    </AppLayout>
  );
};

export default MediVault;