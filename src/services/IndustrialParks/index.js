import httpClient from '../../plugins/axios'

export default {
  getIndustrialParks(query) {
    return httpClient.get(`/industrial-parks`, {
      params: {
        market_id: query?.marketId || null,
        submarket_id: query?.submarketId || null,
      },
    })
  },
  getIndustrialPark(industrialParkId) {
    return httpClient.get(`/industrial-parks/${industrialParkId}`)
  },
}
