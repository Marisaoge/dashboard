import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plus,
  ChevronDown,
  ChevronRight,
  FileText,
  Send,
  Clock,
  CheckCircle2,
  ChevronUp
} from 'lucide-react';
import SendFormModal from './SendFormModal';
import AssignProgramModal from './AssignProgramModal';

interface Question {
  id: number;
  text: string;
  answer?: string;
  score?: number;
}

interface ProgramForm {
  id: string;
  title: string;
  status: 'pending' | 'completed';
  assignedDate: string;
  completedDate?: string;
  responses?: Question[];
}

interface FormProgram {
  id: string;
  name: string;
  assignedDate: string;
  status: 'active' | 'completed' | 'archived';
  forms: ProgramForm[];
}

interface AssessmentsProps {
  patient: {
    id: string;
    name: string;
  };
}

const Assessments: React.FC<AssessmentsProps> = ({ patient }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProgram, setSelectedProgram] = useState<FormProgram | null>(null);
  const [selectedForm, setSelectedForm] = useState<ProgramForm | null>(null);
  const [showSendFormModal, setShowSendFormModal] = useState(false);
  const [showAssignProgramModal, setShowAssignProgramModal] = useState(false);

  // Sample data - would come from API
  const programs: FormProgram[] = [
    {
      id: '1',
      name: 'Motiv Program Template - LIVE (new pts as of 7/16/2024)',
      assignedDate: '07/16/2024',
      status: 'active',
      forms: [
        {
          id: '1',
          title: 'Initial Health Assessment',
          status: 'completed',
          assignedDate: '07/16/2024',
          completedDate: '07/17/2024',
          responses: [
            {
              id: 1,
              text: 'How would you rate your overall health?',
              answer: 'Good',
              score: 3
            },
            {
              id: 2,
              text: 'Do you experience any chronic pain?',
              answer: 'Yes - Moderate',
              score: 2
            }
          ]
        },
        {
          id: '2',
          title: 'PHQ-9 Depression Screening',
          status: 'pending',
          assignedDate: '07/16/2024'
        }
      ]
    },
    {
      id: '2',
      name: 'Initial Assessment Program',
      assignedDate: '01/15/2024',
      status: 'completed',
      forms: [
        {
          id: '3',
          title: 'Basic Health Questionnaire',
          status: 'completed',
          assignedDate: '01/15/2024',
          completedDate: '01/16/2024'
        }
      ]
    }
  ];

  // Find and set the active program by default
  useEffect(() => {
    const activeProgram = programs.find(p => p.status === 'active');
    if (activeProgram) {
      setSelectedProgram(activeProgram);
    }
  }, []);

  const filteredPrograms = programs.map(program => ({
    ...program,
    forms: program.forms.filter(form =>
      form.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(program => 
    program.forms.length > 0 || program.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendForm = (formId: string) => {
    console.log('Sending form:', formId, 'to patient:', patient.id);
    setShowSendFormModal(false);
  };

  const handleAssignProgram = (programId: string) => {
    // Here you would typically make an API call to assign the program
    console.log('Assigning program:', programId, 'to patient:', patient.id);
    setShowAssignProgramModal(false);
  };

  return (
    <div className="h-full flex">
      {/* Left Column */}
      <div className="w-[320px] min-w-[320px] border-r border-gray-200 overflow-y-auto">
        <div className="space-y-6 pr-6">
          <div>
            <h2 className="text-lg font-medium text-gray-900">Assessments</h2>
            <div className="mt-4 flex items-center justify-between">
              <div className="relative flex-1 max-w-[240px]">
                <input
                  type="text"
                  placeholder="Search forms..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-4 py-2 pl-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              <button
                onClick={() => setShowAssignProgramModal(true)}
                className="flex items-center justify-center p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {/* Programs List */}
            <div>
              <h3 className="mb-4 text-sm font-medium text-gray-700">Active Programs</h3>
              <div className="space-y-4">
                {filteredPrograms.map((program) => (
                  <div
                    key={program.id}
                    className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{program.name}</h4>
                        <div className="mt-1 flex items-center space-x-2">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${program.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {program.status === 'active' ? 'Active' : 'Completed'}
                          </span>
                          <span className="text-sm text-gray-500">Assigned {program.assignedDate}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedProgram(selectedProgram?.id === program.id ? null : program)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        {selectedProgram?.id === program.id ? (
                          <ChevronUp className="h-5 w-5" />
                        ) : (
                          <ChevronDown className="h-5 w-5" />
                        )}
                      </button>
                    </div>

                    {selectedProgram?.id === program.id && (
                      <div className="mt-4 space-y-4">
                        {program.forms.map((form) => (
                          <button
                            key={form.id}
                            onClick={() => setSelectedForm(form)}
                            className="w-full bg-gray-50 rounded-lg p-3 border border-gray-200 hover:border-gray-300"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <FileText className="h-5 w-5 text-gray-400" />
                                <div className="text-left">
                                  <div className="text-sm font-medium text-gray-900">{form.title}</div>
                                  <div className="text-xs text-gray-500">
                                    {form.status === 'completed' ? 'Completed' : 'Pending'}
                                  </div>
                                </div>
                              </div>
                              <ChevronRight className="h-5 w-5 text-gray-400" />
                            </div>
                          </button>
                        ))}
                        
                        {program.status === 'active' && (
                          <button
                            onClick={() => setShowSendFormModal(true)}
                            className="w-full flex items-center justify-center gap-2 p-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg"
                          >
                            <Send className="h-4 w-4" />
                            <span>Send New Form</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Form Details */}
      <div className="flex-1 overflow-y-auto bg-gray-50 pl-6 py-6">
        {selectedForm ? (
          <div className="max-w-[1800px]">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              {/* Form Header */}
              <div className="px-12 py-8 border-b border-gray-200">
                <h1 className="text-xl font-medium text-gray-900 mb-3">{selectedForm.title}</h1>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    <span>Assigned {selectedForm.assignedDate}</span>
                  </div>
                  {selectedForm.completedDate && (
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span>Completed {selectedForm.completedDate}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Form Content */}
              {selectedForm.status === 'completed' && selectedForm.responses ? (
                <div className="px-12 py-8">
                  <div className="space-y-8">
                    {selectedForm.responses.map((question, index) => (
                      <div key={question.id} className="border-b border-gray-100 last:border-0 pb-8 last:pb-0">
                        <div className="flex gap-3">
                          <span className="text-gray-400 font-medium">{index + 1}</span>
                          <div className="flex-1">
                            <p className="text-gray-900 font-medium mb-3">{question.text}</p>
                            <div className="flex items-center gap-3">
                              <span className="text-gray-600">{question.answer}</span>
                              {question.score !== undefined && (
                                <span className="text-sm px-2 py-1 bg-gray-100 rounded text-gray-600">
                                  Score: {question.score}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="px-12 py-12 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-4">
                    <Clock className="h-6 w-6 text-gray-400" />
                  </div>
                  <p className="text-gray-600 font-medium">This form is pending completion</p>
                  <p className="text-sm text-gray-500 mt-1">Check back later for responses</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-4">
                <FileText className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-gray-600 font-medium">Select a form to view responses</p>
              <p className="text-sm text-gray-500 mt-1">Choose a form from the list to see its details</p>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <SendFormModal
        isOpen={showSendFormModal}
        onClose={() => setShowSendFormModal(false)}
        onSend={handleSendForm}
      />

      <AssignProgramModal
        isOpen={showAssignProgramModal}
        onClose={() => setShowAssignProgramModal(false)}
        onAssign={handleAssignProgram}
      />
    </div>
  );
};

export default Assessments;