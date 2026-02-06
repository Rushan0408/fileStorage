export interface User {
  id: string;
  username: string;
  storageUsed: number;
  storageQuota: number;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Folder {
  id: string;
  name: string;
  path: string;
  createdAt: string;
}

// Rename this to avoid conflict with browser's File type
export interface FileMetadata {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  uploadStatus: string;
  createdAt: string;
}

export interface FolderContents {
  folderId: string;
  path: string;
  folders: Folder[];
  files: FileMetadata[];  // Change here
}

export interface UploadResponse {
  fileId: string;
  uploadUrl: string;
  expiresAt: string;
}

export interface DownloadResponse {
  downloadUrl: string;
  filename: string;
  size: number;
  expiresAt: string;
}

export interface StorageStats {
  storageUsed: number;
  storageQuota: number;
  storageAvailable: number;
  usagePercentage: number;
  fileCount: number;
  folderCount: number;
  breakdown: {
    images: number;
    videos: number;
    documents: number;
    other: number;
  };
}