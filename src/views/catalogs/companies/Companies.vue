<script>
import { API } from '@/services'
import Swal from 'sweetalert2'
import { ROUTE_NAMES } from '@/router/routeNames'

export default {
  name: 'Companies',
  data() {
    return {
      companies: [],
      columns: [
        {
          key: 'logo',
          label: 'Logo',
          _style: { width: '10%', textAlign: 'center' }
        },
        {
          key: 'name',
          label: 'Name',
          _style: { width: '30%' }
        },
        {
          key: 'colors',
          label: 'Colors',
          _style: { width: '30%' }
        },
        {
          key: 'actions',
          label: 'Actions',
          _style: { width: '20%', textAlign: 'center' }
        },
      ],
    }
  },
  methods: {
    async fetchData() {
      try {
        const response = await API.companies.getCompanies()
        this.companies = response.data.data
      } catch (error) {
        console.error('Error fetching companies:', error)
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Error loading companies',
          toast: true,
          position: 'bottom',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true
        })
      }
    },
    newCompany() {
      this.$router.push({ 
        name: ROUTE_NAMES.COMPANY_DETAIL,
        params: { id: '0' }
      });
    },
    viewDetails(item) {
      this.$router.push({ 
        name: ROUTE_NAMES.COMPANY_DETAIL,
        params: { id: item.id }
      });
    },
    async deleteCompany(item) {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      })

      if (result.isConfirmed) {
        try {
          await API.companies.deleteCompany(item.id)
          await this.fetchData()
          
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: `${item.name} has been deleted.`,
            toast: true,
            position: 'bottom',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
          })
        } catch (error) {
          console.error('Error deleting company:', error)
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Error deleting company',
            toast: true,
            position: 'bottom',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
          })
        }
      }
    }
  },
  mounted() {
    this.fetchData()
  }
}
</script>

<template>
  <!-- Botón New Company responsive -->
  <CCard class="mb-4">
    <CCardBody class="p-3">
      <CRow class="align-items-center">
        <CCol :xs="12" class="text-end">
          <CButton color="success" @click="newCompany()">
            <CIcon icon="cilPlus" class="me-2" />New Company
          </CButton>
        </CCol>
      </CRow>
    </CCardBody>
  </CCard>

  <CCard class="mb-4">
    <CCardBody class="p-3">
      <div class="table-responsive">
        <CSmartTable
          v-if="companies.length > 0"
          :active-page="1"
          :items="companies"
          :columns="columns"
          :items-per-page="10"
          :table-filter="true"
          cleaner
          :table-filter-label="'Search:'"
          :table-filter-placeholder="'Type something...'"
          :pagination="true"
          hover
          responsive
        >
          <!-- Logo Column -->
          <template #logo="{ item }">
            <td class="text-center py-2">
              <div class="company-logo-container">
                <img 
                  v-if="item.logo"
                  :src="item.logo"
                  alt="Company Logo"
                  class="company-logo"
                />
                <span v-else class="text-muted small">No logo</span>
              </div>
            </td>
          </template>

          <!-- Colors Column -->
          <template #colors="{ item }">
            <td class="py-2">
              <div class="colors-container">
                <div class="color-item">
                  <div 
                    class="color-box"
                    :style="{
                      backgroundColor: item.primary_color
                    }"
                  ></div>
                  <small class="color-value">{{ item.primary_color }}</small>
                </div>
                <div class="color-item">
                  <div 
                    class="color-box"
                    :style="{
                      backgroundColor: item.secondary_color
                    }"
                  ></div>
                  <small class="color-value">{{ item.secondary_color }}</small>
                </div>
              </div>
            </td>
          </template>

          <!-- Actions Column -->
          <template #actions="{ item }">
            <td class="text-center py-2">
              <div class="actions-container">
                <CButton 
                  color="primary" 
                  variant="outline" 
                  square 
                  size="sm" 
                  @click="viewDetails(item)"
                  class="action-button"
                >
                  <CIcon icon="cil-pencil" />
                </CButton>
                <CButton 
                  color="danger" 
                  variant="outline" 
                  square 
                  size="sm" 
                  @click="deleteCompany(item)"
                  class="action-button"
                >
                  <CIcon icon="cil-trash" />
                </CButton>
              </div>
            </td>
          </template>
        </CSmartTable>
      </div>
    </CCardBody>
  </CCard>
</template>

<style scoped>
/* Estilos base */
.company-logo {
  max-height: 40px;
  max-width: 100px;
  object-fit: contain;
}

.color-box {
  width: 20px;
  height: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.colors-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.color-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.actions-container {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.action-button {
  margin: 0.25rem;
}

/* Estilos responsive */
@media (max-width: 768px) {
  .company-logo-container {
    padding: 0.5rem;
  }

  .company-logo {
    max-width: 80px;
  }

  .colors-container {
    flex-direction: column;
    gap: 0.5rem;
  }

  .color-item {
    justify-content: flex-start;
  }

  .color-value {
    font-size: 0.75rem;
  }

  .actions-container {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
  }

  .action-button {
    padding: 0.375rem 0.5rem;
  }

  /* Ajustes para la tabla en móvil */
  :deep(.table) {
    font-size: 0.875rem;
  }

  :deep(.table td) {
    padding: 0.5rem;
  }

}

/* Ajustes para pantallas muy pequeñas */
@media (max-width: 576px) {
  .company-logo {
    max-width: 60px;
  }

  .color-box {
    width: 16px;
    height: 16px;
  }

  .action-button {
    padding: 0.25rem 0.375rem;
  }

  :deep(.table) {
    font-size: 0.75rem;
  }
}

/* Ajustes para modo oscuro si es necesario */
@media (prefers-color-scheme: dark) {
  .color-box {
    border-color: #444;
  }
}
</style>
  

