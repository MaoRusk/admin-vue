import httpClient from '../../plugins/axios'

const USERS_BASE_URL = '/users'

async function getUsers(params = {}, filters = {}, sorter = {}) {
  return httpClient.get(USERS_BASE_URL, { params: { ...params, filters, sorter } })
}

async function getUser(id) {
  return httpClient.get(`${USERS_BASE_URL}/${id}`)
}

async function createUser(userData) {
  return httpClient.post(USERS_BASE_URL, userData)
}

async function updateUser(id, userData) {
  if (id === 0) {
    throw new Error('Cannot update user with ID 0')
  }
  return httpClient.put(`${USERS_BASE_URL}/${id}`, userData)
}

async function deleteUser(id) {
  return httpClient.delete(`${USERS_BASE_URL}/${id}`)
}

export default {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
} 