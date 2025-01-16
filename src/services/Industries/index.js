import httpClient from '../../plugins/axios'

export default {
  getIndustries() {
    return httpClient.get(`/industries`)
  },
  createIndustry({ name }) {
    return httpClient.post(`/industries`, {
      name,
    })
  },
  updateIndustry(industriyId, { name }) {
    return httpClient.put(`/industries/${industriyId}`, {
      name,
    })
  },
  deleteIndustry(industriyId) {
    return httpClient.delete(`/industries/${industriyId}`)
  },
}
