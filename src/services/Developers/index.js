import httpClient from '../../plugins/axios'

export default {
  getDevelopers() {
    return httpClient.get(`/developers`)
  },
  getDeveloper(developerId) {
    return httpClient.get(`/developers/${developerId}`)
  },
  createDeveloper({ name, is_developer, is_builder, is_owner, is_user_owner }) {
    return httpClient.post(`/developers`, {
      name,
      is_developer,
      is_builder,
      is_owner,
      is_user_owner,
    })
  },
  updateDeveloper(developerId, { name, is_developer, is_builder, is_owner, is_user_owner }) {
    return httpClient.put(`/developers/${developerId}`, {
      name,
      is_developer: is_developer ? 1 : 0,
      is_builder: is_builder ? 1 : 0,
      is_owner: is_owner ? 1 : 0,
      is_user_owner: is_user_owner ? 1 : 0,
    })
  },
}
