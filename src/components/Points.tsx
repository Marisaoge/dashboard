import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Bell,
  Trophy,
  Star,
  Clock,
  Calendar,
  Target,
  Award,
  TrendingUp,
  Download,
  ChevronDown,
  HelpCircle,
  FileText,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  X,
  Settings,
  LogOut
} from 'lucide-react';

interface CPTActivity {
  code: string;
  description: string;
  unitsBilled: number;
  pointsPerUnit: number;
  pointsEarned: number;
  date: string;
}

interface PatientActivity {
  name: string;
  pointsEarned: number;
  cptCodes: string[];
  lastActivity: string;
  engagement: 'high' | 'medium' | 'low';
}

interface MonthData {
  totalPoints: number;
  tier: number;
  bonus: string;
  pointsToNextTier: number;
  changeFromLastMonth: number;
  cptActivities: CPTActivity[];
  patientActivities: PatientActivity[];
}

interface Organization {
  id: string;
  name: string;
  initials: string;
}

const Points: React.FC = () => {
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('April 2025');
  const [showOrgDropdown, setShowOrgDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const orgDropdownRef = useRef<HTMLDivElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  const organizations: Organization[] = [
    { id: '1', name: 'Endeavor Health', initials: 'EH' },
    { id: '2', name: 'NorthShore', initials: 'NS' },
    { id: '3', name: 'Rush Medical', initials: 'RM' }
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (orgDropdownRef.current && !orgDropdownRef.current.contains(event.target as Node)) {
        setShowOrgDropdown(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const renderDropdownContent = () => (
    <>
      <div className="px-4 py-2 border-b border-gray-200">
        <div className="text-sm font-medium">Marisa Oge</div>
        <div className="text-sm text-gray-500">marisa@example.com</div>
      </div>
      <div className="py-2">
        <div className="px-4 py-1 text-xs font-medium text-gray-500 uppercase">Organizations</div>
        {organizations.map(org => (
          <button
            key={org.id}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center justify-between"
          >
            <div>
              <span>{org.name}</span>
              <span className="text-gray-500 ml-1">({org.initials})</span>
            </div>
            {org.initials === 'EH' && (
              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded">Current</span>
            )}
          </button>
        ))}
      </div>
      <div className="border-t border-gray-200 py-1">
        <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center">
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </button>
        <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center">
          <LogOut className="h-4 w-4 mr-2" />
          Sign out
        </button>
      </div>
    </>
  );

  const bonusTiers = {
    1: { min: 0, max: 249, bonus: '$1,000' },
    2: { min: 250, max: 349, bonus: '$2,000' },
    3: { min: 350, max: 449, bonus: '$3,000' },
    4: { min: 450, max: Infinity, bonus: '$4,000' }
  };

  const getCurrentTierBonus = (points: number) => {
    for (const [tier, { min, max, bonus }] of Object.entries(bonusTiers)) {
      if (points >= min && points <= max) {
        return { tier: Number(tier), bonus };
      }
    }
    return { tier: 1, bonus: bonusTiers[1].bonus };
  };

  const getNextTierThreshold = (currentPoints: number) => {
    for (const [tier, { min, max }] of Object.entries(bonusTiers)) {
      if (currentPoints < min) {
        return { tier: Number(tier), threshold: min };
      }
      if (currentPoints >= min && currentPoints <= max) {
        const nextTier = Number(tier) + 1;
        return nextTier <= 4 ? { tier: nextTier, threshold: bonusTiers[nextTier].min } : null;
      }
    }
    return null;
  };

  const calculateTierProgress = (points: number) => {
    const tier2Min = 250;
    const tier2Max = 349;
    const tier2Range = tier2Max - tier2Min;
    const pointsInTier = points - tier2Min;
    return (pointsInTier / tier2Range) * 100;
  };

  const formatPaymentDate = (date: string) => {
    const [month, year] = date.split(' ');
    if (month === 'April' && year === '2025') {
      return 'May 1 2025';
    }
    if (month === 'March' && year === '2025') {
      return 'April 1 2025';
    }
    if (month === 'February' && year === '2025') {
      return 'March 1 2025';
    }
    return 'January 1 2025';
  };

  const monthlyData: Record<string, MonthData> = {
    'April 2025': {
      totalPoints: 283,
      tier: 2,
      bonus: 'Y',
      pointsToNextTier: 67,
      changeFromLastMonth: 20,
      cptActivities: [
        {
          code: '99426',
          description: 'Monthly Care Management – Initial 20 mins',
          unitsBilled: 45,
          pointsPerUnit: 3,
          pointsEarned: 135,
          date: '2025-04-01'
        },
        {
          code: '99427',
          description: 'Additional Care Time – 20 mins each',
          unitsBilled: 60,
          pointsPerUnit: 1,
          pointsEarned: 60,
          date: '2025-04-01'
        },
        {
          code: '99453',
          description: 'Remote Monitoring Setup & Patient Education',
          unitsBilled: 3,
          pointsPerUnit: 1,
          pointsEarned: 3,
          date: '2025-04-02'
        },
        {
          code: '99454',
          description: 'Remote Monitoring Device Data Transmission',
          unitsBilled: 30,
          pointsPerUnit: 1,
          pointsEarned: 30,
          date: '2025-04-02'
        },
        {
          code: '99457',
          description: 'Remote Monitoring – First 20 mins',
          unitsBilled: 35,
          pointsPerUnit: 1,
          pointsEarned: 35,
          date: '2025-04-03'
        },
        {
          code: '99458',
          description: 'Remote Monitoring – Additional 20 mins',
          unitsBilled: 20,
          pointsPerUnit: 1,
          pointsEarned: 20,
          date: '2025-04-03'
        }
      ],
      patientActivities: [
        {
          name: 'John A.',
          pointsEarned: 7,
          cptCodes: ['99426', '99427', '99427', '99457', '99458'],
          lastActivity: '2025-04-03',
          engagement: 'high'
        },
        {
          name: 'Maria B.',
          pointsEarned: 4,
          cptCodes: ['99426', '99454', '99457'],
          lastActivity: '2025-04-02',
          engagement: 'medium'
        },
        {
          name: 'Alan K.',
          pointsEarned: 6,
          cptCodes: ['99426', '99427', '99453', '99454', '99457'],
          lastActivity: '2025-04-01',
          engagement: 'high'
        }
      ]
    },
    'March 2025': {
      totalPoints: 263,
      tier: 2,
      bonus: 'Y',
      pointsToNextTier: 87,
      changeFromLastMonth: 21,
      cptActivities: [
        {
          code: '99426',
          description: 'Monthly Care Management – Initial 20 mins',
          unitsBilled: 40,
          pointsPerUnit: 3,
          pointsEarned: 120,
          date: '2025-03-01'
        },
        {
          code: '99427',
          description: 'Additional Care Time – 20 mins each',
          unitsBilled: 55,
          pointsPerUnit: 1,
          pointsEarned: 55,
          date: '2025-03-01'
        },
        {
          code: '99454',
          description: 'Remote Monitoring Device Data Transmission',
          unitsBilled: 28,
          pointsPerUnit: 1,
          pointsEarned: 28,
          date: '2025-03-02'
        },
        {
          code: '99457',
          description: 'Remote Monitoring – First 20 mins',
          unitsBilled: 32,
          pointsPerUnit: 1,
          pointsEarned: 32,
          date: '2025-03-03'
        },
        {
          code: '99458',
          description: 'Remote Monitoring – Additional 20 mins',
          unitsBilled: 18,
          pointsPerUnit: 1,
          pointsEarned: 18,
          date: '2025-03-03'
        }
      ],
      patientActivities: [
        {
          name: 'John A.',
          pointsEarned: 6,
          cptCodes: ['99426', '99427', '99457', '99458'],
          lastActivity: '2025-03-03',
          engagement: 'high'
        },
        {
          name: 'Maria B.',
          pointsEarned: 3,
          cptCodes: ['99426', '99454'],
          lastActivity: '2025-03-02',
          engagement: 'low'
        },
        {
          name: 'Alan K.',
          pointsEarned: 5,
          cptCodes: ['99426', '99427', '99454', '99457'],
          lastActivity: '2025-03-01',
          engagement: 'medium'
        }
      ]
    },
    'February 2025': {
      totalPoints: 242,
      tier: 1,
      bonus: 'X',
      pointsToNextTier: 108,
      changeFromLastMonth: -159,
      cptActivities: [
        {
          code: '99426',
          description: 'Monthly Care Management – Initial 20 mins',
          unitsBilled: 35,
          pointsPerUnit: 3,
          pointsEarned: 105,
          date: '2025-02-01'
        },
        {
          code: '99427',
          description: 'Additional Care Time – 20 mins each',
          unitsBilled: 50,
          pointsPerUnit: 1,
          pointsEarned: 50,
          date: '2025-02-01'
        },
        {
          code: '99454',
          description: 'Remote Monitoring Device Data Transmission',
          unitsBilled: 25,
          pointsPerUnit: 1,
          pointsEarned: 25,
          date: '2025-02-02'
        },
        {
          code: '99457',
          description: 'Remote Monitoring – First 20 mins',
          unitsBilled: 30,
          pointsPerUnit: 1,
          pointsEarned: 30,
          date: '2025-02-03'
        },
        {
          code: '99458',
          description: 'Remote Monitoring – Additional 20 mins',
          unitsBilled: 15,
          pointsPerUnit: 1,
          pointsEarned: 15,
          date: '2025-02-03'
        }
      ],
      patientActivities: [
        {
          name: 'John A.',
          pointsEarned: 5,
          cptCodes: ['99426', '99427', '99457'],
          lastActivity: '2025-02-03',
          engagement: 'medium'
        },
        {
          name: 'Maria B.',
          pointsEarned: 3,
          cptCodes: ['99426', '99454'],
          lastActivity: '2025-02-02',
          engagement: 'low'
        },
        {
          name: 'Alan K.',
          pointsEarned: 4,
          cptCodes: ['99426', '99454', '99457'],
          lastActivity: '2025-02-01',
          engagement: 'medium'
        }
      ]
    }
  };

  const bonusHistory = [
    { month: 'April', points: 283, tier: 2, bonus: 'Y', payDate: '2025-05-01' },
    { month: 'March', points: 263, tier: 2, bonus: 'Y', payDate: '2025-04-01' },
    { month: 'February', points: 242, tier: 1, bonus: 'X', payDate: '2025-03-01' },
    { month: 'January', points: 401, tier: 3, bonus: 'Z', payDate: '2025-02-01' }
  ];

  const currentMonthData = monthlyData[selectedMonth];

  const months = ['April 2025', 'March 2025', 'February 2025'];

  return (
    <div className="flex-1 flex flex-col w-full bg-gray-50">


      <main className="flex-1 p-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold mb-2">👋 Welcome, Marisa</h1>
              <div className="relative inline-block">
                <button
                  onClick={() => setShowMonthPicker(!showMonthPicker)}
                  className="text-blue-600 font-medium flex items-center"
                >
                  {selectedMonth}
                  <ChevronDown className="h-4 w-4 ml-1" />
                </button>
                {showMonthPicker && (
                  <div className="absolute z-10 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200">
                    <div className="py-1">
                      {months.map((month) => (
                        <button
                          key={month}
                          className={`block w-full text-left px-4 py-2 text-sm ${
                            selectedMonth === month
                              ? 'bg-blue-50 text-blue-700'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                          onClick={() => {
                            setSelectedMonth(month);
                            setShowMonthPicker(false);
                          }}
                        >
                          {month}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <button className="flex items-center text-gray-600 hover:text-gray-800">
              <Download className="h-5 w-5 mr-2" />
              Export Report
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-blue-700">Total Points</span>
                <HelpCircle className="h-4 w-4 text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-blue-900">{currentMonthData.totalPoints}</div>
              <div className="text-sm text-blue-600 mt-1">
                {currentMonthData.changeFromLastMonth > 0 ? (
                  <ArrowUpRight className="h-4 w-4 inline mr-1" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 inline mr-1" />
                )}
                {currentMonthData.changeFromLastMonth > 0 ? '+' : ''}{currentMonthData.changeFromLastMonth} from last month
              </div>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-green-700">Current Tier</span>
                <HelpCircle className="h-4 w-4 text-green-400" />
              </div>
              <div className="text-2xl font-bold text-green-900">Tier {currentMonthData.tier}</div>
              <div className="text-sm text-green-600 mt-1">$2,000</div>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-purple-700">Next Tier</span>
                <HelpCircle className="h-4 w-4 text-purple-400" />
              </div>
              <div className="text-2xl font-bold text-purple-900">{currentMonthData.pointsToNextTier} points</div>
              <div className="text-sm text-purple-600 mt-1">to Tier {currentMonthData.tier + 1}</div>
            </div>

            <div className="p-4 bg-orange-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-orange-700">Estimated Payout</span>
                <HelpCircle className="h-4 w-4 text-orange-400" />
              </div>
              <div className="text-2xl font-bold text-orange-900">
                {formatPaymentDate(selectedMonth)}
              </div>
              <div className="text-sm text-orange-600 mt-1">Next payment date</div>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-500">
            Points reset at the start of each month
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">{selectedMonth.split(' ')[0]} Bonus Progress</h2>
          
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <div className="text-lg">
                283 / 350 Points
              </div>
            </div>
            
            <div className="relative pt-1">
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-100">
                <div
                  style={{ width: `${calculateTierProgress(283)}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600"
                ></div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mb-4">
            <div>
              <div className="text-gray-600">Tier 2 ($2,000)</div>
            </div>
            <div className="text-gray-600">Tier 3 unlocks at 350 points ($3,000)</div>
            <div className="text-gray-600">Tier 4 unlocks at 450+ points ($4,000)</div>
          </div>

          <div className="text-sm text-gray-500 flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            Updated daily based on documented, billable CPT activity
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Points by CPT Code</h2>
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                Table View
              </button>
              <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                Chart View
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    CPT Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Units Billed
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Points/Unit
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Points Earned
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentMonthData.cptActivities.map((activity, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {activity.code}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {activity.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {activity.unitsBilled}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {activity.pointsPerUnit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {activity.pointsEarned}
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-50">
                  <td colSpan={4} className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Total Points
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-right">
                    {currentMonthData.totalPoints}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Patient-Level Points</h2>
            <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 flex items-center">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient Name
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Points Earned
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    CPT Codes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Activity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Engagement
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentMonthData.patientActivities.map((patient, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {patient.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {patient.pointsEarned}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {patient.cptCodes.join(', ')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {patient.lastActivity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        patient.engagement === 'high' ? 'bg-green-100 text-green-800' :
                        patient.engagement === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {patient.engagement}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Bonus History</h2>
            <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
              Download Statements
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Month
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Points
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tier Reached
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bonus Earned
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pay Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bonusHistory.map((record, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {record.month}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {record.points}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                      Tier {record.tier}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      ${record.bonus}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.payDate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Points;