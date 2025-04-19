import React, { useState } from 'react';
import { X, Pencil, Trash2, Copy } from 'lucide-react';

interface AppointmentDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  appointment?: {
    date: string;
    month: string;
    day: string;
    type: string;
    duration: string;
    timeRange: string;
    timezone: string;
    link?: string;
    clientLink?: string;
    insuranceBilling?: string;
    provider?: string;
    clientPhone?: string;
    notes?: string;
  };
}

const AppointmentDetails: React.FC<AppointmentDetailsProps> = ({
  isOpen,
  onClose,
  appointment = {
    date: 'Wednesday',
    month: 'FEB',
    day: '12',
    type: 'Secure Videochat - Coach Intake',
    duration: '30min',
    timeRange: '4:30 - 5:00 PM PST',
    timezone: 'PST',
    link: 'Click to join Zoom meeting',
    clientLink: 'https://zoom.us/j/97613684106?pwd=vRocml3wOj6UpZj3O0Wvt8GHtYD41z.1',
    insuranceBilling: 'Disabled',
    provider: 'Uppie Updegraff',
    clientPhone: '--',
    notes: '--'
  }
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!isOpen) return null;

  const handleDelete = () => {
    // Handle delete logic here
    setShowDeleteConfirm(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-bold">Session details</h2>
              <p className="text-sm text-gray-600 mt-1">{appointment.duration} with {appointment.provider}</p>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <Pencil className="h-5 w-5 text-gray-600" />
              </button>
              <button 
                className="p-2 hover:bg-gray-100 rounded-full"
                onClick={() => setShowDeleteConfirm(true)}
              >
                <Trash2 className="h-5 w-5 text-gray-600" />
              </button>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>

          <div className="flex items-start space-x-4 mb-6">
            <div className="bg-blue-600 text-white rounded-lg p-3 text-center min-w-[60px]">
              <div className="text-sm font-medium">{appointment.month}</div>
              <div className="text-2xl font-bold">{appointment.day}</div>
            </div>
            <div>
              <div className="font-medium">{appointment.type}</div>
              <div className="text-sm text-gray-600">
                {appointment.duration}
              </div>
              <div className="text-sm text-gray-600">
                {appointment.timeRange}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium mb-1">Your Link:</div>
              <a href="#" className="text-blue-600 hover:underline text-sm">
                {appointment.link}
              </a>
            </div>

            <div>
              <div className="text-sm font-medium mb-1">Client Link:</div>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={appointment.clientLink}
                  readOnly
                  className="text-sm bg-gray-50 border border-gray-200 rounded p-2 w-full"
                />
                <button className="p-2 hover:bg-gray-100 rounded">
                  <Copy className="h-4 w-4 text-gray-600" />
                </button>
              </div>
            </div>

            <div>
              <div className="text-sm font-medium mb-1">Insurance Billing</div>
              <div className="text-sm text-gray-600">{appointment.insuranceBilling}</div>
            </div>

            <div>
              <div className="text-sm font-medium mb-1">Provider</div>
              <div className="text-sm text-gray-600">{appointment.provider}</div>
            </div>

            <div>
              <div className="text-sm font-medium mb-1">Client phone number</div>
              <div className="text-sm text-gray-600">{appointment.clientPhone}</div>
            </div>

            <div>
              <div className="text-sm font-medium mb-1">Notes</div>
              <div className="text-sm text-gray-600">{appointment.notes}</div>
            </div>

            <div>
              <div className="text-sm font-medium mb-1">Duration (minutes)</div>
              <input
                type="text"
                placeholder="Number of minutes"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>

            <div>
              <div className="text-sm font-medium mb-1">Status</div>
              <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
                <option>Select Status</option>
                <option>Scheduled</option>
                <option>Completed</option>
                <option>Cancelled</option>
                <option>No Show</option>
              </select>
            </div>

            <button className="w-full bg-blue-600 text-white rounded-md py-2 hover:bg-blue-700">
              Save
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Delete Appointment</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this appointment? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentDetails;