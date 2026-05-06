import api from './api'

const recommendationService = {
  getAll: async () => {
    const response = await api.get('/user/rekomendasi')
    return response.data
  },
  getFeatured: async () => {
    const response = await api.get('/user/rekomendasi/featured')
    return response.data
  },
}

export default recommendationService
