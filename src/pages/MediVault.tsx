import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  Upload, 
  FileText, 
  Calendar, 
  Search,
  Filter,
  Share,
  Trash2,
  Shield,
  Clock,
  Tag,
  Plus,
  X,
  Star,
  MoreVertical,
  Download,
  Syringe,
  FileImage
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const MediVault = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isUploadFormOpen, setIsUploadFormOpen] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: "",
    description: "",
    type: "",
    tags: [] as string[],
    currentTag: ""
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [selectedShareFiles, setSelectedShareFiles] = useState<number[]>([]);
  const [documents, setDocuments] = useState([
    {
      id: 1,
      name: "Blood Test Results - Complete Panel",
      type: "Report",
      date: "2024-01-15",
      size: "2.3 MB",
      icon: FileText,
      description: "Annual health checkup blood work",
      tags: ["Routine", "Blood Work"],
      starred: false,
    },
    {
      id: 2,
      name: "Prescription - Hypertension Medication",
      type: "Prescription",
      date: "2024-01-10",
      size: "856 KB",
      icon: FileText,
      description: "Dr. Smith - Blood pressure medication",
      tags: ["Chronic", "Cardiology"],
      starred: true,
    },
    {
      id: 3,
      name: "Health Insurance Policy",
      type: "Insurance",
      date: "2024-01-01",
      size: "4.1 MB",
      icon: Shield,
      description: "Annual insurance coverage document",
      tags: ["Policy", "Coverage"],
      starred: false,
    },
    {
      id: 4,
      name: "COVID-19 Vaccination Certificate",
      type: "Vaccination",
      date: "2023-12-20",
      size: "1.2 MB",
      icon: Shield,
      description: "Booster dose vaccination record",
      tags: ["Vaccine", "COVID-19"],
      starred: false,
    },
    {
      id: 5,
      name: "Chest X-Ray - Annual Checkup",
      type: "X-Ray",
      date: "2023-12-15",
      size: "8.7 MB",
      icon: FileText,
      description: "Routine chest examination",
      tags: ["Imaging", "Routine"],
      starred: true,
    },
    {
      id: 6,
      name: "Cardiology Consultation Report",
      type: "Report",
      date: "2023-12-01",
      size: "1.8 MB",
      icon: FileText,
      description: "Heart health assessment with Dr. Johnson",
      tags: ["Specialist", "Cardiology"],
      starred: false,
    },
  ]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filters = ["All", "Starred", "Prescription", "Report", "Insurance", "Vaccination", "X-Ray", "Other"];



  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    let matchesFilter;
    if (selectedFilter === "All") {
      matchesFilter = true;
    } else if (selectedFilter === "Starred") {
      matchesFilter = doc.starred;
    } else {
      matchesFilter = doc.type === selectedFilter;
    }
    
    return matchesSearch && matchesFilter;
  });

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setSelectedFiles([files[0]]); // Only take the first file for single upload
      setIsUploadDialogOpen(false); // Close file selection dialog
      setIsUploadFormOpen(true); // Open form for file details
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
      setSelectedFiles([files[0]]); // Only take the first file for single upload
      setIsUploadDialogOpen(false); // Close file selection dialog
      setIsUploadFormOpen(true); // Open form for file details
    }
  };

  const toggleStar = (docId: number) => {
    setDocuments(prevDocs => 
      prevDocs.map(doc => 
        doc.id === docId 
          ? { ...doc, starred: !doc.starred }
          : doc
      )
    );
    
    const doc = documents.find(d => d.id === docId);
    toast({
      title: doc?.starred ? "Document Unstarred" : "Document Starred",
      description: doc?.starred 
        ? "Document has been removed from starred items"
        : "Document has been added to starred items",
    });
  };

  const addTag = () => {
    if (uploadForm.currentTag.trim() && !uploadForm.tags.includes(uploadForm.currentTag.trim())) {
      setUploadForm(prev => ({
        ...prev,
        tags: [...prev.tags, prev.currentTag.trim()],
        currentTag: ""
      }));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setUploadForm(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleUpload = () => {
    if (!uploadForm.title.trim()) {
      toast({
        title: "Title Required",
        description: "Please enter a title for your document",
        variant: "destructive"
      });
      return;
    }

    if (!uploadForm.type) {
      toast({
        title: "Type Required",
        description: "Please select a document type",
        variant: "destructive"
      });
      return;
    }

    if (selectedFiles.length === 0) {
      toast({
        title: "File Required",
        description: "Please select at least one file to upload",
        variant: "destructive"
      });
      return;
    }

    // Simulate upload process
    toast({
      title: "Upload Started",
      description: `Uploading ${selectedFiles.length} file(s)...`,
    });

    setTimeout(() => {
      // Create new document and add to list
      const getDocumentIcon = (type: string) => {
        switch (type) {
          case 'Prescription': return FileText;
          case 'Report': return FileText;
          case 'Insurance': return Shield;
          case 'Vaccination': return Syringe;
          case 'X-Ray': return FileImage;
          default: return FileText;
        }
      };

      const newDocument = {
        id: documents.length + 1,
        name: uploadForm.title,
        type: uploadForm.type,
        date: new Date().toLocaleDateString(),
        size: `${(selectedFiles[0].size / 1024 / 1024).toFixed(2)} MB`,
        icon: getDocumentIcon(uploadForm.type),
        description: uploadForm.description || `Uploaded ${uploadForm.type.toLowerCase()}`,
        tags: uploadForm.tags.length > 0 ? uploadForm.tags : ["New"],
        starred: false,
        file: selectedFiles[0],
        preview: selectedFiles[0].type.includes('image') ? URL.createObjectURL(selectedFiles[0]) : null
      };

      setDocuments(prev => [...prev, newDocument]);
      
      toast({
        title: "Upload Successful",
        description: `Successfully uploaded "${uploadForm.title}"`,
      });
      
      // Reset form
      setUploadForm({
        title: "",
        description: "",
        type: "",
        tags: [],
        currentTag: ""
      });
      setSelectedFiles([]);
      setIsUploadFormOpen(false);
    }, 2000);
  };

  const getTypeColor = (type: string) => {
    const colors = {
      "Prescription": "bg-blue-100 text-blue-800",
      "Report": "bg-green-100 text-green-800",
      "Insurance": "bg-purple-100 text-purple-800",
      "Vaccination": "bg-teal-100 text-teal-800",
      "X-Ray": "bg-orange-100 text-orange-800",
      "Other": "bg-gray-100 text-gray-800"
    };
    return colors[type as keyof typeof colors] || colors.Other;
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
                          <p className="text-xs text-gray-500 mt-1">PDF, DOC, JPG, PNG (Max 20MB each)</p>
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
                          value={uploadForm.title}
                          onChange={(e) => setUploadForm(prev => ({ ...prev, title: e.target.value }))}
                        />
                      </div>

                      {/* Document Type */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Document Type *</label>
                        <Select onValueChange={(value) => setUploadForm(prev => ({ ...prev, type: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select document type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Prescription">Prescription</SelectItem>
                            <SelectItem value="Report">Medical Report</SelectItem>
                            <SelectItem value="Insurance">Insurance Document</SelectItem>
                            <SelectItem value="Vaccination">Vaccination Record</SelectItem>
                            <SelectItem value="X-Ray">Imaging/X-Ray</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Description */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Description</label>
                        <Textarea
                          placeholder="Brief description of the document..."
                          rows={3}
                          value={uploadForm.description}
                          onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                        />
                      </div>

                      {/* Tags */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Tags</label>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Add a tag"
                            value={uploadForm.currentTag}
                            onChange={(e) => setUploadForm(prev => ({ ...prev, currentTag: e.target.value }))}
                            onKeyPress={(e) => e.key === 'Enter' && addTag()}
                          />
                          <Button onClick={addTag} size="sm" type="button">
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        {uploadForm.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {uploadForm.tags.map((tag, index) => (
                              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                <Tag className="w-3 h-3" />
                                {tag}
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => removeTag(tag)}
                                  className="h-4 w-4 p-0 ml-1"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </Badge>
                            ))}
                          </div>
                        )}
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
                          Upload Documents
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

                      {/* Document Title */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Document Title *</label>
                        <Input
                          placeholder="e.g., Blood Test Results - January 2024"
                          value={uploadForm.title}
                          onChange={(e) => setUploadForm(prev => ({ ...prev, title: e.target.value }))}
                        />
                      </div>

                      {/* Document Type */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Document Type *</label>
                        <Select onValueChange={(value) => setUploadForm(prev => ({ ...prev, type: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select document type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Prescription">Prescription</SelectItem>
                            <SelectItem value="Report">Medical Report</SelectItem>
                            <SelectItem value="Insurance">Insurance Document</SelectItem>
                            <SelectItem value="Vaccination">Vaccination Record</SelectItem>
                            <SelectItem value="X-Ray">Imaging/X-Ray</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Description */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Description</label>
                        <Textarea
                          placeholder="Brief description of the document..."
                          rows={3}
                          value={uploadForm.description}
                          onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                        />
                      </div>

                      {/* Tags */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Tags</label>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Add a tag"
                            value={uploadForm.currentTag}
                            onChange={(e) => setUploadForm(prev => ({ ...prev, currentTag: e.target.value }))}
                            onKeyPress={(e) => e.key === 'Enter' && addTag()}
                          />
                          <Button onClick={addTag} size="sm" type="button">
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        {uploadForm.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {uploadForm.tags.map((tag, index) => (
                              <div key={index} className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
                                <span className="text-sm">{tag}</span>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setUploadForm(prev => ({
                                    ...prev,
                                    tags: prev.tags.filter((_, i) => i !== index)
                                  }))}
                                  className="h-4 w-4 p-0 hover:bg-red-100"
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            setIsUploadFormOpen(false);
                            setSelectedFiles([]);
                            setUploadForm({
                              title: "",
                              description: "",
                              type: "",
                              tags: [],
                              currentTag: ""
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
                
                <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      size="sm"
                      variant="outline"
                      className="hover:shadow-soft transition-all duration-300 text-xs sm:text-sm"
                    >
                      <Share className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                      <span className="hidden sm:inline">Share Files</span>
                      <span className="sm:hidden">Share</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Share className="w-5 h-5" />
                        Share Medical Documents
                      </DialogTitle>
                      <DialogDescription>
                        Select documents to share with healthcare providers or family members.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-6 py-4">
                      {/* Filter Section */}
                      <div className="flex items-center space-x-2 overflow-x-auto pb-2">
                        <Filter className="w-4 h-4 text-muted-foreground mr-2" />
                        {filters.map((filter) => (
                          <Button
                            key={filter}
                            variant={selectedFilter === filter ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedFilter(filter)}
                            className="whitespace-nowrap transition-all duration-200"
                          >
                            {filter}
                          </Button>
                        ))}
                      </div>

                      {/* Documents List with Checkboxes */}
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {filteredDocuments.map((doc) => (
                          <div key={doc.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                            <input
                              type="checkbox"
                              id={`share-${doc.id}`}
                              checked={selectedShareFiles.includes(doc.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedShareFiles([...selectedShareFiles, doc.id]);
                                } else {
                                  setSelectedShareFiles(selectedShareFiles.filter(id => id !== doc.id));
                                }
                              }}
                              className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                            />
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-teal-100 to-cyan-100 flex items-center justify-center flex-shrink-0">
                              <doc.icon className="w-6 h-6 text-teal-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{doc.name}</p>
                              <p className="text-xs text-gray-500">{doc.type} • {doc.size} • {doc.date}</p>
                            </div>
                            {doc.starred && (
                              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Share Actions */}
                      <div className="flex flex-col sm:flex-row justify-between gap-3">
                        <p className="text-sm text-muted-foreground">
                          {selectedShareFiles.length} document{selectedShareFiles.length !== 1 ? 's' : ''} selected
                        </p>
                        <div className="flex gap-3">
                          <Button 
                            variant="outline" 
                            onClick={() => {
                              setIsShareDialogOpen(false);
                              setSelectedShareFiles([]);
                            }}
                          >
                            Cancel
                          </Button>
                          <Button 
                            onClick={() => {
                              toast({
                                title: "Files Shared",
                                description: `${selectedShareFiles.length} document(s) shared successfully`,
                              });
                              setIsShareDialogOpen(false);
                              setSelectedShareFiles([]);
                            }}
                            className="bg-gradient-to-r from-teal-500 to-cyan-600"
                            disabled={selectedShareFiles.length === 0}
                          >
                            <Share className="w-4 h-4 mr-2" />
                            Share Selected
                          </Button>
                        </div>
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
                      <p className="text-xs text-muted-foreground mt-2 sm:mt-4 text-center">Supports: PDF, DOC, JPG, PNG (Max 20MB)</p>
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

            {/* Filter Pills */}
            <div className="flex items-center space-x-2 overflow-x-auto">
              <Filter className="w-4 h-4 text-muted-foreground mr-2" />
              {filters.map((filter) => (
                <Button
                  key={filter}
                  variant={selectedFilter === filter ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFilter(filter)}
                  className="whitespace-nowrap transition-all duration-200"
                >
                  {filter}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Documents Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="card-hover shadow-lg border-0 bg-gradient-to-br from-blue-50 to-cyan-50 animate-fade-in">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-1">Total Documents</p>
                  <p className="text-3xl font-bold text-primary">{documents.length}</p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg">
                  <FileText className="w-7 h-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-hover shadow-lg border-0 bg-gradient-to-br from-green-50 to-emerald-50 animate-fade-in" style={{ animationDelay: '100ms' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-1">Recent Uploads</p>
                  <p className="text-3xl font-bold text-success">3</p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
                  <Upload className="w-7 h-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-hover shadow-lg border-0 bg-gradient-to-br from-orange-50 to-yellow-50 animate-fade-in" style={{ animationDelay: '200ms' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-1">Storage Used</p>
                  <p className="text-3xl font-bold text-warning">18.7 MB</p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-yellow-600 flex items-center justify-center shadow-lg">
                  <Shield className="w-7 h-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-hover shadow-lg border-0 bg-gradient-to-br from-yellow-50 to-amber-50 animate-fade-in" style={{ animationDelay: '300ms' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-1">Starred Items</p>
                  <p className="text-3xl font-bold text-warning">{documents.filter(doc => doc.starred).length}</p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center shadow-lg">
                  <Star className="w-7 h-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Document List */}
        <div className="space-y-4">
          {filteredDocuments.map((doc, index) => (
            <Card 
              key={doc.id} 
              className="group card-hover cursor-pointer animate-slide-up border-0 shadow-lg relative"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CardContent className="p-6">
                  {/* Star Icon at top right */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleStar(doc.id);
                    }}
                    className="absolute top-2 right-2 p-1 hover:bg-yellow-100"
                  >
                    <Star 
                      className={`w-5 h-5 ${
                        doc.starred 
                          ? 'text-yellow-500 fill-yellow-500' 
                          : 'text-gray-300 hover:text-yellow-400'
                      }`} 
                    />
                  </Button>

                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      {/* Document Icon */}
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-100 to-cyan-100 flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform">
                        <doc.icon className="w-8 h-8 text-teal-600" />
                      </div>

                    {/* Document Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-medium text-foreground group-hover:text-primary transition-colors truncate pr-8">
                          {doc.name}
                        </h3>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3">{doc.description}</p>
                      
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(doc.date).toLocaleDateString()}</span>
                        </div>
                        <span>•</span>
                        <span>{doc.size}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Badge className={getTypeColor(doc.type)}>
                            {doc.type}
                          </Badge>
                          {doc.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              <Tag className="w-3 h-3 mr-1" />
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        {/* Action Menu */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => {
                              toast({
                                title: "Opening Document",
                                description: `Viewing ${doc.name}`,
                              });
                            }}>
                              <FileText className="w-4 h-4 mr-2" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                              toast({
                                title: "Downloading",
                                description: `Downloading ${doc.name}`,
                              });
                            }}>
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                              toast({
                                title: "Sharing Document",
                                description: `Sharing ${doc.name}`,
                              });
                            }}>
                              <Share className="w-4 h-4 mr-2" />
                              Share
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-destructive" 
                              onClick={() => {
                                toast({
                                  title: "Document Deleted",
                                  description: `${doc.name} has been deleted`,
                                  variant: "destructive",
                                });
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
          ))}
        </div>

        {filteredDocuments.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No documents found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or filter criteria
            </p>
            <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  className="bg-gradient-medical hover:shadow-medical transition-all duration-300 hover-scale"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Your First Document
                </Button>
              </DialogTrigger>
            </Dialog>
          </div>
        )}

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