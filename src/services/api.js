import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// User API endpoints
export const userAPI = {
  // Get all users
  getUsers: () => api.get('/users'),

  // Create a new user
  createUser: (userData) => api.post('/createusers', userData),

  // Update a user
  updateUser: (userId, userData) => api.post('/updateusers', { ...userData, id: userId }),

  // Delete a user
  deleteUser: (userId) => api.post('/deleteusers', { id: userId }),
};

// Error handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;
