import React from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, OAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// Mock Firebase implementation using localStorage
const createMockAuth = () => {
  // Mock auth methods and properties
  return {
    currentUser: null,
    onAuthStateChanged: (auth, callback) => {
      // Initialize from localStorage
      const user = localStorage.getItem('currentUser') ? JSON.parse(localStorage.getItem('currentUser')) : null;
      // Call the callback with the initial user state
      callback(user);
      // Set up event listener for auth state changes
      const handleStorageChange = event => {
        if (event.key === 'currentUser') {
          const user = event.newValue ? JSON.parse(event.newValue) : null;
          callback(user);
        }
      };
      window.addEventListener('storage', handleStorageChange);
      // Return unsubscribe function
      return () => {
        window.removeEventListener('storage', handleStorageChange);
      };
    }
  };
};
// Create mock Firebase services
export const auth = createMockAuth();
export const db = {
  collection: () => ({})
};
export const storage = {
  ref: () => ({})
};
// Mock providers
export const googleProvider = {};
export const appleProvider = {};
// Helper functions for mock auth
export const mockSignIn = userData => {
  localStorage.setItem('currentUser', JSON.stringify(userData));
  // Dispatch storage event to trigger onAuthStateChanged listeners
  window.dispatchEvent(new StorageEvent('storage', {
    key: 'currentUser',
    newValue: JSON.stringify(userData)
  }));
};
export const mockSignOut = () => {
  localStorage.removeItem('currentUser');
  // Dispatch storage event to trigger onAuthStateChanged listeners
  window.dispatchEvent(new StorageEvent('storage', {
    key: 'currentUser',
    oldValue: localStorage.getItem('currentUser'),
    newValue: null
  }));
};
export default {
  auth,
  db,
  storage,
  googleProvider,
  appleProvider,
  mockSignIn,
  mockSignOut
};