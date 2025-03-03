import axios from 'axios'
import router from '../router'
import { ROUTE_NAMES } from '../router/routeNames'
import { useAuthStore } from '../stores/auth'

const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

httpClient.interceptors.request.use((config) => {
  const store = useAuthStore()
  const token = store.token
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  } else {
    delete config.headers['Authorization']
  }
  return config
})

httpClient.interceptors.response.use(
  (config) => {
    return config
  },
  (error) => {
    const store = useAuthStore()
    if (error.response && error.response.status === axios.HttpStatusCode.Unauthorized) {
      store.destroyAuth()
      router.push({ name: ROUTE_NAMES.LOGIN })
    }
    return Promise.reject(error)
  },
)
export default httpClient
