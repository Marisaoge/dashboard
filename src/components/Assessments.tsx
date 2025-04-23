import React, { useState } from 'react';
import { 
  Search, 
  Bell,
  MoreHorizontal,
  ChevronDown,
  X,
  Edit2,
  Check
} from 'lucide-react';
import { generateAssessmentPDF } from '../utils/pdfGenerator';

interface Question {
  id: number;
  text: string;
  answer: string;
  score: number;
}

interface Assessment {
  id: string;
  title: string;
  createdBy: string;
  dateCompleted: string;
  type: string;
  category: string;
  date: string;
  questions: Question[];
}

interface AssessmentsProps {
  patient: {
    id: string;
    name: string;
    // Add other patient properties as needed
  };
}

const Assessments: React.FC<AssessmentsProps> = ({ patient }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<{ id: number, answer: string } | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const assessments: Assessment[] = [
    {
      id: '1',
      title: 'Assessment Form 2 Final',
      date: '10/22/2024',
      type: 'RS',
      category: 'Intake Form',
      createdBy: 'Dr. Smith',
      dateCompleted: '10/22/2024',
      questions: [
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
        },
        {
          id: 3,
          text: 'How often do you exercise per week?',
          answer: '2-3 times',
          score: 2
        }
      ]
    },
    {
      id: '2',
      title: 'Duke Activity Status Index',
      date: '10/22/2024',
      type: 'RS',
      category: 'Intake Form',
      createdBy: 'Joe Smith',
      dateCompleted: '10/22/2024',
      questions: [
        {
          id: 1,
          text: 'Can you take care of yourself (eating, dressing, bathing, or using the toilet)?',
          answer: 'Yes',
          score: 2.75
        },
        {
          id: 2,
          text: 'Can you walk indoors such as around your house?',
          answer: 'Yes',
          score: 1.75
        },
        {
          id: 3,
          text: 'Can you walk a block or two on level ground?',
          answer: 'Yes',
          score: 2.75
        }
      ]
    },
    {
      id: '3',
      title: 'Net Promoter Score (NPS)',
      date: '10/22/2024',
      type: 'RS',
      category: 'Intake Form',
      createdBy: 'Hannah Wright',
      dateCompleted: '10/22/2024',
      questions: [
        {
          id: 1,
          text: 'How likely are you to recommend our service to others?',
          answer: '9',
          score: 9
        },
        {
          id: 2,
          text: 'What is the primary reason for your score?',
          answer: 'Great customer service and helpful staff',
          score: 0
        }
      ]
    },
    {
      id: '4',
      title: 'General Anxiety Disorder',
      date: '10/22/2024',
      type: 'RS',
      category: 'Intake Form',
      createdBy: 'Dr. Johnson',
      dateCompleted: '10/22/2024',
      questions: [
        {
          id: 1,
          text: 'Feeling nervous, anxious, or on edge',
          answer: 'Several days',
          score: 1
        },
        {
          id: 2,
          text: 'Not being able to stop or control worrying',
          answer: 'Not at all',
          score: 0
        },
        {
          id: 3,
          text: 'Trouble relaxing',
          answer: 'Several days',
          score: 1
        }
      ]
    }
  ];

  const filteredAssessments = assessments.filter(assessment =>
    assessment.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteAssessment = () => {
    if (selectedAssessment) {
      // Filter out the deleted assessment
      const updatedAssessments = assessments.filter(a => a.id !== selectedAssessment.id);
      // Reset selected assessment
      setSelectedAssessment(null);
      setShowDeleteConfirm(false);
      // Here you would typically make an API call to delete the assessment
      console.log('Deleting assessment:', selectedAssessment.id);
    }
  };

  const handleSaveAnswer = (questionId: number, newAnswer: string) => {
    if (selectedAssessment) {
      const updatedAssessment = {
        ...selectedAssessment,
        questions: selectedAssessment.questions.map(q =>
          q.id === questionId ? { ...q, answer: newAnswer } : q
        )
      };
      setSelectedAssessment(updatedAssessment);
      setEditingQuestion(null);
      // Here you would typically make an API call to update the answer
      console.log('Updating answer:', { questionId, newAnswer });
    }
  };

  const handleDownloadPDF = (assessment: Assessment) => {
    generateAssessmentPDF(
      assessment.title,
      assessment.createdBy,
      assessment.dateCompleted,
      assessment.questions.map(q => ({
        id: q.id,
        question: q.text,
        answer: q.answer,
        score: q.score
      }))
    );
  };

  return (
    <div className="flex h-screen">
      {/* Left Sidebar */}
      <div className="w-80 border-r border-gray-200 bg-white overflow-y-auto">
        <div className="p-4">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Completed Forms</h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Search forms"
              className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-2 top-2.5 h-5 w-5 text-gray-400" />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-2.5 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredAssessments.map((assessment) => (
            <div 
              key={assessment.id}
              className={`p-4 hover:bg-gray-50 cursor-pointer ${
                selectedAssessment?.id === assessment.id ? 'bg-gray-50' : ''
              }`}
              onClick={() => setSelectedAssessment(assessment)}
            >
              <div className="flex items-start mb-1">
                <div className="p-2 bg-blue-100 rounded">
                  <svg className="h-5 w-5 text-blue-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M13 2v7h7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="ml-3 flex-1">
                  <h3 className="text-sm font-medium text-gray-900">{assessment.title}</h3>
                  <div className="flex items-center mt-1">
                    <span className="text-xs text-gray-500">{assessment.date}</span>
                    <span className="mx-1 text-gray-300">•</span>
                    <span className="text-xs px-1.5 py-0.5 bg-gray-100 rounded">{assessment.type}</span>
                    <span className="mx-1 text-gray-300">•</span>
                    <span className="text-xs text-gray-500">{assessment.category}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      {selectedAssessment ? (
        <div className="flex-1 bg-white overflow-y-auto">
          <div className="border-b border-gray-200">
            <div className="p-4 flex justify-between items-start">
              <h1 className="text-lg font-medium text-gray-900">{selectedAssessment.title}</h1>
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <MoreHorizontal className="h-5 w-5 text-gray-600" />
                </button>
                
                {showMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        setEditingQuestion({ id: selectedAssessment.questions[0].id, answer: selectedAssessment.questions[0].answer });
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        handleDownloadPDF(selectedAssessment);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Download as PDF
                    </button>
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        setShowDeleteConfirm(true);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="px-4 pb-4">
              <p className="text-sm text-gray-600">
                Created by: {selectedAssessment.createdBy} 
                <span className="mx-2">•</span>
                Date completed: {selectedAssessment.dateCompleted}
              </p>
            </div>
          </div>

          <div className="p-6">
            {selectedAssessment.questions.map((question, index) => (
              <div 
                key={question.id} 
                className="mb-6 group/item hover:bg-gray-50 p-3 rounded-lg transition-colors"
              >
                <div className="flex items-start">
                  <span className="text-gray-700 mr-2">{index + 1}.</span>
                  <div className="flex-1">
                    <p className="text-gray-700 mb-2">{question.text}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {editingQuestion?.id === question.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={editingQuestion.answer}
                              onChange={(e) => setEditingQuestion({ id: question.id, answer: e.target.value })}
                              className="border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              autoFocus
                            />
                            <button
                              onClick={() => handleSaveAnswer(question.id, editingQuestion.answer)}
                              className="text-green-600 hover:text-green-700 p-1"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setEditingQuestion(null)}
                              className="text-red-600 hover:text-red-700 p-1"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-gray-900 font-medium">{question.answer}</span>
                            {question.score > 0 && (
                              <span className="ml-2 text-gray-500">[{question.score}]</span>
                            )}
                            <button
                              onClick={() => setEditingQuestion({ id: question.id, answer: question.answer })}
                              className="opacity-0 group-hover/item:opacity-100 transition-opacity p-1 text-gray-400 hover:text-gray-600"
                            >
                              <Edit2 className="h-3 w-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 bg-gray-50 flex items-center justify-center">
          <p className="text-gray-500">Select a form to view its details</p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Delete Assessment</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this assessment? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAssessment}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Assessments;