import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserIcon, KeyIcon, ArrowRightIcon } from 'lucide-react';
export const LoginPage = ({
  onLogin
}) => {
  const [isLogin, setIsLogin] = useState(true);
  return <div className="max-w-md mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-medium text-gray-900">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h1>
        <p className="mt-2 text-gray-500 text-lg font-light">
          {isLogin ? 'Sign in to access your profile' : 'Join to save your measurements'}
        </p>
      </div>
      <div className="backdrop-blur-xl bg-white/70 rounded-3xl shadow-lg shadow-gray-200/50">
        <div className="p-8">
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <input type="email" className="w-full pl-10 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" placeholder="you@example.com" />
                <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input type="password" className="w-full pl-10 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" placeholder="••••••••" />
                <KeyIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>
            {!isLogin && <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input type="password" className="w-full pl-10 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" placeholder="••••••••" />
                  <KeyIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>}
            <button type="submit" className="w-full flex items-center justify-center p-4 rounded-xl text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all">
              <span className="text-lg font-medium">
                {isLogin ? 'Sign In' : 'Create Account'}
              </span>
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </button>
          </form>
          <div className="mt-6 text-center">
            <button onClick={() => setIsLogin(!isLogin)} className="text-sm text-blue-500 hover:text-blue-600 transition-colors">
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>;
};