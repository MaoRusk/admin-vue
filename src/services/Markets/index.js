import httpClient from '../../plugins/axios'

export default {
  getMarkets() {
    return httpClient.get(`/markets`)
  },
}
