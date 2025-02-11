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
  createBuilding({
    region_id,
    market_id,
    submarket_id,
    builder_id,
    industrial_park_id,
    developer_id,
    owner_id,
    building_name,
    building_size_sf,
    latitud,
    longitud,
    year_built,
    clear_height_ft,
    total_land_sf,
    offices_space_sf,
    has_crane,
    has_rail_spur,
    has_leed,
    hvac_production_area,
    ventilation,
    roof_system,
    skylights_sf,
    coverage,
    kvas,
    expansion_land,
    class: classBuilding,
    type_generation,
    currency,
    tenancy,
    construction_type,
    lightning,
    fire_protection_system,
    deal,
    loading_door,
    above_market_tis,
    status,
    columns_spacing_ft,
    bay_size,
    floor_thickness_in,
    floor_resistance,
    expansion_up_to_sf,
    sfSm,
  }) {
    return httpClient.post(`/buildings`, {
      region_id,
      market_id,
      submarket_id,
      builder_id,
      industrial_park_id,
      developer_id,
      owner_id,
      building_name,
      building_size_sf,
      latitud,
      longitud,
      year_built,
      clear_height_ft,
      total_land_sf,
      offices_space_sf,
      has_crane,
      has_rail_spur,
      has_leed,
      hvac_production_area,
      ventilation,
      roof_system,
      skylights_sf,
      coverage,
      kvas,
      expansion_land,
      class: classBuilding,
      type_generation,
      currency,
      tenancy,
      construction_type,
      lightning,
      fire_protection_system,
      deal,
      loading_door,
      above_market_tis,
      status,
      columns_spacing_ft,
      bay_size,
      floor_thickness_in,
      floor_resistance,
      expansion_up_to_sf,
      sqftToM2: sfSm,
    })
  },
  updateBuilding(
    buildingId,
    {
      region_id,
      market_id,
      submarket_id,
      builder_id,
      industrial_park_id,
      developer_id,
      owner_id,
      building_name,
      building_size_sf,
      latitud,
      longitud,
      year_built,
      clear_height_ft,
      total_land_sf,
      offices_space_sf,
      has_crane,
      has_rail_spur,
      has_leed,
      hvac_production_area,
      ventilation,
      roof_system,
      skylights_sf,
      coverage,
      kvas,
      expansion_land,
      class: classBuilding,
      type_generation,
      currency,
      tenancy,
      construction_type,
      lightning,
      fire_protection_system,
      deal,
      loading_door,
      above_market_tis,
      status,
      columns_spacing_ft,
      bay_size,
      floor_thickness_in,
      floor_resistance,
      expansion_up_to_sf,
      sfSm,
    },
  ) {
    return httpClient.put(`/buildings/${buildingId}`, {
      region_id,
      market_id,
      submarket_id,
      builder_id,
      industrial_park_id,
      developer_id,
      owner_id,
      building_name,
      building_size_sf,
      latitud,
      longitud,
      year_built,
      clear_height_ft,
      total_land_sf,
      offices_space_sf,
      has_crane,
      has_rail_spur,
      has_leed,
      hvac_production_area,
      ventilation,
      roof_system,
      skylights_sf,
      coverage,
      kvas,
      expansion_land,
      class: classBuilding,
      type_generation,
      currency,
      tenancy,
      construction_type,
      lightning,
      fire_protection_system,
      deal,
      loading_door,
      above_market_tis,
      status,
      columns_spacing_ft,
      bay_size,
      floor_thickness_in,
      floor_resistance,
      expansion_up_to_sf,
      sqftToM2: sfSm,
    })
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
