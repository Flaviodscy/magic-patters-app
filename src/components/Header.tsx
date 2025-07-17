import React from 'react';
import { MenuIcon, ShoppingCartIcon } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { Link, useNavigate } from 'react-router-dom';
export const Header = ({
  currentPage,
  onNavigate,
  onOpenMenu
}) => {
  const {
    totalItems
  } = useCart();
  const navigate = useNavigate();
  return <header className="w-full backdrop-blur-xl bg-white/70 sticky top-0 z-50 border-b border-gray-200/50">
      <div className="max-w-4xl mx-auto px-4">
        <div className="py-6 flex items-center justify-between">
          <Link to="/" onClick={() => onNavigate('welcome')} className="flex items-center hover:opacity-80 transition-opacity">
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
              P
            </div>
            <h1 className="ml-3 text-2xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Perfect<span className="font-light">Pillow</span>
            </h1>
          </Link>
          <div className="flex items-center">
            <Link to="/cart" onClick={() => onNavigate('cart')} className="p-2 mr-2 text-gray-500 hover:text-gray-900 transition-colors rounded-xl hover:bg-gray-100/50 relative">
              <ShoppingCartIcon className="h-6 w-6" />
              {totalItems > 0 && <span className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-red-500 text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>}
            </Link>
            <button onClick={onOpenMenu} className="p-2 text-gray-500 hover:text-gray-900 transition-colors rounded-xl hover:bg-gray-100/50">
              <MenuIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </header>;
};