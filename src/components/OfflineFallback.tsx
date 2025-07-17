import React, { useEffect, useState } from 'react';
import { WifiOffIcon, RefreshCwIcon, DatabaseIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { DatabaseInitializer } from './DatabaseInitializer';
import { DatabaseService } from '../services/DatabaseService';
export const OfflineFallback = ({
  children
}) => {
  const {
    isOffline,
    connectionError,
    checkConnection
  } = useAuth();
  const [isChecking, setIsChecking] = useState(false);
  const [showDatabaseInitializer, setShowDatabaseInitializer] = useState(false);
  const [isDatabaseError, setIsDatabaseError] = useState(false);
  useEffect(() => {
    // Check if the error is related to missing database tables
    if (connectionError && (connectionError.includes('relation "public.profiles" does not exist') || connectionError.includes('relation "profiles" does not exist'))) {
      setIsDatabaseError(true);
    } else {
      setIsDatabaseError(false);
    }
  }, [connectionError]);
  const handleRetry = async () => {
    setIsChecking(true);
    await checkConnection();
    setIsChecking(false);
  };
  const handleInitializeDatabase = () => {
    setShowDatabaseInitializer(true);
  };
  const handleDatabaseInitializerClose = async () => {
    setShowDatabaseInitializer(false);
    // Recheck connection after database initialization
    await checkConnection();
  };
  if (!isOffline && !connectionError) return children;
  return <>
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6">
        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="mb-6">
            <div className={`${isDatabaseError ? 'bg-amber-100' : 'bg-red-100'} rounded-full p-4 inline-block mx-auto`}>
              {isDatabaseError ? <DatabaseIcon className="h-8 w-8 text-amber-500" /> : <WifiOffIcon className="h-8 w-8 text-red-500" />}
            </div>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            {isDatabaseError ? 'Database Setup Required' : 'Connection Error'}
          </h2>
          <p className="text-gray-600 mb-6">
            {isDatabaseError ? 'Your database tables need to be set up. This is a one-time process to prepare your Supabase database.' : connectionError || "We're having trouble connecting to our servers. This could be due to network issues or server maintenance."}
          </p>
          <div className="space-y-3">
            {isDatabaseError ? <button onClick={handleInitializeDatabase} className="w-full flex items-center justify-center p-3 rounded-xl bg-amber-500 text-white hover:bg-amber-600 transition-colors">
                <DatabaseIcon className="h-5 w-5 mr-2" />
                <span>Set Up Database</span>
              </button> : <button onClick={handleRetry} disabled={isChecking} className="w-full flex items-center justify-center p-3 rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition-colors">
                <RefreshCwIcon className={`h-5 w-5 mr-2 ${isChecking ? 'animate-spin' : ''}`} />
                <span>Try Again</span>
              </button>}
            <button onClick={() => window.location.reload()} className="w-full flex items-center justify-center p-3 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
              Refresh Page
            </button>
          </div>
        </div>
      </div>
      {showDatabaseInitializer && <DatabaseInitializer onClose={handleDatabaseInitializerClose} />}
    </>;
};