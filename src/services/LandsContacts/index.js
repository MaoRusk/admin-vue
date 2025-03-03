import httpClient from '../../plugins/axios'

export default {
  getContacts(landId) {
    return httpClient.get(`lands/${landId}/contacts`)
  },

  getContact(landId, contactId) {
    return httpClient.get(`lands/${landId}/contacts/${contactId}`)
  },

  createContact(landId, data) {
    return httpClient.post(`lands/${landId}/contacts`, data)
  },

  updateContact(landId, contactId, data) {
    return httpClient.put(`lands/${landId}/contacts/${contactId}`, data)
  },

  deleteContact(landId, contactId) {
    return httpClient.delete(`lands/${landId}/contacts/${contactId}`)
  }
} 