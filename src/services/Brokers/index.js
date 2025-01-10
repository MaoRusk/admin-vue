import httpClient from '../../plugins/axios'

export default {
  getBrokers() {
    return httpClient.get(`/brokers`)
  },
}
