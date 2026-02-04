import React, { useEffect, useState } from 'react';
import { dashboard, admin } from '../services/api';
import {
  TrendingUp,
  ShoppingCart,
  CreditCard,
  Package,
  AlertTriangle,
  DollarSign,
  Users,
  Calendar,
  Trash2
} from 'lucide-react';
import KPICard from '../components/ui/KPICard';
import DataTable from '../components/ui/DataTable';
import LoadingSpinner from '../components/ui/LoadingSpinner';

interface DashboardStats {
  daily: { sales: number; revenue: number; profit: number };
  monthly: { sales: number; revenue: number; profit: number; expenses: number };
  credits: { count: number; totalAmount: number };
  stock: { phones: number; laptops: number; watches: number; lowStockAccessories: number };
  trends: {
    salesGrowth: number;
    revenueGrowth: number;
    profitGrowth: number;
  };
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [bestSelling, setBestSelling] = useState<any[]>([]);
  const [lowStockItems, setLowStockItems] = useState<any[]>([]);
  const [recentSales, setRecentSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clearing, setClearing] = useState(false);

  const handleClearAllData = async () => {
    if (!window.confirm('⚠️ WARNING: This will permanently delete ALL data including customers, sales, products, credits, and expenses. This action cannot be undone. Are you absolutely sure?')) {
      return;
    }
    
    if (!window.confirm('This is your final warning. All data will be lost forever. Type YES in the next prompt to confirm.')) {
      return;
    }
    
    const confirmation = window.prompt('Type "DELETE ALL DATA" to confirm (case sensitive):');
    if (confirmation !== 'DELETE ALL DATA') {
      alert('Confirmation text did not match. Operation cancelled.');
      return;
    }
    
    setClearing(true);
    try {
      await admin.clearAllData();
      alert('✅ All data has been successfully cleared!');
      // Refresh the dashboard
      window.location.reload();
    } catch (error: any) {
      console.error('Error clearing data:', error);
      alert('❌ Failed to clear data: ' + (error.response?.data?.error || error.message));
    } finally {
      setClearing(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        const [statsRes, bestSellingRes] = await Promise.all([
          dashboard.getStats(),
          dashboard.getBestSelling()
        ]);
        
        setStats(statsRes.data || {
          daily: { sales: 0, revenue: 0, profit: 0 },
          monthly: { sales: 0, revenue: 0, profit: 0, expenses: 0 },
          credits: { count: 0, totalAmount: 0 },
          stock: { phones: 0, laptops: 0, watches: 0, lowStockAccessories: 0 },
          trends: { salesGrowth: 0, revenueGrowth: 0, profitGrowth: 0 }
        });
        setBestSelling(bestSellingRes.data || []);
        
        // Mock data for demo - replace with actual API calls
        setLowStockItems([
          { name: 'iPhone Cases', stock: 2, minStock: 10 },
          { name: 'Samsung Chargers', stock: 1, minStock: 5 }
        ]);
        setRecentSales([
          { id: '1', customer: 'Ahmad Ali', product: 'iPhone 14', amount: 850, time: '2 min ago' },
          { id: '2', customer: 'Sara Khan', product: 'Samsung A54', amount: 420, time: '15 min ago' }
        ]);
      } catch (error: any) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const bestSellingColumns = [
    { key: 'name', label: 'Product', sortable: true },
    { key: 'count', label: 'Sales', sortable: true },
    { 
      key: 'revenue', 
      label: 'Revenue', 
      sortable: true,
      render: (value: number) => `$${value?.toFixed(2) || '0.00'}`
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
          <p className="text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening in your shop today.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar className="h-4 w-4" />
          <span>{new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Today's Sales"
          value={stats?.daily?.sales || 0}
          subtitle={`$${stats?.daily?.revenue?.toFixed(2) || '0.00'} revenue`}
          icon={ShoppingCart}
          color="blue"
          trend={{
            value: stats?.trends?.salesGrowth || 0,
            isPositive: (stats?.trends?.salesGrowth || 0) >= 0
          }}
        />
        
        <KPICard
          title="Today's Profit"
          value={`$${stats?.daily?.profit?.toFixed(2) || '0.00'}`}
          subtitle="Net profit today"
          icon={DollarSign}
          color="green"
          trend={{
            value: stats?.trends?.profitGrowth || 0,
            isPositive: (stats?.trends?.profitGrowth || 0) >= 0
          }}
        />
        
        <KPICard
          title="Pending Credits"
          value={stats?.credits?.count || 0}
          subtitle={`$${stats?.credits?.totalAmount?.toFixed(2) || '0.00'} outstanding`}
          icon={CreditCard}
          color="red"
        />
        
        <KPICard
          title="Stock Items"
          value={(stats?.stock?.phones || 0) + (stats?.stock?.laptops || 0) + (stats?.stock?.watches || 0)}
          subtitle={stats?.stock?.lowStockAccessories ? `${stats.stock.lowStockAccessories} low stock alerts` : 'All stock levels good'}
          icon={Package}
          color={stats?.stock?.lowStockAccessories ? 'yellow' : 'purple'}
        />
      </div>

      {/* Stock Alerts */}
      {lowStockItems.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-center mb-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
            <h3 className="text-lg font-semibold text-yellow-800">Low Stock Alerts</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {lowStockItems.map((item, index) => (
              <div key={index} className="bg-white rounded-lg p-3 border border-yellow-200">
                <p className="font-medium text-gray-900">{item.name}</p>
                <p className="text-sm text-gray-600">
                  Only <span className="font-semibold text-red-600">{item.stock}</span> left 
                  (Min: {item.minStock})
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Best Selling Products */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Best Selling Products</h3>
          <DataTable
            data={bestSelling.slice(0, 5)}
            columns={bestSellingColumns}
            searchable={false}
            pageSize={5}
            emptyMessage="No sales data available"
          />
        </div>

        {/* Recent Sales */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Sales</h3>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-4 space-y-3">
              {recentSales.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No recent sales</p>
              ) : (
                recentSales.map((sale) => (
                  <div key={sale.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{sale.customer}</p>
                      <p className="text-sm text-gray-600">{sale.product}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">${sale.amount}</p>
                      <p className="text-xs text-gray-500">{sale.time}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Admin Section - Data Clearing */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-red-800 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Admin Actions
            </h3>
            <p className="text-sm text-red-600 mt-1">Danger zone - irreversible actions</p>
          </div>
          <button
            onClick={handleClearAllData}
            disabled={clearing}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            {clearing ? 'Clearing...' : 'Clear All Data'}
          </button>
        </div>
      </div>

      {/* Monthly Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Overview</h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{stats?.monthly?.sales || 0}</p>
            <p className="text-sm text-gray-600">Total Sales</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">${stats?.monthly?.revenue?.toFixed(2) || '0.00'}</p>
            <p className="text-sm text-gray-600">Revenue</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">${stats?.monthly?.profit?.toFixed(2) || '0.00'}</p>
            <p className="text-sm text-gray-600">Profit</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">${stats?.monthly?.expenses?.toFixed(2) || '0.00'}</p>
            <p className="text-sm text-gray-600">Expenses</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;