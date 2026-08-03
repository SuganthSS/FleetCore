import apiClient from './api';
import type { ApiResponse } from '@/types/api';

export interface DocumentItem {
  id: string;
  name: string;
  category: 'VEHICLE' | 'DRIVER' | 'TRIP' | 'SHIPMENT' | 'MAINTENANCE' | 'COMPLIANCE' | 'GENERAL';
  fileType: 'PDF' | 'DOCX' | 'XLSX' | 'PNG' | 'JPG';
  sizeBytes: number;
  url: string;
  uploadedBy: string;
  tags: string[];
  createdAt: string;
}

export interface DocumentQueryParams {
  search?: string;
  category?: string;
  fileType?: string;
}

export const documentService = {
  getDocuments: async (params?: DocumentQueryParams): Promise<ApiResponse<DocumentItem[]>> => {
    const { data } = await apiClient.get<ApiResponse<DocumentItem[]>>('/documents', { params });
    return data;
  },

  uploadDocument: async (file: File, category: string, tags: string[]): Promise<ApiResponse<DocumentItem>> => {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('category', category);
    formData.append('tags', JSON.stringify(tags));
    const { data } = await apiClient.post<ApiResponse<DocumentItem>>('/documents', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  deleteDocument: async (id: string): Promise<ApiResponse<void>> => {
    const { data } = await apiClient.delete<ApiResponse<void>>(`/documents/${id}`);
    return data;
  },
};
