import { useState } from 'react';
import { motion } from 'framer-motion';

const dummyDiscounts = [
  {
    id: 1,
    code: 'SUMMER30',
    type: 'Percentage',
    value: 30,
    minPurchase: 500,
    usageLimit: 100,
    usedCount: 45,
    startDate: '2024-05-01',
    endDate: '2024-06-30',
    status: 'Active',
  },
  {
    id: 2,
    code: 'WELCOME100',
    type: 'Fixed Amount',
    value: 100,
    minPurchase: 300,
    usageLimit: 200,
    usedCount: 200,
    startDate: '2024-04-01',
    endDate: '2024-04-30',
    status: 'Expired',
  },
];

const DiscountManagement = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDiscount, setNewDiscount] = useState({
    code: '',
    type: 'Percentage',
    value: '',
    minPurchase: '',
    usageLimit: '',
    startDate: '',
    endDate: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add discount submission logic here
    console.log(newDiscount);
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-light"
        >
          Discount Management
        </motion.h1>
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => setShowAddForm(true)}
          className="bg-black text-white px-4 py-2 rounded-lg hover:bg-black/90 transition-colors"
        >
          Add New Discount
        </motion.button>
      </div>

      {/* Add Discount Form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-light">Add New Discount</h2>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-500 hover:text-black transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-500 mb-1">Discount Code</label>
                <input
                  type="text"
                  value={newDiscount.code}
                  onChange={(e) => setNewDiscount({ ...newDiscount, code: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-black"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-500 mb-1">Type</label>
                <select
                  value={newDiscount.type}
                  onChange={(e) => setNewDiscount({ ...newDiscount, type: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-black"
                  required
                >
                  <option value="Percentage">Percentage</option>
                  <option value="Fixed Amount">Fixed Amount</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-500 mb-1">
                  {newDiscount.type === 'Percentage' ? 'Percentage' : 'Amount'} Value
                </label>
                <input
                  type="number"
                  value={newDiscount.value}
                  onChange={(e) => setNewDiscount({ ...newDiscount, value: e.target.value })}
                  min="0"
                  max={newDiscount.type === 'Percentage' ? "100" : undefined}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-black"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-500 mb-1">Minimum Purchase (AED)</label>
                <input
                  type="number"
                  value={newDiscount.minPurchase}
                  onChange={(e) => setNewDiscount({ ...newDiscount, minPurchase: e.target.value })}
                  min="0"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-black"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-500 mb-1">Usage Limit</label>
                <input
                  type="number"
                  value={newDiscount.usageLimit}
                  onChange={(e) => setNewDiscount({ ...newDiscount, usageLimit: e.target.value })}
                  min="1"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-black"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={newDiscount.startDate}
                    onChange={(e) => setNewDiscount({ ...newDiscount, startDate: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-black"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">End Date</label>
                  <input
                    type="date"
                    value={newDiscount.endDate}
                    onChange={(e) => setNewDiscount({ ...newDiscount, endDate: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-black"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-black text-white py-2.5 rounded-lg hover:bg-black/90 transition-colors mt-6"
              >
                Create Discount
              </button>
            </form>
          </div>
        </motion.div>
      )}

      {/* Discounts Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-6 py-4 text-sm font-normal text-gray-500">Code</th>
                <th className="px-6 py-4 text-sm font-normal text-gray-500">Type</th>
                <th className="px-6 py-4 text-sm font-normal text-gray-500">Value</th>
                <th className="px-6 py-4 text-sm font-normal text-gray-500">Min. Purchase</th>
                <th className="px-6 py-4 text-sm font-normal text-gray-500">Usage</th>
                <th className="px-6 py-4 text-sm font-normal text-gray-500">Validity</th>
                <th className="px-6 py-4 text-sm font-normal text-gray-500">Status</th>
                <th className="px-6 py-4 text-sm font-normal text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {dummyDiscounts.map((discount) => (
                <motion.tr
                  key={discount.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="group hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm">{discount.code}</span>
                  </td>
                  <td className="px-6 py-4 text-sm">{discount.type}</td>
                  <td className="px-6 py-4 text-sm">
                    {discount.type === 'Percentage' ? `${discount.value}%` : `AED ${discount.value}`}
                  </td>
                  <td className="px-6 py-4 text-sm">AED {discount.minPurchase}</td>
                  <td className="px-6 py-4 text-sm">
                    {discount.usedCount} / {discount.usageLimit}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex flex-col">
                      <span>From: {discount.startDate}</span>
                      <span>To: {discount.endDate}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`
                        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${discount.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                      `}
                    >
                      {discount.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => {/* Add edit logic */}}
                        className="text-gray-500 hover:text-black transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => {/* Add delete logic */}}
                        className="text-gray-500 hover:text-red-600 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DiscountManagement;
