import axios from 'axios'
import { AUTH_TOKEN } from '../constants'

const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

httpClient.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem(AUTH_TOKEN)
    
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    } else {
      delete config.headers['Authorization']
    }
    
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)
export default httpClient
