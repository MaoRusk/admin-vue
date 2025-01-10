import httpClient from '../../plugins/axios'

export default {
  getTenants() {
    return httpClient.get(`/tenants`)
  },
}
