import axios from 'axios'
import { AUTH_TOKEN } from '../constants'

const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

// Add a request interceptor
httpClient.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem(AUTH_TOKEN)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error)
  },
)
/*
// Add a response interceptor
httpClient.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error)
  },
)
*/
export default httpClient
