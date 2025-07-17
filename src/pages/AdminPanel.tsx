import React, { useEffect, useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusIcon, PencilIcon, TrashIcon, BuildingIcon, RulerIcon, ImageIcon, SaveIcon, XIcon, UploadIcon, LayoutDashboardIcon, TrendingUpIcon, UsersIcon, SearchIcon, FilterIcon, ArrowRightIcon, SettingsIcon, AlertCircleIcon, CheckCircleIcon, BarChart3Icon, LineChartIcon, PieChartIcon, CalendarIcon, RefreshCcwIcon, HelpCircleIcon, BellIcon, ShoppingBagIcon, MailIcon } from 'lucide-react';
type Pillow = {
  id: number;
  name: string;
  brand: string;
  price: number;
  image: string;
  features: string[];
  description: string;
  stock: number;
  sales: number;
  status: 'active' | 'draft' | 'out_of_stock';
};
type Brand = {
  id: string;
  name: string;
  logo: string;
  pillowCount: number;
};
type Order = {
  id: string;
  customer: string;
  date: string;
  total: number;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  items: {
    name: string;
    quantity: number;
  }[];
};
export const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [editingPillow, setEditingPillow] = useState<Pillow | null>(null);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [pillows, setPillows] = useState<Pillow[]>(PILLOWS);
  const [brands, setBrands] = useState<Brand[]>(BRANDS);
  const [orders, setOrders] = useState<Order[]>(ORDERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{
    start: string;
    end: string;
  }>({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0] // today
  });
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState<{
    id: number;
    message: string;
    read: boolean;
  }[]>([{
    id: 1,
    message: 'Low stock alert: Purple Harmony',
    read: false
  }, {
    id: 2,
    message: 'New order #ORD-2024-005 received',
    read: false
  }, {
    id: 3,
    message: 'Customer feedback received',
    read: true
  }]);
  const tabs = [{
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboardIcon
  }, {
    id: 'pillows',
    label: 'Pillows',
    icon: ImageIcon
  }, {
    id: 'brands',
    label: 'Brands',
    icon: BuildingIcon
  }, {
    id: 'orders',
    label: 'Orders',
    icon: ShoppingBagIcon
  }, {
    id: 'compatibility',
    label: 'Compatibility',
    icon: RulerIcon
  }, {
    id: 'analytics',
    label: 'Analytics',
    icon: TrendingUpIcon
  }, {
    id: 'customers',
    label: 'Customers',
    icon: UsersIcon
  }, {
    id: 'settings',
    label: 'Settings',
    icon: SettingsIcon
  }];
  // Simulate loading data when changing tabs
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [activeTab]);
  const handleSavePillow = (pillow: Pillow) => {
    if (editingPillow) {
      // Update existing pillow
      setPillows(prevPillows => prevPillows.map(p => p.id === pillow.id ? pillow : p));
    } else {
      // Add new pillow
      setPillows(prevPillows => [...prevPillows, {
        ...pillow,
        id: Date.now(),
        stock: Math.floor(Math.random() * 100) + 10,
        sales: 0,
        status: 'active'
      }]);
    }
    setEditingPillow(null);
    setShowAddForm(false);
  };
  const handleDeletePillow = (id: number) => {
    setPillows(prevPillows => prevPillows.filter(p => p.id !== id));
  };
  const handleSaveBrand = (brand: Brand) => {
    if (editingBrand) {
      setBrands(prevBrands => prevBrands.map(b => b.id === brand.id ? brand : b));
    } else {
      setBrands(prevBrands => [...prevBrands, {
        ...brand,
        id: Date.now().toString(),
        pillowCount: 0
      }]);
    }
    setEditingBrand(null);
    setShowAddForm(false);
  };
  const handleDeleteBrand = (id: string) => {
    setBrands(prevBrands => prevBrands.filter(b => b.id !== id));
  };
  const handleUpdateOrderStatus = (orderId: string, newStatus: 'pending' | 'shipped' | 'delivered' | 'cancelled') => {
    setOrders(prevOrders => prevOrders.map(order => order.id === orderId ? {
      ...order,
      status: newStatus
    } : order));
  };
  const filteredPillows = pillows.filter(pillow => {
    const matchesSearch = searchQuery === '' || pillow.name.toLowerCase().includes(searchQuery.toLowerCase()) || pillow.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || pillow.status === filterStatus;
    return matchesSearch && matchesFilter;
  });
  const filteredOrders = orders.filter(order => {
    const orderDate = new Date(order.date);
    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);
    endDate.setHours(23, 59, 59); // Include the end date fully
    const withinDateRange = orderDate >= startDate && orderDate <= endDate;
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesSearch = searchQuery === '' || order.id.toLowerCase().includes(searchQuery.toLowerCase()) || order.customer.toLowerCase().includes(searchQuery.toLowerCase());
    return withinDateRange && matchesStatus && matchesSearch;
  });
  const totalSales = orders.filter(order => order.status !== 'cancelled').reduce((sum, order) => sum + order.total, 0);
  const totalPillows = pillows.reduce((sum, pillow) => sum + pillow.stock, 0);
  const PillowForm = ({
    pillow,
    onSave,
    onCancel
  }) => {
    const [selectedSleepPositions, setSelectedSleepPositions] = useState(pillow?.sleepPositions || []);
    const toggleSleepPosition = position => {
      if (selectedSleepPositions.includes(position)) {
        setSelectedSleepPositions(selectedSleepPositions.filter(p => p !== position));
      } else {
        setSelectedSleepPositions([...selectedSleepPositions, position]);
      }
    };
    return <motion.div initial={{
      opacity: 0,
      y: 10
    }} animate={{
      opacity: 1,
      y: 0
    }} exit={{
      opacity: 0,
      y: -10
    }} className="backdrop-blur-xl bg-white/70 rounded-2xl p-6 shadow-lg shadow-gray-200/50 space-y-6 border border-gray-100">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-medium text-gray-900">
            {pillow ? 'Edit Pillow' : 'Add New Pillow'}
          </h3>
          <button onClick={onCancel} className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <XIcon className="h-5 w-5" />
          </button>
        </div>
        <form className="space-y-6" onSubmit={e => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newPillow = {
          id: pillow?.id || 0,
          name: formData.get('name') as string,
          brand: formData.get('brand') as string,
          price: parseFloat(formData.get('price') as string),
          image: formData.get('image') as string,
          features: (formData.get('features') as string).split('\n'),
          description: formData.get('description') as string,
          stock: pillow?.stock || 0,
          sales: pillow?.sales || 0,
          status: formData.get('status') as 'active' | 'draft' | 'out_of_stock' || 'active',
          sleepPositions: selectedSleepPositions,
          rating: pillow?.rating || 4.5,
          reviews: pillow?.reviews || 0,
          firmness: formData.get('firmness') as string || 'Medium'
        };
        onSave(newPillow);
      }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input type="text" name="name" defaultValue={pillow?.name} className="w-full p-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brand
                </label>
                <select name="brand" defaultValue={pillow?.brand} className="w-full p-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required>
                  {brands.map(brand => <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price
                </label>
                <input type="number" name="price" step="0.01" defaultValue={pillow?.price} className="w-full p-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select name="status" defaultValue={pillow?.status || 'active'} className="w-full p-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="out_of_stock">Out of Stock</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Firmness
                </label>
                <select name="firmness" defaultValue={pillow?.firmness || 'Medium'} className="w-full p-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="Soft">Soft</option>
                  <option value="Medium-soft">Medium-soft</option>
                  <option value="Medium">Medium</option>
                  <option value="Medium-firm">Medium-firm</option>
                  <option value="Firm">Firm</option>
                </select>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL
                </label>
                <div className="flex space-x-4">
                  <input type="text" name="image" defaultValue={pillow?.image} className="flex-1 p-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
                  <button type="button" className="px-4 py-2 bg-gray-100 rounded-xl text-gray-600 hover:bg-gray-200 transition-colors">
                    <UploadIcon className="h-5 w-5" />
                  </button>
                </div>
                {/* Image preview */}
                {(pillow?.image || document.querySelector('input[name="image"]')?.value) && <div className="mt-2 relative w-full h-32 rounded-xl overflow-hidden">
                    <img src={pillow?.image || document.querySelector('input[name="image"]')?.value} alt="Preview" className="w-full h-full object-cover" onError={e => {
                  ;
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                }} />
                  </div>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Features (one per line)
                </label>
                <textarea name="features" defaultValue={pillow?.features.join('\n')} rows={3} className="w-full p-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Suitable for Sleep Positions
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['back', 'side', 'stomach'].map(position => <button key={position} type="button" onClick={() => toggleSleepPosition(position)} className={`p-2 rounded-lg text-sm font-medium ${selectedSleepPositions.includes(position) ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                      {position.charAt(0).toUpperCase() + position.slice(1)}
                    </button>)}
                </div>
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea name="description" defaultValue={pillow?.description} rows={4} className="w-full p-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
            </div>
          </div>
          <div className="flex space-x-4">
            <button type="submit" className="flex-1 flex items-center justify-center p-3 rounded-xl text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all">
              <SaveIcon className="h-5 w-5 mr-2" />
              <span className="font-medium">Save Changes</span>
            </button>
            <button type="button" onClick={onCancel} className="flex-1 flex items-center justify-center p-3 rounded-xl text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">
              <XIcon className="h-5 w-5 mr-2" />
              <span className="font-medium">Cancel</span>
            </button>
          </div>
        </form>
      </motion.div>;
  };
  const BrandForm = ({
    brand,
    onSave,
    onCancel
  }) => <motion.div initial={{
    opacity: 0,
    y: 10
  }} animate={{
    opacity: 1,
    y: 0
  }} exit={{
    opacity: 0,
    y: -10
  }} className="backdrop-blur-xl bg-white/70 rounded-2xl p-6 shadow-lg shadow-gray-200/50 space-y-6 border border-gray-100">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-medium text-gray-900">
          {brand ? 'Edit Brand' : 'Add New Brand'}
        </h3>
        <button onClick={onCancel} className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
          <XIcon className="h-5 w-5" />
        </button>
      </div>
      <form className="space-y-6" onSubmit={e => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const newBrand = {
        id: brand?.id || '',
        name: formData.get('name') as string,
        logo: formData.get('logo') as string,
        pillowCount: brand?.pillowCount || 0
      };
      onSave(newBrand);
    }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Brand Name
            </label>
            <input type="text" name="name" defaultValue={brand?.name} className="w-full p-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Logo URL
            </label>
            <div className="flex space-x-4">
              <input type="text" name="logo" defaultValue={brand?.logo} className="flex-1 p-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
              <button type="button" className="px-4 py-2 bg-gray-100 rounded-xl text-gray-600 hover:bg-gray-200 transition-colors">
                <UploadIcon className="h-5 w-5" />
              </button>
            </div>
            {/* Logo preview */}
            {(brand?.logo || document.querySelector('input[name="logo"]')?.value) && <div className="mt-2 flex justify-center">
                <div className="relative w-16 h-16 rounded-full overflow-hidden">
                  <img src={brand?.logo || document.querySelector('input[name="logo"]')?.value} alt="Preview" className="w-full h-full object-cover" onError={e => {
                ;
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100x100?text=Logo';
              }} />
                </div>
              </div>}
          </div>
        </div>
        <div className="flex space-x-4">
          <button type="submit" className="flex-1 flex items-center justify-center p-3 rounded-xl text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all">
            <SaveIcon className="h-5 w-5 mr-2" />
            <span className="font-medium">Save Changes</span>
          </button>
          <button type="button" onClick={onCancel} className="flex-1 flex items-center justify-center p-3 rounded-xl text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">
            <XIcon className="h-5 w-5 mr-2" />
            <span className="font-medium">Cancel</span>
          </button>
        </div>
      </form>
    </motion.div>;
  const DashboardOverview = () => <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div initial={{
        opacity: 0,
        y: 10
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.1
      }} className="backdrop-blur-xl bg-white/70 rounded-2xl p-5 shadow-lg shadow-gray-200/50 border-l-4 border-blue-500">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Sales</p>
              <h3 className="text-2xl font-medium text-gray-900 mt-1">
                ${totalSales.toFixed(2)}
              </h3>
              <p className="text-xs text-green-500 mt-1 flex items-center">
                <TrendingUpIcon className="h-3 w-3 mr-1" />
                <span>+12.5% from last month</span>
              </p>
            </div>
            <div className="h-10 w-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <BarChart3Icon className="h-6 w-6 text-blue-500" />
            </div>
          </div>
        </motion.div>
        <motion.div initial={{
        opacity: 0,
        y: 10
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.2
      }} className="backdrop-blur-xl bg-white/70 rounded-2xl p-5 shadow-lg shadow-gray-200/50 border-l-4 border-green-500">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Orders</p>
              <h3 className="text-2xl font-medium text-gray-900 mt-1">
                {orders.length}
              </h3>
              <p className="text-xs text-green-500 mt-1 flex items-center">
                <TrendingUpIcon className="h-3 w-3 mr-1" />
                <span>+8.2% from last month</span>
              </p>
            </div>
            <div className="h-10 w-10 bg-green-100 rounded-xl flex items-center justify-center">
              <ShoppingBagIcon className="h-6 w-6 text-green-500" />
            </div>
          </div>
        </motion.div>
        <motion.div initial={{
        opacity: 0,
        y: 10
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.3
      }} className="backdrop-blur-xl bg-white/70 rounded-2xl p-5 shadow-lg shadow-gray-200/50 border-l-4 border-purple-500">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Products</p>
              <h3 className="text-2xl font-medium text-gray-900 mt-1">
                {pillows.length}
              </h3>
              <p className="text-xs text-green-500 mt-1 flex items-center">
                <TrendingUpIcon className="h-3 w-3 mr-1" />
                <span>+3 new this month</span>
              </p>
            </div>
            <div className="h-10 w-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <ImageIcon className="h-6 w-6 text-purple-500" />
            </div>
          </div>
        </motion.div>
        <motion.div initial={{
        opacity: 0,
        y: 10
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.4
      }} className="backdrop-blur-xl bg-white/70 rounded-2xl p-5 shadow-lg shadow-gray-200/50 border-l-4 border-amber-500">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500">Stock Value</p>
              <h3 className="text-2xl font-medium text-gray-900 mt-1">
                ${(totalPillows * 75).toFixed(2)}
              </h3>
              <p className="text-xs text-amber-500 mt-1 flex items-center">
                <AlertCircleIcon className="h-3 w-3 mr-1" />
                <span>2 items low stock</span>
              </p>
            </div>
            <div className="h-10 w-10 bg-amber-100 rounded-xl flex items-center justify-center">
              <PieChartIcon className="h-6 w-6 text-amber-500" />
            </div>
          </div>
        </motion.div>
      </div>
      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <motion.div initial={{
        opacity: 0,
        y: 10
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.5
      }} className="lg:col-span-2 backdrop-blur-xl bg-white/70 rounded-2xl p-6 shadow-lg shadow-gray-200/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Sales Overview
            </h3>
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-xs font-medium rounded-lg bg-blue-50 text-blue-500">
                Week
              </button>
              <button className="px-3 py-1 text-xs font-medium rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200">
                Month
              </button>
              <button className="px-3 py-1 text-xs font-medium rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200">
                Year
              </button>
            </div>
          </div>
          {/* Placeholder for chart - in a real app you'd use a charting library */}
          <div className="h-64 bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden">
            <div className="relative w-full h-full">
              <div className="absolute bottom-0 inset-x-0 h-full flex items-end px-4 space-x-2">
                {Array.from({
                length: 7
              }).map((_, i) => {
                const height = 30 + Math.random() * 60;
                return <div key={i} className="flex-1 flex flex-col items-center">
                      <div className="w-full bg-blue-500/70 rounded-t-md transition-all duration-1000" style={{
                    height: `${height}%`
                  }}></div>
                      <span className="text-xs text-gray-500 mt-1">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                      </span>
                    </div>;
              })}
              </div>
              {/* Y-axis labels */}
              <div className="absolute top-0 left-0 h-full flex flex-col justify-between py-2">
                <span className="text-xs text-gray-400">$1000</span>
                <span className="text-xs text-gray-400">$750</span>
                <span className="text-xs text-gray-400">$500</span>
                <span className="text-xs text-gray-400">$250</span>
                <span className="text-xs text-gray-400">$0</span>
              </div>
            </div>
          </div>
        </motion.div>
        {/* Recent Activity */}
        <motion.div initial={{
        opacity: 0,
        y: 10
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.6
      }} className="backdrop-blur-xl bg-white/70 rounded-2xl p-6 shadow-lg shadow-gray-200/50">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Recent Activity
          </h3>
          <div className="space-y-4">
            {orders.slice(0, 5).map(order => <div key={order.id} className="flex items-center">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center mr-3 ${order.status === 'delivered' ? 'bg-green-100' : order.status === 'shipped' ? 'bg-blue-100' : order.status === 'cancelled' ? 'bg-red-100' : 'bg-amber-100'}`}>
                  <ShoppingBagIcon className={`h-4 w-4 ${order.status === 'delivered' ? 'text-green-500' : order.status === 'shipped' ? 'text-blue-500' : order.status === 'cancelled' ? 'text-red-500' : 'text-amber-500'}`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {order.customer}
                  </p>
                  <p className="text-xs text-gray-500">
                    {order.id} - ${order.total.toFixed(2)}
                  </p>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${order.status === 'delivered' ? 'bg-green-50 text-green-600' : order.status === 'shipped' ? 'bg-blue-50 text-blue-600' : order.status === 'cancelled' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>)}
          </div>
          <button className="mt-4 w-full flex items-center justify-center p-2 rounded-xl text-blue-500 bg-blue-50 hover:bg-blue-100 transition-colors text-sm font-medium">
            <span>View All Activity</span>
            <ArrowRightIcon className="h-4 w-4 ml-1" />
          </button>
        </motion.div>
      </div>
      {/* Low Stock & Top Selling Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{
        opacity: 0,
        y: 10
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.7
      }} className="backdrop-blur-xl bg-white/70 rounded-2xl p-6 shadow-lg shadow-gray-200/50">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <AlertCircleIcon className="h-5 w-5 mr-2 text-amber-500" />
            Low Stock Items
          </h3>
          <div className="space-y-3">
            {pillows.filter(p => p.stock < 20).slice(0, 3).map(pillow => <div key={pillow.id} className="flex items-center">
                  <img src={pillow.image} alt={pillow.name} className="h-10 w-10 rounded-lg object-cover mr-3" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {pillow.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      ${pillow.price.toFixed(2)}
                    </p>
                  </div>
                  <span className="text-amber-500 text-sm font-medium">
                    {pillow.stock} left
                  </span>
                </div>)}
          </div>
          <button className="mt-4 w-full flex items-center justify-center p-2 rounded-xl text-amber-500 bg-amber-50 hover:bg-amber-100 transition-colors text-sm font-medium">
            <span>Restock Items</span>
            <RefreshCcwIcon className="h-4 w-4 ml-1" />
          </button>
        </motion.div>
        <motion.div initial={{
        opacity: 0,
        y: 10
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.8
      }} className="backdrop-blur-xl bg-white/70 rounded-2xl p-6 shadow-lg shadow-gray-200/50">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <TrendingUpIcon className="h-5 w-5 mr-2 text-green-500" />
            Top Selling Products
          </h3>
          <div className="space-y-3">
            {pillows.sort((a, b) => b.sales - a.sales).slice(0, 3).map(pillow => <div key={pillow.id} className="flex items-center">
                  <img src={pillow.image} alt={pillow.name} className="h-10 w-10 rounded-lg object-cover mr-3" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {pillow.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      ${pillow.price.toFixed(2)}
                    </p>
                  </div>
                  <span className="text-green-500 text-sm font-medium">
                    {pillow.sales} sold
                  </span>
                </div>)}
          </div>
          <button className="mt-4 w-full flex items-center justify-center p-2 rounded-xl text-green-500 bg-green-50 hover:bg-green-100 transition-colors text-sm font-medium">
            <span>View All Products</span>
            <ArrowRightIcon className="h-4 w-4 ml-1" />
          </button>
        </motion.div>
      </div>
    </div>;
  const QuickActions = () => <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <motion.button initial={{
      opacity: 0,
      y: 10
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      delay: 0.1
    }} onClick={() => {
      setActiveTab('pillows');
      setShowAddForm(true);
    }} className="p-6 backdrop-blur-xl bg-white/70 rounded-2xl shadow-lg shadow-gray-200/50 text-left hover:bg-white/80 transition-all border border-gray-100">
        <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
          <PlusIcon className="h-6 w-6 text-blue-500" />
        </div>
        <h3 className="font-medium text-gray-900">Add New Pillow</h3>
        <p className="text-sm text-gray-500 mt-1">
          Add a new product to your catalog
        </p>
      </motion.button>
      <motion.button initial={{
      opacity: 0,
      y: 10
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      delay: 0.2
    }} onClick={() => setActiveTab('compatibility')} className="p-6 backdrop-blur-xl bg-white/70 rounded-2xl shadow-lg shadow-gray-200/50 text-left hover:bg-white/80 transition-all border border-gray-100">
        <div className="h-12 w-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
          <RulerIcon className="h-6 w-6 text-purple-500" />
        </div>
        <h3 className="font-medium text-gray-900">Update Measurements</h3>
        <p className="text-sm text-gray-500 mt-1">
          Adjust measurement ranges and compatibility
        </p>
      </motion.button>
      <motion.button initial={{
      opacity: 0,
      y: 10
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      delay: 0.3
    }} onClick={() => {
      setActiveTab('brands');
      setShowAddForm(true);
    }} className="p-6 backdrop-blur-xl bg-white/70 rounded-2xl shadow-lg shadow-gray-200/50 text-left hover:bg-white/80 transition-all border border-gray-100">
        <div className="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
          <BuildingIcon className="h-6 w-6 text-green-500" />
        </div>
        <h3 className="font-medium text-gray-900">Manage Brands</h3>
        <p className="text-sm text-gray-500 mt-1">
          Add or edit brand information
        </p>
      </motion.button>
    </div>;
  const PillowsTable = () => <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1 max-w-md relative">
          <input type="text" placeholder="Search pillows..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
        <div className="flex space-x-2">
          <div className="relative">
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="appearance-none pl-3 pr-8 py-2 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors">
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>
            <FilterIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
          <button onClick={() => setShowAddForm(true)} className="flex items-center px-4 py-2 rounded-xl text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all">
            <PlusIcon className="h-5 w-5 mr-2" />
            <span className="text-sm font-medium">Add Pillow</span>
          </button>
        </div>
      </div>
      {filteredPillows.length > 0 ? <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50/70 text-left">
              <tr>
                <th className="px-4 py-3 text-sm font-medium text-gray-500 rounded-tl-xl">
                  Product
                </th>
                <th className="px-4 py-3 text-sm font-medium text-gray-500">
                  Brand
                </th>
                <th className="px-4 py-3 text-sm font-medium text-gray-500">
                  Price
                </th>
                <th className="px-4 py-3 text-sm font-medium text-gray-500">
                  Stock
                </th>
                <th className="px-4 py-3 text-sm font-medium text-gray-500">
                  Status
                </th>
                <th className="px-4 py-3 text-sm font-medium text-gray-500 rounded-tr-xl">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <AnimatePresence initial={false}>
                {filteredPillows.map(pillow => <motion.tr key={pillow.id} initial={{
              opacity: 0
            }} animate={{
              opacity: 1
            }} exit={{
              opacity: 0
            }} className="backdrop-blur-xl bg-white/70 hover:bg-white/90 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <img src={pillow.image} alt={pillow.name} className="h-10 w-10 rounded-lg object-cover mr-3" />
                        <span className="font-medium text-gray-900">
                          {pillow.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {brands.find(b => b.id === pillow.brand)?.name || pillow.brand}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      ${pillow.price.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {pillow.stock}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${pillow.status === 'active' ? 'bg-green-100 text-green-800' : pillow.status === 'draft' ? 'bg-gray-100 text-gray-800' : 'bg-red-100 text-red-800'}`}>
                        {pillow.status === 'active' ? 'Active' : pillow.status === 'draft' ? 'Draft' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <button onClick={() => setEditingPillow(pillow)} className="p-1.5 text-gray-500 hover:text-blue-500 transition-colors rounded-lg hover:bg-blue-50">
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDeletePillow(pillow.id)} className="p-1.5 text-gray-500 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50">
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>)}
              </AnimatePresence>
            </tbody>
          </table>
        </div> : <div className="text-center py-12 backdrop-blur-xl bg-white/70 rounded-2xl">
          <ImageIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            No products found
          </h3>
          <p className="text-gray-500">
            Try changing your search or filter criteria
          </p>
        </div>}
    </div>;
  const OrdersTable = () => <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1 max-w-md relative">
          <input type="text" placeholder="Search orders..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
        <div className="flex space-x-2">
          <div className="relative">
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="appearance-none pl-3 pr-8 py-2 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors">
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <FilterIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
          <div className="flex items-center space-x-2">
            <input type="date" value={dateRange.start} onChange={e => setDateRange(prev => ({
            ...prev,
            start: e.target.value
          }))} className="p-2 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
            <span className="text-gray-500">to</span>
            <input type="date" value={dateRange.end} onChange={e => setDateRange(prev => ({
            ...prev,
            end: e.target.value
          }))} className="p-2 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
          </div>
        </div>
      </div>
      {filteredOrders.length > 0 ? <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50/70 text-left">
              <tr>
                <th className="px-4 py-3 text-sm font-medium text-gray-500 rounded-tl-xl">
                  Order ID
                </th>
                <th className="px-4 py-3 text-sm font-medium text-gray-500">
                  Customer
                </th>
                <th className="px-4 py-3 text-sm font-medium text-gray-500">
                  Date
                </th>
                <th className="px-4 py-3 text-sm font-medium text-gray-500">
                  Amount
                </th>
                <th className="px-4 py-3 text-sm font-medium text-gray-500">
                  Status
                </th>
                <th className="px-4 py-3 text-sm font-medium text-gray-500 rounded-tr-xl">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map(order => <tr key={order.id} className="backdrop-blur-xl bg-white/70 hover:bg-white/90 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {order.id}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {order.customer}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {new Date(order.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    ${order.total.toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : order.status === 'shipped' ? 'bg-blue-100 text-blue-800' : order.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <select value={order.status} onChange={e => handleUpdateOrderStatus(order.id, e.target.value as any)} className="text-sm p-1 bg-gray-50 border border-gray-200 rounded-lg">
                      <option value="pending">Pending</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div> : <div className="text-center py-12 backdrop-blur-xl bg-white/70 rounded-2xl">
          <ShoppingBagIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            No orders found
          </h3>
          <p className="text-gray-500">
            Try changing your search or filter criteria
          </p>
        </div>}
    </div>;
  return <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-medium text-gray-900">
            Dealer Dashboard
          </h1>
          <p className="mt-2 text-gray-500 text-lg font-light">
            Manage your product catalog and business operations
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <button className="p-2 text-gray-500 hover:text-gray-900 transition-colors rounded-xl hover:bg-gray-100/50 relative">
              <BellIcon className="h-6 w-6" />
              {notifications.filter(n => !n.read).length > 0 && <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
                  {notifications.filter(n => !n.read).length}
                </span>}
            </button>
          </div>
          <button className="p-2 text-gray-500 hover:text-gray-900 transition-colors rounded-xl hover:bg-gray-100/50">
            <HelpCircleIcon className="h-6 w-6" />
          </button>
          <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
            <span className="text-sm font-medium">DP</span>
          </div>
        </div>
      </div>
      {/* Tab Navigation */}
      <div className="flex overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent pb-2">
        <div className="flex p-1 bg-gray-100/70 rounded-2xl">
          {tabs.map(({
          id,
          label,
          icon: Icon
        }) => <button key={id} onClick={() => setActiveTab(id)} className={`flex items-center justify-center py-2.5 px-4 rounded-xl text-sm font-medium transition-all min-w-[100px] ${activeTab === id ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}>
              <Icon className="h-4 w-4 mr-2" />
              {label}
            </button>)}
        </div>
      </div>
      <AnimatePresence mode="wait">
        {isLoading ? <motion.div key="loading" initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} className="flex items-center justify-center py-24">
            <div className="flex flex-col items-center">
              <div className="h-12 w-12 rounded-full border-4 border-blue-200 border-t-blue-500 animate-spin"></div>
              <p className="mt-4 text-gray-500">Loading {activeTab}...</p>
            </div>
          </motion.div> : <motion.div key={activeTab} initial={{
        opacity: 0,
        y: 10
      }} animate={{
        opacity: 1,
        y: 0
      }} exit={{
        opacity: 0,
        y: -10
      }}>
            {activeTab === 'dashboard' && <>
                <QuickActions />
                <DashboardOverview />
              </>}
            {activeTab === 'pillows' && <div className="space-y-6">
                {editingPillow || showAddForm ? <PillowForm pillow={editingPillow} onSave={handleSavePillow} onCancel={() => {
            setEditingPillow(null);
            setShowAddForm(false);
          }} /> : <PillowsTable />}
              </div>}
            {activeTab === 'brands' && <div className="space-y-6">
                {editingBrand || showAddForm ? <BrandForm brand={editingBrand} onSave={handleSaveBrand} onCancel={() => {
            setEditingBrand(null);
            setShowAddForm(false);
          }} /> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {brands.map(brand => <div key={brand.id} className="backdrop-blur-xl bg-white/70 rounded-2xl p-4 shadow-lg shadow-gray-200/50 flex flex-col items-center border border-gray-100">
                        <img src={brand.logo} alt={brand.name} className="h-16 w-16 rounded-full object-cover mb-3" />
                        <h3 className="font-medium text-gray-900 text-center">
                          {brand.name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {brand.pillowCount} products
                        </p>
                        <div className="flex space-x-2 mt-4">
                          <button onClick={() => setEditingBrand(brand)} className="p-2 text-gray-500 hover:text-blue-500 transition-colors rounded-lg hover:bg-blue-50">
                            <PencilIcon className="h-5 w-5" />
                          </button>
                          <button onClick={() => handleDeleteBrand(brand.id)} className="p-2 text-gray-500 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50">
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </div>)}
                    <button onClick={() => setShowAddForm(true)} className="backdrop-blur-xl bg-white/70 rounded-2xl p-6 shadow-lg shadow-gray-200/50 flex flex-col items-center justify-center border border-dashed border-gray-200 hover:border-blue-300 transition-colors h-full">
                      <div className="h-12 w-12 bg-blue-50 rounded-full flex items-center justify-center mb-3">
                        <PlusIcon className="h-6 w-6 text-blue-500" />
                      </div>
                      <p className="font-medium text-gray-900">Add New Brand</p>
                    </button>
                  </div>}
              </div>}
            {activeTab === 'orders' && <OrdersTable />}
            {activeTab === 'compatibility' && <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-medium text-gray-900">
                    Compatibility Settings
                  </h2>
                  <button className="flex items-center px-4 py-2 rounded-xl text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all">
                    <SaveIcon className="h-5 w-5 mr-2" />
                    <span className="text-sm font-medium">Save Changes</span>
                  </button>
                </div>
                <div className="backdrop-blur-xl bg-white/70 rounded-2xl p-6 shadow-lg shadow-gray-200/50 space-y-6 border border-gray-100">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Measurement Ranges
                    </h3>
                    <div className="grid gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Neck Length Range (inches)
                        </label>
                        <div className="flex space-x-4">
                          <input type="number" placeholder="Min" defaultValue="2" className="flex-1 p-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
                          <input type="number" placeholder="Max" defaultValue="10" className="flex-1 p-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Neck Width Range (inches)
                        </label>
                        <div className="flex space-x-4">
                          <input type="number" placeholder="Min" defaultValue="2" className="flex-1 p-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
                          <input type="number" placeholder="Max" defaultValue="20" className="flex-1 p-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Sleep Position Preferences
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {['back', 'side', 'stomach'].map(position => <div key={position} className="p-4 bg-gray-50/50 rounded-xl space-y-2">
                          <h4 className="font-medium text-gray-900 capitalize">
                            {position} Sleeper
                          </h4>
                          <select className="w-full p-2 bg-white border border-gray-200 rounded-lg">
                            <option>Soft</option>
                            <option selected={position === 'back'}>
                              Medium
                            </option>
                            <option selected={position === 'side'}>Firm</option>
                          </select>
                        </div>)}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Pillow Compatibility Matrix
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full">
                        <thead className="bg-gray-50/70">
                          <tr>
                            <th className="px-4 py-3 text-sm font-medium text-gray-500 text-left">
                              Pillow
                            </th>
                            <th className="px-4 py-3 text-sm font-medium text-gray-500 text-center">
                              Back Sleeper
                            </th>
                            <th className="px-4 py-3 text-sm font-medium text-gray-500 text-center">
                              Side Sleeper
                            </th>
                            <th className="px-4 py-3 text-sm font-medium text-gray-500 text-center">
                              Stomach Sleeper
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {pillows.slice(0, 5).map(pillow => <tr key={pillow.id} className="bg-white">
                              <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                {pillow.name}
                              </td>
                              <td className="px-4 py-3 text-center">
                                <input type="checkbox" className="h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300 rounded" defaultChecked={Math.random() > 0.3} />
                              </td>
                              <td className="px-4 py-3 text-center">
                                <input type="checkbox" className="h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300 rounded" defaultChecked={Math.random() > 0.3} />
                              </td>
                              <td className="px-4 py-3 text-center">
                                <input type="checkbox" className="h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300 rounded" defaultChecked={Math.random() > 0.3} />
                              </td>
                            </tr>)}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>}
          </motion.div>}
      </AnimatePresence>
    </div>;
};
// Mock data for brands
const BRANDS = [{
  id: 'casper',
  name: 'Casper',
  logo: 'https://images.unsplash.com/photo-1571566882372-1598d88abd90?auto=format&fit=crop&w=100&h=100&q=80',
  pillowCount: 4
}, {
  id: 'purple',
  name: 'Purple',
  logo: 'https://images.unsplash.com/photo-1555424221-250de2a343ad?auto=format&fit=crop&w=100&h=100&q=80',
  pillowCount: 3
}, {
  id: 'tempurpedic',
  name: 'Tempur-Pedic',
  logo: 'https://images.unsplash.com/photo-1617469165786-8007eda3caa7?auto=format&fit=crop&w=100&h=100&q=80',
  pillowCount: 5
}];
// Mock data for pillows
const PILLOWS = [{
  id: 1,
  name: 'Cloud Comfort Elite',
  brand: 'casper',
  price: 129.99,
  image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=600&q=80',
  features: ['Cooling technology', 'Adjustable height', 'Memory foam'],
  description: 'The Cloud Comfort Elite pillow provides exceptional support with its adaptive memory foam core that conforms to your unique shape.',
  stock: 45,
  sales: 230,
  status: 'active'
}, {
  id: 2,
  name: 'Purple Harmony',
  brand: 'purple',
  price: 159.99,
  image: 'https://images.unsplash.com/photo-1631006387899-06240b7f6414?auto=format&fit=crop&w=600&q=80',
  features: ['Grid technology', 'Temperature neutral', 'No pressure points'],
  description: 'The Purple Harmony pillow combines the best of both worlds with a responsive grid design for optimal support and breathability.',
  stock: 12,
  sales: 185,
  status: 'active'
}, {
  id: 3,
  name: 'TEMPUR-Cloud',
  brand: 'tempurpedic',
  price: 189.99,
  image: 'https://images.unsplash.com/photo-1629949009710-f7bae3541d99?auto=format&fit=crop&w=600&q=80',
  features: ['Pressure relief', 'Washable cover', 'Adaptive support'],
  description: 'The TEMPUR-Cloud pillow adapts to your shape for personalized comfort and pressure relief throughout the night.',
  stock: 8,
  sales: 320,
  status: 'out_of_stock'
}, {
  id: 4,
  name: 'Cooling Gel Pillow',
  brand: 'casper',
  price: 99.99,
  image: 'https://images.unsplash.com/photo-1591389703635-e15a07609a0f?auto=format&fit=crop&w=600&q=80',
  features: ['Cooling gel layer', 'Medium firmness', 'Hypoallergenic'],
  description: 'Stay cool all night with this gel-infused memory foam pillow that dissipates heat while providing excellent support.',
  stock: 32,
  sales: 175,
  status: 'active'
}, {
  id: 5,
  name: 'Organic Cotton Pillow',
  brand: 'purple',
  price: 79.99,
  image: 'https://images.unsplash.com/photo-1592789705501-f9ae4287c4cf?auto=format&fit=crop&w=600&q=80',
  features: ['100% organic cotton', 'Eco-friendly', 'Chemical-free'],
  description: 'This natural pillow is made from 100% organic cotton for a clean, chemical-free sleep experience.',
  stock: 25,
  sales: 120,
  status: 'draft'
}];
// Mock data for orders
const ORDERS = [{
  id: 'ORD-2024-001',
  customer: 'Emma Johnson',
  date: '2024-01-20',
  total: 129.99,
  status: 'delivered',
  items: [{
    name: 'Cloud Comfort Elite',
    quantity: 1
  }]
}, {
  id: 'ORD-2024-002',
  customer: 'Michael Smith',
  date: '2024-01-25',
  total: 319.98,
  status: 'shipped',
  items: [{
    name: 'Purple Harmony',
    quantity: 2
  }]
}, {
  id: 'ORD-2024-003',
  customer: 'Sarah Williams',
  date: '2024-01-28',
  total: 189.99,
  status: 'pending',
  items: [{
    name: 'TEMPUR-Cloud',
    quantity: 1
  }]
}, {
  id: 'ORD-2024-004',
  customer: 'Robert Brown',
  date: '2024-01-30',
  total: 259.98,
  status: 'cancelled',
  items: [{
    name: 'Cloud Comfort Elite',
    quantity: 1
  }, {
    name: 'Organic Cotton Pillow',
    quantity: 1
  }]
}, {
  id: 'ORD-2024-005',
  customer: 'Jennifer Davis',
  date: '2024-02-02',
  total: 379.97,
  status: 'pending',
  items: [{
    name: 'Purple Harmony',
    quantity: 1
  }, {
    name: 'TEMPUR-Cloud',
    quantity: 1
  }]
}];