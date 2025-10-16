import { useState, useCallback } from 'react';
import { api } from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/api-config';
import { useToast } from '@/hooks/use-toast';
import { DiaryEntry, CreateDiaryEntryRequest, DiaryFilters, DiaryListResponse } from '@/types/diary';

export const useHealthDiary = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const { toast } = useToast();

  const createEntry = useCallback(async (entryData: CreateDiaryEntryRequest): Promise<DiaryEntry> => {
    setIsCreating(true);
    try {
      const response = await api.post<DiaryEntry>(API_ENDPOINTS.healthDiary.create, entryData);

      toast({
        title: 'Success',
        description: 'Diary entry created successfully',
      });

      return response;
    } catch (error: any) {
      console.error('[HealthDiary] Create entry failed:', error.message);

      toast({
        title: 'Error',
        description: error.message || 'Failed to create diary entry',
        variant: 'destructive',
      });

      throw error;
    } finally {
      setIsCreating(false);
    }
  }, [toast]);

  const fetchEntries = useCallback(async (filters: DiaryFilters = {}): Promise<DiaryListResponse> => {
    setIsFetching(true);
    try {
      const params = new URLSearchParams();

      if (filters.startDate) params.append('start_date', filters.startDate);
      if (filters.endDate) params.append('end_date', filters.endDate);
      if (filters.mood) params.append('mood', filters.mood);
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.offset) params.append('offset', filters.offset.toString());

      const url = `${API_ENDPOINTS.healthDiary.list}?${params.toString()}`;
      const response = await api.get<DiaryListResponse>(url);

      setEntries(response.entries);
      setTotalCount(response.total_count);

      return response;
    } catch (error: any) {
      console.error('[HealthDiary] Fetch entries failed:', error.message);

      toast({
        title: 'Error',
        description: error.message || 'Failed to load diary entries',
        variant: 'destructive',
      });

      throw error;
    } finally {
      setIsFetching(false);
    }
  }, [toast]);

  return {
    createEntry,
    fetchEntries,
    isCreating,
    isFetching,
    entries,
    totalCount,
  };
};