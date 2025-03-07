import httpClient from '../../plugins/axios'

export default {
  async getSubmarkets(query) {
    const response = await httpClient.get(`/submarkets`, {
      params: {
        market_id: query?.market_id || null,
      },
    })
    return response.data.data
  },
}
