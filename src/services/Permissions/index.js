import httpClient from '../../plugins/axios'

const PERMISSIONS_BASE_URL = '/permissions'

const PermissionsService = {
  getPermissions() {
    return httpClient.get(PERMISSIONS_BASE_URL)
  }
}

export default PermissionsService 