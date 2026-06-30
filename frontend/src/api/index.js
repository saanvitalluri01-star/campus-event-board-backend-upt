import api from './axios'

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
}

// ─── Events ───────────────────────────────────────────────────────────────────
export const eventsAPI = {
  getAll: (params) => api.get('/events', { params }),
  getById: (id) => api.get(`/events/${id}`),
  getUpcoming: (limit = 6) => api.get('/events/upcoming', { params: { limit } }),
  getPopular: (limit = 6) => api.get('/events/popular', { params: { limit } }),
  create: (data) => api.post('/events', data),
  update: (id, data) => api.put(`/events/${id}`, data),
  delete: (id) => api.delete(`/events/${id}`),
  rsvp: (id) => api.post(`/events/${id}/rsvp`),
  cancelRsvp: (id) => api.delete(`/events/${id}/rsvp`),
  getAttendees: (id) => api.get(`/events/${id}/attendees`),
}

// ─── Users ────────────────────────────────────────────────────────────────────
export const usersAPI = {
  getMyEvents: (params) => api.get('/users/my-events', { params }),
  getMyRsvps: (params) => api.get('/users/my-rsvps', { params }),
}
