import httpClient from '../../plugins/axios'

export default {
  getSubmarkets() {
    return httpClient.get(`/submarkets`)
  },
}
