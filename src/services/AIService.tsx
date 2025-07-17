import React from 'react';
import { supabase } from '../lib/supabaseClient';
// Define the types for AI responses
export interface AIResponse {
  text: string;
  quickReplies?: string[];
  type?: string;
}
export const AIService = {
  // Process a message with AI and get a response
  async processMessage(message: string, messageType: string, userId?: string): Promise<AIResponse> {
    try {
      // First try to use Supabase Edge Function to process the message
      const {
        data,
        error
      } = await supabase.functions.invoke('process-chat-message', {
        body: {
          message,
          messageType,
          userId
        }
      });
      if (!error && data) {
        return {
          text: data.text,
          quickReplies: data.quickReplies,
          type: data.type || messageType
        };
      }
      // If Supabase function fails, fallback to local processing
      console.warn('Supabase AI function failed, using fallback:', error);
      return this.processMessageLocally(message, messageType);
    } catch (error) {
      console.error('Error processing message with AI:', error);
      return this.processMessageLocally(message, messageType);
    }
  },
  // Local fallback for processing messages when the AI service is unavailable
  processMessageLocally(message: string, messageType: string): AIResponse {
    // Convert message to lowercase for easier matching
    const lowerMessage = message.toLowerCase();
    // Default response if no patterns match
    let response: AIResponse = {
      text: "I'm here to help! Could you provide more details about what you're looking for?",
      quickReplies: ['Product recommendations', 'Measurement help', 'Order status'],
      type: messageType
    };
    // Process based on message type
    switch (messageType) {
      case 'product':
        if (lowerMessage.includes('pillow') || lowerMessage.includes('recommend')) {
          response = {
            text: "Based on your interest, I'd recommend our Cloud Comfort Elite or Purple Harmony pillows. Both offer excellent support and cooling features. Would you like more details on either?",
            quickReplies: ['Cloud Comfort Elite', 'Purple Harmony', 'Show more options'],
            type: 'product'
          };
        } else if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
          response = {
            text: "Our pillows range from $79.99 to $189.99, depending on the features and materials. The Cloud Comfort Elite is $129.99, while the Purple Harmony is $159.99. Is there a specific price range you're looking for?",
            quickReplies: ['Under $100', '$100-$150', 'Premium options'],
            type: 'product'
          };
        }
        break;
      case 'measurement':
        if (lowerMessage.includes('measure') || lowerMessage.includes('size')) {
          response = {
            text: 'Getting the right measurements is crucial for finding your perfect pillow. You can use our LiDAR scanner on newer iPhones/iPads or follow our manual measurement guide. Which would you prefer?',
            quickReplies: ['Use LiDAR scanner', 'Manual measurement guide', 'Watch tutorial video'],
            type: 'measurement'
          };
        } else if (lowerMessage.includes('neck') || lowerMessage.includes('pain')) {
          response = {
            text: "I'm sorry to hear about your neck discomfort. The right pillow height and firmness are essential for proper alignment. Would you like to take our quick assessment to find the perfect pillow for your needs?",
            quickReplies: ['Take assessment', 'Pillows for neck pain', 'Speak to a specialist'],
            type: 'measurement'
          };
        }
        break;
      case 'order':
        if (lowerMessage.includes('track') || lowerMessage.includes('status')) {
          response = {
            text: "I'd be happy to help you track your order. Could you provide your order number? Alternatively, I can look it up using your email address.",
            quickReplies: ['Track by email', 'I have my order number', 'Order issues'],
            type: 'order'
          };
        } else if (lowerMessage.includes('return') || lowerMessage.includes('exchange')) {
          response = {
            text: 'Our return policy allows returns within 100 nights of delivery. Would you like to initiate a return or exchange, or learn more about our return policy?',
            quickReplies: ['Start a return', 'Exchange policy', 'Contact support'],
            type: 'order'
          };
        }
        break;
      case 'feedback':
        response = {
          text: 'Thank you for taking the time to share your feedback! Your insights help us improve our products and service. Would you like to rate your recent experience with us?',
          quickReplies: ['Rate experience', 'Product feedback', 'Website feedback'],
          type: 'feedback'
        };
        break;
      default:
        // Check for common patterns in the general message
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi ') || lowerMessage === 'hi') {
          response = {
            text: 'Hello there! Welcome to PerfectPillow support. How can I assist you today?',
            quickReplies: ['Find a pillow', 'Track my order', 'Help with measurements'],
            type: 'general'
          };
        } else if (lowerMessage.includes('thank')) {
          response = {
            text: "You're very welcome! Is there anything else I can help you with today?",
            quickReplies: ['Yes, another question', "No, that's all"],
            type: 'general'
          };
        } else if (lowerMessage.includes('sleep') || lowerMessage.includes('comfort')) {
          response = {
            text: 'Getting quality sleep is so important! The right pillow can make a big difference in your comfort and sleep quality. Would you like recommendations based on your sleep style?',
            quickReplies: ['Side sleeper', 'Back sleeper', 'Stomach sleeper', 'I sleep in multiple positions'],
            type: 'general'
          };
        }
    }
    return response;
  },
  // Generate product recommendations based on user preferences
  async getProductRecommendations(preferences: any): Promise<any[]> {
    try {
      // Try to get recommendations from Supabase
      const {
        data,
        error
      } = await supabase.functions.invoke('get-product-recommendations', {
        body: preferences
      });
      if (!error && data && data.recommendations) {
        return data.recommendations;
      }
      // Fallback to local recommendations
      console.warn('Supabase recommendation function failed, using fallback:', error);
      return this.getLocalRecommendations(preferences);
    } catch (error) {
      console.error('Error getting product recommendations:', error);
      return this.getLocalRecommendations(preferences);
    }
  },
  // Local fallback for product recommendations
  getLocalRecommendations(preferences: any): any[] {
    // Sample recommendations based on sleep position
    const recommendations = [{
      id: 1,
      name: 'Cloud Comfort Elite',
      description: 'Perfect for back and side sleepers with cooling technology',
      price: 129.99,
      image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=600&q=80',
      rating: 4.8,
      features: ['Cooling technology', 'Adjustable height', 'Memory foam']
    }, {
      id: 2,
      name: 'Purple Harmony',
      description: 'Revolutionary grid technology for all sleep positions',
      price: 159.99,
      image: 'https://images.unsplash.com/photo-1631006387899-06240b7f6414?auto=format&fit=crop&w=600&q=80',
      rating: 4.9,
      features: ['Grid technology', 'Temperature neutral', 'No pressure points']
    }, {
      id: 3,
      name: 'Organic Cotton Pillow',
      description: 'Natural materials for chemical-free sleep',
      price: 79.99,
      image: 'https://images.unsplash.com/photo-1592789705501-f9ae4287c4cf?auto=format&fit=crop&w=600&q=80',
      rating: 4.6,
      features: ['100% organic cotton', 'Eco-friendly', 'Chemical-free']
    }];
    // Filter based on preferences
    let filtered = [...recommendations];
    if (preferences.sleepPosition) {
      if (preferences.sleepPosition === 'side') {
        filtered = filtered.filter(r => r.id === 1 || r.id === 2);
      } else if (preferences.sleepPosition === 'stomach') {
        filtered = filtered.filter(r => r.id === 3);
      }
    }
    if (preferences.priceRange) {
      if (preferences.priceRange === 'budget') {
        filtered = filtered.filter(r => r.price < 100);
      } else if (preferences.priceRange === 'premium') {
        filtered = filtered.filter(r => r.price > 150);
      }
    }
    return filtered.length > 0 ? filtered : recommendations;
  },
  // Save chat history to the database
  async saveChatHistory(userId: string, messages: any[]): Promise<boolean> {
    try {
      const {
        error
      } = await supabase.from('chat_history').upsert({
        user_id: userId,
        messages: messages,
        updated_at: new Date().toISOString()
      });
      if (error) {
        console.error('Error saving chat history:', error);
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error saving chat history:', error);
      return false;
    }
  },
  // Load chat history from the database
  async loadChatHistory(userId: string): Promise<any[]> {
    try {
      const {
        data,
        error
      } = await supabase.from('chat_history').select('messages').eq('user_id', userId).single();
      if (error) {
        console.error('Error loading chat history:', error);
        return [];
      }
      return data?.messages || [];
    } catch (error) {
      console.error('Error loading chat history:', error);
      return [];
    }
  }
};