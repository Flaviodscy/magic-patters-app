import React from 'react';
import { supabase } from './supabase';
export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  product_id?: string;
}
export interface Order {
  id?: string;
  user_id: string;
  items: OrderItem[];
  total: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  created_at: string;
  updated_at: string;
  shipping_address?: {
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  payment_method?: {
    type: string;
    last_four?: string;
  };
}
export const OrderService = {
  // Create a new order
  async createOrder(userId: string, orderData: Omit<Order, 'id' | 'created_at' | 'updated_at'>): Promise<string> {
    try {
      const now = new Date().toISOString();
      // Create new order
      const newOrder: Order = {
        user_id: userId,
        ...orderData,
        created_at: now,
        updated_at: now
      };
      // Save to Supabase
      const {
        data,
        error
      } = await supabase.from('orders').insert([newOrder]).single();
      if (error) throw error;
      return data.id;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },
  // Get all orders for a user
  async getUserOrders(userId: string): Promise<Order[]> {
    try {
      const {
        data,
        error
      } = await supabase.from('orders').select('*').eq('user_id', userId).order('created_at', {
        ascending: false
      });
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user orders:', error);
      throw error;
    }
  },
  // Get a specific order
  async getOrder(orderId: string): Promise<Order | null> {
    try {
      const {
        data,
        error
      } = await supabase.from('orders').select('*').eq('id', orderId).single();
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  },
  // Update order status
  async updateOrderStatus(orderId: string, status: Order['status']): Promise<void> {
    try {
      const {
        error
      } = await supabase.from('orders').update({
        status,
        updated_at: new Date().toISOString()
      }).eq('id', orderId);
      if (error) throw error;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }
};