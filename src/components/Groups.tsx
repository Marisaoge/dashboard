import React, { useState } from 'react';
import { 
  Search, 
  Plus,
  MoreHorizontal,
  X,
  Calendar,
  ChevronRight
} from 'lucide-react';

interface Group {
  id: string;
  name: string;
  description: string;
  patientCount: number;
  createdAt: string;
  type: 'Active Bi-Weekly' | 'Monthly Check-in' | 'High Risk' | 'Custom';
}

const Groups: React.FC = () => {
  const [showNewGroupModal, setShowNewGroupModal] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const [groups] = useState<Group[]>([
    {
      id: '1',
      name: 'Active Bi-Weekly',
      description: 'Patients requiring bi-weekly check-ins and monitoring',
      patientCount: 45,
      createdAt: '2025-01-15',
      type: 'Active Bi-Weekly'
    },
    {
      id: '2',
      name: 'Monthly Check-in',
      description: 'Stable patients needing monthly follow-ups',
      patientCount: 32,
      createdAt: '2025-01-20',
      type: 'Monthly Check-in'
    },
    {
      id: '3',
      name: 'High Risk Patients',
      description: 'Patients requiring intensive monitoring',
      patientCount: 18,
      createdAt: '2025-02-01',
      type: 'High Risk'
    },
    {
      id: '4',
      name: 'New Enrollments',
      description: 'Recently enrolled patients in onboarding phase',
      patientCount: 12,
      createdAt: '2025-02-15',
      type: 'Custom'
    }
  ]);

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const GroupModal: React.FC<{ group?: Group; onClose: () => void }> = ({ group, onClose }) => {
    const [formData, setFormData] = useState({
      name: group?.name || '',
      description: group?.description || ''
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onClose();
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">
              {group ? 'Edit Group' : 'Create New Group'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Group Name*
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {group ? 'Save Changes' : 'Create Group'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const DeleteConfirmationModal: React.FC<{ groupId: string; onClose: () => void }> = ({ groupId, onClose }) => {
    const group = groups.find(g => g.id === groupId);

    const handleDelete = () => {
      onClose();
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-2">Delete Group</h2>
            <p className="text-gray-600">
              Are you sure you want to delete the group "{group?.name}"? This action cannot be undone.
            </p>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Delete Group
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col w-full bg-gray-50">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-4 w-full">
          <div className="relative flex-1 max-w-xs">
            <input
              type="text"
              placeholder="Search groups..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <button
            onClick={() => setShowNewGroupModal(true)}
            className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-md flex items-center whitespace-nowrap"
          >
            <Plus className="h-4 w-4 mr-1" />
            New Group
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Group Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patients
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredGroups.map((group) => (
                <tr key={group.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{group.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">{group.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm text-gray-900">{group.patientCount}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{group.createdAt}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button 
                      className="text-gray-400 hover:text-gray-600"
                      onClick={() => setEditingGroup(group)}
                    >
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showNewGroupModal && (
        <GroupModal onClose={() => setShowNewGroupModal(false)} />
      )}

      {editingGroup && (
        <GroupModal
          group={editingGroup}
          onClose={() => setEditingGroup(null)}
        />
      )}

      {showDeleteConfirm && (
        <DeleteConfirmationModal
          groupId={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(null)}
        />
      )}
    </div>
  );
};

export default Groups;