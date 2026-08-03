import apiClient from './api';
import type { ApiResponse } from '@/types/api';

export interface GlobalSearchResultItem {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  url: string;
}

export const globalSearchService = {
  search: async (query: string): Promise<ApiResponse<GlobalSearchResultItem[]>> => {
    const { data } = await apiClient.get<ApiResponse<GlobalSearchResultItem[]>>('/search', {
      params: { q: query },
    });
    return data;
  },
};
