import httpClient from '../../plugins/axios'

export default {
  getIndustrialParks(query) {
    return httpClient.get(`/industrial-parks`, {
      params: {
        market_id: query?.marketId || null,
        sub_market_id: query?.submarketId || null,
      },
    })
  },
  getIndustrialPark(industrialParkId) {
    return httpClient.get(`/industrial-parks/${industrialParkId}`)
  },
  createIndustrialPark({ name, market_id, sub_market_id }) {
    return httpClient.post(`/industrial-parks`, {
      name,
      market_id,
      sub_market_id,
    })
  },
  updateIndustrialPark(industrialParkId, { name, market_id, sub_market_id }) {
    return httpClient.put(`/industrial-parks/${industrialParkId}`, {
      name,
      market_id,
      sub_market_id,
    })
  },
  deleteIndustrialPark(industrialParkId) {
    return httpClient.delete(`/industrial-parks/${industrialParkId}`)
  },
}
