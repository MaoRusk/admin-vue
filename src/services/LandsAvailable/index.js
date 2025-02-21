import httpClient from '../../plugins/axios'

export default {
  getLandAvailability(landId, landAvailableId) {
    return httpClient.get(`/lands/${landId}/available/${landAvailableId}`)
  },
  getLandsAvailability(landId, query, filters = {}, sorter = {}) {
    return httpClient.get(`/lands/${landId}/available`, {
      params: {
        page: query?.page || null,
        size: query?.size || null,
        search: query?.search || null,
        ...filters,
        ...sorter,
      },
    })
  },
  createLandAvailability(
    landId,
    {
      land_condition,
      rail_spur,
      natural_gas,
      sewage,
      water,
      electric,
      kvas,
      avl_broker_id,
      avl_size_ha,
      avl_minimum,
      avl_min_sale,
      avl_max_sale,
      avl_conditioned_construction,
      avl_date,
      avl_deal,
      avl_comments,
    },
  ) {
    return httpClient.post(`/lands/${landId}/available`, {
      land_condition,
      rail_spur,
      natural_gas,
      sewage,
      water,
      electric,
      kvas,
      avl_broker_id,
      avl_size_ha,
      avl_minimum,
      avl_min_sale,
      avl_max_sale,
      avl_conditioned_construction,
      avl_date,
      avl_deal,
      avl_comments,
    })
  },
  updateLandAvailability(
    landId,
    landAvailableId,
    {
      land_condition,
      rail_spur,
      natural_gas,
      sewage,
      water,
      electric,
      kvas,
      avl_broker_id,
      avl_size_ha,
      avl_minimum,
      avl_min_sale,
      avl_max_sale,
      avl_conditioned_construction,
      avl_date,
      avl_deal,
      avl_comments,
    },
  ) {
    return httpClient.put(`/lands/${landId}/available/${landAvailableId}`, {
      land_condition,
      rail_spur,
      natural_gas,
      sewage,
      water,
      electric,
      kvas,
      avl_broker_id,
      avl_size_ha,
      avl_minimum,
      avl_min_sale,
      avl_max_sale,
      avl_conditioned_construction,
      avl_date,
      avl_deal,
      avl_comments,
    })
  },
  deleteLandAvailability(landId, landAvailableId) {
    return httpClient.delete(`/lands/${landId}/available/${landAvailableId}`)
  },
}
