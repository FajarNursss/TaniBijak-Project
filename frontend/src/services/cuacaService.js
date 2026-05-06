import api from './api'

const cuacaService = {
  getCurrentWeather: async (location) => {
    const response = await api.get('/cuaca/current', { params: { location } })
    return response.data
  },
  getForecast: async (location, days = 7) => {
    const response = await api.get('/cuaca/forecast', { params: { location, days } })
    return response.data
  },
  getKlimData: async (params = {}) => {
    const response = await api.get('/cuaca/klimatologi', { params })
    return response.data
  },
  getRiskAnalysis: async (lahanId) => {
    const response = await api.get(`/cuaca/risk/${lahanId}`)
    return response.data
  },
  getHistoryWeather: async (params = {}) => {
    const response = await api.get('/cuaca/history', { params })
    return response.data
  },
}

export default cuacaService
