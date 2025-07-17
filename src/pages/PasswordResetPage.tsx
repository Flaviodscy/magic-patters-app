import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { KeyIcon, ArrowRightIcon, AlertCircleIcon, ArrowLeftIcon } from 'lucide-react';
import { auth } from '../firebase/config';
import { verifyPasswordResetCode, confirmPasswordReset } from 'firebase/auth';
export const PasswordResetPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [actionCode, setActionCode] = useState('');
  const [verifying, setVerifying] = useState(true);
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    // Extract the action code from the URL
    const queryParams = new URLSearchParams(location.search);
    const oobCode = queryParams.get('oobCode');
    if (!oobCode) {
      setError('Invalid password reset link. Please request a new one.');
      setVerifying(false);
      return;
    }
    setActionCode(oobCode);
    // Verify the action code
    const verifyCode = async () => {
      try {
        setVerifying(true);
        // Verify the password reset code
        const email = await verifyPasswordResetCode(auth, oobCode);
        setEmail(email);
        setVerifying(false);
      } catch (error) {
        console.error('Error verifying reset code:', error);
        setError('This password reset link is invalid or has expired. Please request a new one.');
        setVerifying(false);
      }
    };
    verifyCode();
  }, [location]);
  const handleResetPassword = async e => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    // Validate passwords
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password should be at least 6 characters');
      return;
    }
    try {
      setLoading(true);
      // Complete the password reset
      await confirmPasswordReset(auth, actionCode, password);
      setSuccessMessage('Your password has been reset successfully!');
      // Redirect to login page after a delay
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      console.error('Error resetting password:', error);
      let errorMessage = 'Failed to reset password';
      if (error.code === 'auth/expired-action-code') {
        errorMessage = 'This password reset link has expired. Please request a new one.';
      } else if (error.code === 'auth/invalid-action-code') {
        errorMessage = 'This password reset link is invalid. Please request a new one.';
      } else if (error.code === 'auth/user-disabled') {
        errorMessage = 'This account has been disabled. Please contact support.';
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email address.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password should be at least 6 characters.';
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  if (verifying) {
    return <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying your reset link...</p>
        </div>
      </div>;
  }
  return <div className="max-w-md mx-auto space-y-8 p-4">
      <div className="text-center">
        <h1 className="text-3xl font-medium text-gray-900">
          Reset Your Password
        </h1>
        <p className="mt-2 text-gray-500 text-lg font-light">
          {email ? `Create a new password for ${email}` : 'Create a new password for your account'}
        </p>
      </div>
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
      <div className="backdrop-blur-xl bg-white/70 rounded-3xl shadow-lg shadow-gray-200/50">
        <div className="p-8">
          <form className="space-y-6" onSubmit={handleResetPassword}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" placeholder="••••••••" />
                <KeyIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" placeholder="••••••••" />
                <KeyIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>
            <button type="submit" disabled={loading || !!successMessage} className={`w-full flex items-center justify-center p-4 rounded-xl text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all ${loading || !!successMessage ? 'opacity-70 cursor-not-allowed' : ''}`}>
              <span className="text-lg font-medium">
                {loading ? 'Resetting...' : 'Reset Password'}
              </span>
              {!loading && <ArrowRightIcon className="ml-2 h-5 w-5" />}
            </button>
          </form>
          <div className="mt-6 text-center">
            <button onClick={() => navigate('/login')} className="text-sm text-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center mx-auto">
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back to Sign In
            </button>
          </div>
        </div>
      </div>
    </div>;
};