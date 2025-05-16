import api from './api';
import { AxiosError } from 'axios';

// Define Advert interface (matches API response structure)
interface Advert {
  _id: string;
  id?: string;
  title: string;
  description: string;
  image?: string;
  location?: string;
  customFields?: { name: string; value: string }[];
  custom_fields?: { name: string; value: string }[];
  tags?: string[];
  visibility?: 'public' | 'private';
  createdAt?: string;
}

// Define Post interface (matches client-side structure after mapping)
interface Post {
  id: string;
  _id: string;
  title: string;
  description: string;
  image?: string;
  location?: string;
  customFields: { name: string; value: string }[];
  tags?: string[];
  createdAt?: string;
}

// Define response interfaces
interface GetPostsApiResponse {
  adverts: Advert[];
}

interface GetPostsResponse {
  posts: Post[];
}

interface GetPostByIdApiResponse {
  advert: Advert;
}

interface GetPostByIdResponse {
  post: Post;
}

interface CreatePostApiResponse {
  advert: Advert;
  message: string;
}

interface CreatePostResponse {
  post: Post;
  message: string;
}

interface UpdatePostApiResponse {
  advert: Advert;
  message: string;
}

interface UpdatePostResponse {
  post: Post;
  message: string;
}

interface DeletePostResponse {
  message: string;
}

interface GetUserPostsApiResponse {
  adverts: Advert[];
}

interface GetUserPostsResponse {
  posts: Post[];
}

// Define error response interface
interface ApiError {
  message: string;
}

// Description: Get all posts with optional search parameters
// Endpoint: GET /api/adverts
// Request: { query?: string, tags?: string[], location?: string }
// Response: { posts: Array<Post> }
export const getPosts = async (params?: {
  query?: string;
  tags?: string[];
  location?: string;
}): Promise<GetPostsResponse> => {
  try {
    const response = await api.get<GetPostsApiResponse>('/api/adverts', { params });
    const posts = response.data.adverts.map((advert: Advert) => ({
      id: advert._id || advert.id || '',
      _id: advert._id || advert.id || '',
      title: advert.title,
      description: advert.description,
      image: advert.image,
      location: advert.location,
      customFields: advert.customFields || advert.custom_fields || [],
      tags: advert.tags,
      createdAt: advert.createdAt,
    }));
    return { posts };
  } catch (error) {
    console.error('Error fetching posts:', error);
    const axiosError = error as AxiosError<ApiError>;
    throw new Error(axiosError.response?.data?.message || axiosError.message);
  }
};

// Description: Get a single post by ID
// Endpoint: GET /api/adverts/:id
// Request: {}
// Response: { post: Post }
export const getPostById = async (id: string): Promise<GetPostByIdResponse> => {
  try {
    const response = await api.get<GetPostByIdApiResponse>(`/api/adverts/${id}`);
    const post: Post = {
      id: response.data.advert._id || response.data.advert.id || '',
      _id: response.data.advert._id || response.data.advert.id || '',
      title: response.data.advert.title,
      description: response.data.advert.description,
      image: response.data.advert.image,
      location: response.data.advert.location,
      customFields: response.data.advert.customFields || response.data.advert.custom_fields || [],
      tags: response.data.advert.tags,
      createdAt: response.data.advert.createdAt,
    };
    return { post };
  } catch (error) {
    console.error('Error fetching post by ID:', error);
    const axiosError = error as AxiosError<ApiError>;
    throw new Error(axiosError.response?.data?.message || axiosError.message);
  }
};

// Description: Create a new post
// Endpoint: POST /api/adverts
// Request: { title: string, description: string, image?: string, location?: string, customFields?: Array<{name: string, value: string}>, tags?: string[] }
// Response: { post: Post, message: string }
export const createPost = async (data: {
  title: string;
  description: string;
  image?: string;
  location?: string;
  customFields?: { name: string; value: string }[];
  tags?: string[];
}): Promise<CreatePostResponse> => {
  try {
    // Convert customFields to custom_fields for the API
    const apiData = {
      ...data,
      custom_fields: data.customFields,
    };
    delete apiData.customFields;

    const response = await api.post<CreatePostApiResponse>('/api/adverts', apiData);
    const post: Post = {
      id: response.data.advert._id || response.data.advert.id || '',
      _id: response.data.advert._id || response.data.advert.id || '',
      title: response.data.advert.title,
      description: response.data.advert.description,
      image: response.data.advert.image,
      location: response.data.advert.location,
      customFields: response.data.advert.customFields || response.data.advert.custom_fields || [],
      tags: response.data.advert.tags,
      createdAt: response.data.advert.createdAt,
    };
    return {
      post,
      message: response.data.message,
    };
  } catch (error) {
    console.error('Error creating post:', error);
    const axiosError = error as AxiosError<ApiError>;
    throw new Error(axiosError.response?.data?.message || axiosError.message);
  }
};

// Description: Update an existing post
// Endpoint: PUT /api/adverts/:id
// Request: { title?: string, description?: string, image?: string, location?: string, customFields?: Array<{name: string, value: string}>, tags?: string[] }
// Response: { post: Post, message: string }
export const updatePost = async (
  id: string,
  data: {
    title?: string;
    description?: string;
    image?: string;
    location?: string;
    customFields?: { name: string; value: string }[];
    tags?: string[];
  }
): Promise<UpdatePostResponse> => {
  try {
    // Convert customFields to custom_fields for the API
    const apiData = {
      ...data,
      custom_fields: data.customFields,
    };
    delete apiData.customFields;

    const response = await api.put<UpdatePostApiResponse>(`/api/adverts/${id}`, apiData);
    const post: Post = {
      id: response.data.advert._id || response.data.advert.id || '',
      _id: response.data.advert._id || response.data.advert.id || '',
      title: response.data.advert.title,
      description: response.data.advert.description,
      image: response.data.advert.image,
      location: response.data.advert.location,
      customFields: response.data.advert.customFields || response.data.advert.custom_fields || [],
      tags: response.data.advert.tags,
      createdAt: response.data.advert.createdAt,
    };
    return {
      post,
      message: response.data.message,
    };
  } catch (error) {
    console.error('Error updating post:', error);
    const axiosError = error as AxiosError<ApiError>;
    throw new Error(axiosError.response?.data?.message || axiosError.message);
  }
};

// Description: Delete a post
// Endpoint: DELETE /api/adverts/:id
// Request: {}
// Response: { message: string }
export const deletePost = async (id: string): Promise<DeletePostResponse> => {
  try {
    const response = await api.delete<DeletePostResponse>(`/api/adverts/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting post:', error);
    const axiosError = error as AxiosError<ApiError>;
    throw new Error(axiosError.response?.data?.message || axiosError.message);
  }
};

// Description: Get user posts
// Endpoint: GET /api/adverts/user/me
// Request: {}
// Response: { posts: Array<{ id: string, title: string, description: string, image?: string, location?: string, tags?: string[], createdAt: string, custom_fields?: Array<{ name: string, value: string }> }> }
export const getUserPosts = async (): Promise<GetUserPostsResponse> => {
  try {
    console.log('Fetching user posts from API');
    const response = await api.get<GetUserPostsApiResponse>('/api/adverts/user/me');
    console.log('User posts raw response:', response.data);

    // Check if we have adverts in the response
    if (!response.data || !response.data.adverts) {
      console.error('Unexpected response structure:', response.data);
      throw new Error('Failed to retrieve user posts');
    }

    // Map the response properly
    const posts = response.data.adverts.map((advert: Advert) => ({
      id: advert._id || advert.id || '',
      _id: advert._id || advert.id || '',
      title: advert.title,
      description: advert.description,
      image: advert.image,
      location: advert.location,
      customFields: advert.customFields || advert.custom_fields || [],
      tags: advert.tags,
      createdAt: advert.createdAt,
    }));

    console.log('Mapped posts:', posts);
    return { posts };
  } catch (error) {
    console.error('Error fetching user posts:', error);
    const axiosError = error as AxiosError<ApiError>;
    throw new Error(axiosError.response?.data?.message || axiosError.message);
  }
};
