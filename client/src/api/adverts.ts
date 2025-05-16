import api from './api';
import { AxiosError } from 'axios';

// Define Advert interface
interface Advert {
  _id: string;
  title: string;
  description: string;
  image?: string;
  location?: string;
  customFields?: { name: string; value: string }[];
  tags?: string[];
  visibility?: 'public' | 'private';
  upvotes?: number;
  views?: number;
  upvoted?: boolean;
}

// Define response interfaces
interface GetAdvertsResponse {
  adverts: Advert[];
}

interface GetAdvertByIdResponse {
  advert: Advert;
}

interface CreateAdvertResponse {
  advert: Advert;
  message: string;
}

interface UpdateAdvertResponse {
  advert: Advert;
  message: string;
}

interface DeleteAdvertResponse {
  message: string;
}

interface GetUserAdvertsResponse {
  adverts: Advert[];
}

interface UpvoteAdvertResponse {
  upvotes: number;
  upvoted: boolean;
}

interface TrackAdvertViewResponse {
  views: number;
}

interface GetShareableLinkResponse {
  url: string;
}

interface GetAdvertStatsResponse {
  upvotes: number;
  views: number;
  upvoted: boolean;
}

interface GetPrivateShareableLinkResponse {
  url: string;
  key: string;
  message: string;
}

// Define error response interface
interface ApiError {
  message: string;
  requiresKey?: boolean; // From getAdvertById
  limitReached?: boolean; // From createAdvert
  cannotUpvoteOwn?: boolean; // From upvoteAdvert
}

// Description: Get all adverts
// Endpoint: GET /api/adverts
// Request: { query?: string, tags?: string[], location?: string, radius?: number, lat?: number, lng?: number }
// Response: { adverts: Array<Advert> }
export const getAdverts = async (params?: {
  query?: string;
  tags?: string[];
  location?: string;
  radius?: number;
  lat?: number;
  lng?: number;
}): Promise<GetAdvertsResponse> => {
  try {
    const response = await api.get<GetAdvertsResponse>('/api/adverts', { params });
    return response.data;
  } catch (error) {
    console.error(error);
    const axiosError = error as AxiosError<ApiError>;
    throw new Error(axiosError.response?.data?.message || axiosError.message);
  }
};

// Description: Get a single advert by ID
// Endpoint: GET /api/adverts/:id
// Request: { key?: string }
// Response: { advert: Advert }
export const getAdvertById = async (id: string, key?: string): Promise<GetAdvertByIdResponse> => {
  try {
    console.log(`API: Calling getAdvertById with ID: ${id} and key: ${key || 'none'}`);
    const response = await api.get<GetAdvertByIdResponse>(`/api/adverts/${id}`, {
      params: key ? { key } : undefined,
    });
    console.log("API: getAdvertById response:", JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    console.error(`API: Error in getAdvertById for ID ${id}:`, error);
    const axiosError = error as AxiosError<ApiError>;
    if (axiosError.response?.data?.requiresKey) {
      throw new Error(axiosError.response.data.message || 'This advert requires an access key');
    }
    throw new Error(axiosError.response?.data?.message || axiosError.message);
  }
};

// Description: Create a new advert
// Endpoint: POST /api/adverts
// Request: { title: string, description: string, image?: string, location?: string, customFields?: Array<{name: string, value: string}>, tags?: string[], visibility?: 'public' | 'private' }
// Response: { advert: Advert, message: string }
export const createAdvert = async (data: {
  title: string;
  description: string;
  image?: string;
  location?: string;
  customFields?: { name: string; value: string }[];
  tags?: string[];
  visibility?: 'public' | 'private';
}): Promise<CreateAdvertResponse> => {
  try {
    const response = await api.post<CreateAdvertResponse>('/api/adverts', data);
    return response.data;
  } catch (error) {
    console.error(error);
    const axiosError = error as AxiosError<ApiError>;
    if (axiosError.response?.data?.limitReached) {
      throw new Error(axiosError.response.data.message);
    }
    throw new Error(axiosError.response?.data?.message || axiosError.message);
  }
};

// Description: Update an existing advert
// Endpoint: PUT /api/adverts/:id
// Request: { title?: string, description?: string, image?: string, location?: string, customFields?: Array<{name: string, value: string}>, tags?: string[], visibility?: 'public' | 'private' }
// Response: { advert: Advert, message: string }
export const updateAdvert = async (
  id: string,
  data: {
    title?: string;
    description?: string;
    image?: string;
    location?: string;
    customFields?: { name: string; value: string }[];
    tags?: string[];
    visibility?: 'public' | 'private';
  }
): Promise<UpdateAdvertResponse> => {
  try {
    const response = await api.put<UpdateAdvertResponse>(`/api/adverts/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(error);
    const axiosError = error as AxiosError<ApiError>;
    throw new Error(axiosError.response?.data?.message || axiosError.message);
  }
};

// Description: Delete an advert
// Endpoint: DELETE /api/adverts/:id
// Request: {}
// Response: { message: string }
export const deleteAdvert = async (id: string): Promise<DeleteAdvertResponse> => {
  try {
    const response = await api.delete<DeleteAdvertResponse>(`/api/adverts/${id}`);
    return response.data;
  } catch (error) {
    console.error(error);
    const axiosError = error as AxiosError<ApiError>;
    throw new Error(axiosError.response?.data?.message || axiosError.message);
  }
};

// Description: Get user's adverts
// Endpoint: GET /api/adverts/user/me
// Request: {}
// Response: { adverts: Array<Advert> }
export const getUserAdverts = async (): Promise<GetUserAdvertsResponse> => {
  try {
    console.log("API: Calling getUserAdverts");
    const response = await api.get<GetUserAdvertsResponse>('/api/adverts/user/me');
    console.log("API: getUserAdverts response:", JSON.stringify(response.data));
    
    // Check if the response data is properly structured
    if (response.data && response.data.adverts) {
      // Log the first advert's structure if available
      if (response.data.adverts.length > 0) {
        console.log("API: First advert structure:", JSON.stringify(response.data.adverts[0]));
        console.log("API: First advert ID:", response.data.adverts[0]._id || "ID missing!");
      }
    } else {
      console.error("API: Unexpected response structure:", response.data);
    }
    
    return response.data;
  } catch (error) {
    console.error("API: Error in getUserAdverts:", error);
    const axiosError = error as AxiosError<ApiError>;
    throw new Error(axiosError.response?.data?.message || axiosError.message);
  }
};

// Description: Upvote an advert
// Endpoint: POST /api/adverts/:id/upvote
// Request: {}
// Response: { upvotes: number, upvoted: boolean }
export const upvoteAdvert = async (id: string): Promise<UpvoteAdvertResponse> => {
  try {
    console.log(`[CLIENT] Upvoting advert with ID: ${id}`);
    const url = `/api/adverts/${id}/upvote`;
    console.log(`[CLIENT] Sending POST request to: ${url}`);
    
    const response = await api.post<UpvoteAdvertResponse>(url);
    console.log(`[CLIENT] Upvote response:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`[CLIENT] Error upvoting advert ${id}:`, error);
    
    const axiosError = error as AxiosError<ApiError>;
    // Check if the error response contains the cannotUpvoteOwn flag
    if (axiosError.response?.data?.cannotUpvoteOwn) {
      // Create a custom error object and set the flag directly on it
      const customError = new Error(axiosError.response.data.message);
      Object.defineProperty(customError, 'cannotUpvoteOwn', {
        value: true,
        enumerable: true,
      });
      throw customError;
    }
    
    throw new Error(axiosError.response?.data?.message || axiosError.message);
  }
};

// Description: Track a view for an advert
// Endpoint: POST /api/adverts/:id/view
// Request: {}
// Response: { views: number }
export const trackAdvertView = async (id: string): Promise<TrackAdvertViewResponse> => {
  try {
    const response = await api.post<TrackAdvertViewResponse>(`/api/adverts/${id}/view`);
    return response.data;
  } catch (error) {
    console.error(error);
    const axiosError = error as AxiosError<ApiError>;
    throw new Error(axiosError.response?.data?.message || axiosError.message);
  }
};

// Description: Get a shareable link for an advert
// Endpoint: GET /api/adverts/:id/share
// Request: {}
// Response: { url: string }
export const getShareableLink = async (id: string): Promise<GetShareableLinkResponse> => {
  try {
    const response = await api.get<GetShareableLinkResponse>(`/api/adverts/${id}/share`);
    return response.data;
  } catch (error) {
    console.error(error);
    const axiosError = error as AxiosError<ApiError>;
    throw new Error(axiosError.response?.data?.message || axiosError.message);
  }
};

// Description: Get advert statistics
// Endpoint: GET /api/adverts/:id/stats
// Request: {}
// Response: { upvotes: number, views: number, upvoted: boolean }
export const getAdvertStats = async (id: string): Promise<GetAdvertStatsResponse> => {
  try {
    console.log(`[CLIENT] Getting stats for advert ${id}`);
    const response = await api.get<GetAdvertStatsResponse>(`/api/adverts/${id}/stats`);
    console.log(`[CLIENT] Stats response:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`[CLIENT] Error getting advert stats for ${id}:`, error);
    const axiosError = error as AxiosError<ApiError>;
    throw new Error(axiosError.response?.data?.message || axiosError.message);
  }
};

// Description: Get a private shareable link for an advert
// Endpoint: GET /api/adverts/:id/share-private
// Request: {}
// Response: { url: string, key: string, message: string }
export const getPrivateShareableLink = async (id: string): Promise<GetPrivateShareableLinkResponse> => {
  try {
    const response = await api.get<GetPrivateShareableLinkResponse>(`/api/adverts/${id}/share-private`);
    return response.data;
  } catch (error) {
    console.error(error);
    const axiosError = error as AxiosError<ApiError>;
    throw new Error(axiosError.response?.data?.message || axiosError.message);
  }
};
