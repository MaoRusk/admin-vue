import httpClient from '../../plugins/axios'

export default {
  async getDevelopers({ is_owner, is_builder, is_developer, marketId, submarketId } = {}) {
    const params = {}
    if (is_owner) params.is_owner = is_owner
    if (is_builder) params.is_builder = is_builder
    if (is_developer) params.is_developer = is_developer
    if (marketId) params.market_id = marketId
    if (submarketId) params.sub_market_id = submarketId

    const response = await httpClient.get(`/developers`, { 
      params,
      params: {
        with: ['market', 'subMarket']
      }
    })
    
    return response.data.data.map(developer => ({
      ...developer,
      market_name: developer.market?.name || '-',
      sub_market_name: developer.sub_market?.name || '-'
    }))
  },
  async getDeveloper(developerId) {
    try {
      console.log('Fetching developer with ID:', developerId)
      const response = await httpClient.get(`/developers/${developerId}`, {
        params: {
          with: ['market', 'subMarket']
        }
      })
      console.log('API Response:', response)
      console.log('Developer data:', response.data)
      return response.data
    } catch (error) {
      console.error('Error in getDeveloper service:', error)
      throw error
    }
  },
  createDeveloper({ name, is_developer, is_builder, is_owner, market_id, sub_market_id }) {
    return httpClient.post(`/developers`, {
      name,
      is_developer: Boolean(is_developer),
      is_builder: Boolean(is_builder),
      is_owner: Boolean(is_owner),
      market_id: market_id ? Number(market_id) : null,
      sub_market_id: sub_market_id ? Number(sub_market_id) : null
    })
  },
  updateDeveloper(developerId, { name, is_developer, is_builder, is_owner, market_id, sub_market_id }) {
    if (!name?.trim()) {
      throw new Error('Name is required')
    }
    if (!market_id) {
      throw new Error('Market is required')
    }
    if (!sub_market_id) {
      throw new Error('SubMarket is required')
    }

    const payload = {
      name: name.trim(),
      is_developer: is_developer ? 1 : 0,
      is_builder: is_builder ? 1 : 0,
      is_owner: is_owner ? 1 : 0,
      market_id: Number(market_id),     // Ya no permitimos null
      sub_market_id: Number(sub_market_id)  // Ya no permitimos null
    }

    return httpClient.put(`/developers/${developerId}`, payload)
  },
  deleteDeveloper(developerId) {
    return httpClient.delete(`/developers/${developerId}`)
  },
}
