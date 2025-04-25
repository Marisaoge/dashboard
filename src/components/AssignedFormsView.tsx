import React from 'react';
import { FileText } from 'lucide-react';

interface AssignedForm {
  id: string;
  title: string;
  assignedDate: string;
  status: 'pending' | 'completed';
}

interface AssignedFormsViewProps {
  patientName: string;
}

const AssignedFormsView: React.FC<AssignedFormsViewProps> = ({ patientName }) => {
  // This would typically come from an API
  const assignedForms: AssignedForm[] = [
    {
      id: '1',
      title: 'Initial Health Assessment',
      assignedDate: '07/16/2024',
      status: 'pending'
    },
    {
      id: '2',
      title: 'PHQ-9 Depression Screening',
      assignedDate: '07/16/2024',
      status: 'pending'
    },
    {
      id: '3',
      title: 'Nutrition Assessment',
      assignedDate: '07/16/2024',
      status: 'pending'
    },
    {
      id: '4',
      title: 'Exercise Readiness Questionnaire',
      assignedDate: '07/16/2024',
      status: 'pending'
    }
  ];

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <h3 className="text-xl font-medium text-gray-900">Assigned Forms</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="text-base font-medium text-gray-900">Current Program</h4>
              <p className="text-sm text-gray-600 mt-1">
                Motiv Program Template - LIVE (new pts as of 7/16/2024)
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {assignedForms.map((form) => (
              <div
                key={form.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300"
              >
                <div className="flex items-center">
                  <div className="p-2 bg-blue-50 rounded">
                    <FileText className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <h5 className="text-base font-medium text-gray-900">{form.title}</h5>
                    <p className="text-sm text-gray-500">Assigned {form.assignedDate}</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-500">
                  {form.status === 'completed' ? 'Completed' : 'Pending'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignedFormsView; 