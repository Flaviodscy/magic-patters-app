import React from 'react';
import { HomeIcon, ShoppingBagIcon, RulerIcon, UserIcon, ShoppingCartIcon, MessageCircleIcon } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { Link, useLocation } from 'react-router-dom';
export const BottomDock = ({
  currentPage,
  onNavigate
}) => {
  const {
    totalItems
  } = useCart();
  const location = useLocation();
  const pathname = location.pathname;
  const tabs = [{
    id: 'welcome',
    path: '/',
    label: 'Home',
    icon: HomeIcon,
    gradient: 'from-blue-500 to-indigo-500'
  }, {
    id: 'measurement',
    path: '/measurement',
    label: 'Measure',
    icon: RulerIcon,
    gradient: 'from-indigo-500 to-purple-500'
  }, {
    id: 'catalog',
    path: '/catalog',
    label: 'Shop',
    icon: ShoppingBagIcon,
    gradient: 'from-purple-500 to-pink-500'
  }, {
    id: 'chat',
    path: '/chat',
    label: 'Support',
    icon: MessageCircleIcon,
    gradient: 'from-pink-500 to-red-500'
  }, {
    id: 'profile',
    path: '/profile',
    label: 'Profile',
    icon: UserIcon,
    gradient: 'from-red-500 to-orange-500'
  }];
  return <div className="fixed bottom-0 left-0 right-0 backdrop-blur-xl bg-white/70 border-t border-gray-200/50 z-40 pb-6">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-around py-2">
          {tabs.map(({
          id,
          path,
          label,
          icon: Icon,
          gradient
        }) => {
          const isActive = id === 'welcome' ? pathname === '/' : pathname.includes(id);
          return <Link key={id} to={path} onClick={() => {
            // Also update the current page state for components that use it
            onNavigate(id);
          }} className="flex flex-col items-center px-3 py-2 relative">
                <div className={`p-1.5 rounded-full transition-colors ${isActive ? `bg-gradient-to-r ${gradient} text-white shadow-md` : 'text-gray-500 bg-transparent'}`}>
                  <Icon className="h-6 w-6" />
                  {id === 'profile' && <span className="absolute -top-1 -right-1 bg-gradient-to-r from-green-400 to-emerald-400 text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
                      3
                    </span>}
                  {id === 'cart' && totalItems > 0 && <span className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-red-500 text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
                      {totalItems}
                    </span>}
                </div>
                <span className={`text-xs mt-1 font-medium ${isActive ? 'text-transparent bg-clip-text bg-gradient-to-r ' + gradient : 'text-gray-500'}`}>
                  {label}
                </span>
              </Link>;
        })}
        </div>
      </div>
    </div>;
};