import React, { useEffect, useState } from 'react';
import { products } from '../services/api';
import { Plus, Smartphone, Laptop, Watch, Headphones, AlertTriangle, Package, Trash2 } from 'lucide-react';
import DataTable from '../components/ui/DataTable';
import Modal from '../components/ui/Modal';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import KPICard from '../components/ui/KPICard';

const ProductsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('phones');
  const [phones, setPhones] = useState<any[]>([]);
  const [laptops, setLaptops] = useState<any[]>([]);
  const [watches, setWatches] = useState<any[]>([]);
  const [accessories, setAccessories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [lowStockItems, setLowStockItems] = useState<any[]>([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const [phonesRes, laptopsRes, watchesRes, accessoriesRes] = await Promise.all([
        products.getPhones(),
        products.getLaptops(),
        products.getWatches(),
        products.getAccessories()
      ]);
      
      console.log('API Responses:', { phonesRes, laptopsRes, watchesRes, accessoriesRes });
      
      const phonesData = Array.isArray(phonesRes?.data?.data) ? phonesRes.data.data : 
                        Array.isArray(phonesRes?.data) ? phonesRes.data : [];
      const laptopsData = Array.isArray(laptopsRes?.data?.data) ? laptopsRes.data.data : 
                         Array.isArray(laptopsRes?.data) ? laptopsRes.data : [];
      const watchesData = Array.isArray(watchesRes?.data?.data) ? watchesRes.data.data : 
                         Array.isArray(watchesRes?.data) ? watchesRes.data : [];
      const accessoriesData = Array.isArray(accessoriesRes?.data?.data) ? accessoriesRes.data.data : 
                             Array.isArray(accessoriesRes?.data) ? accessoriesRes.data : [];
      
      console.log('Processed Data:', { phonesData, laptopsData, watchesData, accessoriesData });
      
      setPhones(phonesData);
      setLaptops(laptopsData);
      setWatches(watchesData);
      setAccessories(accessoriesData);
      
      const lowStock = accessoriesData.filter((item: any) => 
        item.stockQuantity <= (item.minStockLevel || 5)
      );
      setLowStockItems(lowStock);
    } catch (error) {
      console.error('Error fetching products:', error);
      setPhones([]);
      setLaptops([]);
      setWatches([]);
      setAccessories([]);
      setLowStockItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && editingProduct) {
        if (activeTab === 'phones') {
          await products.updatePhone(editingProduct.id, formData);
        } else if (activeTab === 'laptops') {
          await products.updateLaptop(editingProduct.id, formData);
        } else if (activeTab === 'watches') {
          await products.updateWatch(editingProduct.id, formData);
        } else if (activeTab === 'accessories') {
          await products.updateAccessory(editingProduct.id, {
            ...formData,
            minStockLevel: formData.minStockLevel || 5
          });
        }
      } else {
        if (activeTab === 'phones') {
          await products.createPhone(formData);
        } else if (activeTab === 'laptops') {
          await products.createLaptop(formData);
        } else if (activeTab === 'watches') {
          await products.createWatch(formData);
        } else if (activeTab === 'accessories') {
          await products.createAccessory({
            ...formData,
            minStockLevel: formData.minStockLevel || 5
          });
        }
      }
      setShowModal(false);
      setFormData({});
      setIsEditing(false);
      setEditingProduct(null);
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error saving product. Please try again.');
    }
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setFormData(product);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async (product: any, type: string) => {
    if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
      try {
        if (type === 'phone') {
          await products.deletePhone(product.id);
        } else if (type === 'laptop') {
          await products.deleteLaptop(product.id);
        } else if (type === 'watch') {
          await products.deleteWatch(product.id);
        } else if (type === 'accessory') {
          await products.deleteAccessory(product.id);
        }
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error deleting product. Please try again.');
      }
    }
  };

  const handleDuplicate = (product: any) => {
    setFormData({
      ...product,
      imei: '',
      id: undefined
    });
    setIsEditing(false);
    setEditingProduct(null);
    setShowModal(true);
  };

  const tabs = [
    { id: 'phones', name: 'Phones', icon: Smartphone, count: phones.length, color: 'text-blue-600' },
    { id: 'laptops', name: 'Laptops', icon: Laptop, count: laptops.length, color: 'text-purple-600' },
    { id: 'watches', name: 'Watches', icon: Watch, count: watches.length, color: 'text-green-600' },
    { id: 'accessories', name: 'Accessories', icon: Headphones, count: accessories.length, color: 'text-orange-600' },
  ];

  const phoneColumns = [
    { key: 'imei', label: 'IMEI', sortable: true },
    { 
      key: 'brand', 
      label: 'Product', 
      render: (_: any, phone: any) => (
        <div>
          <div className="font-medium text-gray-900">{phone.brand} {phone.model}</div>
          <div className="text-sm text-gray-500">{phone.color || 'N/A'}</div>
        </div>
      )
    },
    { 
      key: 'batteryHealth', 
      label: 'Battery', 
      render: (value: number) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          !value ? 'bg-gray-100 text-gray-800' :
          value >= 80 ? 'bg-green-100 text-green-800' :
          value >= 60 ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {value ? `${value}%` : 'N/A'}
        </span>
      )
    },
    { 
      key: 'sellingPrice', 
      label: 'Price', 
      render: (value: number) => `$${value?.toFixed(2) || '0.00'}`
    },
    { 
      key: 'status', 
      label: 'Status', 
      render: (value: string) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          value === 'IN_STOCK' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {value}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, phone: any) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleEdit(phone)}
            className="p-1 text-blue-600 hover:text-blue-800"
            title="Edit Product"
          >
            <Package className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDuplicate(phone)}
            className="p-1 text-green-600 hover:text-green-800"
            title="Duplicate Product"
          >
            <Plus className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDelete(phone, 'phone')}
            className="p-1 text-red-600 hover:text-red-800"
            title="Delete Product"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  const laptopColumns = [
    { key: 'serialNumber', label: 'Serial Number', sortable: true },
    { 
      key: 'brand', 
      label: 'Product', 
      render: (_: any, laptop: any) => (
        <div>
          <div className="font-medium text-gray-900">{laptop.brand} {laptop.model}</div>
          <div className="text-sm text-gray-500">{laptop.processor || 'N/A'}</div>
        </div>
      )
    },
    { 
      key: 'ram', 
      label: 'RAM', 
      render: (value: string) => value || 'N/A'
    },
    { 
      key: 'storage', 
      label: 'Storage', 
      render: (value: string) => value || 'N/A'
    },
    { 
      key: 'sellingPrice', 
      label: 'Price', 
      render: (value: number) => `$${value?.toFixed(2) || '0.00'}`
    },
    { 
      key: 'status', 
      label: 'Status', 
      render: (value: string) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          value === 'IN_STOCK' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {value}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, laptop: any) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleEdit(laptop)}
            className="p-1 text-blue-600 hover:text-blue-800"
            title="Edit Product"
          >
            <Package className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDelete(laptop, 'laptop')}
            className="p-1 text-red-600 hover:text-red-800"
            title="Delete Product"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  const watchColumns = [
    { key: 'serialNumber', label: 'Serial Number', sortable: true },
    { 
      key: 'brand', 
      label: 'Product', 
      render: (_: any, watch: any) => (
        <div>
          <div className="font-medium text-gray-900">{watch.brand} {watch.model}</div>
          <div className="text-sm text-gray-500">{watch.color || 'N/A'}</div>
        </div>
      )
    },
    { 
      key: 'condition', 
      label: 'Condition', 
      render: (value: string) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          value === 'NEW' ? 'bg-green-100 text-green-800' :
          value === 'LIKE_NEW' ? 'bg-blue-100 text-blue-800' :
          value === 'GOOD' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {value}
        </span>
      )
    },
    { 
      key: 'sellingPrice', 
      label: 'Price', 
      render: (value: number) => `$${value?.toFixed(2) || '0.00'}`
    },
    { 
      key: 'status', 
      label: 'Status', 
      render: (value: string) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          value === 'IN_STOCK' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {value}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, watch: any) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleEdit(watch)}
            className="p-1 text-blue-600 hover:text-blue-800"
            title="Edit Product"
          >
            <Package className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDelete(watch, 'watch')}
            className="p-1 text-red-600 hover:text-red-800"
            title="Delete Product"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  const accessoryColumns = [
    { key: 'sku', label: 'SKU', sortable: true },
    { 
      key: 'category', 
      label: 'Product', 
      render: (_: any, accessory: any) => (
        <div>
          <div className="font-medium text-gray-900">{accessory.brand} {accessory.category}</div>
          <div className="text-sm text-gray-500">{accessory.type}</div>
        </div>
      )
    },
    { 
      key: 'stockQuantity', 
      label: 'Stock', 
      render: (value: number, accessory: any) => (
        <div className="flex items-center gap-2">
          <span className={`font-medium ${
            value <= (accessory.minStockLevel || 5) ? 'text-red-600' : 'text-gray-900'
          }`}>
            {value}
          </span>
          {value <= (accessory.minStockLevel || 5) && (
            <AlertTriangle className="h-4 w-4 text-red-500" />
          )}
        </div>
      )
    },
    { 
      key: 'sellingPrice', 
      label: 'Price', 
      render: (value: number) => `$${value?.toFixed(2) || '0.00'}`
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, accessory: any) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleEdit(accessory)}
            className="p-1 text-blue-600 hover:text-blue-800"
            title="Edit Product"
          >
            <Package className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDelete(accessory, 'accessory')}
            className="p-1 text-red-600 hover:text-red-800"
            title="Delete Product"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  const renderPhoneForm = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">IMEI *</label>
        <input
          type="text"
          required
          value={formData.imei || ''}
          onChange={(e) => setFormData({ ...formData, imei: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter IMEI number"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Brand *</label>
          <input
            type="text"
            required
            value={formData.brand || ''}
            onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Model *</label>
          <input
            type="text"
            required
            value={formData.model || ''}
            onChange={(e) => setFormData({ ...formData, model: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
        <input
          type="text"
          value={formData.color || ''}
          onChange={(e) => setFormData({ ...formData, color: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Battery Health (%)</label>
        <input
          type="number"
          min="0"
          max="100"
          value={formData.batteryHealth || ''}
          onChange={(e) => setFormData({ ...formData, batteryHealth: parseInt(e.target.value) || 0 })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Buying Source</label>
        <input
          type="text"
          value={formData.buyingSource || ''}
          onChange={(e) => setFormData({ ...formData, buyingSource: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Price *</label>
          <input
            type="number"
            step="0.01"
            required
            value={formData.purchasePrice || ''}
            onChange={(e) => setFormData({ ...formData, purchasePrice: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Selling Price *</label>
          <input
            type="number"
            step="0.01"
            required
            value={formData.sellingPrice || ''}
            onChange={(e) => setFormData({ ...formData, sellingPrice: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );

  const renderLaptopForm = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Serial Number *</label>
        <input
          type="text"
          required
          value={formData.serialNumber || ''}
          onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter serial number"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Brand *</label>
          <input
            type="text"
            required
            value={formData.brand || ''}
            onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Model *</label>
          <input
            type="text"
            required
            value={formData.model || ''}
            onChange={(e) => setFormData({ ...formData, model: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Processor</label>
          <input
            type="text"
            value={formData.processor || ''}
            onChange={(e) => setFormData({ ...formData, processor: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">RAM</label>
          <input
            type="text"
            value={formData.ram || ''}
            onChange={(e) => setFormData({ ...formData, ram: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., 8GB, 16GB"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Storage</label>
        <input
          type="text"
          value={formData.storage || ''}
          onChange={(e) => setFormData({ ...formData, storage: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="e.g., 256GB SSD, 1TB HDD"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Price *</label>
          <input
            type="number"
            step="0.01"
            required
            value={formData.purchasePrice || ''}
            onChange={(e) => setFormData({ ...formData, purchasePrice: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Selling Price *</label>
          <input
            type="number"
            step="0.01"
            required
            value={formData.sellingPrice || ''}
            onChange={(e) => setFormData({ ...formData, sellingPrice: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );

  const renderWatchForm = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Serial Number *</label>
        <input
          type="text"
          required
          value={formData.serialNumber || ''}
          onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter serial number"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Brand *</label>
          <input
            type="text"
            required
            value={formData.brand || ''}
            onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Model *</label>
          <input
            type="text"
            required
            value={formData.model || ''}
            onChange={(e) => setFormData({ ...formData, model: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
        <input
          type="text"
          value={formData.color || ''}
          onChange={(e) => setFormData({ ...formData, color: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Condition *</label>
        <select
          required
          value={formData.condition || ''}
          onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Select Condition</option>
          <option value="NEW">New</option>
          <option value="LIKE_NEW">Like New</option>
          <option value="GOOD">Good</option>
          <option value="FAIR">Fair</option>
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Price *</label>
          <input
            type="number"
            step="0.01"
            required
            value={formData.purchasePrice || ''}
            onChange={(e) => setFormData({ ...formData, purchasePrice: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Selling Price *</label>
          <input
            type="number"
            step="0.01"
            required
            value={formData.sellingPrice || ''}
            onChange={(e) => setFormData({ ...formData, sellingPrice: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );

  const renderAccessoryForm = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">SKU *</label>
        <input
          type="text"
          required
          value={formData.sku || ''}
          onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter SKU"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
          <select
            required
            value={formData.category || ''}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select Category</option>
            <option value="CHARGER">Charger</option>
            <option value="CABLE">Cable</option>
            <option value="EARPHONES">Earphones</option>
            <option value="CASE">Case</option>
            <option value="SCREEN_PROTECTOR">Screen Protector</option>
            <option value="POWER_BANK">Power Bank</option>
            <option value="OTHER">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Brand *</label>
          <input
            type="text"
            required
            value={formData.brand || ''}
            onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
        <select
          required
          value={formData.type || ''}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Select Type</option>
          <option value="ORIGINAL">Original</option>
          <option value="COMPATIBLE">Compatible</option>
          <option value="GENERIC">Generic</option>
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Price *</label>
          <input
            type="number"
            step="0.01"
            required
            value={formData.purchasePrice || ''}
            onChange={(e) => setFormData({ ...formData, purchasePrice: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Selling Price *</label>
          <input
            type="number"
            step="0.01"
            required
            value={formData.sellingPrice || ''}
            onChange={(e) => setFormData({ ...formData, sellingPrice: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity *</label>
          <input
            type="number"
            required
            min="0"
            value={formData.stockQuantity || ''}
            onChange={(e) => setFormData({ ...formData, stockQuantity: parseInt(e.target.value) || 0 })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Min Stock Level</label>
          <input
            type="number"
            min="1"
            value={formData.minStockLevel || 5}
            onChange={(e) => setFormData({ ...formData, minStockLevel: parseInt(e.target.value) || 5 })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );

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
          <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600 mt-1">Manage phones, accessories, and track stock levels</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 font-medium"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </button>
      </div>

      {lowStockItems.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-center mb-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
            <h3 className="text-lg font-semibold text-yellow-800">Low Stock Alert</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {lowStockItems.map((item, index) => (
              <div key={index} className="bg-white rounded-lg p-3 border border-yellow-200">
                <p className="font-medium text-gray-900">{item.brand} {item.category}</p>
                <p className="text-sm text-gray-600">
                  Only <span className="font-semibold text-red-600">{item.stockQuantity}</span> left 
                  (Min: {item.minStockLevel || 5})
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <KPICard
              key={tab.id}
              title={tab.name}
              value={tab.count}
              subtitle="Total items"
              icon={Icon}
              color={tab.id === 'phones' ? 'blue' : tab.id === 'laptops' ? 'purple' : tab.id === 'watches' ? 'green' : 'yellow'}
            />
          );
        })}
      </div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors`}
              >
                <Icon className={`h-4 w-4 ${activeTab === tab.id ? 'text-blue-600' : tab.color}`} />
                {tab.name}
                <span className={`ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium ${
                  activeTab === tab.id ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-900'
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {activeTab === 'phones' && (
        <DataTable
          data={phones}
          columns={phoneColumns}
          searchable={true}
          pageSize={15}
          emptyMessage="No phones found"
        />
      )}
      
      {activeTab === 'laptops' && (
        <DataTable
          data={laptops}
          columns={laptopColumns}
          searchable={true}
          pageSize={15}
          emptyMessage="No laptops found"
        />
      )}
      
      {activeTab === 'watches' && (
        <DataTable
          data={watches}
          columns={watchColumns}
          searchable={true}
          pageSize={15}
          emptyMessage="No watches found"
        />
      )}
      
      {activeTab === 'accessories' && (
        <DataTable
          data={accessories}
          columns={accessoryColumns}
          searchable={true}
          pageSize={15}
          emptyMessage="No accessories found"
        />
      )}

      <Modal
        isOpen={showModal}
        onClose={() => { 
          setShowModal(false); 
          setFormData({}); 
          setIsEditing(false);
          setEditingProduct(null);
        }}
        title={isEditing ? `Edit ${activeTab.slice(0, -1).charAt(0).toUpperCase() + activeTab.slice(1, -1)}` : `Add New ${activeTab.slice(0, -1).charAt(0).toUpperCase() + activeTab.slice(1, -1)}`}
        size="lg"
      >
        <form onSubmit={handleSubmit}>
          {activeTab === 'phones' && renderPhoneForm()}
          {activeTab === 'laptops' && renderLaptopForm()}
          {activeTab === 'watches' && renderWatchForm()}
          {activeTab === 'accessories' && renderAccessoryForm()}
          
          <div className="flex justify-end space-x-3 pt-6">
            <button
              type="button"
              onClick={() => { 
                setShowModal(false); 
                setFormData({}); 
                setIsEditing(false);
                setEditingProduct(null);
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Package className="h-4 w-4" />
              {isEditing ? 'Update Product' : 'Add Product'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProductsPage;