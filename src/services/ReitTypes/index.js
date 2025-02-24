import httpClient from '../../plugins/axios'

export default {

  getReitType(reitTypeId) {
    return httpClient.get(`/reit-types/${reitTypeId}`)
  },
}
