import React from 'react';
import { Eye, MoreHorizontal } from 'lucide-react';
import { HoloCard } from '../ui/HoloCard';
export function OrdersTable() {
  const orders = [{
    id: '#ORD-7829',
    customer: 'Alex Chen',
    date: 'Oct 24, 2077',
    amount: '$1,299',
    status: 'Delivered'
  }, {
    id: '#ORD-7830',
    customer: 'Sarah Connor',
    date: 'Oct 24, 2077',
    amount: '$2,499',
    status: 'Processing'
  }, {
    id: '#ORD-7831',
    customer: 'Rick Deckard',
    date: 'Oct 23, 2077',
    amount: '$199',
    status: 'Shipped'
  }, {
    id: '#ORD-7832',
    customer: 'Motoko Kusanagi',
    date: 'Oct 23, 2077',
    amount: '$89',
    status: 'Delivered'
  }, {
    id: '#ORD-7833',
    customer: 'V',
    date: 'Oct 22, 2077',
    amount: '$3,598',
    status: 'Pending'
  }];
  return <HoloCard className="p-0 overflow-hidden h-full">
      <div className="p-6 border-b border-white/10 flex justify-between items-center">
        <h3 className="text-lg font-bold text-white">Recent Orders</h3>
        <button className="text-xs font-mono text-[#00f0ff] hover:underline">
          View All
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-white/5 border-b border-white/10">
              <th className="p-4 text-xs font-mono text-gray-400 uppercase">
                Order ID
              </th>
              <th className="p-4 text-xs font-mono text-gray-400 uppercase">
                Customer
              </th>
              <th className="p-4 text-xs font-mono text-gray-400 uppercase">
                Date
              </th>
              <th className="p-4 text-xs font-mono text-gray-400 uppercase">
                Amount
              </th>
              <th className="p-4 text-xs font-mono text-gray-400 uppercase">
                Status
              </th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {orders.map(order => <tr key={order.id} className="hover:bg-white/5 transition-colors">
                <td className="p-4 text-sm font-mono text-[#00f0ff]">
                  {order.id}
                </td>
                <td className="p-4 text-sm text-white">{order.customer}</td>
                <td className="p-4 text-sm text-gray-400">{order.date}</td>
                <td className="p-4 text-sm font-mono text-white">
                  {order.amount}
                </td>
                <td className="p-4">
                  <span className={`text-xs font-mono px-2 py-1 rounded border ${order.status === 'Delivered' ? 'border-green-500/50 text-green-400 bg-green-500/10' : order.status === 'Shipped' ? 'border-blue-500/50 text-blue-400 bg-blue-500/10' : order.status === 'Processing' ? 'border-yellow-500/50 text-yellow-400 bg-yellow-500/10' : 'border-gray-500/50 text-gray-400 bg-gray-500/10'}`}>
                    {order.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button className="text-gray-400 hover:text-white transition-colors">
                    <MoreHorizontal size={16} />
                  </button>
                </td>
              </tr>)}
          </tbody>
        </table>
      </div>
    </HoloCard>;
}