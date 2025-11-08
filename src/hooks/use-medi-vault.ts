import { useState, useCallback } from 'react';
import { api } from '@/lib/api';
import { API_BASE_URL, API_ENDPOINTS } from '@/lib/api-config';
import { useToast } from '@/hooks/use-toast';

export interface MediVaultDocument {
  id: number;
  filename: string;
  original_filename: string;
  file_type: string;
  file_size: number;
  description?: string;
  uploaded_at: string;
}

export interface DocumentListResponse {
  documents: MediVaultDocument[];
  total: number;
}

export interface UploadDocumentRequest {
  file: File;
  description?: string;
}

export const useMediVault = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [documents, setDocuments] = useState<MediVaultDocument[]>([]);
  const [totalDocuments, setTotalDocuments] = useState(0);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(false);
  const { toast } = useToast();

  const uploadDocument = useCallback(async (request: UploadDocumentRequest): Promise<MediVaultDocument> => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', request.file);
      if (request.description) {
        formData.append('description', request.description);
      }

      const response = await api.upload<MediVaultDocument>(API_ENDPOINTS.medivault.upload, formData);

      toast({
        title: 'Success',
        description: 'Document uploaded successfully',
      });
      return response;
    } catch (error: any) {
      console.error('[MediVault Upload] Upload failed:', error.message);
      toast({
        title: 'Error',
        description: 'Failed to upload document',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsUploading(false);
    }
  }, [toast]);

  const fetchDocuments = useCallback(async (limit: number = 50, offset: number = 0): Promise<DocumentListResponse> => {
    setIsLoadingDocuments(true);
    try {
      const response = await api.get<DocumentListResponse>(`${API_ENDPOINTS.medivault.documents}?limit=${limit}&offset=${offset}`);
      
      setDocuments(response.documents);
      setTotalDocuments(response.total);
      return response;
    } catch (error: any) {
      console.error('[MediVault] Failed to fetch documents:', error.message);
      toast({
        title: 'Error',
        description: 'Failed to load documents',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoadingDocuments(false);
    }
  }, [toast]);

  const downloadDocument = useCallback(async (documentId: number, filename: string): Promise<void> => {
    try {
      // For file downloads, we need to handle the response as a blob
      // Since the API client expects JSON, we'll make a direct fetch call
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.medivault.download(documentId)}`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });

      if (!response.ok) {
        throw new Error(`Download failed: ${response.status} ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary anchor element and trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: 'Success',
        description: `Downloaded ${filename}`,
      });
    } catch (error: any) {
      console.error('[MediVault] Download failed:', error);
      toast({
        title: 'Error',
        description: 'Failed to download document',
        variant: 'destructive',
      });
      throw error;
    }
  }, [toast]);

  const deleteDocument = useCallback(async (documentId: number): Promise<void> => {
    try {
      await api.delete(API_ENDPOINTS.medivault.delete(documentId));

      // Remove the document from local state
      setDocuments(prev => prev.filter(doc => doc.id !== documentId));
      setTotalDocuments(prev => prev - 1);

      toast({
        title: 'Success',
        description: 'Document deleted successfully',
      });
    } catch (error: any) {
      console.error('[MediVault] Delete failed:', error.message);
      toast({
        title: 'Error',
        description: 'Failed to delete document',
        variant: 'destructive',
      });
      throw error;
    }
  }, [toast]);

  const viewDocument = useCallback(async (documentId: number, filename: string): Promise<void> => {
    try {
      // For viewing documents, we need to handle the response as a blob
      // Make a direct fetch call to get the document
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.medivault.download(documentId)}`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();

      // Create a blob URL
      const url = window.URL.createObjectURL(blob);

      // Open in new tab
      window.open(url, '_blank');

      // Clean up the blob URL after a delay to ensure the new tab has time to load
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 1000);

      toast({
        title: 'Success',
        description: `Opened ${filename} in new tab`,
      });
    } catch (error: any) {
      console.error('[MediVault] View failed:', error);
      toast({
        title: 'Error',
        description: 'Failed to view document',
        variant: 'destructive',
      });
      throw error;
    }
  }, [toast]);

  return {
    isUploading,
    documents,
    totalDocuments,
    isLoadingDocuments,
    uploadDocument,
    fetchDocuments,
    downloadDocument,
    viewDocument,
    deleteDocument,
  };
};