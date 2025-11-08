# MediVault API Documentation

## Overview

MediVault is a secure medical document storage system that allows users to upload, manage, and retrieve their medical documents. The system provides role-based access control, ensuring that only authorized users can access their own medical documents.

## Features

- **Secure Document Upload**: Upload medical documents with metadata
- **Document Management**: List, download, update, and delete documents
- **File Type Validation**: Support for common medical document formats
- **AWS S3 Storage**: Cloud-based file storage with fallback to metadata-only mode
- **Role-Based Access Control (RBAC)**: Patients and doctors can access their own documents
- **Pagination**: Efficient document listing with pagination support

## Authentication & Authorization

### User Roles
- **PATIENT**: Can upload, view, download, update, and delete their own medical documents
- **DOCTOR**: Can upload, view, download, update, and delete their own medical documents

### Authentication
All endpoints require JWT authentication via Bearer token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

### Authorization
- Users can only access their own documents
- Document ownership is enforced at the database level
- RBAC ensures proper role validation for all operations

## API Endpoints

### Base URL
```
http://localhost:8000/api/medivault
```

---

## Document Upload

### 1. Upload Document
**Endpoint:** `POST /medivault/upload`  
**Access:** PATIENT, DOCTOR  
**Content-Type:** `multipart/form-data`  
**Description:** Upload a medical document to MediVault

**Form Data:**
- `file`: File to upload (required)
- `description`: Optional description for the document

**Supported File Types:**
- Images: JPEG, PNG, GIF, WebP
- Documents: PDF, DOC, DOCX
- Spreadsheets: XLS, XLSX
- Text: TXT, RTF

**File Size Limit:** 10MB

**Response (201 Created):**
```json
{
  "id": 1,
  "filename": "user-uuid/unique-id_document.pdf",
  "original_filename": "medical_report.pdf",
  "file_type": "application/pdf",
  "file_size": 245760,
  "description": "Annual medical checkup report",
  "uploaded_at": "2024-01-15T10:30:00Z"
}
```

---

## Document Retrieval

### 2. List User Documents
**Endpoint:** `GET /medivault/documents`  
**Access:** PATIENT, DOCTOR  
**Description:** Get paginated list of user's uploaded documents

**Query Parameters:**
- `limit`: Maximum documents to return (1-100, default: 50)
- `offset`: Pagination offset (default: 0)

**Response (200 OK):**
```json
{
  "documents": [
    {
      "id": 1,
      "filename": "user-uuid/unique-id_document.pdf",
      "original_filename": "medical_report.pdf",
      "file_type": "application/pdf",
      "file_size": 245760,
      "description": "Annual medical checkup report",
      "uploaded_at": "2024-01-15T10:30:00Z"
    },
    {
      "id": 2,
      "filename": "user-uuid/unique-id_xray.jpg",
      "original_filename": "chest_xray.jpg",
      "file_type": "image/jpeg",
      "file_size": 512000,
      "description": "Chest X-ray results",
      "uploaded_at": "2024-01-14T09:15:00Z"
    }
  ],
  "total": 2
}
```

---

### 3. Download Document
**Endpoint:** `GET /medivault/download/{document_id}`  
**Access:** PATIENT, DOCTOR  
**Description:** Download a specific document

**URL Parameters:**
- `document_id`: ID of the document to download

**Response (200 OK):**
- Content-Type: Original file MIME type
- Content-Disposition: `attachment; filename=original_filename`
- Body: File content as binary data

---

## Document Management

### 4. Update Document Metadata
**Endpoint:** `PUT /medivault/{document_id}`  
**Access:** PATIENT, DOCTOR  
**Description:** Update document metadata (description only)

**URL Parameters:**
- `document_id`: ID of the document to update

**Request Body:**
```json
{
  "description": "Updated description for the medical document"
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "filename": "user-uuid/unique-id_document.pdf",
  "original_filename": "medical_report.pdf",
  "file_type": "application/pdf",
  "file_size": 245760,
  "description": "Updated description for the medical document",
  "uploaded_at": "2024-01-15T10:30:00Z"
}
```

---

### 5. Delete Document
**Endpoint:** `DELETE /medivault/{document_id}`  
**Access:** PATIENT, DOCTOR  
**Description:** Delete a document from MediVault

**URL Parameters:**
- `document_id`: ID of the document to delete

**Response (200 OK):**
```json
{
  "message": "Document deleted successfully"
}
```

---

## Error Responses

### Common Error Codes
- **400 Bad Request**: Invalid file type, file too large, or validation error
- **401 Unauthorized**: Missing or invalid JWT token
- **403 Forbidden**: Insufficient permissions (wrong role)
- **404 Not Found**: Document not found or doesn't belong to user
- **500 Internal Server Error**: Server error during file operations

### Error Response Format
```json
{
  "detail": "Error message description"
}
```

### Specific Error Examples

**Invalid File Type:**
```json
{
  "detail": "File type application/exe not allowed. Allowed types: image/jpeg, image/png, ..."
}
```

**File Too Large:**
```json
{
  "detail": "File size exceeds 10MB limit"
}
```

**Document Not Found:**
```json
{
  "detail": "Document not found"
}
```

---

## File Storage

### AWS S3 Integration
- Documents are stored in AWS S3 buckets for scalability and reliability
- Files are organized by user ID in unique subdirectories
- Filenames are generated with UUIDs to prevent conflicts

### Fallback Mode
- If AWS S3 is not configured, the system operates in metadata-only mode
- Document metadata is stored in the database
- File content is not persisted (placeholder returned on download)

### Storage Security
- Files are stored with user-specific prefixes
- Database-level ownership validation prevents unauthorized access
- S3 bucket policies can be configured for additional security

---

## Testing

Run the comprehensive test suite:

```bash
python scripts/test_medivault_apis.py
```

The test suite covers:
- User and doctor registration with proper roles
- Document upload with file validation
- Document listing with pagination
- Document download functionality
- Metadata updates
- Document deletion
- RBAC validation (role-based access control)
- Unauthorized access prevention

---

## Data Models

### DocumentResponse
```json
{
  "id": "integer",
  "filename": "string",
  "original_filename": "string",
  "file_type": "string",
  "file_size": "integer",
  "description": "string|null",
  "uploaded_at": "string (ISO datetime)"
}
```

### DocumentListResponse
```json
{
  "documents": "Array<DocumentResponse>",
  "total": "integer"
}
```

### DocumentUpdateRequest
```json
{
  "description": "string|null"
}
```

---

## Security Considerations

- **File Type Validation**: Only allowed medical document types are accepted
- **File Size Limits**: 10MB maximum file size prevents abuse
- **User Isolation**: Users can only access their own documents
- **JWT Authentication**: All endpoints require valid authentication
- **Role-Based Access**: Proper role validation for all operations
- **Secure Storage**: AWS S3 provides encrypted storage options
- **Database Security**: Parameterized queries prevent SQL injection

---

## Configuration

### Environment Variables
Required for AWS S3 integration:
- `AWS_ACCESS_KEY_ID`: AWS access key
- `AWS_SECRET_ACCESS_KEY`: AWS secret key
- `AWS_BUCKET_NAME`: S3 bucket name

### Optional Configuration
- If AWS credentials are not provided, the system operates in metadata-only mode
- File size limits and allowed types can be configured in the service class

---

## Usage Examples

### Upload a PDF Document
```bash
curl -X POST "http://localhost:8000/api/medivault/upload" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@medical_report.pdf" \
  -F "description=Annual checkup results"
```

### List Documents
```bash
curl -X GET "http://localhost:8000/api/medivault/documents?limit=10&offset=0" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Download Document
```bash
curl -X GET "http://localhost:8000/api/medivault/download/1" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -o downloaded_file.pdf
```

### Update Document Description
```bash
curl -X PUT "http://localhost:8000/api/medivault/1" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"description": "Updated medical report"}'
```

### Delete Document
```bash
curl -X DELETE "http://localhost:8000/api/medivault/1" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```