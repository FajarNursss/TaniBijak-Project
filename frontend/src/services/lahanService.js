import api from './api'

const lahanService = {
  getMyLahan: async () => {
    const response = await api.get('/user/lahan')
    return response.data
  },
  getLahanById: async (id) => {
    const response = await api.get(`/user/lahan/${id}`)
    return response.data
  },
  createLahan: async (data) => {
    const response = await api.post('/user/lahan', data)
    return response.data
  },
  updateLahan: async (id, data) => {
    const response = await api.put(`/user/lahan/${id}`, data)
    return response.data
  },
  deleteLahan: async (id) => {
    const response = await api.delete(`/user/lahan/${id}`)
    return response.data
  },
  getAllLahan: async (params = {}) => {
    const response = await api.get('/admin/lahan', { params })
    return response.data
  },
  getRekomendasiTanam: async (lahanId) => {
    const response = await api.get(`/user/lahan/${lahanId}/rekomendasi`)
    return response.data
  },
}

export default lahanService
