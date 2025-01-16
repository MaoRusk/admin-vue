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
}
