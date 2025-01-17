import httpClient from '../../plugins/axios'

export default {
  getSubmarkets(query) {
    return httpClient.get(`/submarkets`, {
      params: {
        market_id: query?.marketId || null,
      },
    })
  },
}
