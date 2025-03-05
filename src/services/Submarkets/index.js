import httpClient from '../../plugins/axios'

export default {
  async getSubmarkets({ market_id }) {
    const response = await httpClient.get('/submarkets', {
      params: {
        market_id
      }
    })
    return response.data.data
  }
}
