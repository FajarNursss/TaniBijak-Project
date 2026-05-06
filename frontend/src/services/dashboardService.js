import api from './api'

const dashboardService = {
  getUserDashboard: async () => {
    const response = await api.get('/user/dashboard')
    return response.data
  },
  getAdminDashboard: async () => {
    const response = await api.get('/admin/dashboard')
    return response.data
  },
}

export default dashboardService
