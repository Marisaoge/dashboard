import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  MoreHorizontal, 
  Filter,
  ChevronDown,
  Package,
  Download
} from 'lucide-react';

interface Kit {
  id: string;
  patientName: string;
  status: 'Ordered' | 'Not ordered' | 'Delivered' | 'Returned';
  orderDate?: string;
  group?: string;
  cuffSize?: string;
  organization?: string;
  orders?: number;
  returns?: number;
}

interface InventoryItem {
  sku: string;
  itemName: string;
  manufacturer: string;
  model?: string;
  total: number;
  newCount: number;
  usedCount: string;
}

const KitsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'current' | 'inventory' | 'archived'>('current');
  const [searchQuery, setSearchQuery] = useState('');
  const [inventorySearchQuery, setInventorySearchQuery] = useState('');
  const [archivedSearchQuery, setArchivedSearchQuery] = useState('');
  
  // Sample data for kits
  const kits: Kit[] = [
    {
      id: '1',
      patientName: 'Joe Smith',
      status: 'Ordered',
      orderDate: '5/4/23',
      group: 'Active Bi-Weekly',
      cuffSize: 'Elera BP Cuff XL',
      organization: 'Northshore',
      orders: 2,
      returns: 2
    },
    {
      id: '2',
      patientName: 'Jane Tons',
      status: 'Not Ordered',
      organization: 'Northshore'
    }
  ];

  // Sample data for archived kits
  const archivedKits: Kit[] = [
    {
      id: 'a1',
      patientName: 'Michael Johnson',
      status: 'Returned',
      orderDate: '2/15/23',
      group: 'Graduated',
      cuffSize: 'M cuff',
      organization: 'Northshore',
      orders: 1,
      returns: 1
    },
    {
      id: 'a2',
      patientName: 'Sarah Williams',
      status: 'Returned',
      orderDate: '3/20/23',
      group: 'Graduated',
      cuffSize: 'L cuff',
      organization: 'Northshore',
      orders: 1,
      returns: 1
    },
    {
      id: 'a3',
      patientName: 'Robert Davis',
      status: 'Returned',
      orderDate: '4/5/23',
      group: 'Graduated',
      cuffSize: 'S cuff',
      organization: 'Northshore',
      orders: 2,
      returns: 2
    }
  ];

  // Sample data for inventory
  const inventoryItems: InventoryItem[] = [
    { sku: '0000353', itemName: 'Motiv Custom Box - EH Motiv Kit 11.5x8.5x4.5', manufacturer: 'Custom Ink', total: 28, newCount: 28, usedCount: 'N/A' },
    { sku: '0000192', itemName: 'Elera BP Cuff S (Only) (5.9"-9.5")', manufacturer: 'Elera', model: 'VD-002', total: 9, newCount: 9, usedCount: 'N/A' },
    { sku: '0000161', itemName: 'Elera BP Cuff XL (Only) (9"-24")', manufacturer: 'Elera', model: 'VD-005', total: 4, newCount: 4, usedCount: 'N/A' },
    { sku: '0000116', itemName: 'Black Fitbit Activity Tracker Inspire 2 (BT)', manufacturer: 'Fitbit', model: 'Inspire 2', total: 5, newCount: 0, usedCount: '5' },
    { sku: '0000498', itemName: 'Fitbit Activity Tracker Inspire 2 Clip', manufacturer: 'Fitbit', total: 5, newCount: 5, usedCount: 'N/A' },
    { sku: '0000323', itemName: 'Fitbit Activity Tracker Inspire 3 (BT)', manufacturer: 'Fitbit', model: 'FB424', total: 144, newCount: 144, usedCount: '0' },
    { sku: '0000412', itemName: 'White Fitbit Activity Tracker Inspire 2 (BT)', manufacturer: 'Fitbit', model: 'Inspire 2', total: 0, newCount: 0, usedCount: '0' },
    { sku: '0000432', itemName: 'GRV Activity Tracker', manufacturer: 'GRV', total: 1, newCount: 1, usedCount: 'N/A' },
    { sku: '0000567', itemName: 'Motiv - RPE Scale Insert EH 9x4', manufacturer: 'Impilo', total: 36, newCount: 36, usedCount: 'N/A' },
    { sku: '0000126', itemName: 'DNU PerformBetter Resistance Band Pink', manufacturer: 'PerformBetter', model: 'Pink Perform Better', total: 43, newCount: 43, usedCount: 'N/A' },
    { sku: '0000352', itemName: 'Motiv - Motiv Insert- Cardiac Flyer 9x4', manufacturer: 'Replica', total: 23, newCount: 23, usedCount: 'N/A' }
  ];

  const filteredKits = kits.filter(kit =>
    kit.patientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredInventory = inventoryItems.filter(item =>
    item.itemName.toLowerCase().includes(inventorySearchQuery.toLowerCase()) ||
    item.sku.toLowerCase().includes(inventorySearchQuery.toLowerCase())
  );

  const filteredArchivedKits = archivedKits.filter(kit =>
    kit.patientName.toLowerCase().includes(archivedSearchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col w-full">
      <main className="flex-1 p-4 lg:p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex flex-wrap gap-2 border-b border-gray-200">
            <button 
              className={`px-4 py-2 ${activeTab === 'current' ? 'text-blue-600 border-b-2 border-blue-600 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('current')}
            >
              Patients
            </button>
            <button 
              className={`px-4 py-2 ${activeTab === 'inventory' ? 'text-blue-600 border-b-2 border-blue-600 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('inventory')}
            >
              Inventory
            </button>
            <button 
              className={`px-4 py-2 ${activeTab === 'archived' ? 'text-blue-600 border-b-2 border-blue-600 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('archived')}
            >
              Archived
            </button>
          </div>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 whitespace-nowrap">
            Order Kit
          </button>
        </div>

        {activeTab === 'current' && (
          <>
            <div className="mb-6">
              <div className="relative flex-1 max-w-xs">
                <input
                  type="text"
                  placeholder="Search patient kits..."
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
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider group">
                        <div className="flex items-center gap-1">
                          <span>Name</span>
                          <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <Filter className="h-3 w-3 text-gray-400 hover:text-gray-600" />
                          </button>
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Kit Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        BP Cuff
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider group">
                        <div className="flex items-center gap-1">
                          <span>Groups</span>
                          <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <Filter className="h-3 w-3 text-gray-400 hover:text-gray-600" />
                          </button>
                        </div>
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider group">
                        <div className="flex items-center gap-1">
                          <span>BP Cuff Size</span>
                          <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <Filter className="h-3 w-3 text-gray-400 hover:text-gray-600" />
                          </button>
                        </div>
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider group">
                        <div className="flex items-center gap-1">
                          <span>Organization</span>
                          <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <Filter className="h-3 w-3 text-gray-400 hover:text-gray-600" />
                          </button>
                        </div>
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider group">
                        <div className="flex items-center gap-1">
                          <span>All Orders</span>
                          <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <Filter className="h-3 w-3 text-gray-400 hover:text-gray-600" />
                          </button>
                        </div>
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider group">
                        <div className="flex items-center gap-1">
                          <span>Returns</span>
                          <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <Filter className="h-3 w-3 text-gray-400 hover:text-gray-600" />
                          </button>
                        </div>
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ACTION
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredKits.map((kit) => (
                      <tr key={kit.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {kit.patientName}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          {kit.status === 'Ordered' ? (
                            <span>Ordered, {kit.orderDate}</span>
                          ) : (
                            <span>{kit.status}</span>
                          )}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          {kit.cuffSize || '-'}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500">
                          <div className="max-w-xs truncate" title={kit.group}>
                            {kit.group || '-'}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          {kit.cuffSize || '-'}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500">
                          <div className="max-w-xs truncate" title={kit.organization}>
                            {kit.organization || '-'}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          {kit.orders ? (
                            <button className="text-blue-600 hover:underline">
                              {kit.orders} view all
                            </button>
                          ) : '-'}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          {kit.returns ? (
                            <button className="text-blue-600 hover:underline">
                              {kit.returns} view all
                            </button>
                          ) : '-'}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-center">
                          <button className="text-gray-400 hover:text-gray-600">
                            <MoreHorizontal className="h-5 w-5 inline" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeTab === 'inventory' && (
          <>
            <div className="mb-6 flex justify-between items-center">
              <div className="relative flex-1 max-w-xs">
                <input
                  type="text"
                  placeholder="Search item names, SKUs, etc"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={inventorySearchQuery}
                  onChange={(e) => setInventorySearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              <button className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Download className="h-4 w-4 mr-2" />
                Export Inventory
              </button>
            </div>
            <div className="bg-white rounded-lg shadow">
              <div className="overflow-x-auto">
                <table className="w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider group">
                        <div className="flex items-center gap-1">
                          <span>SKU</span>
                          <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <Filter className="h-3 w-3 text-gray-400 hover:text-gray-600" />
                          </button>
                        </div>
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider group">
                        <div className="flex items-center gap-1">
                          <span>Item Name</span>
                          <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <Filter className="h-3 w-3 text-gray-400 hover:text-gray-600" />
                          </button>
                        </div>
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider group">
                        <div className="flex items-center gap-1">
                          <span>Manufacturer</span>
                          <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <Filter className="h-3 w-3 text-gray-400 hover:text-gray-600" />
                          </button>
                        </div>
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider group">
                        <div className="flex items-center gap-1">
                          <span>Model</span>
                          <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <Filter className="h-3 w-3 text-gray-400 hover:text-gray-600" />
                          </button>
                        </div>
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider group">
                        <div className="flex items-center justify-end gap-1">
                          <span>Total</span>
                          <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <Filter className="h-3 w-3 text-gray-400 hover:text-gray-600" />
                          </button>
                        </div>
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider group">
                        <div className="flex items-center justify-end gap-1">
                          <span>New Count</span>
                          <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <Filter className="h-3 w-3 text-gray-400 hover:text-gray-600" />
                          </button>
                        </div>
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider group">
                        <div className="flex items-center justify-end gap-1">
                          <span>Used Count</span>
                          <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <Filter className="h-3 w-3 text-gray-400 hover:text-gray-600" />
                          </button>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredInventory.map((item) => (
                      <tr key={item.sku} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{item.sku}</td>
                        <td className="px-4 py-4 text-sm text-gray-900">{item.itemName}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.manufacturer}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.model || '-'}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{item.total}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{item.newCount}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{item.usedCount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeTab === 'archived' && (
          <>
            <div className="mb-6">
              <div className="relative flex-1 max-w-xs">
                <input
                  type="text"
                  placeholder="Search patient kits..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={archivedSearchQuery}
                  onChange={(e) => setArchivedSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow">
              <div className="overflow-x-auto">
                <table className="w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider group">
                        <div className="flex items-center gap-1">
                          <span>Name</span>
                          <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <Filter className="h-3 w-3 text-gray-400 hover:text-gray-600" />
                          </button>
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Kit Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        BP Cuff
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider group">
                        <div className="flex items-center gap-1">
                          <span>Groups</span>
                          <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <Filter className="h-3 w-3 text-gray-400 hover:text-gray-600" />
                          </button>
                        </div>
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider group">
                        <div className="flex items-center gap-1">
                          <span>BP Cuff Size</span>
                          <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <Filter className="h-3 w-3 text-gray-400 hover:text-gray-600" />
                          </button>
                        </div>
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider group">
                        <div className="flex items-center gap-1">
                          <span>Organization</span>
                          <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <Filter className="h-3 w-3 text-gray-400 hover:text-gray-600" />
                          </button>
                        </div>
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider group">
                        <div className="flex items-center gap-1">
                          <span>All Orders</span>
                          <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <Filter className="h-3 w-3 text-gray-400 hover:text-gray-600" />
                          </button>
                        </div>
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider group">
                        <div className="flex items-center gap-1">
                          <span>Returns</span>
                          <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <Filter className="h-3 w-3 text-gray-400 hover:text-gray-600" />
                          </button>
                        </div>
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ACTION
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredArchivedKits.map((kit) => (
                      <tr key={kit.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {kit.patientName}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          {kit.status === 'Ordered' ? (
                            <span>Ordered, {kit.orderDate}</span>
                          ) : (
                            <span>{kit.status}</span>
                          )}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          {kit.cuffSize || '-'}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500">
                          <div className="max-w-xs truncate" title={kit.group}>
                            {kit.group || '-'}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          {kit.cuffSize || '-'}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500">
                          <div className="max-w-xs truncate" title={kit.organization}>
                            {kit.organization || '-'}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          {kit.orders ? (
                            <button className="text-blue-600 hover:underline">
                              {kit.orders} view all
                            </button>
                          ) : '-'}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          {kit.returns ? (
                            <button className="text-blue-600 hover:underline">
                              {kit.returns} view all
                            </button>
                          ) : '-'}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-center">
                          <button className="text-gray-400 hover:text-gray-600">
                            <MoreHorizontal className="h-5 w-5 inline" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default KitsPage;