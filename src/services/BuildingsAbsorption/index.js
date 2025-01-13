import httpClient from '../../plugins/axios'

export default {
  getAbsorptionBuildings(buildingId) {
    return httpClient.get(`/buildings/${buildingId}/absorption`)
  },
  getAbsorptionBuilding(buildingAbsoprtionId, buildingId) {
    return httpClient.get(`/buildings/${buildingId}/absorption/${buildingAbsoprtionId}`)
  },
  createAbsorptionBuilding(
    buildingId,
    {
      building_id,
      abs_tenant_id,
      abs_industry_id,
      abs_country_id,
      broker_id,
      dock_doors,
      drive_in_door,
      floor_thickness,
      floor_resistance,
      truck_court,
      has_crossdock,
      shared_truck,
      new_construction,
      is_starting_construction,
      bay_size,
      columns_spacing,
      abs_lease_term_month,
      knockouts_docks,
      parking_space,
      abs_asking_rate_shell,
      abs_closing_rate,
      abs_closing_date,
      abs_lease_up,
      abs_month,
      abs_sale_price,
      building_state,
      abs_building_phase,
      abs_final_use,
      abs_company_type,
    },
  ) {
    return httpClient.post(`/buildings/${buildingId}/absorption`, {
      building_id,
      abs_tenant_id,
      abs_industry_id,
      abs_country_id,
      broker_id,
      dock_doors,
      drive_in_door,
      floor_thickness,
      floor_resistance,
      truck_court,
      has_crossdock,
      shared_truck,
      new_construction,
      is_starting_construction,
      bay_size,
      columns_spacing,
      abs_lease_term_month,
      knockouts_docks,
      parking_space,
      abs_asking_rate_shell,
      abs_closing_rate,
      abs_closing_date,
      abs_lease_up,
      abs_month,
      abs_sale_price,
      building_state,
      abs_building_phase,
      abs_final_use,
      abs_company_type,
    })
  },
  updateAbsorptionBuilding(
    buildingAbsoprtionId,
    buildingId,
    {
      building_id,
      abs_tenant_id,
      abs_industry_id,
      abs_country_id,
      broker_id,
      dock_doors,
      drive_in_door,
      floor_thickness,
      floor_resistance,
      truck_court,
      has_crossdock,
      shared_truck,
      new_construction,
      is_starting_construction,
      bay_size,
      columns_spacing,
      abs_lease_term_month,
      knockouts_docks,
      parking_space,
      abs_asking_rate_shell,
      abs_closing_rate,
      abs_closing_date,
      abs_lease_up,
      abs_month,
      abs_sale_price,
      building_state,
      abs_building_phase,
      abs_final_use,
      abs_company_type,
    },
  ) {
    return httpClient.put(`/buildings/${buildingId}/absorption/${buildingAbsoprtionId}`, {
      building_id,
      abs_tenant_id,
      abs_industry_id,
      abs_country_id,
      broker_id,
      dock_doors,
      drive_in_door,
      floor_thickness,
      floor_resistance,
      truck_court,
      has_crossdock,
      shared_truck,
      new_construction,
      is_starting_construction,
      bay_size,
      columns_spacing,
      abs_lease_term_month,
      knockouts_docks,
      parking_space,
      abs_asking_rate_shell,
      abs_closing_rate,
      abs_closing_date,
      abs_lease_up,
      abs_month,
      abs_sale_price,
      building_state,
      abs_building_phase,
      abs_final_use,
      abs_company_type,
    })
  },
  deleteAbsorptionBuilding(buildingAbsoprtionId, buildingId) {
    return httpClient.delete(`/buildings/${buildingId}/absorption/${buildingAbsoprtionId}`)
  },
}
