import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { UserIcon, MailIcon, PhoneIcon, MapPinIcon, MoonIcon, SunIcon, SaveIcon, ArrowRightIcon, CheckIcon, ChevronRightIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { UserService } from '../services/UserService';
import { useNavigate } from 'react-router-dom';
export const ProfileSetupPage = () => {
  const {
    currentUser
  } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  // Form data state
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    sleepPosition: 'back',
    sleepTime: '10:30 PM',
    wakeTime: '06:30 AM',
    location: '',
    notifications: true
  });
  // Initialize form with user data if available
  useEffect(() => {
    if (currentUser) {
      setUserData(prev => ({
        ...prev,
        name: currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || '',
        email: currentUser.email || ''
      }));
    } else {
      // Redirect to login if not authenticated
      navigate('/login');
    }
  }, [currentUser, navigate]);
  const handleInputChange = e => {
    const {
      name,
      value
    } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleToggleChange = name => {
    setUserData(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };
  const handleSleepPositionChange = position => {
    setUserData(prev => ({
      ...prev,
      sleepPosition: position
    }));
  };
  const handleSubmit = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      // Save complete profile data to Supabase
      await UserService.updateUserProfile(currentUser.uid || currentUser.id, {
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        address: userData.address,
        sleep_position: userData.sleepPosition,
        sleep_time: userData.sleepTime,
        wake_time: userData.wakeTime,
        location: userData.location,
        notifications: userData.notifications,
        profile_completed: true,
        updated_at: new Date().toISOString()
      });
      setSuccess(true);
      // Redirect to profile page after a short delay
      setTimeout(() => {
        navigate('/profile');
      }, 1500);
    } catch (error) {
      console.error('Error saving profile data:', error);
    } finally {
      setLoading(false);
    }
  };
  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };
  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };
  return <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-medium text-gray-900">
            Complete Your Profile
          </h1>
          <p className="mt-2 text-gray-500">
            Help us personalize your experience with some additional information
          </p>
        </div>
        {/* Progress indicator */}
        <div className="flex items-center justify-between mb-8">
          {[1, 2, 3].map(step => <div key={step} className="flex flex-col items-center">
              <div className={`h-10 w-10 rounded-full flex items-center justify-center ${currentStep >= step ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                {currentStep > step ? <CheckIcon className="h-5 w-5" /> : <span>{step}</span>}
              </div>
              <span className="text-xs mt-1 text-gray-500">
                {step === 1 ? 'Personal' : step === 2 ? 'Sleep' : 'Finish'}
              </span>
            </div>)}
        </div>
        <div className="backdrop-blur-xl bg-white/70 rounded-3xl shadow-lg shadow-gray-200/50 overflow-hidden">
          {/* Step 1: Personal Information */}
          {currentStep === 1 && <motion.div initial={{
          opacity: 0,
          x: 20
        }} animate={{
          opacity: 1,
          x: 0
        }} exit={{
          opacity: 0,
          x: -20
        }} className="p-6 space-y-4">
              <h2 className="text-xl font-medium text-gray-900 mb-4">
                Personal Information
              </h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <input type="text" name="name" value={userData.name} onChange={handleInputChange} className="w-full pl-10 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" placeholder="John Doe" />
                  <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <input type="email" name="email" value={userData.email} onChange={handleInputChange} className="w-full pl-10 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" placeholder="you@example.com" />
                  <MailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone (Optional)
                </label>
                <div className="relative">
                  <input type="tel" name="phone" value={userData.phone} onChange={handleInputChange} className="w-full pl-10 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" placeholder="(555) 123-4567" />
                  <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location (Optional)
                </label>
                <div className="relative">
                  <input type="text" name="location" value={userData.location} onChange={handleInputChange} className="w-full pl-10 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" placeholder="City, Country" />
                  <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>
              <div className="pt-4">
                <button onClick={nextStep} className="w-full flex items-center justify-center p-4 rounded-xl text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all">
                  <span className="text-lg font-medium">Continue</span>
                  <ChevronRightIcon className="ml-2 h-5 w-5" />
                </button>
              </div>
            </motion.div>}
          {/* Step 2: Sleep Preferences */}
          {currentStep === 2 && <motion.div initial={{
          opacity: 0,
          x: 20
        }} animate={{
          opacity: 1,
          x: 0
        }} exit={{
          opacity: 0,
          x: -20
        }} className="p-6 space-y-4">
              <h2 className="text-xl font-medium text-gray-900 mb-4">
                Sleep Preferences
              </h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Preferred Sleep Position
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['back', 'side', 'stomach'].map(position => <div key={position} className={`rounded-xl p-3 text-center cursor-pointer ${position === userData.sleepPosition ? 'bg-blue-500 text-white shadow-md' : 'bg-white/40 backdrop-blur-sm text-gray-500 border border-white/60'}`} onClick={() => handleSleepPositionChange(position)}>
                      <p className={`text-sm font-medium capitalize ${position === userData.sleepPosition ? 'text-white' : 'text-gray-700'}`}>
                        {position}
                      </p>
                    </div>)}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bedtime
                </label>
                <div className="relative">
                  <select name="sleepTime" value={userData.sleepTime} onChange={handleInputChange} className="w-full pl-10 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors">
                    <option value="09:00 PM">9:00 PM</option>
                    <option value="09:30 PM">9:30 PM</option>
                    <option value="10:00 PM">10:00 PM</option>
                    <option value="10:30 PM">10:30 PM</option>
                    <option value="11:00 PM">11:00 PM</option>
                    <option value="11:30 PM">11:30 PM</option>
                    <option value="12:00 AM">12:00 AM</option>
                    <option value="12:30 AM">12:30 AM</option>
                    <option value="01:00 AM">1:00 AM</option>
                  </select>
                  <MoonIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Wake-up Time
                </label>
                <div className="relative">
                  <select name="wakeTime" value={userData.wakeTime} onChange={handleInputChange} className="w-full pl-10 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors">
                    <option value="05:00 AM">5:00 AM</option>
                    <option value="05:30 AM">5:30 AM</option>
                    <option value="06:00 AM">6:00 AM</option>
                    <option value="06:30 AM">6:30 AM</option>
                    <option value="07:00 AM">7:00 AM</option>
                    <option value="07:30 AM">7:30 AM</option>
                    <option value="08:00 AM">8:00 AM</option>
                    <option value="08:30 AM">8:30 AM</option>
                    <option value="09:00 AM">9:00 AM</option>
                  </select>
                  <SunIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Notifications
                  </label>
                  <p className="text-xs text-gray-500">
                    Receive sleep reminders and tips
                  </p>
                </div>
                <div className="relative">
                  <input type="checkbox" className="sr-only" id="notifications" checked={userData.notifications} onChange={() => handleToggleChange('notifications')} />
                  <label htmlFor="notifications" className={`block h-6 w-11 rounded-full ${userData.notifications ? 'bg-blue-500' : 'bg-gray-300'}`}>
                    <span className={`absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform ${userData.notifications ? 'translate-x-5' : 'translate-x-0'}`}></span>
                  </label>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-4">
                <button onClick={prevStep} className="flex items-center justify-center p-4 rounded-xl text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all">
                  Back
                </button>
                <button onClick={nextStep} className="flex items-center justify-center p-4 rounded-xl text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all">
                  <span className="font-medium">Continue</span>
                  <ChevronRightIcon className="ml-2 h-5 w-5" />
                </button>
              </div>
            </motion.div>}
          {/* Step 3: Additional Information & Finish */}
          {currentStep === 3 && <motion.div initial={{
          opacity: 0,
          x: 20
        }} animate={{
          opacity: 1,
          x: 0
        }} exit={{
          opacity: 0,
          x: -20
        }} className="p-6 space-y-4">
              <h2 className="text-xl font-medium text-gray-900 mb-4">
                Almost Done!
              </h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address (Optional)
                </label>
                <div className="relative">
                  <textarea name="address" value={userData.address} onChange={handleInputChange} rows={3} className="w-full pl-10 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" placeholder="Your shipping address" />
                  <MapPinIcon className="absolute left-3 top-6 h-5 w-5 text-gray-400" />
                </div>
              </div>
              <div className="py-4 text-center">
                <p className="text-sm text-gray-500 mb-2">
                  By completing your profile, you'll get personalized pillow
                  recommendations based on your sleep preferences and
                  measurements.
                </p>
              </div>
              {success ? <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-center">
                  <CheckIcon className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <p className="text-green-800 font-medium">
                    Profile saved successfully!
                  </p>
                  <p className="text-green-600 text-sm">
                    Redirecting to your profile...
                  </p>
                </div> : <div className="grid grid-cols-2 gap-3">
                  <button onClick={prevStep} className="flex items-center justify-center p-4 rounded-xl text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all">
                    Back
                  </button>
                  <button onClick={handleSubmit} disabled={loading} className={`flex items-center justify-center p-4 rounded-xl text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all ${loading ? 'opacity-70' : ''}`}>
                    {loading ? <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </span> : <>
                        <SaveIcon className="h-5 w-5 mr-2" />
                        <span className="font-medium">Save Profile</span>
                      </>}
                  </button>
                </div>}
            </motion.div>}
        </div>
      </div>
    </div>;
};