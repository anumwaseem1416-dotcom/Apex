import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Download, Calendar, TrendingUp, DollarSign, Package, Users, FileText, Printer } from 'lucide-react';
import { sales, dashboard } from '../services/api';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import KPICard from '../components/ui/KPICard';

const ReportsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('7'); // days
  const [reportData, setReportData] = useState<any>(null);
  const [salesData, setSalesData] = useState<any[]>([]);

  useEffect(() => {
    fetchReportData();
  }, [dateRange]);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      const [statsRes, salesRes] = await Promise.all([
        dashboard.getStats(),
        sales.getAll()
      ]);
      
      setReportData(statsRes.data || {});
      processChartData(salesRes.data?.data || salesRes.data || []);
    } catch (error) {
      console.error('Error fetching report data:', error);
      setReportData({});
      setSalesData([]);
    } finally {
      setLoading(false);
    }
  };

  const processChartData = (salesData: any[]) => {
    const safeSalesData = Array.isArray(salesData) ? salesData : [];
    
    if (safeSalesData.length === 0) {
      setSalesData([]);
      return;
    }
    
    const days = parseInt(dateRange);
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);
    
    const filteredSales = safeSalesData.filter(sale => {
      const saleDate = new Date(sale.saleDate || sale.date || sale.createdAt);
      return saleDate >= startDate && saleDate <= endDate;
    });
    
    const dailySales = filteredSales.reduce((acc: any, sale) => {
      const saleDate = new Date(sale.saleDate || sale.date || sale.createdAt);
      const date = saleDate.toLocaleDateString();
      if (!acc[date]) {
        acc[date] = { date, sales: 0, revenue: 0, profit: 0 };
      }
      acc[date].sales += 1;
      acc[date].revenue += (sale.sellingPrice || sale.totalAmount || sale.amount || 0);
      acc[date].profit += ((sale.sellingPrice || sale.totalAmount || sale.amount || 0) - (sale.purchasePrice || sale.cost || 0));
      return acc;
    }, {});
    
    setSalesData(Object.values(dailySales));
  };

  const exportToPDF = () => {
    const printContent = `
      SALES REPORT - DASHBOARD STATS
      ================================
      Generated: ${new Date().toLocaleString()}
      
      DAILY SUMMARY:
      - Sales: ${reportData?.daily?.sales || 0}
      - Revenue: $${(reportData?.daily?.revenue || 0).toLocaleString()}
      
      MONTHLY SUMMARY:
      - Sales: ${reportData?.monthly?.sales || 0}
      - Revenue: $${(reportData?.monthly?.revenue || 0).toLocaleString()}
      - Profit: $${(reportData?.monthly?.profit || 0).toLocaleString()}
      - Expenses: $${(reportData?.monthly?.expenses || 0).toLocaleString()}
      
      CREDITS:
      - Pending Credits: ${reportData?.credits?.count || 0}
      - Total Amount: $${(reportData?.credits?.totalAmount || 0).toLocaleString()}
      
      STOCK STATUS:
      - Phones: ${reportData?.stock?.phones || 0}
      - Laptops: ${reportData?.stock?.laptops || 0}
      - Watches: ${reportData?.stock?.watches || 0}
      - Low Stock Accessories: ${reportData?.stock?.lowStockAccessories || 0}
    `;
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`<pre style="font-family: monospace; white-space: pre-wrap;">${printContent}</pre>`);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Metric', 'Period', 'Value'],
      ['Sales', 'Daily', reportData?.daily?.sales || 0],
      ['Revenue', 'Daily', reportData?.daily?.revenue || 0],
      ['Sales', 'Monthly', reportData?.monthly?.sales || 0],
      ['Revenue', 'Monthly', reportData?.monthly?.revenue || 0],
      ['Profit', 'Monthly', reportData?.monthly?.profit || 0],
      ['Expenses', 'Monthly', reportData?.monthly?.expenses || 0],
      ['Credits Count', 'Current', reportData?.credits?.count || 0],
      ['Credits Amount', 'Current', reportData?.credits?.totalAmount || 0],
      ['Stock Phones', 'Current', reportData?.stock?.phones || 0],
      ['Stock Laptops', 'Current', reportData?.stock?.laptops || 0],
      ['Stock Watches', 'Current', reportData?.stock?.watches || 0],
      ['Low Stock Accessories', 'Current', reportData?.stock?.lowStockAccessories || 0]
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dashboard-stats-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sales Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">Comprehensive business insights and performance metrics</p>
        </div>
        
        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="1">Today</option>
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
          
          <button
            onClick={exportToCSV}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            CSV
          </button>
          
          <button
            onClick={exportToPDF}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Printer className="h-4 w-4" />
            Print
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <KPICard
          title="Daily Sales"
          value={reportData?.daily?.sales || 0}
          subtitle="Today's sales"
          icon={TrendingUp}
          color="blue"
        />
        
        <KPICard
          title="Daily Revenue"
          value={`$${(reportData?.daily?.revenue || 0).toLocaleString()}`}
          subtitle="Today's revenue"
          icon={DollarSign}
          color="green"
        />
        
        <KPICard
          title="Avg Per Day"
          value={`$${Math.round((reportData?.daily?.revenue || 0) / Math.max(reportData?.daily?.sales || 1, 1)).toLocaleString()}`}
          subtitle="Revenue per sale"
          icon={Calendar}
          color="purple"
        />
        
        <KPICard
          title="Monthly Sales"
          value={reportData?.monthly?.sales || 0}
          subtitle="This month"
          icon={TrendingUp}
          color="yellow"
        />
        
        <KPICard
          title="Monthly Revenue"
          value={`$${(reportData?.monthly?.revenue || 0).toLocaleString()}`}
          subtitle="This month"
          icon={DollarSign}
          color="blue"
        />
      </div>

      {/* Per Day Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Daily Avg Sales"
          value={Math.round((reportData?.monthly?.sales || 0) / 30)}
          subtitle="Sales per day (30d avg)"
          icon={Calendar}
          color="blue"
        />
        
        <KPICard
          title="Daily Avg Revenue"
          value={`$${Math.round((reportData?.monthly?.revenue || 0) / 30).toLocaleString()}`}
          subtitle="Revenue per day (30d avg)"
          icon={DollarSign}
          color="green"
        />
        
        <KPICard
          title="Daily Avg Profit"
          value={`$${Math.round((reportData?.monthly?.profit || 0) / 30).toLocaleString()}`}
          subtitle="Profit per day (30d avg)"
          icon={TrendingUp}
          color="purple"
        />
        
        <KPICard
          title="Revenue Per Sale"
          value={`$${Math.round((reportData?.monthly?.revenue || 0) / Math.max(reportData?.monthly?.sales || 1, 1)).toLocaleString()}`}
          subtitle="Average order value"
          icon={DollarSign}
          color="yellow"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Sales Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Sales Trend</h3>
          {salesData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="sales" stroke="#3B82F6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-500">
              No sales data available for the selected period
            </div>
          )}
        </div>

        {/* Revenue vs Profit Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue vs Profit</h3>
          {salesData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#10B981" name="Revenue" />
                <Bar dataKey="profit" fill="#3B82F6" name="Profit" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-500">
              No sales data available for the selected period
            </div>
          )}
        </div>
      </div>

      {/* Summary Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Daily Breakdown</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sales</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Margin</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {salesData.map((day, index) => {
                const margin = day.revenue > 0 ? ((day.profit / day.revenue) * 100) : 0;
                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {day.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {day.sales}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${day.revenue.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={day.profit >= 0 ? 'text-green-600' : 'text-red-600'}>
                        ${day.profit.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={margin >= 20 ? 'text-green-600' : margin >= 10 ? 'text-yellow-600' : 'text-red-600'}>
                        {margin.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;