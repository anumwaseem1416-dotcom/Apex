import React, { useEffect, useState } from 'react';
import { credits } from '../services/api';
import { DollarSign, AlertTriangle } from 'lucide-react';

const CreditsPage: React.FC = () => {
  const [creditsList, setCreditsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedCredit, setSelectedCredit] = useState<any>(null);
  const [paymentAmount, setPaymentAmount] = useState(0);

  useEffect(() => {
    fetchCredits();
  }, []);

  const fetchCredits = async () => {
    try {
      const response = await credits.getAll();
      console.log('Credits API response:', response.data);
      setCreditsList(response.data?.data || response.data || []);
    } catch (error) {
      console.error('Error fetching credits:', error);
      setCreditsList([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCredit) return;

    try {
      await credits.updatePayment(selectedCredit.id, paymentAmount);
      setShowPaymentModal(false);
      setSelectedCredit(null);
      setPaymentAmount(0);
      fetchCredits();
    } catch (error) {
      console.error('Error updating payment:', error);
    }
  };

  const openPaymentModal = (credit: any) => {
    setSelectedCredit(credit);
    setPaymentAmount(credit.remainingAmount);
    setShowPaymentModal(true);
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const totalPending = creditsList.reduce((sum: number, credit: any) => sum + credit.remainingAmount, 0);
  const overdueCredits = creditsList.filter((credit: any) => isOverdue(credit.dueDate) && credit.remainingAmount > 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Credits Management</h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Pending
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    ${totalPending.toFixed(2)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-6 w-6 text-red-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Overdue Credits
                  </dt>
                  <dd className="text-lg font-medium text-red-600">
                    {overdueCredits.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Active Credits
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {creditsList.filter((c: any) => c.remainingAmount > 0).length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Credits Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Paid Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Remaining
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Due Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {creditsList.map((credit: any) => (
              <tr key={credit.id} className={isOverdue(credit.dueDate) && credit.remainingAmount > 0 ? 'bg-red-50' : ''}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {credit.customer?.name}
                  <div className="text-xs text-gray-500">{credit.customer?.phone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${credit.totalAmount.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${credit.paidAmount.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <span className={credit.remainingAmount > 0 ? 'text-red-600' : 'text-green-600'}>
                    ${credit.remainingAmount.toFixed(2)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(credit.dueDate).toLocaleDateString()}
                  {isOverdue(credit.dueDate) && credit.remainingAmount > 0 && (
                    <div className="text-xs text-red-600 font-medium">OVERDUE</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    credit.remainingAmount <= 0
                      ? 'bg-green-100 text-green-800'
                      : isOverdue(credit.dueDate)
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {credit.remainingAmount <= 0 ? 'PAID' : isOverdue(credit.dueDate) ? 'OVERDUE' : 'PENDING'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {credit.remainingAmount > 0 && (
                    <button
                      onClick={() => openPaymentModal(credit)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Add Payment
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedCredit && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Add Payment - {selectedCredit.customer?.name}
              </h3>
              <div className="mb-4 p-3 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-600">
                  Total Amount: <span className="font-medium">${selectedCredit.totalAmount.toFixed(2)}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Already Paid: <span className="font-medium">${selectedCredit.paidAmount.toFixed(2)}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Remaining: <span className="font-medium text-red-600">${selectedCredit.remainingAmount.toFixed(2)}</span>
                </p>
              </div>
              <form onSubmit={handlePayment} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Amount *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    max={selectedCredit.remainingAmount}
                    required
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="bg-blue-50 p-3 rounded-md">
                  <p className="text-sm text-blue-800">
                    After payment: <span className="font-medium">${(selectedCredit.remainingAmount - paymentAmount).toFixed(2)} remaining</span>
                  </p>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowPaymentModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    Add Payment
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreditsPage;