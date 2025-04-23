import React, { useState } from 'react';
import { X } from 'lucide-react';

interface ScheduleAppointmentProps {
  isOpen: boolean;
  onClose: () => void;
  patientName: string;
}

const ScheduleAppointment: React.FC<ScheduleAppointmentProps> = ({ isOpen, onClose, patientName }) => {
  const [appointmentData, setAppointmentData] = useState({
    provider: '',
    appointmentType: '',
    contactType: 'Video Call',
    videoCallMethod: 'Healthie Video Call',
    startDate: '',
    startTime: '',
    timezone: 'America/Los_Angeles',
    notes: '',
    isRepeating: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle appointment creation here
    console.log('Appointment data:', appointmentData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md my-8">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Schedule Appointment</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Invitee*
              </label>
              <input
                type="text"
                value={patientName}
                disabled
                className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Provider*
              </label>
              <select
                value={appointmentData.provider}
                onChange={(e) => setAppointmentData({ ...appointmentData, provider: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
              >
                <option value="">Select...</option>
                <option value="dr-smith">Dr. Smith</option>
                <option value="dr-jones">Dr. Jones</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Appointment type*
              </label>
              <select
                value={appointmentData.appointmentType}
                onChange={(e) => setAppointmentData({ ...appointmentData, appointmentType: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
              >
                <option value="">Select...</option>
                <option value="initial">Initial Consultation</option>
                <option value="followup">Follow-up</option>
                <option value="review">Review</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact type*
              </label>
              <select
                value={appointmentData.contactType}
                onChange={(e) => setAppointmentData({ ...appointmentData, contactType: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
              >
                <option value="Video Call">Video Call</option>
                <option value="Phone">Phone</option>
                <option value="In-Person">In-Person</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Video call method*
              </label>
              <select
                value={appointmentData.videoCallMethod}
                onChange={(e) => setAppointmentData({ ...appointmentData, videoCallMethod: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
              >
                <option value="Healthie Video Call">Healthie Video Call</option>
                <option value="Zoom">Zoom</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start date*
              </label>
              <input
                type="date"
                value={appointmentData.startDate}
                onChange={(e) => setAppointmentData({ ...appointmentData, startDate: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start time*
              </label>
              <input
                type="time"
                value={appointmentData.startTime}
                onChange={(e) => setAppointmentData({ ...appointmentData, startTime: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Timezone*
              </label>
              <select
                value={appointmentData.timezone}
                onChange={(e) => setAppointmentData({ ...appointmentData, timezone: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
              >
                <option value="America/Los_Angeles">America/Los Angeles - Your Timezone</option>
                <option value="America/New_York">America/New York</option>
                <option value="America/Chicago">America/Chicago</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                value={appointmentData.notes}
                onChange={(e) => setAppointmentData({ ...appointmentData, notes: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg h-24 resize-none"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="repeating"
                checked={appointmentData.isRepeating}
                onChange={(e) => setAppointmentData({ ...appointmentData, isRepeating: e.target.checked })}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label htmlFor="repeating" className="ml-2 text-sm text-gray-700">
                Repeating appointment?
              </label>
            </div>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add appointment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleAppointment; 