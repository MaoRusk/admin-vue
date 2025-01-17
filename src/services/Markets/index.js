import httpClient from '../../plugins/axios'

export default {
  getMarkets(query) {
    return httpClient.get(`/markets`, {
      params: {
        region_id: query?.regionId || null,
      },
    })
  },
}
