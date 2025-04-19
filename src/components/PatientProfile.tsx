{/* patient profile */}
import React, { useState, useRef, useEffect } from 'react';
import Assessments from './Assessments';
import GoalProgress from './GoalProgress';
import Education from './Education';
import ClinicalCarePlan from './ClinicalCarePlan';
import AppointmentDetails from './AppointmentDetails';
import { 
  ArrowLeft, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar as CalendarIcon, 
  Heart, 
  Activity, 
  FileText, 
  MessageSquare, 
  Clock, 
  Package, 
  User, 
  Edit, 
  MoreHorizontal,
  MoreVertical,
  ChevronDown, 
  ChevronUp,
  AlertTriangle,
  CheckCircle,
  PieChart,
  BarChart2,
  TrendingUp,
  Plus,
  Share,
  X,
  Calendar,
  Check,
  Edit2
} from 'lucide-react';

interface CareTeamOptions {
  providers: string[];
  coaches: string[];
  therapists: string[];
}

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

interface PatientProfileProps {
  patient: {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    dateOfBirth: string;
    age: number;
    gender: string;
    provider: string;
    coach: string;
    therapist: string;
    dateStarted: string;
    group: string;
    bpReadings: number;
    totalRPM: number;
    totalPCM: number;
    totalBHI: number;
    totalBP: number;
    tags: string[];
    healthieId: string;
    mrn: string;
    medicalHistory?: {
      conditions: string[];
      medications: {
        name: string;
        dosage: string;
        frequency: string;
      }[];
      allergies: string[];
    };
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
    appointments?: {
      id: string;
      date: string;
      time: string;
      type: string;
      provider: string;
      coach: string;
      duration: string;
      status: 'scheduled' | 'completed' | 'cancelled';
    }[];
    tasks?: {
      id: string;
      title: string;
      dueDate: string;
      status: 'pending' | 'completed' | 'overdue';
      assignedTo: string;
    }[];
    goals?: Goal[];
    goalprogress?: any;
    education?: any;
    assessments?: any;
  };
  onBack: () => void;
}

const PatientProfile: React.FC<PatientProfileProps> = ({ patient, onBack }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'vitals' | 'care-plan' | 'goal-progress' | 'assessments' | 'education'>('overview');
  const [editingGroup, setEditingGroup] = useState(false);
  const [editingDateStarted, setEditingDateStarted] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(patient.group);
  const [dateStarted, setDateStarted] = useState(patient.dateStarted);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [appointmentFilter, setAppointmentFilter] = useState<'upcoming' | 'past' | 'cancelled'>('upcoming');
  const [showAllAppointments, setShowAllAppointments] = useState(false);
  const [medicalHistoryExpanded, setMedicalHistoryExpanded] = useState(true);
  const [medicationsExpanded, setMedicationsExpanded] = useState(true);
  const [allergiesExpanded, setAllergiesExpanded] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState<any | null>(null);
  const [showAppointmentDetails, setShowAppointmentDetails] = useState(false);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const monthPickerRef = useRef<HTMLDivElement>(null);
  const [editMode, setEditMode] = useState<string | null>(null);
  const [editedValues, setEditedValues] = useState({
    name: patient.name,
    phone: patient.phone,
    email: patient.email,
    address: patient.address,
    dateOfBirth: patient.dateOfBirth
  });
  const [editingCareTeam, setEditingCareTeam] = useState<string | null>(null);
  const [editedCareTeam, setEditedCareTeam] = useState({
    provider: patient.provider,
    coach: patient.coach,
    therapist: patient.therapist
  });
  const [editingMedicalHistory, setEditingMedicalHistory] = useState(false);
  const [editedMedicalHistory, setEditedMedicalHistory] = useState(patient.medicalHistory || {
    conditions: [],
    medications: [],
    allergies: []
  });
  const [editingMedications, setEditingMedications] = useState(false);
  const [editingAllergies, setEditingAllergies] = useState(false);
  const availableGroups = [
    'Active Bi-Weekly',
    'Monthly Check-in',
    'High Risk',
    'On Hold',
    'Graduated'
  ];

  const careTeamOptions: CareTeamOptions = {
    providers: [
      'Dr. Adam Silver',
      'Dr. Sarah Johnson',
      'Dr. Michael Chen',
      'Dr. Emily White'
    ],
    coaches: [
      'Hannah Wright',
      'Robert Chen',
      'Cindy Parnell',
      'Sarah Wilson'
    ],
    therapists: [
      'Alisa Fishman',
      'David Thompson',
      'Lisa Anderson',
      'Mark Rodriguez'
    ]
  };

  const editableFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editMode && editableFieldRef.current) {
      editableFieldRef.current.focus();
    }
  }, [editMode]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (monthPickerRef.current && !monthPickerRef.current.contains(event.target as Node)) {
        setShowMonthPicker(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const years = Array.from({ length: 3 }, (_, i) => new Date().getFullYear() - 1 + i);

  const handleMonthChange = (month: number, year: number) => {
    setSelectedMonth(new Date(year, month));
    setShowMonthPicker(false);
  };

  const handleEditClick = (field: string) => {
    setEditMode(field);
    setEditedValues(prev => ({
      ...prev,
      [field]: patient[field as keyof typeof patient]
    }));
  };

  const handleSave = (field: string) => {
    console.log('Saving', field, editedValues[field as keyof typeof editedValues]);
    setEditMode(null);
  };

  const handleCancel = () => {
    setEditMode(null);
    setEditedValues({
      name: patient.name,
      phone: patient.phone,
      email: patient.email,
      address: patient.address,
      dateOfBirth: patient.dateOfBirth
    });
  };

  const handleCareTeamEdit = (field: string) => {
    setEditingCareTeam(field);
  };

  const handleCareTeamSave = (field: string) => {
    console.log('Saving care team update:', field, editedCareTeam[field as keyof typeof editedCareTeam]);
    setEditingCareTeam(null);
  };

  const handleCareTeamCancel = () => {
    setEditingCareTeam(null);
    setEditedCareTeam({
      provider: patient.provider,
      coach: patient.coach,
      therapist: patient.therapist
    });
  };

  const handleGroupSave = () => {
    console.log('Saving group:', selectedGroup);
    setEditingGroup(false);
  };

  const handleDateSave = () => {
    console.log('Saving date started:', dateStarted);
    setEditingDateStarted(false);
  };

  const handleScheduleClick = () => {
    console.log('Schedule appointment clicked');
    // Add your scheduling logic here
  };

  const renderCareTeamField = (
    field: 'provider' | 'coach' | 'therapist',
    label: string,
    options: string[]
  ) => {
    const isEditing = editingCareTeam === field;
    const value = editedCareTeam[field];

    return (
      <div className="flex justify-between items-center py-2">
        <span className="text-sm">{label}</span>
        {isEditing ? (
          <div className="flex items-center gap-2">
            <select
              value={value}
              onChange={(e) => setEditedCareTeam(prev => ({ ...prev, [field]: e.target.value }))}
              className="p-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select {label}</option>
              {options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <button
              onClick={() => handleCareTeamSave(field)}
              className="p-1 text-green-600 hover:text-green-700"
            >
              <Check className="h-4 w-4" />
            </button>
            <button
              onClick={handleCareTeamCancel}
              className="p-1 text-red-600 hover:text-red-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{value || 'Not assigned'}</span>
            <button
              onClick={() => handleCareTeamEdit(field)}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-gray-400 hover:text-gray-600"
            >
              <Edit className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderEditableField = (
    field: string,
    value: string,
    icon: React.ReactNode,
    label: string
  ) => {
    const isEditing = editMode === field;

    return (
      <div className="flex items-start">
        {icon}
        <div className="flex-1">
          <p className="text-sm text-gray-500">{label}</p>
          {isEditing ? (
            <div className="flex items-center gap-2">
              <input
                ref={editableFieldRef}
                type="text"
                value={editedValues[field as keyof typeof editedValues]}
                onChange={(e) => setEditedValues(prev => ({ ...prev, [field]: e.target.value }))}
                className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSave(field);
                  if (e.key === 'Escape') handleCancel();
                }}
              />
              <button
                onClick={() => handleSave(field)}
                className="p-1 text-green-600 hover:text-green-700"
              >
                <Check className="h-4 w-4" />
              </button>
              <button
                onClick={handleCancel}
                className="p-1 text-red-600 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center group">
              <p className="flex-1">{value}</p>
              <button
                onClick={() => handleEditClick(field)}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-gray-400 hover:text-gray-600"
              >
                <Edit className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const calculateRiskLevel = () => {
    if (!patient.vitals?.bloodPressure || patient.vitals.bloodPressure.length === 0) {
      return 'unknown';
    }
    
    const latestBP = patient.vitals.bloodPressure[0];
    if (latestBP.systolic >= 140 || latestBP.diastolic >= 90) {
      return 'high';
    } else if (latestBP.systolic >= 130 || latestBP.diastolic >= 80) {
      return 'moderate';
    } else {
      return 'low';
    }
  };

  const riskLevel = calculateRiskLevel();
  const riskColor = riskLevel === 'high' ? 'text-red-600' : riskLevel === 'moderate' ? 'text-amber-500' : 'text-green-600';

  const getFilteredAppointments = () => {
    if (!patient.appointments) return [];
    
    const today = new Date();
    
    return patient.appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      
      switch (appointmentFilter) {
        case 'upcoming':
          return appointmentDate >= today && appointment.status === 'scheduled';
        case 'past':
          return appointmentDate < today && appointment.status === 'completed';
        case 'cancelled':
          return appointment.status === 'cancelled';
        default:
          return true;
      }
    }).slice(0, showAllAppointments ? undefined : 3);
  };

  const formatAppointmentDate = (dateStr: string) => {
    const [month, day, year] = dateStr.split('/');
    return {
      month,
      day,
      year: `'${year.slice(-2)}`
    };
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <header className="80 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button 
              onClick={onBack}
              className="mr-4 p-2 hover:bg-gray-100 rounded-full"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold">{patient.name}</h1>
                {patient.tags.includes('at high risk') && (
                  <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full flex items-center">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    High Risk
                  </span>
                )}
                {patient.tags.includes('out of state') && (
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    Out of State
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600">{patient.age} years old • {patient.gender}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="flex items-center px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">
              <MessageSquare className="h-4 w-4 mr-1.5" />
              Message
            </button>
            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
              <MoreHorizontal className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Tabs Bar with Month Selector */}
      <div className="bg-white border-b border-gray-200 px-6 flex items-center justify-between">
        {/* Tabs Navigation */}
        <div className="flex space-x-6">
          <button 
            className={`py-4 px-1 text-sm font-medium border-b-2 ${
              activeTab === 'overview' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`py-4 px-1 text-sm font-medium border-b-2 ${
              activeTab === 'vitals' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('vitals')}
          >
            Metrics
          </button>
          <button 
            className={`py-4 px-1 text-sm font-medium border-b-2 ${
              activeTab === 'care-plan' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('care-plan')}
          >
            Care Plan
          </button>
          <button 
            className={`py-4 px-1 text-sm font-medium border-b-2 ${
              activeTab === 'goal-progress' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('goal-progress')}
          >
            Goal Progress
          </button>
          <button 
            className={`py-4 px-1 text-sm font-medium border-b-2 ${
              activeTab === 'assessments' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('assessments')}
          >
            Assessments
          </button>
          <button 
            className={`py-4 px-1 text-sm font-medium border-b-2 ${
              activeTab === 'education' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('education')}
          >
            Education
          </button>
        </div>

        {/* Month Display and Stats */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="text-sm text-blue-600 font-medium relative" ref={monthPickerRef}>
              <button
                onClick={() => setShowMonthPicker(!showMonthPicker)}
                className="flex items-center space-x-1 hover:text-blue-700"
              >
                <span>{months[selectedMonth.getMonth()].substring(0, 3)}</span>
                <ChevronDown className="h-4 w-4" />
              </button>

              {showMonthPicker && (
                <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50 min-w-[280px]">
                  <div className="grid grid-cols-3 gap-1 mb-4">
                    {months.map((month, index) => (
                      <button
                        key={month}
                        onClick={() => handleMonthChange(index, selectedMonth.getFullYear())}
                        className={`px-2 py-1 text-sm rounded transition-colors ${
                          index === selectedMonth.getMonth() && selectedMonth.getFullYear() === selectedMonth.getFullYear()
                            ? 'bg-blue-600 text-white'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        {month.substring(0, 3)}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-center gap-2 border-t pt-2">
                    {years.map(year => (
                      <button
                        key={year}
                        onClick={() => handleMonthChange(selectedMonth.getMonth(), year)}
                        className={`px-3 py-1 text-sm rounded transition-colors ${
                          year === selectedMonth.getFullYear()
                            ? 'bg-blue-600 text-white'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        {year}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-xl font-bold text-gray-900">
                  {patient.totalPCM || 0}
                </div>
                <div className="text-xs text-gray-500">PCM</div>
              </div>

              <div className="text-center">
                <div className="text-xl font-bold text-gray-900">
                  {patient.totalRPM || 0}
                </div>
                <div className="text-xs text-gray-500">RPM</div>
              </div>

              <div className="text-center">
                <div className="text-xl font-bold text-gray-900">
                  {patient.totalBHI || 0}
                </div>
                <div className="text-xs text-gray-500">BHI</div>
              </div>

              <div className="text-center">
                <div className="text-xl font-bold text-gray-900">
                  {patient.totalBP || 0}
                </div>
                <div className="text-xs text-gray-500">BP</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column - Patient info */}
            <div className="lg:col-span-1 space-y-6">
              {/* Basic info card */}
              <div className="bg-white rounded-lg shadow">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-medium mr-4">
                        {patient.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        {editMode === 'name' ? (
                          <div className="flex items-center gap-2">
                            <input
                              ref={editableFieldRef}
                              type="text"
                              value={editedValues.name}
                              onChange={(e) => setEditedValues(prev => ({ ...prev, name: e.target.value }))}
                              className="text-xl font-bold p-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSave('name');
                                if (e.key === 'Escape') handleCancel();
                              }}
                            />
                            <button
                              onClick={() => handleSave('name')}
                              className="p-1 text-green-600 hover:text-green-700"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              onClick={handleCancel}
                              className="p-1 text-red-600 hover:text-red-700"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="group flex items-center gap-2">
                            <h2 className="text-xl font-bold">{patient.name}</h2>
                            <button
                              onClick={() => handleEditClick('name')}
                              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-gray-400 hover:text-gray-600"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                        <p className="text-gray-500">{patient.age} years old • {patient.gender}</p>
                      </div>
                    </div>
                    <div className={`text-sm font-medium ${riskColor} flex items-center`}>
                      {riskLevel === 'high' ? (
                        <>
                          <AlertTriangle className="h-4 w-4 mr-1" />
                          High Risk
                        </>
                      ) : riskLevel === 'moderate' ? (
                        <>
                          <AlertTriangle className="h-4 w-4 mr-1" />
                          Moderate Risk
                        </>
                      ) : riskLevel === 'low' ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Low Risk
                        </>
                      ) : (
                        'Risk Unknown'
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {renderEditableField(
                      'phone',
                      patient.phone,
                      <Phone className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />,
                      'Phone'
                    )}
                    
                    {renderEditableField(
                      'email',
                      patient.email,
                      <Mail className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />,
                      'Email'
                    )}
                    
                    {renderEditableField(
                      'address',
                      patient.address,
                      <MapPin className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />,
                      'Address'
                    )}
                    
                    {renderEditableField(
                      'dateOfBirth',
                      patient.dateOfBirth,
                      <Calendar className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />,
                      'Date of Birth'
                    )}
                  </div>
                </div>
                
                <div className="border-t border-gray-200 px-6 py-4 group">
                  <h3 className="text-sm font-medium text-gray-500 mb-3">Care Team</h3>
                  <div className="space-y-3">
                    {renderCareTeamField('provider', 'Provider', careTeamOptions.providers)}
                    {renderCareTeamField('coach', 'Coach', careTeamOptions.coaches)}
                    {renderCareTeamField('therapist', 'Therapist', careTeamOptions.therapists)}
                  </div>
                </div>
                
                <div className="border-t border-gray-200 px-6 py-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-3">Program Details</h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center group">
                      <span className="text-sm">Group</span>
                      {editingGroup ? (
                        <div className="flex items-center space-x-2">
                          <select
                            value={selectedGroup}
                            onChange={(e) => setSelectedGroup(e.target.value)}
                            className="text-sm font-medium border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            {availableGroups.map(group => (
                              <option key={group} value={group}>{group}</option>
                            ))}
                          </select>
                          <button
                            onClick={handleGroupSave}
                            className="p-1 text-green-600 hover:text-green-700"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setEditingGroup(false)}
                            className="p-1 text-red-600 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium">{selectedGroup}</span>
                          <button
                            onClick={() => setEditingGroup(true)}
                            className="p-1 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100  transition-opacity"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center group">
                      <span className="text-sm">Date Started</span>
                      {editingDateStarted ? (
                        <div className="flex items-center space-x-2">
                          <div className="relative">
                            <input
                              type="date"
                              value={dateStarted}
                              onChange={(e) => setDateStarted(e.target.value)}
                              className="text-sm font-medium border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <button
                            onClick={handleDateSave}
                            className="p-1 text-green-600 hover:text-green-700"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setEditingDateStarted(false)}
                            className="p-1 text-red-600 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium">{dateStarted}</span>
                          <button
                            onClick={() => setEditingDateStarted(true)}
                            className="p-1 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm">Healthie ID</span>
                      <span className="text-sm font-medium">{patient.healthieId}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm">MRN Number</span>
                      <span className="text-sm font-medium">{patient.mrn}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Quick actions */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-medium mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button className="flex flex-col items-center justify-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <Calendar className="h-6 w-6 text-blue-600 mb-2" />
                    <span className="text-sm">Schedule</span>
                  </button>
                  
                  <button className="flex flex-col items-center justify-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <MessageSquare className="h-6 w-6 text-blue-600 mb-2" />
                    <span className="text-sm">Message</span>
                  </button>
                  
                  <button className="flex flex-col items-center justify-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <Package className="h-6 w-6 text-blue-600 mb-2" />
                    <span className="text-sm">Order Kit</span>
                  </button>
                  
                  <button className="flex flex-col items-center justify-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <FileText className="h-6 w-6 text-blue-600 mb-2" />
                    <span className="text-sm">Care Plan</span>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Right column - Medical info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Recent appointments */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium">Appointments</h3>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleScheduleClick}
                      className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                    >
                      <Plus className="h-4 w-4 mr-1.5" />
                      Schedule
                    </button>
                    <div className="flex space-x-2">
                      <button 
                        className={`px-3 py-1 text-sm rounded-full transition-colors ${
                          appointmentFilter === 'upcoming' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                        onClick={() => setAppointmentFilter('upcoming')}
                      >
                        Upcoming
                      </button>
                      <button 
                        className={`px-3 py-1 text-sm rounded-full transition-colors ${
                          appointmentFilter === 'past' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                        onClick={() => setAppointmentFilter('past')}
                      >
                        Past
                      </button>
                      <button 
                        className={`px-3 py-1 text-sm rounded-full transition-colors ${
                          appointmentFilter === 'cancelled' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                        onClick={() => setAppointmentFilter('cancelled')}
                      >
                        Cancelled
                      </button>
                    </div>
                  </div>
                </div>

                {getFilteredAppointments().length > 0 ? (
                  <>
                    <div className="space-y-4">
                      {getFilteredAppointments().map((appointment) => {
                        const date = formatAppointmentDate(appointment.date);
                        return (
                          <div
                            key={appointment.id}
                            className="flex items-start border-b border-gray-100 pb-3 last:border-0 last:pb-0 cursor-pointer hover:bg-gray-50 p-2 rounded"
                            onClick={() => {
                              const [month, day, year] = appointment.date.split('/');
                              setSelectedAppointment({
                                ...appointment,
                                month,
                                day,
                              });
                              setShowAppointmentDetails(true);
                            }}
                          >
                            {/* Appointment date card */}
                            <div className="w-12 h-16 bg-blue-100 rounded-lg flex flex-col items-center justify-center text-blue-600 mr-3">
                              <span className="text-[10px] font-medium">{date.month}</span>
                              <span className="text-lg font-bold leading-none mt-0.5">{date.day}</span>
                              <span className="text-[10px] font-light text-gray-500 mt-0.5">{date.year}</span>
                            </div>

                            {/* Appointment info */}
                            <div className="flex-1">
                              <div className="font-medium text-sm sm:text-base">{appointment.type}</div>
                              <div className="text-sm text-gray-500 mt-0.5">
                                {appointment.time} • {appointment.coach} • {appointment.duration}
                              </div>
                            </div>

                            {/* Status badge */}
                            <div
                              className={`text-xs px-2 py-1 rounded-full ${
                                appointment.status === 'completed'
                                  ? 'bg-green-100 text-green-800'
                                  : appointment.status === 'cancelled'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Show more/less toggle */}
                    {patient.appointments && patient.appointments.length > 3 && (
                      <div className="text-center mt-4">
                        <button
                          onClick={() => setShowAllAppointments((prev) => !prev)}
                          className="text-sm text-blue-600 hover:underline"
                        >
                          {showAllAppointments ? 'Show less' : 'Show all appointments'}
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center text-gray-500 py-4">
                    No {appointmentFilter} appointments found
                  </div>
                )}
              </div>

              {/* Vitals summary */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-medium mb-4">Recent Metrics</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <Heart className="h-5 w-5 text-red-500 mr-2" />
                        <span className="font-medium">Blood Pressure</span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {patient.vitals?.bloodPressure?.[0]?.date || 'No data'}
                      </span>
                    </div>
                    
                    {patient.vitals?.bloodPressure?.[0] ? (
                      <div className="flex items-end">
                        <div className="text-2xl font-bold">
                          {patient.vitals.bloodPressure[0].systolic}/{patient.vitals.bloodPressure[0].diastolic}
                        </div>
                        <div className="ml-1 text-sm text-gray-500 mb-1">mmHg</div>
                      </div>
                    ) : (
                      <div className="text-gray-500">No recent readings</div>
                    )}
                    
                    {patient.vitals?.bloodPressure?.[0] && (
                      <div className={`text-xs mt-1 ${
                        patient.vitals.bloodPressure[0].systolic >= 140 || patient.vitals.bloodPressure[0].diastolic >= 90
                          ? 'text-red-600'
                          : patient.vitals.bloodPressure[0].systolic >= 130 || patient.vitals.bloodPressure[0].diastolic >= 80
                            ? 'text-amber-500'
                            : 'text-green-600'
                      }`}>
                        {patient.vitals.bloodPressure[0].systolic >= 140 || patient.vitals.bloodPressure[0].diastolic >= 90
                          ? 'High'
                          : patient.vitals.bloodPressure[0].systolic >= 130 || patient.vitals.bloodPressure[0].diastolic >= 80
                            ? 'Elevated'
                            : 'Normal'}
                      </div>
                    )}
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <Activity className="h-5 w-5 text-blue-500 mr-2" />
                        <span className="font-medium">Heart Rate</span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {patient.vitals?.heartRate?.[0]?.date || 'No data'}
                      </span>
                    </div>
                    
                    {patient.vitals?.heartRate?.[0] ? (
                      <div className="flex items-end">
                        <div className="text-2xl font-bold">
                          {patient.vitals.heartRate[0].value}
                        </div>
                        <div className="ml-1 text-sm text-gray-500 mb-1">bpm</div>
                      </div>
                    ) : (
                      <div className="text-gray-500">No recent readings</div>
                    )}
                    
                    {patient.vitals?.heartRate?.[0] && (
                      <div className={`text-xs mt-1 ${
                        patient.vitals.heartRate[0].value > 100
                          ? 'text-red-600'
                          : patient.vitals.heartRate[0].value < 60
                            ? 'text-amber-500'
                            : 'text-green-600'
                      }`}>
                        {patient.vitals.heartRate[0].value > 100
                          ? 'Elevated'
                          : patient.vitals.heartRate[0].value < 60
                            ? 'Low'
                            : 'Normal'}
                      </div>
                    )}
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <User className="h-5 w-5 text-green-500 mr-2" />
                        <span className="font-medium">Weight</span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {patient.vitals?.weight?.[0]?.date || 'No data'}
                      </span>
                    </div>
                    
                    {patient.vitals?.weight?.[0] ? (
                      <div className="flex items-end">
                        <div className="text-2xl font-bold">
                          {patient.vitals.weight[0].value}
                        </div>
                        <div className="ml-1 text-sm text-gray-500 mb-1">lbs</div>
                      </div>
                    ) : (
                      <div className="text-gray-500">No recent readings</div>
                    )}
                    
                    {patient.vitals?.weight?.[1] && patient.vitals?.weight?.[0] && (
                      <div className={`text-xs mt-1 flex items-center ${
                        patient.vitals.weight[0].value < patient.vitals.weight[1].value
                          ? 'text-green-600'
                          : patient.vitals.weight[0].value > patient.vitals.weight[1].value
                            ? 'text-red-600'
                            : 'text-gray-600'
                      }`}>
                        {patient.vitals.weight[0].value < patient.vitals.weight[1].value ? (
                          <>
                            <TrendingUp className="h-3 w-3 mr-1" />
                            {Math.abs(patient.vitals.weight[0].value - patient.vitals.weight[1].value)} lbs decrease
                          </>
                        ) : patient.vitals.weight[0].value > patient.vitals.weight[1].value ? (
                          <>
                            <TrendingUp className="h-3 w-3 mr-1" />
                            {Math.abs(patient.vitals.weight[0].value - patient.vitals.weight[1].value)} lbs increase
                          </>
                        ) : (
                          'No change'
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mt-4 text-right">
                  <button 
                    className="text-blue-600 text-sm hover:underline"
                    onClick={() => setActiveTab('vitals')}
                  >
                    View all metrics
                  </button>
                </div>
              </div>
              
              {/* Medical history */}
              <div className="bg-white rounded-lg shadow">
                <div 
                  className="p-6 flex items-center justify-between"
                  onClick={() => setMedicalHistoryExpanded(!medicalHistoryExpanded)}
                >
                  <h3 className="font-medium">Medical History</h3>
                  <div className="flex items-center gap-2">
                    {medicalHistoryExpanded && (
                      editingMedicalHistory ? (
                        <>
                          <button
                            onClick={() => {
                              console.log('Saving medical history:', editedMedicalHistory);
                              setEditingMedicalHistory(false);
                            }}
                            className="text-green-600 hover:text-green-700"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              setEditedMedicalHistory(patient.medicalHistory || { conditions: [], medications: [], allergies: [] });
                              setEditingMedicalHistory(false);
                            }}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingMedicalHistory(true);
                          }}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      )
                    )}
                    {medicalHistoryExpanded ? (
                      <ChevronUp className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </div>

                {medicalHistoryExpanded && (
                  <div className="px-6 pb-6">
                    {editingMedicalHistory ? (
                      <div className="space-y-3">
                        {editedMedicalHistory.conditions.map((condition, index) => (
                          <input
                            key={index}
                            type="text"
                            value={condition}
                            onChange={(e) => {
                              const updated = [...editedMedicalHistory.conditions];
                              updated[index] = e.target.value;
                              setEditedMedicalHistory(prev => ({ ...prev, conditions: updated }));
                            }}
                            className="w-full p-2 border border-gray-300 rounded"
                          />
                        ))}
                        <button
                          onClick={() =>
                            setEditedMedicalHistory(prev => ({
                              ...prev,
                              conditions: [...prev.conditions, '']
                            }))
                          }
                          className="text-sm text-blue-600 hover:underline"
                        >
                          + Add Condition
                        </button>
                      </div>
                    ) : (
                      <>
                        {patient.medicalHistory?.conditions && patient.medicalHistory.conditions.length > 0 ? (
                          <div className="space-y-2">
                            {patient.medicalHistory.conditions.map((condition, index) => (
                              <div key={index} className="flex items-center">
                                <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
                                <span>{condition}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500">No medical conditions recorded</p>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
              
              {/* Medications */}
              <div className="bg-white rounded-lg shadow">
                <div 
                  className="p-6 flex items-center justify-between cursor-pointer"
                  onClick={() => setMedicationsExpanded(!medicationsExpanded)}
                >
                  <h3 className="font-medium">Medications</h3>
                  <div className="flex items-center gap-2">
                    {medicationsExpanded && (
                      editingMedications ? (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log('Saving medications:', editedMedicalHistory.medications);
                              setEditingMedications(false);
                            }}
                            className="text-green-600 hover:text-green-700"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditedMedicalHistory(prev => ({
                                ...prev,
                                medications: patient.medicalHistory?.medications || []
                              }));
                              setEditingMedications(false);
                            }}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingMedications(true);
                          }}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      )
                    )}
                    {medicationsExpanded ? (
                      <ChevronUp className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </div>

                {medicationsExpanded && (
                  <div className="px-6 pb-6">
                    {editingMedications ? (
                      <div className="space-y-4">
                        {editedMedicalHistory.medications.map((medication, index) => (
                          <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-2">
                            <input
                              type="text"
                              placeholder="Medication Name"
                              value={medication.name}
                              onChange={(e) => {
                                const updated = [...editedMedicalHistory.medications];
                                updated[index].name = e.target.value;
                                setEditedMedicalHistory(prev => ({ ...prev, medications: updated }));
                              }}
                              className="p-2 border border-gray-300 rounded"
                            />
                            <input
                              type="text"
                              placeholder="Dosage"
                              value={medication.dosage}
                              onChange={(e) => {
                                const updated = [...editedMedicalHistory.medications];
                                updated[index].dosage = e.target.value;
                                setEditedMedicalHistory(prev => ({ ...prev, medications: updated }));
                              }}
                              className="p-2 border border-gray-300 rounded"
                            />
                            <input
                              type="text"
                              placeholder="Frequency"
                              value={medication.frequency}
                              onChange={(e) => {
                                const updated = [...editedMedicalHistory.medications];
                                updated[index].frequency = e.target.value;
                                setEditedMedicalHistory(prev => ({ ...prev, medications: updated }));
                              }}
                              className="p-2 border border-gray-300 rounded"
                            />
                          </div>
                        ))}

                        <button
                          onClick={() =>
                            setEditedMedicalHistory(prev => ({
                              ...prev,
                              medications: [...prev.medications, { name: '', dosage: '', frequency: '' }]
                            }))
                          }
                          className="mt-2 text-sm text-blue-600 hover:underline"
                        >
                          + Add Medication
                        </button>
                      </div>
                    ) : (
                      <>
                        {patient.medicalHistory?.medications && patient.medicalHistory.medications.length > 0 ? (
                          <div className="space-y-4">
                            {patient.medicalHistory.medications.map((medication, index) => (
                              <div key={index} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                                <div className="font-medium">{medication.name}</div>
                                <div className="text-sm text-gray-600 mt-1">
                                  {medication.dosage} • {medication.frequency}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500">No medications recorded</p>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Allergies */}
              <div className="bg-white rounded-lg shadow">
                <div 
                  className="p-6 flex items-center justify-between cursor-pointer"
                  onClick={() => setAllergiesExpanded(!allergiesExpanded)}
                >
                  <h3 className="font-medium">Allergies</h3>
                  <div className="flex items-center gap-2">
                    {allergiesExpanded && (
                      editingAllergies ? (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log('Saving allergies:', editedMedicalHistory.allergies);
                              setEditingAllergies(false);
                            }}
                            className="text-green-600 hover:text-green-700"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditedMedicalHistory(prev => ({
                                ...prev,
                                allergies: patient.medicalHistory?.allergies || []
                              }));
                              setEditingAllergies(false);
                            }}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingAllergies(true);
                          }}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      )
                    )}
                    {allergiesExpanded ? (
                      <ChevronUp className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </div>

                {allergiesExpanded && (
                  <div className="px-6 pb-6">
                    {editingAllergies ? (
                      <div className="space-y-3">
                        {editedMedicalHistory.allergies.map((allergy, index) => (
                          <input
                            key={index}
                            type="text"
                            value={allergy}
                            onChange={(e) => {
                              const updated = [...editedMedicalHistory.allergies];
                              updated[index] = e.target.value;
                              setEditedMedicalHistory(prev => ({ ...prev, allergies: updated }));
                            }}
                            className="w-full p-2 border border-gray-300 rounded"
                          />
                        ))}
                        <button
                          onClick={() =>
                            setEditedMedicalHistory(prev => ({
                              ...prev,
                              allergies: [...prev.allergies, '']
                            }))
                          }
                          className="text-sm text-blue-600 hover:underline"
                        >
                          + Add Allergy
                        </button>
                      </div>
                    ) : (
                      <>
                        {patient.medicalHistory?.allergies && patient.medicalHistory.allergies.length > 0 ? (
                          <div className="space-y-2">
                            {patient.medicalHistory.allergies.map((allergy, index) => (
                              <div key={index} className="flex items-center">
                                <div className="w-2 h-2 bg-red-600 rounded-full mr-2"></div>
                                <span>{allergy}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500">No allergies recorded</p>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'vitals' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-medium mb-6">Blood Pressure Trends</h3>
              
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                <div className="text-center">
                  <BarChart2 className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Blood pressure chart visualization would appear here</p>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Systolic</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Diastolic</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                
                    {patient.vitals?.bloodPressure?.map((reading, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{reading.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{reading.systolic} mmHg</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{reading.diastolic} mmHg</td>
                        <td className="px-6 py-4  whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            reading.systolic >= 140 || reading.diastolic >= 90
                              ? 'bg-red-100 text-red-800'
                              : reading.systolic >= 130 || reading.diastolic >= 80
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-green-100 text-green-800'
                          }`}>
                            {reading.systolic >= 140 || reading.diastolic >= 90
                              ? 'High'
                              : reading.systolic >= 130 || reading.diastolic >= 80
                                ? 'Elevated'
                                : 'Normal'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-medium mb-6">Heart Rate</h3>
                
                <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-center">
                    <PieChart className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Heart rate chart visualization would appear here</p>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {patient.vitals?.heartRate?.map((reading, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{reading.date}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{reading.value} bpm</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              reading.value > 100
                                ? 'bg-red-100 text-red-800'
                                : reading.value < 60
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-green-100 text-green-800'
                            }`}>
                              {reading.value > 100
                                ? 'Elevated'
                                : reading.value < 60
                                  ? 'Low'
                                  : 'Normal'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-medium mb-6">Weight</h3>
                
                <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-center">
                    <TrendingUp className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Weight trend chart visualization would appear here</p>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {patient.vitals?.weight?.map((reading, index) => {
                        const prevReading = index < patient.vitals!.weight!.length - 1 ? patient.vitals!.weight![index + 1] : null;
                        const change = prevReading ? reading.value - prevReading.value : 0;
                        
                        return (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{reading.date}</td>
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
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'care-plan' && (
          <ClinicalCarePlan />
        )}

        {activeTab === 'goal-progress' && (
          <GoalProgress goalprogress={patient.goalprogress} />
        )}

        {activeTab === 'assessments' && (
          <Assessments assessments={patient.assessments} />
        )}

        {activeTab === 'education' && (
          <Education education={patient.education} />
        )}

        {showAppointmentDetails && selectedAppointment && (
          <AppointmentDetails
            isOpen={showAppointmentDetails}
            onClose={() => setShowAppointmentDetails(false)}
            appointment={selectedAppointment}
          />
        )}
      </div>
    </div>
  );
};

export default PatientProfile;