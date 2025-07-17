import React from 'react';
import { createClient } from '@supabase/supabase-js';
// Initialize Supabase client with defensive programming
const getSupabaseConfig = () => {
  // Default values
  const defaults = {
    url: 'https://jhgplcooeeptebmytpoo.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpoZ3BsY29vZWVwdGVibXl0cG9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3NTcyNjQsImV4cCI6MjA2ODMzMzI2NH0.GlaGVMROw0xKNUlJoqMDIEg317yl6xQ-wdLiTyV_pKA'
  };
  try {
    return {
      url: typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL || defaults.url,
      anonKey: typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY || defaults.anonKey
    };
  } catch (e) {
    console.warn('Failed to load environment variables, using defaults');
    return defaults;
  }
};
const {
  url,
  anonKey
} = getSupabaseConfig();
export const supabase = createClient(url, anonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  global: {
    fetch: (...args) => {
      return fetch(...args).catch(err => {
        console.error('Supabase connection error:', err);
        // Return a mock response for offline/error situations
        return new Response(JSON.stringify({
          error: {
            message: 'Network connection error'
          }
        }), {
          headers: {
            'Content-Type': 'application/json'
          },
          status: 503
        });
      });
    }
  }
});
// Add a health check function to test connection
export const checkSupabaseConnection = async () => {
  try {
    // Try a simple query that doesn't require any specific tables
    try {
      // First try a simple query to check basic connectivity
      const {
        data,
        error
      } = await supabase.from('profiles').select('count', {
        head: true,
        count: 'exact'
      }).limit(1);
      if (!error) {
        return {
          success: true,
          message: 'Connected to Supabase'
        };
      }
      // If there's an error, check if it's because the table doesn't exist
      if (error.message.includes('relation "profiles" does not exist')) {
        return {
          success: false,
          message: 'Database tables not set up. Please initialize the database.',
          needsDatabaseSetup: true
        };
      }
      throw error;
    } catch (queryError) {
      console.error('Error during connection test query:', queryError);
      // If we can connect but tables don't exist
      if (queryError.message && queryError.message.includes('relation "profiles" does not exist')) {
        return {
          success: false,
          message: 'Database tables not set up. Please initialize the database.',
          needsDatabaseSetup: true
        };
      }
      // For other errors, try a more basic health check
      const {
        data: healthData
      } = await supabase.auth.getSession();
      // If we get here, the connection is working but tables may not be set up
      return {
        success: true,
        message: 'Connected to Supabase, but database tables may need setup.',
        needsDatabaseSetup: true
      };
    }
  } catch (error) {
    console.error('Supabase health check failed:', error);
    return {
      success: false,
      message: error.message || 'Failed to connect to Supabase'
    };
  }
};