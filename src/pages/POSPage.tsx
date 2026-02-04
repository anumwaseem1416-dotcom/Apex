import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Scan, Plus, Minus, Trash2, Calculator, CreditCard, Banknote, Smartphone } from 'lucide-react';
import { customers, products, sales } from '../services/api';
import Modal from '../components/ui/Modal';
import LoadingSpinner from '../components/ui/LoadingSpinner';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  type: 'PHONE' | 'ACCESSORY' | 'LAPTOP' | 'WATCH';
  imei?: string;
  sku?: string;
  serialNumber?: string;
}

interface Customer {
  id: string;
  name: string;
  phone: string;
}

const POSPage: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customersList, setCustomersList] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [barcodeInput, setBarcodeInput] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'CARD' | 'ONLINE'>('CASH');
  const [paidAmount, setPaidAmount] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [discountType, setDiscountType] = useState<'FIXED' | 'PERCENT'>('FIXED');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [productsList, setProductsList] = useState<any[]>([]);
  
  const searchRef = useRef<HTMLInputElement>(null);
  const barcodeRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchData();
    searchRef.current?.focus();
  }, []);

  const fetchData = async () => {
    try {
      const [customersRes, phonesRes, laptopsRes, watchesRes, accessoriesRes] = await Promise.all([
        customers.getAll(),
        products.getPhones(),
        products.getLaptops(),
        products.getWatches(),
        products.getAccessories()
      ]);
      
      console.log('POS API responses:', { customersRes: customersRes.data, phonesRes: phonesRes.data });
      
      setCustomersList(customersRes.data?.data || customersRes.data || []);
      
      const allProducts = [
        ...(phonesRes.data?.data || phonesRes.data || []).filter((p: any) => p.status === 'IN_STOCK').map((p: any) => ({
          ...p,
          type: 'PHONE',
          name: `${p.brand} ${p.model}`,
          price: p.sellingPrice
        })),
        ...(laptopsRes.data?.data || laptopsRes.data || []).filter((l: any) => l.status === 'IN_STOCK').map((l: any) => ({
          ...l,
          type: 'LAPTOP',
          name: `${l.brand} ${l.model}`,
          price: l.sellingPrice
        })),
        ...(watchesRes.data?.data || watchesRes.data || []).filter((w: any) => w.status === 'IN_STOCK').map((w: any) => ({
          ...w,
          type: 'WATCH',
          name: `${w.brand} ${w.model}`,
          price: w.sellingPrice
        })),
        ...(accessoriesRes.data?.data || accessoriesRes.data || []).filter((a: any) => a.stockQuantity > 0).map((a: any) => ({
          ...a,
          type: 'ACCESSORY',

          price: a.sellingPrice
        }))
      ];
      
      setProductsList(allProducts);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const filteredProducts = productsList.filter(product =>
    (product.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.imei && product.imei.includes(searchTerm)) ||
    (product.serialNumber && product.serialNumber.includes(searchTerm)) ||
    (product.sku && product.sku.includes(searchTerm))
  );

  const addToCart = (product: any) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      if (product.type === 'PHONE' || product.type === 'LAPTOP' || product.type === 'WATCH') {
        return;
      }
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        type: product.type,
        imei: product.imei,
        sku: product.sku,
        serialNumber: product.serialNumber
      }]);
    }
    
    setSearchTerm('');
    searchRef.current?.focus();
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    
    setCart(cart.map(item =>
      item.id === id ? { ...item, quantity } : item
    ));
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = discountType === 'PERCENT' 
    ? (subtotal * discount / 100) 
    : discount;
  const total = Math.round((subtotal - discountAmount) * 100) / 100;
  const change = Math.max(0, paidAmount - total);

  const handleBarcodeScan = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const product = productsList.find(p => 
        p.imei === barcodeInput || p.sku === barcodeInput || p.serialNumber === barcodeInput
      );
      
      if (product) {
        addToCart(product);
        setBarcodeInput('');
      } else {
        alert('Product not found!');
      }
    }
  };

  const handleCheckout = async () => {
    if (!selectedCustomer) {
      alert('Please select a customer');
      return;
    }
    
    if (cart.length === 0) {
      alert('Cart is empty');
      return;
    }
    
    if (paidAmount < total) {
      alert('Insufficient payment amount');
      return;
    }

    setLoading(true);
    try {
      // Calculate proportional payment for each item
      let remainingPaid = paidAmount;
      
      for (let i = 0; i < cart.length; i++) {
        const item = cart[i];
        const itemTotal = item.price * item.quantity;
        
        // For the last item, use remaining amount to avoid rounding errors
        const itemPaidAmount = i === cart.length - 1 
          ? remainingPaid 
          : Math.round((itemTotal / total) * paidAmount * 100) / 100;
        
        remainingPaid -= itemPaidAmount;
        
        await sales.create({
          customerId: selectedCustomer.id,
          productType: item.type,
          productId: item.id,
          sellingPrice: itemTotal,
          paidAmount: itemPaidAmount,
          paymentMode: paymentMethod
        });
      }
      
      setCart([]);
      setSelectedCustomer(null);
      setPaidAmount(0);
      setDiscount(0);
      setShowPaymentModal(false);
      
      alert('Sale completed successfully!');
      fetchData();
    } catch (error) {
      console.error('Error processing sale:', error);
      alert('Error processing sale. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (e.key === 'F1') {
      e.preventDefault();
      searchRef.current?.focus();
    }
    if (e.key === 'F2') {
      e.preventDefault();
      barcodeRef.current?.focus();
    }
    if (e.key === 'F3') {
      e.preventDefault();
      if (cart.length > 0) {
        setShowPaymentModal(true);
      }
    }
  }, [cart.length]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  return (
    <div className="h-screen flex bg-gray-50">
      <div className="flex-1 flex flex-col">
        <div className="bg-white border-b border-gray-200 p-4">
          <h1 className="text-xl font-bold text-gray-900">Point of Sale</h1>
          <p className="text-sm text-gray-600">F1: Search | F2: Barcode | F3: Checkout</p>
        </div>

        <div className="bg-white border-b border-gray-200 p-4 space-y-3">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                ref={searchRef}
                type="text"
                placeholder="Search products... (F1)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex-1 relative">
              <Scan className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                ref={barcodeRef}
                type="text"
                placeholder="Scan barcode/IMEI... (F2)"
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                onKeyPress={handleBarcodeScan}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="flex-1 p-4 overflow-y-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredProducts.slice(0, 20).map((product) => (
              <div
                key={product.id}
                onClick={() => addToCart(product)}
                className="bg-white rounded-lg border border-gray-200 p-3 cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="text-sm font-medium text-gray-900 truncate">{product.name}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {product.type === 'PHONE' ? product.imei : 
                   product.type === 'LAPTOP' || product.type === 'WATCH' ? product.serialNumber :
                   product.sku}
                </div>
                <div className="text-lg font-bold text-blue-600 mt-2">${product.price}</div>
                <div className="text-xs text-gray-400 mt-1">{product.type}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-2">Customer</label>
          <select
            value={selectedCustomer?.id || ''}
            onChange={(e) => {
              const customer = customersList.find(c => c.id === e.target.value);
              setSelectedCustomer(customer || null);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select Customer</option>
            {customersList.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name} - {customer.phone}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Cart ({cart.length})</h3>
          {cart.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Cart is empty</p>
          ) : (
            <div className="space-y-3">
              {cart.map((item) => (
                <div key={item.id} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">{item.name}</p>
                      <p className="text-xs text-gray-500">
                        {item.imei || item.serialNumber || item.sku || 'N/A'} • ${item.price}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  
                  {item.type !== 'PHONE' && item.type !== 'LAPTOP' && item.type !== 'WATCH' && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 text-gray-500 hover:text-gray-700"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 text-gray-500 hover:text-gray-700"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <p className="font-semibold text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="border-t border-gray-200 p-4 space-y-3">
            <div className="flex items-center gap-2">
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value as 'FIXED' | 'PERCENT')}
                className="px-2 py-1 text-sm border border-gray-300 rounded"
              >
                <option value="FIXED">$</option>
                <option value="PERCENT">%</option>
              </select>
              <input
                type="number"
                placeholder="Discount"
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
                className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
              />
            </div>

            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Discount:</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg border-t pt-1">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => setShowPaymentModal(true)}
              disabled={!selectedCustomer}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Calculator className="h-4 w-4" />
              Checkout (F3)
            </button>
          </div>
        )}
      </div>

      <Modal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        title="Payment"
        size="md"
      >
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between text-lg font-bold">
              <span>Total Amount:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'CASH', label: 'Cash', icon: Banknote },
                { value: 'CARD', label: 'Card', icon: CreditCard },
                { value: 'ONLINE', label: 'Online', icon: Smartphone }
              ].map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => setPaymentMethod(value as any)}
                  className={`p-3 rounded-lg border-2 flex flex-col items-center gap-1 ${
                    paymentMethod === value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-sm font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Amount Paid</label>
            <input
              type="number"
              step="0.01"
              value={paidAmount}
              onChange={(e) => setPaidAmount(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.00"
            />
          </div>

          {paidAmount > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between">
                <span className="font-medium">Change:</span>
                <span className={`font-bold ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${change.toFixed(2)}
                </span>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setShowPaymentModal(false)}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleCheckout}
              disabled={loading || paidAmount < total}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? <LoadingSpinner size="sm" /> : 'Complete Sale'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default POSPage;