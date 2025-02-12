import httpClient from '../../plugins/axios'

export default {
  async getCompanies() {
    const response = await httpClient.get(`/companies`, {})
    return response
  },
  async getCompany(companyId) {
    const response = await httpClient.get(`/companies/${companyId}`)
    return response
  },
  createCompany() {
    return httpClient.post(`/companies`, {})
  },
  updateCompany(companyId) {
    return httpClient.put(`/companies/${companyId}`, {})
  },
  deleteCompany(companyId) {
    return httpClient.delete(`/companies/${companyId}`)
  },
}
