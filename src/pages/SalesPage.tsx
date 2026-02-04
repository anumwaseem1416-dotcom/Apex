import React, { useEffect, useState } from 'react';
import { Plus, Eye, Printer, Search, Filter, X } from 'lucide-react';
import { sales, customers, products } from '../services/api';
import DataTable from '../components/ui/DataTable';
import Modal from '../components/ui/Modal';
import LoadingSpinner from '../components/ui/LoadingSpinner';

interface Sale {
  id: string;
  customer: { name: string; phone: string };
  productType: 'PHONE' | 'ACCESSORY';
  sellingPrice: number;
  paidAmount: number;
  remainingAmount: number;
  paymentMode: 'CASH' | 'CARD' | 'ONLINE';
  saleDate: string;
  phone?: { brand: string; model: string; imei: string };
  accessory?: { brand: string; category: string; sku: string };
}

interface ProductOption {
  id: string;
  name: string;
  price: number;
}

const SalesPage: React.FC = () => {
  const [salesList, setSalesList] = useState<Sale[]>([]);
  const [customersList, setCustomersList] = useState([]);
  const [phonesList, setPhonesList] = useState([]);
  const [accessoriesList, setAccessoriesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [formData, setFormData] = useState({
    customerId: '',
    productType: 'PHONE',
    productId: '',
    sellingPrice: 0,
    paidAmount: 0,
    paymentMode: 'CASH'
  });
  const [customerSearch, setCustomerSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    paymentMode: '',
    dateFrom: '',
    dateTo: '',
    minAmount: '',
    maxAmount: '',
    dueOnly: false
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [salesRes, customersRes, phonesRes, accessoriesRes] = await Promise.all([
        sales.getAll(),
        customers.getAll(),
        products.getPhones(),
        products.getAccessories()
      ]);

      const normalizedSales = Array.isArray(salesRes.data?.data) 
        ? salesRes.data.data 
        : Array.isArray(salesRes.data) 
        ? salesRes.data 
        : [];
      
      const processedSales = normalizedSales.map((sale: any) => {
        const sellingPrice = Number(sale.sellingPrice || 0);
        const paidAmount = Number(sale.paidAmount || 0);

        return {
          ...sale,
          sellingPrice,
          paidAmount,
          remainingAmount: Math.max(sellingPrice - paidAmount, 0)
        };
      });

      setSalesList(processedSales);
      setCustomersList(Array.isArray(customersRes.data?.data) ? customersRes.data.data : Array.isArray(customersRes.data) ? customersRes.data : []);
      setPhonesList((Array.isArray(phonesRes.data?.data) ? phonesRes.data.data : Array.isArray(phonesRes.data) ? phonesRes.data : []).filter((p: any) => p.status === 'IN_STOCK'));
      setAccessoriesList((Array.isArray(accessoriesRes.data?.data) ? accessoriesRes.data.data : Array.isArray(accessoriesRes.data) ? accessoriesRes.data : []).filter((a: any) => a.stockQuantity > 0));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.customerId || !formData.productId || formData.sellingPrice <= 0 || formData.paidAmount < 0) {
      alert('Please fill in all required fields with valid values');
      return;
    }
    
    // Validate product belongs to selected type
    const validProducts = getProductOptions();
    const selectedProduct = validProducts.find(p => p.id === formData.productId);
    
    if (!selectedProduct) {
      alert('Invalid product selected. Please reselect.');
      return;
    }
    
    const salePayload = {
      customerId: formData.customerId,
      productType: formData.productType,
      productId: formData.productId,
      sellingPrice: Number(formData.sellingPrice),
      paidAmount: Number(formData.paidAmount),
      paymentMode: formData.paymentMode
    };
    
    setSubmitting(true);
    try {
      await sales.create(salePayload);
      
      setShowModal(false);
      setFormData({
        customerId: '',
        productType: 'PHONE',
        productId: '',
        sellingPrice: 0,
        paidAmount: 0,
        paymentMode: 'CASH'
      });
      fetchData();
      alert('Sale created successfully!');
    } catch (error: any) {
      console.error('Error creating sale:', error);
      console.error('Response data:', error.response?.data);
      console.error('Payload sent:', salePayload);
      const errorMessage = error.response?.data?.message || error.response?.data?.details || error.response?.data?.error || error.message || 'Failed to create sale';
      alert(`Error: ${errorMessage}`);
    } finally {
      setSubmitting(false);
    }
  };

  const getProductOptions = (): ProductOption[] => {
    let products: ProductOption[] = [];

    if (formData.productType === 'PHONE') {
      products = phonesList.map((phone: any) => ({
        id: phone.id,
        name: `${phone?.brand ?? ''} ${phone?.model ?? ''} - ${phone?.imei ?? ''}`,
        price: Number(phone?.sellingPrice ?? 0)
      }));
    } else if (formData.productType === 'ACCESSORY') {
      products = accessoriesList.map((accessory: any) => ({
        id: accessory.id,
        name: `${accessory?.brand ?? ''} ${accessory?.category ?? ''} - ${accessory?.sku ?? ''}`,
        price: Number(accessory?.sellingPrice ?? 0)
      }));
    }

    if (productSearch?.trim()) {
      return products.filter(product =>
        product.name.toLowerCase().includes(productSearch.toLowerCase())
      );
    }

    return products;
  };

  const getFilteredCustomers = () => {
    if (customerSearch) {
      return customersList.filter((customer: any) => 
        customer?.name?.toLowerCase().includes(customerSearch.toLowerCase()) ||
        customer?.phone?.includes(customerSearch)
      );
    }
    return customersList;
  };

  const getFilteredSales = () => {
    let filtered = [...salesList];
    
    if (filters.paymentMode) {
      filtered = filtered.filter(sale => sale.paymentMode === filters.paymentMode);
    }
    
    if (filters.dateFrom) {
      filtered = filtered.filter(sale => 
        sale.saleDate && new Date(sale.saleDate) >= new Date(filters.dateFrom)
      );
    }
    
    if (filters.dateTo) {
      filtered = filtered.filter(sale => 
        sale.saleDate && new Date(sale.saleDate) <= new Date(filters.dateTo)
      );
    }
    
    if (filters.minAmount) {
      filtered = filtered.filter(sale => 
        sale.sellingPrice >= parseFloat(filters.minAmount)
      );
    }
    
    if (filters.maxAmount) {
      filtered = filtered.filter(sale => 
        sale.sellingPrice <= parseFloat(filters.maxAmount)
      );
    }
    
    if (filters.dueOnly) {
      filtered = filtered.filter(sale => sale.remainingAmount > 0);
    }
    
    return filtered;
  };

  const clearFilters = () => {
    setFilters({
      paymentMode: '',
      dateFrom: '',
      dateTo: '',
      minAmount: '',
      maxAmount: '',
      dueOnly: false
    });
  };

  const hasActiveFilters = () => {
    return Object.values(filters).some(value => value !== '' && value !== false);
  };

  const handleProductChange = (productId: string) => {
    const product = getProductOptions().find(p => p.id === productId);
    setFormData({
      ...formData,
      productId,
      sellingPrice: product?.price || 0
    });
  };

  const viewSaleDetails = (sale: Sale) => {
    setSelectedSale(sale);
    setShowDetailsModal(true);
  };

  const printReceipt = (sale: Sale) => {
    const printContent = `
      MOBILE SHOP RECEIPT
      ==================
      Date: ${new Date(sale.saleDate).toLocaleDateString()}
      Customer: ${sale.customer.name}
      Phone: ${sale.customer.phone}
      
      Product: ${sale.phone ? `${sale.phone.brand} ${sale.phone.model}` : 
                 sale.accessory ? `${sale.accessory.brand} ${sale.accessory.category}` : 'N/A'}
      IMEI/SKU: ${sale.phone?.imei || sale.accessory?.sku || 'N/A'}
      
      Amount: $${Number(sale.sellingPrice || 0).toFixed(2)}
      Paid: $${Number(sale.paidAmount || 0).toFixed(2)}
      ${sale.remainingAmount > 0 ? `Due: $${Number(sale.remainingAmount || 0).toFixed(2)}` : ''}
      Payment: ${sale.paymentMode}
      
      Thank you for your business!
    `;
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`<pre>${printContent}</pre>`);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const salesColumns = [
    {
      key: 'customer',
      label: 'Customer',
      sortable: true,
      render: (customer: any) => (
        <div>
          <div className="font-medium text-gray-900">{customer?.name || 'N/A'}</div>
          <div className="text-sm text-gray-500">{customer?.phone || ''}</div>
        </div>
      )
    },
    {
      key: 'product',
      label: 'Product',
      render: (_: any, sale: Sale) => (
        <div>
          <div className="font-medium text-gray-900">
            {sale.phone ? `${sale.phone.brand} ${sale.phone.model}` :
             sale.accessory ? `${sale.accessory.brand} ${sale.accessory.category}` : 'N/A'}
          </div>
          <div className="text-sm text-gray-500">
            {sale.phone?.imei || sale.accessory?.sku || ''}
          </div>
        </div>
      )
    },
    {
      key: 'sellingPrice',
      label: 'Amount',
      sortable: true,
      render: (value: number) => (
        <span className="font-semibold text-gray-900">${Number(value || 0).toFixed(2)}</span>
      )
    },
    {
      key: 'paidAmount',
      label: 'Paid',
      sortable: true,
      render: (value: number) => (
        <span className="text-green-600 font-medium">${Number(value || 0).toFixed(2)}</span>
      )
    },
    {
      key: 'remainingAmount',
      label: 'Due',
      sortable: true,
      render: (value: number) => (
        <span className={`font-medium ${
          value > 0 ? 'text-red-600' : 'text-green-600'
        }`}>
          ${Number(value || 0).toFixed(2)}
        </span>
      )
    },
    {
      key: 'paymentMode',
      label: 'Payment',
      render: (value: string) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          value === 'CASH' ? 'bg-green-100 text-green-800' :
          value === 'CARD' ? 'bg-blue-100 text-blue-800' :
          'bg-purple-100 text-purple-800'
        }`}>
          {value}
        </span>
      )
    },
    {
      key: 'saleDate',
      label: 'Date',
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString()
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, sale: Sale) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => viewSaleDetails(sale)}
            className="p-1 text-blue-600 hover:text-blue-800"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => printReceipt(sale)}
            className="p-1 text-gray-600 hover:text-gray-800"
            title="Print Receipt"
          >
            <Printer className="h-4 w-4" />
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
          <h1 className="text-2xl font-bold text-gray-900">Sales Management</h1>
          <p className="text-gray-600 mt-1">Track and manage all sales transactions</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 font-medium"
        >
          <Plus className="h-4 w-4" />
          New Sale
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-gray-900">Sales Records</h2>
              {hasActiveFilters() && (
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  Filtered
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border ${
                  showFilters || hasActiveFilters() 
                    ? 'bg-blue-50 text-blue-700 border-blue-200' 
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Filter className="h-4 w-4" />
                Filters
              </button>
              {hasActiveFilters() && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 px-2 py-2 text-sm text-gray-500 hover:text-gray-700"
                  title="Clear filters"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
          
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Mode
                  </label>
                  <select
                    value={filters.paymentMode}
                    onChange={(e) => setFilters({...filters, paymentMode: e.target.value})}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Payments</option>
                    <option value="CASH">Cash</option>
                    <option value="CARD">Card</option>
                    <option value="ONLINE">Online</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date From
                  </label>
                  <input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date To
                  </label>
                  <input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount Range
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.minAmount}
                      onChange={(e) => setFilters({...filters, minAmount: e.target.value})}
                      className="w-full px-2 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.maxAmount}
                      onChange={(e) => setFilters({...filters, maxAmount: e.target.value})}
                      className="w-full px-2 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-4 flex items-center">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.dueOnly}
                    onChange={(e) => setFilters({...filters, dueOnly: e.target.checked})}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Show only sales with due amount</span>
                </label>
              </div>
            </div>
          )}
        </div>
        
        <DataTable
          data={getFilteredSales()}
          columns={salesColumns}
          searchable={true}
          pageSize={15}
          emptyMessage="No sales found"
        />
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Create New Sale"
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Customer *
            </label>
            <div className="space-y-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search customers by name or phone..."
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                required
                value={formData.customerId}
                onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Customer</option>
                {getFilteredCustomers().map((customer: any) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name} - {customer.phone}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Type *
            </label>
            <select
              required
              value={formData.productType}
              onChange={(e) => setFormData({ ...formData, productType: e.target.value, productId: '', sellingPrice: 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="PHONE">Phone</option>
              <option value="ACCESSORY">Accessory</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product *
            </label>
            <div className="space-y-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search products by name, brand, or IMEI/SKU..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                required
                value={formData.productId}
                onChange={(e) => handleProductChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Product</option>
                {getProductOptions().map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} - ${product.price}
                  </option>
                ))}
              </select>
              {productSearch && getProductOptions().length === 0 && (
                <p className="text-sm text-gray-500 italic">No products found matching your search</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Selling Price *
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.sellingPrice}
                onChange={(e) => setFormData({ ...formData, sellingPrice: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Paid Amount *
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.paidAmount}
                onChange={(e) => setFormData({ ...formData, paidAmount: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Mode *
            </label>
            <select
              required
              value={formData.paymentMode}
              onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="CASH">Cash</option>
              <option value="CARD">Card</option>
              <option value="ONLINE">Online</option>
            </select>
          </div>
          
          {formData.sellingPrice > 0 && formData.paidAmount >= 0 && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Remaining Amount:</span>
                <span className={`font-semibold ${
                  (formData.sellingPrice - formData.paidAmount) > 0 ? 'text-red-600' : 'text-green-600'
                }`}>
                  ${(formData.sellingPrice - formData.paidAmount).toFixed(2)}
                </span>
              </div>
            </div>
          )}
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {submitting ? <LoadingSpinner size="sm" /> : null}
              {submitting ? 'Creating...' : 'Create Sale'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title="Sale Details"
        size="md"
      >
        {selectedSale && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Customer</label>
                <p className="text-gray-900">{selectedSale.customer?.name}</p>
                <p className="text-sm text-gray-500">{selectedSale.customer?.phone}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Sale Date</label>
                <p className="text-gray-900">{new Date(selectedSale.saleDate).toLocaleDateString()}</p>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Product</label>
              <p className="text-gray-900">
                {selectedSale.phone ? `${selectedSale.phone.brand} ${selectedSale.phone.model}` :
                 selectedSale.accessory ? `${selectedSale.accessory.brand} ${selectedSale.accessory.category}` : 'N/A'}
              </p>
              <p className="text-sm text-gray-500">
                {selectedSale.phone?.imei || selectedSale.accessory?.sku || ''}
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Amount</label>
                <p className="text-lg font-semibold text-gray-900">${Number(selectedSale.sellingPrice || 0).toFixed(2)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Paid</label>
                <p className="text-lg font-semibold text-green-600">${Number(selectedSale.paidAmount || 0).toFixed(2)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Due</label>
                <p className={`text-lg font-semibold ${
                  selectedSale.remainingAmount > 0 ? 'text-red-600' : 'text-green-600'
                }`}>
                  ${Number(selectedSale.remainingAmount || 0).toFixed(2)}
                </p>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Payment Method</label>
              <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
                selectedSale.paymentMode === 'CASH' ? 'bg-green-100 text-green-800' :
                selectedSale.paymentMode === 'CARD' ? 'bg-blue-100 text-blue-800' :
                'bg-purple-100 text-purple-800'
              }`}>
                {selectedSale.paymentMode}
              </span>
            </div>
            
            <div className="flex justify-end pt-4">
              <button
                onClick={() => printReceipt(selectedSale)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2"
              >
                <Printer className="h-4 w-4" />
                Print Receipt
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SalesPage;