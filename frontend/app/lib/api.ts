import axios, { type AxiosInstance } from 'axios';
import { getToken } from './auth';
import type {
  AuthResponse,
  Folder,
  FolderContents,
  FileMetadata,
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
  register: async (username: string, password: string): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/register', { username, password });
    
    // Transform backend response to frontend format
    return {
      token: response.data.jwt,  // Backend sends 'jwt'
      user: {
        id: response.data.userId || '',  // If backend sends userId
        username: response.data.username,
        storageUsed: response.data.storageUsed || 0,
        storageQuota: response.data.storageQuota || 5368709120, // 5GB default
      }
    };
  },

  login: async (username: string, password: string): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/login', { username, password });
    
    // Transform backend response to frontend format
    return {
      token: response.data.jwt,  // Backend sends 'jwt'
      user: {
        id: response.data.userId || '',  // If backend sends userId
        username: response.data.username,
        storageUsed: response.data.storageUsed || 0,
        storageQuota: response.data.storageQuota || 5368709120, // 5GB default
      }
    };
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
    console.log("called from folder.$folderId.tsx");
    const response = await apiClient.get(`/folders/${folderId}/contents`);
    return response.data;
  },

  deleteFolder: async (folderId: string): Promise<void> => {
    await apiClient.delete(`/folders/${folderId}`);
  },
};

// File APIs
// File APIs
export const fileAPI = {
  initiateUpload: async (
    name: string,
    size: number,
    mimeType: string,
    folderId: string | null
  ): Promise<UploadResponse> => {
    console.log('Initiating upload with:', { name, size, mimeType, folderId });
    
    const response = await apiClient.post('/files/initiate-upload', {
      name,
      size,
      mimeType,
      folderId,
    });
    
    console.log('Backend response:', response.data);
    
    const data = response.data;
    
    if (!data || Object.keys(data).length === 0) {
      throw new Error('Server returned empty response');
    }
    
    const uploadUrl = data.uploadUrl || data.presignedUrl || data.url;
    const fileId = data.fileId || data.id;
    const expiresAt = data.expiresAt;
    
    if (!uploadUrl || !fileId) {
      throw new Error('Invalid response from server');
    }
    
    return {
      fileId,
      uploadUrl,
      expiresAt: expiresAt || new Date().toISOString()
    };
  },

  uploadToS3: async (
    uploadUrl: string, 
    file: globalThis.File,
    onProgress?: (progress: number) => void
  ): Promise<void> => {
    console.log('Uploading to S3:', uploadUrl);
    
    await axios.put(uploadUrl, file, {
      headers: { 
        'Content-Type': file.type,
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });
  },

  completeUpload: async (fileId: string): Promise<FileMetadata> => {
    console.log('Completing upload for file ID:', fileId);
    const response = await apiClient.post(`/files/${fileId}/complete`);
    console.log('Complete response:', response.data);
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

  getRootFiles: async (): Promise<FileMetadata[]> => {
    const response = await apiClient.get('/files/root');
    
    console.log('Root files response:', response.data);
    
    // Handle different response formats
    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data && Array.isArray(response.data.files)) {
      return response.data.files;
    }
    
    return [];
  },
};

// Storage APIs
export const storageAPI = {
  getStats: async (): Promise<StorageStats> => {
    const response = await apiClient.get('/storage/stats');
    return response.data;
  },
};