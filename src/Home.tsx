import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, LogOut, Settings, MoreHorizontal, Filter, X, Calendar, ChevronDown, ArrowDownRight, ArrowUpRight, Check } from 'lucide-react';
import PatientProfile from './components/PatientProfile';
import Header from './components/Header';
import Groups from './components/Groups';
import Archived from './components/Archived';
import AllPatients from './components/AllPatients';

interface MetricFilter {
  category: string;
  label: string;
  value: number;
  condition: 'lt' | 'gt' | 'between';
}

interface NewPatientForm {
  firstName: string;
  lastName: string;
  mobilePhone: string;
  clientGroup: string;
  email: string;
  provider: string;
}

function Home() {
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<MetricFilter | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date(2025, 2)); // March 2025
  const [showNewPatientModal, setShowNewPatientModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'active' | 'allpatients' | 'archived' | 'groups'>('active');
  const [newPatientForm, setNewPatientForm] = useState<NewPatientForm>({
    firstName: '',
    lastName: '',
    mobilePhone: '',
    clientGroup: 'No Group',
    email: '',
    provider: ''
  });
  
  const datePickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setShowDatePicker(false);
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

  const years = Array.from({ length: 3 }, (_, i) => 2024 + i);

  const handleDateChange = (month: number, year: number) => {
    setCurrentDate(new Date(year, month));
    setShowDatePicker(false);
  };

  const patients = [
    {
      id: "joe-smith",
      name: 'Joe Smith',
      group: 'Active Bi-Weekly',
      dateStarted: '09/24/23',
      coach: 'Hannah Wright',
      therapist: 'Alisa Fishman',
      healthieId: '2123456',
      mrn: '4569234',
      totalRPM: 50,
      totalPCM: 16,
      totalBHI: 35,
      totalBP: 10,
      tags: ['at high risk', 'out of state'],
      email: 'joe.smith@example.com',
      phone: '(555) 123-4567',
      address: '123 Main St, Chicago, IL 60601',
      dateOfBirth: '05/12/1965',
      age: 58,
      gender: 'Male',
      provider: 'Dr. Sarah Johnson',
      medicalHistory: {
        conditions: ['Hypertension', 'Type 2 Diabetes', 'Hyperlipidemia'],
        medications: [
          { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily' },
          { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily' },
          { name: 'Atorvastatin', dosage: '20mg', frequency: 'Once daily at bedtime' }
        ],
        allergies: ['Penicillin', 'Sulfa drugs']
      },
      vitals: {
        bloodPressure: [
          { date: '10/01/23', systolic: 142, diastolic: 88 },
          { date: '09/25/23', systolic: 145, diastolic: 92 },
          { date: '09/18/23', systolic: 148, diastolic: 94 }
        ],
        weight: [
          { date: '10/01/23', value: 195 },
          { date: '09/15/23', value: 198 }
        ],
        heartRate: [
          { date: '10/01/23', value: 78 },
          { date: '09/25/23', value: 82 },
          { date: '09/18/23', value: 85 }
        ]
      },
      notes: [
        { 
          id: '1', 
          date: '10/01/23', 
          author: 'Dr. Adam Silver', 
          content: 'Patient reports feeling better with new medication regimen. Blood pressure still elevated but improving. Encouraged continued adherence to medication schedule and dietary recommendations.', 
          type: 'clinical' 
        },
        { 
          id: '2', 
          date: '09/24/23', 
          author: 'Cindy Parnell', 
          content: 'Joe mentioned difficulty remembering to take evening medications. Suggested setting a phone alarm and placing medication by toothbrush as a visual reminder.', 
          type: 'general' 
        }
      ],
      appointments: [
        { 
          id: '1', 
          date: '10/15/25', 
          time: '10:30 AM', 
          type: 'Follow-up Appointment', 
          coach: 'Hannah Wright',
          duration:'30 mins',
          status: 'scheduled' 
        },
        { 
          id: '2', 
          date: '09/24/23', 
          time: '2:00 PM', 
          type: 'Intake Appointment', 
          coach: 'Hannah Wright',
          duration:'45 mins',         
          status: 'completed' 
        },
        {
          id: '3',
          date: '08/20/25',
          time: '2:30 PM',
          type: 'Follow-up Aoppointment',
          coach: 'Hannah Wright',
          duration:'30 mins',
          status: 'upcoming'
        }
      ],
      tasks: [
        { 
          id: '1', 
          title: 'Complete health questionnaire', 
          dueDate: '10/10/23', 
          status: 'pending', 
          assignedTo: 'Joe Smith' 
        },
        { 
          id: '2', 
          title: 'Schedule follow-up blood work', 
          dueDate: '10/05/23', 
          status: 'overdue', 
          assignedTo: 'Cindy Parnell' 
        },
        { 
          id: '3', 
          title: 'Review medication adherence', 
          dueDate: '09/30/23', 
          status: 'completed', 
          assignedTo: 'Alisa Fishman' 
        }
      ]
    },
    {
      id: "jane-tons",
      name: 'Jane Tons',
      group: 'Active Bi-Weekly',
      dateStarted: '10/01/23',
      coach: 'Cindy Parnell',
      therapist: 'Alisa Fishman',
      bpReadings: 22,
      totalRPM: 15,
      totalPCM: 75,
      totalBHI: 10,
      totalBP: 22,
      tags: [],
      email: 'jane.tons@example.com',
      phone: '(555) 987-6543',
      address: '456 Oak Ave, Chicago, IL 60607',
      dateOfBirth: '08/23/1970',
      age: 53,
      gender: 'Female',
      provider: 'Dr. Michael Chen',
      medicalHistory: {
        conditions: ['Anxiety', 'Migraines'],
        medications: [
          { name: 'Sertraline', dosage: '50mg', frequency: 'Once daily' },
          { name: 'Sumatriptan', dosage: '100mg', frequency: 'As needed for migraines' }
        ],
        allergies: ['Latex']
      },
      vitals: {
        bloodPressure: [
          { date: '10/02/23', systolic: 128, diastolic: 82 },
          { date: '09/25/23', systolic: 130, diastolic: 84 }
        ],
        weight: [
          { date: '10/02/23', value: 145 },
          { date: '09/25/23', value: 146 }
        ],
        heartRate: [
          { date: '10/02/23', value: 72 },
          { date: '09/25/23', value: 75 }
        ]
      },
      notes: [
        { 
          id: '1', 
          date: '10/02/23', 
          author: 'Alisa Fishman', 
          content: 'Jane reports improved sleep with new relaxation techniques. Still experiencing occasional anxiety at work.', 
          type: 'general' 
        }
      ],
      appointments: [
        { 
          id: '1', 
          date: '10/20/23', 
          time: '1:15 PM', 
          type: 'Therapy Session', 
          status: 'scheduled' 
        }
      ],
      tasks: [
        { 
          id: '1', 
          title: 'Complete anxiety assessment', 
          dueDate: '10/15/23', 
          status: 'pending', 
          assignedTo: 'Jane Tons' 
        }
      ]
    }
  ];

  const statsCategories = {
    Active: [
      { label: '', value: 60, goal: 60, condition: 'lt', threshold: 60, intakeSlots: 0 }
    ],
    PCM: [
      { label: '< 30 mins', value: 60, goal: 20, condition: 'lt', threshold: 30 },
      { label: '30-59 mins', value: 0, goal: 20, condition: 'between', min: 29, max: 60 },
      { label: '60-89 mins', value: 0, goal: 20, condition: 'between', min: 59, max: 90 },
      { label: '> 90 mins', value: 0, goal: 20, condition: 'gt', threshold: 90 }
    ],
    RPM: [
      { label: '< 20 mins', value: 60, goal: 30, condition: 'lt', threshold: 20 }
    ],
    BP: [
      { label: '< 16 readings', value: 30, goal: 30, condition: 'lt', threshold: 16 }
    ]
  };

  const handleMetricClick = (category: string, stat: any) => {
    if (activeFilter?.category === category && activeFilter?.label === stat.label) {
      setActiveFilter(null);
    } else {
      setActiveFilter({
        category,
        label: stat.label,
        value: stat.value,
        condition: stat.condition
      });
    }
  };

  const getFilteredPatients = () => {
    if (!activeFilter) return patients;

    return patients.filter(patient => {
      const value = activeFilter.category === 'PCM' ? patient.totalPCM :
                    activeFilter.category === 'RPM' ? patient.totalRPM :
                    activeFilter.category === 'BHI' ? patient.totalBHI :
                    patient.bpReadings;

      const stat = statsCategories[activeFilter.category as keyof typeof statsCategories]
        .find(s => s.label === activeFilter.label);

      if (!stat) return true;

      switch (stat.condition) {
        case 'lt':
          return value < stat.threshold;
        case 'gt':
          return value > stat.threshold;
        case 'between':
          return value >= stat.min && value <= stat.max;
        default:
          return true;
      }
    });
  };

  const renderMetricCard = (category: string, stats: any[], bgColor: string, textColor: string, extraClasses: string = '') => (
    <div className={`${bgColor} p-6 rounded-xl shadow-sm border border-opacity-10 ${textColor} ${extraClasses}`}>
      <h3 className="text-sm font-semibold mb-4">{category}</h3>
      <div className="flex items-start space-x-8">
        {stats.map((stat, index) => {
          const isActive = activeFilter?.category === category && activeFilter?.label === stat.label;
          const isGoalMet = stat.value === stat.goal;
          const isAboveGoal = stat.value > stat.goal;
          
          return (
            <div key={index} className="flex-1">
              <div className="text-xs opacity-75 mb-1">{stat.label}</div>
              <button
                onClick={() => handleMetricClick(category, stat)}
                className={`w-full text-left ${isActive ? 'bg-white bg-opacity-50 rounded p-2 -m-2' : ''}`}
              >
                <div className="flex flex-col">
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold">{stat.value}</span>
                    <div className="flex items-center">
                      <span className="text-lg text-gray-500 ml-1">/{stat.goal}</span>
                      {isGoalMet && (
                        <Check className="h-4 w-4 text-green-500 ml-1" />
                      )}
                      {isAboveGoal ? (
                        <div className="relative group">
                          <ArrowUpRight className="h-4 w-4 text-red-500 ml-1" />
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity">
                            Above goal
                          </div>
                        </div>
                      ) : !isGoalMet && (
                        <div className="relative group">
                          <ArrowDownRight className="h-4 w-4 text-red-500 ml-1" />
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity">
                            Goal not met
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  {category === 'Active' && (
                    <div className="text-xs text-gray-500 mt-1">
                      Intake Slots Needed: {stat.intakeSlots}
                    </div>
                  )}
                </div>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );

  const TableHeader = ({ children, centered = false }: { children: React.ReactNode, centered?: boolean }) => (
    <th className={`px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider group w-auto ${centered ? 'text-center' : 'text-left'}`}>
      <div className={`flex items-center gap-1 ${centered ? 'justify-center' : ''}`}>
        <span>{children}</span>
        <button className="opacity-0 group-hover:opacity-100 transition-opacity">
          <Filter className="h-3 w-3 text-gray-400 hover:text-gray-600" />
        </button>
      </div>
    </th>
  );

  const handlePatientClick = (patientId: string) => {
    setSelectedPatient(patientId);
  };

  const handleBackToPatientList = () => {
    setSelectedPatient(null);
  };

  const handleNewPatientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('New patient form submitted:', newPatientForm);
    setShowNewPatientModal(false);
    setNewPatientForm({
      firstName: '',
      lastName: '',
      mobilePhone: '',
      clientGroup: 'No Group',
      email: '',
      provider: ''
    });
  };

  const selectedPatientData = patients.find(p => p.id === selectedPatient);

  if (selectedPatient && selectedPatientData) {
    return <PatientProfile patient={selectedPatientData} onBack={handleBackToPatientList} />;
  }

  return (
    <>
      
      <main className="flex-1 p-4 lg:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex flex-wrap gap-2 mb-4">
              <button
                className={`px-4 py-2 ${
                  activeTab === 'active'
                    ? 'text-blue-600 border-b-2 border-blue-600 font-medium'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('active')}
              >
                My Patients
              </button>
              <button
                className={`px-4 py-2 ${
                  activeTab === 'allpatients'
                    ? 'text-blue-600 border-b-2 border-blue-600 font-medium'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('allpatients')}
              >
                All Patients
              </button>
              <button
                className={`px-4 py-2 ${
                  activeTab === 'archived'
                    ? 'text-blue-600 border-b-2 border-blue-600 font-medium'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('archived')}
              >
                Archived
              </button>
              <button
                className={`px-4 py-2 ${
                  activeTab === 'groups'
                    ? 'text-blue-600 border-b-2 border-blue-600 font-medium'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('groups')}
              >
                Groups
              </button>
            </div>
          </div>
          <button 
            className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            onClick={() => setShowNewPatientModal(true)}
          >
            + New Patient
          </button>
        </div>

        {activeTab === 'groups' && <Groups />}
        {activeTab === 'archived' && <Archived />}
        {activeTab === 'allpatients' && <AllPatients />}
        {activeTab === 'active' && (
          <>
            <div className="relative" ref={datePickerRef}>
              <button
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="text-xl font-bold text-blue-600 hover:text-blue-700 flex items-center whitespace-nowrap"
              >
                {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                <ChevronDown className="h-5 w-5 ml-1" />
              </button>

              {showDatePicker && (
                <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50 min-w-[280px]">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 mb-4">
                    {months.map((month, index) => (
                      <button
                        key={month}
                        onClick={() => handleDateChange(index, currentDate.getFullYear())}
                        className={`px-2 py-1 text-sm rounded transition-colors ${
                          index === currentDate.getMonth()
                            ? 'bg-blue-600 text-white'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        {month}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-center gap-2 border-t pt-2">
                    {years.map(year => (
                      <button
                        key={year}
                        onClick={() => handleDateChange(currentDate.getMonth(), year)}
                        className={`px-3 py-1 text-sm rounded transition-colors ${
                          year === currentDate.getFullYear()
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
            <div className="grid grid-cols-6 gap-6 mb-8">
              <div className="col-span-1">
                {renderMetricCard('Active', statsCategories.Active, 'bg-gray-50 border-gray-500', 'text-gray-900')}
              </div>
              <div className="col-span-3">
                {renderMetricCard('PCM', statsCategories.PCM, 'bg-blue-50 border-blue-500', 'text-blue-900')}
              </div>
              <div className="col-span-1">
                {renderMetricCard('RPM', statsCategories.RPM, 'bg-green-50 border-green-500', 'text-green-900')}
              </div>
              <div className="col-span-1">
                {renderMetricCard('BP', statsCategories.BP, 'bg-purple-50 border-purple-500', 'text-purple-900')}
              </div>
            </div>

            {activeFilter && (
              <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-lg mb-6">
                <span className="text-sm text-blue-700">
                  Filtered by {activeFilter.category}: {activeFilter.label}
                </span>
                <button
                  onClick={() => setActiveFilter(null)}
                  className="text-blue-700 hover:text-blue-900"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            <div className="bg-white rounded-lg shadow">
              <div className="overflow-x-auto">
                <table className="w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <TableHeader>Name</TableHeader>
                      <TableHeader>Group</TableHeader>
                      <TableHeader>Coach</TableHeader>
                      <TableHeader>Therapist</TableHeader>
                      <TableHeader centered>PCM</TableHeader>
                      <TableHeader centered>RPM</TableHeader>
                      <TableHeader centered>BHI</TableHeader>
                      <TableHeader centered>BP</TableHeader>
                      <TableHeader>Tags</TableHeader>
                      <TableHeader centered>Actions</TableHeader>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {getFilteredPatients().map((patient, index) => (
                      <tr key={index} className="hover:bg-gray-50 cursor-pointer" onClick={() => handlePatientClick(patient.id)}>
                        <td className="px-4 py-3 text-sm">{patient.name}</td>
                        <td className="px-4 py-3 text-sm">{patient.group}</td>
                        <td className="px-4 py-3 text-sm truncate" title={patient.coach}>{patient.coach}</td>
                        <td className="px-4 py-3 text-sm truncate" title={patient.therapist}>{patient.therapist}</td>
                        <td className="px-4 py-3 text-sm text-center">{patient.totalPCM}</td>
                        <td className="px-4 py-3 text-sm text-center">{patient.totalRPM}</td>
                        <td className="px-4 py-3 text-sm text-center">{patient.totalBHI}</td>
                        <td className="px-4 py-3 text-sm text-center">{patient.totalBP}</td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex flex-wrap gap-1">
                            {patient.tags.map((tag, tagIndex) => (
                              <span key={tagIndex} className="px-2 py-0.5 text-xs bg-gray-100 rounded-full truncate max-w-[100px]" title={tag}>
                                {tag}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-center">
                          <button className="text-gray-400 hover:text-gray-600">
                            <MoreHorizontal className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>

      {showNewPatientModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Add New Patient</h2>
              <button
                onClick={() => setShowNewPatientModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleNewPatientSubmit}>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name*
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Mary"
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    value={newPatientForm.firstName}
                    onChange={(e) => setNewPatientForm({...newPatientForm, firstName: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name*
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Smith"
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    value={newPatientForm.lastName}
                    onChange={(e) => setNewPatientForm({...newPatientForm, lastName: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mobile Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="Ex: 555-123-45"
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    value={newPatientForm.mobilePhone}
                    onChange={(e) => setNewPatientForm({...newPatientForm, mobilePhone: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Client Group
                  </label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    value={newPatientForm.clientGroup}
                    onChange={(e) => setNewPatientForm({...newPatientForm, clientGroup: e.target.value})}
                  >
                    <option>No Group</option>
                    <option>Group A</option>
                    <option>Group B</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Ex: marysmith@gmail.com"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  value={newPatientForm.email}
                  onChange={(e) => setNewPatientForm({...newPatientForm, email: e.target.value})}
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Provider
                </label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  value={newPatientForm.provider}
                  onChange={(e) => setNewPatientForm({...newPatientForm, provider: e.target.value})}
                >
                  <option value="">Select a provider</option>
                  <option value="marisa">Marisa Oge</option>
                  <option value="sarah">Dr. Sarah Johnson</option>
                  <option value="michael">Dr. Michael Chen</option>
                </select>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowNewPatientModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Patient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Home;