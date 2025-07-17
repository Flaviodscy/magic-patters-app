import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, CameraIcon, UserIcon, MailIcon, MapPinIcon, MoonIcon, SunIcon, PhoneIcon, CheckIcon, XIcon, AlertCircleIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserService } from '../services/UserService';
export const EditProfilePage = () => {
  const {
    currentUser
  } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    profileImage: '',
    sleepPosition: 'side',
    sleepTime: '22:30',
    wakeTime: '06:45',
    location: '',
    notifications: true
  });
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  // Fetch user data on component mount
  useEffect(() => {
    async function fetchUserData() {
      if (!currentUser) {
        navigate('/login?reason=login_required');
        return;
      }
      try {
        setLoading(true);
        const userData = await UserService.getUserProfile(currentUser.uid);
        if (userData) {
          setUser({
            name: userData.name || '',
            email: userData.email || '',
            phone: userData.phone || '',
            address: userData.address || '',
            profileImage: userData.photoURL || '',
            sleepPosition: userData.sleepPosition || 'side',
            sleepTime: userData.sleepTime || '22:30',
            wakeTime: userData.wakeTime || '06:45',
            location: userData.location || '',
            notifications: userData.notifications !== undefined ? userData.notifications : true
          });
        } else {
          // Fallback to localStorage
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(prev => ({
              ...prev,
              name: parsedUser.displayName || '',
              email: parsedUser.email || '',
              profileImage: parsedUser.photoURL || ''
            }));
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to load profile data. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    fetchUserData();
  }, [currentUser, navigate]);
  const handleChange = (field, value) => {
    setUser(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const handleDragOver = e => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  const handleDrop = async e => {
    e.preventDefault();
    setIsDragging(false);
    try {
      const files = e.dataTransfer.files;
      if (files.length > 0 && currentUser) {
        const file = files[0];
        if (file.type.startsWith('image/')) {
          // Show loading state
          setUser(prev => ({
            ...prev,
            profileImage: 'https://via.placeholder.com/150?text=Loading...'
          }));
          // Upload to Firebase Storage
          const downloadURL = await UserService.uploadProfileImage(currentUser.uid, file);
          setUser(prev => ({
            ...prev,
            profileImage: downloadURL
          }));
          setSuccess('Profile image updated successfully');
        } else {
          setError('Please upload an image file');
        }
      }
    } catch (error) {
      console.error('Error handling file drop:', error);
      setError('Failed to upload image. Please try again.');
    }
  };
  const handleImageUpload = () => {
    // Trigger file input click
    document.getElementById('profile-image-upload').click();
  };
  const handleSaveChanges = async () => {
    if (!currentUser) {
      navigate('/login?reason=login_required');
      return;
    }
    try {
      setSaving(true);
      setError('');
      setSuccess('');
      // Basic validation
      if (!user.name.trim()) {
        setError('Name is required');
        return;
      }
      // Update user profile in Supabase
      const userId = currentUser.id || currentUser.uid;
      console.log('Updating profile for user ID:', userId);
      const profileData = {
        name: user.name,
        phone: user.phone,
        address: user.address,
        sleep_position: user.sleepPosition,
        sleep_time: user.sleepTime,
        wake_time: user.wakeTime,
        location: user.location,
        notifications: user.notifications,
        updated_at: new Date().toISOString()
      };
      console.log('Profile data being sent:', profileData);
      await UserService.updateUserProfile(userId, profileData);
      setSuccess('Profile updated successfully');
      // Navigate back to profile after short delay
      setTimeout(() => {
        navigate('/profile');
      }, 1500);
    } catch (error) {
      console.error('Error saving profile:', error);
      setError(`Failed to save changes: ${error.message || 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  };
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
  }} className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 px-4 pb-20">
      {/* Top Bar */}
      <div className="sticky top-0 z-10 backdrop-blur-lg bg-white/70 px-4 py-4 -mx-4 flex justify-between items-center border-b border-gray-100">
        <Link to="/profile" className="text-gray-800">
          <ArrowLeftIcon className="h-5 w-5" />
        </Link>
        <h1 className="text-lg font-medium text-gray-800">Edit Profile</h1>
        <div className="w-5"></div> {/* Spacer for centering */}
      </div>
      <div className="mt-8">
        {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start">
            <AlertCircleIcon className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-red-600 text-sm">{error}</p>
          </div>}
        {success && <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start">
            <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-green-600 text-sm">{success}</p>
          </div>}
        {/* Profile Image Upload */}
        <div className="flex flex-col items-center mb-8">
          <div className={`relative mb-2 ${isDragging ? 'ring-4 ring-blue-300' : ''}`} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
            <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-md">
              <img src={user.profileImage || 'https://via.placeholder.com/150?text=User'} alt={user.name} className="w-full h-full object-cover" />
            </div>
            <button onClick={handleImageUpload} className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-2 shadow-md">
              <CameraIcon className="h-5 w-5 text-white" />
            </button>
            <input id="profile-image-upload" type="file" accept="image/*" className="hidden" onChange={async e => {
            const file = e.target.files?.[0];
            if (file && currentUser) {
              try {
                // Show loading state
                setUser(prev => ({
                  ...prev,
                  profileImage: 'https://via.placeholder.com/150?text=Loading...'
                }));
                // Upload to Firebase Storage
                const downloadURL = await UserService.uploadProfileImage(currentUser.uid, file);
                setUser(prev => ({
                  ...prev,
                  profileImage: downloadURL
                }));
                setSuccess('Profile image updated successfully');
              } catch (error) {
                console.error('Error uploading image:', error);
                setError('Failed to upload image. Please try again.');
              }
            }
          }} />
          </div>
          <p className="text-sm text-gray-500">
            Tap to change your profile picture
          </p>
          <p className="text-xs text-gray-400">or drag and drop an image</p>
        </div>
        {/* Form Fields */}
        <div className="space-y-6">
          <div className="backdrop-blur-md bg-white/60 rounded-2xl p-5 shadow-sm border border-white/80">
            <label className="block mb-5">
              <span className="text-sm text-gray-500 mb-1.5 block">
                Full Name
              </span>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input type="text" value={user.name} onChange={e => handleChange('name', e.target.value)} className="w-full pl-10 pr-4 py-3 bg-white/60 backdrop-blur-sm border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
            </label>
            <label className="block mb-5">
              <span className="text-sm text-gray-500 mb-1.5 block">
                Email Address
              </span>
              <div className="relative">
                <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input type="email" value={user.email} disabled className="w-full pl-10 pr-4 py-3 bg-gray-50/60 backdrop-blur-sm border border-gray-100 rounded-xl text-gray-500" />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Email cannot be changed
              </p>
            </label>
            <label className="block mb-5">
              <span className="text-sm text-gray-500 mb-1.5 block">
                Phone Number
              </span>
              <div className="relative">
                <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input type="tel" value={user.phone} onChange={e => handleChange('phone', e.target.value)} className="w-full pl-10 pr-4 py-3 bg-white/60 backdrop-blur-sm border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="(555) 123-4567" />
              </div>
            </label>
            <label className="block">
              <span className="text-sm text-gray-500 mb-1.5 block">
                Location
              </span>
              <div className="relative">
                <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input type="text" value={user.location} onChange={e => handleChange('location', e.target.value)} className="w-full pl-10 pr-4 py-3 bg-white/60 backdrop-blur-sm border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="City, Country" />
              </div>
            </label>
            <label className="block mt-5">
              <span className="text-sm text-gray-500 mb-1.5 block">
                Address
              </span>
              <div className="relative">
                <MapPinIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <textarea value={user.address} onChange={e => handleChange('address', e.target.value)} className="w-full pl-10 pr-4 py-3 bg-white/60 backdrop-blur-sm border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Your full address" rows={3} />
              </div>
            </label>
          </div>
          {/* Sleep Preferences */}
          <div className="backdrop-blur-md bg-white/60 rounded-2xl p-5 shadow-sm border border-white/80">
            <h3 className="text-gray-700 font-medium mb-4">
              Sleep Preferences
            </h3>
            <div className="mb-5">
              <span className="text-sm text-gray-500 mb-3 block">
                Sleep Position
              </span>
              <div className="grid grid-cols-3 gap-3">
                {['back', 'side', 'stomach'].map(position => <button key={position} onClick={() => handleChange('sleepPosition', position)} className={`rounded-xl py-3 text-center transition-colors ${position === user.sleepPosition ? 'bg-blue-500 text-white shadow-md' : 'bg-white/40 backdrop-blur-sm text-gray-500 border border-white/60'}`}>
                    <p className={`text-sm font-medium capitalize ${position === user.sleepPosition ? 'text-white' : 'text-gray-700'}`}>
                      {position}
                    </p>
                  </button>)}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-0">
              <label className="block">
                <span className="text-sm text-gray-500 mb-1.5 block">
                  Sleep Time
                </span>
                <div className="relative">
                  <MoonIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input type="time" value={user.sleepTime} onChange={e => handleChange('sleepTime', e.target.value)} className="w-full pl-10 pr-4 py-3 bg-white/60 backdrop-blur-sm border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
              </label>
              <label className="block">
                <span className="text-sm text-gray-500 mb-1.5 block">
                  Wake Time
                </span>
                <div className="relative">
                  <SunIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input type="time" value={user.wakeTime} onChange={e => handleChange('wakeTime', e.target.value)} className="w-full pl-10 pr-4 py-3 bg-white/60 backdrop-blur-sm border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
              </label>
            </div>
          </div>
          {/* Action Buttons */}
          <div className="flex gap-4 mt-8">
            <Link to="/profile" className="flex-1 py-3.5 rounded-xl bg-gray-100 text-gray-700 font-medium text-center flex items-center justify-center">
              <XIcon className="h-5 w-5 mr-2" />
              Cancel
            </Link>
            <button onClick={handleSaveChanges} disabled={saving} className={`flex-1 py-3.5 rounded-xl bg-blue-500 text-white font-medium shadow-sm flex items-center justify-center ${saving ? 'opacity-70' : 'hover:bg-blue-600'}`}>
              {saving ? <>
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Saving...
                </> : <>
                  <CheckIcon className="h-5 w-5 mr-2" />
                  Save Changes
                </>}
            </button>
          </div>
        </div>
      </div>
    </motion.div>;
};