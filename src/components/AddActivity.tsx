import React, { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';

interface AddActivityProps {
  onClose: () => void;
  onSave: (activity: {
    type: string;
    date: string;
    startTime: string;
    endTime: string;
    duration: string;
    bpDiscussionTime: string;
    summary: string;
  }) => void;
  initialType?: string;
  readOnly?: boolean;
  initialValues?: {
    type: string;
    date: string;
    startTime: string;
    endTime: string;
    duration: string;
    bpDiscussionTime: string;
    summary: string;
  };
}

const AddActivity: React.FC<AddActivityProps> = ({ 
  onClose, 
  onSave, 
  initialType = 'EP Follow-up (by month)',
  readOnly = false,
  initialValues
}) => {
  const [formData, setFormData] = useState({
    type: initialValues?.type || initialType,
    date: initialValues?.date || '',
    startTime: initialValues?.startTime || '',
    endTime: initialValues?.endTime || '',
    duration: initialValues?.duration || '',
    bpDiscussionTime: initialValues?.bpDiscussionTime || '',
    summary: initialValues?.summary || ''
  });

  const activityTypes = [
    'EP Follow-up (by month)',
    'EP Initial Visit',
    'EP Group Session',
    'EP Care Plan Review',
    'EP Discharge',
    'RPM Device Setup'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="fixed inset-0 z-[99999] overflow-hidden">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-xl">
            <form onSubmit={handleSubmit} className="flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-medium">Activity Type:</h2>
                  <div className="relative">
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 appearance-none pr-8"
                      disabled={readOnly}
                    >
                      {activityTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                  <div className="inline-flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded">
                    <span>Status: Open</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(100vh-16rem)]">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      What's the date?
                    </label>
                    {readOnly ? (
                      <div className="text-gray-900">{formData.date}</div>
                    ) : (
                      <input
                        type="text"
                        name="date"
                        placeholder="MM/DD/YYYY"
                        value={formData.date}
                        onChange={handleChange}
                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      What's the start time of the call (in US Central Time)?
                    </label>
                    {readOnly ? (
                      <div className="text-gray-900">{formData.startTime}</div>
                    ) : (
                      <input
                        type="text"
                        name="startTime"
                        placeholder="HH:MM:SS AM/PM"
                        value={formData.startTime}
                        onChange={handleChange}
                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      What's the end time of the call (in US Central Time)?
                    </label>
                    {readOnly ? (
                      <div className="text-gray-900">{formData.endTime}</div>
                    ) : (
                      <input
                        type="text"
                        name="endTime"
                        placeholder="HH:MM:SS AM/PM"
                        value={formData.endTime}
                        onChange={handleChange}
                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      What was the duration of the call (in minutes and seconds)?
                    </label>
                    {readOnly ? (
                      <div className="text-gray-900">{formData.duration}</div>
                    ) : (
                      <input
                        type="text"
                        name="duration"
                        placeholder="XX minutes and XX seconds"
                        value={formData.duration}
                        onChange={handleChange}
                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      What duration of the call was spent discussing the patient's blood pressure or blood pressure device (in minutes and seconds)?
                    </label>
                    {readOnly ? (
                      <div className="text-gray-900">{formData.bpDiscussionTime}</div>
                    ) : (
                      <input
                        type="text"
                        name="bpDiscussionTime"
                        placeholder="XX minutes and XX seconds"
                        value={formData.bpDiscussionTime}
                        onChange={handleChange}
                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Provide a summary of this call with the key takeaways. Refer to the patient as "patient". Never refer to patient by their name.
                    </label>
                    {readOnly ? (
                      <div className="text-gray-900 whitespace-pre-line">{formData.summary}</div>
                    ) : (
                      <textarea
                        name="summary"
                        value={formData.summary}
                        onChange={handleChange}
                        rows={4}
                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Footer */}
              {!readOnly && (
                <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                  >
                    Save Activity
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddActivity;