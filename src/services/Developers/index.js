import httpClient from '../../plugins/axios'

export default {
  async getDevelopers({ is_owner, is_builder, is_developer, marketId, submarketId } = {}) {
    const params = {}
    if (is_owner) params.is_owner = is_owner
    if (is_builder) params.is_builder = is_builder
    if (is_developer) params.is_developer = is_developer

    if (marketId) params.market_id = marketId
    if (submarketId) params.submarket_id = submarketId

    const response = await httpClient.get(`/developers`, {
      params,
    })
    return response.data.data.map((item) => ({
      ...item,
      is_developer: !!item.is_developer,
      is_builder: !!item.is_builder,
      is_owner: !!item.is_owner,
    }))
  },
  async getDeveloper(developerId) {
    const response = await httpClient.get(`/developers/${developerId}`)
    const data = response.data
    return {
      ...response,
      data: {
        ...data,
        is_developer: !!data.is_developer,
        is_builder: !!data.is_builder,
        is_owner: !!data.is_owner,
      },
    }
  },
  createDeveloper({ name, is_developer, is_builder, is_owner, market_id, submarket_id }) {
    return httpClient.post(`/developers`, {
      name,
      is_developer,
      is_builder,
      is_owner,
      market_id,
      submarket_id,
    })
  },
  updateDeveloper(
    developerId,
    { name, is_developer, is_builder, is_owner, market_id, submarket_id },
  ) {
    return httpClient.put(`/developers/${developerId}`, {
      name,
      is_developer,
      is_builder,
      is_owner,
      market_id,
      submarket_id,
    })
  },
  deleteDeveloper(developerId) {
    return httpClient.delete(`/developers/${developerId}`)
  },
}
