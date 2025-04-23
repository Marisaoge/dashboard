import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  Send,
  Info,
  Phone,
  MoreHorizontal,
  Plus,
  Users,
  Calendar as CalendarIcon, 
  Clock, 
  ChevronDown,
  FilterIcon,
  X,
  Settings,
  Users as UsersIcon,
  FileText,
  Repeat,
  Video,
  ChevronLeft,
  ChevronRight,
  Filter
} from 'lucide-react';

interface Appointment {
  id: string;
  title: string;
  start: string;
  end: string;
  day: number;
  type: 'available' | 'booked';
  location?: string;
  patient?: string;
}

interface AvailabilitySlot {
  id: string;
  type: string;
  duration: string;
  days: number[];
  timeRanges: {
    start: string;
    end: string;
  }[];
  capacity: number;
  location: 'Virtual' | 'In-person';
  provider: string;
}

const CalendarPage: React.FC = () => {
  const [currentView, setCurrentView] = useState<'day' | 'week' | 'month'>('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState<'calendar' | 'availability'>('calendar');
  const [showAppointments, setShowAppointments] = useState(true);
  const [syncedAppointments, setSyncedAppointments] = useState(true);
  const [filterExpanded, setFilterExpanded] = useState(true);
  const [availabilityExpanded, setAvailabilityExpanded] = useState(false);
  const [providersExpanded, setProvidersExpanded] = useState(false);
  const [providerViewExpanded, setProviderViewExpanded] = useState(false);
  const [selectedDay, setSelectedDay] = useState(1); // For day view, default to Monday (1)
  const [selectedAppointmentType, setSelectedAppointmentType] = useState<string>('all');
  const [showNewSlotModal, setShowNewSlotModal] = useState(false);
  const [showCalendarDropdown, setShowCalendarDropdown] = useState(false);
  const [showAvailabilityDropdown, setShowAvailabilityDropdown] = useState(false);
  const [isAllCalendars, setIsAllCalendars] = useState(false);
  const [isAllAvailability, setIsAllAvailability] = useState(false);

  // Mock data for the calendar
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dates = [9, 10, 11, 12, 13, 14, 15];
  const month = 'April';
  const year = 2023;
  
  const timeSlots = [
    '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', 
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
  ];

  // Sample availability slots
  const availabilitySlots: AvailabilitySlot[] = [
    {
      id: '1',
      type: 'EP Intake',
      duration: '60 min',
      days: [1, 3, 5], // Monday, Wednesday, Friday
      timeRanges: [
        { start: '9:00 AM', end: '11:00 AM' },
        { start: '2:00 PM', end: '4:00 PM' }
      ],
      capacity: 2,
      location: 'Virtual',
      provider: 'Dr. Sarah Johnson'
    },
    {
      id: '2',
      type: 'EP Follow-up',
      duration: '30 min',
      days: [2, 4], // Tuesday, Thursday
      timeRanges: [
        { start: '10:00 AM', end: '12:00 PM' },
        { start: '1:00 PM', end: '3:00 PM' }
      ],
      capacity: 3,
      location: 'Virtual',
      provider: 'Dr. Sarah Johnson'
    },
    {
      id: '3',
      type: 'EP Group Session',
      duration: '45 min',
      days: [1, 4], // Monday, Thursday
      timeRanges: [
        { start: '11:00 AM', end: '12:00 PM' }
      ],
      capacity: 8,
      location: 'Virtual',
      provider: 'Dr. Michael Chen'
    }
  ];

  // Sample appointments data
  const appointments: Appointment[] = [
    // Monday appointments
    { id: '1', title: 'Motiv Potential Healthier Training', start: '8:00', end: '9:00', day: 1, type: 'booked' },
    { id: '2', title: 'Task List: Review Items NorthShore launch', start: '10:30', end: '10:50', day: 1, type: 'booked' },
    { id: '3', title: 'Motiv All Hands', start: '10:30', end: '11:30', day: 1, type: 'booked' },
    { id: '4', title: 'meet', start: '11:45', end: '12:45', day: 1, type: 'booked' },
    { id: '5', title: 'Joe Ludwig', start: '3:30', end: '4:30', day: 1, type: 'booked' },
    
    // Tuesday appointments
    { id: '6', title: 'Morning Huddle, LCSW optional attend', start: '8:00', end: '9:00', day: 2, type: 'booked' },
    { id: '7', title: 'Healthier EMR Q&A w/ Motiv Clinical Team', start: '9:00', end: '10:00', day: 2, type: 'booked' },
    { id: '8', title: 'Walk you through clinical assessment', start: '10:15', end: '10:45', day: 2, type: 'booked' },
    { id: '9', title: 'TEST TEST GROUP', start: '11:00', end: '12:00', day: 2, type: 'booked' },
    { id: '10', title: 'Jane Smith', start: '11:30', end: '1:00', day: 2, type: 'booked' },
    
    // Wednesday appointments
    { id: '11', title: 'Morning Huddle, LCSW optional', start: '8:00', end: '9:00', day: 3, type: 'available' },
    { id: '12', title: 'Test', start: '9:00', end: '10:00', day: 3, type: 'booked' },
    { id: '13', title: 'Morning Huddle with OpenAI', start: '10:30', end: '11:00', day: 3, type: 'available' },
    { id: '14', title: 'Jane', start: '11:30', end: '12:30', day: 3, type: 'booked' },
    
    // Thursday appointments
    { id: '15', title: 'Morning Huddle, LCSW optional', start: '8:00', end: '9:00', day: 4, type: 'booked' },
    { id: '16', title: 'Cindy / Ed 1:1', start: '2:00', end: '3:00', day: 4, type: 'booked' },
    
    // Friday appointments
    { id: '17', title: 'PTO 8:00-9:30 Process Review: NS EHR', start: '8:00', end: '9:30', day: 5, type: 'booked' },
    { id: '18', title: 'Morning Huddle with Ops', start: '9:00', end: '10:00', day: 5, type: 'booked' },
    { id: '19', title: 'Morning Huddle with OpenAI', start: '10:30', end: '11:00', day: 5, type: 'available' },
    { id: '20', title: 'App testing check-in', start: '10:00', end: '11:00', day: 5, type: 'booked' },
    { id: '21', title: 'Cindy / Hannah', start: '11:00', end: '12:00', day: 5, type: 'booked' },
    { id: '22', title: 'LCSW - VPN training to access NorthShore', start: '12:00', end: '1:00', day: 5, type: 'booked' },
    { id: '23', title: 'LCSW/Exclusion/Inclusion?', start: '12:30', end: '1:30', day: 5, type: 'booked' },
  ];

  // Function to navigate to previous/next week
  const navigatePrevious = () => {
    const newDate = new Date(currentDate);
    if (currentView === 'day') {
      newDate.setDate(newDate.getDate() - 1);
      setSelectedDay(selectedDay === 0 ? 6 : selectedDay - 1);
    } else if (currentView === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else if (currentView === 'month') {
      newDate.setMonth(newDate.getMonth() - 1);
    }
    setCurrentDate(newDate);
  };

  const navigateNext = () => {
    const newDate = new Date(currentDate);
    if (currentView === 'day') {
      newDate.setDate(newDate.getDate() + 1);
      setSelectedDay(selectedDay === 6 ? 0 : selectedDay + 1);
    } else if (currentView === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else if (currentView === 'month') {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  // Function to get appointments for a specific day and time
  const getAppointmentsForTimeSlot = (day: number, time: string) => {
    const hourMinute = time.split(' ')[0]; // Extract "8:00" from "8:00 AM"
    const [hour, minute] = hourMinute.split(':').map(Number);
    
    return appointments.filter(appointment => {
      const [startHour, startMinute] = appointment.start.split(':').map(Number);
      const [endHour, endMinute] = appointment.end.split(':').map(Number);
      
      const appointmentStartTime = startHour * 60 + startMinute;
      const appointmentEndTime = endHour * 60 + endMinute;
      const slotTime = hour * 60 + minute;
      
      // Check if the appointment is on the correct day and overlaps with this time slot
      return appointment.day === day && 
             slotTime >= appointmentStartTime && 
             slotTime < appointmentEndTime;
    });
  };

  // Function to format the date range for display
  const formatDateRange = () => {
    if (currentView === 'day') {
      return `${month} ${dates[selectedDay]}, ${year}`;
    } else if (currentView === 'week') {
      return `${month} ${dates[0]} - ${dates[dates.length - 1]}, ${year}`;
    } else {
      return `${month} ${year}`;
    }
  };

  // Function to handle view change
  const handleViewChange = (view: 'day' | 'week' | 'month') => {
    setCurrentView(view);
  };

  // Generate month days for the month view
  const generateMonthDays = () => {
    // This is a simplified version - in a real app, you'd calculate actual days
    const daysInMonth = 31; // Assuming April has 31 days for simplicity
    const firstDayOfMonth = 6; // Saturday (0-indexed, 0 = Sunday)
    
    const days = [];
    
    // Add empty cells for days before the 1st of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return days;
  };

  // Get appointments for a specific day (for month view)
  const getAppointmentsForDay = (day: number) => {
    return appointments.filter(appointment => {
      // In a real app, you'd check if the appointment falls on this day of the month
      // For this example, we'll just use the day of week (1-7) to match with our sample data
      const dayOfWeek = (day + 5) % 7; // Convert day of month to day of week (0-6)
      return appointment.day === dayOfWeek;
    });
  };

  // Function to check if a time slot is available for a specific appointment type
  const isTimeSlotAvailable = (day: number, time: string, type: string) => {
    const slot = availabilitySlots.find(s => s.type === type);
    if (!slot) return false;

    // Check if the slot is available on this day
    if (!slot.days.includes(day)) return false;

    // Convert time to 24-hour format for comparison
    const [hour, minute] = time.split(':');
    const isPM = time.includes('PM');
    let hour24 = parseInt(hour);
    if (isPM && hour24 !== 12) hour24 += 12;
    if (!isPM && hour24 === 12) hour24 = 0;

    // Check if the time falls within any of the slot's time ranges
    return slot.timeRanges.some(range => {
      const [startHour, startMinute] = range.start.split(':');
      const [endHour, endMinute] = range.end.split(':');
      const startTime = parseInt(startHour) * 60 + parseInt(startMinute.split(' ')[0]);
      const endTime = parseInt(endHour) * 60 + parseInt(endMinute.split(' ')[0]);
      const currentTime = hour24 * 60 + parseInt(minute);

      return currentTime >= startTime && currentTime < endTime;
    });
  };

  const getAvailabilityColor = (type: string) => {
    switch (type) {
      case 'EP Intake':
        return 'bg-blue-100 text-blue-800';
      case 'EP Follow-up':
        return 'bg-green-100 text-green-800';
      case 'EP Group Session':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">

      {/* Calendar Navigation */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex flex-wrap justify-between items-center gap-2">
          <div className="flex space-x-2">
            {/* Calendar Button with Dropdown */}
            <div className="relative">
              <button 
                className={`px-4 py-2 rounded-md flex items-center space-x-2 ${activeTab === 'calendar' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-700'}`}
                onClick={() => {
                  setActiveTab('calendar');
                  setShowCalendarDropdown(!showCalendarDropdown);
                }}
              >
                <CalendarIcon className="h-4 w-4" />
                <span>{isAllCalendars ? 'All Calendars' : 'My Calendar'}</span>
                <ChevronDown className="h-4 w-4 ml-1" />
              </button>
              {showCalendarDropdown && (
                <div className="absolute z-50 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200">
                  <div className="py-1">
                    <button
                      className={`w-full px-4 py-2 text-left text-sm ${!isAllCalendars ? 'bg-gray-100' : ''} hover:bg-gray-100`}
                      onClick={() => {
                        setIsAllCalendars(false);
                        setShowCalendarDropdown(false);
                      }}
                    >
                      My Calendar
                    </button>
                    <button
                      className={`w-full px-4 py-2 text-left text-sm ${isAllCalendars ? 'bg-gray-100' : ''} hover:bg-gray-100`}
                      onClick={() => {
                        setIsAllCalendars(true);
                        setShowCalendarDropdown(false);
                      }}
                    >
                      All Calendars
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Availability Button with Dropdown */}
            <div className="relative">
              <button 
                className={`px-4 py-2 rounded-md flex items-center space-x-2 ${activeTab === 'availability' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-700'}`}
                onClick={() => {
                  setActiveTab('availability');
                  setShowAvailabilityDropdown(!showAvailabilityDropdown);
                }}
              >
                <Clock className="h-4 w-4" />
                <span>{isAllAvailability ? 'All Availability' : 'My Availability'}</span>
                <ChevronDown className="h-4 w-4 ml-1" />
              </button>
              {showAvailabilityDropdown && (
                <div className="absolute z-50 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200" style={{ position: 'absolute', top: '100%', left: '0' }}>
                  <div className="py-1">
                    <button
                      className={`w-full px-4 py-2 text-left text-sm ${!isAllAvailability ? 'bg-gray-100' : ''} hover:bg-gray-100`}
                      onClick={() => {
                        setIsAllAvailability(false);
                        setShowAvailabilityDropdown(false);
                      }}
                    >
                      My Availability
                    </button>
                    <button
                      className={`w-full px-4 py-2 text-left text-sm ${isAllAvailability ? 'bg-gray-100' : ''} hover:bg-gray-100`}
                      onClick={() => {
                        setIsAllAvailability(true);
                        setShowAvailabilityDropdown(false);
                      }}
                    >
                      All Availability
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex border border-gray-300 rounded-md overflow-hidden">
              <button 
                className={`px-3 py-1 text-sm ${currentView === 'day' ? 'bg-gray-200' : 'bg-white'}`}
                onClick={() => handleViewChange('day')}
              >
                day
              </button>
              <button 
                className={`px-3 py-1 text-sm ${currentView === 'week' ? 'bg-gray-200' : 'bg-white'}`}
                onClick={() => handleViewChange('week')}
              >
                week
              </button>
              <button 
                className={`px-3 py-1 text-sm ${currentView === 'month' ? 'bg-gray-200' : 'bg-white'}`}
                onClick={() => handleViewChange('month')}
              >
                month
              </button>
            </div>
            <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md">
              today
            </button>
            <button 
              className="p-1 text-gray-600 hover:text-gray-800"
              onClick={navigatePrevious}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button 
              className="p-1 text-gray-600 hover:text-gray-800"
              onClick={navigateNext}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">{formatDateRange()}</span>
            <button 
              className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
              onClick={() => setShowNewSlotModal(true)}
            >
              <Plus className="h-4 w-4" />
              <span className="sr-only">Add</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto flex-shrink-0 hidden md:block">
          {activeTab === 'calendar' ? (
            <div className="p-4">
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">FEBRUARY 2023</h3>
                <div className="grid grid-cols-7 gap-1 text-center text-xs">
                  <div className="text-gray-500">SU</div>
                  <div className="text-gray-500">MO</div>
                  <div className="text-gray-500">TU</div>
                  <div className="text-gray-500">WE</div>
                  <div className="text-gray-500">TH</div>
                  <div className="text-gray-500">FR</div>
                  <div className="text-gray-500">SA</div>
                  
                  <div className="py-1 text-gray-400">29</div>
                  <div className="py-1 text-gray-400">30</div>
                  <div className="py-1 text-gray-400">31</div>
                  <div className="py-1">1</div>
                  <div className="py-1">2</div>
                  <div className="py-1">3</div>
                  <div className="py-1">4</div>
                  
                  <div className="py-1">5</div>
                  <div className="py-1">6</div>
                  <div className="py-1">7</div>
                  <div className="py-1">8</div>
                  <div className="py-1">9</div>
                  <div className="py-1">10</div>
                  <div className="py-1">11</div>
                  
                  <div className="py-1">12</div>
                  <div className="py-1">13</div>
                  <div className="py-1">14</div>
                  <div className="py-1">15</div>
                  <div className="py-1">16</div>
                  <div className="py-1">17</div>
                  <div className="py-1">18</div>
                  
                  <div className="py-1">19</div>
                  <div className="py-1">20</div>
                  <div className="py-1">21</div>
                  <div className="py-1">22</div>
                  <div className="py-1">23</div>
                  <div className="py-1">24</div>
                  <div className="py-1">25</div>
                  
                  <div className="py-1">26</div>
                  <div className="py-1">27</div>
                  <div className="py-1">28</div>
                  <div className="py-1 text-gray-400">1</div>
                  <div className="py-1 text-gray-400">2</div>
                  <div className="py-1 text-gray-400">3</div>
                  <div className="py-1 text-gray-400">4</div>
                </div>
              </div>
              
              {/* Filter section */}
              <div className="mb-4">
                <button 
                  className="w-full flex items-center justify-between text-blue-600 mb-2"
                  onClick={() => setFilterExpanded(!filterExpanded)}
                >
                  <span className="font-medium">Filter Appointments</span>
                  <ChevronDown className={`h-4 w-4 transform ${filterExpanded ? 'rotate-180' : ''}`} />
                </button>
                
                {filterExpanded && (
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        id="showAppointments" 
                        checked={showAppointments}
                        onChange={() => setShowAppointments(!showAppointments)}
                        className="mr-2"
                      />
                      <label htmlFor="showAppointments" className="text-sm">Show Appointments</label>
                    </div>
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        id="syncedAppointments" 
                        checked={syncedAppointments}
                        onChange={() => setSyncedAppointments(!syncedAppointments)}
                        className="mr-2"
                      />
                      <label htmlFor="syncedAppointments" className="text-sm">Synced Appointments</label>
                    </div>
                    
                    <div>
                      <div className="text-sm mb-1">Organization</div>
                      <select className="w-full p-2 border border-gray-300 rounded-md text-sm">
                        <option>All</option>
                      </select>
                    </div>
                    
                    <div>
                      <div className="text-sm mb-1">Appointment Type</div>
                      <select className="w-full p-2 border border-gray-300 rounded-md text-sm">
                        <option>All</option>
                      </select>
                    </div>
                    
                    <div>
                      <div className="text-sm mb-1">Appointment Status</div>
                      <select className="w-full p-2 border border-gray-300 rounded-md text-sm">
                        <option>All</option>
                      </select>
                    </div>
                    
                    <div>
                      <div className="text-sm mb-1">Provider</div>
                      <select className="w-full p-2 border border-gray-300 rounded-md text-sm">
                        <option>All</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-4">
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-4">Appointment Types</h3>
                <div className="space-y-3">
                  <button
                    className={`w-full text-left p-3 rounded-lg ${selectedAppointmentType === 'all' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                    onClick={() => setSelectedAppointmentType('all')}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">All Types</span>
                    </div>
                  </button>
                  {availabilitySlots.map(slot => (
                    <button
                      key={slot.id}
                      className={`w-full text-left p-3 rounded-lg ${selectedAppointmentType === slot.type ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                      onClick={() => setSelectedAppointmentType(slot.type)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{slot.type}</div>
                          <div className="text-sm text-gray-500">{slot.duration}</div>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs ${getAvailabilityColor(slot.type)}`}>
                          {slot.capacity} slots
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium mb-4">Settings</h3>
                <div className="space-y-4">
                  <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center">
                      <Settings className="h-5 w-5 text-gray-400 mr-3" />
                      <span>Scheduling Rules</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </button>
                  <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center">
                      <UsersIcon className="h-5 w-5 text-gray-400 mr-3" />
                      <span>Team Availability</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </button>
                  <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-gray-400 mr-3" />
                      <span>Forms & Waivers</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </button>
                  <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center">
                      <Repeat className="h-5 w-5 text-gray-400 mr-3" />
                      <span>Recurring Sessions</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Calendar Grid */}
        <div className="flex-1 overflow-auto relative calendar-container">
          {currentView === 'day' && (
            <div className="h-full">
              {/* Day header */}
              <div className="grid grid-cols-1 border-b border-gray-200 sticky top-0 z-10">
                <div className="p-2 text-center border-r border-gray-200 bg-white">
                  <div className="font-medium">{days[selectedDay]}</div>
                  <div>{dates[selectedDay]}</div>
                </div>
              </div>
              
              {/* Time slots */}
              <div>
                {timeSlots.map((time, timeIndex) => {
                  const dayAppointments = getAppointmentsForTimeSlot(selectedDay, time);
                  const hasAvailable = dayAppointments.some(app => app.type === 'available');
                  const hasBooked = dayAppointments.some(app => app.type === 'booked');
                  
                  let bgColor = 'bg-white';
                  if (hasAvailable) bgColor = 'bg-green-100';
                  if (hasBooked) bgColor = 'bg-blue-800 text-white';
                  
                  return (
                    <div key={timeIndex} className="grid grid-cols-1 border-b border-gray-200">
                      {/* Time label - Now as an absolute positioned element */}
                      <div className="absolute -left-16 text-right text-sm text-gray-600 py-2 w-16">
                        {time}
                      </div>
                      
                      <div className={`p-2 border-r border-gray-200 min-h-[60px] relative ${bgColor}`}>
                        {dayAppointments.map(appointment => (
                          <div 
                            key={appointment.id}
                            className={`text-xs ${appointment.type === 'available' ? 'text-green-800' : 'text-white'}`}
                          >
                            <div className="truncate">{appointment.title}</div>
                            <div className="text-xs opacity-75">{appointment.start} - {appointment.end}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          {currentView === 'week' && (
            <div className="h-full">
              {/* Day headers */}
              <div className="grid grid-cols-7 border-b border-gray-200 sticky top-0 z-10">
                {days.map((day, index) => (
                  <div key={index} className="p-2 text-center border-r border-gray-200 bg-white">
                    <div className="font-medium">{day}</div>
                    <div>{dates[index]}</div>
                  </div>
                ))}
              </div>
              
              {/* Time slots */}
              <div>
                {timeSlots.map((time, timeIndex) => (
                  <div key={timeIndex} className="grid grid-cols-7 border-b border-gray-200">
                    {/* Time label - Now as an absolute positioned element */}
                    <div className="absolute -left-16 text-right text-sm text-gray-600 py-2 w-16">
                      {time}
                    </div>
                    
                    {/* Day cells */}
                    {Array.from({ length: 7 }, (_, dayIndex) => {
                      if (activeTab === 'calendar') {
                        const dayAppointments = getAppointmentsForTimeSlot(dayIndex, time);
                        const hasAvailableSlot = dayAppointments.some(app => app.type === 'available');
                        const hasBookedSlot = dayAppointments.some(app => app.type === 'booked');
                        
                        let bgColor = 'bg-white';
                        if (hasAvailableSlot) bgColor = 'bg-green-100';
                        if (hasBookedSlot) bgColor = 'bg-blue-800 text-white';
                        
                        return (
                          <div 
                            key={dayIndex} 
                            className={`p-2 border-r border-gray-200 min-h-[60px] relative ${bgColor}`}
                          >
                            {dayAppointments.map(appointment => (
                              <div 
                                key={appointment.id}
                                className={`text-xs ${appointment.type === 'available' ? 'text-green-800' : 'text-white'}`}
                              >
                                <div className="truncate">{appointment.title}</div>
                                <div className="text-xs opacity-75">{appointment.start} - {appointment.end}</div>
                              </div>
                            ))}
                          </div>
                        );
                      } else {
                        // Availability view
                        const availableTypes = availabilitySlots.filter(slot => {
                          if (selectedAppointmentType === 'all' || selectedAppointmentType === slot.type) {
                            return slot.days.includes(dayIndex) && isTimeSlotAvailable(dayIndex, time, slot.type);
                          }
                          return false;
                        });

                        return (
                          <div 
                            key={dayIndex}
                            className="p-2 border-r border-gray-200 min-h-[60px] relative bg-white"
                          >
                            {availableTypes.map(slot => (
                              <div
                                key={slot.id}
                                className={`text-xs p-2 rounded mb-1 ${getAvailabilityColor(slot.type)}`}
                              >
                                <div className="flex items-center">
                                  <Video className="h-3 w-3 mr-1" />
                                  <span>{slot.type}</span>
                                </div>
                                <div className="text-xs opacity-75">{slot.duration}</div>
                              </div>
                            ))}
                          </div>
                        );
                      }
                    })}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {currentView === 'month' && (
            <div className="h-full p-4">
              <div className="text-xl font-bold mb-4">{month} {year}</div>
              
              {/* Month view */}
              <div className="grid grid-cols-7 gap-1">
                {/* Day headers */}
                {days.map((day, index) => (
                  <div key={index} className="p-2 text-center font-medium text-gray-700">
                    {day}
                  </div>
                ))}
                
                {/* Calendar days */}
                {generateMonthDays().map((day, index) => {
                  if (day === null) {
                    return <div key={`empty-${index}`} className="h-24 p-1 bg-gray-100 border border-gray-200"></div>;
                  }
                  
                  const dayAppointments = getAppointmentsForDay(day);
                  const hasAvailable = dayAppointments.some(app => app.type === 'available');
                  const hasBooked = dayAppointments.some(app => app.type === 'booked');
                  
                  return (
                    <div 
                      key={`day-${day}`} 
                      className="h-24 p-1 bg-white border border-gray-200 overflow-hidden"
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className={`text-sm font-medium ${day === 10 ? 'bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center' : ''}`}>
                          {day}
                        </span>
                        {(hasAvailable || hasBooked) && (
                          <div className="flex space-x-1">
                            {hasAvailable && <div className="w-2 h-2 rounded-full bg-green-500"></div>}
                            {hasBooked && <div className="w-2 h-2 rounded-full bg-blue-600"></div>}
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-1">
                        {dayAppointments.slice(0, 2).map(appointment => (
                          <div 
                            key={appointment.id}
                            className={`text-xs truncate px-1 py-0.5 rounded ${
                              appointment.type === 'available' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {appointment.start} {appointment.title.substring(0, 12)}...
                          </div>
                        ))}
                        
                        {dayAppointments.length > 2 && (
                          <div className="text-xs text-gray-500 pl-1">
                            +{dayAppointments.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* New Availability Slot Modal */}
      {showNewSlotModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Add Availability Slot</h3>
              <button 
                onClick={() => setShowNewSlotModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Appointment Type
                </label>
                <select className="w-full p-2 border border-gray-300 rounded-md">
                  <option>EP Intake (60 min)</option>
                  <option>EP Follow-up (30 min)</option>
                  <option>EP Group Session (45 min)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Days Available
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {days.map((day, index) => (
                    <label key={day} className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded text-blue-600" />
                      <span className="text-sm">{day}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time Range
                </label>
                <div className="flex items-center space-x-2">
                  <select className="p-2 border border-gray-300 rounded-md">
                    <option>9:00 AM</option>
                    <option>10:00 AM</option>
                    <option>11:00 AM</option>
                  </select>
                  <span>to</span>
                  <select className="p-2 border border-gray-300 rounded-md">
                    <option>4:00 PM</option>
                    <option>5:00 PM</option>
                    <option>6:00 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Capacity
                </label>
                <input
                  type="number"
                  min="1"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Number of slots"
                />
              </div>

              <div className="flex justify-end space-x-2 mt-6">
                <button
                  onClick={() => setShowNewSlotModal(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowNewSlotModal(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save Availability
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;