import axios from 'axios'
import router from '../router'
import { AUTH_TOKEN } from '../constants'
import { ROUTE_NAMES } from '../router/routeNames'

const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

httpClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_TOKEN)
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
    if (error.response && error.response.status === axios.HttpStatusCode.Unauthorized) {
      localStorage.removeItem(AUTH_TOKEN)
      router.push({ name: ROUTE_NAMES.LOGIN })
    }
    return Promise.reject(error)
  },
)
export default httpClient
