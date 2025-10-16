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

export type MoodType =
  | 'happy' | 'sad' | 'anxious' | 'neutral' | 'excited'
  | 'tired' | 'energetic' | 'calm' | 'frustrated' | 'grateful'
  | 'stressed' | 'relaxed' | 'angry' | 'peaceful' | 'worried';