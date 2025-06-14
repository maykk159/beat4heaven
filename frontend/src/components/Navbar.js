import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
  getAll: (params = {}) => api.get('/reviews/', { params }),
  getById: (id) => api.get(`/reviews/${id}/`),
  create: (data) => api.post('/reviews/', data),
  update: (id, data) => api.put(`/reviews/${id}/`, data),
  delete: (id) => api.delete(`/reviews/${id}/`),
  like: (id) => api.post(`/reviews/${id}/like/`),
};

export const usersAPI = {
  getAll: () => api.get('/users/'),
  getById: (id) => api.get(`/users/${id}/`),
};

export const likesAPI = {
  getAll: (params = {}) => api.get('/likes/', { params }),
  create: (data) => api.post('/likes/', data),
  delete: (id) => api.delete(`/likes/${id}/`),
};

export default api;