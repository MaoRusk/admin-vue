import httpClient from '../../plugins/axios'

export default {
  getCam(camId) {
    return httpClient.get(`/cams/${camId}`)
  },
  getCams(query, filters = {}, sorter = {}) {
    return httpClient.get(`/cams`, {
      params: {
        page: Number(query?.page) || 1,
        per_page: Number(query?.size) || 10,
        search: query?.search || '',
        ...filters,
        ...sorter,
      },
    })
  },
  createCam(body) {
    return httpClient.post(`/cams`, body)
  },
  updateCam(camId, body) {
    return httpClient.put(`/cams/${camId}`, body)
  },
  deleteCam(camId) {
    return httpClient.delete(`/cams/${camId}`)
  },
} 