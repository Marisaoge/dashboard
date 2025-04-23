import React, { useState } from 'react';
import { X } from 'lucide-react';

interface TagManagementProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tagData: { name: string; priority: 'high' | 'medium' | 'low' }) => void;
  onDelete?: () => void;
  initialData?: {
    name: string;
    priority: 'high' | 'medium' | 'low';
  };
  mode: 'add' | 'edit';
}

const TagManagement: React.FC<TagManagementProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  initialData,
  mode
}) => {
  const [tagData, setTagData] = useState({
    name: initialData?.name || '',
    priority: initialData?.priority || 'medium'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(tagData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">
            {mode === 'add' ? 'Add Tag' : 'Edit Tag'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tag name*
              </label>
              <input
                type="text"
                value={tagData.name}
                onChange={(e) => setTagData({ ...tagData, name: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
                placeholder="Enter tag name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority*
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setTagData({ ...tagData, priority: 'low' })}
                  className={`p-2 border rounded-lg text-sm font-medium ${
                    tagData.priority === 'low'
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Low
                </button>
                <button
                  type="button"
                  onClick={() => setTagData({ ...tagData, priority: 'medium' })}
                  className={`p-2 border rounded-lg text-sm font-medium ${
                    tagData.priority === 'medium'
                      ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Medium
                </button>
                <button
                  type="button"
                  onClick={() => setTagData({ ...tagData, priority: 'high' })}
                  className={`p-2 border rounded-lg text-sm font-medium ${
                    tagData.priority === 'high'
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  High
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            {mode === 'edit' && onDelete && (
              <button
                type="button"
                onClick={onDelete}
                className="flex-1 bg-red-50 text-red-600 py-2 px-4 rounded-lg hover:bg-red-100 transition-colors"
              >
                Delete Tag
              </button>
            )}
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {mode === 'add' ? 'Add Tag' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TagManagement; 