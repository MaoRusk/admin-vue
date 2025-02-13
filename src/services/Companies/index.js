import httpClient from '../../plugins/axios'

export default {
  getCompanies(query, filters = {}, sorter = {}) {
    return httpClient.get(`/companies`, {
      params: {
        page: query?.page || null,
        size: query?.size || null,
        search: query?.search || null,
        ...filters,
        ...sorter,
      },
    })
  },

  getCompany(companyId) {
    return httpClient.get(`/companies/${companyId}`)
  },

  createCompany({ name, website, primary_color, secondary_color, logo }) {
    const formData = new FormData()
    formData.append('name', name)
    formData.append('website', website)
    formData.append('primary_color', primary_color)
    formData.append('secondary_color', secondary_color)
    
    if (logo instanceof File) {
      formData.append('logo', logo)
    }

    return httpClient.post(`/companies`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  updateCompany(companyId, { name, website, primary_color, secondary_color, logo }) {
    const formData = new FormData()
    formData.append('name', name)
    formData.append('website', website)
    formData.append('primary_color', primary_color)
    formData.append('secondary_color', secondary_color)
    formData.append('_method', 'PUT')
    
    if (logo instanceof File) {
      formData.append('logo', logo)
    }

    return httpClient.post(`/companies/${companyId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  deleteCompany(companyId) {
    return httpClient.delete(`/companies/${companyId}`)
  }
} 