import httpClient from '../../plugins/axios'

export default {
  async getReits() {
    const response = await httpClient.get(`/reits`)
    return response.data.data
  },

  async getReit(reitId) {
    const response = await httpClient.get(`/reits/${reitId}`)
    return response
  },

  createReit({ name }) {
    return httpClient.post(`/reits`, {
      name,
    })
  },

  updateReit(reitId, { name }) {
    return httpClient.put(`/reits/${reitId}`, {
      name,
    })
  },

  deleteReit(reitId) {
    return httpClient.delete(`/reits/${reitId}`)
  },
} 