import React from 'react';
import { supabase } from '../lib/supabaseClient';
export const UserService = {
  getUserProfile: async (userId: string) => {
    try {
      const {
        data,
        error
      } = await supabase.from('profiles').select('*').eq('id', userId).single();
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  },
  updateUserProfile: async (userId: string, updateData: any) => {
    try {
      console.log('Updating profile for user:', userId);
      console.log('Update data:', updateData);
      const {
        data,
        error
      } = await supabase.from('profiles').update(updateData).eq('id', userId);
      if (error) throw error;
      console.log('Profile updated successfully:', data);
      return data;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },
  uploadProfileImage: async (userId: string, file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Math.random()}.${fileExt}`;
      const filePath = `profile-images/${fileName}`;
      const {
        error: uploadError
      } = await supabase.storage.from('avatars').upload(filePath, file);
      if (uploadError) throw uploadError;
      const {
        data
      } = supabase.storage.from('avatars').getPublicUrl(filePath);
      // Update the user's profile with the new image URL
      await UserService.updateUserProfile(userId, {
        photo_url: data.publicUrl,
        updated_at: new Date().toISOString()
      });
      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading profile image:', error);
      throw error;
    }
  },
  updateRoutineTasks: async (userId: string, tasks: any[]) => {
    try {
      const {
        data,
        error
      } = await supabase.from('profiles').update({
        routine_tasks: tasks,
        updated_at: new Date().toISOString()
      }).eq('id', userId);
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating routine tasks:', error);
      throw error;
    }
  }
};