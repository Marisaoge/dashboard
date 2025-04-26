import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

interface Patient {
  id: string;
  name: string;
  initial: string;
}

interface NewTextMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPatient: (patient: Patient) => void;
}

const NewTextMessageModal: React.FC<NewTextMessageModalProps> = ({
  isOpen,
  onClose,
  onSelectPatient,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Sample patients data - in a real app, this would come from an API
  const patients: Patient[] = [
    { id: 'joe', name: 'Joe Smith', initial: 'J' },
    { id: 'janet', name: 'Janet Twist', initial: 'J' },
    { id: 'janet2', name: 'Janet Twist', initial: 'J' },
    { id: 'janet3', name: 'Janet Twist', initial: 'K' },
    { id: 'janet4', name: 'Janet Twist', initial: 'M' },
    { id: 'janet5', name: 'Janet Twist', initial: 'E' },
    { id: 'janet6', name: 'Janet Twist', initial: 'E' }
  ];

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">New Text Message</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search patients..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {filteredPatients.map((patient) => (
              <button
                key={patient.id}
                className="w-full flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors"
                onClick={() => {
                  onSelectPatient(patient);
                  onClose();
                }}
              >
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium mr-3">
                  {patient.initial}
                </div>
                <span className="font-medium">{patient.name}</span>
              </button>
            ))}
          </div>

          {filteredPatients.length === 0 && (
            <div className="text-center text-gray-500 py-4">
              No patients found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewTextMessageModal; 