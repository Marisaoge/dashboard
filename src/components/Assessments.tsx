import React, { useState } from 'react';
import { 
  Search, 
  Bell,
  MoreHorizontal,
  ChevronDown,
  X
} from 'lucide-react';

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
  questions: Question[];
}

const Assessments: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>({
    id: '1',
    title: 'Duke Activity Status Index (DASI)',
    createdBy: 'Joe Smith',
    dateCompleted: '3/1/2025',
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
      },
      {
        id: 4,
        text: 'Can you climb a flight of stairs or walk up a hill?',
        answer: 'Yes',
        score: 5.50
      },
      {
        id: 5,
        text: 'Can you run a short distance?',
        answer: 'Yes',
        score: 8
      },
      {
        id: 6,
        text: 'Can you do light work around the house like dusting or washing dishes?',
        answer: 'Yes',
        score: 2.7
      },
      {
        id: 7,
        text: 'Can you do moderate work around the house like vacuuming, sweeping floors, or carrying in groceries?',
        answer: 'Yes',
        score: 3.5
      },
      {
        id: 8,
        text: 'Can you do heavy work around the house like scrubbing floors or lifting and moving heavy furniture?',
        answer: 'Yes',
        score: 8
      },
      {
        id: 9,
        text: 'Can you do yard work like raking leaves, weeding, or pushing a power mower?',
        answer: 'Yes',
        score: 4.5
      },
      {
        id: 10,
        text: 'Can you have sexual relations?',
        answer: 'Yes',
        score: 5.25
      }
    ]
  });

  const assessments = [
    {
      id: '1',
      title: 'Assessment Form 2 Final',
      date: '10/22/2024',
      type: 'RS',
      category: 'Intake Form'
    },
    {
      id: '2',
      title: 'Duke Activity Status Index',
      date: '10/22/2024',
      type: 'RS',
      category: 'Intake Form'
    },
    {
      id: '3',
      title: 'Net Promoter Score (NPS)',
      date: '10/22/2024',
      type: 'RS',
      category: 'Intake Form'
    },
    {
      id: '4',
      title: 'General Anxiety Disorder',
      date: '10/22/2024',
      type: 'RS',
      category: 'Intake Form'
    },
    {
      id: '5',
      title: 'Patient Health Questionnaire',
      date: '10/22/2024',
      type: 'RS',
      category: 'Intake Form'
    },
    {
      id: '6',
      title: 'Patient Health Questionnaire',
      date: '09/26/2024',
      type: 'RS',
      category: 'Intake Form'
    },
    {
      id: '7',
      title: 'Duke Activity Status Index',
      date: '09/26/2024',
      type: 'RS',
      category: 'Intake Form'
    },
    {
      id: '8',
      title: 'General Anxiety Disorder',
      date: '09/26/2024',
      type: 'RS',
      category: 'Intake Form'
    },
    {
      id: '9',
      title: 'MO - Graduation Summary',
      date: '05/24/2024',
      type: 'MO',
      category: 'Charting Note'
    },
    {
      id: '10',
      title: 'User Exercise Tracker',
      date: '05/13/2024',
      type: 'RS',
      category: 'Charting Note'
    }
  ];

  const filteredAssessments = assessments.filter(assessment =>
    assessment.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen">
      {/* Left Sidebar */}
      <div className="w-80 border-r border-gray-200 bg-white overflow-y-auto">
        <div className="p-4">
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
              className="p-4 hover:bg-gray-50 cursor-pointer"
              onClick={() => setSelectedAssessment(selectedAssessment)}
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
      {selectedAssessment && (
        <div className="flex-1 bg-white overflow-y-auto">
          <div className="border-b border-gray-200">
            <div className="p-4 flex justify-between items-start">
              <h1 className="text-2xl font-bold">{selectedAssessment.title}</h1>
              <div className="relative">
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <span className="sr-only">Options</span>
                  <MoreHorizontal className="h-5 w-5 text-gray-500" />
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 hidden">
                  <div className="py-1">
                    <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Edit</button>
                    <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Duplicate</button>
                    <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Share</button>
                    <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Delete</button>
                  </div>
                </div>
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
              <div key={question.id} className="mb-6">
                <div className="flex items-start">
                  <span className="text-gray-700 mr-2">{index + 1}.</span>
                  <div className="flex-1">
                    <p className="text-gray-700 mb-2">{question.text}</p>
                    <div className="flex items-center">
                      <span className="text-gray-900 font-medium">{question.answer}</span>
                      <span className="ml-2 text-gray-500">[{question.score}]</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Assessments;