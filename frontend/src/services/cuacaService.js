import api from './api'

const cuacaService = {
  getCurrentWeather: async () => {
    const response = await api.get('/cuaca/current')
    return response.data
  },
  getForecast: async (days = 7) => {
    const response = await api.get('/cuaca/forecast', { params: { days } })
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
