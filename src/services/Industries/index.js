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
  updateIndustry(industryId, { name }) {
    return httpClient.put(`/industries/${industryId}`, {
      name,
    })
  },
  deleteIndustry(industryId) {
    return httpClient.delete(`/industries/${industryId}`)
  },
}
