import React, { useState, useEffect } from 'react';
import {
  Heart,
  Activity,
  User,
  BarChart2,
  LineChart as LineChartIcon,
  TrendingUp,
  FileText,
  Plus,
  Edit2,
  Check,
  X,
  Calendar,
  Trash2
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceArea
} from 'recharts';

// Type mappings for metrics
interface MetricTypeMap {
  bp: 'bloodPressure';
  hr: 'heartRate';
  weight: 'weight';
}

const metricTypeToKey: MetricTypeMap = {
  bp: 'bloodPressure',
  hr: 'heartRate',
  weight: 'weight'
} as const;

// Dummy data
const dummyData = {
  bloodPressure: [
    { date: '2025-04-21T09:30:00', systolic: 138, diastolic: 88 },
    { date: '2025-04-14T14:15:00', systolic: 142, diastolic: 92 },
    { date: '2025-04-07T11:45:00', systolic: 135, diastolic: 85 },
    { date: '2025-03-31T16:20:00', systolic: 145, diastolic: 95 },
    { date: '2025-03-24T10:00:00', systolic: 140, diastolic: 90 },
    { date: '2025-03-21T13:45:00', systolic: 132, diastolic: 82 },
  ],
  heartRate: [
    { date: '2025-04-21T09:30:00', value: 72 },
    { date: '2025-04-14T14:15:00', value: 75 },
    { date: '2025-04-07T11:45:00', value: 68 },
    { date: '2025-03-31T16:20:00', value: 70 },
    { date: '2025-03-24T10:00:00', value: 73 },
    { date: '2025-03-21T13:45:00', value: 71 },
  ],
  weight: [
    { date: '2025-04-21T09:30:00', value: 185 },
    { date: '2025-04-14T14:15:00', value: 186 },
    { date: '2025-04-07T11:45:00', value: 184 },
    { date: '2025-03-31T16:20:00', value: 187 },
    { date: '2025-03-24T10:00:00', value: 185 },
    { date: '2025-03-21T13:45:00', value: 188 },
  ],
  notes: [
    {
      id: '1',
      date: '2025-04-21T09:30:00',
      author: 'Dr. Smith',
      content: 'Patient reports feeling better after medication adjustment.',
      type: 'clinical'
    },
    {
      id: '2',
      date: '2025-04-14T14:15:00',
      author: 'Nurse Johnson',
      content: 'Blood pressure slightly elevated, recommended lifestyle modifications.',
      type: 'clinical'
    },
    {
      id: '3',
      date: '2025-03-31T16:20:00',
      author: 'Dr. Smith',
      content: 'Patient started new exercise routine.',
      type: 'general'
    }
  ]
};

interface MetricsProps {
  patient?: {
    vitals?: {
      bloodPressure: {
        date: string;
        systolic: number;
        diastolic: number;
      }[];
      weight: {
        date: string;
        value: number;
      }[];
      heartRate: {
        date: string;
        value: number;
      }[];
    };
    notes?: {
      id: string;
      date: string;
      author: string;
      content: string;
      type: 'clinical' | 'general';
    }[];
  };
}

interface FilteredData {
  bloodPressure: Array<{ date: string; systolic: number; diastolic: number; }>;
  heartRate: Array<{ date: string; value: number; }>;
  weight: Array<{ date: string; value: number; }>;
  notes: Array<{
    id: string;
    date: string;
    author: string;
    content: string;
    type: 'clinical' | 'general';
  }>;
}

const filterDataByDateRange = (data: FilteredData, start: string, end: string): FilteredData => {
  const startDate = new Date(start);
  const endDate = new Date(end);

  return {
    bloodPressure: data.bloodPressure.filter(bp => {
      const date = new Date(bp.date);
      return date >= startDate && date <= endDate;
    }),
    heartRate: data.heartRate.filter(hr => {
      const date = new Date(hr.date);
      return date >= startDate && date <= endDate;
    }),
    weight: data.weight.filter(w => {
      const date = new Date(w.date);
      return date >= startDate && date <= endDate;
    }),
    notes: data.notes.filter(note => {
      const date = new Date(note.date);
      return date >= startDate && date <= endDate;
    })
  };
};

interface NewMetricData {
  type: 'bp' | 'hr' | 'weight';
  date: string;
  time: string;
  systolic?: number;
  diastolic?: number;
  value?: number;
}

const Metrics: React.FC<MetricsProps> = ({ patient }) => {
  const [activeTab, setActiveTab] = useState<'bp' | 'hr' | 'weight' | 'notes'>('bp');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateRange, setDateRange] = useState({ start: '2025-03-21', end: '2025-04-21' });
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [showNewMetricModal, setShowNewMetricModal] = useState(false);
  const [newMetric, setNewMetric] = useState<NewMetricData>({
    type: 'bp',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    systolic: undefined,
    diastolic: undefined,
    value: undefined
  });
  const [filteredData, setFilteredData] = useState<FilteredData>(() => {
    const initialData: FilteredData = patient?.vitals ? {
      bloodPressure: patient.vitals.bloodPressure.map(bp => ({
        ...bp,
        date: bp.date.includes('T') ? bp.date : `${bp.date}T00:00:00`
      })),
      heartRate: patient.vitals.heartRate.map(hr => ({
        ...hr,
        date: hr.date.includes('T') ? hr.date : `${hr.date}T00:00:00`
      })),
      weight: patient.vitals.weight.map(w => ({
        ...w,
        date: w.date.includes('T') ? w.date : `${w.date}T00:00:00`
      })),
      notes: (patient.notes || []).map(note => ({
        ...note,
        type: note.type === 'clinical' ? 'clinical' : 'general'
      }))
    } : {
      bloodPressure: dummyData.bloodPressure,
      heartRate: dummyData.heartRate,
      weight: dummyData.weight,
      notes: dummyData.notes.map(note => ({
        ...note,
        type: note.type === 'clinical' ? 'clinical' : 'general'
      }))
    };
    return filterDataByDateRange(initialData, dateRange.start, dateRange.end);
  });
  const [addingNote, setAddingNote] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [editingMetric, setEditingMetric] = useState<{
    type: 'bp' | 'hr' | 'weight' | null;
    index: number | null;
    data: any;
  }>({ type: null, index: null, data: null });

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const formatDisplayDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatDisplayTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const formatChartDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short',
      day: 'numeric'
    });
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const reading = payload[0].payload;
      const systolicStatus = getStatusText('bp', reading.systolic);
      const systolicColor = getStatusColor('bp', reading.systolic).split(' ')[0];
      
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <div className="border-b border-gray-100 pb-2 mb-2">
            <p className="font-medium text-sm text-gray-900">
              {formatDisplayDate(reading.date)}
            </p>
            <p className="text-xs text-gray-500">
              {formatDisplayTime(reading.date)}
            </p>
          </div>
          <div className="space-y-2">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Systolic</span>
                <span className="font-medium text-sm">{reading.systolic} mmHg</span>
              </div>
              <div className={`text-xs mt-0.5 ${systolicColor.replace('bg-', 'text-')}`}>
                {systolicStatus}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Diastolic</span>
                <span className="font-medium text-sm">{reading.diastolic} mmHg</span>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomizedAxisTick = ({ x, y, payload }: any) => {
    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={16}
          textAnchor="middle"
          fill="#6B7280"
          fontSize="12"
          fontFamily="Inter, system-ui, sans-serif"
        >
          {formatChartDate(payload.value)}
        </text>
      </g>
    );
  };

  useEffect(() => {
    setFilteredData(prev => filterDataByDateRange(prev, dateRange.start, dateRange.end));
  }, [dateRange]);

  const getStatusColor = (type: string, value: number) => {
    if (type === 'bp') {
      if (value < 120) return 'bg-green-100 text-green-800';
      if (value < 130) return 'bg-yellow-100 text-yellow-800';
      return 'bg-red-100 text-red-800';
    }
    if (type === 'hr') {
      if (value >= 60 && value <= 100) return 'bg-green-100 text-green-800';
      return 'bg-yellow-100 text-yellow-800';
    }
    return 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (type: string, value: number) => {
    if (type === 'bp') {
      if (value < 120) return 'Normal';
      if (value < 130) return 'Elevated';
      return 'High';
    }
    if (type === 'hr') {
      if (value >= 60 && value <= 100) return 'Normal';
      if (value < 60) return 'Low';
      return 'High';
    }
    return 'Normal';
  };

  const handleSaveNote = (noteId: string, content: string) => {
    console.log('Saving note:', { noteId, content });
    setEditingNoteId(null);
  };

  const handleAddNote = () => {
    console.log('Adding new note:', newNote);
    setAddingNote(false);
    setNewNote('');
  };

  const handleStartEdit = (type: 'bp' | 'hr' | 'weight', index: number) => {
    const metricKey = metricTypeToKey[type];
    const data = { ...filteredData[metricKey][index] };
    setEditingMetric({ type, index, data });
  };

  const handleCancelEdit = () => {
    setEditingMetric({ type: null, index: null, data: null });
  };

  const handleSaveEdit = () => {
    if (!editingMetric.type || editingMetric.index === null) return;

    const metricKey = metricTypeToKey[editingMetric.type];
    const newData = { ...filteredData } as FilteredData;
    newData[metricKey][editingMetric.index] = editingMetric.data;
    setFilteredData(newData);
    setEditingMetric({ type: null, index: null, data: null });
  };

  const handleEditChange = (field: string, value: string | number) => {
    if (!editingMetric.data) return;
    
    setEditingMetric(prev => ({
      ...prev,
      data: { ...prev.data, [field]: value }
    }));
  };

  const handleDelete = (type: keyof MetricTypeMap, index: number) => {
    const metricKey = metricTypeToKey[type];
    setFilteredData(prev => {
      const newData = { ...prev };
      if (metricKey === 'bloodPressure') {
        newData.bloodPressure = [...prev.bloodPressure];
        newData.bloodPressure.splice(index, 1);
      } else if (metricKey === 'heartRate') {
        newData.heartRate = [...prev.heartRate];
        newData.heartRate.splice(index, 1);
      } else if (metricKey === 'weight') {
        newData.weight = [...prev.weight];
        newData.weight.splice(index, 1);
      } else if (metricKey === 'notes') {
        newData.notes = [...prev.notes];
        newData.notes.splice(index, 1);
      }
      return newData;
    });
  };

  const handleAddNewMetric = () => {
    const metricDate = `${newMetric.date}T${newMetric.time}:00`;
    
    setFilteredData(prev => {
      const newData = { ...prev };
      
      switch (newMetric.type) {
        case 'bp':
          if (newMetric.systolic && newMetric.diastolic) {
            newData.bloodPressure = [
              { date: metricDate, systolic: newMetric.systolic, diastolic: newMetric.diastolic },
              ...newData.bloodPressure
            ];
          }
          break;
        case 'hr':
          if (newMetric.value) {
            newData.heartRate = [
              { date: metricDate, value: newMetric.value },
              ...newData.heartRate
            ];
          }
          break;
        case 'weight':
          if (newMetric.value) {
            newData.weight = [
              { date: metricDate, value: newMetric.value },
              ...newData.weight
            ];
          }
          break;
      }
      
      return newData;
    });

    setShowNewMetricModal(false);
    setNewMetric({
      type: 'bp',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5),
      systolic: undefined,
      diastolic: undefined,
      value: undefined
    });
    setActiveTab(newMetric.type);
  };

  const CustomHeartRateTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const reading = payload[0].payload;
      const status = getStatusText('hr', reading.value);
      const statusColor = getStatusColor('hr', reading.value).split(' ')[0];
      
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <div className="border-b border-gray-100 pb-2 mb-2">
            <p className="font-medium text-sm text-gray-900">
              {formatDisplayDate(reading.date)}
            </p>
            <p className="text-xs text-gray-500">
              {formatDisplayTime(reading.date)}
            </p>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Heart Rate</span>
              <span className="font-medium text-sm">{reading.value} bpm</span>
            </div>
            <div className={`text-xs mt-0.5 ${statusColor.replace('bg-', 'text-')}`}>
              {status}
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomWeightTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const reading = payload[0].payload;
      const prevReading = filteredData.weight[filteredData.weight.findIndex(r => r.date === reading.date) + 1];
      const change = prevReading ? reading.value - prevReading.value : 0;
      
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <div className="border-b border-gray-100 pb-2 mb-2">
            <p className="font-medium text-sm text-gray-900">
              {formatDisplayDate(reading.date)}
            </p>
            <p className="text-xs text-gray-500">
              {formatDisplayTime(reading.date)}
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Weight</span>
              <span className="font-medium text-sm">{reading.value} lbs</span>
            </div>
            {prevReading && (
              <div className={`text-xs ${
                change < 0 ? 'text-green-600' : 
                change > 0 ? 'text-red-600' : 
                'text-gray-600'
              }`}>
                {change === 0 ? 'No change' : 
                 change > 0 ? `+${change} lbs` : 
                 `${change} lbs`}
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Combined Date Range and Tabs Row */}
      <div className="flex items-center justify-between bg-white rounded-lg shadow p-4">
        {/* Date Range Picker */}
        <div className="flex items-center gap-4">
          <h3 className="font-medium">Date Range</h3>
          <div className="relative">
            <div 
              className="flex items-center cursor-pointer hover:text-blue-600"
              onClick={() => setShowDatePicker(!showDatePicker)}
            >
              <Calendar className="h-4 w-4 mr-1.5" />
              <span>
                {formatDisplayDate(dateRange.start)} - {formatDisplayDate(dateRange.end)}
              </span>
            </div>
            {showDatePicker && (
              <div className="absolute z-10 mt-1 left-0 bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="flex p-2 space-x-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Start</label>
                    <input
                      type="date"
                      value={dateRange.start}
                      onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                      className="w-[140px] rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">End</label>
                    <input
                      type="date"
                      value={dateRange.end}
                      onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                      className="w-[140px] rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <button
                  onClick={() => setShowDatePicker(false)}
                  className="absolute top-1 right-1 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Add New Metric Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowNewMetricModal(true)}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Metric
          </button>
          
          {/* Tabs */}
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('bp')}
              className={`flex items-center px-4 py-2 rounded-md ${
                activeTab === 'bp'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Heart className="h-4 w-4 mr-2" />
              Blood Pressure
            </button>
            <button
              onClick={() => setActiveTab('hr')}
              className={`flex items-center px-4 py-2 rounded-md ${
                activeTab === 'hr'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Activity className="h-4 w-4 mr-2" />
              Heart Rate
            </button>
            <button
              onClick={() => setActiveTab('weight')}
              className={`flex items-center px-4 py-2 rounded-md ${
                activeTab === 'weight'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <User className="h-4 w-4 mr-2" />
              Weight
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className={`flex items-center px-4 py-2 rounded-md ${
                activeTab === 'notes'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <FileText className="h-4 w-4 mr-2" />
              Notes
            </button>
          </div>
        </div>
      </div>

      {/* New Metric Modal */}
      {showNewMetricModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Add New Metric</h3>
              <button
                onClick={() => setShowNewMetricModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Metric Type
                </label>
                <select
                  value={newMetric.type}
                  onChange={(e) => setNewMetric(prev => ({ ...prev, type: e.target.value as 'bp' | 'hr' | 'weight' }))}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="bp">Blood Pressure</option>
                  <option value="hr">Heart Rate</option>
                  <option value="weight">Weight</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={newMetric.date}
                    onChange={(e) => setNewMetric(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    value={newMetric.time}
                    onChange={(e) => setNewMetric(prev => ({ ...prev, time: e.target.value }))}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {newMetric.type === 'bp' ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Systolic
                    </label>
                    <input
                      type="number"
                      value={newMetric.systolic || ''}
                      onChange={(e) => setNewMetric(prev => ({ ...prev, systolic: parseInt(e.target.value) }))}
                      placeholder="mmHg"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Diastolic
                    </label>
                    <input
                      type="number"
                      value={newMetric.diastolic || ''}
                      onChange={(e) => setNewMetric(prev => ({ ...prev, diastolic: parseInt(e.target.value) }))}
                      placeholder="mmHg"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {newMetric.type === 'hr' ? 'Heart Rate (bpm)' : 'Weight (lbs)'}
                  </label>
                  <input
                    type="number"
                    value={newMetric.value || ''}
                    onChange={(e) => setNewMetric(prev => ({ ...prev, value: parseInt(e.target.value) }))}
                    placeholder={newMetric.type === 'hr' ? 'bpm' : 'lbs'}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => setShowNewMetricModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddNewMetric}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  disabled={
                    newMetric.type === 'bp' 
                      ? !newMetric.systolic || !newMetric.diastolic
                      : !newMetric.value
                  }
                >
                  Add Metric
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="bg-white rounded-lg shadow">
        {/* Blood Pressure Tab */}
        {activeTab === 'bp' && (
          <div className="p-6">
            <div className="h-72 bg-white rounded-lg mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={[...filteredData.bloodPressure].reverse()}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 20,
                  }}
                >
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    vertical={false}
                    stroke="#E5E7EB"
                  />
                  <XAxis 
                    dataKey="date" 
                    tick={<CustomizedAxisTick />}
                    interval="preserveStartEnd"
                    axisLine={{ stroke: '#E5E7EB' }}
                    tickLine={{ stroke: '#E5E7EB' }}
                  />
                  <YAxis 
                    domain={[40, 200]}
                    ticks={[40, 60, 80, 100, 120, 140, 160, 180, 200]}
                    axisLine={{ stroke: '#E5E7EB' }}
                    tickLine={{ stroke: '#E5E7EB' }}
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                    label={{ 
                      value: 'Blood Pressure (mmHg)', 
                      angle: -90, 
                      position: 'insideLeft',
                      style: { 
                        textAnchor: 'middle',
                        fill: '#6B7280',
                        fontSize: 13,
                        fontFamily: 'Inter, system-ui, sans-serif'
                      }
                    }}
                  />
                  {/* Reference areas for blood pressure ranges */}
                  <ReferenceArea
                    y1={180}
                    y2={200}
                    fill="#FEE2E2"
                    fillOpacity={0.3}
                  />
                  <ReferenceArea
                    y1={140}
                    y2={180}
                    fill="#FEE2E2"
                    fillOpacity={0.2}
                  />
                  <ReferenceArea
                    y1={120}
                    y2={140}
                    fill="#FEF3C7"
                    fillOpacity={0.2}
                  />
                  <ReferenceArea
                    y1={90}
                    y2={120}
                    fill="#DCFCE7"
                    fillOpacity={0.2}
                  />
                  <Tooltip 
                    content={<CustomTooltip />}
                    cursor={{ 
                      stroke: '#6B7280',
                      strokeWidth: 1,
                      strokeDasharray: '5 5'
                    }}
                  />
                  <Legend 
                    verticalAlign="top"
                    height={36}
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{
                      paddingBottom: '10px',
                      fontFamily: 'Inter, system-ui, sans-serif'
                    }}
                  />
                  <Line
                    type="monotoneX"
                    dataKey="systolic"
                    stroke="#DC2626"
                    strokeWidth={2.5}
                    dot={{
                      stroke: '#DC2626',
                      strokeWidth: 2,
                      r: 4,
                      fill: '#FEE2E2'
                    }}
                    activeDot={{
                      stroke: '#DC2626',
                      strokeWidth: 2,
                      r: 6,
                      fill: '#FFFFFF'
                    }}
                    name="Systolic"
                  />
                  <Line
                    type="monotoneX"
                    dataKey="diastolic"
                    stroke="#2563EB"
                    strokeWidth={2.5}
                    dot={{
                      stroke: '#2563EB',
                      strokeWidth: 2,
                      r: 4,
                      fill: '#DBEAFE'
                    }}
                    activeDot={{
                      stroke: '#2563EB',
                      strokeWidth: 2,
                      r: 6,
                      fill: '#FFFFFF'
                    }}
                    name="Diastolic"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Systolic</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Diastolic</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData.bloodPressure.map((reading, index) => (
                    <tr key={index}>
                      {editingMetric.type === 'bp' && editingMetric.index === index ? (
                        <>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="date"
                              value={editingMetric.data.date.split('T')[0]}
                              onChange={(e) => handleEditChange('date', `${e.target.value}T${editingMetric.data.date.split('T')[1]}`)}
                              className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="time"
                              value={editingMetric.data.date.split('T')[1].slice(0, 5)}
                              onChange={(e) => handleEditChange('date', `${editingMetric.data.date.split('T')[0]}T${e.target.value}:00`)}
                              className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="number"
                              value={editingMetric.data.systolic}
                              onChange={(e) => handleEditChange('systolic', parseInt(e.target.value))}
                              className="w-24 rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="number"
                              value={editingMetric.data.diastolic}
                              onChange={(e) => handleEditChange('diastolic', parseInt(e.target.value))}
                              className="w-24 rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor('bp', editingMetric.data.systolic)}`}>
                              {getStatusText('bp', editingMetric.data.systolic)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2">
                            <button
                              onClick={handleSaveEdit}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="text-gray-600 hover:text-gray-900"
                            >
                              <X className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete('bp', index)}
                              className="text-red-400 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDisplayDate(reading.date)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDisplayTime(reading.date)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{reading.systolic} mmHg</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{reading.diastolic} mmHg</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor('bp', reading.systolic)}`}>
                              {getStatusText('bp', reading.systolic)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2">
                            <button
                              onClick={() => handleStartEdit('bp', index)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete('bp', index)}
                              className="text-red-400 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Heart Rate Tab */}
        {activeTab === 'hr' && (
          <div className="p-6">
            <div className="h-72 bg-white rounded-lg mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={[...filteredData.heartRate].reverse()}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 20,
                  }}
                >
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    vertical={false}
                    stroke="#E5E7EB"
                  />
                  <XAxis 
                    dataKey="date" 
                    tick={<CustomizedAxisTick />}
                    interval="preserveStartEnd"
                    axisLine={{ stroke: '#E5E7EB' }}
                    tickLine={{ stroke: '#E5E7EB' }}
                  />
                  <YAxis 
                    domain={[40, 120]}
                    ticks={[40, 50, 60, 70, 80, 90, 100, 110, 120]}
                    axisLine={{ stroke: '#E5E7EB' }}
                    tickLine={{ stroke: '#E5E7EB' }}
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                    label={{ 
                      value: 'Heart Rate (bpm)', 
                      angle: -90, 
                      position: 'insideLeft',
                      style: { 
                        textAnchor: 'middle',
                        fill: '#6B7280',
                        fontSize: 13,
                        fontFamily: 'Inter, system-ui, sans-serif'
                      }
                    }}
                  />
                  {/* Reference areas for heart rate ranges */}
                  <ReferenceArea
                    y1={100}
                    y2={120}
                    fill="#FEE2E2"
                    fillOpacity={0.2}
                  />
                  <ReferenceArea
                    y1={60}
                    y2={100}
                    fill="#DCFCE7"
                    fillOpacity={0.2}
                  />
                  <ReferenceArea
                    y1={40}
                    y2={60}
                    fill="#FEF3C7"
                    fillOpacity={0.2}
                  />
                  <Tooltip 
                    content={<CustomHeartRateTooltip />}
                    cursor={{ 
                      stroke: '#6B7280',
                      strokeWidth: 1,
                      strokeDasharray: '5 5'
                    }}
                  />
                  <Legend 
                    verticalAlign="top"
                    height={36}
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{
                      paddingBottom: '10px',
                      fontFamily: 'Inter, system-ui, sans-serif'
                    }}
                  />
                  <Line
                    type="monotoneX"
                    dataKey="value"
                    stroke="#7C3AED"
                    strokeWidth={2.5}
                    dot={{
                      stroke: '#7C3AED',
                      strokeWidth: 2,
                      r: 4,
                      fill: '#F3E8FF'
                    }}
                    activeDot={{
                      stroke: '#7C3AED',
                      strokeWidth: 2,
                      r: 6,
                      fill: '#FFFFFF'
                    }}
                    name="Heart Rate"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData.heartRate.map((reading, index) => (
                    <tr key={index}>
                      {editingMetric.type === 'hr' && editingMetric.index === index ? (
                        <>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="date"
                              value={editingMetric.data.date.split('T')[0]}
                              onChange={(e) => handleEditChange('date', `${e.target.value}T${editingMetric.data.date.split('T')[1]}`)}
                              className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="time"
                              value={editingMetric.data.date.split('T')[1].slice(0, 5)}
                              onChange={(e) => handleEditChange('date', `${editingMetric.data.date.split('T')[0]}T${e.target.value}:00`)}
                              className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="number"
                              value={editingMetric.data.value}
                              onChange={(e) => handleEditChange('value', parseInt(e.target.value))}
                              className="w-24 rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor('hr', editingMetric.data.value)}`}>
                              {getStatusText('hr', editingMetric.data.value)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                            <button
                              onClick={handleSaveEdit}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="text-gray-600 hover:text-gray-900"
                            >
                              <X className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete('hr', index)}
                              className="text-red-400 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDisplayDate(reading.date)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDisplayTime(reading.date)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{reading.value} bpm</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor('hr', reading.value)}`}>
                              {getStatusText('hr', reading.value)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                            <button
                              onClick={() => handleStartEdit('hr', index)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete('hr', index)}
                              className="text-red-400 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Weight Tab */}
        {activeTab === 'weight' && (
          <div className="p-6">
            <div className="h-72 bg-white rounded-lg mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={[...filteredData.weight].reverse()}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 20,
                  }}
                >
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    vertical={false}
                    stroke="#E5E7EB"
                  />
                  <XAxis 
                    dataKey="date" 
                    tick={<CustomizedAxisTick />}
                    interval="preserveStartEnd"
                    axisLine={{ stroke: '#E5E7EB' }}
                    tickLine={{ stroke: '#E5E7EB' }}
                  />
                  <YAxis 
                    domain={['dataMin - 5', 'dataMax + 5']}
                    axisLine={{ stroke: '#E5E7EB' }}
                    tickLine={{ stroke: '#E5E7EB' }}
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                    label={{ 
                      value: 'Weight (lbs)', 
                      angle: -90, 
                      position: 'insideLeft',
                      style: { 
                        textAnchor: 'middle',
                        fill: '#6B7280',
                        fontSize: 13,
                        fontFamily: 'Inter, system-ui, sans-serif'
                      }
                    }}
                  />
                  <Tooltip 
                    content={<CustomWeightTooltip />}
                    cursor={{ 
                      stroke: '#6B7280',
                      strokeWidth: 1,
                      strokeDasharray: '5 5'
                    }}
                  />
                  <Legend 
                    verticalAlign="top"
                    height={36}
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{
                      paddingBottom: '10px',
                      fontFamily: 'Inter, system-ui, sans-serif'
                    }}
                  />
                  <Line
                    type="monotoneX"
                    dataKey="value"
                    stroke="#059669"
                    strokeWidth={2.5}
                    dot={{
                      stroke: '#059669',
                      strokeWidth: 2,
                      r: 4,
                      fill: '#D1FAE5'
                    }}
                    activeDot={{
                      stroke: '#059669',
                      strokeWidth: 2,
                      r: 6,
                      fill: '#FFFFFF'
                    }}
                    name="Weight"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData.weight.map((reading, index) => {
                    const prevReading = index < filteredData.weight.length - 1 ? filteredData.weight[index + 1] : null;
                    const change = prevReading ? reading.value - prevReading.value : 0;
                    
                    return (
                      <tr key={index}>
                        {editingMetric.type === 'weight' && editingMetric.index === index ? (
                          <>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <input
                                type="date"
                                value={editingMetric.data.date.split('T')[0]}
                                onChange={(e) => handleEditChange('date', `${e.target.value}T${editingMetric.data.date.split('T')[1]}`)}
                                className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <input
                                type="time"
                                value={editingMetric.data.date.split('T')[1].slice(0, 5)}
                                onChange={(e) => handleEditChange('date', `${editingMetric.data.date.split('T')[0]}T${e.target.value}:00`)}
                                className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <input
                                type="number"
                                value={editingMetric.data.value}
                                onChange={(e) => handleEditChange('value', parseInt(e.target.value))}
                                className="w-24 rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {prevReading && (
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                  change < 0
                                    ? 'bg-green-100 text-green-800'
                                    : change > 0
                                      ? 'bg-red-100 text-red-800'
                                      : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {change === 0
                                    ? 'No change'
                                    : change > 0
                                      ? `+${change} lbs`
                                      : `${change} lbs`}
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                              <button
                                onClick={handleSaveEdit}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                <Check className="h-4 w-4" />
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="text-gray-600 hover:text-gray-900"
                              >
                                <X className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDelete('weight', index)}
                                className="text-red-400 hover:text-red-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDisplayDate(reading.date)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDisplayTime(reading.date)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{reading.value} lbs</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {prevReading && (
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                  change < 0
                                    ? 'bg-green-100 text-green-800'
                                    : change > 0
                                      ? 'bg-red-100 text-red-800'
                                      : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {change === 0
                                    ? 'No change'
                                    : change > 0
                                      ? `+${change} lbs`
                                      : `${change} lbs`}
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                              <button
                                onClick={() => handleStartEdit('weight', index)}
                                className="text-gray-400 hover:text-gray-600"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDelete('weight', index)}
                                className="text-red-400 hover:text-red-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Notes Tab */}
        {activeTab === 'notes' && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-medium">Metrics Notes</h3>
              <button
                onClick={() => setAddingNote(true)}
                className="flex items-center text-sm text-blue-600 hover:text-blue-700"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Note
              </button>
            </div>

            {addingNote && (
              <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Enter your note..."
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                  rows={3}
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setAddingNote(false);
                      setNewNote('');
                    }}
                    className="px-3 py-1 text-sm text-gray-600 hover:text-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddNote}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Save Note
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {filteredData.notes.map((note) => (
                <div key={note.id} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                  {editingNoteId === note.id ? (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <textarea
                        defaultValue={note.content}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                        rows={3}
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setEditingNoteId(null)}
                          className="px-3 py-1 text-sm text-gray-600 hover:text-gray-700"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSaveNote(note.id, note.content)}
                          className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="text-sm font-medium">{note.author}</span>
                          <span className="text-sm text-gray-500 ml-2">{note.date}</span>
                          <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                            note.type === 'clinical' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {note.type.charAt(0).toUpperCase() + note.type.slice(1)}
                          </span>
                        </div>
                        <button
                          onClick={() => setEditingNoteId(note.id)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-gray-600">{note.content}</p>
                    </div>
                  )}
                </div>
              ))}

              {(!filteredData.notes || filteredData.notes.length === 0) && !addingNote && (
                <div className="text-center text-gray-500 py-4">
                  No notes available
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Metrics; 