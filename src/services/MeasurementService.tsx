import React from 'react';
import { supabase } from '../lib/supabaseClient';
export const MeasurementService = {
  // Save a new measurement
  async saveMeasurement(userId, measurementData) {
    try {
      // Calculate scores based on measurements
      const {
        sleepScore,
        comfortScore,
        postureScore
      } = this.calculateScores(measurementData);
      // Create new measurement with timestamp and scores
      const newMeasurement = {
        user_id: userId,
        ...measurementData,
        sleep_score: sleepScore,
        comfort_score: comfortScore,
        posture_score: postureScore,
        created_at: new Date().toISOString()
      };
      // Ensure the measurements table exists
      await this.ensureMeasurementsTableExists();
      // Save to Supabase
      const {
        data,
        error
      } = await supabase.from('measurements').insert([newMeasurement]);
      if (error) {
        console.error('Error saving measurement to Supabase:', error);
        // Save to localStorage as fallback
        const storedMeasurements = JSON.parse(localStorage.getItem('measurements') || '[]');
        storedMeasurements.push(newMeasurement);
        localStorage.setItem('measurements', JSON.stringify(storedMeasurements));
        console.log('Saved measurement to localStorage as fallback');
      } else {
        console.log('Successfully saved measurement to Supabase');
      }
      // Also update the user's profile with the latest scores
      await this.updateUserMetrics(userId, {
        sleep_score: sleepScore,
        comfort_score: comfortScore,
        posture_score: postureScore
      });
      return newMeasurement;
    } catch (error) {
      console.error('Error saving measurement:', error);
      // Save to localStorage as fallback
      try {
        const {
          sleepScore,
          comfortScore,
          postureScore
        } = this.calculateScores(measurementData);
        const newMeasurement = {
          user_id: userId,
          ...measurementData,
          sleep_score: sleepScore,
          comfort_score: comfortScore,
          posture_score: postureScore,
          created_at: new Date().toISOString()
        };
        const storedMeasurements = JSON.parse(localStorage.getItem('measurements') || '[]');
        storedMeasurements.push(newMeasurement);
        localStorage.setItem('measurements', JSON.stringify(storedMeasurements));
        console.log('Saved measurement to localStorage after error');
        return newMeasurement;
      } catch (localStorageError) {
        console.error('Error saving to localStorage:', localStorageError);
        throw error;
      }
    }
  },
  // Ensure the measurements table exists
  async ensureMeasurementsTableExists() {
    try {
      // Check if measurements table exists
      const {
        error
      } = await supabase.from('measurements').select('user_id').limit(1);
      if (error && error.code === '42P01') {
        // Table doesn't exist, create it
        await supabase.rpc('create_measurements_table');
      }
    } catch (error) {
      console.error('Error ensuring measurements table exists:', error);
    }
  },
  // Get all measurements for a user
  async getUserMeasurements(userId) {
    try {
      await this.ensureMeasurementsTableExists();
      const {
        data,
        error
      } = await supabase.from('measurements').select('*').eq('user_id', userId).order('created_at', {
        ascending: false
      });
      if (error) {
        console.error('Error getting measurements from Supabase:', error);
        // Try to get from localStorage
        const storedMeasurements = JSON.parse(localStorage.getItem('measurements') || '[]');
        return storedMeasurements.filter(m => m.user_id === userId);
      }
      return data || [];
    } catch (error) {
      console.error('Error getting measurements:', error);
      // Try to get from localStorage as fallback
      try {
        const storedMeasurements = JSON.parse(localStorage.getItem('measurements') || '[]');
        return storedMeasurements.filter(m => m.user_id === userId);
      } catch (localStorageError) {
        console.error('Error getting from localStorage:', localStorageError);
        return [];
      }
    }
  },
  // Get latest measurement
  async getLatestMeasurement(userId) {
    try {
      await this.ensureMeasurementsTableExists();
      const {
        data,
        error
      } = await supabase.from('measurements').select('*').eq('user_id', userId).order('created_at', {
        ascending: false
      }).limit(1).single();
      if (error) {
        if (error.code !== 'PGRST116') {
          // PGRST116 is "No rows found" error
          console.error('Error getting latest measurement from Supabase:', error);
        }
        // Try to get from localStorage
        const storedMeasurements = JSON.parse(localStorage.getItem('measurements') || '[]');
        const userMeasurements = storedMeasurements.filter(m => m.user_id === userId);
        if (userMeasurements.length > 0) {
          // Sort by created_at and return the most recent
          return userMeasurements.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
        }
        return null;
      }
      return data;
    } catch (error) {
      console.error('Error getting latest measurement:', error);
      // Try to get from localStorage as fallback
      try {
        const storedMeasurements = JSON.parse(localStorage.getItem('measurements') || '[]');
        const userMeasurements = storedMeasurements.filter(m => m.user_id === userId);
        if (userMeasurements.length > 0) {
          // Sort by created_at and return the most recent
          return userMeasurements.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
        }
        return null;
      } catch (localStorageError) {
        console.error('Error getting from localStorage:', localStorageError);
        return null;
      }
    }
  },
  // Update user metrics based on measurements
  async updateUserMetrics(userId, metrics) {
    try {
      const {
        error
      } = await supabase.from('profiles').update({
        ...metrics,
        updated_at: new Date().toISOString()
      }).eq('id', userId);
      if (error) {
        console.error('Error updating user metrics in Supabase:', error);
        // Store in localStorage as fallback
        const userProfileKey = `user_profile_${userId}`;
        const storedProfile = JSON.parse(localStorage.getItem(userProfileKey) || '{}');
        const updatedProfile = {
          ...storedProfile,
          ...metrics,
          updated_at: new Date().toISOString()
        };
        localStorage.setItem(userProfileKey, JSON.stringify(updatedProfile));
        console.log('Updated user metrics in localStorage as fallback');
      } else {
        console.log('Successfully updated user metrics in Supabase');
      }
      return true;
    } catch (error) {
      console.error('Error updating user metrics:', error);
      // Store in localStorage as fallback
      try {
        const userProfileKey = `user_profile_${userId}`;
        const storedProfile = JSON.parse(localStorage.getItem(userProfileKey) || '{}');
        const updatedProfile = {
          ...storedProfile,
          ...metrics,
          updated_at: new Date().toISOString()
        };
        localStorage.setItem(userProfileKey, JSON.stringify(updatedProfile));
        console.log('Updated user metrics in localStorage after error');
        return true;
      } catch (localStorageError) {
        console.error('Error updating in localStorage:', localStorageError);
        throw error;
      }
    }
  },
  // Calculate sleep scores based on measurements
  calculateScores(data) {
    // Base scores
    let sleepScore = 70;
    let comfortScore = 65;
    let postureScore = 75;
    // Sleep Score - affected by all measurements
    if (data.neckLength >= 4 && data.neckLength <= 6) {
      sleepScore += 10;
    } else if (data.neckLength < 4) {
      sleepScore -= 5;
    } else {
      sleepScore -= 8;
    }
    if (data.neckWidth >= 6 && data.neckWidth <= 8) {
      sleepScore += 10;
    } else if (data.neckWidth < 6) {
      sleepScore -= 5;
    } else {
      sleepScore -= 8;
    }
    // Sleep position affects sleep score
    if (data.sleepPosition === 'back') {
      sleepScore += 8;
    } else if (data.sleepPosition === 'side') {
      sleepScore += 5;
    } else {
      sleepScore -= 3; // stomach sleeping is generally not recommended
    }
    // Comfort Score - mostly affected by neck width and sleep position
    if (data.neckWidth >= 5.5 && data.neckWidth <= 8.5) {
      comfortScore += 15;
    } else if (data.neckWidth < 5.5) {
      comfortScore -= 10;
    } else {
      comfortScore -= 5;
    }
    if (data.sleepPosition === 'side') {
      comfortScore += 10; // side sleeping is often most comfortable
    } else if (data.sleepPosition === 'back') {
      comfortScore += 5;
    }
    // Posture Score - mostly affected by neck length and sleep position
    if (data.neckLength >= 4 && data.neckLength <= 6.5) {
      postureScore += 12;
    } else {
      postureScore -= 8;
    }
    if (data.sleepPosition === 'back') {
      postureScore += 10; // back sleeping is best for posture
    } else if (data.sleepPosition === 'side') {
      postureScore += 5;
    } else {
      postureScore -= 10; // stomach sleeping is bad for posture
    }
    // Ensure scores are between 0 and 100
    sleepScore = Math.max(0, Math.min(100, sleepScore));
    comfortScore = Math.max(0, Math.min(100, comfortScore));
    postureScore = Math.max(0, Math.min(100, postureScore));
    return {
      sleepScore,
      comfortScore,
      postureScore
    };
  },
  // Legacy method for backward compatibility
  calculateScore(data) {
    const {
      sleepScore
    } = this.calculateScores(data);
    return sleepScore;
  }
};