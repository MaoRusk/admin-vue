import httpClient from '../../plugins/axios'

const ROLES_BASE_URL = '/roles'

const RolesService = {
  getRoles() {
    return httpClient.get(ROLES_BASE_URL)
  },

  getRole(id) {
    return httpClient.get(`${ROLES_BASE_URL}/${id}`)
  },

  createRole(roleData) {
    return httpClient.post(ROLES_BASE_URL, roleData)
  },

  updateRole(id, roleData) {
    return httpClient.put(`${ROLES_BASE_URL}/${id}`, roleData)
  },

  deleteRole(id) {
    return httpClient.delete(`${ROLES_BASE_URL}/${id}`)
  }
}

export default RolesService 