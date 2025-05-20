export interface User {
  _id: string;
  email: string;
  name: string;
  has_premium_access?: boolean;
  goodKarma?: number;
}

export interface Post {
  _id: string;
  title: string;
  description: string;
  image?: string;
  location?: string;
  customFields?: { name: string; value: string }[];
  tags?: string[];
  createdAt: string;
  userId: string;
  upvotes?: number;
  views?: number;
  upvotedBy?: string[];
}

export interface SearchParams {
  query?: string;
  tags?: string[];
  location?: string;
  radius?: number;
  lat?: number;
  lng?: number;
}

export interface Advert {
  _id: string;
  title: string;
  description: string;
  image?: string;
  location?: string;
  coordinates?: {
    type: string;
    coordinates: [number, number]; // [longitude, latitude]
  };
  distance?: number; // Distance from search location in km
  customFields?: { name: string; value: string }[];
  tags?: string[];
  createdAt: string;
  userId: string;
  upvotes?: number;
  views?: number;
  upvotedBy?: string[];
  visibility?: "public" | "private";
  privateKey?: string;
}

export interface SubscriptionHistoryResponse {
  success: boolean;
  subscriptions: Subscription[];
  hasPremiumAccess: boolean;
  premiumUser?: {
    startDate: string;
    endDate: string;
  };
}

export interface Subscription {
  _id: string;
  plan: string;
  status: string;
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  amount: number;
  currency: string;
  createdAt: string;
}

export type ThemeOption = {
  name: string;
  value: string;
  primaryColor: string;
  secondaryColor: string;
  searchBarExterior: string;
  searchBarInterior: string;
  buttonPrimary: string;
  buttonSecondary: string;
  textPrimary: string;
  textSecondary: string;
  headerFooterBg?: string;
  cardBg?: string;
};

export type Language = {
  name: string;
  code: string;
  flag?: string;
};
