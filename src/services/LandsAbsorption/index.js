import httpClient from '../../plugins/axios'

export default {
  getLandAbsorption(landId, landAbsorptionId) {
    return httpClient.get(`/lands/${landId}/absorption/${landAbsorptionId}`)
  },
  getLandsAbsorption(landId) {
    return httpClient.get(`/lands/${landId}/absorption`)
  },
  createLandAbsorption(
    landId,
    {
      land_condition,
      rail_spur,
      natural_gas,
      sewage,
      water,
      electric,
      kvas,
      abs_company_id,
      abs_country_id,
      abs_size_ha,
      abs_date,
      abs_closing_price,
      abs_type_buyer,
      abs_company_type,
      abs_industry_id,
      abs_final_use,
      abs_broker_id,
      abs_comments,
      abs_kvas_price,
    },
  ) {
    return httpClient.post(`/lands/${landId}/absorption`, {
      land_condition,
      rail_spur,
      natural_gas,
      sewage,
      water,
      electric,
      kvas,
      abs_company_id,
      abs_country_id,
      abs_size_ha,
      abs_date,
      abs_closing_price,
      abs_type_buyer,
      abs_company_type,
      abs_industry_id,
      abs_final_use,
      abs_broker_id,
      abs_comments,
      abs_kvas_price,
    })
  },
  updateLandAbsorption(
    landId,
    landAbsorptionId,
    {
      land_condition,
      rail_spur,
      natural_gas,
      sewage,
      water,
      electric,
      kvas,
      abs_company_id,
      abs_country_id,
      abs_size_ha,
      abs_date,
      abs_closing_price,
      abs_type_buyer,
      abs_company_type,
      abs_industry_id,
      abs_final_use,
      abs_broker_id,
      abs_comments,
      abs_kvas_price,
    },
  ) {
    return httpClient.put(`/lands/${landId}/absorption/${landAbsorptionId}`, {
      land_condition,
      rail_spur,
      natural_gas,
      sewage,
      water,
      electric,
      kvas,
      abs_company_id,
      abs_country_id,
      abs_size_ha,
      abs_date,
      abs_closing_price,
      abs_type_buyer,
      abs_company_type,
      abs_industry_id,
      abs_final_use,
      abs_broker_id,
      abs_comments,
      abs_kvas_price,
    })
  },
  deleteLandAbsorption(landId, landAbsorptionId) {
    return httpClient.delete(`/lands/${landId}/absorption/${landAbsorptionId}`)
  },
}
