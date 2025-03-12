import httpClient from '../../plugins/axios'

export default {
  getContacts(buildingId, query, filters = {}, sorter = {}) {
    return httpClient.get(`/buildings/${buildingId}/contact`, {
      params: {
        page: query?.page || null,
        size: query?.size || null,
        search: query?.search || null,
        ...filters,
        ...sorter,
      },
    })
  },
  getContact(buildingId, contactId) {
    return httpClient.get(`/buildings/${buildingId}/contact/${contactId}`)
  },
  createContact(buildingId, data) {
    return httpClient.post(`/buildings/${buildingId}/contact`, data)
  },
  updateContact(buildingId, contactId, data) {
    return httpClient.put(`/buildings/${buildingId}/contact/${contactId}`, data)
  },
  deleteContact(buildingId, contactId) {
    return httpClient.delete(`/buildings/${buildingId}/contact/${contactId}`)
  },
}
