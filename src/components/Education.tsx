import React, { useState } from 'react';
import { 
  Play,
  FileText,
  CheckCircle2,
  Clock,
  Plus,
  Filter,
  ChevronDown,
  MoreHorizontal,
  Calendar,
  BookOpen,
  X,
  ArrowRight,
  CheckCircle,
  Video,
  Dumbbell,
  Search,
  Trash2,
  ExternalLink,
  Pencil,
  Save,
  XCircle
} from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'article' | 'exercise';
  category: string;
  duration: string;
  thumbnail?: string;
  status: 'completed' | 'in_progress' | 'not_started';
  assignedDate: string;
  dueDate: string;
  description: string;
}

interface WeeklyPlan {
  week: number;
  title: string;
  description: string;
  lessons: Lesson[];
}

interface EducationProps {
  patient: {
    id: string;
    name: string;
    // Add other patient properties as needed
  };
}

const Education: React.FC<EducationProps> = ({ patient }) => {
  const [isAddingLesson, setIsAddingLesson] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const [lessonSearchQuery, setLessonSearchQuery] = useState('');
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [showLessonDetails, setShowLessonDetails] = useState(false);
  const [isEditingUrl, setIsEditingUrl] = useState(false);
  const [editedUrl, setEditedUrl] = useState('');

  // Sample program weeks data with more detailed structure
  const programWeeks: WeeklyPlan[] = [
    {
      week: 1,
      title: 'Program Introduction & Basics',
      description: 'Get started with the fundamentals of heart health and program orientation.',
      lessons: [
        {
          id: 'w1l1',
          title: 'Welcome to Your Heart Health Journey',
          type: 'video',
          category: 'Orientation',
          duration: '5 mins',
          status: 'completed',
          assignedDate: '2025-02-01',
          dueDate: '2025-02-08',
          description: 'Introduction to your 24-week heart health program.'
        },
        {
          id: 'w1l2',
          title: 'Basic Stretching Routine',
          type: 'exercise',
          category: 'Exercise',
          duration: '15 mins',
          status: 'completed',
          assignedDate: '2025-02-01',
          dueDate: '2025-02-08',
          description: 'Learn fundamental stretches to improve flexibility.'
        }
      ]
    },
    {
      week: 2,
      title: 'Understanding Heart Health',
      description: 'Deep dive into cardiovascular health concepts and lifestyle modifications.',
      lessons: [
        {
          id: 'w2l1',
          title: 'Basics of Heart Disease',
          type: 'article',
          category: 'Education',
          duration: '15 mins',
          status: 'in_progress',
          assignedDate: '2025-02-08',
          dueDate: '2025-02-15',
          description: 'Learn about the fundamentals of heart disease and its impact on your health.'
        },
        {
          id: 'w2l2',
          title: 'Beginner Walking Program',
          type: 'exercise',
          category: 'Exercise',
          duration: '20 mins',
          status: 'not_started',
          assignedDate: '2025-02-08',
          dueDate: '2025-02-15',
          description: 'Start your journey with a structured walking program.'
        }
      ]
    }
  ];

  // Sample library lessons for the add lesson modal
  const libraryLessons: Lesson[] = [
    {
      id: 'lib1',
      title: 'Understanding Blood Pressure Readings',
      type: 'video',
      category: 'Heart Health',
      duration: '10 mins',
      status: 'not_started',
      assignedDate: '',
      dueDate: '',
      description: 'Learn how to interpret your blood pressure readings.'
    },
    {
      id: 'lib2',
      title: 'Strength Training Basics',
      type: 'exercise',
      category: 'Exercise',
      duration: '25 mins',
      status: 'not_started',
      assignedDate: '',
      dueDate: '',
      description: 'Introduction to basic strength training exercises.'
    },
    {
      id: 'lib3',
      title: 'Heart-Healthy Diet Guidelines',
      type: 'article',
      category: 'Nutrition',
      duration: '15 mins',
      status: 'not_started',
      assignedDate: '',
      dueDate: '',
      description: 'Essential dietary guidelines for heart health.'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getLessonTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="h-5 w-5 text-blue-600" />;
      case 'exercise':
        return <Dumbbell className="h-5 w-5 text-purple-600" />;
      default:
        return <FileText className="h-5 w-5 text-green-600" />;
    }
  };

  const filteredLibraryLessons = libraryLessons.filter(lesson =>
    lesson.title.toLowerCase().includes(lessonSearchQuery.toLowerCase()) ||
    lesson.category.toLowerCase().includes(lessonSearchQuery.toLowerCase())
  );

  const handleDeleteLesson = (weekIndex: number, lessonId: string) => {
    const updatedWeeks = [...programWeeks];
    const weekToUpdate = updatedWeeks[weekIndex];
    weekToUpdate.lessons = weekToUpdate.lessons.filter(lesson => lesson.id !== lessonId);
    // Here you would typically also make an API call to delete the lesson
    setShowLessonDetails(false);
    setSelectedLesson(null);
  };

  const handleStartEditingUrl = () => {
    if (selectedLesson) {
      setEditedUrl(`https://www.healthwise.net/motiv/Content/StdDocument.aspx?DOCHWID=${selectedLesson.id}`);
      setIsEditingUrl(true);
    }
  };

  const handleSaveUrl = () => {
    // Here you would typically make an API call to update the URL
    setIsEditingUrl(false);
  };

  const handleCancelUrlEdit = () => {
    setIsEditingUrl(false);
    if (selectedLesson) {
      setEditedUrl(`https://www.healthwise.net/motiv/Content/StdDocument.aspx?DOCHWID=${selectedLesson.id}`);
    }
  };

  return (
    <div className="flex-1 flex flex-col w-full bg-gray-50">
      {/* Main Content */}
      <main className="flex-1 p-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-lg font-medium text-gray-900">Lessons & Exercise</h1>
            <p className="text-gray-600">24-Week Cardiac Wellness Program</p>
          </div>
        </div>

        <div className="space-y-8">
          {programWeeks.map((week) => (
            <div key={week.week} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold flex items-center">
                    Week {week.week}
                  </h3>
                  <p className="text-gray-600 mt-1">{week.title}</p>
                  <p className="text-sm text-gray-500 mt-1">{week.description}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setSelectedWeek(week.week);
                      setIsAddingLesson(true);
                    }}
                    className="flex items-center px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Item
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {week.lessons.map((lesson) => (
                  <div 
                    key={lesson.id} 
                    className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => {
                      setSelectedLesson(lesson);
                      setShowLessonDetails(true);
                    }}
                  >
                    <div className="flex-shrink-0 mr-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        lesson.type === 'video' ? 'bg-blue-100' :
                        lesson.type === 'exercise' ? 'bg-purple-100' : 'bg-green-100'
                      }`}>
                        {getLessonTypeIcon(lesson.type)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center mb-1">
                        <span className="text-sm font-medium text-gray-500 mr-2">{lesson.category}</span>
                        <span className="text-sm text-gray-400">•</span>
                        <span className="text-sm text-gray-500 ml-2">{lesson.duration}</span>
                      </div>
                      <h4 className="text-lg font-medium text-gray-900">{lesson.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{lesson.description}</p>
                    </div>
                    <div className="ml-4 flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(lesson.status)}`}>
                        {lesson.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Add Lesson Modal */}
        {isAddingLesson && selectedWeek && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">Add Lesson to Week {selectedWeek}</h3>
                  <button
                    onClick={() => {
                      setIsAddingLesson(false);
                      setSelectedWeek(null);
                      setLessonSearchQuery('');
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="mb-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search lessons..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={lessonSearchQuery}
                      onChange={(e) => setLessonSearchQuery(e.target.value)}
                    />
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                </div>

                <div className="space-y-4 max-h-[400px] overflow-y-auto">
                  {filteredLibraryLessons.map((lesson) => (
                    <div key={lesson.id} className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
                      <div className="flex-shrink-0 mr-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          lesson.type === 'video' ? 'bg-blue-100' :
                          lesson.type === 'exercise' ? 'bg-purple-100' : 'bg-green-100'
                        }`}>
                          {getLessonTypeIcon(lesson.type)}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center mb-1">
                          <span className="text-sm font-medium text-gray-500">{lesson.category}</span>
                          <span className="mx-2 text-gray-300">•</span>
                          <span className="text-sm text-gray-500">{lesson.duration}</span>
                        </div>
                        <h4 className="font-medium text-gray-900">{lesson.title}</h4>
                      </div>
                      <button className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
                        Add
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Lesson Details Modal */}
        {showLessonDetails && selectedLesson && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-4 ${
                      selectedLesson.type === 'video' ? 'bg-blue-100' :
                      selectedLesson.type === 'exercise' ? 'bg-purple-100' : 'bg-green-100'
                    }`}>
                      {getLessonTypeIcon(selectedLesson.type)}
                    </div>
                    <h3 className="text-xl font-semibold">{selectedLesson.title}</h3>
                  </div>
                  <button
                    onClick={() => {
                      setShowLessonDetails(false);
                      setSelectedLesson(null);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Category</h4>
                    <p className="text-gray-900">{selectedLesson.category}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Description</h4>
                    <p className="text-gray-900">{selectedLesson.description}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Duration</h4>
                    <p className="text-gray-900">{selectedLesson.duration}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Status</h4>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedLesson.status)}`}>
                      {selectedLesson.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-medium text-gray-500">URL</h4>
                      {!isEditingUrl ? (
                        <button
                          onClick={handleStartEditingUrl}
                          className="text-blue-600 hover:text-blue-700 flex items-center text-sm"
                        >
                          <Pencil className="h-3 w-3 mr-1" />
                          Edit URL
                        </button>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={handleSaveUrl}
                            className="text-green-600 hover:text-green-700 flex items-center text-sm"
                          >
                            <Save className="h-3 w-3 mr-1" />
                            Save
                          </button>
                          <button
                            onClick={handleCancelUrlEdit}
                            className="text-gray-500 hover:text-gray-600 flex items-center text-sm"
                          >
                            <XCircle className="h-3 w-3 mr-1" />
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="mt-2 p-3 bg-gray-50 rounded-lg break-all">
                      {!isEditingUrl ? (
                        <a 
                          href={`https://www.healthwise.net/motiv/Content/StdDocument.aspx?DOCHWID=${selectedLesson.id}`}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 flex items-center gap-2 font-mono text-sm"
                        >
                          @https://www.healthwise.net/motiv/Content/StdDocument.aspx?DOCHWID={selectedLesson.id}
                          <ExternalLink className="h-4 w-4 flex-shrink-0" />
                        </a>
                      ) : (
                        <div className="flex flex-col gap-2">
                          <input
                            type="text"
                            value={editedUrl}
                            onChange={(e) => setEditedUrl(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter URL..."
                          />
                          <p className="text-xs text-gray-500">
                            Enter the full URL including the @https:// prefix
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 mt-6 border-t border-gray-200">
                    <button
                      onClick={() => handleDeleteLesson(selectedWeek ? selectedWeek - 1 : 0, selectedLesson.id)}
                      className="flex items-center text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-5 w-5 mr-2" />
                      Delete {selectedLesson.type === 'exercise' ? 'Exercise' : 'Lesson'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Education;