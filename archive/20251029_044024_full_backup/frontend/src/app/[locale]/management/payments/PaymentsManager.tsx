"use client";
import React, { useState } from 'react';
import { ProtectedContent } from '@/app/components/ProtectedContent';
import { useAuth } from '@hooks/useAuth';

interface Payment {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  currency: string;
  type: 'subscription' | 'picoins' | 'premium' | 'refund';
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  date: string;
  method: 'card' | 'paypal' | 'crypto' | 'pi';
}

export function PaymentsManager() {
  const [payments, setPayments] = useState<Payment[]>([
    {
      id: '1',
      userId: '1',
      userName: 'John Doe',
      amount: 29.99,
      currency: 'USD',
      type: 'subscription',
      status: 'completed',
      date: '2024-01-15',
      method: 'card'
    },
    {
      id: '2',
      userId: '2',
      userName: 'Jane Smith',
      amount: 9.99,
      currency: 'USD',
      type: 'picoins',
      status: 'completed',
      date: '2024-01-14',
      method: 'paypal'
    },
    {
      id: '3',
      userId: '3',
      userName: 'Mike Johnson',
      amount: 19.99,
      currency: 'USD',
      type: 'premium',
      status: 'pending',
      date: '2024-01-13',
      method: 'crypto'
    }
  ]);

  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const filteredPayments = payments.filter(payment => {
    const typeMatch = selectedType === 'all' || payment.type === selectedType;
    const statusMatch = selectedStatus === 'all' || payment.status === selectedStatus;
    return typeMatch && statusMatch;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'subscription': return 'bg-blue-100 text-blue-800';
      case 'picoins': return 'bg-purple-100 text-purple-800';
      case 'premium': return 'bg-yellow-100 text-yellow-800';
      case 'refund': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalRevenue = payments
    .filter(p => p.status === 'completed' && p.type !== 'refund')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingAmount = payments
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Payment Management</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Export Payments
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Total Revenue</h3>
          <p className="text-2xl font-bold text-green-600">${totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Pending Payments</h3>
          <p className="text-2xl font-bold text-yellow-600">${pendingAmount.toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Total Transactions</h3>
          <p className="text-2xl font-bold text-blue-600">{payments.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Failed Payments</h3>
          <p className="text-2xl font-bold text-red-600">
            {payments.filter(p => p.status === 'failed').length}
          </p>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <select 
          value={selectedType} 
          onChange={(e) => setSelectedType(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="all">All Types</option>
          <option value="subscription">Subscription</option>
          <option value="picoins">Pi Coins</option>
          <option value="premium">Premium</option>
          <option value="refund">Refund</option>
        </select>

        <select 
          value={selectedStatus} 
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="all">All Status</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </select>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPayments.map((payment) => (
              <tr key={payment.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  #{payment.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {payment.userName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${payment.amount} {payment.currency}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(payment.type)}`}>
                    {payment.type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(payment.status)}`}>
                    {payment.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                  {payment.method}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {payment.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-indigo-600 hover:text-indigo-900 mr-2">View</button>
                  <ProtectedContent>
                    <button className="text-red-600 hover:text-red-900">Refund</button>
                  </ProtectedContent>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PaymentsManager;