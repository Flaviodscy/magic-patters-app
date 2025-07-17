import React, { useEffect, useState } from 'react';
import { XIcon, DownloadIcon } from 'lucide-react';
export const PWAInstallPrompt = () => {
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  useEffect(() => {
    // Check if the app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }
    // Listen for the beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', e => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      // Show the install prompt after a delay
      setTimeout(() => setShowInstallPrompt(true), 3000);
    });
    // Listen for app installed event
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowInstallPrompt(false);
    });
    return () => {
      window.removeEventListener('beforeinstallprompt', () => {});
      window.removeEventListener('appinstalled', () => {});
    };
  }, []);
  const handleInstallClick = () => {
    if (!deferredPrompt) return;
    // Show the install prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then(choiceResult => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      // Clear the saved prompt as it can't be used again
      setDeferredPrompt(null);
    });
    // Hide our custom install prompt
    setShowInstallPrompt(false);
  };
  if (!showInstallPrompt || isInstalled) return null;
  return <div className="fixed bottom-20 left-0 right-0 z-50 flex justify-center px-4">
      <div className="bg-blue-50 border border-blue-200 rounded-xl shadow-lg p-4 flex items-center max-w-md">
        <DownloadIcon className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm text-blue-700 font-medium">
            Install PerfectPillow App
          </p>
          <p className="text-xs text-blue-500">
            Add to your home screen for a better experience
          </p>
        </div>
        <div className="flex space-x-2">
          <button onClick={handleInstallClick} className="px-3 py-1.5 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors">
            Install
          </button>
          <button onClick={() => setShowInstallPrompt(false)} className="p-1.5 text-blue-500 hover:text-blue-700 transition-colors">
            <XIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>;
};