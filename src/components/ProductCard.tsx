import React from 'react';
import { StarIcon, ShoppingCartIcon, BedIcon } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { Link } from 'react-router-dom';
export const ProductCard = ({
  product
}) => {
  const {
    addItem
  } = useCart();
  const brand = {
    casper: 'Casper',
    purple: 'Purple',
    tempurpedic: 'Tempur-Pedic',
    brooklinen: 'Brooklinen',
    tuft: 'Tuft & Needle'
  }[product.brand] || product.brand;
  const handleAddToCart = e => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    // Show a toast notification
    alert(`${product.name} added to cart!`);
  };
  return <div className="backdrop-blur-xl bg-white/70 rounded-2xl shadow-lg shadow-gray-200/50 overflow-hidden">
      <Link to={`/product?id=${product.id}`} className="block">
        <div className="aspect-w-16 aspect-h-9 relative">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          {product.recommended && <div className="absolute top-3 right-3">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-medium py-1 px-3 rounded-full shadow-md">
                Recommended
              </div>
            </div>}
        </div>
      </Link>
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm font-medium text-blue-500">{brand}</p>
            <Link to={`/product?id=${product.id}`} className="block">
              <h3 className="text-xl font-medium text-gray-900 mt-1 hover:text-blue-600 transition-colors">
                {product.name}
              </h3>
            </Link>
          </div>
          <div className="flex items-center space-x-1">
            <StarIcon className="h-5 w-5 text-yellow-400 fill-current" />
            <span className="text-sm font-medium text-gray-900">
              {product.rating}
            </span>
            <span className="text-sm text-gray-500">({product.reviews})</span>
          </div>
        </div>
        <div className="space-y-4">
          <ul className="space-y-2">
            {product.features.slice(0, 3).map((feature, index) => <li key={index} className="text-sm text-gray-600 font-light">
                • {feature}
              </li>)}
          </ul>
          {/* Sleep Position Tags */}
          {product.sleepPositions && product.sleepPositions.length > 0 && <div className="flex flex-wrap gap-2 pt-2">
              {product.sleepPositions.map(position => <div key={position} className="flex items-center bg-blue-50 text-blue-600 text-xs font-medium py-1 px-2 rounded-lg">
                  <BedIcon className="h-3 w-3 mr-1" />
                  {position.charAt(0).toUpperCase() + position.slice(1)} Sleeper
                </div>)}
            </div>}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="text-gray-900">
              <span className="text-2xl font-medium">${product.price}</span>
            </div>
            <button onClick={handleAddToCart} className="flex items-center space-x-2 px-4 py-2 rounded-xl text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all">
              <ShoppingCartIcon className="h-5 w-5" />
              <span className="text-sm font-medium">Add to Cart</span>
            </button>
          </div>
        </div>
      </div>
    </div>;
};