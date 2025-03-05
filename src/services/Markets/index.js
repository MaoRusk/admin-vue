import httpClient from '../../plugins/axios'

export default {
  async getMarkets(query) {
    const response = await httpClient.get(`/markets`, {
      params: {
        region_id: query?.regionId || null,
      },
    })
    return response.data.data // Asegurarnos de retornar el array de markets
  },
}
