import httpClient from '../../plugins/axios'

export default {
  async getDevelopers({ is_owner, is_builder, is_developer, marketId, submarketId } = {}) {
    const params = {}
    if (is_owner) params.is_owner = is_owner
    if (is_builder) params.is_builder = is_builder
    if (is_developer) params.is_developer = is_developer

    if (marketId) params.market_id = marketId
    if (submarketId) params.submarket_id = submarketId

    return httpClient.get(`/developers`, {
      params,
    })
  },
  async getDeveloper(developerId) {
    const response = await httpClient.get(`/developers/${developerId}`)
    const data = response.data
    return {
      ...response,
      data: {
        ...data,
        is_developer: Boolean(data.is_developer),
        is_builder: Boolean(data.is_builder),
        is_owner: Boolean(data.is_owner),
        is_user_owner: Boolean(data.is_user_owner),
      },
    }
  },
  createDeveloper({ name, is_developer, is_builder, is_owner, is_user_owner }) {
    return httpClient.post(`/developers`, {
      name,
      is_developer,
      is_builder,
      is_owner,
      is_user_owner,
    })
  },
  updateDeveloper(developerId, { name, is_developer, is_builder, is_owner, is_user_owner }) {
    return httpClient.put(`/developers/${developerId}`, {
      name,
      is_developer: is_developer ? 1 : 0,
      is_builder: is_builder ? 1 : 0,
      is_owner: is_owner ? 1 : 0,
      is_user_owner: is_user_owner ? 1 : 0,
    })
  },
  deleteDeveloper(developerId) {
    return httpClient.delete(`/developers/${developerId}`)
  },
}
