import httpClient from '../../plugins/axios'

export default {
  getTenants() {
    return httpClient.get(`/tenants`)
  },
  createTenant({ name }) {
    return httpClient.post(`/tenants`, {
      name,
    })
  },
  updateTenant(tenantId, { name }) {
    return httpClient.put(`/tenants/${tenantId}`, {
      name,
    })
  },
  deleteTenant(tenantId) {
    return httpClient.delete(`/tenants/${tenantId}`)
  },
}
