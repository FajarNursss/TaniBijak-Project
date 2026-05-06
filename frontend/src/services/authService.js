import api from './api'

const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials)
    return response.data
  },

  register: async (data) => {
    const payload = {
      ...data,
      password_confirmation: data.confirmPassword,
    }
    delete payload.confirmPassword

    const response = await api.post('/auth/register', payload)
    return response.data
  },

  logout: async () => {
    await api.post('/auth/logout')
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile')
    return response.data
  },

  updateProfile: async (data) => {
    const response = await api.put('/auth/profile', data)
    return response.data
  },

  changePassword: async (data) => {
    const response = await api.put('/auth/change-password', data)
    return response.data
  },
}

export default authService
