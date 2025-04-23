import React, { useState } from 'react';
import { MoreVertical } from 'lucide-react';
import { generateAssessmentPDF } from '../utils/pdfGenerator';

interface AssessmentFormProps {
  title: string;
  createdBy: string;
  dateCompleted: string;
  questions: {
    id: number;
    question: string;
    answer: string;
    score?: number;
  }[];
  onDelete: () => void;
  onEdit: () => void;
  onDownload: () => void;
}

const AssessmentForm: React.FC<AssessmentFormProps> = ({
  title,
  createdBy,
  dateCompleted,
  questions,
  onDelete,
  onEdit,
  onDownload,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedQuestions, setEditedQuestions] = useState(questions);

  const handleEdit = () => {
    setIsEditing(true);
    setShowMenu(false);
    onEdit();
  };

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save the changes to your backend
    console.log('Saving changes:', editedQuestions);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedQuestions(questions);
  };

  const handleAnswerChange = (id: number, newAnswer: string) => {
    setEditedQuestions(prev =>
      prev.map(q => q.id === id ? { ...q, answer: newAnswer } : q)
    );
  };

  const handleDelete = () => {
    setShowMenu(false);
    onDelete();
  };

  const handleDownload = () => {
    setShowMenu(false);
    generateAssessmentPDF(title, createdBy, dateCompleted, questions);
    onDownload();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 relative">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">{title}</h2>
          <p className="text-sm text-gray-600">
            Created by: {createdBy} • Date completed: {dateCompleted}
          </p>
        </div>
        
        {!isEditing && (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <MoreVertical className="h-5 w-5 text-gray-600" />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                <button
                  onClick={handleEdit}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Edit
                </button>
                <button
                  onClick={handleDownload}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Download as PDF
                </button>
                <button
                  onClick={handleDelete}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="space-y-6">
        {(isEditing ? editedQuestions : questions).map((q) => (
          <div key={q.id} className="border-b border-gray-100 pb-4 last:border-b-0">
            <p className="font-medium mb-2">{q.id}. {q.question}</p>
            <div className="flex items-center gap-2">
              {isEditing ? (
                <input
                  type="text"
                  value={q.answer}
                  onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <p className="text-gray-800">
                  {q.answer}
                  {q.score !== undefined && ` [${q.score}]`}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {isEditing && (
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
};

export default AssessmentForm; 