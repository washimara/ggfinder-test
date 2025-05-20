import api from './api';
import { Subscription, User } from '@/types'; // Import from src/types/index.ts

// Description: Create a new subscription
// Endpoint: POST /api/subscriptions
// Request: { amount: number, currency: string, paymentMethod: string, autoRenew: boolean }
// Response: { success: boolean, subscription: Subscription, user: User }
export const createSubscription = async (data: {
  amount: number;
  currency?: string;
  paymentMethod: string;
  autoRenew?: boolean;
}): Promise<{ success: boolean; subscription: Subscription; user: User }> => {
  try {
    const response = await api.post('/api/subscriptions', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error.message);
  }
};

// Description: Get user's active subscription
// Endpoint: GET /api/subscriptions/active
// Request: {}
// Response: { success: boolean, subscription: Subscription | null }
export const getActiveSubscription = async (): Promise<{
  success: boolean;
  subscription: Subscription | null;
}> => {
  try {
    const response = await api.get('/api/subscriptions/active');
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error.message);
  }
};

// Description: Get user's subscription history
// Endpoint: GET /api/subscriptions/history
// Request: {}
// Response: { success: boolean, subscriptions: Subscription[], hasPremiumAccess: boolean, premiumUser?: { startDate: string, endDate: string } }
export const getSubscriptionHistory = async (): Promise<{
  success: boolean;
  subscriptions: Subscription[];
  hasPremiumAccess: boolean;
  premiumUser?: { startDate: string; endDate: string };
}> => {
  try {
    const response = await api.get('/api/subscriptions/history');
    console.log("API response for subscription history:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error in getSubscriptionHistory API call:", error);
    throw new Error(error?.response?.data?.message || error.message);
  }
};

// Description: Cancel a subscription
// Endpoint: POST /api/subscriptions/:subscriptionId/cancel
// Request: {}
// Response: { success: boolean, subscription: Subscription }
export const cancelSubscription = async (
  subscriptionId: string
): Promise<{ success: boolean; subscription: Subscription }> => {
  try {
    const response = await api.post(`/api/subscriptions/${subscriptionId}/cancel`);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error.message);
  }
};

// Description: Renew a subscription
// Endpoint: POST /api/subscriptions/:subscriptionId/renew
// Request: {}
// Response: { success: boolean, subscription: Subscription, user: User }
export const renewSubscription = async (
  subscriptionId: string
): Promise<{ success: boolean; subscription: Subscription; user: User }> => {
  try {
    const response = await api.post(`/api/subscriptions/${subscriptionId}/renew`);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error.message);
  }
};
