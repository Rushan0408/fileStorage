import { X, Download } from 'lucide-react';
import { useEffect, useState } from 'react';
import { fileAPI } from '~/lib/api';

interface FilePreviewProps {
  fileId: string;
  fileName: string;
  mimeType: string;
  onClose: () => void;
}

export default function FilePreview({
  fileId,
  fileName,
  mimeType,
  onClose,
}: FilePreviewProps) {
  const [downloadUrl, setDownloadUrl] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPreview();
  }, [fileId]);

  const loadPreview = async () => {
    try {
      const response = await fileAPI.getDownloadUrl(fileId);
      setDownloadUrl(response.downloadUrl);
    } catch (error) {
      console.error('Failed to load preview:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderPreview = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        </div>
      );
    }

    if (mimeType.startsWith('image/')) {
      return (
        <img
          src={downloadUrl}
          alt={fileName}
          className="max-w-full max-h-[70vh] mx-auto"
        />
      );
    }

    if (mimeType.startsWith('video/')) {
      return (
        <video
          src={downloadUrl}
          controls
          className="max-w-full max-h-[70vh] mx-auto"
        />
      );
    }

    if (mimeType.startsWith('audio/')) {
      return (
        <div className="flex items-center justify-center h-96">
          <audio src={downloadUrl} controls className="w-full max-w-md" />
        </div>
      );
    }

    if (mimeType === 'application/pdf') {
      return (
        <iframe
          src={downloadUrl}
          title={fileName}
          className="w-full h-[70vh]"
        />
      );
    }

    return (
      <div className="flex flex-col items-center justify-center h-96">
        <p className="text-gray-600 mb-4">Preview not available for this file type</p>

        <a
          href={downloadUrl}
          download={fileName}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <Download className="w-5 h-5" />
          <span>Download File</span>
        </a>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-5xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 truncate">
            {fileName}
          </h2>

          <div className="flex items-center space-x-2">
            <a
              href={downloadUrl}
              download={fileName}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
            >
              <Download className="w-5 h-5" />
            </a>

            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 overflow-auto max-h-[calc(90vh-80px)]">
          {renderPreview()}
        </div>
      </div>
    </div>
  );
}