import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  Send,
  Info,
  Phone,
  MoreHorizontal,
  Plus,
  Users,
  Calendar,
  Package,
  FileText,
  RefreshCw,
  Link2,
  Bold,
  Italic,
  Underline,
  List,
  AlignLeft,
  AlignCenter,
  AlignRight,
  HelpCircle,
  Target,
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
  Eye,
  EyeOff
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  totalOccurrences: number;
  completedOccurrences: number;
  lastCompleted?: string;
  status: 'on-track' | 'at-risk' | 'behind' | 'completed';
  frequency: 'daily' | 'weekly' | 'one-time' | 'custom';
  startWeek: number;
  endWeek: number;
  visibleInPatientApp: boolean;
  customSchedule?: {
    days: string[];
    times: string[];
  };
}

interface Goal {
  id: string;
  title: string;
  category: string;
  status: 'In Progress' | 'Completed' | 'Overdue' | 'Not Started';
  progress: number;
  dueDate: string;
  description: string;
  tasks: Task[];
  metrics?: {
    current: number;
    target: number;
    unit: string;
  };
}

const GoalProgress: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'current' | 'completed'>('current');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedGoal, setExpandedGoal] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<string | null>(null);

  const [goals, setGoals] = useState<Goal[]>([
    {
      id: '1',
      title: 'Improve Blood Pressure Management',
      category: 'Health',
      status: 'In Progress',
      progress: 65,
      dueDate: '2025-04-01',
      description: 'Work on maintaining healthy blood pressure levels through lifestyle changes and medication adherence.',
      tasks: [
        {
          id: 't1',
          title: 'Take BP readings twice daily',
          completed: false,
          totalOccurrences: 60,
          completedOccurrences: 54,
          lastCompleted: '2025-03-01',
          status: 'on-track',
          frequency: 'daily',
          startWeek: 1,
          endWeek: 12,
          visibleInPatientApp: true
        },
        {
          id: 't2',
          title: 'Log readings in Motiv app',
          completed: false,
          totalOccurrences: 60,
          completedOccurrences: 50,
          lastCompleted: '2025-03-01',
          status: 'at-risk',
          frequency: 'daily',
          startWeek: 1,
          endWeek: 24,
          visibleInPatientApp: true
        },
        {
          id: 't3',
          title: 'Follow low-sodium diet plan',
          completed: false,
          totalOccurrences: 30,
          completedOccurrences: 15,
          lastCompleted: '2025-02-28',
          status: 'behind',
          frequency: 'weekly',
          startWeek: 2,
          endWeek: 8,
          visibleInPatientApp: true
        },
        {
          id: 't4',
          title: 'Complete 30 mins of daily exercise',
          completed: false,
          totalOccurrences: 60,
          completedOccurrences: 58,
          lastCompleted: '2025-03-01',
          status: 'on-track',
          frequency: 'daily',
          startWeek: 1,
          endWeek: 24,
          visibleInPatientApp: true
        }
      ],
      metrics: {
        current: 138,
        target: 120,
        unit: 'mmHg'
      }
    },
    {
      id: '2',
      title: 'Increase Physical Activity',
      category: 'Fitness',
      status: 'In Progress',
      progress: 40,
      dueDate: '2025-03-15',
      description: 'Gradually increase daily physical activity to improve overall fitness and heart health.',
      tasks: [
        {
          id: 't5',
          title: 'Walk 30 minutes daily',
          completed: false,
          totalOccurrences: 90,
          completedOccurrences: 85,
          lastCompleted: '2025-03-01',
          status: 'on-track',
          frequency: 'daily',
          startWeek: 1,
          endWeek: 12,
          visibleInPatientApp: true
        },
        {
          id: 't6',
          title: 'Join cardiac rehab program',
          completed: true,
          totalOccurrences: 1,
          completedOccurrences: 1,
          lastCompleted: '2025-02-15',
          status: 'completed',
          frequency: 'one-time',
          startWeek: 1,
          endWeek: 1,
          visibleInPatientApp: false
        },
        {
          id: 't7',
          title: 'Track steps in fitness app',
          completed: false,
          totalOccurrences: 90,
          completedOccurrences: 82,
          lastCompleted: '2025-03-01',
          status: 'on-track',
          frequency: 'daily',
          startWeek: 1,
          endWeek: 12,
          visibleInPatientApp: true
        }
      ],
      metrics: {
        current: 5000,
        target: 10000,
        unit: 'steps'
      }
    },
    {
      id: '3',
      title: 'Achieve Healthy Weight Loss',
      category: 'Weight Management',
      status: 'Completed',
      progress: 100,
      dueDate: '2025-06-30',
      description: 'Work towards achieving a healthy weight through balanced nutrition and regular physical activity.',
      tasks: [
        {
          id: 't8',
          title: 'Track daily caloric intake',
          completed: true,
          totalOccurrences: 180,
          completedOccurrences: 180,
          lastCompleted: '2025-03-01',
          status: 'completed',
          frequency: 'daily',
          startWeek: 1,
          endWeek: 24,
          visibleInPatientApp: true
        },
        {
          id: 't9',
          title: 'Attend weekly nutrition counseling',
          completed: true,
          totalOccurrences: 24,
          completedOccurrences: 24,
          lastCompleted: '2025-02-28',
          status: 'completed',
          frequency: 'weekly',
          startWeek: 1,
          endWeek: 24,
          visibleInPatientApp: false
        },
        {
          id: 't10',
          title: 'Complete strength training sessions',
          completed: true,
          totalOccurrences: 72,
          completedOccurrences: 72,
          lastCompleted: '2025-03-01',
          status: 'completed',
          frequency: 'custom',
          startWeek: 1,
          endWeek: 24,
          visibleInPatientApp: true,
          customSchedule: {
            days: ['Monday', 'Wednesday', 'Friday'],
            times: ['09:00', '16:00']
          }
        },
        {
          id: 't11',
          title: 'Log weekly weight measurements',
          completed: true,
          totalOccurrences: 24,
          completedOccurrences: 24,
          lastCompleted: '2025-03-01',
          status: 'completed',
          frequency: 'weekly',
          startWeek: 1,
          endWeek: 24,
          visibleInPatientApp: true
        },
        {
          id: 't12',
          title: 'Complete initial body composition scan',
          completed: true,
          totalOccurrences: 1,
          completedOccurrences: 1,
          lastCompleted: '2025-02-15',
          status: 'completed',
          frequency: 'one-time',
          startWeek: 1,
          endWeek: 1,
          visibleInPatientApp: false
        }
      ],
      metrics: {
        current: 175,
        target: 175,
        unit: 'lbs'
      }
    }
  ]);

  const handleTaskUpdate = (goalId: string, taskId: string, updates: Partial<Task>) => {
    setGoals(currentGoals => 
      currentGoals.map(goal => {
        if (goal.id === goalId) {
          return {
            ...goal,
            tasks: goal.tasks.map(task => 
              task.id === taskId ? { ...task, ...updates } : task
            )
          };
        }
        return goal;
      })
    );
  };

  const togglePatientVisibility = (goalId: string, taskId: string, currentVisibility: boolean) => {
    handleTaskUpdate(goalId, taskId, { visibleInPatientApp: !currentVisibility });
  };

  const filteredGoals = goals.filter(goal => {
    const matchesSearch = goal.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'current' ? goal.status !== 'Completed' : goal.status === 'Completed';
    return matchesSearch && matchesTab;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case 'on-track':
        return 'text-green-600';
      case 'at-risk':
        return 'text-yellow-600';
      case 'behind':
        return 'text-red-600';
      case 'completed':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  const getTaskStatusIcon = (status: string) => {
    switch (status) {
      case 'on-track':
        return <CheckCircle2 className="h-5 w-5" />;
      case 'at-risk':
        return <Clock className="h-5 w-5" />;
      case 'behind':
        return <AlertCircle className="h-5 w-5" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  const TaskEditor: React.FC<{ task: Task; goalId: string; onClose: () => void }> = ({ task, goalId, onClose }) => {
    const [frequency, setFrequency] = useState(task.frequency);
    const [startWeek, setStartWeek] = useState(task.startWeek);
    const [endWeek, setEndWeek] = useState(task.endWeek);

    const handleSave = () => {
      handleTaskUpdate(goalId, task.id, {
        frequency,
        startWeek,
        endWeek
      });
      onClose();
    };

    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
        <div className="flex justify-between items-center mb-3">
          <h4 className="font-medium">Edit Task Schedule</h4>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
          <select
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value as Task['frequency'])}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="one-time">One Time</option>
          </select>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Week</label>
            <select
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              value={startWeek}
              onChange={(e) => setStartWeek(Number(e.target.value))}
            >
              {Array.from({ length: 24 }, (_, i) => i + 1).map(week => (
                <option key={week} value={week}>Week {week}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Week</label>
            <select
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              value={endWeek}
              onChange={(e) => setEndWeek(Number(e.target.value))}
            >
              {Array.from({ length: 24 }, (_, i) => i + 1).map(week => (
                <option key={week} value={week}>Week {week}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <button
            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={handleSave}
          >
            Save Changes
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col w-full bg-gray-50">
      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Goals</h1>
            <p className="text-gray-600">Track and manage patient goals</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search Goals..."
                className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
              <Plus className="h-5 w-5 mr-2" />
              New Goal
            </button>
          </div>
        </div>

        <div className="flex space-x-4 mb-6">
          <button
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'current'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
            onClick={() => setActiveTab('current')}
          >
            Current Goals
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'completed'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
            onClick={() => setActiveTab('completed')}
          >
            Completed Goals
          </button>
        </div>

        <div className="space-y-4">
          {filteredGoals.map((goal) => (
            <div
              key={goal.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200"
            >
              <div 
                className="p-4 flex items-center justify-between cursor-pointer"
                onClick={() => setExpandedGoal(expandedGoal === goal.id ? null : goal.id)}
              >
                <div className="flex items-center space-x-4">
                  <Target className="h-6 w-6 text-blue-600" />
                  <div>
                    <h3 className="font-medium">{goal.title}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`text-sm px-2 py-0.5 rounded-full ${getStatusColor(goal.status)}`}>
                        {goal.status}
                      </span>
                      <span className="text-sm text-gray-500">
                        Due {new Date(goal.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <ChevronDown 
                  className={`h-5 w-5 text-gray-400 transform transition-transform ${
                    expandedGoal === goal.id ? 'rotate-180' : ''
                  }`} 
                />
              </div>

              {expandedGoal === goal.id && (
                <div className="border-t border-gray-200 p-4">
                  {goal.metrics && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Overall Progress</span>
                        <div className="flex items-center text-sm">
                          <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                          <span className="font-medium">{goal.metrics.current}</span>
                          <span className="text-gray-500 mx-1">of</span>
                          <span className="font-medium">{goal.metrics.target}</span>
                          <span className="text-gray-500 ml-1">{goal.metrics.unit}</span>
                        </div>
                      </div>
                      <div className="relative w-full">
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ 
                              width: `${Math.min((goal.metrics.current / goal.metrics.target) * 100, 100)}%`
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    {goal.tasks.map((task) => (
                      <div key={task.id} className="border border-gray-200 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center flex-1">
                            <div 
                              className={`h-4 w-4 rounded-full border ${task.completed ? 'bg-green-500 border-green-500' : 'border-gray-300'} mr-3 cursor-pointer`}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTaskUpdate(goal.id, task.id, { 
                                  completed: !task.completed,
                                  status: !task.completed ? 'completed' : 'on-track'
                                });
                              }}
                            ></div>
                            <span className={`font-medium ${task.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                              {task.title}
                            </span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => togglePatientVisibility(goal.id, task.id, task.visibleInPatientApp)}
                              className="p-1 hover:bg-gray-100 rounded"
                              title={task.visibleInPatientApp ? "Visible in patient app" : "Hidden in patient app"}
                            >
                              {task.visibleInPatientApp ? (
                                <Eye className="h-4 w-4 text-green-600" />
                              ) : (
                                <EyeOff className="h-4 w-4 text-gray-400" />
                              )}
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingTask(editingTask === task.id ? null : task.id);
                              }}
                              className="p-1 hover:bg-gray-100 rounded"
                            >
                              <Edit2 className="h-4 w-4 text-gray-500" />
                            </button>
                            <div className={`flex items-center ${getTaskStatusColor(task.status)}`}>
                              {getTaskStatusIcon(task.status)}
                              <span className="ml-1 text-sm capitalize">{task.status.replace('-', ' ')}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm mb-2">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center text-gray-600">
                              <Calendar className="h-4 w-4 mr-1" />
                              <span>Weeks {task.startWeek}-{task.endWeek}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <Clock className="h-4 w-4 mr-1" />
                              <span className="capitalize">{task.frequency}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              {task.visibleInPatientApp ? (
                                <span className="text-green-600 text-xs">Patient App: Visible</span>
                              ) : (
                                <span className="text-gray-400 text-xs">Patient App: Hidden</span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-500">
                              {task.completedOccurrences}/{task.totalOccurrences}
                            </span>
                            <div className="w-16 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                              <div
                                className={`h-1.5 rounded-full ${
                                  task.status === 'on-track' ? 'bg-green-500' :
                                  task.status === 'at-risk' ? 'bg-yellow-500' :
                                  task.status === 'behind' ? 'bg-red-500' :
                                  'bg-blue-500'
                                }`}
                                style={{ 
                                  width: `${Math.min((task.completedOccurrences / task.totalOccurrences) * 100, 100)}%`
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>

                        {editingTask === task.id && (
                          <div className="mt-3">
                            <TaskEditor
                              task={task}
                              goalId={goal.id}
                              onClose={() => setEditingTask(null)}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default GoalProgress;