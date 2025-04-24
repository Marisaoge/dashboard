import React from 'react';
import { X, CheckCircle, Truck, Clock, Lock } from 'lucide-react';

interface KitDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const KitDetailsModal: React.FC<KitDetailsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const kitDetails = {
    name: "Motiv SmartMeter Kit (Kit)",
    count: 1,
    timeline: [
      {
        status: "Delivered",
        date: "9/3/24, 11:11 AM",
        icon: CheckCircle,
        color: "text-green-500",
        bgColor: "bg-green-100"
      },
      {
        status: "Shipped",
        date: "8/29/24, 12:48 PM",
        icon: Truck,
        color: "text-blue-500",
        bgColor: "bg-blue-100"
      },
      {
        status: "Awaiting Shipment",
        date: "8/29/24, 12:31 PM",
        icon: Clock,
        color: "text-blue-500",
        bgColor: "bg-blue-100"
      },
      {
        status: "Order Placed",
        date: "8/29/24, 12:16 PM",
        icon: Lock,
        color: "text-gray-500",
        bgColor: "bg-gray-100"
      }
    ],
    items: [
      {
        name: "Motiv Custom Box - EH Motiv Kit 11.5x8.5x4.5",
        perKit: 1,
        total: 1
      },
      {
        name: "Motiv - RPE Scale Insert EH 9x4",
        perKit: 1,
        total: 1
      },
      {
        name: "Motiv - Virtual Cardiac Recover Program EH 7x5",
        perKit: 1,
        total: 1
      },
      {
        name: "PerformBetter Resistance Band Mini Band Blue (Heavy Resistance) [1ct]",
        perKit: 1,
        total: 1
      },
      {
        name: "PerformBetter Resistance Band Mini Band Green (Medium Resistance) [1ct]",
        perKit: 1,
        total: 1
      },
      {
        name: "PerformBetter Resistance Band Mini Band Yellow (Light Resistance) [1ct]",
        perKit: 1,
        total: 1
      },
      {
        name: "SmartMeter BP Monitor SMBP802 (LTE)",
        perKit: 1,
        total: 1
      }
    ]
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Kit Order Details</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Timeline Section */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Timeline</h3>
            <div className="space-y-4">
              {kitDetails.timeline.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="flex items-start">
                    <div className={`${item.bgColor} p-2 rounded-full mr-4`}>
                      <Icon className={`h-5 w-5 ${item.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{item.status}</span>
                        <span className="text-sm text-gray-500">{item.date}</span>
                      </div>
                      {index < kitDetails.timeline.length - 1 && (
                        <div className="w-px h-4 bg-gray-200 ml-[22px] my-1"></div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Kit Details Section */}
          <div className="mb-6">
            <div className="flex justify-between mb-4">
              <h3 className="text-lg font-medium">{kitDetails.name}</h3>
              <span className="text-lg">Count: {kitDetails.count}</span>
            </div>
          </div>

          {/* Items Table */}
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Item</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Per Kit</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {kitDetails.items.map((item, index) => (
                  <tr key={index} className="bg-white">
                    <td className="px-4 py-3 text-sm text-gray-900">{item.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-center">{item.perKit}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-center">{item.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KitDetailsModal; 