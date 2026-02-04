import React from 'react';
import { Edit, Trash2, Plus, Search } from 'lucide-react';
import { NeonButton } from '../ui/NeonButton';
import { HoloCard } from '../ui/HoloCard';
export function ProductManager() {
  const products = [{
    id: 1,
    name: 'APEX X-1',
    category: 'Phones',
    price: '$1,299',
    stock: 45,
    status: 'In Stock'
  }, {
    id: 2,
    name: 'APEX NEON',
    category: 'Phones',
    price: '$999',
    stock: 12,
    status: 'Low Stock'
  }, {
    id: 3,
    name: 'APEX PRO',
    category: 'Phones',
    price: '$1,599',
    stock: 0,
    status: 'Out of Stock'
  }, {
    id: 4,
    name: 'Quantum Book',
    category: 'Laptops',
    price: '$2,499',
    stock: 23,
    status: 'In Stock'
  }, {
    id: 5,
    name: 'Neural Pods',
    category: 'Accessories',
    price: '$199',
    stock: 150,
    status: 'In Stock'
  }, {
    id: 6,
    name: 'Holo-Dock',
    category: 'Accessories',
    price: '$89',
    stock: 67,
    status: 'In Stock'
  }];
  return <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl font-bold text-white">Product Management</h2>
        <NeonButton variant="primary">
          <span className="flex items-center gap-2">
            <Plus size={16} /> Add Product
          </span>
        </NeonButton>
      </div>

      <HoloCard className="p-0 overflow-hidden">
        <div className="p-4 border-b border-white/10 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input type="text" placeholder="Search products..." className="w-full bg-black/50 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:border-[#00f0ff] outline-none transition-colors" />
          </div>
          <div className="flex gap-2">
            <select className="bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-sm text-gray-300 outline-none focus:border-[#00f0ff]">
              <option>All Categories</option>
              <option>Phones</option>
              <option>Laptops</option>
              <option>Accessories</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="p-4 text-xs font-mono text-gray-400 uppercase tracking-wider">
                  Product Name
                </th>
                <th className="p-4 text-xs font-mono text-gray-400 uppercase tracking-wider">
                  Category
                </th>
                <th className="p-4 text-xs font-mono text-gray-400 uppercase tracking-wider">
                  Price
                </th>
                <th className="p-4 text-xs font-mono text-gray-400 uppercase tracking-wider">
                  Stock
                </th>
                <th className="p-4 text-xs font-mono text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="p-4 text-xs font-mono text-gray-400 uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {products.map(product => <tr key={product.id} className="group hover:bg-white/5 transition-colors">
                  <td className="p-4 text-sm font-bold text-white">
                    {product.name}
                  </td>
                  <td className="p-4 text-sm text-gray-300">
                    {product.category}
                  </td>
                  <td className="p-4 text-sm font-mono text-[#00f0ff]">
                    {product.price}
                  </td>
                  <td className="p-4 text-sm font-mono text-gray-300">
                    {product.stock}
                  </td>
                  <td className="p-4">
                    <span className={`text-xs font-mono px-2 py-1 rounded border ${product.status === 'In Stock' ? 'border-green-500/50 text-green-400 bg-green-500/10' : product.status === 'Low Stock' ? 'border-yellow-500/50 text-yellow-400 bg-yellow-500/10' : 'border-red-500/50 text-red-400 bg-red-500/10'}`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 hover:text-[#00f0ff] transition-colors">
                        <Edit size={16} />
                      </button>
                      <button className="p-2 hover:text-red-500 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>
      </HoloCard>
    </div>;
}