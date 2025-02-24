import httpClient from '../../plugins/axios'

export default {

  getReits(query, filters = {}, sorter = {}) {
    return httpClient.get(`/reits`, {
      params: {
        page: query?.page || null,
        size: query?.size || null,
        search: query?.search || null,
        ...filters,
        ...sorter,
      },
    })
  },
}
