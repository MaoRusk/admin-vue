import httpClient from '../../plugins/axios'

export default {
  async getReits (query, filters = {}, sorter = {}) {
    return httpClient.get(`/reits`, {
      params: {
        page: query?.page || null,
        size: query?.size || null,
        search: query?.search || null,
        ...filters,
        ...sorter,
      },
    })
  },

  async getReit (reitId) {
    const response = await httpClient.get(`/reits/${reitId}`)
    return response
  },

  createReit ({ name }) {
    return httpClient.post(`/reits`, {
      name,
    })
  },

  updateReit (reitId, { name }) {
    return httpClient.put(`/reits/${reitId}`, {
      name,
    })
  },

  deleteReit (reitId) {
    return httpClient.delete(`/reits/${reitId}`)
  },
}
