import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, Users, User } from 'lucide-react';

interface CalendarProps {
  // ... existing props
}

const Calendar: React.FC<CalendarProps> = () => {
  const [viewScope, setViewScope] = useState<'my'|'everyone'>('my');
  const [viewType, setViewType] = useState<'calendar'|'availability'>('calendar');

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Calendar</h1>
      
      <div className="flex gap-2 mb-6">
        {/* My Calendar Tab */}
        <button
          onClick={() => {
            setViewType('calendar');
            setViewScope('my');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            viewType === 'calendar' && viewScope === 'my'
              ? 'bg-gray-900 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            <User className="h-4 w-4" />
          </div>
          <span>My Calendar</span>
        </button>

        {/* My Availability Tab */}
        <button
          onClick={() => {
            setViewType('availability');
            setViewScope('my');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            viewType === 'availability' && viewScope === 'my'
              ? 'bg-gray-900 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            <User className="h-4 w-4" />
          </div>
          <span>My Availability</span>
        </button>

        {/* Everyone's Calendar Tab */}
        <button
          onClick={() => {
            setViewType('calendar');
            setViewScope('everyone');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            viewType === 'calendar' && viewScope === 'everyone'
              ? 'bg-gray-900 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            <Users className="h-4 w-4" />
          </div>
          <span>Everyone's Calendar</span>
        </button>

        {/* Everyone's Availability Tab */}
        <button
          onClick={() => {
            setViewType('availability');
            setViewScope('everyone');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            viewType === 'availability' && viewScope === 'everyone'
              ? 'bg-gray-900 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            <Users className="h-4 w-4" />
          </div>
          <span>Everyone's Availability</span>
        </button>
      </div>

      {/* Calendar Content */}
      <div className="flex gap-4">
        <div className="flex-1">
          {/* Existing calendar content */}
        </div>
      </div>
    </div>
  );
};

export default Calendar; 