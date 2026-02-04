import React from 'react';
import { LayoutDashboard, Package, ShoppingCart, BarChart2, Settings, LogOut } from 'lucide-react';
interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}
export function Sidebar({
  activeTab,
  setActiveTab
}: SidebarProps) {
  const menuItems = [{
    id: 'overview',
    label: 'Overview',
    icon: <LayoutDashboard size={20} />
  }, {
    id: 'products',
    label: 'Products',
    icon: <Package size={20} />
  }, {
    id: 'orders',
    label: 'Orders',
    icon: <ShoppingCart size={20} />
  }, {
    id: 'analytics',
    label: 'Analytics',
    icon: <BarChart2 size={20} />
  }];
  return <aside className="w-64 bg-[#050508] border-r border-white/10 flex flex-col h-full fixed left-0 top-20 bottom-0 z-40">
      <div className="p-6">
        <h2 className="text-[#00f0ff] font-mono text-xs tracking-[0.2em] uppercase mb-6">
          Admin Console
        </h2>
        <nav className="space-y-2">
          {menuItems.map(item => <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${activeTab === item.id ? 'bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/50 shadow-[0_0_15px_rgba(0,240,255,0.2)]' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
              {item.icon}
              <span className="font-mono text-sm">{item.label}</span>
            </button>)}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-white/10">
        <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-red-400 transition-colors">
          <LogOut size={20} />
          <span className="font-mono text-sm">Logout</span>
        </button>
      </div>
    </aside>;
}