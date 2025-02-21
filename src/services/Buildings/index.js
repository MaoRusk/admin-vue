import httpClient from '../../plugins/axios'

export default {
  getBuildings(query, filters = {}, sorter = {}) {
    return httpClient.get(`/buildings`, {
      params: {
        page: query?.page || null,
        size: query?.size || null,
        search: query?.search || null,
        ...filters,
        ...sorter,
      },
    })
  },
  getBuilding(buildingId) {
    return httpClient.get(`/buildings/${buildingId}`)
  },
  createBuilding(formData) {
    return httpClient.post(`/buildings`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
  },
  updateBuilding(buildingId, formData) {
    return httpClient.post(`/buildings/${buildingId}`, formData, {
      headers: {"Content-Type": "multipart/form-data"}
    });
  },
  deleteBuilding(buildingId) {
    return httpClient.delete(`/buildings/${buildingId}`)
  },
  getBuildingsClasses() {
    return httpClient.get(`/buildings/classes`)
  },
  getBuildingsLoadingDoors() {
    return httpClient.get(`/buildings/loading-doors`)
  },
  getBuildingsPhases({ availability, absorption }) {
    const params = {}
    if (availability) params.availability = true
    if (absorption) params.absorption = true

    return httpClient.get(`/buildings/phases`, {
      params,
    })
  },
  getBuildingsTypesGeneration() {
    return httpClient.get(`/buildings/types-generation`)
  },
  getBuildingsTypesConstruction() {
    return httpClient.get(`/buildings/types-construction`)
  },
  getBuildingsTypesLightnings() {
    return httpClient.get(`/buildings/lightnings`)
  },
  getBuildingsTypesDeals() {
    return httpClient.get(`/buildings/deals`)
  },
  getBuildingsFireProtectionSystems() {
    return httpClient.get(`/buildings/fire-protection-systems`)
  },
  getBuildingsTenancies() {
    return httpClient.get(`/buildings/tenancies`)
  },
  getBuildingsTechnicalImprovements() {
    return httpClient.get(`/buildings/technical-improvements`)
  },
  getBuildingsStatus() {
    return httpClient.get(`/buildings/status`)
  },
  getBuildingsFinalUses() {
    return httpClient.get(`/buildings/final-uses`)
  },
  getBuildingsCompanyTypes() {
    return httpClient.get(`/buildings/company-types`)
  },
}
