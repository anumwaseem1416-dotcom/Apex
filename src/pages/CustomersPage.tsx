import React, { useEffect, useState } from 'react';
import { customers, sales } from '../services/api';
import { Plus, Search, Edit, Eye, ShoppingBag, Calendar, BarChart3, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DataTable from '../components/ui/DataTable';
import Modal from '../components/ui/Modal';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import KPICard from '../components/ui/KPICard';

interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  creditStatus: 'CLEAR' | 'PENDING';
  createdAt: string;
}

interface Purchase {
  id: string;
  date: string;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  paymentMethod: string;
}

const CustomersPage: React.FC = () => {
  const navigate = useNavigate();
  const [customerList, setCustomerList] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [purchasePeriod, setPurchasePeriod] = useState('all');
  const [loadingPurchases, setLoadingPurchases] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await customers.getAll();
      console.log('Customers API response:', response.data);
      setCustomerList(response.data?.data || response.data || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
      setCustomerList([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && selectedCustomer) {
        await customers.update(selectedCustomer.id, formData);
      } else {
        await customers.create(formData);
      }
      setShowModal(false);
      setIsEditing(false);
      setSelectedCustomer(null);
      setFormData({ name: '', phone: '', email: '', address: '' });
      fetchCustomers();
    } catch (error) {
      console.error('Error saving customer:', error);
      alert('Error saving customer. Please try again.');
    }
  };

  const handleView = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowViewModal(true);
  };

  const handleViewPurchases = async (customer: Customer) => {
    setSelectedCustomer(customer);
    setLoadingPurchases(true);
    setShowPurchaseModal(true);
    try {
      const salesResponse = await sales.getAll();
      console.log('Sales API response:', salesResponse.data);
      const salesData = salesResponse.data?.data || salesResponse.data || [];
      const customerSales = Array.isArray(salesData) 
        ? salesData.filter((sale: any) => sale.customerId === customer.id)
        : [];
      
      const purchaseData = customerSales.map((sale: any) => ({
        id: sale.id,
        date: sale.saleDate || sale.createdAt || new Date().toISOString(),
        items: [{
          name: sale.phone ? `${sale.phone.brand} ${sale.phone.model}` : 
                sale.accessory ? `${sale.accessory.brand} ${sale.accessory.category}` : 
                `${sale.productType} Product`,
          quantity: 1,
          price: Number(sale.sellingPrice || 0)
        }],
        total: Number(sale.sellingPrice || 0),
        paymentMethod: sale.paymentMode || 'N/A'
      }));
      
      setPurchases(purchaseData);
    } catch (error) {
      console.error('Error fetching purchases:', error);
      setPurchases([]);
    } finally {
      setLoadingPurchases(false);
    }
  };

  const handleDelete = async (customer: Customer) => {
    if (window.confirm(`Are you sure you want to delete ${customer.name}?`)) {
      try {
        await customers.delete(customer.id);
        fetchCustomers();
      } catch (error) {
        console.error('Error deleting customer:', error);
        alert('Error deleting customer. Please try again.');
      }
    }
  };

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    setFormData({
      name: customer.name,
      phone: customer.phone,
      email: customer.email || '',
      address: customer.address || ''
    });
    setIsEditing(true);
    setShowModal(true);
  };

  const customerColumns = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (value: string) => (
        <span className="font-medium text-gray-900">{value}</span>
      )
    },
    {
      key: 'phone',
      label: 'Phone',
      sortable: true
    },
    {
      key: 'email',
      label: 'Email',
      render: (value: string) => value || '-'
    },
    {
      key: 'creditStatus',
      label: 'Credit Status',
      render: (value: string) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          value === 'CLEAR' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {value}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, customer: Customer) => (
        <div className="flex items-center gap-2">
          <button 
            onClick={() => handleView(customer)}
            className="p-1 text-blue-600 hover:text-blue-800"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button 
            onClick={() => handleEdit(customer)}
            className="p-1 text-green-600 hover:text-green-800"
            title="Edit Customer"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button 
            onClick={() => handleViewPurchases(customer)}
            className="p-1 text-purple-600 hover:text-purple-800"
            title="View Purchase History"
          >
            <ShoppingBag className="h-4 w-4" />
          </button>
          <button 
            onClick={() => handleDelete(customer)}
            className="p-1 text-red-600 hover:text-red-800"
            title="Delete Customer"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customer Management</h1>
          <p className="text-gray-600 mt-1">Manage customer information and purchase history</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/reports')}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2 font-medium"
          >
            <BarChart3 className="h-4 w-4" />
            Analytics
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 font-medium"
          >
            <Plus className="h-4 w-4" />
            Add Customer
          </button>
        </div>
      </div>

      <KPICard
        title="Total Customers"
        value={customerList.length}
        subtitle="Registered customers"
        icon={ShoppingBag}
        color="blue"
      />

      <DataTable
        data={customerList}
        columns={customerColumns}
        searchable={true}
        pageSize={15}
        emptyMessage="No customers found"
      />

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setIsEditing(false);
          setSelectedCustomer(null);
          setFormData({ name: '', phone: '', email: '', address: '' });
        }}
        title={isEditing ? 'Edit Customer' : 'Add New Customer'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone *
            </label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setShowModal(false);
                setIsEditing(false);
                setSelectedCustomer(null);
                setFormData({ name: '', phone: '', email: '', address: '' });
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              {isEditing ? 'Update Customer' : 'Add Customer'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={showPurchaseModal}
        onClose={() => {
          setShowPurchaseModal(false);
          setSelectedCustomer(null);
          setPurchases([]);
          setPurchasePeriod('all');
        }}
        title={`Purchase History - ${selectedCustomer?.name || ''}`}
        size="xl"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <select
              value={purchasePeriod}
              onChange={(e) => setPurchasePeriod(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Time</option>
              <option value="daily">Today</option>
              <option value="weekly">This Week</option>
              <option value="monthly">This Month</option>
              <option value="yearly">This Year</option>
            </select>
          </div>
          
          {loadingPurchases ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="md" />
            </div>
          ) : purchases.length > 0 ? (
            <div className="space-y-4">
              <div className="max-h-96 overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {purchases.map((purchase) => (
                      <tr key={purchase.id}>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(purchase.date).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900">
                          <div className="max-w-xs">
                            {purchase.items.map((item, idx) => (
                              <div key={idx} className="text-xs">
                                {item.name} (x{item.quantity}) - ${item.price}
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          ${Number(purchase.total || 0).toFixed(2)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          {purchase.paymentMethod}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">
                  <strong>Summary:</strong> {purchases.length} purchases, 
                  Total: ${purchases.reduce((sum, p) => sum + Number(p.total || 0), 0).toFixed(2)}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No purchases found for the selected period.
            </div>
          )}
        </div>
      </Modal>

      <Modal
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedCustomer(null);
        }}
        title="Customer Details"
        size="md"
      >
        {selectedCustomer && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <p className="text-sm text-gray-900">{selectedCustomer.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <p className="text-sm text-gray-900">{selectedCustomer.phone}</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <p className="text-sm text-gray-900">{selectedCustomer.email || '-'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <p className="text-sm text-gray-900">{selectedCustomer.address || '-'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Credit Status</label>
              <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
                selectedCustomer.creditStatus === 'CLEAR'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {selectedCustomer.creditStatus}
              </span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Created At</label>
              <p className="text-sm text-gray-900">{new Date(selectedCustomer.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CustomersPage;