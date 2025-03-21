import httpClient from '../../plugins/axios'

export default {
  getMarketGrowth(marketGrowthId) {
    return httpClient.get(`/market-growths/${marketGrowthId}`)
  },
  getMarketGrowths(query, filters = {}, sorter = {}) {
    return httpClient.get(`/market-growths`, {
      params: {
        page: query?.page || null,
        size: query?.size || null,
        search: query?.search || null,
        ...filters,
        ...sorter,
      },
    })
  },
  createMarketGrowth({
    building_id,
    owner_id,
    developer_id,
    builder_id,
    industrial_park_id,
    region_id,
    market_id,
    sub_market_id,
    size_sf,
    deal,
    type,
    start_date,
    end_date,
    comments,
    latitude,
    longitude,
  }) {
    return httpClient.post(`/market-growths`, {
      building_id,
      owner_id,
      developer_id,
      builder_id,
      industrial_park_id,
      region_id,
      market_id,
      sub_market_id,
      size_sf,
      deal,
      type,
      start_date,
      end_date,
      comments,
      latitude,
      longitude,
    })
  },
  updateMarketGrowth(
    marketGrowthId,
    {
      building_id,
      owner_id,
      developer_id,
      builder_id,
      industrial_park_id,
      region_id,
      market_id,
      sub_market_id,
      size_sf,
      deal,
      type,
      start_date,
      end_date,
      comments,
      latitude,
      longitude,
    },
  ) {
    return httpClient.put(`/market-growths/${marketGrowthId}`, {
      building_id,
      owner_id,
      developer_id,
      builder_id,
      industrial_park_id,
      region_id,
      market_id,
      sub_market_id,
      size_sf,
      deal,
      type,
      start_date,
      end_date,
      comments,
      latitude,
      longitude,
    })
  },
  deleteMarketGrowth(marketGrowthId) {
    return httpClient.delete(`/market-growths/${marketGrowthId}`)
  },
  getTypes() {
    return httpClient.get('/market-growths/types')
  },
  getDeals() {
    return httpClient.get('/market-growths/deals')
  },
} 