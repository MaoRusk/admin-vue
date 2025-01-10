import httpClient from '../../plugins/axios'

export default {
  getIndustrialParks() {
    return httpClient.get(`/industrial-parks`)
  },
  getIndustrialPark(industrialParkId) {
    return httpClient.get(`/industrial-parks/${industrialParkId}`)
  },
}
