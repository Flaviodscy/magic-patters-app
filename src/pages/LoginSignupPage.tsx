import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { UserIcon, KeyIcon, ArrowRightIcon, MailIcon, AlertCircleIcon, ArrowLeftIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { MeasurementService } from '../services/MeasurementService';
import { OfflineFallback } from '../components/OfflineFallback';
export const LoginSignupPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [hasPendingMeasurement, setHasPendingMeasurement] = useState(false);
  const {
    login,
    signup,
    signInWithGoogle,
    signInWithApple,
    resetPassword,
    currentUser,
    isOffline,
    connectionError
  } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  // Check if user is already logged in and if there are pending measurements
  useEffect(() => {
    // Check for pending measurements
    const pendingMeasurement = localStorage.getItem('pendingMeasurement');
    if (pendingMeasurement) {
      setHasPendingMeasurement(true);
    }
    if (currentUser) {
      // Check if user needs to complete profile setup
      UserService.isProfileCompleted(currentUser.uid || currentUser.id).then(isCompleted => {
        if (!isCompleted) {
          // Redirect to profile setup page for new users
          navigate('/profile-setup');
          return;
        }
        // If user logs in and has pending measurements, handle them
        if (pendingMeasurement) {
          try {
            const measurementData = JSON.parse(pendingMeasurement);
            // Save the measurement to the user's account
            if (typeof MeasurementService !== 'undefined') {
              MeasurementService.saveMeasurement(currentUser.uid, measurementData).then(() => {
                // Calculate and update user metrics
                const score = calculateScore(measurementData);
                return MeasurementService.updateUserMetrics(currentUser.uid, {
                  sleepScore: score
                });
              }).then(() => {
                // Clear the pending measurement
                localStorage.removeItem('pendingMeasurement');
                // Navigate to recommendation page
                navigate('/recommendation');
              }).catch(error => {
                console.error('Error saving pending measurement:', error);
              });
            } else {
              console.error('MeasurementService is not defined');
              navigate('/profile');
            }
          } catch (error) {
            console.error('Error processing pending measurement:', error);
            localStorage.removeItem('pendingMeasurement');
            navigate('/profile');
          }
        } else {
          // If no pending measurements, just navigate to profile
          navigate('/profile');
        }
      }).catch(error => {
        console.error('Error checking profile completion:', error);
        navigate('/profile');
      });
    }
    // Check for redirect params
    const params = new URLSearchParams(location.search);
    const redirectReason = params.get('reason');
    if (redirectReason === 'login_required') {
      setError('Please log in to access that page');
    } else if (redirectReason === 'reset_failed') {
      setError('Password reset link was invalid or expired. Please try again.');
      setIsForgotPassword(true);
    }
  }, [currentUser, navigate, location]);
  // Simple score calculation - matches the one in MeasurementService
  const calculateScore = data => {
    let score = 70;
    if (data.neckLength >= 4 && data.neckLength <= 6) score += 10;else score -= 5;
    if (data.neckWidth >= 6 && data.neckWidth <= 8) score += 10;else score -= 5;
    if (data.sleepPosition === 'back') score += 5;else if (data.sleepPosition === 'side') score += 3;
    return Math.max(0, Math.min(100, score));
  };
  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    // Form validation
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    if (!isLogin) {
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (!name) {
        setError('Please enter your name');
        return;
      }
      if (password.length < 6) {
        setError('Password should be at least 6 characters');
        return;
      }
    }
    try {
      setLoading(true);
      if (isLogin) {
        await login(email, password);
        setSuccessMessage('Login successful!');
        // If there's a pending measurement, the useEffect will handle navigation
        if (!hasPendingMeasurement) {
          setTimeout(() => navigate('/profile'), 1000);
        }
      } else {
        await signup(email, password, name);
        setSuccessMessage('Account created successfully!');
        // If there's a pending measurement, the useEffect will handle navigation
        if (!hasPendingMeasurement) {
          setTimeout(() => navigate('/profile'), 1000);
        }
      }
    } catch (error) {
      let errorMessage = 'Failed to ';
      errorMessage += isLogin ? 'log in' : 'create an account';
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = 'Invalid email or password';
      } else if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Email already in use';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password should be at least 6 characters';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email format';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed attempts. Please try again later';
      } else if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Sign in was cancelled. Please try again.';
      } else if (error.code === 'auth/cancelled-popup-request') {
        errorMessage = 'Another sign in operation is in progress';
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = 'Sign in popup was blocked by your browser';
      }
      setError(errorMessage);
      console.error('Authentication error:', error);
    } finally {
      setLoading(false);
    }
  }
  async function handleGoogleSignIn() {
    try {
      setError('');
      setLoading(true);
      setSuccessMessage('');
      await signInWithGoogle();
      setSuccessMessage('Login successful!');
      // If there's a pending measurement, the useEffect will handle navigation
      if (!hasPendingMeasurement) {
        setTimeout(() => navigate('/profile'), 1000);
      }
    } catch (error) {
      let errorMessage = 'Failed to sign in with Google';
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Google sign in was cancelled. Please try again.';
      } else if (error.code === 'auth/cancelled-popup-request') {
        errorMessage = 'Another sign in operation is in progress';
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = 'Sign in popup was blocked by your browser';
      }
      setError(errorMessage);
      console.error('Google sign-in error:', error);
    } finally {
      setLoading(false);
    }
  }
  async function handleAppleSignIn() {
    try {
      setError('');
      setLoading(true);
      setSuccessMessage('');
      await signInWithApple();
      setSuccessMessage('Login successful!');
      // If there's a pending measurement, the useEffect will handle navigation
      if (!hasPendingMeasurement) {
        setTimeout(() => navigate('/profile'), 1000);
      }
    } catch (error) {
      let errorMessage = 'Failed to sign in with Apple';
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Apple sign in was cancelled. Please try again.';
      } else if (error.code === 'auth/cancelled-popup-request') {
        errorMessage = 'Another sign in operation is in progress';
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = 'Sign in popup was blocked by your browser';
      } else if (error.code === 'auth/operation-not-allowed') {
        errorMessage = 'Apple sign in is not enabled for this project';
      }
      setError(errorMessage);
      console.error('Apple sign-in error:', error);
    } finally {
      setLoading(false);
    }
  }
  async function handlePasswordReset(e) {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    try {
      setLoading(true);
      await resetPassword(email);
      setSuccessMessage('Password reset email sent! Please check your inbox and spam folders.');
    } catch (error) {
      let errorMessage = 'Failed to send password reset email';
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email address';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email format';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many requests. Please try again later';
      }
      setError(errorMessage);
      console.error('Password reset error:', error);
    } finally {
      setLoading(false);
    }
  }
  return <OfflineFallback>
      <div className="max-w-md mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-medium text-gray-900">
            {isForgotPassword ? 'Reset Your Password' : isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="mt-2 text-gray-500 text-lg font-light">
            {isForgotPassword ? 'Enter your email to receive a reset link' : isLogin ? 'Sign in to access your profile' : 'Join to save your measurements'}
          </p>
        </div>

        {connectionError && !error && <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start">
            <AlertCircleIcon className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-red-600 text-sm">
              {connectionError} Please check your internet connection.
            </p>
          </div>}

        {error && <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start">
            <AlertCircleIcon className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-red-600 text-sm">{error}</p>
          </div>}

        {successMessage && <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start">
            <div className="h-5 w-5 bg-green-500 rounded-full text-white flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
              ✓
            </div>
            <p className="text-green-600 text-sm">{successMessage}</p>
          </div>}

        {/* Pending Measurement Notice */}
        {hasPendingMeasurement && <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start">
            <div className="h-5 w-5 bg-blue-500 rounded-full text-white flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
              ℹ️
            </div>
            <p className="text-blue-600 text-sm">
              We've saved your measurements temporarily. Sign in or create an
              account to save them permanently and get personalized
              recommendations.
            </p>
          </div>}

        <div className="backdrop-blur-xl bg-white/70 rounded-3xl shadow-lg shadow-gray-200/50">
          <div className="p-8">
            {!isForgotPassword && <>
                {/* Social Sign In Buttons */}
                <div className="space-y-3 mb-6">
                  <button type="button" onClick={handleGoogleSignIn} disabled={loading} className="w-full flex items-center justify-center p-3 border border-gray-300 rounded-xl bg-white hover:bg-gray-50 transition-colors">
                    <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    <span className="text-sm font-medium text-gray-700">
                      Continue with Google
                    </span>
                  </button>
                  <button type="button" onClick={handleAppleSignIn} disabled={loading} className="w-full flex items-center justify-center p-3 border border-gray-300 rounded-xl bg-white hover:bg-gray-50 transition-colors">
                    <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.569 12.6254C17.597 15.2582 19.8649 16.2937 19.8998 16.3093C19.8754 16.3855 19.4683 17.7091 18.5438 19.0729C17.7647 20.2353 16.9538 21.3901 15.7108 21.4127C14.4923 21.4344 14.0976 20.6574 12.7101 20.6574C11.3226 20.6574 10.8831 21.4127 9.72138 21.4344C8.5127 21.4561 7.57932 20.1462 6.79463 18.9847C5.18923 16.6139 3.97429 12.4952 5.62549 9.64108C6.44481 8.22491 7.89658 7.31063 9.47427 7.28889C10.6368 7.26715 11.7347 8.11403 12.4561 8.11403C13.1776 8.11403 14.5054 7.1062 15.9034 7.25016C16.4832 7.27189 18.0944 7.48144 19.1148 9.04547C19.0358 9.0936 17.5468 9.9796 17.569 12.6254ZM15.0401 5.16641C15.6981 4.36807 16.1364 3.26238 15.9897 2.15668C15.0401 2.20016 13.8491 2.7976 13.1711 3.59593C12.5609 4.30674 12.0354 5.44504 12.2053 6.52899C13.2736 6.61595 14.3823 5.96462 15.0401 5.16641Z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-700">
                      Continue with Apple
                    </span>
                  </button>
                </div>
                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">
                      Or continue with
                    </span>
                  </div>
                </div>
              </>}

            {isForgotPassword ? <form className="space-y-6" onSubmit={handlePasswordReset}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" placeholder="you@example.com" />
                    <MailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                </div>
                <button type="submit" disabled={loading} className={`w-full flex items-center justify-center p-4 rounded-xl text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}>
                  <span className="text-lg font-medium">
                    {loading ? 'Sending...' : 'Send Reset Link'}
                  </span>
                  {!loading && <ArrowRightIcon className="ml-2 h-5 w-5" />}
                </button>
                <button type="button" onClick={() => {
              setIsForgotPassword(false);
              setError('');
              setSuccessMessage('');
            }} className="w-full flex items-center justify-center p-3 text-gray-600 hover:text-gray-900 transition-colors">
                  <ArrowLeftIcon className="h-4 w-4 mr-2" />
                  Back to Sign In
                </button>
              </form> : <form className="space-y-6" onSubmit={handleSubmit}>
                {!isLogin && <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" placeholder="John Doe" />
                      <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                  </div>}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" placeholder="you@example.com" />
                    <MailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    {isLogin && <button type="button" onClick={() => {
                  setIsForgotPassword(true);
                  setError('');
                  setSuccessMessage('');
                }} className="text-xs text-blue-500 hover:text-blue-700 transition-colors">
                        Forgot password?
                      </button>}
                  </div>
                  <div className="relative">
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" placeholder="••••••••" />
                    <KeyIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                </div>
                {!isLogin && <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" placeholder="••••••••" />
                      <KeyIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                  </div>}
                <button type="submit" disabled={loading} className={`w-full flex items-center justify-center p-4 rounded-xl text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}>
                  <span className="text-lg font-medium">
                    {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
                  </span>
                  {!loading && <ArrowRightIcon className="ml-2 h-5 w-5" />}
                </button>
              </form>}

            {!isForgotPassword && <div className="mt-6 text-center">
                <button onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setSuccessMessage('');
            }} className="text-sm text-blue-500 hover:text-blue-600 transition-colors">
                  {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                </button>
              </div>}
          </div>
        </div>
      </div>
    </OfflineFallback>;
};