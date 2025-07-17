import React, { useEffect, useState, createContext, useContext } from 'react';
import { supabase, checkSupabaseConnection } from '../services/supabase';
import { User } from '@supabase/supabase-js';
interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  isOffline: boolean;
  connectionError: string | null;
  signup: (email: string, password: string, name: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  confirmPasswordReset: (code: string, password: string) => Promise<void>;
  verifyPasswordResetCode: (code: string) => Promise<string>;
  updateUserProfile: (data: {
    displayName?: string;
    photoURL?: string;
  }) => Promise<void>;
  getUserData: () => Promise<any>;
  saveUserData: (data: any) => Promise<void>;
  checkConnection: () => Promise<boolean>;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
export function AuthProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  // Check connection status
  const checkConnection = async () => {
    try {
      const {
        success,
        message
      } = await checkSupabaseConnection();
      setIsOffline(!success);
      setConnectionError(success ? null : message);
      return success;
    } catch (error) {
      console.error('Connection check failed:', error);
      setIsOffline(true);
      setConnectionError(error.message || 'Failed to connect to the server');
      return false;
    }
  };
  // Initialize auth state from Supabase session
  useEffect(() => {
    // Get initial session using v2 API
    const initSession = async () => {
      try {
        // Check connection first
        const isConnected = await checkConnection();
        if (!isConnected) {
          // Try to load from localStorage if offline
          const storedSession = localStorage.getItem('supabase.auth.token');
          if (storedSession) {
            try {
              const parsedSession = JSON.parse(storedSession);
              if (parsedSession?.currentSession?.user) {
                setCurrentUser(parsedSession.currentSession.user);
              }
            } catch (e) {
              console.error('Failed to parse stored session:', e);
            }
          }
          setLoading(false);
          return;
        }
        const {
          data: {
            session
          },
          error
        } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
          setConnectionError(error.message);
        }
        // If we have a user from the session, ensure they have a profile
        if (session?.user) {
          setCurrentUser(session.user);
          // Check if user has a profile and create one if needed
          try {
            const {
              data: existingProfile
            } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
            if (!existingProfile) {
              // Create a new profile for this user
              const {
                error: profileError
              } = await supabase.from('profiles').insert([{
                id: session.user.id,
                name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
                email: session.user.email,
                photo_url: session.user.user_metadata?.avatar_url || '',
                created_at: new Date().toISOString(),
                profile_completed: false,
                sleep_position: 'back',
                sleep_score: 84,
                comfort_score: 72,
                posture_score: 88,
                routine_tasks: [{
                  id: 1,
                  name: 'Morning stretch',
                  completed: false
                }, {
                  id: 2,
                  name: 'Pillow fluffing',
                  completed: false
                }, {
                  id: 3,
                  name: 'Evening relaxation',
                  completed: false
                }, {
                  id: 4,
                  name: 'Sleep tracking',
                  completed: false
                }]
              }]);
              if (profileError) {
                console.error('Error creating profile:', profileError);
              }
            }
          } catch (profileError) {
            console.error('Error checking/creating user profile:', profileError);
          }
        } else {
          setCurrentUser(null);
        }
        setLoading(false);
        // Listen for auth changes using v2 API
        const {
          data: {
            subscription
          }
        } = supabase.auth.onAuthStateChange(async (_event, session) => {
          if (session?.user) {
            setCurrentUser(session.user);
            // Check if user has a profile and create one if needed
            try {
              const {
                data: existingProfile
              } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
              if (!existingProfile) {
                // Create a new profile for this user
                const {
                  error: profileError
                } = await supabase.from('profiles').insert([{
                  id: session.user.id,
                  name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
                  email: session.user.email,
                  photo_url: session.user.user_metadata?.avatar_url || '',
                  created_at: new Date().toISOString(),
                  sleep_position: 'back',
                  sleep_score: 84,
                  comfort_score: 72,
                  posture_score: 88,
                  routine_tasks: [{
                    id: 1,
                    name: 'Morning stretch',
                    completed: false
                  }, {
                    id: 2,
                    name: 'Pillow fluffing',
                    completed: false
                  }, {
                    id: 3,
                    name: 'Evening relaxation',
                    completed: false
                  }, {
                    id: 4,
                    name: 'Sleep tracking',
                    completed: false
                  }]
                }]);
                if (profileError) {
                  console.error('Error creating profile:', profileError);
                }
              }
            } catch (profileError) {
              console.error('Error checking/creating user profile:', profileError);
            }
          } else {
            setCurrentUser(null);
          }
        });
        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Error in initSession:', error);
        setConnectionError(error.message || 'Failed to initialize authentication');
        setLoading(false);
      }
    };
    initSession();
    // Also add network status listener
    const handleOnline = () => {
      setIsOffline(false);
      checkConnection();
    };
    const handleOffline = () => {
      setIsOffline(true);
      setConnectionError('You are offline');
    };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  async function signup(email: string, password: string, name: string) {
    try {
      if (isOffline) {
        throw new Error('Cannot sign up while offline');
      }
      const {
        data,
        error
      } = await supabase.auth.signUp({
        email,
        password
      });
      if (error) throw error;
      if (data.user) {
        // Create user profile in Supabase database
        const {
          error: profileError
        } = await supabase.from('profiles').insert([{
          id: data.user.id,
          name,
          email,
          created_at: new Date().toISOString(),
          sleep_position: 'back',
          sleep_score: 0,
          comfort_score: 0,
          posture_score: 0,
          routine_tasks: [{
            id: 1,
            name: 'Morning stretch',
            completed: false
          }, {
            id: 2,
            name: 'Pillow fluffing',
            completed: false
          }, {
            id: 3,
            name: 'Evening relaxation',
            completed: false
          }, {
            id: 4,
            name: 'Sleep tracking',
            completed: false
          }]
        }]);
        if (profileError) {
          console.error('Error creating profile:', profileError);
        }
      }
    } catch (error) {
      console.error('Error during signup:', error);
      throw error;
    }
  }
  async function login(email: string, password: string) {
    try {
      if (isOffline) {
        throw new Error('Cannot log in while offline');
      }
      const {
        data,
        error
      } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;
      return {
        user: data.user
      };
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  }
  async function signInWithGoogle() {
    try {
      const {
        data,
        error
      } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
      // We need to wait for the OAuth redirect to complete
      // The user object will be available in the session after redirect
      return data;
    } catch (error) {
      console.error('Error during Google sign-in:', error);
      throw error;
    }
  }
  async function signInWithApple() {
    try {
      const {
        data,
        error
      } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error during Apple sign-in:', error);
      throw error;
    }
  }
  async function logout() {
    try {
      const {
        error
      } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  }
  async function resetPassword(email: string) {
    try {
      const {
        error
      } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
    } catch (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
  }
  async function verifyPasswordResetCode(code: string) {
    // Supabase handles this differently - the token is passed via URL
    // This function is kept for API compatibility
    return code;
  }
  async function confirmPasswordReset(code: string, password: string) {
    try {
      // In Supabase, you update the user's password directly
      const {
        error
      } = await supabase.auth.updateUser({
        password
      });
      if (error) throw error;
    } catch (error) {
      console.error('Error confirming password reset:', error);
      throw error;
    }
  }
  async function updateUserProfile(data: {
    displayName?: string;
    photoURL?: string;
  }) {
    if (!currentUser) throw new Error('No user logged in');
    try {
      // Update profile in Supabase database
      const {
        error
      } = await supabase.from('profiles').update({
        name: data.displayName,
        photo_url: data.photoURL,
        updated_at: new Date().toISOString()
      }).eq('id', currentUser.id);
      if (error) throw error;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }
  async function getUserData() {
    if (!currentUser) return null;
    try {
      const {
        data,
        error
      } = await supabase.from('profiles').select('*').eq('id', currentUser.id).single();
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting user data:', error);
      throw error;
    }
  }
  async function saveUserData(data: any) {
    if (!currentUser) throw new Error('No user logged in');
    try {
      const {
        error
      } = await supabase.from('profiles').update({
        ...data,
        updated_at: new Date().toISOString()
      }).eq('id', currentUser.id);
      if (error) throw error;
    } catch (error) {
      console.error('Error saving user data:', error);
      throw error;
    }
  }
  const value = {
    currentUser,
    loading,
    isOffline,
    connectionError,
    signup,
    login,
    signInWithGoogle,
    signInWithApple,
    logout,
    resetPassword,
    confirmPasswordReset,
    verifyPasswordResetCode,
    updateUserProfile,
    getUserData,
    saveUserData,
    checkConnection
  };
  return <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>;
}