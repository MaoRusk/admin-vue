import httpClient from '../../plugins/axios'

export default {
  getIndustries() {
    return httpClient.get(`/industries`)
  },
}
