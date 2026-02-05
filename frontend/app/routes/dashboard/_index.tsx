import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { folderAPI, fileAPI } from '~/lib/api';
import type { Folder, FileMetadata } from '~/lib/types';

import { Folder as FolderIcon, Upload } from 'lucide-react';
import FileUpload from '~/components/FileUpload';
import FolderList from '~/components/FolderList';
import CreateFolder from '~/components/CreateFolder';

export default function Dashboard() {
  const navigate = useNavigate();
  const [folders, setFolders] = useState<Folder[]>([]);
  const [files, setFiles] = useState<FileMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [foldersData] = await Promise.all([
        folderAPI.getRootFolders(),
      ]);
      setFolders(foldersData.folders);
      
      // For root level, we need to get files in root (folderId = null)
      // This might need backend adjustment to support null folderId
      setFiles([]);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFolderClick = (folderId: string) => {
    navigate(`/dashboard/folder/${folderId}`);
  };

  const handleFolderCreated = () => {
    setShowCreateFolder(false);
    loadData();
  };

  const handleUploadComplete = () => {
    setShowUpload(false);
    loadData();
  };

  const handleFolderDelete = async (folderId: string) => {
    if (window.confirm('Are you sure you want to delete this folder?')) {
      try {
        await folderAPI.deleteFolder(folderId);
        loadData();
      } catch (error) {
        console.error('Failed to delete folder:', error);
        alert('Failed to delete folder');
      }
    }
  };

  const handleFileDelete = async (fileId: string) => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      try {
        await fileAPI.deleteFile(fileId);
        loadData();
      } catch (error) {
        console.error('Failed to delete file:', error);
        alert('Failed to delete file');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Files</h1>
        <p className="text-gray-600">Browse and manage your files and folders</p>
      </div>

      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setShowCreateFolder(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <FolderIcon className="w-5 h-5" />
          <span>New Folder</span>
        </button>
        <button
          onClick={() => setShowUpload(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          <Upload className="w-5 h-5" />
          <span>Upload File</span>
        </button>
      </div>

      {showCreateFolder && (
        <CreateFolder
          parentFolderId={null}
          onClose={() => setShowCreateFolder(false)}
          onCreated={handleFolderCreated}
        />
      )}

      {showUpload && (
        <FileUpload
          folderId={null}
          onClose={() => setShowUpload(false)}
          onUploadComplete={handleUploadComplete}
        />
      )}

      <div className="space-y-8">
        {folders.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Folders</h2>
            <FolderList
              folders={folders}
              onFolderClick={handleFolderClick}
              onFolderDelete={handleFolderDelete}
            />
          </div>
        )}

        {files.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Files</h2>
            <FileList files={files} onFileDelete={handleFileDelete} />
          </div>
        )}

        {folders.length === 0 && files.length === 0 && (
          <div className="text-center py-12">
            <FolderIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No files yet</h3>
            <p className="text-gray-600 mb-4">Get started by creating a folder or uploading a file</p>
          </div>
        )}
      </div>
    </div>
  );
}