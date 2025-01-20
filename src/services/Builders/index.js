import httpClient from '../../plugins/axios'

export default {
  getBuilders() {
    return httpClient.get(`/builder`)
  },
}
