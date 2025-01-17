import httpClient from '../../plugins/axios'

export default {
  getCountries() {
    return httpClient.get(`/countries`)
  },
}
