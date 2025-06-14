import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
  timeout: 10000,
});

api.interceptors.request.use(
  async (config) => {

    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }

    if (['post', 'put', 'patch', 'delete'].includes(config.method?.toLowerCase())) {
      // Get CSRF token from cookie
      const csrfToken = document.cookie.split('; ')
        .find(row => row.startsWith('csrftoken='))
        ?.split('=')[1];
      
      if (csrfToken) {
        config.headers['X-CSRFToken'] = csrfToken;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/login/', credentials),
  register: (userData) => api.post('/register/', userData),
  logout: () => api.post('/logout/'),
  verifyToken: () => api.post('/verify-token/'),
};

export const artistsAPI = {
  getAll: () => api.get('/artists/'),
  getById: (id) => api.get(`/artists/${id}/`),
  create: (data) => api.post('/artists/', data),
  update: (id, data) => api.put(`/artists/${id}/`, data),
  delete: (id) => api.delete(`/artists/${id}/`),
  getAlbums: (id) => api.get(`/artists/${id}/albums/`),
};

export const albumsAPI = {
  getAll: (params = {}) => api.get('/albums/', { params }),
  getById: (id) => api.get(`/albums/${id}/`),
  create: (data) => api.post('/albums/', data),
  update: (id, data) => api.put(`/albums/${id}/`, data),
  delete: (id) => api.delete(`/albums/${id}/`),
  getReviews: (id) => api.get(`/albums/${id}/reviews/`),
};

export const reviewsAPI = {
  getAlbumReviews: (albumId) => api.get(`/reviews/?album_id=${albumId}`),
  create: (data) => api.post('/reviews/', data),
  update: (id, data) => api.put(`/reviews/${id}/`, data),
  delete: (id) => api.delete(`/reviews/${id}/`),
  like: (reviewId) => api.post(`/reviews/${reviewId}/toggle_like/`),
  getLikeStatus: (reviewId) => api.get(`/reviews/${reviewId}/like_status/`),
};

export const usersAPI = {
  getAll: () => api.get('/users/'),
  getById: (id) => api.get(`/users/${id}/`),
  getCurrentUser: () => api.get('/users/me/'),
  updateProfile: (data) => api.patch('/users/me/', data),
  changePassword: (data) => api.post('/users/change-password/', data),
};

export const likesAPI = {
  getAll: (params = {}) => api.get('/likes/', { params }),
  create: (data) => api.post('/likes/', data),
  delete: (id) => api.delete(`/likes/${id}/`),
};

export default api;