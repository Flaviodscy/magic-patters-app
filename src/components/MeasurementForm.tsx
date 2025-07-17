import React, { useState } from 'react';
import { RulerIcon, BedIcon, ArrowRightIcon, ScanLineIcon, PlayIcon, UserIcon, LogInIcon, XIcon } from 'lucide-react';
import { Scanner } from './Scanner';
import { useAuth } from '../contexts/AuthContext';
import { MeasurementService } from '../services/MeasurementService';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
export const MeasurementForm = ({
  onSubmit
}) => {
  const [neckLength, setNeckLength] = useState('');
  const [neckWidth, setNeckWidth] = useState('');
  const [sleepPosition, setSleepPosition] = useState('back');
  const [isScanning, setIsScanning] = useState(false);
  const [measurementMethod, setMeasurementMethod] = useState('manual');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [measurementData, setMeasurementData] = useState(null);
  const {
    currentUser
  } = useAuth();
  const navigate = useNavigate();
  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const data = {
        neckLength: parseFloat(neckLength),
        neckWidth: parseFloat(neckWidth),
        sleepPosition
      };
      setMeasurementData(data);
      // If user is logged in, save measurement to Supabase
      if (currentUser) {
        await MeasurementService.saveMeasurement(currentUser.uid || currentUser.id, data);
        // The saveMeasurement method now handles updating all metrics
        // Continue with the local state update for immediate feedback
        onSubmit(data);
      } else {
        // Show login prompt if user is not logged in
        setShowLoginPrompt(true);
      }
    } catch (error) {
      console.error('Error saving measurement:', error);
      setError('Failed to save your measurement. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleScanComplete = async measurements => {
    setNeckLength(measurements.neckLength);
    setNeckWidth(measurements.neckWidth);
    setIsScanning(false);
    // If user is logged in, save the scan results automatically
    if (currentUser) {
      try {
        const measurementData = {
          neckLength: parseFloat(measurements.neckLength),
          neckWidth: parseFloat(measurements.neckWidth),
          sleepPosition
        };
        await MeasurementService.saveMeasurement(currentUser.uid || currentUser.id, measurementData);
        // The saveMeasurement method now handles updating all metrics
      } catch (error) {
        console.error('Error saving scan measurement:', error);
      }
    }
  };
  // Simple score calculation - should match the one in MeasurementService
  const calculateScore = data => {
    let score = 70;
    if (data.neckLength >= 4 && data.neckLength <= 6) score += 10;else score -= 5;
    if (data.neckWidth >= 6 && data.neckWidth <= 8) score += 10;else score -= 5;
    if (data.sleepPosition === 'back') score += 5;else if (data.sleepPosition === 'side') score += 3;
    return Math.max(0, Math.min(100, score));
  };
  const handleContinueAsGuest = () => {
    setShowLoginPrompt(false);
    // Continue with the flow without saving to an account
    onSubmit(measurementData);
  };
  const handleNavigateToLogin = () => {
    // Save measurement data in localStorage to retrieve after login
    localStorage.setItem('pendingMeasurement', JSON.stringify(measurementData));
    navigate('/login');
  };
  return <>
      <div className="backdrop-blur-xl bg-white/70 rounded-3xl shadow-lg shadow-gray-200/50">
        <div className="p-8 sm:p-10">
          <h2 className="text-3xl font-medium text-gray-900 mb-2">
            Find Your Perfect Pillow
          </h2>
          <p className="text-gray-500 text-lg font-light mb-10">
            Discover the ideal pillow based on your measurements.
          </p>
          {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600">
              {error}
            </div>}
          {/* Measurement Method Toggle */}
          <div className="flex p-1 bg-gray-100/70 rounded-2xl mb-10">
            {[{
            id: 'manual',
            label: 'Manual Measurement',
            icon: RulerIcon
          }, {
            id: 'scan',
            label: 'LiDAR Scan',
            icon: ScanLineIcon
          }].map(({
            id,
            label,
            icon: Icon
          }) => <button key={id} onClick={() => {
            setMeasurementMethod(id);
            if (id === 'scan') setIsScanning(true);
          }} className={`flex-1 flex items-center justify-center py-3 px-4 rounded-xl text-sm font-medium transition-all ${measurementMethod === id ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}>
                <Icon className="h-5 w-5 mr-2" />
                {label}
              </button>)}
          </div>
          {/* Login prompt for guest users */}
          {!currentUser && <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-xl">
              <p className="text-blue-700 mb-2">
                Sign in to save your measurements and get personalized
                recommendations over time.
              </p>
              <button onClick={() => navigate('/login')} className="text-blue-500 font-medium hover:text-blue-700">
                Sign in now
              </button>
            </div>}
          {measurementMethod === 'manual' && <>
              <div className="backdrop-blur-md bg-blue-50/50 rounded-2xl p-6 mb-10">
                <h3 className="font-medium text-gray-900 mb-4 flex items-center text-lg">
                  <RulerIcon className="h-5 w-5 mr-2" />
                  How to Measure
                </h3>
                {/* Video Demonstration */}
                <div className="mb-6 relative rounded-xl overflow-hidden bg-black/5">
                  <video className="w-full rounded-xl" poster="https://images.unsplash.com/photo-1606646079260-51f5f593d760?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" controls playsInline onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)}>
                    <source src="https://assets.mixkit.co/videos/preview/mixkit-set-of-plateaus-seen-from-the-heights-in-a-sunset-32809-large.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  {!isPlaying && <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg">
                        <PlayIcon className="h-8 w-8 text-blue-500" />
                      </div>
                      <div className="absolute bottom-4 left-4 right-4 text-center">
                        <p className="text-sm font-medium text-white bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2">
                          Watch measurement demonstration
                        </p>
                      </div>
                    </div>}
                </div>
                <div className="space-y-3 text-gray-600">
                  <p className="font-light">
                    1. Use a soft measuring tape for accuracy
                  </p>
                  <p className="font-light">
                    2. Measure from neck base to ear while sitting
                  </p>
                  <p className="font-light">
                    3. Measure shoulder to shoulder across back
                  </p>
                </div>
              </div>
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-6">
                  <div>
                    <label htmlFor="neckLength" className="block text-sm font-medium text-gray-700 mb-2">
                      Neck Length (inches)
                    </label>
                    <input type="number" id="neckLength" step="0.1" min="2" max="10" required value={neckLength} onChange={e => setNeckLength(e.target.value)} className="w-full p-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
                  </div>
                  <div>
                    <label htmlFor="neckWidth" className="block text-sm font-medium text-gray-700 mb-2">
                      Neck Width (inches)
                    </label>
                    <input type="number" id="neckWidth" step="0.1" min="2" max="20" required value={neckWidth} onChange={e => setNeckWidth(e.target.value)} className="w-full p-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Sleep Position
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {['back', 'side', 'stomach'].map(position => <label key={position} className={`relative flex flex-col items-center p-4 rounded-2xl cursor-pointer transition-all
                          ${sleepPosition === position ? 'bg-blue-500 text-white shadow-lg shadow-blue-200' : 'bg-gray-50/50 text-gray-600 hover:bg-gray-100/50'}`}>
                        <input type="radio" name="sleepPosition" value={position} checked={sleepPosition === position} onChange={() => setSleepPosition(position)} className="sr-only" />
                        <BedIcon className="h-6 w-6 mb-1" />
                        <span className="text-sm font-medium capitalize">
                          {position}
                        </span>
                      </label>)}
                  </div>
                </div>
                <button type="submit" disabled={isSubmitting} className={`w-full mt-8 flex items-center justify-center p-4 rounded-2xl text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}>
                  <span className="text-lg font-medium">
                    {isSubmitting ? 'Processing...' : 'Get Recommendation'}
                  </span>
                  {!isSubmitting && <ArrowRightIcon className="ml-2 h-5 w-5" />}
                </button>
              </form>
            </>}
        </div>
      </div>
      {/* Login Prompt Modal */}
      <AnimatePresence>
        {showLoginPrompt && <>
            <motion.div initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} exit={{
          opacity: 0
        }} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={() => setShowLoginPrompt(false)} />
            <motion.div initial={{
          opacity: 0,
          scale: 0.9,
          y: 20
        }} animate={{
          opacity: 1,
          scale: 1,
          y: 0
        }} exit={{
          opacity: 0,
          scale: 0.9,
          y: 20
        }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-w-md w-full p-6 bg-white rounded-3xl shadow-2xl z-50">
              <div className="flex justify-end">
                <button onClick={() => setShowLoginPrompt(false)} className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <XIcon className="h-5 w-5" />
                </button>
              </div>
              <div className="text-center mb-6">
                <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserIcon className="h-8 w-8 text-blue-500" />
                </div>
                <h3 className="text-2xl font-medium text-gray-900 mb-2">
                  Save Your Measurements
                </h3>
                <p className="text-gray-500">
                  Create an account to save your measurements and get
                  personalized recommendations over time.
                </p>
              </div>
              <div className="space-y-4">
                <button onClick={handleNavigateToLogin} className="w-full flex items-center justify-center p-4 rounded-xl text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all shadow-md">
                  <LogInIcon className="h-5 w-5 mr-2" />
                  <span className="font-medium">Sign In or Create Account</span>
                </button>
                <button onClick={handleContinueAsGuest} className="w-full flex items-center justify-center p-4 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all">
                  <span className="font-medium">Continue as Guest</span>
                </button>
              </div>
              <div className="mt-6 text-center text-sm text-gray-500">
                <p>
                  Signing up allows you to track your sleep progress and get
                  better recommendations over time.
                </p>
              </div>
            </motion.div>
          </>}
      </AnimatePresence>
      {/* Scanner Modal */}
      {isScanning && <Scanner onComplete={handleScanComplete} onCancel={() => {
      setIsScanning(false);
      setMeasurementMethod('manual');
    }} />}
    </>;
};