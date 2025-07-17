import React, { useState } from 'react';
import { ProductCard } from './ProductCard';
import { CheckIcon, FilterIcon, StarIcon, XIcon, TagIcon } from 'lucide-react';
import { SearchBar } from './SearchBar';
const BRANDS = [{
  id: 'casper',
  name: 'Casper',
  logo: 'https://images.unsplash.com/photo-1571566882372-1598d88abd90?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&h=100&q=80'
}, {
  id: 'purple',
  name: 'Purple',
  logo: 'https://images.unsplash.com/photo-1555424221-250de2a343ad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&h=100&q=80'
}, {
  id: 'tempurpedic',
  name: 'Tempur-Pedic',
  logo: 'https://images.unsplash.com/photo-1617469165786-8007eda3caa7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&h=100&q=80'
}, {
  id: 'brooklinen',
  name: 'Brooklinen',
  logo: 'https://images.unsplash.com/photo-1565372195458-9de0b320ef04?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&h=100&q=80'
}, {
  id: 'tuft',
  name: 'Tuft & Needle',
  logo: 'https://images.unsplash.com/photo-1506377295352-e3154d43ea9e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&h=100&q=80'
}];
const FEATURES = ['Cooling technology', 'Memory foam', 'Adjustable height', 'Hypoallergenic', 'Organic materials', 'Washable cover'];
const FIRMNESS_LEVELS = ['Soft', 'Medium-soft', 'Medium', 'Medium-firm', 'Firm'];
const PILLOWS = [{
  id: 1,
  name: 'Cloud Comfort Elite',
  brand: 'casper',
  price: 129.99,
  rating: 4.8,
  reviews: 1250,
  recommended: true,
  firmness: 'Medium',
  image: 'https://images.unsplash.com/photo-1584100936761-a8e85273b9cf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
  features: ['Cooling technology', 'Adjustable height', 'Memory foam']
}, {
  id: 2,
  name: 'Purple Harmony',
  brand: 'purple',
  price: 159.99,
  rating: 4.9,
  reviews: 890,
  recommended: true,
  firmness: 'Medium-firm',
  image: 'https://images.unsplash.com/photo-1631006387899-06240b7f6414?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
  features: ['Grid technology', 'Temperature neutral', 'No pressure points']
}, {
  id: 3,
  name: 'TEMPUR-Cloud',
  brand: 'tempurpedic',
  price: 189.99,
  rating: 4.7,
  reviews: 2100,
  recommended: false,
  firmness: 'Firm',
  image: 'https://images.unsplash.com/photo-1592789705501-f9ae4287c4cf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
  features: ['Pressure relief', 'Washable cover', 'Adaptive support']
}, {
  id: 4,
  name: 'Ergonomic Support',
  brand: 'casper',
  price: 149.99,
  rating: 4.6,
  reviews: 780,
  recommended: false,
  firmness: 'Medium-firm',
  image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
  features: ['Neck support', 'Hypoallergenic', 'Medium firmness']
}, {
  id: 5,
  name: 'Down Alternative',
  brand: 'brooklinen',
  price: 99.99,
  rating: 4.5,
  reviews: 560,
  recommended: true,
  firmness: 'Soft',
  image: 'https://images.unsplash.com/photo-1591389703635-e15a07609a0f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
  features: ['Hypoallergenic', 'Washable cover', 'Plush feel']
}, {
  id: 6,
  name: 'Organic Cotton Deluxe',
  brand: 'tuft',
  price: 119.99,
  rating: 4.4,
  reviews: 420,
  recommended: false,
  firmness: 'Medium-soft',
  image: 'https://images.unsplash.com/photo-1634643836960-c345b3c3e998?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
  features: ['Organic materials', 'Chemical-free', 'Sustainable']
}, {
  id: 7,
  name: 'Cooling Gel Pillow',
  brand: 'purple',
  price: 139.99,
  rating: 4.7,
  reviews: 890,
  recommended: false,
  firmness: 'Medium',
  image: 'https://images.unsplash.com/photo-1626988219186-2a3cba5f3b34?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
  features: ['Cooling technology', 'Gel-infused', 'Heat dissipation']
}, {
  id: 8,
  name: 'Premium Memory Foam',
  brand: 'tempurpedic',
  price: 199.99,
  rating: 4.9,
  reviews: 1500,
  recommended: true,
  firmness: 'Firm',
  image: 'https://images.unsplash.com/photo-1629949009710-f7bae3541d99?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
  features: ['Memory foam', 'Pressure relief', 'Luxury comfort']
}];
export const CatalogPage = () => {
  const [selectedBrands, setSelectedBrands] = useState(new Set());
  const [selectedFeatures, setSelectedFeatures] = useState(new Set());
  const [selectedFirmness, setSelectedFirmness] = useState(new Set());
  const [priceRange, setPriceRange] = useState({
    min: 0,
    max: 200
  });
  const [activeFilterTab, setActiveFilterTab] = useState('brands');
  const [searchQuery, setSearchQuery] = useState('');
  const toggleBrand = brandId => {
    const newSelected = new Set(selectedBrands);
    if (newSelected.has(brandId)) {
      newSelected.delete(brandId);
    } else {
      newSelected.add(brandId);
    }
    setSelectedBrands(newSelected);
  };
  const toggleFeature = feature => {
    const newSelected = new Set(selectedFeatures);
    if (newSelected.has(feature)) {
      newSelected.delete(feature);
    } else {
      newSelected.add(feature);
    }
    setSelectedFeatures(newSelected);
  };
  const toggleFirmness = firmness => {
    const newSelected = new Set(selectedFirmness);
    if (newSelected.has(firmness)) {
      newSelected.delete(firmness);
    } else {
      newSelected.add(firmness);
    }
    setSelectedFirmness(newSelected);
  };
  const handlePriceChange = (e, type) => {
    const value = parseInt(e.target.value);
    setPriceRange(prev => ({
      ...prev,
      [type]: value
    }));
  };
  const resetFilters = () => {
    setSelectedBrands(new Set());
    setSelectedFeatures(new Set());
    setSelectedFirmness(new Set());
    setPriceRange({
      min: 0,
      max: 200
    });
    setSearchQuery('');
  };
  const filteredPillows = PILLOWS.filter(pillow => {
    // Brand filter
    const matchesBrand = selectedBrands.size === 0 || selectedBrands.has(pillow.brand);
    // Features filter
    const matchesFeatures = selectedFeatures.size === 0 || [...selectedFeatures].every(feature => pillow.features.some(f => f.toLowerCase().includes(feature.toLowerCase())));
    // Firmness filter
    const matchesFirmness = selectedFirmness.size === 0 || selectedFirmness.has(pillow.firmness);
    // Price range filter
    const matchesPrice = pillow.price >= priceRange.min && pillow.price <= priceRange.max;
    // Search query
    const matchesSearch = searchQuery === '' || pillow.name.toLowerCase().includes(searchQuery.toLowerCase()) || pillow.features.some(f => f.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesBrand && matchesFeatures && matchesFirmness && matchesPrice && matchesSearch;
  });
  const recommendedPillows = PILLOWS.filter(pillow => pillow.recommended);
  const activeFiltersCount = selectedBrands.size + selectedFeatures.size + selectedFirmness.size + (priceRange.min > 0 || priceRange.max < 200 ? 1 : 0);
  return <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-medium text-gray-900">
              Our Collection
            </h1>
            <p className="mt-2 text-gray-500 text-lg font-light">
              Discover our curated selection of premium pillows
            </p>
          </div>
        </div>
        {/* Search Bar */}
        <SearchBar onSearch={setSearchQuery} value={searchQuery} />
      </div>

      {/* Filters - Now always visible at the top */}
      <div className="backdrop-blur-xl bg-white/70 rounded-2xl p-6 shadow-lg shadow-gray-200/50">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium text-gray-900">Filters</h2>
          {activeFiltersCount > 0 && <button onClick={resetFilters} className="flex items-center text-sm text-blue-500 hover:text-blue-700">
              <XIcon className="h-4 w-4 mr-1" />
              Clear all filters
            </button>}
        </div>
        {/* Filter Tabs */}
        <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
          <button onClick={() => setActiveFilterTab('brands')} className={`px-4 py-2 rounded-xl text-sm font-medium ${activeFilterTab === 'brands' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
            Brands {selectedBrands.size > 0 && `(${selectedBrands.size})`}
          </button>
          <button onClick={() => setActiveFilterTab('features')} className={`px-4 py-2 rounded-xl text-sm font-medium ${activeFilterTab === 'features' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
            Features {selectedFeatures.size > 0 && `(${selectedFeatures.size})`}
          </button>
          <button onClick={() => setActiveFilterTab('firmness')} className={`px-4 py-2 rounded-xl text-sm font-medium ${activeFilterTab === 'firmness' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
            Firmness {selectedFirmness.size > 0 && `(${selectedFirmness.size})`}
          </button>
          <button onClick={() => setActiveFilterTab('price')} className={`px-4 py-2 rounded-xl text-sm font-medium ${activeFilterTab === 'price' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
            Price Range
          </button>
        </div>
        {/* Filter Content */}
        <div className="transition-all duration-300">
          {activeFilterTab === 'brands' && <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {BRANDS.map(brand => <button key={brand.id} onClick={() => toggleBrand(brand.id)} className={`flex items-center space-x-3 p-3 rounded-xl transition-all ${selectedBrands.has(brand.id) ? 'bg-blue-500 text-white' : 'bg-gray-50/50 hover:bg-gray-100/50'}`}>
                  <img src={brand.logo} alt={brand.name} className="w-8 h-8 rounded-full object-cover" />
                  <span className="flex-1 text-sm font-medium">
                    {brand.name}
                  </span>
                  {selectedBrands.has(brand.id) && <CheckIcon className="h-5 w-5" />}
                </button>)}
            </div>}
          {activeFilterTab === 'features' && <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {FEATURES.map(feature => <button key={feature} onClick={() => toggleFeature(feature)} className={`flex items-center space-x-3 p-3 rounded-xl transition-all ${selectedFeatures.has(feature) ? 'bg-blue-500 text-white' : 'bg-gray-50/50 hover:bg-gray-100/50'}`}>
                  <TagIcon className="h-5 w-5" />
                  <span className="flex-1 text-sm font-medium">{feature}</span>
                  {selectedFeatures.has(feature) && <CheckIcon className="h-5 w-5" />}
                </button>)}
            </div>}
          {activeFilterTab === 'firmness' && <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {FIRMNESS_LEVELS.map(firmness => <button key={firmness} onClick={() => toggleFirmness(firmness)} className={`flex items-center space-x-3 p-3 rounded-xl transition-all ${selectedFirmness.has(firmness) ? 'bg-blue-500 text-white' : 'bg-gray-50/50 hover:bg-gray-100/50'}`}>
                  <span className="flex-1 text-sm font-medium">{firmness}</span>
                  {selectedFirmness.has(firmness) && <CheckIcon className="h-5 w-5" />}
                </button>)}
            </div>}
          {activeFilterTab === 'price' && <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">${priceRange.min}</span>
                <span className="text-sm text-gray-600">${priceRange.max}</span>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Min Price
                  </label>
                  <input type="range" min="0" max="200" step="10" value={priceRange.min} onChange={e => handlePriceChange(e, 'min')} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Price
                  </label>
                  <input type="range" min="0" max="200" step="10" value={priceRange.max} onChange={e => handlePriceChange(e, 'max')} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                </div>
              </div>
            </div>}
        </div>
      </div>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && <div className="flex flex-wrap gap-2">
          {[...selectedBrands].map(brandId => <div key={brandId} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center">
              {BRANDS.find(b => b.id === brandId)?.name}
              <button onClick={() => toggleBrand(brandId)} className="ml-1">
                <XIcon className="h-4 w-4" />
              </button>
            </div>)}
          {[...selectedFeatures].map(feature => <div key={feature} className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm flex items-center">
              {feature}
              <button onClick={() => toggleFeature(feature)} className="ml-1">
                <XIcon className="h-4 w-4" />
              </button>
            </div>)}
          {[...selectedFirmness].map(firmness => <div key={firmness} className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm flex items-center">
              {firmness}
              <button onClick={() => toggleFirmness(firmness)} className="ml-1">
                <XIcon className="h-4 w-4" />
              </button>
            </div>)}
          {(priceRange.min > 0 || priceRange.max < 200) && <div className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm flex items-center">
              ${priceRange.min} - ${priceRange.max}
              <button onClick={() => setPriceRange({
          min: 0,
          max: 200
        })} className="ml-1">
                <XIcon className="h-4 w-4" />
              </button>
            </div>}
        </div>}

      {/* Recommended By Us Section */}
      {recommendedPillows.length > 0 && <div className="backdrop-blur-xl bg-gradient-to-r from-blue-50/70 to-purple-50/70 rounded-2xl p-6 shadow-lg shadow-blue-200/30 border border-blue-100/30">
          <div className="flex items-center mb-5">
            <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white shadow-md shadow-blue-300/30 mr-3">
              <StarIcon className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Recommended By Us
            </h2>
          </div>
          <p className="text-gray-600 mb-6">
            Handpicked by our sleep experts for exceptional comfort and quality
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendedPillows.map(pillow => <ProductCard key={pillow.id} product={pillow} />)}
          </div>
        </div>}

      {/* All Products Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-medium text-gray-900">All Products</h2>
          <p className="text-sm text-gray-500">
            {filteredPillows.length} products
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPillows.map(pillow => <ProductCard key={pillow.id} product={pillow} />)}
        </div>
        {filteredPillows.length === 0 && <div className="text-center py-12">
            <p className="text-gray-500 text-lg font-light">
              No pillows found matching your criteria
            </p>
            <button onClick={resetFilters} className="mt-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-xl text-sm font-medium hover:bg-blue-200 transition-colors">
              Reset Filters
            </button>
          </div>}
      </div>
    </div>;
};