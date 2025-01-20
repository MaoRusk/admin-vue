import httpClient from '../../plugins/axios'

export default {
  getShelters() {
    return httpClient.get(`/shelters`)
  },
}
