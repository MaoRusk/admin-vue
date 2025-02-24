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
    console.log('Updating company:', id);
    
    // Convertir FormData a objeto para debugging
    const requestData = {};
    formData.forEach((value, key) => {
      requestData[key] = value;
    });
    console.log('Update request data:', requestData);

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

  // Método para obtener la URL completa de una imagen
  getImageUrl(path) {
    if (!path) return null;
    if (path.match(/^(http|https):\/\//)) {
      return path;
    }
    return `${httpClient.defaults.baseURL}/storage/${path}`;
  }
} 
