import React, { useState } from 'react';
import { X, Search, Eye, Check } from 'lucide-react';

interface Form {
  id: string;
  title: string;
  description: string;
  category: string;
  lastUpdated: string;
}

interface SendFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (formId: string) => void;
}

const SendFormModal: React.FC<SendFormModalProps> = ({ isOpen, onClose, onSend }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedForm, setSelectedForm] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Sample forms data - this would typically come from an API
  const forms: Form[] = [
    {
      id: '1',
      title: 'Initial Health Assessment',
      description: 'Comprehensive health assessment for new patients',
      category: 'Health Assessment',
      lastUpdated: '2024-02-20'
    },
    {
      id: '2',
      title: 'PHQ-9 Depression Screening',
      description: 'Standard depression screening questionnaire',
      category: 'Mental Health',
      lastUpdated: '2024-02-18'
    },
    {
      id: '3',
      title: 'Nutrition Assessment',
      description: 'Dietary habits and nutritional assessment form',
      category: 'Nutrition',
      lastUpdated: '2024-02-15'
    },
    {
      id: '4',
      title: 'Exercise Readiness Questionnaire',
      description: 'Physical activity readiness assessment',
      category: 'Physical Activity',
      lastUpdated: '2024-02-10'
    }
  ];

  const filteredForms = forms.filter(form =>
    form.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    form.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSend = () => {
    if (selectedForm) {
      onSend(selectedForm);
      setShowConfirmation(true);
      setTimeout(() => {
        setShowConfirmation(false);
        onClose();
      }, 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        {showConfirmation ? (
          <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Form Sent Successfully</h3>
            <p className="text-sm text-gray-500">
              The form has been sent to the patient.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg w-[900px] max-h-[85vh] flex">
            {/* Forms List Section */}
            <div className="w-[320px] p-6 border-r border-gray-200 overflow-y-auto">
              <div className="flex items-center mb-6">
                <h2 className="text-xl font-medium text-gray-900">Send Form</h2>
              </div>

              <div className="relative mb-6">
                <input
                  type="text"
                  placeholder="Search forms..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>

              <div className="space-y-2">
                {filteredForms.map((form) => (
                  <div
                    key={form.id}
                    className={`px-3 py-2 rounded border cursor-pointer transition-colors ${
                      selectedForm === form.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-200'
                    }`}
                    onClick={() => setSelectedForm(form.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-medium text-gray-900">{form.title}</h3>
                        <div className="flex items-center mt-0.5">
                          <span className="text-sm text-gray-500">Last updated {form.lastUpdated}</span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowPreview(true);
                          setSelectedForm(form.id);
                        }}
                        className="text-blue-600 hover:text-blue-700 ml-4"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Preview Section */}
            <div className="flex-1 flex flex-col">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-xl font-medium text-gray-900">Form Preview</h3>
                <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {selectedForm ? (
                  <div className="max-w-2xl mx-auto">
                    <div className="space-y-8">
                      <div>
                        <h4 className="text-xl font-medium text-gray-900 mb-2">Initial Health Assessment</h4>
                        <p className="text-base text-gray-600">Please complete this assessment to help us better understand your current health status.</p>
                      </div>

                      <div className="space-y-6">
                        {/* Form questions */}
                        <div>
                          <h5 className="text-base font-medium text-gray-900 mb-4">1. How would you rate your overall health?</h5>
                          <div className="space-y-3">
                            {['Excellent', 'Good', 'Fair', 'Poor'].map((option) => (
                              <div key={option} className="flex items-center">
                                <input type="radio" className="h-4 w-4 text-blue-600" disabled />
                                <label className="ml-3 text-base text-gray-700">{option}</label>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h5 className="text-base font-medium text-gray-900 mb-4">2. Do you have any chronic medical conditions?</h5>
                          <textarea 
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-base"
                            rows={4}
                            placeholder="Please list any conditions..."
                            disabled
                          ></textarea>
                        </div>

                        <div>
                          <h5 className="text-base font-medium text-gray-900 mb-4">3. Are you currently taking any medications?</h5>
                          <div className="space-y-3">
                            {[
                              'Prescription medications',
                              'Over-the-counter medications',
                              'Supplements/Vitamins'
                            ].map((option) => (
                              <div key={option} className="flex items-center">
                                <input type="checkbox" className="h-4 w-4 text-blue-600 rounded" disabled />
                                <label className="ml-3 text-base text-gray-700">{option}</label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">Select a form to preview</p>
                )}
              </div>

              {selectedForm && (
                <div className="p-6 border-t border-gray-200">
                  <button
                    onClick={handleSend}
                    className="w-full bg-[#4475F2] text-white py-3 px-4 rounded-xl text-base font-medium hover:bg-blue-600 transition-colors"
                  >
                    Send to Patient
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SendFormModal; 