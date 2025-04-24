import React, { useState, useEffect } from 'react';
import { X, ChevronRight, Check } from 'lucide-react';

interface OrderItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: {
    name: string;
    address: string;
    email: string;
    phone: string;
  };
}

interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  manufacturer: string;
  quantity: number;
}

const OrderItemModal: React.FC<OrderItemModalProps> = ({ isOpen, onClose, patient }) => {
  const [step, setStep] = useState<'address' | 'items' | 'confirm'>('address');
  const [shippingInfo, setShippingInfo] = useState({
    fullName: patient.name,
    street: '',
    unit: '',
    city: '',
    state: '',
    zipCode: ''
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState<InventoryItem[]>([]);
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Extract address components on mount
  useEffect(() => {
    // Simple address parser (you might want to use a more robust solution)
    const addressParts = patient.address.split(',').map(part => part.trim());
    if (addressParts.length >= 3) {
      const [street, city, stateZip] = addressParts;
      const [state, zipCode] = stateZip.split(' ').filter(Boolean);
      setShippingInfo(prev => ({
        ...prev,
        street,
        city,
        state,
        zipCode
      }));
    }
  }, [patient.address]);

  const isAddressComplete = () => {
    return shippingInfo.fullName &&
           shippingInfo.street &&
           shippingInfo.city &&
           shippingInfo.state &&
           shippingInfo.zipCode;
  };

  const formatAddress = () => {
    const parts = [
      shippingInfo.street,
      shippingInfo.unit && `Unit ${shippingInfo.unit}`,
      `${shippingInfo.city}, ${shippingInfo.state} ${shippingInfo.zipCode}`
    ].filter(Boolean);
    return parts.join('\n');
  };

  // US States for dropdown
  const states = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ];

  // Sample inventory items
  const inventoryItems: InventoryItem[] = [
    { id: '1', name: 'Elera BP Cuff XL', sku: '0000161', manufacturer: 'Elera', quantity: 1 },
    { id: '2', name: 'Elera BP Cuff L', sku: '0000162', manufacturer: 'Elera', quantity: 1 },
    { id: '3', name: 'Elera BP Cuff M', sku: '0000163', manufacturer: 'Elera', quantity: 1 },
    { id: '4', name: 'Fitbit Inspire 3', sku: '0000323', manufacturer: 'Fitbit', quantity: 1 },
  ];

  const filteredItems = inventoryItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddItem = (item: InventoryItem) => {
    setSelectedItems(prev => [...prev, item]);
  };

  const handleRemoveItem = (itemId: string) => {
    setSelectedItems(prev => prev.filter(item => item.id !== itemId));
  };

  const handlePlaceOrder = () => {
    // Simulate order placement
    setTimeout(() => {
      setOrderPlaced(true);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Order Items for {patient.name}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="h-6 w-6" />
            </button>
          </div>

          {!orderPlaced ? (
            <>
              {/* Progress Steps */}
              <div className="flex items-center justify-between mb-6">
                <div className={`flex items-center ${step === 'address' ? 'text-blue-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'address' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                    1
                  </div>
                  <span className="ml-2">Shipping Info</span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-300" />
                <div className={`flex items-center ${step === 'items' ? 'text-blue-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'items' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                    2
                  </div>
                  <span className="ml-2">Select Items</span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-300" />
                <div className={`flex items-center ${step === 'confirm' ? 'text-blue-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'confirm' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                    3
                  </div>
                  <span className="ml-2">Confirm Order</span>
                </div>
              </div>

              {/* Step 1: Shipping Information */}
              {step === 'address' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        value={shippingInfo.fullName}
                        onChange={(e) => setShippingInfo(prev => ({ ...prev, fullName: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter full name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                      <input
                        type="text"
                        value={shippingInfo.street}
                        onChange={(e) => setShippingInfo(prev => ({ ...prev, street: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Street address"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Apartment/Unit (Optional)</label>
                      <input
                        type="text"
                        value={shippingInfo.unit}
                        onChange={(e) => setShippingInfo(prev => ({ ...prev, unit: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Apt, Suite, Unit, etc. (optional)"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                        <input
                          type="text"
                          value={shippingInfo.city}
                          onChange={(e) => setShippingInfo(prev => ({ ...prev, city: e.target.value }))}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="City"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                        <select
                          value={shippingInfo.state}
                          onChange={(e) => setShippingInfo(prev => ({ ...prev, state: e.target.value }))}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select State</option>
                          {states.map(state => (
                            <option key={state} value={state}>{state}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="w-1/3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                      <input
                        type="text"
                        value={shippingInfo.zipCode}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '').slice(0, 5);
                          setShippingInfo(prev => ({ ...prev, zipCode: value }));
                        }}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="ZIP Code"
                        maxLength={5}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => setStep('items')}
                      disabled={!isAddressComplete()}
                      className={`px-4 py-2 rounded-lg ${
                        isAddressComplete()
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Select Items */}
              {step === 'items' && (
                <div className="space-y-4">
                  {/* Search Bar */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search items..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <div className="absolute left-3 top-2.5">
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>

                  {/* Two Column Layout */}
                  <div className="grid grid-cols-5 gap-4 min-h-[400px]">
                    {/* Available Items - Left Column */}
                    <div className="col-span-3 border rounded-lg overflow-hidden">
                      <div className="bg-gray-50 px-4 py-2 border-b">
                        <h3 className="font-medium text-gray-900">Available Items</h3>
                      </div>
                      <div className="divide-y divide-gray-200 overflow-y-auto max-h-[500px]">
                        {filteredItems.map(item => (
                          <div key={item.id} className="p-4 hover:bg-gray-50">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium text-gray-900">{item.name}</div>
                                <div className="text-sm text-gray-500">SKU: {item.sku} • {item.manufacturer}</div>
                              </div>
                              <button
                                onClick={() => handleAddItem(item)}
                                disabled={selectedItems.some(selected => selected.id === item.id)}
                                className={`px-3 py-1.5 rounded text-sm font-medium ${
                                  selectedItems.some(selected => selected.id === item.id)
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                                }`}
                              >
                                {selectedItems.some(selected => selected.id === item.id) ? 'Added' : 'Add to Order'}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Selected Items - Right Column */}
                    <div className="col-span-2 border rounded-lg overflow-hidden">
                      <div className="bg-gray-50 px-4 py-2 border-b">
                        <h3 className="font-medium text-gray-900">Selected Items ({selectedItems.length})</h3>
                      </div>
                      {selectedItems.length > 0 ? (
                        <div className="divide-y divide-gray-200 overflow-y-auto max-h-[500px]">
                          {selectedItems.map(item => (
                            <div key={item.id} className="p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <p className="font-medium text-gray-900">{item.name}</p>
                                  <p className="text-sm text-gray-500">SKU: {item.sku}</p>
                                </div>
                                <button
                                  onClick={() => handleRemoveItem(item.id)}
                                  className="ml-2 p-1 text-gray-400 hover:text-red-500"
                                >
                                  <X className="h-5 w-5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 text-center text-gray-500">
                          No items selected
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between pt-4 border-t">
                    <button
                      onClick={() => setStep('address')}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => setStep('confirm')}
                      disabled={selectedItems.length === 0}
                      className={`px-4 py-2 rounded-lg ${
                        selectedItems.length > 0
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Confirm Order */}
              {step === 'confirm' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Shipping Information</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-900">{shippingInfo.fullName}</p>
                      <p className="text-gray-600 whitespace-pre-line">{formatAddress()}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Order Items</h3>
                    <div className="border rounded-lg divide-y divide-gray-200">
                      {selectedItems.map((item, index) => (
                        <div key={index} className="p-4 flex justify-between items-center">
                          <div>
                            <p className="font-medium text-gray-900">{item.name}</p>
                            <p className="text-sm text-gray-500">SKU: {item.sku}</p>
                          </div>
                          <span className="text-gray-600">Qty: {item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <button
                      onClick={() => setStep('items')}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      Back
                    </button>
                    <button
                      onClick={handlePlaceOrder}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                    >
                      Place Order
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-medium mb-2">Order Placed Successfully!</h3>
              <p className="text-gray-600 mb-6">Your order has been placed and will be processed shortly.</p>
              <button
                onClick={onClose}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderItemModal; 