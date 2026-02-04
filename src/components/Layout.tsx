import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  CreditCard,
  DollarSign,
  LogOut,
  Menu,
  X,
  Home,
  Calendar,
  Calculator,
  Zap
} from 'lucide-react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, color: 'text-blue-600' },
    { name: 'Quick POS', href: '/pos', icon: Calculator, color: 'text-green-600', highlight: true },
    { name: 'Sales', href: '/sales', icon: ShoppingCart, color: 'text-purple-600' },
    { name: 'Customers', href: '/customers', icon: Users, color: 'text-indigo-600' },
    { name: 'Products', href: '/products', icon: Package, color: 'text-orange-600' },
    { name: 'Credits', href: '/credits', icon: CreditCard, color: 'text-red-600' },
    { name: 'Reports', href: '/reports', icon: Calendar, color: 'text-teal-600' },
    { name: 'Expenses', href: '/expenses', icon: DollarSign, color: 'text-yellow-600' },
  ];

  const filteredNavigation = navigation.filter(item => {
    if (user?.role === 'ACCOUNTANT') {
      return ['Dashboard', 'Reports', 'Expenses'].includes(item.name);
    }
    return true;
  });

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 border-r border-gray-200`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-white" />
            <h1 className="text-lg font-bold text-white">Mobile Shop CRM</h1>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded-md text-blue-100 hover:text-white hover:bg-blue-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {filteredNavigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  } ${item.highlight ? 'ring-2 ring-green-200 bg-green-50' : ''} group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200`}
                >
                  <item.icon
                    className={`${
                      isActive ? 'text-blue-600' : item.color
                    } mr-3 h-5 w-5 flex-shrink-0`}
                  />
                  <span className="truncate">{item.name}</span>
                  {item.highlight && (
                    <span className="ml-auto bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full font-medium">
                      Fast
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User info and logout */}
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 uppercase tracking-wide">{user?.role}</p>
            </div>
            <button
              onClick={logout}
              className="ml-3 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-14">
              <div className="flex items-center">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                >
                  <Menu className="h-5 w-5" />
                </button>
                <div className="hidden lg:block ml-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>System Online</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <Link
                  to="/pos"
                  className="hidden sm:flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  <Calculator className="h-4 w-4" />
                  Quick POS
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>

      {/* Sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-900 bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;