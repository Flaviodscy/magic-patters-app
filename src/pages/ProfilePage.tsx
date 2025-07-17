import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserIcon, RulerIcon, BellIcon, ChevronRightIcon, ShoppingBagIcon, CreditCardIcon, MapPinIcon, PhoneIcon, MailIcon, PencilIcon, CheckIcon, PlusIcon, CalendarIcon, ArrowRightIcon, ZoomInIcon } from 'lucide-react';
import { ProfileImageViewer } from '../components/ProfileImageViewer';
import { useAuth } from '../contexts/AuthContext';
import { UserService } from '../services/UserService';
import { MeasurementService } from '../services/MeasurementService';
import { useNavigate } from 'react-router-dom';
export const ProfilePage = () => {
  const {
    currentUser
  } = useAuth();
  const navigate = useNavigate();
  // User information state
  const [user, setUser] = useState({
    name: 'Flavio Gorodscyu',
    email: 'flavio@example.com',
    phone: '(555) 987-6543',
    address: '456 Comfort Ave, Sleepville, NY 10001',
    avatar: "/02.jpg"
  });
  // Measurement history
  const [savedMeasurements, setSavedMeasurements] = useState([{
    date: '2024-06-15',
    neckLength: 5.2,
    neckWidth: 7.8,
    sleepPosition: 'side',
    score: 84
  }, {
    date: '2024-05-20',
    neckLength: 5.0,
    neckWidth: 7.6,
    sleepPosition: 'back',
    score: 79
  }]);
  // Order history
  const [orders, setOrders] = useState([{
    id: 'ORD-2024-042',
    date: '2024-06-05',
    total: 149.99,
    status: 'Delivered',
    items: [{
      name: 'Ergonomic Memory Foam',
      quantity: 1
    }]
  }, {
    id: 'ORD-2024-018',
    date: '2024-03-22',
    total: 289.98,
    status: 'Delivered',
    items: [{
      name: 'Cloud Comfort Elite',
      quantity: 2
    }]
  }]);
  // Daily routine tasks
  const [routineTasks, setRoutineTasks] = useState([{
    id: 1,
    name: 'Morning stretch',
    completed: true
  }, {
    id: 2,
    name: 'Pillow fluffing',
    completed: true
  }, {
    id: 3,
    name: 'Evening relaxation',
    completed: false
  }, {
    id: 4,
    name: 'Sleep tracking',
    completed: false
  }]);
  // Edit mode states
  const [editing, setEditing] = useState({
    name: false,
    email: false,
    phone: false,
    address: false
  });
  // Temporary values for editing
  const [tempValues, setTempValues] = useState({
    ...user
  });
  // Fullscreen image viewer state
  const [showFullscreenImage, setShowFullscreenImage] = useState(false);
  // Loading state
  const [loading, setLoading] = useState(true);
  // Fetch user data when component mounts
  useEffect(() => {
    async function fetchData() {
      if (!currentUser) {
        // Redirect to login if not authenticated
        navigate('/login');
        return;
      }
      try {
        console.log('Fetching profile data for:', currentUser.id);
        // Fetch user profile
        const userData = await UserService.getUserProfile(currentUser.uid || currentUser.id);
        // Also fetch the latest measurement to ensure we have the most up-to-date metrics
        let latestMetrics = {
          sleepScore: 75,
          comfortScore: 70,
          postureScore: 80
        };
        try {
          const latestMeasurement = await MeasurementService.getLatestMeasurement(currentUser.uid || currentUser.id);
          if (latestMeasurement) {
            latestMetrics = {
              sleepScore: latestMeasurement.sleep_score || 75,
              comfortScore: latestMeasurement.comfort_score || 70,
              postureScore: latestMeasurement.posture_score || 80
            };
          }
        } catch (measurementError) {
          console.error('Error fetching latest measurement:', measurementError);
        }
        if (userData) {
          console.log('Profile data retrieved:', userData);
          setUser({
            name: userData.name || currentUser.email?.split('@')[0] || 'User',
            email: userData.email || currentUser.email || '',
            phone: userData.phone || user.phone,
            address: userData.address || user.address,
            avatar: userData.photo_url || user.avatar
          });
          // Set temp values for editing
          setTempValues({
            name: userData.name || currentUser.email?.split('@')[0] || 'User',
            email: userData.email || currentUser.email || '',
            phone: userData.phone || user.phone,
            address: userData.address || user.address,
            avatar: userData.photo_url || user.avatar
          });
          // Fetch routine tasks if available
          if (userData.routine_tasks) {
            setRoutineTasks(userData.routine_tasks);
          }
        } else {
          // Fallback to auth user data
          const authUserName = currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || 'User';
          const authUserEmail = currentUser.email || '';
          const authUserPhoto = currentUser.user_metadata?.avatar_url || '';
          setUser({
            ...user,
            name: authUserName,
            email: authUserEmail,
            avatar: authUserPhoto
          });
          setTempValues({
            ...tempValues,
            name: authUserName,
            email: authUserEmail,
            avatar: authUserPhoto
          });
          console.log('No profile found, using auth data instead');
        }
        // Fetch measurements
        const measurements = await MeasurementService.getUserMeasurements(currentUser.uid || currentUser.id);
        if (measurements && measurements.length > 0) {
          const formattedMeasurements = measurements.map(m => ({
            date: m.created_at ? new Date(m.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            neckLength: m.neckLength,
            neckWidth: m.neckWidth,
            sleepPosition: m.sleepPosition,
            sleepScore: m.sleep_score || latestMetrics.sleepScore,
            comfortScore: m.comfort_score || latestMetrics.comfortScore,
            postureScore: m.posture_score || latestMetrics.postureScore
          }));
          setSavedMeasurements(formattedMeasurements);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [currentUser, navigate]);
  // Handle edit toggle
  const toggleEdit = async field => {
    if (editing[field]) {
      // Save changes to backend
      try {
        if (currentUser) {
          const userId = currentUser.uid || currentUser.id;
          // Create proper update data structure that matches what the backend expects
          const updateData = {
            [field]: tempValues[field],
            updated_at: new Date().toISOString()
          };
          // If field is 'name', make sure we're using the correct field name for the backend
          if (field === 'name') {
            updateData.name = tempValues.name;
          }
          console.log(`Saving ${field} with value:`, tempValues[field]);
          await UserService.updateUserProfile(userId, updateData);
          // Update local state after successful save
          setUser({
            ...user,
            [field]: tempValues[field]
          });
          // Show success message (you could add a toast notification here)
          console.log(`Successfully updated ${field}`);
        }
      } catch (error) {
        console.error(`Error updating ${field}:`, error);
        // Revert to previous value on error
        setTempValues({
          ...tempValues,
          [field]: user[field]
        });
        // Show error message (you could add a toast notification here)
        alert(`Failed to update ${field}. Please try again.`);
      }
    } else {
      // Start editing
      setTempValues({
        ...tempValues,
        [field]: user[field]
      });
    }
    // Toggle edit mode for this field
    setEditing({
      ...editing,
      [field]: !editing[field]
    });
  };
  // Handle input change
  const handleChange = (field, value) => {
    setTempValues({
      ...tempValues,
      [field]: value
    });
  };
  // Handle task toggle
  const handleTaskToggle = async taskId => {
    try {
      const updatedTasks = routineTasks.map(task => {
        if (task.id === taskId) {
          return {
            ...task,
            completed: !task.completed
          };
        }
        return task;
      });
      setRoutineTasks(updatedTasks);
      // Update in Firebase
      if (currentUser) {
        await UserService.updateRoutineTasks(currentUser.uid, updatedTasks);
      }
    } catch (error) {
      console.error('Error toggling task:', error);
      // Revert on error
      setRoutineTasks(routineTasks);
    }
  };
  if (loading) {
    return <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>;
  }
  return <>
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Profile Header with gradient background */}
        <div className="relative mb-12">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-3xl -z-10 opacity-90"></div>
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 rounded-3xl mix-blend-soft-light"></div>
          <div className="p-8 flex flex-col items-center text-center">
            <div className="relative">
              <img src={user.avatar} alt={user.name} className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg cursor-pointer hover:scale-105 transition-transform" onClick={() => setShowFullscreenImage(true)} />
              <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1.5 shadow-md">
                <PencilIcon className="h-4 w-4 text-purple-500" />
              </div>
            </div>
            <h1 className="mt-4 text-3xl font-medium text-white drop-shadow-sm">
              {user.name}
            </h1>
            <p className="mt-1 text-white/90 text-lg font-light">
              Perfect Pillow Member
            </p>
            {/* Metrics */}
            <div className="flex items-center justify-center space-x-8 mt-6">
              <div className="text-center">
                <div className="relative w-12 h-12">
                  <svg className="w-full h-full" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="16" fill="none" stroke="#ffffff" strokeWidth="2" strokeOpacity="0.3"></circle>
                    <circle cx="18" cy="18" r="16" fill="none" stroke="#ffffff" strokeWidth="3" strokeDasharray="100" strokeDashoffset={100 - 84} strokeLinecap="round" transform="rotate(-90 18 18)" className="drop-shadow-glow"></circle>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-white font-medium text-sm">
                    84%
                  </div>
                </div>
                <span className="text-xs text-white mt-1 block font-medium">
                  Sleep Score
                </span>
              </div>
              <div className="text-center">
                <div className="relative w-12 h-12">
                  <svg className="w-full h-full" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="16" fill="none" stroke="#ffffff" strokeWidth="2" strokeOpacity="0.3"></circle>
                    <circle cx="18" cy="18" r="16" fill="none" stroke="#ffffff" strokeWidth="3" strokeDasharray="100" strokeDashoffset={100 - 72} strokeLinecap="round" transform="rotate(-90 18 18)" className="drop-shadow-glow"></circle>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-white font-medium text-sm">
                    72%
                  </div>
                </div>
                <span className="text-xs text-white mt-1 block font-medium">
                  Comfort
                </span>
              </div>
              <div className="text-center">
                <div className="relative w-12 h-12">
                  <svg className="w-full h-full" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="16" fill="none" stroke="#ffffff" strokeWidth="2" strokeOpacity="0.3"></circle>
                    <circle cx="18" cy="18" r="16" fill="none" stroke="#ffffff" strokeWidth="3" strokeDasharray="100" strokeDashoffset={100 - 88} strokeLinecap="round" transform="rotate(-90 18 18)" className="drop-shadow-glow"></circle>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-white font-medium text-sm">
                    88%
                  </div>
                </div>
                <span className="text-xs text-white mt-1 block font-medium">
                  Posture
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Today's Routine Card */}
        <div className="backdrop-blur-xl bg-gradient-to-br from-indigo-100/90 via-purple-100/90 to-pink-100/90 rounded-3xl p-6 shadow-xl shadow-purple-200/30 border border-white/60">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center shadow-md shadow-indigo-200/50">
                <CalendarIcon className="h-5 w-5 text-white" />
              </div>
              <h2 className="ml-3 text-xl font-medium text-gray-900">
                Today's Routine
              </h2>
            </div>
            <span className="px-3 py-1 bg-white/80 rounded-full text-xs font-medium text-purple-700 shadow-sm">
              {routineTasks.filter(t => t.completed).length}/
              {routineTasks.length} Completed
            </span>
          </div>
          <div className="space-y-3">
            {routineTasks.map(task => <div key={task.id} className="flex items-center p-3 bg-white rounded-xl shadow-sm border border-gray-100/60" onClick={() => handleTaskToggle(task.id)}>
                <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center cursor-pointer ${task.completed ? 'bg-gradient-to-r from-blue-500 to-purple-500 border-transparent shadow-md shadow-blue-200/40' : 'border-gray-300'}`}>
                  {task.completed && <CheckIcon className="h-3 w-3 text-white" />}
                </div>
                <span className={`ml-3 ${task.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                  {task.name}
                </span>
              </div>)}
          </div>
          <button className="w-full mt-4 flex items-center justify-center p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all shadow-md shadow-purple-200/50" onClick={() => {
          if (currentUser) {
            navigate('/measurement');
          } else {
            navigate('/login');
          }
        }}>
            <span className="font-medium">Update Progress</span>
            <ArrowRightIcon className="h-4 w-4 ml-2" />
          </button>
        </div>

        {/* Measurement History with Face Scan */}
        <div className="backdrop-blur-xl bg-gradient-to-br from-blue-100/90 via-indigo-100/90 to-purple-100/90 rounded-3xl p-6 shadow-xl shadow-blue-200/30 border border-white/60">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center shadow-md shadow-blue-200/50">
                <RulerIcon className="h-5 w-5 text-white" />
              </div>
              <h2 className="ml-3 text-xl font-medium text-gray-900">
                Sleep Analysis
              </h2>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/2 relative">
              <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-100 to-purple-100 p-4 flex items-center justify-center border border-indigo-200/50 shadow-inner">
                <div className="w-full max-w-[200px] relative">
                  <div className="relative group cursor-pointer" onClick={() => setShowFullscreenImage(true)}>
                    <img src="/02.jpg" alt="Face scan visualization" className="w-full h-auto rounded-lg shadow-md" />
                    {/* Measurement points */}
                    <div className="absolute top-1/4 left-1/4 h-2 w-2 rounded-full bg-purple-500 shadow-glow-purple"></div>
                    <div className="absolute top-1/4 right-1/4 h-2 w-2 rounded-full bg-purple-500 shadow-glow-purple"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 h-2 w-2 rounded-full bg-purple-500 shadow-glow-purple"></div>
                    <div className="absolute bottom-1/3 left-1/3 h-2 w-2 rounded-full bg-purple-500 shadow-glow-purple"></div>
                    <div className="absolute bottom-1/3 right-1/3 h-2 w-2 rounded-full bg-purple-500 shadow-glow-purple"></div>
                    {/* Measurement lines */}
                    <div className="absolute top-1/4 left-1/4 right-1/4 h-[1px] bg-purple-300/70"></div>
                    <div className="absolute top-1/4 bottom-1/3 left-1/4 w-[1px] bg-purple-300/70"></div>
                    <div className="absolute top-1/4 bottom-1/3 right-1/4 w-[1px] bg-purple-300/70"></div>
                    <div className="absolute bottom-1/3 left-1/4 right-1/4 h-[1px] bg-purple-300/70"></div>
                    {/* LiDAR scanning effect */}
                    <div className="absolute inset-0 bg-gradient-to-b from-blue-400/10 to-transparent pointer-events-none"></div>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-full h-0.5 bg-blue-400/50 animate-pulse"></div>
                    </div>
                    {/* Zoom icon overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="bg-white/80 backdrop-blur-sm p-2 rounded-full">
                        <ZoomInIcon className="h-5 w-5 text-gray-800" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-2 text-center">
                <span className="text-sm text-gray-500 bg-white/50 px-2 py-0.5 rounded-full">
                  Last scan: Today
                </span>
              </div>
            </div>
            <div className="md:w-1/2 space-y-4">
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100/60">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-500">Neck Length</span>
                  <span className="text-sm font-medium">
                    {savedMeasurements[0].neckLength}"
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-glow-blue" style={{
                  width: '72%'
                }}></div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100/60">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-500">Neck Width</span>
                  <span className="text-sm font-medium">
                    {savedMeasurements[0].neckWidth}"
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-glow-blue" style={{
                  width: '84%'
                }}></div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100/60">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-500">Sleep Position</span>
                  <span className="text-sm font-medium capitalize">
                    {savedMeasurements[0].sleepPosition}
                  </span>
                </div>
                <div className="flex justify-between space-x-2 mt-2">
                  <div className={`flex-1 text-center p-2 rounded-lg ${savedMeasurements[0].sleepPosition === 'back' ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md shadow-blue-200/40' : 'bg-gray-100 text-gray-500'}`}>
                    Back
                  </div>
                  <div className={`flex-1 text-center p-2 rounded-lg ${savedMeasurements[0].sleepPosition === 'side' ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md shadow-blue-200/40' : 'bg-gray-100 text-gray-500'}`}>
                    Side
                  </div>
                  <div className={`flex-1 text-center p-2 rounded-lg ${savedMeasurements[0].sleepPosition === 'stomach' ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md shadow-blue-200/40' : 'bg-gray-100 text-gray-500'}`}>
                    Stomach
                  </div>
                </div>
              </div>
              <button className="w-full flex items-center justify-center p-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 transition-all shadow-md shadow-blue-200/40">
                <RulerIcon className="h-5 w-5 mr-2" />
                <span className="font-medium">Take New Measurement</span>
              </button>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="backdrop-blur-xl bg-gradient-to-br from-pink-100/90 via-red-100/90 to-orange-100/90 rounded-3xl p-6 shadow-xl shadow-red-200/30 border border-white/60 space-y-6">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-pink-500 to-red-500 flex items-center justify-center shadow-md shadow-pink-200/50">
              <UserIcon className="h-5 w-5 text-white" />
            </div>
            <h2 className="ml-3 text-xl font-medium text-gray-900">
              Personal Information
            </h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100/60">
              <div>
                <label className="block text-sm text-gray-500">Full Name</label>
                {editing.name ? <input type="text" value={tempValues.name} onChange={e => handleChange('name', e.target.value)} className="mt-1 p-2 bg-white rounded-lg border border-gray-200 focus:ring-2 focus:ring-pink-400 focus:border-pink-400" /> : <p className="font-medium">{user.name}</p>}
              </div>
              <button onClick={() => toggleEdit('name')} className={`p-2 rounded-full ${editing.name ? 'bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-md shadow-pink-200/40' : 'text-gray-400 hover:text-pink-500 transition-colors'}`}>
                {editing.name ? <CheckIcon className="h-5 w-5" /> : <PencilIcon className="h-5 w-5" />}
              </button>
            </div>
            <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100/60">
              <div>
                <label className="block text-sm text-gray-500">Email</label>
                {editing.email ? <div className="flex items-center mt-1">
                    <MailIcon className="h-4 w-4 text-gray-400 mr-2" />
                    <input type="email" value={tempValues.email} onChange={e => handleChange('email', e.target.value)} className="p-2 bg-white rounded-lg border border-gray-200 focus:ring-2 focus:ring-pink-400 focus:border-pink-400" />
                  </div> : <p className="font-medium flex items-center">
                    <MailIcon className="h-4 w-4 text-gray-400 mr-2" />
                    {user.email}
                  </p>}
              </div>
              <button onClick={() => toggleEdit('email')} className={`p-2 rounded-full ${editing.email ? 'bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-md shadow-pink-200/40' : 'text-gray-400 hover:text-pink-500 transition-colors'}`}>
                {editing.email ? <CheckIcon className="h-5 w-5" /> : <PencilIcon className="h-5 w-5" />}
              </button>
            </div>
            <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100/60">
              <div>
                <label className="block text-sm text-gray-500">Phone</label>
                {editing.phone ? <div className="flex items-center mt-1">
                    <PhoneIcon className="h-4 w-4 text-gray-400 mr-2" />
                    <input type="tel" value={tempValues.phone} onChange={e => handleChange('phone', e.target.value)} className="p-2 bg-white rounded-lg border border-gray-200 focus:ring-2 focus:ring-pink-400 focus:border-pink-400" />
                  </div> : <p className="font-medium flex items-center">
                    <PhoneIcon className="h-4 w-4 text-gray-400 mr-2" />
                    {user.phone}
                  </p>}
              </div>
              <button onClick={() => toggleEdit('phone')} className={`p-2 rounded-full ${editing.phone ? 'bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-md shadow-pink-200/40' : 'text-gray-400 hover:text-pink-500 transition-colors'}`}>
                {editing.phone ? <CheckIcon className="h-5 w-5" /> : <PencilIcon className="h-5 w-5" />}
              </button>
            </div>
            <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100/60">
              <div className="flex-1 mr-4">
                <label className="block text-sm text-gray-500">Address</label>
                {editing.address ? <div className="flex items-center mt-1">
                    <MapPinIcon className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                    <textarea value={tempValues.address} onChange={e => handleChange('address', e.target.value)} className="p-2 bg-white rounded-lg border border-gray-200 focus:ring-2 focus:ring-pink-400 focus:border-pink-400 w-full" rows={2} />
                  </div> : <p className="font-medium flex items-start">
                    <MapPinIcon className="h-4 w-4 text-gray-400 mr-2 mt-1 flex-shrink-0" />
                    <span>{user.address}</span>
                  </p>}
              </div>
              <button onClick={() => toggleEdit('address')} className={`p-2 rounded-full ${editing.address ? 'bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-md shadow-pink-200/40' : 'text-gray-400 hover:text-pink-500 transition-colors'}`}>
                {editing.address ? <CheckIcon className="h-5 w-5" /> : <PencilIcon className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Order History */}
        <div className="backdrop-blur-xl bg-gradient-to-br from-orange-100/90 via-amber-100/90 to-yellow-100/90 rounded-3xl p-6 shadow-xl shadow-amber-200/30 border border-white/60 space-y-4">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center shadow-md shadow-amber-200/50">
              <ShoppingBagIcon className="h-5 w-5 text-white" />
            </div>
            <h2 className="ml-3 text-xl font-medium text-gray-900">
              Order History
            </h2>
          </div>
          <div className="space-y-4">
            {orders.map(order => <div key={order.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100/60">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{order.id}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.date).toLocaleDateString()} • $
                      {order.total.toFixed(2)}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-gradient-to-r from-green-400 to-emerald-400 text-white rounded-full text-xs font-medium shadow-sm shadow-green-200/40">
                    {order.status}
                  </span>
                </div>
                <div className="mt-3 pl-4 border-l-2 border-amber-100">
                  {order.items.map((item, idx) => <p key={idx} className="text-sm text-gray-600">
                      {item.quantity}x {item.name}
                    </p>)}
                </div>
              </div>)}
          </div>
          <button className="w-full flex items-center justify-center p-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 transition-all shadow-md shadow-amber-200/40">
            <ShoppingBagIcon className="h-5 w-5 mr-2" />
            <span className="font-medium">View All Orders</span>
          </button>
        </div>

        {/* Payment Methods */}
        <div className="backdrop-blur-xl bg-gradient-to-br from-green-100/90 via-emerald-100/90 to-teal-100/90 rounded-3xl p-6 shadow-xl shadow-green-200/30 border border-white/60 space-y-4">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 flex items-center justify-center shadow-md shadow-green-200/50">
              <CreditCardIcon className="h-5 w-5 text-white" />
            </div>
            <h2 className="ml-3 text-xl font-medium text-gray-900">
              Payment Methods
            </h2>
          </div>
          <div className="bg-white p-4 border border-gray-100/60 rounded-xl shadow-sm flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-8 bg-gradient-to-r from-blue-500 to-blue-700 rounded-md flex items-center justify-center text-white text-xs font-bold shadow-sm shadow-blue-200/40">
                VISA
              </div>
              <span className="ml-3 font-medium">•••• •••• •••• 8765</span>
            </div>
            <span className="text-sm text-gray-500">Expires 11/26</span>
          </div>
          <button className="w-full flex items-center justify-center p-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 text-white hover:from-emerald-600 hover:to-green-600 transition-all shadow-md shadow-green-200/40">
            <PlusIcon className="h-5 w-5 mr-2" />
            <span className="font-medium">Add Payment Method</span>
          </button>
        </div>
      </div>

      {/* Fullscreen Image Viewer */}
      <AnimatePresence>
        {showFullscreenImage && <ProfileImageViewer imageUrl={user.avatar} onClose={() => setShowFullscreenImage(false)} />}
      </AnimatePresence>
    </>;
};