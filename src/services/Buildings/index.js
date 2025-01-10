import httpClient from '../../plugins/axios'

export default {
  getBuildings() {
    return httpClient.get(`/buildings`)
  },
  getBuilding(buildingId) {
    return httpClient.get(`/buildings/${buildingId}`)
  },
  createBuilding({
    region_id,
    market_id,
    sub_market_id,
    builder_id,
    industrial_park_id,
    developer_id,
    owner_id,
    user_owner_id,
    contact_id,
    building_name,
    building_size_sf,
    latitud,
    longitud,
    year_built,
    clear_height,
    total_land,
    offices_space,
    has_expansion_land,
    has_crane,
    has_hvac,
    has_rail_spur,
    has_sprinklers,
    has_office,
    has_leed,
    new_construction,
    starting_construction,
    hvac_production_area,
    ventilation,
    transformer_capacity,
    construction_state,
    roof_system,
    skylights_sf,
    coverage,
    kvas,
    created_by,
    updated_by,
    class: buildingClass,
    building_phase,
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
  }) {
    return httpClient.postForm(`/buildings`, {
      region_id,
      market_id,
      sub_market_id,
      builder_id,
      industrial_park_id,
      developer_id,
      owner_id,
      user_owner_id,
      contact_id,
      building_name,
      building_size_sf,
      latitud,
      longitud,
      year_built,
      clear_height,
      total_land,
      offices_space,
      has_expansion_land,
      has_crane,
      has_hvac,
      has_rail_spur,
      has_sprinklers,
      has_office,
      has_leed,
      new_construction,
      starting_construction,
      hvac_production_area,
      ventilation,
      transformer_capacity,
      construction_state,
      roof_system,
      skylights_sf,
      coverage,
      kvas,
      created_by,
      updated_by,
      class: buildingClass,
      building_phase,
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
    })
  },
  updateBuilding(
    buildingId,
    {
      region_id,
      market_id,
      sub_market_id,
      builder_id,
      industrial_park_id,
      developer_id,
      owner_id,
      user_owner_id,
      contact_id,
      building_name,
      building_size_sf,
      latitud,
      longitud,
      year_built,
      clear_height,
      total_land,
      offices_space,
      has_expansion_land,
      has_crane,
      has_hvac,
      has_rail_spur,
      has_sprinklers,
      has_office,
      has_leed,
      new_construction,
      starting_construction,
      hvac_production_area,
      ventilation,
      transformer_capacity,
      construction_state,
      roof_system,
      skylights_sf,
      coverage,
      kvas,
      created_by,
      updated_by,
      class: buildingClass,
      building_phase,
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
    },
  ) {
    return httpClient.put(`/buildings/${buildingId}`, {
      region_id,
      market_id,
      sub_market_id,
      builder_id,
      industrial_park_id,
      developer_id,
      owner_id,
      user_owner_id,
      contact_id,
      building_name,
      building_size_sf,
      latitud,
      longitud,
      year_built,
      clear_height,
      total_land,
      offices_space,
      has_expansion_land,
      has_crane,
      has_hvac,
      has_rail_spur,
      has_sprinklers,
      has_office,
      has_leed,
      new_construction,
      starting_construction,
      hvac_production_area,
      ventilation,
      transformer_capacity,
      construction_state,
      roof_system,
      skylights_sf,
      coverage,
      kvas,
      created_by,
      updated_by,
      class: buildingClass,
      building_phase,
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
  getBuildingsPhases() {
    return httpClient.get(`/buildings/phases`)
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
}
