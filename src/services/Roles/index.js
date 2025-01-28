import httpClient from '../../plugins/axios'

const ROLES_BASE_URL = '/roles'

async function getAllRoles() {
  try {
    const response = await httpClient.get('/roles')
    return response
  } catch (error) {
    console.error('Error getting roles:', error)
    throw error
  }
}

async function getRoleById(id) {
  try {
    const response = await httpClient.get(`/roles/${id}`)
    return response
  } catch (error) {
    console.error('Error getting role:', error)
    throw error
  }
}

async function createRole(roleData) {
  try {
    const response = await httpClient.post(ROLES_BASE_URL, roleData)
    return response.data
  } catch (error) {
    console.error('Error creating role:', error)
    throw error
  }
}

async function updateRole(id, roleData) {
  try {
    const response = await httpClient.put(`${ROLES_BASE_URL}/${id}`, roleData)
    return response.data
  } catch (error) {
    console.error('Error updating role:', error)
    throw error
  }
}

async function deleteRole(id) {
  try {
    const response = await httpClient.delete(`${ROLES_BASE_URL}/${id}`)
    return response.data
  } catch (error) {
    console.error('Error deleting role:', error)
    throw error
  }
}

export default {
  getAllRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
} 