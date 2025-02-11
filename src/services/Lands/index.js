import httpClient from '../../plugins/axios'

export default {
  getLand(landId) {
    return httpClient.get(`/lands/${landId}`)
  },
  getLands() {
    return httpClient.get(`/lands`)
  },
  createLand({
    region_id,
    market_id,
    sub_market_id,
    industrial_park_id,
    developer_id,
    owner_id,
    contact_id,
    land_name,
    currency,
    latitud,
    longitud,
    size_ha,
    kvas,
    zoning,
    parcel_shape,
    status,
  }) {
    return httpClient.post(`/lands`, {
      region_id,
      market_id,
      sub_market_id,
      industrial_park_id,
      developer_id,
      owner_id,
      contact_id,
      land_name,
      currency,
      latitud,
      longitud,
      size_ha,
      kvas,
      zoning,
      parcel_shape,
      status,
    })
  },
  updateLand(
    landId,
    {
      region_id,
      market_id,
      sub_market_id,
      industrial_park_id,
      developer_id,
      owner_id,
      contact_id,
      land_name,
      currency,
      latitud,
      longitud,
      size_ha,
      kvas,
      zoning,
      parcel_shape,
      status,
    },
  ) {
    return httpClient.put(`/lands/${landId}`, {
      region_id,
      market_id,
      sub_market_id,
      industrial_park_id,
      developer_id,
      owner_id,
      contact_id,
      land_name,
      currency,
      latitud,
      longitud,
      size_ha,
      kvas,
      zoning,
      parcel_shape,
      status,
    })
  },
  deleteLand(landId) {
    return httpClient.delete(`/lands/${landId}`)
  },
  getLandZoning() {
    return httpClient.get(`/lands/zoning`)
  },
  getLandParcelShape() {
    return httpClient.get(`/lands/parcel-shape`)
  },
}
