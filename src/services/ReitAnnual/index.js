import httpClient from '../../plugins/axios'

const RESOURCE_URL = '/reit-annual'

export default {
  getAllReitAnnual() {
    return httpClient.get(RESOURCE_URL)
  },
  getReitAnnual(reitAnnualId) {
    return httpClient.get(`${RESOURCE_URL}/${reitAnnualId}`)
  },
  createReitAnnual({
    reit_id,
    year,
    quarter,
    noi,
    cap_rate,
    occupancy,
    m2,
    sqft,
    buildings,
    customer_retention_rate,
    average_rent,
    contracts,
    rental_income,
    dolar,
    prop_investment,
    type,
  }) {
    return httpClient.post(RESOURCE_URL, {
      reit_id,
      year,
      quarter,
      noi,
      cap_rate,
      occupancy,
      m2,
      sqft,
      buildings,
      customer_retention_rate,
      average_rent,
      contracts,
      rental_income,
      dolar,
      prop_investment,
      type,
    })
  },
  updateReitAnnual(
    reitAnnualId,
    {
      reit_id,
      year,
      quarter,
      noi,
      cap_rate,
      occupancy,
      m2,
      sqft,
      buildings,
      customer_retention_rate,
      average_rent,
      contracts,
      rental_income,
      dolar,
      prop_investment,
      type,
    },
  ) {
    return httpClient.put(`${RESOURCE_URL}/${reitAnnualId}`, {
      reit_id,
      year,
      quarter,
      noi,
      cap_rate,
      occupancy,
      m2,
      sqft,
      buildings,
      customer_retention_rate,
      average_rent,
      contracts,
      rental_income,
      dolar,
      prop_investment,
      type,
    })
  },
  deleteReitAnnual(reitAnnualId) {
    return httpClient.delete(`${RESOURCE_URL}/${reitAnnualId}`)
  },
}
