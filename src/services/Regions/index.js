import httpClient from '../../plugins/axios'

export default {
  getRegions() {
    return httpClient.get(`/regions`)
  },
}
