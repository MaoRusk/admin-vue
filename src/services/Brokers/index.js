import httpClient from '../../plugins/axios'

export default {
  getBrokers() {
    return httpClient.get(`/brokers`)
  },
  getBroker(brokerId) {
    return httpClient.get(`/brokers/${brokerId}`)
  },
  createBroker({ name }) {
    return httpClient.post(`/brokers`, {
      name,
    })
  },
  updateBroker(brokerId, { name }) {
    return httpClient.put(`/brokers/${brokerId}`, {
      name,
    })
  },
  deleteBroker(brokerId) {
    return httpClient.delete(`/brokers/${brokerId}`)
  },
}
