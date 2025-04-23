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
  FileBarChart,
  Settings,
  Download,
  UserCheck,
  PhoneCall,
  AlertTriangle,
  MessageSquare,
  BarChart2,
  ExternalLink,
  Minus
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Patient {
  id: string;
  name: string;
  organization: string;
  coach: string;
  currentGroup: string;
  patientMRN: string;
  nextSession: string;
  email: string;
  tags: string[];
  referringPhysician: string;
  referralReason: string;
  dateAdded: string;
  dateConsented: string;
  coachIntakeDate: string;
  dateFirstFollowup: string;
  weeksSinceIntake: number;
  appointments: number;
  therapistVisits: number;
  therapistName: string;
  evaluationDate: string;
  dateOf6th: string;
  dischargeStatus: string;
  dateOfGraduation: string;
  addedAfter: string;
}

interface Metric {
  name: string;
  value: string | number;
  goal: string | number;
  trend: 'up' | 'down' | 'neutral';
  change: string;
}

interface VitalReading {
  patientId: string;
  patientName: string;
  type: string;
  value: number;
  date: string;
  time: string;
  status: 'normal' | 'elevated' | 'high' | 'low';
}

const Reports: React.FC = () => {
  // Add mock patients data
  const patients: Patient[] = [
    {
      id: "P001",
      name: "John Smith",
      organization: "General Hospital",
      coach: "Sarah Wilson",
      currentGroup: "Cardiac Rehab",
      patientMRN: "MRN123456",
      nextSession: "2025-03-20",
      email: "john.smith@email.com",
      tags: ["High Priority", "New Patient"],
      referringPhysician: "Dr. Michael Brown",
      referralReason: "Post-cardiac surgery rehabilitation",
      dateAdded: "2025-01-15",
      dateConsented: "2025-01-16",
      coachIntakeDate: "2025-01-20",
      dateFirstFollowup: "2025-01-27",
      weeksSinceIntake: 8,
      appointments: 6,
      therapistVisits: 4,
      therapistName: "David Thompson",
      evaluationDate: "2025-01-21",
      dateOf6th: "2025-03-15",
      dischargeStatus: "",
      dateOfGraduation: "",
      addedAfter: "Surgery"
    },
    {
      id: "P002",
      name: "Mary Johnson",
      organization: "City Medical Center",
      coach: "Robert Chen",
      currentGroup: "Pulmonary Rehab",
      patientMRN: "MRN789012",
      nextSession: "2025-03-22",
      email: "mary.johnson@email.com",
      tags: ["Regular", "Progress Review"],
      referringPhysician: "Dr. Emily White",
      referralReason: "COPD management",
      dateAdded: "2025-02-01",
      dateConsented: "2025-02-02",
      coachIntakeDate: "2025-02-05",
      dateFirstFollowup: "2025-02-12",
      weeksSinceIntake: 6,
      appointments: 4,
      therapistVisits: 3,
      therapistName: "Lisa Anderson",
      evaluationDate: "2025-02-06",
      dateOf6th: "2025-04-01",
      dischargeStatus: "",
      dateOfGraduation: "",
      addedAfter: "Diagnosis"
    }
  ];

  const [activeTab, setActiveTab] = useState<'overview' | 'patients' | 'vitals' | 'appointments' | 'operations'>('overview');
  const [dateRange, setDateRange] = useState('last-30-days');
  const [showAIChat, setShowAIChat] = useState(false);
  const [aiQuery, setAIQuery] = useState('');
  const [vitalTimeRange, setVitalTimeRange] = useState('7d');
  const [selectedVitalType, setSelectedVitalType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMetric, setSelectedMetric] = useState('referral-rate');

  const historicalData = [
    { date: '03/08/2025', value: 28.73 },
    { date: '03/10/2025', value: 28.50 },
    { date: '03/12/2025', value: 28.45 },
    { date: '03/14/2025', value: 28.30 },
    { date: '03/16/2025', value: 28.25 },
    { date: '03/18/2025', value: 28.20 }
  ];

  const allMetrics = [
    { id: 'referral-rate', name: 'Referral Response Rate' },
    { id: 'enrollment', name: 'Enrollment Efficiency' },
    { id: 'adherence', name: 'Program Adherence' },
    { id: 'active-patients', name: 'Active Patients' },
    { id: 'mets-low', name: 'METs Change (Low)' },
    { id: 'mets-moderate', name: 'METs Change (Moderate)' },
    { id: 'bp-control', name: 'BP Control Rate' }
  ];

  const vitalReadings: VitalReading[] = [
    {
      patientId: '2810817',
      patientName: 'MICK Masuka',
      type: 'Systolic Blood Pressure',
      value: 122,
      date: '2025-03-01',
      time: '08:30',
      status: 'normal'
    },
    {
      patientId: '2810817',
      patientName: 'MICK Masuka',
      type: 'Diastolic Blood Pressure',
      value: 75,
      date: '2025-03-01',
      time: '08:30',
      status: 'normal'
    },
    {
      patientId: '2810817',
      patientName: 'MICK Masuka',
      type: 'Heart Rate',
      value: 72,
      date: '2025-03-01',
      time: '08:30',
      status: 'normal'
    },
    {
      patientId: '2258566',
      patientName: 'Janet Kaiser',
      type: 'Systolic Blood Pressure',
      value: 145,
      date: '2025-03-01',
      time: '09:15',
      status: 'elevated'
    },
    {
      patientId: '2258566',
      patientName: 'Janet Kaiser',
      type: 'Diastolic Blood Pressure',
      value: 92,
      date: '2025-03-01',
      time: '09:15',
      status: 'high'
    },
    {
      patientId: '2258566',
      patientName: 'Janet Kaiser',
      type: 'Heart Rate',
      value: 85,
      date: '2025-03-01',
      time: '09:15',
      status: 'elevated'
    }
  ];

  const programMetrics: Metric[] = [
    {
      name: 'Referral Response Rate',
      value: '28.73%',
      goal: '50%',
      trend: 'down',
      change: '-2.1%'
    },
    {
      name: 'Enrollment Efficiency',
      value: '62.12%',
      goal: '70%',
      trend: 'up',
      change: '+4.3%'
    },
    {
      name: 'Program Adherence',
      value: '77.54%',
      goal: '70%',
      trend: 'up',
      change: '+5.2%'
    },
    {
      name: 'Active Patients',
      value: 280,
      goal: 350,
      trend: 'neutral',
      change: '0%'
    }
  ];

  const clinicalMetrics: Metric[] = [
    {
      name: 'Blended METs Change',
      value: '43.12%',
      goal: '≥ 25%',
      trend: 'up',
      change: '+7.6%'
    },
    {
      name: 'Started < 140/90 & ended <140/90',
      value: '92.79%',
      goal: '80%',
      trend: 'up',
      change: '+5.6%'
    },
    {
      name: 'Started ≥ 140/90 & ended <140/90',
      value: '70.97%',
      goal: '50%',
      trend: 'up',
      change: '+4.2%'
    },
    {
      name: 'Decrease in PHQ9 Blended',
      value: '46.15%',
      goal: '30%',
      trend: 'up',
      change: '+7.2%'
    }
  ];

  const customerMetrics: Metric[] = [
    {
      name: 'NPS score (automated)',
      value: 73,
      goal: '≥ 50',
      trend: 'up',
      change: '+5'
    },
    {
      name: '# Patients w/NPS',
      value: 307,
      goal: 'N/A',
      trend: 'neutral',
      change: '0'
    }
  ];

  const operationalMetrics = {
    staffing: [
      {
        name: 'Active Care Managers',
        value: 12,
        change: '+2',
        trend: 'up'
      },
      {
        name: 'Avg. Patient Load',
        value: '45.5',
        change: '-3.2',
        trend: 'down'
      },
      {
        name: 'Staff Utilization',
        value: '87%',
        change: '+5%',
        trend: 'up'
      },
      {
        name: 'Response Time',
        value: '2.3h',
        change: '-0.5h',
        trend: 'up'
      }
    ],
    communication: [
      {
        name: 'Outbound Calls',
        value: 428,
        change: '+45',
        trend: 'up'
      },
      {
        name: 'Inbound Calls',
        value: 156,
        change: '-12',
        trend: 'down'
      },
      {
        name: 'Messages Sent',
        value: 1247,
        change: '+89',
        trend: 'up'
      },
      {
        name: 'Response Rate',
        value: '94%',
        change: '+2%',
        trend: 'up'
      }
    ],
    tasks: [
      {
        name: 'Open Tasks',
        value: 87,
        change: '-12',
        trend: 'down'
      },
      {
        name: 'Completed Tasks',
        value: 342,
        change: '+28',
        trend: 'up'
      },
      {
        name: 'Overdue Tasks',
        value: 15,
        change: '-5',
        trend: 'down'
      },
      {
        name: 'Task Completion Rate',
        value: '92%',
        change: '+3%',
        trend: 'up'
      }
    ],
    quality: [
      {
        name: 'Documentation Compliance',
        value: '98%',
        change: '+1%',
        trend: 'up'
      },
      {
        name: 'Care Plan Updates',
        value: 156,
        change: '+23',
        trend: 'up'
      },
      {
        name: 'Avg. Assessment Time',
        value: '24m',
        change: '-3m',
        trend: 'up'
      },
      {
        name: 'Quality Score',
        value: '4.8',
        change: '+0.2',
        trend: 'up'
      }
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
        return 'text-green-600 bg-green-50';
      case 'elevated':
        return 'text-yellow-600 bg-yellow-50';
      case 'high':
        return 'text-red-600 bg-red-50';
      case 'low':
        return 'text-blue-600 bg-blue-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const renderMetricCard = (metric: Metric) => (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-600">{metric.name}</span>
        <HelpCircle className="h-4 w-4 text-gray-400" />
      </div>
      <div className="flex items-end justify-between">
        <div>
          <div className="text-2xl font-bold mb-1">{metric.value}</div>
          <div className="text-sm text-gray-500">Goal: {metric.goal}</div>
        </div>
        <div className={`flex items-center ${
          metric.trend === 'up' ? 'text-green-600' :
          metric.trend === 'down' ? 'text-red-600' :
          'text-gray-600'
        }`}>
          {metric.trend === 'up' ? <ArrowUpRight className="h-4 w-4" /> :
           metric.trend === 'down' ? <ArrowDownRight className="h-4 w-4" /> :
           <Activity className="h-4 w-4" />}
          <span className="ml-1 text-sm">{metric.change}</span>
        </div>
      </div>
    </div>
  );

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-sm">
          <p className="text-sm text-gray-600">{label}</p>
          <p className="text-sm font-medium text-gray-900">{`${payload[0].value}%`}</p>
        </div>
      );
    }
    return null;
  };

  const filteredVitalReadings = vitalReadings.filter(reading => {
    const matchesSearch = reading.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         reading.patientId.includes(searchQuery);
    const matchesType = selectedVitalType === 'all' || reading.type === selectedVitalType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="flex-1 flex flex-col w-full">
      <div className="flex justify-between items-center p-4 lg:p-6">
        <div className="flex items-center gap-4">
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'overview'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'patients'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('patients')}
          >
            Patient Analytics
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'vitals'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('vitals')}
          >
            Vital Trends
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'appointments'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('appointments')}
          >
            Appointments
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'operations'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('operations')}
          >
            Operations
          </button>
        </div>
        <div className="flex items-center gap-4">
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="last-30-days">Last 30 Days</option>
            <option value="last-90-days">Last 90 Days</option>
            <option value="last-180-days">Last 180 Days</option>
            <option value="last-year">Last Year</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
            <Download className="h-4 w-4" />
            Export Data
          </button>
        </div>
      </div>

      <div className="flex-1 p-4 lg:p-6">
        {activeTab === 'overview' && (
          <>
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4">Program Metrics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {programMetrics.map((metric, index) => (
                  <div key={index}>
                    {renderMetricCard(metric)}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4">Clinical Outcomes</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {clinicalMetrics.map((metric, index) => (
                  <div key={index}>
                    {renderMetricCard(metric)}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4">Customer Metrics (graduated patients)</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {customerMetrics.map((metric, index) => (
                  <div key={index}>
                    {renderMetricCard(metric)}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <h2 className="text-lg font-semibold">Historical Trends</h2>
                  <select
                    className="border border-gray-300 rounded-lg px-4 py-2 bg-white text-sm"
                    value={selectedMetric}
                    onChange={(e) => setSelectedMetric(e.target.value)}
                  >
                    {allMetrics.map(metric => (
                      <option key={metric.id} value={metric.id}>
                        {metric.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
                    <Filter className="h-4 w-4 inline mr-1" />
                    Filter
                  </button>
                  <button className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
                    <Download className="h-4 w-4 inline mr-1" />
                    Export
                  </button>
                </div>
              </div>
              <div className="h-80">
                <div className="mb-2">
                  <h3 className="text-lg text-gray-700">Referral Response Rate</h3>
                  <p className="text-sm text-gray-500">Goal: 50%</p>
                </div>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={historicalData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#6B7280"
                      fontSize={12}
                      tickMargin={10}
                    />
                    <YAxis
                      stroke="#6B7280"
                      fontSize={12}
                      tickFormatter={(value) => `${value}%`}
                      domain={[0, 100]}
                      ticks={[0, 25, 50, 75, 100]}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#2563EB"
                      strokeWidth={2}
                      dot={{ fill: '#2563EB', r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}

        {activeTab === 'patients' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-lg font-semibold">Patient Analytics</h2>
                  <p className="text-sm text-gray-500 mt-1">Track and analyze patient progress and outcomes</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search patients..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </button>
                </div>
              </div>

              <div className="h-[600px] flex flex-col">
                <div className="flex-1 overflow-x-auto overflow-y-auto border border-gray-200 rounded-lg">
                  <table className="w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Group</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coach</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Session</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Appointments</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {patients.map((patient) => (
                        <tr key={patient.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                            <div className="text-sm text-gray-500">ID: {patient.id}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{patient.currentGroup}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{patient.coach}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{patient.nextSession || '-'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <div className="text-sm text-gray-900">{patient.appointments}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              patient.dischargeStatus ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {patient.dischargeStatus || 'Active'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <button className="text-gray-400 hover:text-gray-600">
                              <MoreHorizontal className="h-5 w-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    Showing {patients.length} patients
                  </div>
                  <div className="flex space-x-2">
                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                      Previous
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'vitals' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-lg font-semibold">Patient Vital Readings</h2>
                  <p className="text-sm text-gray-500 mt-1">Monitor and analyze patient vital signs</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search patients..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    className="border border-gray-300 rounded-lg px-4 py-2"
                    value={vitalTimeRange}
                    onChange={(e) => setVitalTimeRange(e.target.value)}
                  >
                    <option value="7d">Last 7 Days</option>
                    <option value="30d">Last 30 Days</option>
                    <option value="90d">Last 90 Days</option>
                    <option value="custom">Custom Range</option>
                  </select>
                  <select
                    className="border border-gray-300 rounded-lg px-4 py-2"
                    value={selectedVitalType}
                    onChange={(e) => setSelectedVitalType(e.target.value)}
                  >
                    <option value="all">All Vitals</option>
                    <option value="Systolic Blood Pressure">Systolic BP</option>
                    <option value="Diastolic Blood Pressure">Diastolic BP</option>
                    <option value="Heart Rate">Heart Rate</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredVitalReadings.map((reading, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{reading.patientName}</div>
                          <div className="text-sm text-gray-500">ID: {reading.patientId}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {reading.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                          {reading.value} {reading.type === 'Heart Rate' ? 'BPM' : 'mmHg'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(reading.status)}`}>
                            {reading.status.charAt(0).toUpperCase() + reading.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {reading.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {reading.time}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Showing {filteredVitalReadings.length} readings
                </div>
                <div className="flex space-x-2">
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    Previous
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'operations' && (
          <div className="space-y-6">
            {/* Staffing Metrics */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Staffing & Workload</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {operationalMetrics.staffing.map((metric, index) => (
                  <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">{metric.name}</span>
                      <HelpCircle className="h-4 w-4 text-gray-400" />
                    </div>
                    <div className="flex items-end justify-between">
                      <div className="text-2xl font-bold">{metric.value}</div>
                      <div className={`flex items-center ${
                        metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {metric.trend === 'up' ? (
                          <ArrowUpRight className="h-4 w-4" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4" />
                        )}
                        <span className="ml-1 text-sm">{metric.change}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Communication Metrics */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Communication</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {operationalMetrics.communication.map((metric, index) => (
                  <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">{metric.name}</span>
                      <HelpCircle className="h-4 w-4 text-gray-400" />
                    </div>
                    <div className="flex items-end justify-between">
                      <div className="text-2xl font-bold">{metric.value}</div>
                      <div className={`flex items-center ${
                        metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {metric.trend === 'up' ? (
                          <ArrowUpRight className="h-4 w-4" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4" />
                        )}
                        <span className="ml-1 text-sm">{metric.change}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Task Management */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Task Management</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {operationalMetrics.tasks.map((metric, index) => (
                  <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">{metric.name}</span>
                      <HelpCircle className="h-4 w-4 text-gray-400" />
                    </div>
                    <div className="flex items-end justify-between">
                      <div className="text-2xl font-bold">{metric.value}</div>
                      <div className={`flex items-center ${
                        metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {metric.trend === 'up' ? (
                          <ArrowUpRight className="h-4 w-4" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4" />
                        )}
                        <span className="ml-1 text-sm">{metric.change}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quality Metrics */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Quality & Compliance</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {operationalMetrics.quality.map((metric, index) => (
                  <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">{metric.name}</span>
                      <HelpCircle className="h-4 w-4 text-gray-400" />
                    </div>
                    <div className="flex items-end justify-between">
                      <div className="text-2xl font-bold">{metric.value}</div>
                      <div className={`flex items-center ${
                        metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {metric.trend === 'up' ? (
                          <ArrowUpRight className="h-4 w-4" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4" />
                        )}
                        <span className="ml-1 text-sm">{metric.change}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;