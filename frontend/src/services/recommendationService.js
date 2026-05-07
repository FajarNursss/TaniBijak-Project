import api from './api'

const recommendationService = {
  getAll: async (params = {}) => {
    const response = await api.get('/user/rekomendasi', { params })
    return response.data
  },
  getFeatured: async (params = {}) => {
    const response = await api.get('/user/rekomendasi/featured', { params })
    return response.data
  },
}

export default recommendationService
