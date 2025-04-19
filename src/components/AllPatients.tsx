import React, { useState } from 'react';
import { Search, Filter, MoreHorizontal, X } from 'lucide-react';

interface Patient {
  id: string;
  name: string;
  group: string;
  coach: string;
  therapist: string;
  pcm: number;
  rpm: number;
  bhi: number;
  bp: number;
  tags: string[];
}

const AllPatients: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const patients: Patient[] = [
    {
      id: '1',
      name: 'Joe Smith',
      group: 'On hold active',
      coach: 'Hannah Wright',
      therapist: 'Alisa Fishman',
      pcm: 16,
      rpm: 50,
      bhi: 35,
      bp: 12,
      tags: ['at high risk', 'out of state']
    },
    {
      id: '2',
      name: 'Jane Tons',
      group: 'On hold active',
      coach: 'Cindy Parnell',
      therapist: 'Alisa Fishman',
      pcm: 75,
      rpm: 15,
      bhi: 10,
      bp: 22,
      tags: []
    }
  ];

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

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="mb-6">
        <div className="relative flex-1 max-w-xs">
          <input
            type="text"
            placeholder="Search all patients..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

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
                <TableHeader centered></TableHeader>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPatients.map((patient) => (
                <tr key={patient.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">{patient.name}</td>
                  <td className="px-4 py-3 text-sm">{patient.group}</td>
                  <td className="px-4 py-3 text-sm truncate" title={patient.coach}>{patient.coach}</td>
                  <td className="px-4 py-3 text-sm truncate" title={patient.therapist}>{patient.therapist}</td>
                  <td className="px-4 py-3 text-sm text-center">{patient.pcm}</td>
                  <td className="px-4 py-3 text-sm text-center">{patient.rpm}</td>
                  <td className="px-4 py-3 text-sm text-center">{patient.bhi}</td>
                  <td className="px-4 py-3 text-sm text-center">{patient.bp}</td>
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
  );
};

export default AllPatients;