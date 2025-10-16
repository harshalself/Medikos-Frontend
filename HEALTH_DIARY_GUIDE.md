# Medikos Backend - Health Diary API Integration Guide

## Essential Details for Frontend Integration

### 1. Base URL
```
http://localhost:8000/api
```

### 2. API Endpoints

#### Core CRUD Operations
- `POST /health-diary` - Create new diary entry
- `GET /health-diary` - Get paginated list of diary entries (with optional filters)
- `GET /health-diary/{entry_id}` - Get specific diary entry by ID
- `PUT /health-diary/{entry_id}` - Update existing diary entry
- `DELETE /health-diary/{entry_id}` - Delete diary entry

#### Date-based Queries
- `GET /health-diary/by-date/{date}` - Get all entries for a specific date
- `GET /health-diary/date-range/` - Get entries within a date range

#### Analytics & Statistics
- `GET /health-diary/analytics/mood-stats` - Get mood statistics (future use)
- `GET /health-diary/stats/count` - Get basic diary statistics
- `GET /health-diary/summary` - Get AI-powered health summary using Groq API

### 3. Authentication Requirements
- **Required**: All endpoints require authentication
- **JWT Token**: Include `Authorization: Bearer <access_token>` header
- **User Isolation**: Users can only access their own diary entries

### 4. Data Models

#### Diary Entry Fields
```json
{
  "title": "Daily Health Check",
  "description": "Feeling good today, had a good night's sleep",
  "mood": "happy | sad | anxious | neutral | excited | tired | energetic | calm | frustrated | grateful | stressed | relaxed | angry | peaceful | worried",
  "symptoms": "Headache, nausea, etc. (optional)"
}
```

#### Mood Options
- `happy`, `sad`, `anxious`, `neutral`, `excited`
- `tired`, `energetic`, `calm`, `frustrated`, `grateful`
- `stressed`, `relaxed`, `angry`, `peaceful`, `worried`

## Request/Response Examples

### Create Diary Entry

```http
POST /health-diary
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "title": "Morning Health Check",
  "description": "Woke up feeling refreshed after 8 hours of sleep. No symptoms today.",
  "mood": "happy",
  "symptoms": null
}
```

**Response (201):**
```json
{
  "id": "entry_123456",
  "user_id": "user_789",
  "title": "Morning Health Check",
  "description": "Woke up feeling refreshed after 8 hours of sleep. No symptoms today.",
  "mood": "happy",
  "symptoms": null,
  "entry_date": "2025-10-17",
  "created_at": "2025-10-17T08:30:00Z",
  "updated_at": "2025-10-17T08:30:00Z"
}
```

### Get Diary Entries (with filters)

```http
GET /health-diary?start_date=2025-10-01&end_date=2025-10-17&mood=happy&limit=20&offset=0
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "entries": [
    {
      "id": "entry_123456",
      "user_id": "user_789",
      "title": "Morning Health Check",
      "description": "Woke up feeling refreshed...",
      "mood": "happy",
      "symptoms": null,
      "entry_date": "2025-10-17",
      "created_at": "2025-10-17T08:30:00Z",
      "updated_at": "2025-10-17T08:30:00Z"
    }
  ],
  "total_count": 1,
  "limit": 20,
  "offset": 0
}
```

### Update Diary Entry

```http
PUT /health-diary/entry_123456
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "title": "Updated Morning Health Check",
  "description": "Woke up feeling refreshed after 8 hours of sleep. Had a slight headache.",
  "mood": "neutral",
  "symptoms": "mild headache"
}
```

**Response (200):**
```json
{
  "id": "entry_123456",
  "user_id": "user_789",
  "title": "Updated Morning Health Check",
  "description": "Woke up feeling refreshed after 8 hours of sleep. Had a slight headache.",
  "mood": "neutral",
  "symptoms": "mild headache",
  "entry_date": "2025-10-17",
  "created_at": "2025-10-17T08:30:00Z",
  "updated_at": "2025-10-17T08:35:00Z"
}
```

### Get Entries by Date

```http
GET /health-diary/by-date/2025-10-17
Authorization: Bearer <access_token>
```

**Response (200):**
```json
[
  {
    "id": "entry_123456",
    "user_id": "user_789",
    "title": "Morning Health Check",
    "description": "Woke up feeling refreshed...",
    "mood": "happy",
    "symptoms": null,
    "entry_date": "2025-10-17",
    "created_at": "2025-10-17T08:30:00Z",
    "updated_at": "2025-10-17T08:30:00Z"
  }
]
```

### Get Diary Statistics

```http
GET /health-diary/stats/count
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "total_entries": 15,
  "user_id": "user_789"
}
```

### Get AI Health Summary

```http
GET /health-diary/summary
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "summary": "**Patient Health Summary**\n\n**1. Overall Health Patterns and Trends:**\nBased on the provided diary entries, the patient shows consistent positive health patterns with regular exercise and good sleep habits.\n\n**2. Mood Analysis and Emotional Well-being:**\nThe patient's mood varies between happy, calm, and energetic, indicating good emotional regulation.\n\n**3. Common Symptoms or Health Concerns:**\nOccasional headaches and fatigue are reported, but these appear to be mild and temporary.\n\n**4. Positive Health Indicators:**\nRegular exercise, good sleep quality, and positive mood patterns suggest overall good health.\n\n**5. Recommendations for Healthcare Provider:**\nContinue monitoring symptoms and maintain current healthy lifestyle habits.",
  "total_entries": 15,
  "date_range": {
    "start": "2025-09-01",
    "end": "2025-10-17"
  },
  "generated_at": "2025-10-17T10:30:00Z"
}
```

**Notes:**
- Uses Groq API with Llama 3.1 model for AI-powered analysis
- Requires at least one diary entry to generate summary
- Summary includes health patterns, mood analysis, symptoms, and recommendations
- Processing time may vary based on number of entries

## Frontend Integration Code

### React/JavaScript Implementation

#### 1. Diary Service (services/diaryService.js)

```javascript
const API_BASE_URL = 'http://localhost:8000/api';

class DiaryService {
  constructor() {
    this.baseURL = `${API_BASE_URL}/health-diary`;
  }

  getAuthHeaders() {
    const token = localStorage.getItem('access_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  // Create new diary entry
  async createEntry(entryData) {
    try {
      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(entryData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating diary entry:', error);
      throw error;
    }
  }

  // Get diary entries with filters
  async getEntries(filters = {}) {
    try {
      const params = new URLSearchParams();

      if (filters.startDate) params.append('start_date', filters.startDate);
      if (filters.endDate) params.append('end_date', filters.endDate);
      if (filters.mood) params.append('mood', filters.mood);
      if (filters.limit) params.append('limit', filters.limit);
      if (filters.offset) params.append('offset', filters.offset);

      const url = `${this.baseURL}?${params.toString()}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching diary entries:', error);
      throw error;
    }
  }

  // Get single diary entry
  async getEntry(entryId) {
    try {
      const response = await fetch(`${this.baseURL}/${entryId}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching diary entry:', error);
      throw error;
    }
  }

  // Update diary entry
  async updateEntry(entryId, updateData) {
    try {
      const response = await fetch(`${this.baseURL}/${entryId}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating diary entry:', error);
      throw error;
    }
  }

  // Delete diary entry
  async deleteEntry(entryId) {
    try {
      const response = await fetch(`${this.baseURL}/${entryId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting diary entry:', error);
      throw error;
    }
  }

  // Get entries by specific date
  async getEntriesByDate(date) {
    try {
      const response = await fetch(`${this.baseURL}/by-date/${date}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching entries by date:', error);
      throw error;
    }
  }

  // Get entries in date range
  async getEntriesInRange(startDate, endDate) {
    try {
      const params = new URLSearchParams({
        start_date: startDate,
        end_date: endDate
      });

      const response = await fetch(`${this.baseURL}/date-range/?${params.toString()}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching entries in range:', error);
      throw error;
    }
  }

  // Get diary statistics
  async getStats() {
    try {
      const response = await fetch(`${this.baseURL}/stats/count`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching diary stats:', error);
      throw error;
    }
  }

  // Get AI-powered health summary
  async getHealthSummary() {
    try {
      const response = await fetch(`${this.baseURL}/summary`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching health summary:', error);
      throw error;
    }
  }
}

export default new DiaryService();
```

#### 2. React Hook (hooks/useDiary.js)

```javascript
import { useState, useEffect, useCallback } from 'react';
import diaryService from '../services/diaryService';

export const useDiary = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);

  // Create new entry
  const createEntry = useCallback(async (entryData) => {
    setLoading(true);
    setError(null);
    try {
      const newEntry = await diaryService.createEntry(entryData);
      setEntries(prev => [newEntry, ...prev]);
      return newEntry;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch entries with filters
  const fetchEntries = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await diaryService.getEntries(filters);
      setEntries(response.entries);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update entry
  const updateEntry = useCallback(async (entryId, updateData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedEntry = await diaryService.updateEntry(entryId, updateData);
      setEntries(prev => prev.map(entry =>
        entry.id === entryId ? updatedEntry : entry
      ));
      return updatedEntry;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete entry
  const deleteEntry = useCallback(async (entryId) => {
    setLoading(true);
    setError(null);
    try {
      await diaryService.deleteEntry(entryId);
      setEntries(prev => prev.filter(entry => entry.id !== entryId));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      const statsData = await diaryService.getStats();
      setStats(statsData);
      return statsData;
    } catch (err) {
      console.error('Error fetching stats:', err);
      throw err;
    }
  }, []);

  // Fetch AI health summary
  const fetchHealthSummary = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const summary = await diaryService.getHealthSummary();
      return summary;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    entries,
    loading,
    error,
    stats,
    createEntry,
    fetchEntries,
    updateEntry,
    deleteEntry,
    fetchStats,
    fetchHealthSummary
  };
};
```

#### 3. Diary Entry Form Component (components/DiaryEntryForm.jsx)

```javascript
import React, { useState } from 'react';
import { useDiary } from '../hooks/useDiary';

const MOOD_OPTIONS = [
  'happy', 'sad', 'anxious', 'neutral', 'excited',
  'tired', 'energetic', 'calm', 'frustrated', 'grateful',
  'stressed', 'relaxed', 'angry', 'peaceful', 'worried'
];

const DiaryEntryForm = ({ onSuccess, onCancel }) => {
  const { createEntry, loading, error } = useDiary();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    mood: '',
    symptoms: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const entryData = {
        ...formData,
        symptoms: formData.symptoms || null
      };
      await createEntry(entryData);
      onSuccess && onSuccess();
      // Reset form
      setFormData({
        title: '',
        description: '',
        mood: '',
        symptoms: ''
      });
    } catch (err) {
      // Error is handled by the hook
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="diary-entry-form">
      <h3>Create Diary Entry</h3>

      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <label htmlFor="title">Title *</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          maxLength="200"
          placeholder="e.g., Morning Health Check"
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Description *</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows="4"
          placeholder="How are you feeling today? Describe your health status..."
        />
      </div>

      <div className="form-group">
        <label htmlFor="mood">Mood</label>
        <select
          id="mood"
          name="mood"
          value={formData.mood}
          onChange={handleChange}
        >
          <option value="">Select mood (optional)</option>
          {MOOD_OPTIONS.map(mood => (
            <option key={mood} value={mood}>
              {mood.charAt(0).toUpperCase() + mood.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="symptoms">Symptoms</label>
        <input
          type="text"
          id="symptoms"
          name="symptoms"
          value={formData.symptoms}
          onChange={handleChange}
          placeholder="e.g., headache, nausea (optional)"
        />
      </div>

      <div className="form-actions">
        <button type="button" onClick={onCancel} disabled={loading}>
          Cancel
        </button>
        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Entry'}
        </button>
      </div>
    </form>
  );
};

export default DiaryEntryForm;
```

#### 4. Diary List Component (components/DiaryList.jsx)

```javascript
import React, { useEffect, useState } from 'react';
import { useDiary } from '../hooks/useDiary';

const DiaryList = () => {
  const { entries, loading, error, fetchEntries, deleteEntry } = useDiary();
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    mood: '',
    limit: 20,
    offset: 0
  });

  useEffect(() => {
    fetchEntries(filters);
  }, [fetchEntries, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
      offset: 0 // Reset pagination when filters change
    }));
  };

  const handleDelete = async (entryId) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        await deleteEntry(entryId);
      } catch (err) {
        // Error handled by hook
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) return <div>Loading diary entries...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="diary-list">
      <h2>My Health Diary</h2>

      {/* Filters */}
      <div className="diary-filters">
        <div className="filter-group">
          <label>Start Date:</label>
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
          />
        </div>
        <div className="filter-group">
          <label>End Date:</label>
          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
          />
        </div>
        <div className="filter-group">
          <label>Mood:</label>
          <select
            name="mood"
            value={filters.mood}
            onChange={handleFilterChange}
          >
            <option value="">All moods</option>
            <option value="happy">Happy</option>
            <option value="sad">Sad</option>
            <option value="anxious">Anxious</option>
            <option value="neutral">Neutral</option>
            <option value="excited">Excited</option>
            <option value="tired">Tired</option>
            <option value="energetic">Energetic</option>
            <option value="calm">Calm</option>
            <option value="frustrated">Frustrated</option>
            <option value="grateful">Grateful</option>
            <option value="stressed">Stressed</option>
            <option value="relaxed">Relaxed</option>
            <option value="angry">Angry</option>
            <option value="peaceful">Peaceful</option>
            <option value="worried">Worried</option>
          </select>
        </div>
      </div>

      {/* Entries */}
      <div className="diary-entries">
        {entries.length === 0 ? (
          <p>No diary entries found.</p>
        ) : (
          entries.map(entry => (
            <div key={entry.id} className="diary-entry">
              <div className="entry-header">
                <h3>{entry.title}</h3>
                <span className="entry-date">{formatDate(entry.entry_date)}</span>
                {entry.mood && (
                  <span className={`mood-badge mood-${entry.mood}`}>
                    {entry.mood}
                  </span>
                )}
              </div>
              <p className="entry-description">{entry.description}</p>
              {entry.symptoms && (
                <p className="entry-symptoms">
                  <strong>Symptoms:</strong> {entry.symptoms}
                </p>
              )}
              <div className="entry-actions">
                <button onClick={() => handleDelete(entry.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DiaryList;
```

### TypeScript Implementation

#### 1. TypeScript Types (types/diary.ts)

```typescript
export interface DiaryEntry {
  id: string;
  user_id: string;
  title: string;
  description: string;
  mood: string | null;
  symptoms: string | null;
  entry_date: string;
  created_at: string;
  updated_at: string;
}

export interface CreateDiaryEntryRequest {
  title: string;
  description: string;
  mood?: string;
  symptoms?: string;
}

export interface UpdateDiaryEntryRequest {
  title?: string;
  description?: string;
  mood?: string;
  symptoms?: string;
}

export interface DiaryFilters {
  startDate?: string;
  endDate?: string;
  mood?: string;
  limit?: number;
  offset?: number;
}

export interface DiaryListResponse {
  entries: DiaryEntry[];
  total_count: number;
  limit: number;
  offset: number;
}

export interface DiaryStats {
  total_entries: number;
  user_id: string;
}

export interface HealthSummary {
  summary: string;
  total_entries: number;
  date_range: {
    start: string;
    end: string;
  };
  generated_at: string;
}

export type MoodType =
  | 'happy' | 'sad' | 'anxious' | 'neutral' | 'excited'
  | 'tired' | 'energetic' | 'calm' | 'frustrated' | 'grateful'
  | 'stressed' | 'relaxed' | 'angry' | 'peaceful' | 'worried';
```

#### 2. TypeScript Service (services/diaryService.ts)

```typescript
import {
  DiaryEntry,
  CreateDiaryEntryRequest,
  UpdateDiaryEntryRequest,
  DiaryFilters,
  DiaryListResponse,
  DiaryStats,
  HealthSummary
} from '../types/diary';

const API_BASE_URL = 'http://localhost:8000/api';

class DiaryService {
  private baseURL = `${API_BASE_URL}/health-diary`;

  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('access_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  async createEntry(entryData: CreateDiaryEntryRequest): Promise<DiaryEntry> {
    const response = await fetch(this.baseURL, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(entryData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async getEntries(filters: DiaryFilters = {}): Promise<DiaryListResponse> {
    const params = new URLSearchParams();

    if (filters.startDate) params.append('start_date', filters.startDate);
    if (filters.endDate) params.append('end_date', filters.endDate);
    if (filters.mood) params.append('mood', filters.mood);
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.offset) params.append('offset', filters.offset.toString());

    const url = `${this.baseURL}?${params.toString()}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async getEntry(entryId: string): Promise<DiaryEntry> {
    const response = await fetch(`${this.baseURL}/${entryId}`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async updateEntry(entryId: string, updateData: UpdateDiaryEntryRequest): Promise<DiaryEntry> {
    const response = await fetch(`${this.baseURL}/${entryId}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(updateData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async deleteEntry(entryId: string): Promise<{ message: string }> {
    const response = await fetch(`${this.baseURL}/${entryId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async getEntriesByDate(date: string): Promise<DiaryEntry[]> {
    const response = await fetch(`${this.baseURL}/by-date/${date}`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async getEntriesInRange(startDate: string, endDate: string): Promise<DiaryEntry[]> {
    const params = new URLSearchParams({
      start_date: startDate,
      end_date: endDate
    });

    const response = await fetch(`${this.baseURL}/date-range/?${params.toString()}`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async getStats(): Promise<DiaryStats> {
    const response = await fetch(`${this.baseURL}/stats/count`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async getHealthSummary(): Promise<HealthSummary> {
    const response = await fetch(`${this.baseURL}/summary`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }
}

export default new DiaryService();
```

## Error Handling

### Common Error Responses

#### Validation Errors (400)
```json
{
  "detail": "Title must be 200 characters or less"
}
```

#### Authentication Errors (401)
```json
{
  "detail": "Invalid token"
}
```

#### Not Found Errors (404)
```json
{
  "detail": "Diary entry not found"
}
```

#### Server Errors (500)
```json
{
  "detail": "Internal server error"
}
```

### Frontend Error Handling

```javascript
// In your React components
const handleApiError = (error) => {
  if (error.message.includes('401')) {
    // Token expired, redirect to login
    localStorage.removeItem('access_token');
    window.location.href = '/login';
  } else if (error.message.includes('400')) {
    // Validation error, show specific message
    setError('Please check your input and try again');
  } else if (error.message.includes('404')) {
    // Entry not found
    setError('Diary entry not found');
  } else {
    // Generic error
    setError('Something went wrong. Please try again later.');
  }
};
```

## What Should Be on the Frontend

### Core Features

#### 1. **Diary Entry Creation Form**
- Title field (required, max 200 chars)
- Description field (required, rich text editor optional)
- Mood selector (dropdown with predefined options)
- Symptoms field (optional text input)
- Date picker (auto-set to today, but editable)
- Submit/Cancel buttons

#### 2. **Diary Entries List View**
- Paginated list of entries (default 20 per page)
- Sort by date (newest first)
- Filter by date range (start/end date pickers)
- Filter by mood (dropdown)
- Search by title/description (optional)
- Entry preview cards showing:
  - Title and date
  - Mood badge with color coding
  - Description preview (truncated)
  - Symptoms (if present)

#### 3. **Diary Entry Detail/Edit View**
- Full entry display
- Edit mode toggle
- Update functionality
- Delete confirmation dialog

#### 4. **Calendar View** (Recommended)
- Monthly calendar showing entry dates
- Color-coded mood indicators
- Click date to see entries for that day
- Quick entry creation from calendar

#### 5. **Statistics Dashboard**
- Total entries count
- Mood distribution chart (pie/bar chart)
- Entries over time (line chart)
- Most common symptoms
- Streak tracking (consecutive days with entries)

#### 6. **AI Health Summary** (New Feature)
- Generate comprehensive health insights using AI
- Analyze mood patterns and trends
- Identify common symptoms and health concerns
- Provide personalized recommendations
- Show date range coverage and entry count
- Refresh summary on demand

### UI/UX Considerations

#### Design Elements
- **Color-coded moods**: Different colors for each mood state
- **Health-focused icons**: Heart, medical cross, calendar icons
- **Responsive design**: Mobile-friendly layout
- **Loading states**: Skeletons or spinners during API calls
- **Empty states**: Helpful messages when no entries exist

#### Navigation
- Dedicated "Health Diary" section in main navigation
- Quick access to create new entry (FAB button)
- Breadcrumb navigation for detail views

#### Accessibility
- Proper ARIA labels for form fields
- Keyboard navigation support
- Screen reader friendly
- High contrast mode support

### Advanced Features (Optional)

#### 1. **Rich Text Editor**
- Format descriptions with bold, italic, lists
- Insert images or attachments
- Link to related health records

#### 2. **Voice-to-Text Input**
- Dictate diary entries using speech recognition
- Convert voice to structured mood/symptom data

#### 3. **Health Insights**
- AI-powered analysis of mood patterns
- Symptom tracking correlations
- Health trend predictions
- Wellness recommendations

#### 4. **Export/Share Features**
- Export entries as PDF
- Share entries with healthcare providers
- Backup to cloud storage

#### 5. **Reminders & Notifications**
- Daily entry reminders
- Mood check-in notifications
- Symptom tracking alerts

### Data Visualization

#### Charts and Graphs
- **Mood Timeline**: Line chart showing mood over time
- **Mood Distribution**: Pie chart of mood frequencies
- **Symptom Frequency**: Bar chart of common symptoms
- **Entry Frequency**: Calendar heatmap of entry patterns

#### Dashboard Widgets
- Recent entries summary
- Mood streak counter
- Weekly/monthly statistics
- Health goals progress

## Testing Checklist

### API Integration Tests
- [ ] Create diary entry with valid data
- [ ] Create diary entry with invalid data (validation errors)
- [ ] Retrieve paginated list of entries
- [ ] Filter entries by date range
- [ ] Filter entries by mood
- [ ] Get single entry by ID
- [ ] Update existing entry
- [ ] Delete entry
- [ ] Get entries by specific date
- [ ] Get entries in date range
- [ ] Get diary statistics
- [ ] Get AI health summary

### Authentication Tests
- [ ] Access diary endpoints without token (401 error)
- [ ] Access diary endpoints with invalid token (401 error)
- [ ] Access diary endpoints with expired token (401 error)
- [ ] Verify user isolation (can't access other users' entries)

### Frontend Component Tests
- [ ] Diary entry form renders correctly
- [ ] Form validation works (required fields, max lengths)
- [ ] Mood selector displays all options
- [ ] Diary list displays entries correctly
- [ ] Pagination works
- [ ] Filters apply correctly
- [ ] Loading states display during API calls
- [ ] Error messages display for failed requests
- [ ] Success messages for completed operations
- [ ] AI health summary displays correctly
- [ ] Summary refresh functionality works

### User Experience Tests
- [ ] Create new diary entry flow
- [ ] Edit existing entry flow
- [ ] Delete entry with confirmation
- [ ] Filter and search functionality
- [ ] Responsive design on mobile devices
- [ ] Accessibility features work
- [ ] Offline functionality (if implemented)

### Performance Tests
- [ ] Large number of entries load efficiently
- [ ] Filtering operations are fast
- [ ] Image loading (if implemented) is optimized
- [ ] Memory usage stays reasonable

### Edge Cases
- [ ] Handle network errors gracefully
- [ ] Handle server errors (500) appropriately
- [ ] Handle validation errors with helpful messages
- [ ] Handle empty states appropriately
- [ ] Handle very long content gracefully
- [ ] Test with special characters in text fields

## Best Practices

### Security
- Always validate user input on frontend and backend
- Use HTTPS for all API calls
- Store tokens securely (localStorage with httpOnly cookies preferred)
- Implement token refresh logic
- Sanitize user input to prevent XSS attacks

### Performance
- Implement pagination for large lists
- Use lazy loading for images/attachments
- Cache frequently accessed data
- Debounce search/filter inputs
- Optimize bundle size

### User Experience
- Provide clear feedback for all user actions
- Use consistent design patterns
- Implement undo functionality for destructive actions
- Save drafts automatically
- Provide keyboard shortcuts

### Data Management
- Implement optimistic updates for better UX
- Handle offline scenarios gracefully
- Sync data when coming back online
- Validate data integrity
- Implement data backup strategies

This comprehensive guide provides everything needed to integrate the Health Diary feature into your frontend application. The feature allows users to track their daily health status, mood, and symptoms, providing valuable insights into their health patterns over time.</content>
<parameter name="filePath">/Users/harshalpatil/Documents/Projects/Medikos-Backend/HEALTH_DIARY_FRONTEND_INTEGRATION.md