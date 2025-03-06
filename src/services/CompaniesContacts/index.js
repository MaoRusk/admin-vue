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

  updateContact(companyId, contactId, contactData) {
    return httpClient.put(`/companies/${companyId}/contact/${contactId}`, contactData)
  },

  deleteContact(companyId, contactId) {
    return httpClient.delete(`/companies/${companyId}/contact/${contactId}`)
  }
} 