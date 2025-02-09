import axios from 'axios';

const API_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Anime {
  ID: number;
  name: string;
  description: string;
  year: number;
  rating: number;
  genre: string[];
  tag: string[];
  img: string;
  episodes?: Episode[];
  created_at?: string;
  updated_at?: string;
}

export interface Episode {
  id: number;
  name: string;
  img: string;
  stream?: string[];
  video?: VideoQuality[];
}

export interface VideoQuality {
  quality: string;
  url: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    total: number;
    page: number;
    totalPages: number;
    limit: number;
  };
}

export const animeApi = {
  getAll: (params?: any) => api.get<PaginatedResponse<Anime>>('/query', { params }),
  getById: (id: number) => api.get<Anime>(`/id/${id}`),
  create: (data: Partial<Anime>) => api.post<Anime>('/anime', data),
  update: (id: number, data: Partial<Anime>) => api.put<Anime>(`/anime/${id}`, data),
  delete: (id: number) => api.delete(`/anime/${id}`),
  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};