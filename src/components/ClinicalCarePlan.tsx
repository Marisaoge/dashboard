import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus,
  Clock,
  AlertCircle,
  Activity,
  X,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  CheckCircle,
  Edit2,
  Filter,
  TrendingUp
} from 'lucide-react';
import AddActivity from './AddActivity';

interface Goal {
  id: string;
  name: string;
  status: 'completed' | 'in-progress';
  progress: number;
  type: 'PCM' | 'RPM' | 'BHI';
  notes: {
    id: string;
    date: string;
    author: string;
    content: string;
  }[];
}

interface ActivityDetails {
  type: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: string;
  bpDiscussionTime: string;
  summary: string;
  author: string;
}

const ClinicalCarePlan: React.FC = () => {
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [editedGoalName, setEditedGoalName] = useState('');
  const [editedGoalProgress, setEditedGoalProgress] = useState(0);
  const [editedGoalType, setEditedGoalType] = useState<'PCM' | 'RPM' | 'BHI'>('PCM');
  const [editedGoalNote, setEditedGoalNote] = useState('');
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<ActivityDetails | null>(null);
  const [activeLogTab, setActiveLogTab] = useState<'clinical' | 'system'>('clinical');

  const activityDetails: ActivityDetails = {
    type: 'EP Follow-up (by month)',
    date: '3/18/2025',
    startTime: '2:15:30pm',
    endTime: '3:02:18pm',
    duration: '46 minutes and 48 seconds',
    bpDiscussionTime: '2 minutes and 54 seconds',
    summary: "Patient expressed feeling stressed and overwhelmed about caring for her adult daughter who has mental health challenges. Patient is struggling to set boundaries and feels consumed by her daughter's needs. Patient is experiencing headaches, tension, and difficulty sleeping due to the stress. Coach encouraged patient to consider setting small boundaries and focusing on self-care. Patient mentioned volunteering with flower arranging which she enjoys. Coach suggested patient try to incorporate more activities she enjoys to help manage stress.",
    author: 'Hannah Wright'
  };

  const goals: Goal[] = [
    {
      id: '1',
      name: 'Improve Blood Pressure Management',
      status: 'in-progress',
      progress: 10,
      type: 'PCM',
      notes: []
    },
    {
      id: '2',
      name: 'Increase Physical Activity',
      status: 'in-progress',
      progress: 5,
      type: 'RPM',
      notes: []
    },
    {
      id: '3',
      name: 'Achieve Healthy Weight Loss',
      status: 'completed',
      progress: 4,
      type: 'RPM',
      notes: [
        {
          id: '1',
          date: '2024-02-05',
          author: 'Hannah Wright',
          content: 'Patient showing good progress with medication adherence'
        }
      ]
    }
  ];

  const clinicalLogs = [
    {
      id: '1',
      type: 'EP Follow-up',
      author: 'Hannah Wright',
      date: '2/1/25',
      time: '9:00am',
      duration: '2 minutes (RPM), 28 mins (PCM)'
    },
    {
      id: '2',
      type: 'Updated patient goals',
      author: 'Hannah Wright',
      date: '2/5/25',
      time: '10:35am',
      duration: '2 minutes (RPM)'
    }
  ];

  const systemLogs = [
    {
      id: '1',
      type: 'Added Note to patient goal',
      author: 'Hannah Wright',
      date: '2/5/25',
      time: '10:35am',
      duration: '5 minutes'
    }
  ];

  const handleGoalClick = (goal: Goal) => {
    setSelectedGoal(goal);
    setEditedGoalName(goal.name);
    setEditedGoalProgress(0);
    setEditedGoalType(goal.type);
    setEditedGoalNote('');
    setIsGoalModalOpen(true);
  };

  const handleSaveGoal = () => {
    if (!selectedGoal) return;

    console.log('Saving goal:', {
      ...selectedGoal,
      name: editedGoalName,
      progress: editedGoalProgress,
      type: editedGoalType,
      notes: editedGoalNote ? [
        {
          id: Date.now().toString(),
          date: new Date().toISOString().split('T')[0],
          author: 'Current User',
          content: editedGoalNote
        },
        ...selectedGoal.notes
      ] : selectedGoal.notes
    });

    setIsGoalModalOpen(false);
  };

  const handleAddActivity = (activityData: any) => {
    console.log('New activity:', activityData);
    setShowAddActivity(false);
  };

  const handleActivityClick = () => {
    setSelectedActivity(activityDetails);
  };

  const handleSaveActivity = () => {
    console.log('Saving activity:', selectedActivity);
    setSelectedActivity(null);
  };

  const GoalModal: React.FC = () => {
    if (!selectedGoal) return null;

    const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = Number(e.target.value);
      setEditedGoalProgress(value);
      e.target.style.background = `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(value / 10) * 100}%, #e5e7eb ${(value / 10) * 100}%, #e5e7eb 100%)`;
    };

    return (
      <div className="fixed inset-0 z-[9999] overflow-y-auto">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsGoalModalOpen(false)} />
        <div className="relative min-h-screen flex items-center justify-center p-4">
          <div className="relative bg-white rounded-lg w-full max-w-lg">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Edit Goal</h2>
                <button
                  onClick={() => setIsGoalModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Goal Name
                  </label>
                  <input
                    type="text"
                    value={editedGoalName}
                    onChange={(e) => setEditedGoalName(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter goal name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Goal Progress (0-10)
                  </label>
                  <div className="relative">
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={editedGoalProgress}
                      onChange={handleProgressChange}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-blue-600 [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-blue-600 [&::-moz-range-thumb]:cursor-pointer [&::-ms-thumb]:h-4 [&::-ms-thumb]:w-4 [&::-ms-thumb]:rounded-full [&::-ms-thumb]:bg-white [&::-ms-thumb]:border-2 [&::-ms-thumb]:border-blue-600 [&::-ms-thumb]:cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(editedGoalProgress / 10) * 100}%, #e5e7eb ${(editedGoalProgress / 10) * 100}%, #e5e7eb 100%)`
                      }}
                    />
                  </div>
                  <div className="text-center mt-2 text-gray-600">
                    {editedGoalProgress} / 10
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Goal Type
                  </label>
                  <div className="flex gap-4">
                    {['PCM', 'RPM', 'BHI'].map((type) => (
                      <button
                        key={type}
                        onClick={() => setEditedGoalType(type as 'PCM' | 'RPM' | 'BHI')}
                        className={`px-6 py-3 rounded-lg ${
                          editedGoalType === type
                            ? 'bg-gray-200 text-gray-900'
                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Add Note
                  </label>
                  <textarea
                    value={editedGoalNote}
                    onChange={(e) => setEditedGoalNote(e.target.value)}
                    placeholder="Add a note about this goal..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32 resize-none"
                  />
                </div>

                {selectedGoal.notes.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Previous Notes</h3>
                    <div className="space-y-2">
                      {selectedGoal.notes.map((note) => (
                        <div key={note.id} className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex justify-between text-sm text-gray-500 mb-1">
                            <span>{note.author}</span>
                            <span>{note.date}</span>
                          </div>
                          <p className="text-sm">{note.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setIsGoalModalOpen(false)}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveGoal}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* First row - 3 cards */}
      <div className="grid grid-cols-3 gap-4">
        {/* Patient Goals */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-medium mb-4">Patient Goals</h3>
          <div className="space-y-4">
            {goals.map((goal) => (
              <button
                key={goal.id}
                className="flex items-center gap-3 w-full text-left hover:bg-gray-50 p-2 rounded-lg transition-colors"
                onClick={() => handleGoalClick(goal)}
              >
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  goal.status === 'completed' ? 'border-green-500' : 'border-blue-500'
                }`}>
                  {goal.status === 'completed' ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <Clock className="h-4 w-4 text-blue-500" />
                  )}
                </div>
                <span>{goal.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Patient Strengths */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-medium mb-4">Patient Strengths</h3>
          <ul className="list-disc list-inside space-y-2">
            <li>Good attitude</li>
            <li>Making changes with exercise</li>
          </ul>
        </div>

        {/* Patient Barriers */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-medium mb-4">Patient Barriers</h3>
          <ul className="list-disc list-inside space-y-2">
            <li>Has knee pain that limits activity</li>
            <li>Little time for self-care due to work</li>
          </ul>
        </div>
      </div>

      {/* Second row - 4 cards */}
      <div className="grid grid-cols-4 gap-4">
        {/* Risk Factors */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-medium mb-4">Risk Factors</h3>
          <ul className="list-disc list-inside space-y-2">
            <li>Hypertension (140/90 mmHg)</li>
            <li>Current smoker (1 pack/day)</li>
            <li>Family history of heart disease</li>
            <li>Sedentary lifestyle</li>
          </ul>
        </div>

        {/* Patient Expected Health Outcomes */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-medium mb-4">Patient Expected Health Outcomes</h3>
          {/* Add content here */}
        </div>

        {/* Patient Motivation/Wellness Vision */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-medium mb-4">Patient Motivation/Wellness Vision</h3>
          <p>Motivated to live as long as possible so she can see her grandchildren grow up</p>
        </div>

        {/* Patient Lifestyle/Hobbies */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-medium mb-4">Patient Lifestyle/Hobbies</h3>
          <ul className="list-disc list-inside space-y-2">
            <li>Likes walking outdoors</li>
            <li>Reading</li>
            <li>Knitting</li>
          </ul>
        </div>
      </div>

      {/* Activity Log Section */}
      <h2 className="text-xl font-semibold mb-4">Activity Log</h2>
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-4">
            <button
              className={`px-4 py-2 rounded-lg ${
                activeLogTab === 'clinical'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
              onClick={() => setActiveLogTab('clinical')}
            >
              Clinical Log
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${
                activeLogTab === 'system'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
              onClick={() => setActiveLogTab('system')}
            >
              System Log
            </button>
          </div>
          <button 
            onClick={() => setShowAddActivity(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Activity
          </button>
        </div>

        <div className="space-y-4">
          {(activeLogTab === 'clinical' ? clinicalLogs : systemLogs).map((log) => (
            <div key={log.id} className="flex items-center justify-between py-2 border-b border-gray-100">
              <div>
                <button 
                  onClick={handleActivityClick}
                  className="text-blue-600 hover:text-blue-700"
                >
                  {log.type}
                </button>
                <div className="text-sm text-gray-500">{log.author} @{log.date} {log.time}</div>
              </div>
              <div className="text-sm text-gray-500">
                {log.duration}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Goal Edit Modal */}
      {isGoalModalOpen && <GoalModal />}

      {/* Activity Details Modal */}
      {selectedActivity && (
        <AddActivity
          onClose={() => setSelectedActivity(null)}
          onSave={handleSaveActivity}
          initialValues={selectedActivity}
          readOnly={true}
        />
      )}

      {/* Add Activity Modal */}
      {showAddActivity && (
        <AddActivity
          onClose={() => setShowAddActivity(false)}
          onSave={handleAddActivity}
        />
      )}
    </div>
  );
};

export default ClinicalCarePlan;