import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  ChevronUp,
  Filter,
  FileText,
  Plus,
  ArrowUpDown
} from 'lucide-react';

interface Form {
  id: string;
  type: 'chart' | 'form';
  name: string;
  createdBy: {
    name: string;
    avatar: string;
  };
  lastUpdated: string;
  hasAttachment?: boolean;
}

const FormsPage: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'your' | 'archived' | 'intake'>('your');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'intake' | 'charting'>('all');

  // Sample data for forms
  const forms: Form[] = [
    {
      id: '1',
      type: 'chart',
      name: 'Motiv Progress Checkin PCM/RPM_8/21/23_DRAFT',
      createdBy: {
        name: 'Uppie U',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'
      },
      lastUpdated: 'Oct 3, 2023',
      hasAttachment: true
    },
    {
      id: '2',
      type: 'chart',
      name: 'Motiv RPM Device Setup (Provider Name)',
      createdBy: {
        name: 'CoachMatt C',
        avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150'
      },
      lastUpdated: 'Oct 2, 2023',
      hasAttachment: true
    },
    {
      id: '3',
      type: 'chart',
      name: 'Motiv Psychotherapy Progress Note (Provider Name)',
      createdBy: {
        name: 'CoachMatt C',
        avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150'
      },
      lastUpdated: 'Oct 2, 2023',
      hasAttachment: true
    },
    {
      id: '4',
      type: 'chart',
      name: 'Motiv Progress Checkin PCM/RPM_DRAFT_TESTDRIVE',
      createdBy: {
        name: 'Uppie U',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'
      },
      lastUpdated: 'Sep 28, 2023',
      hasAttachment: true
    },
    {
      id: '5',
      type: 'chart',
      name: 'RPM Device Setup',
      createdBy: {
        name: 'Marisa O',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
      },
      lastUpdated: 'Sep 27, 2023'
    },
    {
      id: '6',
      type: 'chart',
      name: 'Motiv Psychotherapy Intake (Provider Name)',
      createdBy: {
        name: 'CoachMatt C',
        avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150'
      },
      lastUpdated: 'Sep 19, 2023',
      hasAttachment: true
    },
    {
      id: '7',
      type: 'chart',
      name: 'Chart Review Summary DRAFT 8/29/23',
      createdBy: {
        name: 'Uppie U',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'
      },
      lastUpdated: 'Sep 12, 2023',
      hasAttachment: true
    },
    {
      id: '8',
      type: 'chart',
      name: 'Motiv Onboarding Assessment Uppie draft8/9',
      createdBy: {
        name: 'Uppie U',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'
      },
      lastUpdated: 'Sep 8, 2023',
      hasAttachment: true
    },
    {
      id: '9',
      type: 'form',
      name: 'DO NOT USE KG',
      createdBy: {
        name: 'Kirsten G',
        avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150'
      },
      lastUpdated: 'Sep 7, 2023'
    },
    {
      id: '10',
      type: 'chart',
      name: 'Motiv Progress Checkin PCM/RPM_8/21/23_MATT DRAFT',
      createdBy: {
        name: 'CoachMatt C',
        avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150'
      },
      lastUpdated: 'Aug 31, 2023',
      hasAttachment: true
    },
    {
      id: '11',
      type: 'form',
      name: 'Motiv New Patient CC',
      createdBy: {
        name: 'Alisa R',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150'
      },
      lastUpdated: 'Aug 31, 2023',
      hasAttachment: true
    }
  ];

  // Filter forms based on search query
  const filteredForms = forms.filter(form => 
    form.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col w-full">

      <main className="flex-1 p-4 lg:p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold flex items-center">
            <FileText className="mr-2 h-6 w-6" /> Forms
          </h1>
        </div>

        {/* Sub Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <div className="flex">
            <button
              className={`px-6 py-2 text-sm font-medium ${
                activeSubTab === 'your'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveSubTab('your')}
            >
              Your Forms
            </button>
            <button
              className={`px-6 py-2 text-sm font-medium ${
                activeSubTab === 'archived'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveSubTab('archived')}
            >
              Archived Forms
            </button>
            <button
              className={`px-6 py-2 text-sm font-medium ${
                activeSubTab === 'intake'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveSubTab('intake')}
            >
              Intake Flows
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Search Forms..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          
          <div className="flex space-x-2 w-full md:w-auto">
            <button
              className={`px-4 py-2 rounded-lg text-sm ${
                activeFilter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setActiveFilter('all')}
            >
              All
            </button>
            <button
              className={`px-4 py-2 rounded-lg text-sm ${
                activeFilter === 'intake'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setActiveFilter('intake')}
            >
              Intake Forms
            </button>
            <button
              className={`px-4 py-2 rounded-lg text-sm flex items-center ${
                activeFilter === 'charting'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setActiveFilter('charting')}
            >
              <span>Charting Templates</span>
            </button>
            <button className="bg-white border border-gray-300 text-blue-600 px-4 py-2 rounded-lg text-sm flex items-center hover:bg-gray-50">
              <Plus className="h-4 w-4 mr-1" />
              <span>Create</span>
            </button>
          </div>
        </div>

        {/* Forms Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <span>Name</span>
                    <ArrowUpDown className="h-3 w-3 ml-1 text-gray-400" />
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <span>Created By</span>
                    <ArrowUpDown className="h-3 w-3 ml-1 text-gray-400" />
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <span>Last Updated</span>
                    <ArrowUpDown className="h-3 w-3 ml-1 text-gray-400" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredForms.map((form) => (
                <tr key={form.id} className="hover:bg-gray-50 cursor-pointer">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-blue-600">
                      <FileText className="h-5 w-5" />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-900">{form.name}</span>
                      {form.hasAttachment && (
                        <svg className="ml-2 h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M21.44 11.05L12.25 20.24C11.1242 21.3658 9.59723 21.9983 8.005 21.9983C6.41277 21.9983 4.88584 21.3658 3.76 20.24C2.63416 19.1142 2.00166 17.5872 2.00166 15.995C2.00166 14.4028 2.63416 12.8758 3.76 11.75L12.33 3.18C13.0806 2.42975 14.0991 2.00129 15.16 2.00129C16.2209 2.00129 17.2394 2.42975 17.99 3.18C18.7403 3.93063 19.1687 4.94905 19.1687 6.01C19.1687 7.07095 18.7403 8.08938 17.99 8.84L9.41 17.41C9.03472 17.7853 8.52573 17.9961 7.995 17.9961C7.46427 17.9961 6.95528 17.7853 6.58 17.41C6.20472 17.0347 5.99389 16.5257 5.99389 15.995C5.99389 15.4643 6.20472 14.9553 6.58 14.58L15.07 6.1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img className="h-8 w-8 rounded-full mr-2" src={form.createdBy.avatar} alt="" />
                      <div className="text-sm text-gray-900">{form.createdBy.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {form.lastUpdated}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default FormsPage;