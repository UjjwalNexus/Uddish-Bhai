import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const register = (userData) => api.post('/auth/register', userData);
export const login = (userData) => api.post('/auth/login', userData);
export const getPosts = () => api.get('/posts');
export const createPost = (postData) => api.post('/posts', postData);
export const getModerationQueue = () => api.get('/moderation/queue');
export const submitDecision = (decisionData) => api.post('/moderation/decide', decisionData);
export const getAdvice = (question, petType) => api.post('/ai/advice', { question, pet_type: petType });

export default api;