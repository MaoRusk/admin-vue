import httpClient from '../../plugins/axios'

export default {
  getContacts() {
    return httpClient.get('/contact')
  },

  getContact(id) {
    return httpClient.get(`/contact/${id}`)
  },

  getCompanyContacts(companyId) {
    return httpClient.get(`/companies/${companyId}/contact`)
  },

  createContact(companyId, contactData) {
    return httpClient.post(`/companies/${companyId}/contact`, contactData)
  },

  updateContact(companyId, contactId, data) {
    return httpClient.put(`/companies/${companyId}/contact/${contactId}`, data)
  },

  deleteContact(companyId, contactId) {
    return httpClient.delete(`/companies/${companyId}/contact/${contactId}`)
  }
} 