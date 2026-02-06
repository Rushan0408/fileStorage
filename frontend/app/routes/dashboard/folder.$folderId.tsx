import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { folderAPI, fileAPI } from '~/lib/api';
import type { FolderContents } from '~/lib/types';
import FolderList from '~/components/FolderList';
import FileList from '~/components/FileList';
import FileUpload from '~/components/FileUpload';
import CreateFolder from '~/components/CreateFolder';
import { Folder as FolderIcon, Upload, ChevronRight, Home } from 'lucide-react';

export default function FolderView() {
  const { folderId } = useParams();
  const navigate = useNavigate();
  const [contents, setContents] = useState<FolderContents | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    loadContents();
  }, [folderId]);

  const loadContents = async () => {
    if (!folderId) return;
    
    try {
      setLoading(true);
      const data = await folderAPI.getFolderContents(folderId);
      
      // Ensure folders and files arrays exist
      if (data) {
        setContents({
          ...data,
          folders: Array.isArray(data.folders) ? data.folders : [],
          files: Array.isArray(data.files) ? data.files : [],
        });
      }
    } catch (error) {
      console.error('Failed to load folder contents:', error);
      alert('Failed to load folder');
    } finally {
      setLoading(false);
    }
  };

  const handleFolderClick = (id: string) => {
    navigate(`/dashboard/folder/${id}`);
  };

  const handleFolderCreated = () => {
    setShowCreateFolder(false);
    loadContents();
  };

  const handleUploadComplete = () => {
    setShowUpload(false);
    loadContents();
  };

  const handleFolderDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this folder?')) {
      try {
        await folderAPI.deleteFolder(id);
        loadContents();
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
        loadContents();
      } catch (error) {
        console.error('Failed to delete file:', error);
        alert('Failed to delete file');
      }
    }
  };

  const renderBreadcrumb = () => {
    if (!contents?.path) return null;

    const parts = contents.path.split('/').filter(Boolean);
    
    return (
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <Link to="/dashboard" className="hover:text-blue-600 flex items-center">
          <Home className="w-4 h-4" />
        </Link>
        {parts.map((part, index) => (
          <div key={index} className="flex items-center space-x-2">
            <ChevronRight className="w-4 h-4" />
            <span className="font-medium text-gray-900">{part}</span>
          </div>
        ))}
      </nav>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!contents) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Folder not found</p>
      </div>
    );
  }

  return (
    <div>
      {renderBreadcrumb()}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {contents.path.split('/').filter(Boolean).pop() || 'Folder'}
        </h1>
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
          parentFolderId={folderId || null}
          onClose={() => setShowCreateFolder(false)}
          onCreated={handleFolderCreated}
        />
      )}

      {showUpload && (
        <FileUpload
          folderId={folderId || null}
          onClose={() => setShowUpload(false)}
          onUploadComplete={handleUploadComplete}
        />
      )}

      <div className="space-y-8">
        {contents.folders && contents.folders.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Folders</h2>
            <FolderList
              folders={contents.folders}
              onFolderClick={handleFolderClick}
              onFolderDelete={handleFolderDelete}
            />
          </div>
        )}

        {contents.files && contents.files.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Files</h2>
            <FileList files={contents.files} onFileDelete={handleFileDelete} />
          </div>
        )}

        {(!contents.folders || contents.folders.length === 0) && 
         (!contents.files || contents.files.length === 0) && (
          <div className="text-center py-12">
            <FolderIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Empty folder</h3>
            <p className="text-gray-600 mb-4">Add files or create subfolders</p>
          </div>
        )}
      </div>
    </div>
  );
}