import axios, { type AxiosInstance } from 'axios';
import { getToken } from './auth';
import type {
  AuthResponse,
  Folder,
  FolderContents,
  FileMetadata,  // Changed from File
  UploadResponse,
  DownloadResponse,
  StorageStats,
} from './types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const authAPI = {
  register: async (email: string, password: string, name: string): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/register', { email, password, name });
    return response.data;
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },
};

// Folder APIs
export const folderAPI = {
  createFolder: async (name: string, parentFolderId: string | null): Promise<Folder> => {
    const response = await apiClient.post('/folders', { name, parentFolderId });
    return response.data;
  },

  getRootFolders: async (): Promise<{ folders: Folder[]; count: number }> => {
    const response = await apiClient.get('/folders');
    return response.data;
  },

  getFolderContents: async (folderId: string): Promise<FolderContents> => {
    const response = await apiClient.get(`/folders/${folderId}/contents`);
    return response.data;
  },

  deleteFolder: async (folderId: string): Promise<void> => {
    await apiClient.delete(`/folders/${folderId}`);
  },
};

// File APIs
export const fileAPI = {
  initiateUpload: async (
    name: string,
    size: number,
    mimeType: string,
    folderId: string | null
  ): Promise<UploadResponse> => {
    const response = await apiClient.post('/files/initiate-upload', {
      name,
      size,
      mimeType,
      folderId,
    });
    return response.data;
  },

  // Use browser's File type explicitly
  uploadToS3: async (
    uploadUrl: string, 
    file: globalThis.File,  // Use globalThis.File to explicitly reference browser's File type
    onProgress?: (progress: number) => void
  ): Promise<void> => {
    await axios.put(uploadUrl, file, {
      headers: { 'Content-Type': file.type },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });
  },

  completeUpload: async (fileId: string): Promise<FileMetadata> => {
    const response = await apiClient.post(`/files/${fileId}/complete`);
    return response.data;
  },

  getDownloadUrl: async (fileId: string): Promise<DownloadResponse> => {
    const response = await apiClient.get(`/files/${fileId}/download`);
    return response.data;
  },

  deleteFile: async (fileId: string): Promise<void> => {
    await apiClient.delete(`/files/${fileId}`);
  },

  searchFiles: async (query: string, mimeType?: string): Promise<{ results: FileMetadata[] }> => {
    const params = new URLSearchParams({ query });
    if (mimeType) params.append('mimeType', mimeType);
    const response = await apiClient.get(`/files/search?${params.toString()}`);
    return response.data;
  },
};

// Storage APIs
export const storageAPI = {
  getStats: async (): Promise<StorageStats> => {
    const response = await apiClient.get('/storage/stats');
    return response.data;
  },
};