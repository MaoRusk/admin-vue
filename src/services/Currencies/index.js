import httpClient from '../../plugins/axios'

export default {
  getCurrencies() {
    return httpClient.get(`/currencies`)
  },
}
