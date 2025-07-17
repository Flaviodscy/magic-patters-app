import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { UserIcon, MoonIcon, SunIcon, ChevronRightIcon, CameraIcon, CalendarIcon, MapPinIcon, MailIcon, BellIcon, LogOutIcon, CloudIcon, ArrowLeftIcon, PencilIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserService } from '../services/UserService';
export const UserProfilePage = () => {
  const navigate = useNavigate();
  const {
    currentUser,
    logout
  } = useAuth();
  const [user, setUser] = useState({
    name: '',
    email: '',
    profileImage: '',
    phone: '',
    address: '',
    sleepPosition: 'side',
    sleepTime: '10:30 PM',
    wakeTime: '6:45 AM',
    location: 'Toronto, CA',
    notifications: true,
    sleepScore: 84,
    comfortScore: 72,
    postureScore: 88
  });
  const [loading, setLoading] = useState(true);
  const [showImagePicker, setShowImagePicker] = useState(false);
  // Fetch user data from Firestore
  useEffect(() => {
    async function fetchUserData() {
      try {
        if (!currentUser) {
          // Redirect to login if not authenticated
          navigate('/login?reason=login_required');
          return;
        }
        console.log('Fetching user data for:', currentUser.id);
        const userData = await UserService.getUserProfile(currentUser.uid || currentUser.id);
        if (userData) {
          console.log('User data retrieved:', userData);
          // Also fetch the latest measurement to ensure we have the most up-to-date metrics
          try {
            const latestMeasurement = await MeasurementService.getLatestMeasurement(currentUser.uid || currentUser.id);
            // Set user data with latest metrics if available
            setUser({
              name: userData.name || currentUser.email?.split('@')[0] || '',
              email: userData.email || currentUser.email || '',
              profileImage: userData.photo_url || '',
              phone: userData.phone || '',
              address: userData.address || '',
              sleepPosition: userData.sleep_position || 'side',
              sleepTime: userData.sleep_time || '10:30 PM',
              wakeTime: userData.wake_time || '6:45 AM',
              location: userData.location || 'Toronto, CA',
              notifications: userData.notifications !== undefined ? userData.notifications : true,
              sleepScore: latestMeasurement?.sleep_score || userData.sleep_score || 75,
              comfortScore: latestMeasurement?.comfort_score || userData.comfort_score || 70,
              postureScore: latestMeasurement?.posture_score || userData.posture_score || 80
            });
          } catch (measurementError) {
            console.error('Error fetching latest measurement:', measurementError);
            // Fall back to profile data if measurement fetch fails
            setUser({
              name: userData.name || currentUser.email?.split('@')[0] || '',
              email: userData.email || currentUser.email || '',
              profileImage: userData.photo_url || '',
              phone: userData.phone || '',
              address: userData.address || '',
              sleepPosition: userData.sleep_position || 'side',
              sleepTime: userData.sleep_time || '10:30 PM',
              wakeTime: userData.wake_time || '6:45 AM',
              location: userData.location || 'Toronto, CA',
              notifications: userData.notifications !== undefined ? userData.notifications : true,
              sleepScore: userData.sleep_score || 75,
              comfortScore: userData.comfort_score || 70,
              postureScore: userData.posture_score || 80
            });
          }
        } else {
          // Fallback to auth user data
          setUser({
            ...user,
            name: currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || 'User',
            email: currentUser.email || '',
            profileImage: currentUser.user_metadata?.avatar_url || ''
          });
          console.log('No user profile found, using auth data instead');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchUserData();
  }, [currentUser, navigate]);
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };
  const handleImageChange = async newImage => {
    try {
      setUser(prev => ({
        ...prev,
        profileImage: newImage
      }));
      // Update profile image in Firebase
      if (currentUser) {
        await UserService.updateUserField(currentUser.uid, 'photoURL', newImage);
      }
      setShowImagePicker(false);
    } catch (error) {
      console.error('Error updating profile image:', error);
    }
  };
  const handleToggleNotifications = async () => {
    try {
      const newValue = !user.notifications;
      setUser(prev => ({
        ...prev,
        notifications: newValue
      }));
      // Update notifications preference in Firebase
      if (currentUser) {
        await UserService.updateUserField(currentUser.uid, 'notifications', newValue);
      }
    } catch (error) {
      console.error('Error updating notifications setting:', error);
    }
  };
  // Sample profile images
  const profileImageOptions = ['https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80'];
  if (loading) {
    return <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>;
  }
  return <motion.div initial={{
    opacity: 0
  }} animate={{
    opacity: 1
  }} className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 pb-20">
      {/* Top Bar */}
      <div className="sticky top-0 z-10 backdrop-blur-lg bg-white/70 px-4 py-4 flex justify-between items-center border-b border-gray-100">
        <Link to="/" className="text-gray-800">
          <ArrowLeftIcon className="h-5 w-5" />
        </Link>
        <h1 className="text-lg font-medium text-gray-800">Profile</h1>
        <Link to="/edit-profile" className="text-blue-500 text-sm font-medium flex items-center">
          <PencilIcon className="h-4 w-4 mr-1" />
          Edit
        </Link>
      </div>
      <div className="px-4 pt-6">
        {/* Profile Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-4">
            <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-md">
              <img src={user.profileImage || 'https://via.placeholder.com/150?text=User'} alt={user.name} className="w-full h-full object-cover" />
            </div>
            <button onClick={() => setShowImagePicker(true)} className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-2 shadow-md">
              <CameraIcon className="h-5 w-5 text-white" />
            </button>
          </div>
          <h2 className="text-xl font-semibold text-gray-800">
            {user.name || 'User'}
          </h2>
          <p className="text-gray-500 flex items-center gap-1 text-sm">
            <MapPinIcon className="h-3.5 w-3.5" />
            {user.location}
          </p>
          {/* Image Picker Modal */}
          {showImagePicker && <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl p-6 w-full max-w-md">
                <h3 className="text-lg font-medium text-gray-800 mb-4">
                  Upload your profile picture
                </h3>
                {/* Upload input */}
                <input type="file" accept="image/*" onChange={async e => {
              const file = e.target.files?.[0];
              if (file && currentUser) {
                try {
                  // Show loading state
                  const loadingImg = 'https://via.placeholder.com/150?text=Loading...';
                  setUser(prev => ({
                    ...prev,
                    profileImage: loadingImg
                  }));
                  // Upload to Firebase Storage
                  const downloadURL = await UserService.uploadProfileImage(currentUser.uid, file);
                  handleImageChange(downloadURL);
                } catch (error) {
                  console.error('Error uploading image:', error);
                  alert('Failed to upload image. Please try again.');
                }
              } else if (file) {
                // Local preview only if no user
                const reader = new FileReader();
                reader.onloadend = () => {
                  handleImageChange(reader.result);
                };
                reader.readAsDataURL(file);
              }
            }} className="mb-4" />
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {profileImageOptions.map((image, index) => <button key={index} onClick={() => handleImageChange(image)} className={`rounded-lg overflow-hidden border-2 ${user.profileImage === image ? 'border-blue-500' : 'border-transparent'}`}>
                      <img src={image} alt={`Profile option ${index + 1}`} className="w-full h-32 object-cover" />
                    </button>)}
                </div>
                <div className="flex justify-end">
                  <button onClick={() => setShowImagePicker(false)} className="px-4 py-2 text-gray-600 font-medium">
                    Cancel
                  </button>
                </div>
              </div>
            </div>}
        </div>
        {/* Score Metrics */}
        <div className="backdrop-blur-md bg-white/60 rounded-2xl p-5 mb-6 shadow-sm border border-white/80">
          <h3 className="text-gray-700 font-medium mb-4">Sleep Metrics</h3>
          <div className="flex justify-between">
            <div className="text-center">
              <div className="relative w-16 h-16 mx-auto">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="16" fill="none" stroke="#edf2f7" strokeWidth="3" />
                  <circle cx="18" cy="18" r="16" fill="none" stroke="#3b82f6" strokeWidth="3" strokeDasharray="100" strokeDashoffset={100 - user.sleepScore} strokeLinecap="round" transform="rotate(-90 18 18)" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-blue-600 font-medium">
                  {user.sleepScore}%
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-1">Sleep Score</p>
            </div>
            <div className="text-center">
              <div className="relative w-16 h-16 mx-auto">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="16" fill="none" stroke="#edf2f7" strokeWidth="3" />
                  <circle cx="18" cy="18" r="16" fill="none" stroke="#8b5cf6" strokeWidth="3" strokeDasharray="100" strokeDashoffset={100 - user.comfortScore} strokeLinecap="round" transform="rotate(-90 18 18)" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-purple-600 font-medium">
                  {user.comfortScore}%
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-1">Comfort</p>
            </div>
            <div className="text-center">
              <div className="relative w-16 h-16 mx-auto">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="16" fill="none" stroke="#edf2f7" strokeWidth="3" />
                  <circle cx="18" cy="18" r="16" fill="none" stroke="#ec4899" strokeWidth="3" strokeDasharray="100" strokeDashoffset={100 - user.postureScore} strokeLinecap="round" transform="rotate(-90 18 18)" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-pink-600 font-medium">
                  {user.postureScore}%
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-1">Posture</p>
            </div>
          </div>
          {/* Metrics explanation section */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <button onClick={() => document.getElementById('metrics-explanation-modal').classList.remove('hidden')} className="text-sm text-blue-500 font-medium flex items-center justify-center w-full">
              <svg className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 16V12M12 8H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              What do these metrics mean?
            </button>
          </div>
        </div>
        {/* Metrics Explanation Modal */}
        <div id="metrics-explanation-modal" className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 hidden">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Understanding Your Sleep Metrics
              </h3>
              <button onClick={() => document.getElementById('metrics-explanation-modal').classList.add('hidden')} className="text-gray-400 hover:text-gray-500">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-xl">
                <h4 className="font-medium text-blue-700 flex items-center mb-2">
                  <span className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                    <svg className="h-4 w-4 text-blue-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 12.79C20.8427 14.4922 20.2037 16.1144 19.1582 17.4668C18.1126 18.8192 16.7035 19.8458 15.0957 20.4265C13.4879 21.0073 11.7479 21.1181 10.0794 20.7461C8.41092 20.3741 6.88299 19.5345 5.67423 18.3258C4.46546 17.117 3.62594 15.5891 3.25391 13.9206C2.88188 12.2521 2.99274 10.5121 3.57346 8.9043C4.15418 7.29651 5.18082 5.88737 6.53321 4.84182C7.88559 3.79628 9.50779 3.15731 11.21 3M21 12.79L11 12.79" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M17 8L21 12L17 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  Sleep Score ({user.sleepScore}%)
                </h4>
                <p className="text-sm text-blue-600">
                  Your overall sleep quality based on your measurements and
                  sleep habits. It considers your neck dimensions, sleep
                  position, and sleep schedule. A higher score indicates better
                  sleep quality.
                </p>
                <div className="mt-2 text-xs text-blue-500">
                  <p className="font-medium">How to improve:</p>
                  <ul className="list-disc pl-4 space-y-1 mt-1">
                    <li>Maintain a consistent sleep schedule</li>
                    <li>
                      Choose a pillow that supports your neck measurements
                    </li>
                    <li>
                      Consider sleeping on your back or side rather than stomach
                    </li>
                  </ul>
                </div>
              </div>
              <div className="p-4 bg-purple-50 rounded-xl">
                <h4 className="font-medium text-purple-700 flex items-center mb-2">
                  <span className="h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center mr-2">
                    <svg className="h-4 w-4 text-purple-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8.5 14.5C10.7091 14.5 12.5 12.7091 12.5 10.5C12.5 8.29086 10.7091 6.5 8.5 6.5C6.29086 6.5 4.5 8.29086 4.5 10.5C4.5 12.7091 6.29086 14.5 8.5 14.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M17.5 17.5C19.7091 17.5 21.5 15.7091 21.5 13.5C21.5 11.2909 19.7091 9.5 17.5 9.5C15.2909 9.5 13.5 11.2909 13.5 13.5C13.5 15.7091 15.2909 17.5 17.5 17.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  Comfort Score ({user.comfortScore}%)
                </h4>
                <p className="text-sm text-purple-600">
                  How comfortable your current sleep setup is based on your neck
                  width and sleep position. This score predicts how well your
                  pillow matches your physical characteristics.
                </p>
                <div className="mt-2 text-xs text-purple-500">
                  <p className="font-medium">How to improve:</p>
                  <ul className="list-disc pl-4 space-y-1 mt-1">
                    <li>
                      Use a pillow that matches your neck width (5.5-8.5 inches
                      is optimal)
                    </li>
                    <li>Side sleepers typically need firmer, higher pillows</li>
                    <li>Back sleepers benefit from medium-height pillows</li>
                  </ul>
                </div>
              </div>
              <div className="p-4 bg-pink-50 rounded-xl">
                <h4 className="font-medium text-pink-700 flex items-center mb-2">
                  <span className="h-6 w-6 rounded-full bg-pink-100 flex items-center justify-center mr-2">
                    <svg className="h-4 w-4 text-pink-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M12 16L12 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M12 8L12 8.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  Posture Score ({user.postureScore}%)
                </h4>
                <p className="text-sm text-pink-600">
                  How well your sleep setup supports proper spinal alignment
                  based on your neck length and sleep position. Good posture
                  during sleep prevents pain and stiffness.
                </p>
                <div className="mt-2 text-xs text-pink-500">
                  <p className="font-medium">How to improve:</p>
                  <ul className="list-disc pl-4 space-y-1 mt-1">
                    <li>
                      Back sleeping is best for maintaining proper alignment
                    </li>
                    <li>
                      Use a pillow that keeps your neck in a neutral position
                      (4-6.5 inch neck length is ideal)
                    </li>
                    <li>
                      Avoid stomach sleeping, which can strain your neck and
                      spine
                    </li>
                  </ul>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                These scores are calculated based on your measurements and sleep
                preferences. They update automatically when you take new
                measurements or update your profile.
              </p>
            </div>
            <button onClick={() => document.getElementById('metrics-explanation-modal').classList.add('hidden')} className="mt-6 w-full py-3 rounded-xl bg-blue-500 text-white font-medium">
              Got it
            </button>
          </div>
        </div>
        {/* Personal Information */}
        <div className="backdrop-blur-md bg-white/60 rounded-2xl p-5 mb-6 shadow-sm border border-white/80">
          <h3 className="text-gray-700 font-medium mb-4">
            Personal Information
          </h3>
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                <MailIcon className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
            </div>
            {user.phone && <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                  <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{user.phone}</p>
                </div>
              </div>}
            {user.address && <div className="flex items-start">
                <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center mr-3 mt-1">
                  <MapPinIcon className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-medium">{user.address}</p>
                </div>
              </div>}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <Link to="/edit-profile" className="flex items-center justify-center p-3 rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition-colors">
              <PencilIcon className="h-4 w-4 mr-2" />
              Edit Personal Information
            </Link>
          </div>
        </div>
        {/* Sleep Stats */}
        <div className="backdrop-blur-md bg-white/60 rounded-2xl p-5 mb-6 shadow-sm border border-white/80">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-700 font-medium">Sleep Schedule</h3>
            <Link to="/edit-profile" className="text-xs text-blue-500 font-medium">
              Edit
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="backdrop-blur-sm bg-white/40 rounded-xl p-3 shadow-sm border border-white/60">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                  <MoonIcon className="h-4 w-4 text-indigo-600" />
                </div>
                <span className="text-xs text-gray-500">Sleep Time</span>
              </div>
              <p className="text-lg font-medium text-gray-800">
                {user.sleepTime}
              </p>
            </div>
            <div className="backdrop-blur-sm bg-white/40 rounded-xl p-3 shadow-sm border border-white/60">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                  <SunIcon className="h-4 w-4 text-amber-600" />
                </div>
                <span className="text-xs text-gray-500">Wake Time</span>
              </div>
              <p className="text-lg font-medium text-gray-800">
                {user.wakeTime}
              </p>
            </div>
          </div>
        </div>
        {/* Sleep Position */}
        <div className="backdrop-blur-md bg-white/60 rounded-2xl p-5 mb-6 shadow-sm border border-white/80">
          <h3 className="text-gray-700 font-medium mb-4">Sleep Position</h3>
          <div className="grid grid-cols-3 gap-3">
            {['back', 'side', 'stomach'].map(position => <div key={position} className={`rounded-xl p-3 text-center ${position === user.sleepPosition ? 'bg-blue-500 text-white shadow-md' : 'bg-white/40 backdrop-blur-sm text-gray-500 border border-white/60'}`} onClick={async () => {
            if (position !== user.sleepPosition && currentUser) {
              setUser(prev => ({
                ...prev,
                sleepPosition: position
              }));
              try {
                await UserService.updateUserField(currentUser.uid, 'sleepPosition', position);
              } catch (error) {
                console.error('Error updating sleep position:', error);
              }
            }
          }}>
                <p className={`text-sm font-medium capitalize ${position === user.sleepPosition ? 'text-white' : 'text-gray-700'}`}>
                  {position}
                </p>
              </div>)}
          </div>
        </div>
        {/* Account Settings */}
        <div className="backdrop-blur-md bg-white/60 rounded-2xl overflow-hidden shadow-sm border border-white/80 mb-6">
          <h3 className="text-gray-700 font-medium p-5 border-b border-gray-100">
            Account Settings
          </h3>
          <div className="divide-y divide-gray-100">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <MailIcon className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Email</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
              <ChevronRightIcon className="h-5 w-5 text-gray-400" />
            </div>
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                  <CalendarIcon className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    Sleep Schedule
                  </p>
                  <p className="text-xs text-gray-500">Set your sleep times</p>
                </div>
              </div>
              <ChevronRightIcon className="h-5 w-5 text-gray-400" />
            </div>
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                  <BellIcon className="h-4 w-4 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    Notifications
                  </p>
                  <p className="text-xs text-gray-500">
                    {user.notifications ? 'Enabled' : 'Disabled'}
                  </p>
                </div>
              </div>
              <div className="relative">
                <input type="checkbox" className="sr-only" id="notifications" checked={user.notifications} onChange={handleToggleNotifications} />
                <label htmlFor="notifications" className={`block h-6 w-11 rounded-full ${user.notifications ? 'bg-blue-500' : 'bg-gray-300'}`}>
                  <span className={`absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform ${user.notifications ? 'translate-x-5' : 'translate-x-0'}`}></span>
                </label>
              </div>
            </div>
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-sky-100 flex items-center justify-center mr-3">
                  <CloudIcon className="h-4 w-4 text-sky-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Sync Data</p>
                  <p className="text-xs text-gray-500">
                    Last synced 2 hours ago
                  </p>
                </div>
              </div>
              <button className="text-xs font-medium text-blue-500" onClick={async () => {
              if (currentUser) {
                try {
                  // This would trigger a data refresh in a real app
                  const userData = await UserService.getUserProfile(currentUser.uid);
                  if (userData) {
                    alert('Data synchronized successfully');
                  }
                } catch (error) {
                  console.error('Error syncing data:', error);
                  alert('Failed to sync data. Please try again.');
                }
              } else {
                alert('Please log in to sync your data');
              }
            }}>
                Sync Now
              </button>
            </div>
          </div>
        </div>
        {/* Log out button */}
        <button onClick={handleLogout} className="w-full backdrop-blur-md bg-white/60 rounded-2xl p-4 shadow-sm border border-white/80 text-red-500 font-medium flex items-center justify-center">
          <LogOutIcon className="h-4 w-4 mr-2" />
          Log Out
        </button>
      </div>
    </motion.div>;
};