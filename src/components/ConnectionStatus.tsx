import React, { useEffect, useState } from 'react';
import { WifiOffIcon, RefreshCwIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
export const ConnectionStatus = () => {
  const {
    isOffline,
    connectionError,
    checkConnection
  } = useAuth();
  const [isChecking, setIsChecking] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  useEffect(() => {
    if (isOffline || connectionError) {
      setShowBanner(true);
    } else {
      // Hide after 3 seconds if connection is restored
      const timer = setTimeout(() => {
        setShowBanner(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOffline, connectionError]);
  const handleRetry = async () => {
    setIsChecking(true);
    await checkConnection();
    setIsChecking(false);
  };
  if (!showBanner) return null;
  return <div className="fixed bottom-20 left-0 right-0 z-50 flex justify-center px-4">
      <div className="bg-red-50 border border-red-200 rounded-xl shadow-lg p-3 flex items-center max-w-md">
        <WifiOffIcon className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm text-red-600 font-medium">
            {connectionError || 'Connection error'}
          </p>
          <p className="text-xs text-red-500">
            Some features may be unavailable
          </p>
        </div>
        <button onClick={handleRetry} disabled={isChecking} className="ml-2 p-2 bg-white rounded-lg text-red-500 hover:bg-red-100 transition-colors">
          <RefreshCwIcon className={`h-4 w-4 ${isChecking ? 'animate-spin' : ''}`} />
        </button>
      </div>
    </div>;
};