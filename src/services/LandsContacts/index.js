import httpClient from '../../plugins/axios'

export default {
  getContacts(landId) {
    return httpClient.get(`lands/${landId}/contact`)
  },

  getContact(landId, contactId) {
    return httpClient.get(`lands/${landId}/contact/${contactId}`)
  },

  createContact(landId, contactData) {
    return httpClient.post(`lands/${landId}/contact`, contactData)
  },

  updateContact(landId, contactId, contactData) {
    return httpClient.put(`lands/${landId}/contact/${contactId}`, contactData)
  },

  deleteContact(landId, contactId) {
    return httpClient.delete(`lands/${landId}/contact/${contactId}`)
  }
} 