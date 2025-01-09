import httpClient from '../../plugins/axios'

function login({ username, password }) {
  return httpClient.post(`/auth/login`, {
    user_name: username,
    password: password,
  })
}

export default {
  login,
}
