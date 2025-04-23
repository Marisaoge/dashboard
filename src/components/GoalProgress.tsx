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
  EyeOff,
  ChevronUp,
  Edit,
  Save,
  Trash2,
  MoreVertical
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  status: 'on-track' | 'at-risk' | 'behind' | 'completed';
  frequency: 'daily' | 'weekly' | 'one-time' | 'adhoc';
  startDate: string;
  endDate: string;
  visibleInPatientApp: boolean;
  totalOccurrences: number;
  completedOccurrences: number;
  lastCompleted?: string;
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

interface GoalProgressProps {
  patient: {
    id: string;
    name: string;
    goals?: Array<{
      id: string;
      name: string;
      status: 'in-progress' | 'completed';
      progress: number;
      notes: Array<{
        id: string;
        date: string;
        author: string;
        content: string;
      }>;
    }>;
  };
}

const GoalProgress: React.FC<GoalProgressProps> = ({ patient }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedGoal, setExpandedGoal] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [editingDate, setEditingDate] = useState<{ taskId: string; type: 'start' | 'end' | 'frequency' } | null>(null);
  const [editingGoal, setEditingGoal] = useState<string | null>(null);
  const [showGoalDeleteConfirm, setShowGoalDeleteConfirm] = useState<string | null>(null);
  const [showGoalMenu, setShowGoalMenu] = useState<string | null>(null);

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
          status: 'on-track',
          frequency: 'daily',
          startDate: '2025-01-01',
          endDate: '2025-03-31',
          visibleInPatientApp: true,
          totalOccurrences: 60,
          completedOccurrences: 54,
          lastCompleted: '2025-03-01'
        },
        {
          id: 't2',
          title: 'Log readings in Motiv app',
          completed: false,
          status: 'at-risk',
          frequency: 'daily',
          startDate: '2025-01-01',
          endDate: '2025-06-30',
          visibleInPatientApp: true,
          totalOccurrences: 60,
          completedOccurrences: 50,
          lastCompleted: '2025-03-01'
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
          id: 't3',
          title: 'Walk 30 minutes daily',
          completed: false,
          status: 'on-track',
          frequency: 'daily',
          startDate: '2025-01-01',
          endDate: '2025-03-31',
          visibleInPatientApp: true,
          totalOccurrences: 90,
          completedOccurrences: 85,
          lastCompleted: '2025-03-01'
        },
        {
          id: 't4',
          title: 'Track steps in fitness app',
          completed: false,
          status: 'on-track',
          frequency: 'daily',
          startDate: '2025-01-01',
          endDate: '2025-03-31',
          visibleInPatientApp: true,
          totalOccurrences: 90,
          completedOccurrences: 82,
          lastCompleted: '2025-03-01'
        }
      ],
      metrics: {
        current: 5000,
        target: 10000,
        unit: 'steps'
      }
    }
  ]);

  const filteredGoals = goals.filter(goal => 
    goal.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentGoals = filteredGoals.filter(goal => goal.status === 'In Progress');
  const completedGoals = filteredGoals.filter(goal => goal.status === 'Completed');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Overdue':
        return 'bg-red-100 text-red-800';
      case 'Not Started':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case 'on-track':
        return 'bg-green-500';
      case 'at-risk':
        return 'bg-yellow-500';
      case 'behind':
        return 'bg-red-500';
      case 'completed':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getTaskStatusIcon = (status: string) => {
    switch (status) {
      case 'on-track':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'at-risk':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'behind':
        return <X className="h-4 w-4 text-red-500" />;
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const handleTaskUpdate = (goalId: string, taskId: string, updatedTask: Partial<Task>) => {
    setGoals(currentGoals => 
      currentGoals.map(goal => {
        if (goal.id === goalId) {
          const updatedTasks = goal.tasks.map(task =>
            task.id === taskId ? { ...task, ...updatedTask } : task
          );
          
          // Check if all tasks are completed
          const allTasksCompleted = updatedTasks.every(task => task.completed);
          
          return {
            ...goal,
            tasks: updatedTasks,
            // Update goal status if all tasks are completed
            status: allTasksCompleted ? 'Completed' : 'In Progress'
          };
        }
        return goal;
      })
    );
  };

  const handleDeleteTask = (goalId: string, taskId: string) => {
    setGoals(currentGoals =>
      currentGoals.map(goal => {
        if (goal.id === goalId) {
          return {
            ...goal,
            tasks: goal.tasks.filter(task => task.id !== taskId)
          };
        }
        return goal;
      })
    );
    setEditingTask(null);
  };

  const handleTaskCompletion = (goalId: string, taskId: string, completed: boolean) => {
    handleTaskUpdate(goalId, taskId, {
      completed,
      status: completed ? 'completed' : 'on-track',
      lastCompleted: completed ? new Date().toISOString() : undefined
    });
  };

  const handleDateChange = (goalId: string, taskId: string, type: 'start' | 'end', date: string) => {
    handleTaskUpdate(goalId, taskId, {
      [type === 'start' ? 'startDate' : 'endDate']: date
    });
    setEditingDate(null);
  };

  const TaskEditForm: React.FC<{
    task: Task;
    goalId: string;
    onSave: () => void;
    onCancel: () => void;
  }> = ({ task, goalId, onSave, onCancel }) => {
    const [editedTask, setEditedTask] = useState({
      startDate: task.startDate,
      endDate: task.endDate,
      frequency: task.frequency,
      completed: task.completed,
      visibleInPatientApp: task.visibleInPatientApp
    });
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleSave = () => {
      handleTaskUpdate(goalId, task.id, editedTask);
      onSave();
    };

    return (
      <div className="mt-2 p-3 bg-white rounded-lg border border-gray-200">
        <div className="space-y-3">
          <div>
            <div className="flex items-center gap-8 mb-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  value={editedTask.startDate.split('T')[0]}
                  onChange={(e) => setEditedTask(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-[140px] rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="date"
                  value={editedTask.endDate.split('T')[0]}
                  onChange={(e) => setEditedTask(prev => ({ ...prev, endDate: e.target.value }))}
                  className="w-[140px] rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Frequency</label>
              <select
                value={editedTask.frequency}
                onChange={(e) => setEditedTask(prev => ({ ...prev, frequency: e.target.value as Task['frequency'] }))}
                className="w-[140px] rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="adhoc">Ad Hoc</option>
              </select>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={editedTask.completed}
              onChange={(e) => setEditedTask(prev => ({ 
                ...prev, 
                completed: e.target.checked,
                status: e.target.checked ? 'completed' : 'on-track'
              }))}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Mark as Completed</span>
          </div>

          <div className="flex items-center space-x-3 border-t border-gray-100 pt-2">
            <div className="flex items-center space-x-2">
              {editedTask.visibleInPatientApp ? (
                <Eye className="h-4 w-4 text-green-600" />
              ) : (
                <EyeOff className="h-4 w-4 text-gray-400" />
              )}
              <span className="text-sm text-gray-700">Visible in Patient App</span>
            </div>
            <button
              type="button"
              onClick={() => setEditedTask(prev => ({ ...prev, visibleInPatientApp: !prev.visibleInPatientApp }))}
              className={`
                relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
                transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                ${editedTask.visibleInPatientApp ? 'bg-green-500' : 'bg-gray-200'}
              `}
            >
              <span
                className={`
                  pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 
                  transition duration-200 ease-in-out
                  ${editedTask.visibleInPatientApp ? 'translate-x-4' : 'translate-x-0'}
                `}
              />
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
          {showDeleteConfirm ? (
            <div className="flex items-center space-x-3 text-sm">
              <span className="text-gray-700">Are you sure you want to delete this task?</span>
              <button
                onClick={() => handleDeleteTask(goalId, task.id)}
                className="px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-3 py-1.5 text-gray-600 hover:text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="text-sm text-red-600 hover:text-red-700"
            >
              Delete Task
            </button>
          )}
          <div className="flex space-x-2">
            <button
              onClick={onCancel}
              className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-700 hover:bg-gray-100 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    );
  };

  const handleDeleteGoal = (goalId: string) => {
    setGoals(currentGoals => currentGoals.filter(goal => goal.id !== goalId));
    setShowGoalDeleteConfirm(null);
    setShowGoalMenu(null);
  };

  const handleUpdateGoal = (goalId: string, updates: Partial<Goal>) => {
    setGoals(currentGoals =>
      currentGoals.map(goal =>
        goal.id === goalId ? { ...goal, ...updates } : goal
      )
    );
    setEditingGoal(null);
    setShowGoalMenu(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900">Goal Progress</h2>
        <div className="mt-4 flex items-center justify-between">
          <div className="relative flex-1 max-w-xs">
            <input
              type="text"
              placeholder="Search goals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-4 py-2 pl-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
          >
            <Plus className="h-4 w-4" />
            Add Goal
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="mb-4 text-sm font-medium text-gray-700">Current Goals</h3>
          <div className="space-y-4">
            {currentGoals.map((goal) => (
              <div
                key={goal.id}
                className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div>
                    {editingGoal === goal.id ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={goal.title}
                          onChange={(e) => handleUpdateGoal(goal.id, { title: e.target.value })}
                          className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <textarea
                          value={goal.description}
                          onChange={(e) => handleUpdateGoal(goal.id, { description: e.target.value })}
                          className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          rows={2}
                        />
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => setEditingGoal(null)}
                            className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-700 hover:bg-gray-100 rounded-md"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => setEditingGoal(null)}
                            className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                          >
                            Save Changes
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h4 className="font-medium text-gray-900">{goal.title}</h4>
                        <div className="mt-1 flex items-center space-x-2">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(goal.status)}`}>
                            {goal.status}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <button
                        onClick={() => setShowGoalMenu(showGoalMenu === goal.id ? null : goal.id)}
                        className="p-1 hover:bg-gray-100 rounded-full"
                      >
                        <MoreVertical className="h-5 w-5 text-gray-500" />
                      </button>
                      {showGoalMenu === goal.id && (
                        <div className="absolute right-0 mt-1 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-10">
                          <div className="py-1">
                            <button
                              onClick={() => {
                                setEditingGoal(goal.id);
                                setShowGoalMenu(null);
                              }}
                              className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <Edit2 className="h-4 w-4 mr-2" />
                              Edit Goal
                            </button>
                            <button
                              onClick={() => {
                                setShowGoalDeleteConfirm(goal.id);
                                setShowGoalMenu(null);
                              }}
                              className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Goal
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => setExpandedGoal(expandedGoal === goal.id ? null : goal.id)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      {expandedGoal === goal.id ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
                {showGoalDeleteConfirm === goal.id && (
                  <div className="mt-3 p-3 bg-red-50 rounded-md">
                    <p className="text-sm text-red-800 mb-3">
                      Are you sure you want to delete this goal? This will also remove it from the care plan.
                    </p>
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => setShowGoalDeleteConfirm(null)}
                        className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-700 hover:bg-gray-100 rounded-md"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleDeleteGoal(goal.id)}
                        className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
                      >
                        Yes, Delete Goal
                      </button>
                    </div>
                  </div>
                )}
                {expandedGoal === goal.id && (
                  <div className="mt-4 space-y-4">
                    {goal.tasks.map((task) => (
                      <div key={task.id} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <button 
                              className={`h-5 w-5 rounded-full border-2 cursor-pointer flex items-center justify-center transition-colors duration-200
                                ${task.completed 
                                  ? 'bg-green-500 border-green-500' 
                                  : 'border-gray-300 hover:border-gray-400'
                                }`}
                              onClick={() => handleTaskCompletion(goal.id, task.id, !task.completed)}
                              aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
                            >
                              {task.completed && <CheckCircle2 className="h-3 w-3 text-white" />}
                            </button>
                            <h4 className={`font-medium transition-all duration-200 ${task.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                              {task.title}
                            </h4>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => setEditingTask(editingTask === task.id ? null : task.id)}
                              className="p-1 hover:bg-gray-200 rounded-full"
                            >
                              <Edit className="h-4 w-4 text-gray-500" />
                            </button>
                            <div className={`flex items-center px-2 py-0.5 rounded-full text-sm ${getStatusColor(task.status)}`}>
                              {getTaskStatusIcon(task.status)}
                              <span className="ml-1 capitalize">{task.status.replace('-', ' ')}</span>
                            </div>
                          </div>
                        </div>

                        {editingTask === task.id ? (
                          <TaskEditForm
                            task={task}
                            goalId={goal.id}
                            onSave={() => setEditingTask(null)}
                            onCancel={() => setEditingTask(null)}
                          />
                        ) : (
                          <div className="text-sm text-gray-600">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div className="relative">
                                  <div 
                                    className="flex items-center cursor-pointer hover:text-blue-600"
                                    onClick={() => setEditingDate({ taskId: task.id, type: 'start' })}
                                  >
                                    <Calendar className="h-4 w-4 mr-1.5" />
                                    <span>{new Date(task.startDate).toLocaleDateString()} - {new Date(task.endDate).toLocaleDateString()}</span>
                                  </div>
                                  {(editingDate?.taskId === task.id && editingDate.type === 'start') && (
                                    <div className="absolute z-10 mt-1 left-0 bg-white rounded-lg border border-gray-200 shadow-sm">
                                      <div className="flex p-2 space-x-3">
                                        <div>
                                          <label className="block text-xs font-medium text-gray-500 mb-1">Start</label>
                                          <input
                                            type="date"
                                            value={task.startDate.split('T')[0]}
                                            onChange={(e) => handleDateChange(goal.id, task.id, 'start', e.target.value)}
                                            className="w-[140px] rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            autoFocus
                                          />
                                        </div>
                                        <div>
                                          <label className="block text-xs font-medium text-gray-500 mb-1">End</label>
                                          <input
                                            type="date"
                                            value={task.endDate.split('T')[0]}
                                            onChange={(e) => handleDateChange(goal.id, task.id, 'end', e.target.value)}
                                            className="w-[140px] rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                          />
                                        </div>
                                      </div>
                                      <button
                                        onClick={() => setEditingDate(null)}
                                        className="absolute top-1 right-1 text-gray-400 hover:text-gray-600"
                                      >
                                        <X className="h-4 w-4" />
                                      </button>
                                    </div>
                                  )}
                                </div>
                                <div className="relative">
                                  <div 
                                    className="flex items-center cursor-pointer hover:text-blue-600"
                                    onClick={() => setEditingDate({ taskId: task.id, type: 'frequency' })}
                                  >
                                    <Clock className="h-4 w-4 mr-1.5" />
                                    <span className="capitalize">{task.frequency}</span>
                                  </div>
                                  {(editingDate?.taskId === task.id && editingDate.type === 'frequency') && (
                                    <div className="absolute z-10 mt-1 left-0 bg-white rounded-lg border border-gray-200 shadow-sm">
                                      <div className="flex items-center pr-6 relative">
                                        <select
                                          value={task.frequency}
                                          onChange={(e) => {
                                            handleTaskUpdate(goal.id, task.id, { frequency: e.target.value as Task['frequency'] });
                                            setEditingDate(null);
                                          }}
                                          className="w-[100px] rounded-md border border-gray-300 m-2 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                          autoFocus
                                        >
                                          <option value="daily">Daily</option>
                                          <option value="weekly">Weekly</option>
                                          <option value="adhoc">Ad Hoc</option>
                                        </select>
                                        <button
                                          onClick={() => setEditingDate(null)}
                                          className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                          <X className="h-4 w-4" />
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                                {task.lastCompleted && (
                                  <div className="flex items-center">
                                    <CheckCircle className="h-4 w-4 mr-1.5" />
                                    <span>Last: {new Date(task.lastCompleted).toLocaleDateString()}</span>
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center space-x-3">
                                <div className="flex items-center">
                                  <Activity className="h-4 w-4 mr-1.5" />
                                  <span>{task.completedOccurrences}/{task.totalOccurrences}</span>
                                </div>
                                <div 
                                  className={`flex items-center cursor-pointer ${task.visibleInPatientApp ? 'text-green-600' : 'text-gray-400'}`}
                                  onClick={() => handleTaskUpdate(goal.id, task.id, { visibleInPatientApp: !task.visibleInPatientApp })}
                                >
                                  {task.visibleInPatientApp ? (
                                    <>
                                      <Eye className="h-4 w-4 mr-1" />
                                      <span className="text-xs">Visible in App</span>
                                    </>
                                  ) : (
                                    <>
                                      <Eye className="h-4 w-4 mr-1 line-through" />
                                      <span className="text-xs">Not Visible in App</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-medium text-gray-700">Completed Goals</h3>
          <div className="space-y-4">
            {completedGoals.map((goal) => (
              <div
                key={goal.id}
                className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm opacity-75"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{goal.title}</h4>
                    <div className="mt-1 flex items-center space-x-2">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(goal.status)}`}>
                        {goal.status}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setExpandedGoal(expandedGoal === goal.id ? null : goal.id)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    {expandedGoal === goal.id ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {expandedGoal === goal.id && (
                  <div className="mt-4 space-y-4">
                    {goal.tasks.map((task) => (
                      <div key={task.id} className="rounded-md bg-gray-50 p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-900">{task.title}</span>
                          <span className="text-sm text-gray-500">{task.status.replace('-', ' ')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalProgress;