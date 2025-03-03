import httpClient from '../../plugins/axios'

async function login({ username, password }) {
  const response = await httpClient.post(`/auth/login`, {
    user_name: username,
    password: password,
  })

  return response
}

async function me() {
  const response = await httpClient.get(`/auth/me`)
  return response
}

export default {
  login,
  me,
}
