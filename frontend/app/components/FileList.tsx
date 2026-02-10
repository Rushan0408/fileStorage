import { Download, Trash2, MoreVertical, File as FileIcon, Image, Video, Music, FileText } from 'lucide-react';
import { useState } from 'react';
import { fileAPI } from '~/lib/api';
import type { FileMetadata } from '~/lib/types';

interface FileListProps {
  files: FileMetadata[];
  onFileDelete: (fileId: string) => void;
}

export default function FileList({ files, onFileDelete }: FileListProps) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) {
      return <Image className="w-10 h-10 text-green-600" />;
    } else if (mimeType.startsWith('video/')) {
      return <Video className="w-10 h-10 text-purple-600" />;
    } else if (mimeType.startsWith('audio/')) {
      return <Music className="w-10 h-10 text-pink-600" />;
    } else if (mimeType.includes('pdf') || mimeType.includes('document') || mimeType.includes('text')) {
      return <FileText className="w-10 h-10 text-red-600" />;
    }
    return <FileIcon className="w-10 h-10 text-gray-600" />;
  };

  const handleDownload = async (fileId: string, filename: string) => {
    try {
      setDownloading(fileId);
      const response = await fileAPI.getDownloadUrl(fileId);
      
      // Open download URL in new tab
      const link = document.createElement('a');
      link.href = response.downloadUrl;
      link.download = filename;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download file');
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {files.map((file) => (
        <div
          key={file.id}
          className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition group relative"
        >
          <div className="flex items-start justify-between mb-3">
            {getFileIcon(file.mimeType)}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveMenu(activeMenu === file.id ? null : file.id);
              }}
              className="opacity-0 group-hover:opacity-100 transition p-1 hover:bg-gray-100 rounded"
            >
              <MoreVertical className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <h3 className="font-semibold text-gray-900 mb-1 truncate" title={file.name}>
            {file.name}
          </h3>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>{formatFileSize(file.size)}</span>
            <span>{formatDate(file.createdAt)}</span>
          </div>

          {file.uploadStatus === 'pending' && (
            <div className="mt-2">
              <span className="inline-block px-2 py-1 text-xs font-medium text-yellow-700 bg-yellow-100 rounded">
                Uploading...
              </span>
            </div>
          )}

          {file.uploadStatus === 'failed' && (
            <div className="mt-2">
              <span className="inline-block px-2 py-1 text-xs font-medium text-red-700 bg-red-100 rounded">
                Upload Failed
              </span>
            </div>
          )}

          {activeMenu === file.id && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setActiveMenu(null)}
              />
              <div className="absolute right-4 top-16 bg-white border border-gray-200 rounded-lg shadow-lg z-20 py-1 min-w-37.5">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveMenu(null);
                    handleDownload(file.id, file.name);
                  }}
                  disabled={downloading === file.id || file.uploadStatus !== 'complete'}
                  className="w-full flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
                >
                  <Download className="w-4 h-4" />
                  <span>{downloading === file.id ? 'Downloading...' : 'Download'}</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveMenu(null);
                    onFileDelete(file.id);
                  }}
                  className="w-full flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 transition"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}