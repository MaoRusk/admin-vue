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

  createCompany(formData) {
    return httpClient.post('/companies', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
  },

  updateCompany(id, formData) {
    return httpClient.post(`/companies/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json',
      }
    });
  },

  deleteCompany(companyId) {
    return httpClient.delete(`/companies/${companyId}`)
  },
} 
