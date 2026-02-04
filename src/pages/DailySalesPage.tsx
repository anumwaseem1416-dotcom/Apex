import React, { useEffect, useState } from 'react';
import { sales, customers } from '../services/api';
import { Calendar, TrendingUp, TrendingDown, DollarSign, ChevronLeft, ChevronRight } from 'lucide-react';

interface DailySale {
  id: string;
  date: string;
  customerId: string;
  customerName: string;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  paymentMethod: string;
  type: 'SALE' | 'PURCHASE';
}

type ViewPeriod = 'daily' | 'weekly' | 'monthly' | 'yearly';

const DailySalesPage: React.FC = () => {
  const [transactions, setTransactions] = useState<DailySale[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewPeriod, setViewPeriod] = useState<ViewPeriod>('daily');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [filterType, setFilterType] = useState('ALL');

  useEffect(() => {
    fetchTransactions();
  }, [viewPeriod, currentDate, filterType]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      // Use existing sales endpoint as fallback until backend implements period-based endpoint
      const response = await sales.getAll();
      // Ensure we always have an array and add mock data structure
      let data = Array.isArray(response.data) ? response.data : [];
      
      // Transform existing sales data to match our interface
      data = data.map((sale: any) => ({
        ...sale,
        type: sale.type || 'SALE',
        customerName: sale.customerName ?? 'Unknown Customer',
        items: Array.isArray(sale.items)
          ? sale.items
          : [{ name: 'Product', quantity: 1, price: Number(sale.total ?? 0) }],
        total: Number(sale.total ?? 0), // ⭐ CRITICAL FIX
        paymentMethod: sale.paymentMethod ?? 'N/A',
        date: sale.date ?? new Date().toISOString()
      }));
      
      setTransactions(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const navigatePeriod = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    
    switch (viewPeriod) {
      case 'daily':
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
        break;
      case 'weekly':
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
        break;
      case 'monthly':
        newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
        break;
      case 'yearly':
        newDate.setFullYear(newDate.getFullYear() + (direction === 'next' ? 1 : -1));
        break;
    }
    
    setCurrentDate(newDate);
  };

  const getDateRangeText = () => {
    const date = currentDate;
    
    if (viewPeriod === 'daily') {
      return date.toLocaleDateString();
    }
    
    if (viewPeriod === 'weekly') {
      const startOfWeek = new Date(date);
      startOfWeek.setDate(date.getDate() - date.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      return `${startOfWeek.toLocaleDateString()} - ${endOfWeek.toLocaleDateString()}`;
    }
    
    if (viewPeriod === 'monthly') {
      return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }
    
    if (viewPeriod === 'yearly') {
      return date.getFullYear().toString();
    }
    
    return '';
  };

  // Ensure transactions is always an array before filtering
  const transactionsArray = Array.isArray(transactions) ? transactions : [];
  const salesData = transactionsArray.filter(t => t.type === 'SALE');
  const purchaseData = transactionsArray.filter(t => t.type === 'PURCHASE');
  const totalSales = salesData.reduce(
    (sum, sale) => sum + Number(sale.total || 0),
    0
  );
  const totalPurchases = purchaseData.reduce(
    (sum, purchase) => sum + Number(purchase.total || 0),
    0
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Sales & Purchases Analytics</h1>
        <div className="flex items-center gap-4">
          {/* Period Selector */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            {(['daily', 'weekly', 'monthly', 'yearly'] as ViewPeriod[]).map((period) => (
              <button
                key={period}
                onClick={() => setViewPeriod(period)}
                className={`px-3 py-1 rounded-md text-sm font-medium capitalize ${
                  viewPeriod === period
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
          
          {/* Transaction Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Transactions</option>
            <option value="SALE">Sales Only</option>
            <option value="PURCHASE">Purchases Only</option>
          </select>
        </div>
      </div>

      {/* Date Navigation */}
      <div className="flex items-center justify-center gap-4 bg-white p-4 rounded-lg shadow">
        <button
          onClick={() => navigatePeriod('prev')}
          className="p-2 text-gray-400 hover:text-gray-600"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-gray-500" />
          <span className="text-lg font-medium text-gray-900">
            {getDateRangeText()}
          </span>
        </div>
        
        <button
          onClick={() => navigatePeriod('next')}
          className="p-2 text-gray-400 hover:text-gray-600"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Sales</p>
              <p className="text-2xl font-bold text-gray-900">${Number(totalSales || 0).toFixed(2)}</p>
              <p className="text-sm text-gray-500">{salesData.length} transactions</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <TrendingDown className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Purchases</p>
              <p className="text-2xl font-bold text-gray-900">${Number(totalPurchases || 0).toFixed(2)}</p>
              <p className="text-sm text-gray-500">{purchaseData.length} transactions</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Net Profit</p>
              <p className={`text-2xl font-bold ${totalSales - totalPurchases >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${Number(totalSales - totalPurchases || 0).toFixed(2)}
              </p>
              <p className="text-sm text-gray-500">{transactionsArray.length} total transactions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Transactions for {getDateRangeText()}
          </h3>
        </div>
        
        {transactionsArray.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactionsArray.map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        transaction.type === 'SALE'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {transaction.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(transaction.date).toLocaleTimeString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.customerName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="max-w-xs">
                        {transaction.items.map((item, idx) => (
                          <div key={idx} className="text-xs">
                            {item.name} (x{item.quantity})
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <span className={transaction.type === 'SALE' ? 'text-green-600' : 'text-red-600'}>
                        {transaction.type === 'SALE' ? '+' : '-'}${Number(transaction.total || 0).toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.paymentMethod}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No transactions found for {getDateRangeText()}
          </div>
        )}
      </div>
    </div>
  );
};

export default DailySalesPage;