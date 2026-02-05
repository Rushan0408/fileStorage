import { Folder, Trash2, MoreVertical } from 'lucide-react';
import { useState } from 'react';
import type { Folder as FolderType } from '~/lib/types';

interface FolderListProps {
  folders: FolderType[];
  onFolderClick: (folderId: string) => void;
  onFolderDelete: (folderId: string) => void;
}

export default function FolderList({ folders, onFolderClick, onFolderDelete }: FolderListProps) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {folders.map((folder) => (
        <div
          key={folder.id}
          className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition cursor-pointer group relative"
        >
          <div onClick={() => onFolderClick(folder.id)} className="flex-1">
            <div className="flex items-start justify-between mb-3">
              <Folder className="w-10 h-10 text-blue-600" />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveMenu(activeMenu === folder.id ? null : folder.id);
                }}
                className="opacity-0 group-hover:opacity-100 transition p-1 hover:bg-gray-100 rounded"
              >
                <MoreVertical className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <h3 className="font-semibold text-gray-900 mb-1 truncate">{folder.name}</h3>
            <p className="text-sm text-gray-500">{formatDate(folder.createdAt)}</p>
          </div>

          {activeMenu === folder.id && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setActiveMenu(null)}
              />
              <div className="absolute right-4 top-16 bg-white border border-gray-200 rounded-lg shadow-lg z-20 py-1 min-w-[150px]">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveMenu(null);
                    onFolderDelete(folder.id);
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