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
  createContact(buildingId, { name, phone, email }) {
    return httpClient.post(`/buildings/${buildingId}/contact`, {
      contact_name: name,
      contact_phone: phone,
      contact_email: email,
    })
  },
  updateContact(buildingId, contactId, { name, phone, email }) {
    return httpClient.put(`/buildings/${buildingId}/contact/${contactId}`, {
      contact_name: name,
      contact_phone: phone,
      contact_email: email,
    })
  },
  deleteContact(buildingId, contactId) {
    return httpClient.delete(`/buildings/${buildingId}/contact/${contactId}`)
  },
}
