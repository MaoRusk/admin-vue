import httpClient from '../../plugins/axios'

export default {
  getOwners() {
    return httpClient.get(`/owners`)
  },
}
