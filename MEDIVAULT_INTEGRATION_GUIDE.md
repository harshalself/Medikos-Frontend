# Medikos Backend - MediVault API Integration Guide

## Essential Details for Frontend Integration

### 1. Base URL
```
http://localhost:8000/api
```

### 2. API Endpoints

#### Document Management
- `POST /medivault/upload` - Upload medical document
- `GET /medivault/documents` - Get user's documents (paginated)
- `GET /medivault/download/{document_id}` - Download specific document
- `PUT /medivault/{document_id}` - Update document metadata
- `DELETE /medivault/{document_id}` - Delete document

### 3. Authentication Requirements
- **Required Authentication**: All MediVault endpoints require user authentication
- **User Isolation**: Users can only access their own documents
- **Secure Storage**: Documents stored with user-specific paths and permissions

### 4. File Storage & Security
MediVault uses Supabase Storage for secure document management:
- **Secure Storage**: Documents stored in Supabase Storage with user-specific paths
- **File Encryption**: Automatic encryption at rest
- **Access Control**: Row Level Security (RLS) ensures users only access their documents
- **File Validation**: Type and size validation before upload
- **Privacy First**: Medical documents require explicit user consent and authentication

## Request/Response Examples

### Upload Medical Document

```http
POST /medivault/upload
Content-Type: multipart/form-data
Authorization: Bearer <access_token>

Form Data:
- file: [PDF/Image file]
- description: "Blood test report from Jan 2025" (optional)
```

**Response (201):**
```json
{
  "id": 1,
  "filename": "user123/unique-id_blood_test.pdf",
  "original_filename": "blood_test.pdf",
  "file_type": "application/pdf",
  "file_size": 245760,
  "description": "Blood test report from Jan 2025",
  "uploaded_at": "2025-10-17T10:30:00Z"
}
```

### Get User's Documents

```http
GET /medivault/documents?limit=20&offset=0
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "documents": [
    {
      "id": 1,
      "filename": "user123/unique-id_blood_test.pdf",
      "original_filename": "blood_test.pdf",
      "file_type": "application/pdf",
      "file_size": 245760,
      "description": "Blood test report from Jan 2025",
      "uploaded_at": "2025-10-17T10:30:00Z"
    },
    {
      "id": 2,
      "filename": "user123/unique-id_xray.png",
      "original_filename": "chest_xray.png",
      "file_type": "image/png",
      "file_size": 512000,
      "description": "Chest X-ray from annual checkup",
      "uploaded_at": "2025-10-17T09:15:00Z"
    }
  ],
  "total": 2
}
```

### Download Document

```http
GET /medivault/download/1
Authorization: Bearer <access_token>
```

**Response (200):**
```
Content-Type: application/pdf
Content-Disposition: attachment; filename="blood_test.pdf"

[Binary file content]
```

### Update Document Metadata

```http
PUT /medivault/1
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "description": "Updated blood test report with corrected values"
}
```

**Response (200):**
```json
{
  "id": 1,
  "filename": "user123/unique-id_blood_test.pdf",
  "original_filename": "blood_test.pdf",
  "file_type": "application/pdf",
  "file_size": 245760,
  "description": "Updated blood test report with corrected values",
  "uploaded_at": "2025-10-17T10:30:00Z"
}
```

### Delete Document

```http
DELETE /medivault/1
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "message": "Document deleted successfully"
}
```

## Supported File Types

MediVault accepts the following medical document formats:

### 📄 **Documents**
- PDF files (`application/pdf`)
- Word documents (`application/msword`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document`)
- Rich Text Format (`application/rtf`)

### 📊 **Spreadsheets**
- Excel files (`application/vnd.ms-excel`, `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`)

### 🖼️ **Images**
- JPEG images (`image/jpeg`)
- PNG images (`image/png`)
- GIF images (`image/gif`)
- WebP images (`image/webp`)

### 📝 **Text Files**
- Plain text (`text/plain`)

### 📏 **File Size Limits**
- **Maximum file size**: 10MB per document
- **Recommended size**: Under 5MB for optimal performance

## Frontend Integration Examples

### React/JavaScript Integration

```javascript
// MediVault Hook
import { useState, useCallback } from 'react';

const useMediVault = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [totalDocuments, setTotalDocuments] = useState(0);

  // Upload document
  const uploadDocument = useCallback(async (file, description = null) => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      if (description) {
        formData.append('description', description);
      }

      const response = await fetch('http://localhost:8000/api/medivault/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getAccessToken()}`
        },
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Upload failed');
      }

      // Refresh document list
      await fetchDocuments();

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch user's documents
  const fetchDocuments = useCallback(async (limit = 50, offset = 0) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:8000/api/medivault/documents?limit=${limit}&offset=${offset}`,
        {
          headers: {
            'Authorization': `Bearer ${getAccessToken()}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to fetch documents');
      }

      setDocuments(data.documents);
      setTotalDocuments(data.total);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Download document
  const downloadDocument = useCallback(async (documentId, filename) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/medivault/download/${documentId}`,
        {
          headers: {
            'Authorization': `Bearer ${getAccessToken()}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Download failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Update document metadata
  const updateDocument = useCallback(async (documentId, description) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:8000/api/medivault/${documentId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAccessToken()}`
          },
          body: JSON.stringify({ description })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Update failed');
      }

      // Update local state
      setDocuments(prev =>
        prev.map(doc =>
          doc.id === documentId ? { ...doc, description } : doc
        )
      );

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete document
  const deleteDocument = useCallback(async (documentId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:8000/api/medivault/${documentId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${getAccessToken()}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Delete failed');
      }

      // Remove from local state
      setDocuments(prev => prev.filter(doc => doc.id !== documentId));
      setTotalDocuments(prev => prev - 1);

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    documents,
    totalDocuments,
    loading,
    error,
    uploadDocument,
    fetchDocuments,
    downloadDocument,
    updateDocument,
    deleteDocument
  };
};

// Usage in Component
const MediVaultComponent = () => {
  const {
    documents,
    totalDocuments,
    loading,
    error,
    uploadDocument,
    fetchDocuments,
    downloadDocument,
    updateDocument,
    deleteDocument
  } = useMediVault();

  const [selectedFile, setSelectedFile] = useState(null);
  const [description, setDescription] = useState('');
  const [editingDoc, setEditingDoc] = useState(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleFileUpload = async () => {
    if (!selectedFile) return;

    try {
      await uploadDocument(selectedFile, description);
      setSelectedFile(null);
      setDescription('');
      alert('Document uploaded successfully!');
    } catch (err) {
      alert('Upload failed: ' + err.message);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }
      setSelectedFile(file);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="medivault-container">
      <h2>🩺 MediVault - Medical Document Storage</h2>

      {/* Upload Section */}
      <div className="upload-section">
        <h3>Upload Medical Document</h3>
        <input
          type="file"
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.webp,.txt,.rtf,.xls,.xlsx"
          onChange={handleFileSelect}
        />
        <input
          type="text"
          placeholder="Document description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={1000}
        />
        <button
          onClick={handleFileUpload}
          disabled={!selectedFile || loading}
        >
          {loading ? 'Uploading...' : 'Upload Document'}
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {/* Documents List */}
      <div className="documents-section">
        <h3>Your Medical Documents ({totalDocuments})</h3>

        {documents.length === 0 ? (
          <p>No documents uploaded yet.</p>
        ) : (
          <div className="documents-grid">
            {documents.map(doc => (
              <div key={doc.id} className="document-card">
                <div className="document-info">
                  <h4>{doc.original_filename}</h4>
                  <p className="file-size">{formatFileSize(doc.file_size)}</p>
                  <p className="file-type">{doc.file_type}</p>
                  {doc.description && (
                    <p className="description">{doc.description}</p>
                  )}
                  <p className="upload-date">
                    Uploaded: {new Date(doc.uploaded_at).toLocaleDateString()}
                  </p>
                </div>

                <div className="document-actions">
                  <button onClick={() => downloadDocument(doc.id, doc.original_filename)}>
                    📥 Download
                  </button>

                  <button onClick={() => setEditingDoc(doc)}>
                    ✏️ Edit
                  </button>

                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this document?')) {
                        deleteDocument(doc.id);
                      }
                    }}
                    className="delete-btn"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal/Dialog */}
      {editingDoc && (
        <div className="modal">
          <div className="modal-content">
            <h3>Edit Document Description</h3>
            <input
              type="text"
              value={editingDoc.description || ''}
              onChange={(e) => setEditingDoc({...editingDoc, description: e.target.value})}
              maxLength={1000}
              placeholder="Document description"
            />
            <div className="modal-actions">
              <button onClick={() => setEditingDoc(null)}>Cancel</button>
              <button
                onClick={async () => {
                  try {
                    await updateDocument(editingDoc.id, editingDoc.description);
                    setEditingDoc(null);
                  } catch (err) {
                    alert('Update failed: ' + err.message);
                  }
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
```

### TypeScript Integration

```typescript
// Types
interface MediVaultDocument {
  id: number;
  filename: string;
  original_filename: string;
  file_type: string;
  file_size: number;
  description?: string;
  uploaded_at: string;
}

interface DocumentListResponse {
  documents: MediVaultDocument[];
  total: number;
}

interface UploadResponse extends MediVaultDocument {}

interface MessageResponse {
  message: string;
}

// Service class
class MediVaultService {
  private baseUrl = 'http://localhost:8000/api';

  async uploadDocument(
    file: File,
    description?: string,
    accessToken: string
  ): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    if (description) {
      formData.append('description', description);
    }

    const response = await fetch(`${this.baseUrl}/medivault/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async getDocuments(
    limit: number = 50,
    offset: number = 0,
    accessToken: string
  ): Promise<DocumentListResponse> {
    const response = await fetch(
      `${this.baseUrl}/medivault/documents?limit=${limit}&offset=${offset}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async downloadDocument(
    documentId: number,
    filename: string,
    accessToken: string
  ): Promise<void> {
    const response = await fetch(
      `${this.baseUrl}/medivault/download/${documentId}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );

    if (!response.ok) {
      throw new Error('Download failed');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  async updateDocument(
    documentId: number,
    description: string,
    accessToken: string
  ): Promise<MediVaultDocument> {
    const response = await fetch(`${this.baseUrl}/medivault/${documentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({ description })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async deleteDocument(
    documentId: number,
    accessToken: string
  ): Promise<MessageResponse> {
    const response = await fetch(`${this.baseUrl}/medivault/${documentId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }
}

// React Hook with TypeScript
const useMediVault = () => {
  const [documents, setDocuments] = useState<MediVaultDocument[]>([]);
  const [totalDocuments, setTotalDocuments] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const service = new MediVaultService();

  const uploadDocument = async (
    file: File,
    description?: string,
    accessToken?: string
  ): Promise<UploadResponse> => {
    setLoading(true);
    setError(null);

    try {
      const token = accessToken || getAccessToken();
      return await service.uploadDocument(file, description, token);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchDocuments = async (
    limit: number = 50,
    offset: number = 0,
    accessToken?: string
  ): Promise<DocumentListResponse> => {
    setLoading(true);
    setError(null);

    try {
      const token = accessToken || getAccessToken();
      const result = await service.getDocuments(limit, offset, token);
      setDocuments(result.documents);
      setTotalDocuments(result.total);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const downloadDocument = async (
    documentId: number,
    filename: string,
    accessToken?: string
  ): Promise<void> => {
    try {
      const token = accessToken || getAccessToken();
      return await service.downloadDocument(documentId, filename, token);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    }
  };

  const updateDocument = async (
    documentId: number,
    description: string,
    accessToken?: string
  ): Promise<MediVaultDocument> => {
    setLoading(true);
    setError(null);

    try {
      const token = accessToken || getAccessToken();
      return await service.updateDocument(documentId, description, token);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteDocument = async (
    documentId: number,
    accessToken?: string
  ): Promise<MessageResponse> => {
    setLoading(true);
    setError(null);

    try {
      const token = accessToken || getAccessToken();
      return await service.deleteDocument(documentId, token);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    documents,
    totalDocuments,
    loading,
    error,
    uploadDocument,
    fetchDocuments,
    downloadDocument,
    updateDocument,
    deleteDocument
  };
};
```

## Error Handling

### Common Error Responses

**400 Bad Request (File Validation):**
```json
{
  "detail": "File type image/tiff not allowed. Allowed types: image/jpeg, image/png, application/pdf, ..."
}
```

**401 Unauthorized:**
```json
{
  "detail": "Not authenticated"
}
```

**403 Forbidden (Accessing Other User's Document):**
```json
{
  "detail": "Access denied"
}
```

**404 Not Found (Document Doesn't Exist):**
```json
{
  "detail": "Document not found"
}
```

**413 Payload Too Large:**
```json
{
  "detail": "File size exceeds 10MB limit"
}
```

## Best Practices

### 1. File Upload Optimization
- **Client-side Validation**: Check file type and size before upload
- **Progress Indicators**: Show upload progress for large files
- **Retry Logic**: Implement retry for failed uploads
- **Chunked Upload**: Consider chunked upload for very large files

### 2. User Experience
- **File Preview**: Show thumbnails for image files
- **Drag & Drop**: Implement drag-and-drop upload interface
- **Batch Operations**: Allow multiple file selection and upload
- **Search & Filter**: Add search functionality for document lists

### 3. Security Considerations
- **File Type Validation**: Never trust client-side file type validation alone
- **Virus Scanning**: Consider integrating virus scanning for uploaded files
- **Access Logging**: Log all document access for audit trails
- **Data Encryption**: Ensure documents are encrypted at rest and in transit

### 4. Performance Optimization
- **Pagination**: Use pagination for large document lists
- **Lazy Loading**: Load document thumbnails on demand
- **Caching**: Cache document metadata locally
- **CDN**: Consider using CDN for faster document downloads

### 5. Privacy & Compliance
- **HIPAA Compliance**: Ensure compliance with medical data regulations
- **Consent Management**: Require explicit user consent for medical data storage
- **Data Retention**: Implement data retention policies
- **Audit Trails**: Maintain comprehensive audit logs

### 6. Document Organization
- **Categorization**: Allow users to categorize documents (Lab Reports, X-Rays, Prescriptions, etc.)
- **Tagging**: Implement document tagging system
- **Date-based Organization**: Sort documents by upload date or document date
- **Favorites**: Allow users to mark important documents

## Testing Checklist

- [ ] Upload various file types (PDF, images, documents)
- [ ] Test file size limits (under/over 10MB)
- [ ] Upload with and without descriptions
- [ ] List documents with pagination
- [ ] Download documents and verify integrity
- [ ] Update document descriptions
- [ ] Delete documents and confirm removal
- [ ] Test authentication requirements
- [ ] Verify user isolation (can't access other users' documents)
- [ ] Test error handling for invalid file types
- [ ] Test network error scenarios
- [ ] Verify file integrity after upload/download
- [ ] Test concurrent uploads
- [ ] Validate metadata storage and retrieval
- [ ] Test with various browsers and devices