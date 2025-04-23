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
  TrendingUp,
  Share
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

interface CardItem {
  id: string;
  content: string;
  type?: 'PCM' | 'RPM' | 'BHI';
  notes: {
    id: string;
    date: string;
    author: string;
    content: string;
  }[];
}

interface CardData {
  type: string;
  title: string;
  items: CardItem[];
}

interface ClinicalCarePlanProps {
  patient: {
    id: string;
    name: string;
    // Add other patient properties as needed
  };
}

interface EditCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedItem: CardItem | Goal | null;
  setSelectedItem: React.Dispatch<React.SetStateAction<CardItem | Goal | null>>;
  onSave: (item: CardItem | Goal) => void;
  onDelete: (item: CardItem | Goal) => void;
}

const ClinicalCarePlan: React.FC<ClinicalCarePlanProps> = ({ patient }) => {
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [editedGoalName, setEditedGoalName] = useState('');
  const [editedGoalProgress, setEditedGoalProgress] = useState(0);
  const [editedGoalType, setEditedGoalType] = useState<'PCM' | 'RPM' | 'BHI'>('PCM');
  const [editedGoalNote, setEditedGoalNote] = useState('');
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<ActivityDetails | null>(null);
  const [activeLogTab, setActiveLogTab] = useState<'clinical' | 'system'>('clinical');
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportType, setExportType] = useState<'clinical' | 'system' | 'care-plan'>('clinical');
  const [exportFormat, setExportFormat] = useState<'pdf' | 'excel' | 'csv'>('pdf');
  const [selectedCard, setSelectedCard] = useState<{
    type: string;
    title: string;
    content: string[];
  } | null>(null);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [editedCardContent, setEditedCardContent] = useState<string[]>([]);
  const [selectedItem, setSelectedItem] = useState<CardItem | Goal | null>(null);
  const [editedItemType, setEditedItemType] = useState<'PCM' | 'RPM' | 'BHI' | undefined>(undefined);
  const [editedItemNote, setEditedItemNote] = useState('');
  const [showMenu, setShowMenu] = useState<string | null>(null);

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

  const cardData: { [key: string]: CardItem[] } = {
    strengths: [
      { id: '1', content: 'Good attitude', type: 'PCM', notes: [] },
      { id: '2', content: 'Making changes with exercise', type: 'RPM', notes: [] }
    ],
    barriers: [
      { id: '1', content: 'Has knee pain that limits activity', type: 'PCM', notes: [
        { id: '1', date: '2024-03-15', author: 'Dr. Smith', content: 'Referred to physical therapy' }
      ] },
      { id: '2', content: 'Little time for self-care due to work', type: undefined, notes: [] }
    ],
    riskFactors: [
      { id: '1', content: 'Family history of cardiovascular disease', type: 'PCM', notes: [] },
      { id: '2', content: 'Hypertension - poorly controlled', type: 'RPM', notes: [] },
      { id: '3', content: 'Stress from caregiving responsibilities', type: 'BHI', notes: [] }
    ],
    expectedOutcomes: [
      { id: '1', content: 'Maintain BP below 130/80', type: 'RPM', notes: [] },
      { id: '2', content: 'Reduce stress through regular exercise', type: 'PCM', notes: [] },
      { id: '3', content: 'Improve medication adherence to 90%', type: 'PCM', notes: [] }
    ],
    motivation: [
      { id: '1', content: 'Wants to be healthy for grandchildren', type: 'PCM', notes: [] },
      { id: '2', content: 'Interested in returning to gardening', type: 'BHI', notes: [] },
      { id: '3', content: 'Committed to making lifestyle changes', type: undefined, notes: [] }
    ],
    lifestyle: [
      { id: '1', content: 'Enjoys flower arranging and volunteering', type: 'BHI', notes: [] },
      { id: '2', content: 'Former avid gardener', type: undefined, notes: [] },
      { id: '3', content: 'Likes walking with friends', type: 'PCM', notes: [] }
    ]
  };

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

  const handleCardClick = (type: string, title: string, content: string[]) => {
    setSelectedCard({ type, title, content });
    setEditedCardContent(content);
    setIsCardModalOpen(true);
  };

  const handleSaveCard = () => {
    if (!selectedCard) return;
    console.log('Saving card:', {
      type: selectedCard.type,
      title: selectedCard.title,
      content: editedCardContent
    });
    setIsCardModalOpen(false);
  };

  const handleItemClick = (item: CardItem | Goal, cardType: string, cardTitle: string) => {
    setSelectedItem(item);
    setEditedItemType(item.type);
    setEditedItemNote('');
    setIsCardModalOpen(true);
  };

  const handleSaveItem = () => {
    if (!selectedItem) return;
    
    const updatedItem = {
      ...selectedItem,
      type: editedItemType,
      notes: editedItemNote ? [
        {
          id: Date.now().toString(),
          date: new Date().toISOString().split('T')[0],
          author: 'Current User',
          content: editedItemNote
        },
        ...selectedItem.notes
      ] : selectedItem.notes
    };

    console.log('Saving item:', updatedItem);
    setIsCardModalOpen(false);
  };

  const handleDeleteItem = (item: CardItem | Goal) => {
    console.log('Deleting item:', item);
    setIsCardModalOpen(false);
  };

  const CardItem: React.FC<{
    item: CardItem;
    cardType: string;
    cardTitle: string;
  }> = ({ item, cardType, cardTitle }) => {
    const [showMenu, setShowMenu] = useState(false);

    return (
      <div 
        className="group/item flex items-center justify-between gap-2 cursor-pointer hover:bg-gray-50 py-1 px-2 rounded-lg transition-colors relative"
        onMouseEnter={() => setShowMenu(true)}
        onMouseLeave={() => setShowMenu(false)}
      >
        <div className="flex-1" onClick={() => handleItemClick(item, cardType, cardTitle)}>
          <span>{item.content}</span>
        </div>
        {showMenu && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleItemClick(item, cardType, cardTitle)}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              <Edit2 className="h-3 w-3" />
            </button>
          </div>
        )}
      </div>
    );
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

  const EditCardModal: React.FC<EditCardModalProps> = ({
    isOpen,
    onClose,
    selectedItem,
    setSelectedItem,
    onSave,
    onDelete,
  }) => {
    if (!selectedItem) return null;

    const isGoal = 'name' in selectedItem;
    const content = isGoal ? selectedItem.name : selectedItem.content;
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    return (
      <div className="fixed inset-0 z-[9999] overflow-y-auto">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
        <div className="relative min-h-screen flex items-center justify-center p-4">
          <div className="relative bg-white rounded-lg w-full max-w-lg">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Edit {isGoal ? 'Goal' : 'Item'}</h2>
                <button
                  onClick={onClose}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isGoal ? 'Goal Name' : 'Content'}
                  </label>
                  <input
                    type="text"
                    value={content}
                    onChange={(e) => {
                      if (isGoal) {
                        setSelectedItem({ ...selectedItem, name: e.target.value });
                      } else {
                        setSelectedItem({ ...selectedItem, content: e.target.value });
                      }
                    }}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type
                  </label>
                  <div className="flex gap-4">
                    {['PCM', 'RPM', 'BHI'].map((type) => (
                      <button
                        key={type}
                        onClick={() => {
                          if (isGoal) {
                            setSelectedItem({ ...selectedItem, type: type as 'PCM' | 'RPM' | 'BHI' });
                          } else {
                            setSelectedItem({ ...selectedItem, type: type as 'PCM' | 'RPM' | 'BHI' });
                          }
                        }}
                        className={`px-4 py-2 rounded-lg ${
                          selectedItem.type === type
                            ? 'bg-gray-200 text-gray-900'
                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {isGoal && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <div className="flex gap-4">
                      {['in-progress', 'completed'].map((status) => (
                        <button
                          key={status}
                          onClick={() => {
                            setSelectedItem({ ...selectedItem, status: status as 'in-progress' | 'completed' });
                          }}
                          className={`px-4 py-2 rounded-lg ${
                            selectedItem.status === status
                              ? 'bg-gray-200 text-gray-900'
                              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {status === 'in-progress' ? 'In Progress' : 'Completed'}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Add Note
                  </label>
                  <textarea
                    value={editedItemNote}
                    onChange={(e) => setEditedItemNote(e.target.value)}
                    placeholder="Add a note about this item..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32 resize-none"
                  />
                </div>

                {selectedItem.notes.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Previous Notes</h3>
                    <div className="space-y-2">
                      {selectedItem.notes.map((note) => (
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

              <div className="flex justify-between space-x-3 mt-6">
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-4 py-2 text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50"
                >
                  Delete
                </button>
                <div className="flex space-x-3">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => onSave(selectedItem)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Delete {isGoal ? 'Goal' : 'Item'}</h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this {isGoal ? 'goal' : 'item'}? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onDelete(selectedItem);
                    onClose();
                  }}
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

  return (
    <div className="space-y-6">
      {/* First row - 3 cards */}
      <div className="grid grid-cols-3 gap-4">
        {/* Patient Goals */}
        <div className="bg-white p-4 rounded-lg shadow group">
          <h3 className="font-medium mb-2">Patient Goals</h3>
          <div className="space-y-1">
            {goals.map((goal) => (
              <div
                key={goal.id}
                className="group/item flex items-center gap-3 w-full text-left hover:bg-gray-50 py-1 px-2 rounded-lg transition-colors relative"
                onMouseEnter={() => setShowMenu(goal.id)}
                onMouseLeave={() => setShowMenu(null)}
              >
                <div className="flex items-center gap-3 flex-1" onClick={() => handleGoalClick(goal)}>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    goal.status === 'completed' ? 'border-green-500' : 'border-blue-500'
                  }`}>
                    {goal.status === 'completed' ? (
                      <CheckCircle className="h-3 w-3 text-green-500" />
                    ) : (
                      <Clock className="h-3 w-3 text-blue-500" />
                    )}
                  </div>
                  <span>{goal.name}</span>
                </div>
                {showMenu === goal.id && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleGoalClick(goal)}
                      className="text-gray-400 hover:text-gray-600 p-1"
                    >
                      <Edit2 className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>
            ))}
            <button
              onClick={() => handleGoalClick({ id: 'new', name: '', status: 'in-progress', progress: 0, type: 'PCM', notes: [] })}
              className="w-full text-left py-1 px-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 text-sm"
            >
              Add new goal...
            </button>
          </div>
        </div>

        {/* Patient Strengths */}
        <div className="bg-white p-4 rounded-lg shadow group">
          <h3 className="font-medium mb-2">Patient Strengths</h3>
          <div className="space-y-1">
            {cardData.strengths.map((item) => (
              <CardItem
                key={item.id}
                item={item}
                cardType="strengths"
                cardTitle="Patient Strengths"
              />
            ))}
            <button
              onClick={() => handleItemClick({ id: 'new', content: '', notes: [] }, 'strengths', 'Patient Strengths')}
              className="w-full text-left py-1 px-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 text-sm"
            >
              Add new strength...
            </button>
          </div>
        </div>

        {/* Patient Barriers */}
        <div className="bg-white p-4 rounded-lg shadow group">
          <h3 className="font-medium mb-2">Patient Barriers</h3>
          <div className="space-y-1">
            {cardData.barriers.map((item) => (
              <CardItem
                key={item.id}
                item={item}
                cardType="barriers"
                cardTitle="Patient Barriers"
              />
            ))}
            <button
              onClick={() => handleItemClick({ id: 'new', content: '', notes: [] }, 'barriers', 'Patient Barriers')}
              className="w-full text-left py-1 px-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 text-sm"
            >
              Add new barrier...
            </button>
          </div>
        </div>
      </div>

      {/* Second row - 4 cards */}
      <div className="grid grid-cols-4 gap-4">
        {/* Risk Factors */}
        <div className="bg-white p-4 rounded-lg shadow group">
          <h3 className="font-medium mb-2">Risk Factors</h3>
          <div className="space-y-1">
            {cardData.riskFactors?.map((item) => (
              <CardItem
                key={item.id}
                item={item}
                cardType="riskFactors"
                cardTitle="Risk Factors"
              />
            ))}
            <button
              onClick={() => handleItemClick({ id: 'new', content: '', notes: [] }, 'riskFactors', 'Risk Factors')}
              className="w-full text-left py-1 px-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 text-sm"
            >
              Add new risk factor...
            </button>
          </div>
        </div>

        {/* Patient Expected Health Outcomes */}
        <div className="bg-white p-4 rounded-lg shadow group">
          <h3 className="font-medium mb-2">Patient Expected Health Outcomes</h3>
          <div className="space-y-1">
            {cardData.expectedOutcomes?.map((item) => (
              <CardItem
                key={item.id}
                item={item}
                cardType="expectedOutcomes"
                cardTitle="Patient Expected Health Outcomes"
              />
            ))}
            <button
              onClick={() => handleItemClick({ id: 'new', content: '', notes: [] }, 'expectedOutcomes', 'Patient Expected Health Outcomes')}
              className="w-full text-left py-1 px-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 text-sm"
            >
              Add new outcome...
            </button>
          </div>
        </div>

        {/* Patient Motivation/Wellness Vision */}
        <div className="bg-white p-4 rounded-lg shadow group">
          <h3 className="font-medium mb-2">Patient Motivation/Wellness Vision</h3>
          <div className="space-y-1">
            {cardData.motivation?.map((item) => (
              <CardItem
                key={item.id}
                item={item}
                cardType="motivation"
                cardTitle="Patient Motivation/Wellness Vision"
              />
            ))}
            <button
              onClick={() => handleItemClick({ id: 'new', content: '', notes: [] }, 'motivation', 'Patient Motivation/Wellness Vision')}
              className="w-full text-left py-1 px-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 text-sm"
            >
              Add new motivation...
            </button>
          </div>
        </div>

        {/* Patient Lifestyle/Hobbies */}
        <div className="bg-white p-4 rounded-lg shadow group">
          <h3 className="font-medium mb-2">Patient Lifestyle/Hobbies</h3>
          <div className="space-y-1">
            {cardData.lifestyle?.map((item) => (
              <CardItem
                key={item.id}
                item={item}
                cardType="lifestyle"
                cardTitle="Patient Lifestyle/Hobbies"
              />
            ))}
            <button
              onClick={() => handleItemClick({ id: 'new', content: '', notes: [] }, 'lifestyle', 'Patient Lifestyle/Hobbies')}
              className="w-full text-left py-1 px-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 text-sm"
            >
              Add new hobby...
            </button>
          </div>
        </div>
      </div>

      {/* Activity Log Section */}
      <h2 className="text-xl font-semibold mb-4">Activity Log</h2>
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-6 border-b border-gray-200">
            <button
              className={`py-4 px-1 text-sm font-medium border-b-2 ${
                activeLogTab === 'clinical'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveLogTab('clinical')}
            >
              Clinical
            </button>
            <button
              className={`py-4 px-1 text-sm font-medium border-b-2 ${
                activeLogTab === 'system'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveLogTab('system')}
            >
              System
            </button>
          </div>
          <div className="flex space-x-4">
            <button 
              onClick={() => setShowExportModal(true)}
              className="bg-white text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center border border-gray-200"
            >
              <Share className="h-4 w-4 mr-2" />
              Export
            </button>
            <button 
              onClick={() => setShowAddActivity(true)}
              className="h-10 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 text-sm font-medium"
            >
              <Plus className="h-4 w-4" />
              Add Activity
            </button>
          </div>
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

      {/* Card Edit Modal */}
      {isCardModalOpen && (
        <EditCardModal
          isOpen={isCardModalOpen}
          onClose={() => setIsCardModalOpen(false)}
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
          onSave={handleSaveItem}
          onDelete={handleDeleteItem}
        />
      )}

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

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] fixed-center" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, margin: 0 }}>
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative" style={{ margin: 'auto' }}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Export Data</h2>
              <button
                onClick={() => setShowExportModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Data to Export
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="exportType"
                      value="clinical"
                      checked={exportType === 'clinical'}
                      onChange={(e) => setExportType(e.target.value as 'clinical' | 'system' | 'care-plan')}
                      className="h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2">Clinical Log</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="exportType"
                      value="system"
                      checked={exportType === 'system'}
                      onChange={(e) => setExportType(e.target.value as 'clinical' | 'system' | 'care-plan')}
                      className="h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2">System Log</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="exportType"
                      value="care-plan"
                      checked={exportType === 'care-plan'}
                      onChange={(e) => setExportType(e.target.value as 'clinical' | 'system' | 'care-plan')}
                      className="h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2">Care Plan</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select File Format
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="exportFormat"
                      value="pdf"
                      checked={exportFormat === 'pdf'}
                      onChange={(e) => setExportFormat(e.target.value as 'pdf' | 'excel' | 'csv')}
                      className="h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2">PDF</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="exportFormat"
                      value="excel"
                      checked={exportFormat === 'excel'}
                      onChange={(e) => setExportFormat(e.target.value as 'pdf' | 'excel' | 'csv')}
                      className="h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2">Excel</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="exportFormat"
                      value="csv"
                      checked={exportFormat === 'csv'}
                      onChange={(e) => setExportFormat(e.target.value as 'pdf' | 'excel' | 'csv')}
                      className="h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2">CSV</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowExportModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    console.log('Exporting:', { type: exportType, format: exportFormat });
                    setShowExportModal(false);
                  }}
                  className="h-10 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center text-sm font-medium"
                >
                  Export
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClinicalCarePlan;