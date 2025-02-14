import httpClient from '../../plugins/axios'

export default {
  getContacts(companyId) {
    return httpClient.get(`/companies/${companyId}/contact`)
  },

  getContact(companyId, contactId) {
    return httpClient.get(`/companies/${companyId}/contact/${contactId}`)
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