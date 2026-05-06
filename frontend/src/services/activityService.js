import api from './api'

const activityService = {
  getAll: async () => {
    const response = await api.get('/activities')
    return response.data
  },
}

export default activityService
