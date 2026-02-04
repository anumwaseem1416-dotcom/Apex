import React from 'react';
import { DollarSign, ShoppingBag, Users, TrendingUp, TrendingDown } from 'lucide-react';
import { HoloCard } from '../ui/HoloCard';
export function StatsCards() {
  const stats = [{
    label: 'Total Sales',
    value: '$127,450',
    change: '+12.5%',
    trend: 'up',
    icon: <DollarSign className="text-[#00f0ff]" />
  }, {
    label: 'Total Orders',
    value: '1,234',
    change: '+8.2%',
    trend: 'up',
    icon: <ShoppingBag className="text-[#0066ff]" />
  }, {
    label: 'Active Products',
    value: '48',
    change: '-2.1%',
    trend: 'down',
    icon: <div className="text-purple-500" />
  }, {
    label: 'Total Customers',
    value: '892',
    change: '+15.3%',
    trend: 'up',
    icon: <Users className="text-pink-500" />
  }];
  return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => <HoloCard key={index} delay={index * 0.1} className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-white/5 rounded-lg border border-white/10">
              {stat.icon}
            </div>
            <div className={`flex items-center gap-1 text-xs font-mono ${stat.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
              {stat.change}
              {stat.trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            </div>
          </div>
          <h3 className="text-gray-400 text-sm font-mono mb-1">{stat.label}</h3>
          <p className="text-2xl font-bold text-white tracking-tight">
            {stat.value}
          </p>
        </HoloCard>)}
    </div>;
}