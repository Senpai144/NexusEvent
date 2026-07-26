import axios from 'axios'

const API_URL = 'http://localhost:3000'

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('nexus_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('nexus_token')
      localStorage.removeItem('nexus_user')
    }
    if (!err.response) {
      err.userMessage = 'Impossible de contacter le serveur. Vérifiez votre connexion ou réessayez plus tard.'
      err.isNetworkError = true
    } else {
      err.userMessage = err.response?.data?.message || 'Une erreur est survenue'
    }
    return Promise.reject(err)
  },
)

export function getErrorMessage(err: any, fallback = 'Une erreur est survenue'): string {
  return err?.userMessage || err?.response?.data?.message || err?.message || fallback
}

export function isNetworkError(err: any): boolean {
  return !!err?.isNetworkError
}

export default api

export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (name: string, email: string, password: string) =>
    api.post('/auth/register', { name, email, password }),
  profile: () => api.get('/auth/profile'),
}

export const eventsApi = {
  getAll: (category?: string) =>
    api.get('/events', { params: category ? { category } : {} }),
  getOne: (id: string) => api.get(`/events/${id}`),
  create: (data: any) => api.post('/events', data),
  update: (id: string, data: any) => api.put(`/events/${id}`, data),
  delete: (id: string) => api.delete(`/events/${id}`),
}

export const bookingsApi = {
  getAll: () => api.get('/bookings'),
  getMine: () => api.get('/bookings/me'),
  getByEvent: (eventId: string) => api.get(`/bookings/event/${eventId}`),
  getOne: (id: string) => api.get(`/bookings/${id}`),
  create: (data: any) => api.post('/bookings', data),
  update: (id: string, data: any) => api.put(`/bookings/${id}`, data),
  delete: (id: string) => api.delete(`/bookings/${id}`),
}

export const reviewsApi = {
  getAll: () => api.get('/reviews'),
  getOne: (id: string) => api.get(`/reviews/${id}`),
  create: (data: any) => api.post('/reviews', data),
  update: (id: string, data: any) => api.put(`/reviews/${id}`, data),
  delete: (id: string) => api.delete(`/reviews/${id}`),
}

export const usersApi = {
  getAll: () => api.get('/users'),
  getOne: (id: string) => api.get(`/users/${id}`),
  update: (id: string, data: any) => api.put(`/users/${id}`, data),
  delete: (id: string) => api.delete(`/users/${id}`),
}

export const dashboardApi = {
  getStats: () => api.get('/dashboard/stats'),
  getTopEvents: () => api.get('/dashboard/top-events'),
  getRecentBookings: () => api.get('/dashboard/recent-bookings'),
}

export const weatherApi = {
  get: (city?: string) =>
    api.get('/weather', { params: city ? { city } : {} }),
}
