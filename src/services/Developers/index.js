import httpClient from '../../plugins/axios'

export default {
  getDevelopers() {
    return httpClient.get(`/developers`)
  },
  getDeveloper(developerId) {
    return httpClient.get(`/developers/${developerId}`)
  },
}
