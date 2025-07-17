import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCartIcon, MinusIcon, PlusIcon, TrashIcon, ArrowRightIcon, ShoppingBagIcon } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
export const CartPage = () => {
  const {
    items,
    removeItem,
    updateQuantity,
    subtotal,
    totalItems
  } = useCart();
  if (items.length === 0) {
    return <div className="flex flex-col items-center justify-center py-16 space-y-6 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
          <ShoppingBagIcon className="h-10 w-10 text-gray-400" />
        </div>
        <div>
          <h2 className="text-2xl font-medium text-gray-900">
            Your cart is empty
          </h2>
          <p className="mt-2 text-gray-500">
            Looks like you haven't added any pillows yet.
          </p>
        </div>
        <button onClick={() => window.history.back()} className="flex items-center px-6 py-3 rounded-xl text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all">
          <ShoppingBagIcon className="h-5 w-5 mr-2" />
          <span className="font-medium">Continue Shopping</span>
        </button>
      </div>;
  }
  return <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-medium text-gray-900">Your Cart</h1>
        <p className="text-gray-500">
          {totalItems} {totalItems === 1 ? 'item' : 'items'}
        </p>
      </div>
      <div className="space-y-4">
        {items.map(item => <div key={item.id} className="backdrop-blur-xl bg-white/70 rounded-2xl p-4 shadow-lg shadow-gray-200/50 flex items-center">
            <img src={item.image} alt={item.name} className="h-20 w-20 rounded-xl object-cover" />
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-blue-500">{item.brand}</p>
              <h3 className="font-medium text-gray-900">{item.name}</h3>
              <p className="text-gray-900 font-medium mt-1">
                ${item.price.toFixed(2)}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors">
                <MinusIcon className="h-4 w-4" />
              </button>
              <span className="w-8 text-center font-medium">
                {item.quantity}
              </span>
              <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors">
                <PlusIcon className="h-4 w-4" />
              </button>
            </div>
            <button onClick={() => removeItem(item.id)} className="ml-4 p-2 text-gray-400 hover:text-red-500 transition-colors">
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>)}
      </div>
      <div className="backdrop-blur-xl bg-white/70 rounded-2xl p-6 shadow-lg shadow-gray-200/50">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Subtotal</span>
            <span className="font-medium">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Shipping</span>
            <span className="font-medium">Free</span>
          </div>
          <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
            <span className="font-medium text-lg">Total</span>
            <span className="font-medium text-lg">${subtotal.toFixed(2)}</span>
          </div>
        </div>
        <button className="w-full mt-6 flex items-center justify-center p-4 rounded-xl text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all">
          <ShoppingCartIcon className="h-5 w-5 mr-2" />
          <span className="font-medium">Proceed to Checkout</span>
        </button>
      </div>
    </div>;
};