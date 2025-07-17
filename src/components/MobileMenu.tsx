import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon, UserIcon, LogInIcon, ShieldIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
export const MobileMenu = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  const menuItems = [{
    id: 'welcome',
    path: '/',
    label: 'Home'
  }, {
    id: 'measurement',
    path: '/measurement',
    label: 'Get Measured'
  }, {
    id: 'catalog',
    path: '/catalog',
    label: 'Shop'
  }, {
    id: 'login',
    path: '/login',
    label: 'Sign In',
    icon: LogInIcon
  }, {
    id: 'profile',
    path: '/profile',
    label: 'Profile',
    icon: UserIcon
  }, {
    id: 'admin',
    path: '/admin',
    label: 'Admin Panel',
    icon: ShieldIcon
  }];
  return <AnimatePresence>
      {isOpen && <>
          {/* Backdrop */}
          <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} onClick={onClose} className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" />
          {/* Menu Panel */}
          <motion.div initial={{
        x: '100%'
      }} animate={{
        x: 0
      }} exit={{
        x: '100%'
      }} transition={{
        type: 'spring',
        damping: 25,
        stiffness: 200
      }} className="fixed right-0 top-0 bottom-0 w-64 bg-white/80 backdrop-blur-xl z-50 shadow-xl">
            <div className="p-4 flex justify-end">
              <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-900 transition-colors">
                <XIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="px-4 py-2">
              {menuItems.map(item => <Link key={item.id} to={item.path} onClick={() => {
            onNavigate(item.id);
            onClose();
          }} className="w-full text-left px-4 py-3 text-gray-900 font-medium rounded-xl hover:bg-gray-100/50 transition-colors flex items-center block">
                  {item.icon && <item.icon className="h-5 w-5 mr-3 text-gray-500" />}
                  {item.label}
                </Link>)}
            </div>
          </motion.div>
        </>}
    </AnimatePresence>;
};