import React, { useState } from 'react';
import { DatabaseIcon, CheckIcon, XIcon, AlertTriangleIcon, LoaderIcon } from 'lucide-react';
import { DatabaseService } from '../services/DatabaseService';
export const DatabaseInitializer = ({
  onClose
}) => {
  const [isInitializing, setIsInitializing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const handleInitialize = async () => {
    setIsInitializing(true);
    setError(null);
    try {
      const initResult = await DatabaseService.initializeDatabase();
      setResult(initResult);
      if (initResult.success) {
        // Wait a moment before closing to show success message
        setTimeout(() => {
          onClose();
        }, 2000);
      }
    } catch (err) {
      console.error('Error initializing database:', err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsInitializing(false);
    }
  };
  return <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl max-w-md w-full p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <XIcon className="h-5 w-5" />
        </button>
        <div className="text-center mb-6">
          <div className="h-16 w-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <DatabaseIcon className="h-8 w-8 text-amber-500" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Database Setup
          </h2>
          <p className="text-gray-600">
            This will create the necessary tables in your Supabase database for
            the app to function correctly.
          </p>
        </div>
        {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 flex items-start">
            <AlertTriangleIcon className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-sm">{error}</p>
          </div>}
        {result && <div className={`mb-6 p-4 ${result.success ? 'bg-green-50 border-green-200 text-green-600' : 'bg-red-50 border-red-200 text-red-600'} border rounded-xl flex items-start`}>
            {result.success ? <CheckIcon className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" /> : <AlertTriangleIcon className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />}
            <p className="text-sm">{result.message}</p>
          </div>}
        <div className="flex space-x-3">
          <button onClick={handleInitialize} disabled={isInitializing || result && result.success} className={`flex-1 flex items-center justify-center p-3 rounded-xl ${isInitializing || result && result.success ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-amber-500 text-white hover:bg-amber-600'} transition-colors`}>
            {isInitializing ? <>
                <LoaderIcon className="h-5 w-5 mr-2 animate-spin" />
                <span>Initializing...</span>
              </> : result && result.success ? <>
                <CheckIcon className="h-5 w-5 mr-2" />
                <span>Completed</span>
              </> : <>
                <DatabaseIcon className="h-5 w-5 mr-2" />
                <span>Initialize Database</span>
              </>}
          </button>
          <button onClick={onClose} className="p-3 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
            Cancel
          </button>
        </div>
      </div>
    </div>;
};