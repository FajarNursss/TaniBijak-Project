import api from './api'

const userService = {
  getAllUsers: async (params = {}) => {
    const response = await api.get('/admin/users', { params })
    return response.data
  },
  getUserById: async (id) => {
    const response = await api.get(`/admin/users/${id}`)
    return response.data
  },
  createUser: async (data) => {
    const response = await api.post('/admin/users', data)
    return response.data
  },
  updateUser: async (id, data) => {
    const response = await api.put(`/admin/users/${id}`, data)
    return response.data
  },
  deleteUser: async (id) => {
    const response = await api.delete(`/admin/users/${id}`)
    return response.data
  },
  getDashboardStats: async () => {
    const response = await api.get('/user/dashboard')
    return response.data
  },
}

export default userService
