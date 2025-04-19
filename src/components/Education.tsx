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
  Search
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

const Education: React.FC = () => {
  const [isAddingLesson, setIsAddingLesson] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const [lessonSearchQuery, setLessonSearchQuery] = useState('');

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

  return (
    <div className="flex-1 flex flex-col w-full bg-gray-50">
      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Education</h1>
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
                    <span className="ml-2 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      {week.lessons.length} Lessons
                    </span>
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
                    Add Lesson
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {week.lessons.map((lesson) => (
                  <div key={lesson.id} className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
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
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreHorizontal className="h-5 w-5" />
                      </button>
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
      </main>
    </div>
  );
};

export default Education;