import React, { useState } from 'react';
import { X, ChevronDown, ChevronRight, FileText, CheckCircle2 } from 'lucide-react';

interface ProgramTemplate {
  id: string;
  name: string;
  description: string;
  forms: {
    id: string;
    title: string;
    type: string;
  }[];
}

interface AssignProgramModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (programId: string) => void;
}

const AssignProgramModal: React.FC<AssignProgramModalProps> = ({
  isOpen,
  onClose,
  onAssign,
}) => {
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // This would come from an API
  const availablePrograms: ProgramTemplate[] = [
    {
      id: 'motiv-live-2024',
      name: 'Motiv Program Template - LIVE (new pts as of 7/16/2024)',
      description: 'Standard program template for new patients',
      forms: [
        { id: '1', title: 'Initial Health Assessment', type: 'Health' },
        { id: '2', title: 'PHQ-9 Depression Screening', type: 'Mental Health' },
        { id: '3', title: 'Nutrition Assessment', type: 'Nutrition' },
        { id: '4', title: 'Exercise Readiness Questionnaire', type: 'Exercise' }
      ]
    },
    {
      id: 'motiv-end-lcsw',
      name: 'Motiv End of Program - LCSW only',
      description: 'End of program assessment for LCSW patients',
      forms: [
        { id: '5', title: 'Final Mental Health Assessment', type: 'Mental Health' },
        { id: '6', title: 'Program Satisfaction Survey', type: 'Feedback' },
        { id: '7', title: 'Future Care Plan', type: 'Planning' }
      ]
    },
    {
      id: 'motiv-end-ep',
      name: 'Motiv End of Program - EP only',
      description: 'End of program assessment for Exercise Physiology patients',
      forms: [
        { id: '8', title: 'Final Physical Assessment', type: 'Exercise' },
        { id: '9', title: 'Exercise Progress Review', type: 'Exercise' },
        { id: '10', title: 'Ongoing Exercise Plan', type: 'Planning' }
      ]
    },
    {
      id: 'motiv-end-ep-bh',
      name: 'Motiv End of Program - EP for patients in BH',
      description: 'End of program assessment for EP patients in Behavioral Health',
      forms: [
        { id: '11', title: 'Final Physical Assessment', type: 'Exercise' },
        { id: '12', title: 'Mental Health Integration Review', type: 'Mental Health' },
        { id: '13', title: 'Combined Care Progress Report', type: 'Health' }
      ]
    },
    {
      id: 'repeat-motiv-end-lcsw',
      name: 'REPEAT_ Motiv End of Program - LCSW only',
      description: 'Repeat end of program assessment for LCSW patients',
      forms: [
        { id: '14', title: 'Follow-up Mental Health Assessment', type: 'Mental Health' },
        { id: '15', title: 'Progress Evaluation', type: 'Health' },
        { id: '16', title: 'Care Continuation Plan', type: 'Planning' }
      ]
    }
  ];

  if (!isOpen) return null;

  const selectedProgramData = availablePrograms.find(p => p.id === selectedProgram);

  const handleAssign = () => {
    if (selectedProgram) {
      setShowConfirmation(true);
      // Show confirmation for 2 seconds before closing
      setTimeout(() => {
        onAssign(selectedProgram);
        onClose();
      }, 2000);
    }
  };

  if (showConfirmation) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6 text-center">
          <div className="mb-4 flex justify-center">
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Program Assigned Successfully
          </h3>
          <p className="text-sm text-gray-600">
            {selectedProgramData?.name} has been assigned to the patient.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-medium text-gray-900">Assign Program</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-sm text-gray-600 mb-4">
            Select a program template to assign to this patient. You can preview the forms included
            in each program before assigning.
          </p>

          {/* Dropdown */}
          <div className="relative mb-4">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full flex items-center justify-between px-4 py-2.5 border border-gray-200 rounded-lg hover:border-gray-300 bg-white text-left"
            >
              <span className="text-sm text-gray-700">
                {selectedProgram 
                  ? availablePrograms.find(p => p.id === selectedProgram)?.name
                  : 'Select a program...'}
              </span>
              <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                {availablePrograms.map((program) => (
                  <button
                    key={program.id}
                    className="w-full px-4 py-2.5 text-left hover:bg-gray-50 text-sm text-gray-700"
                    onClick={() => {
                      setSelectedProgram(program.id);
                      setIsDropdownOpen(false);
                    }}
                  >
                    {program.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Preview Section */}
          {selectedProgramData && (
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="mb-4">
                <h3 className="text-base font-medium text-gray-900">Program Preview</h3>
                <p className="text-sm text-gray-600 mt-1">{selectedProgramData.description}</p>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Included Forms:</h4>
                {selectedProgramData.forms.map((form) => (
                  <div
                    key={form.id}
                    className="flex items-center gap-3 text-sm text-gray-700 pl-2"
                  >
                    <FileText className="h-4 w-4 text-gray-400" />
                    <span>{form.title}</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-500">{form.type}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleAssign}
            disabled={!selectedProgram}
            className={`px-4 py-2 rounded-lg ${
              selectedProgram
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            Assign Program
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignProgramModal; 