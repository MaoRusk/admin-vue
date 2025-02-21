<template>
  <CCard class="mb-4">
    <CRow>
      <CCol :xs="12" :xl="10">&nbsp;</CCol>
      <CCol :xs="12" :xl="2">
        <CCardBody>
          <CButton color="success" @click="newTenant()">
            <CIcon icon="cilPlus" class="me-2" />New Tenant
          </CButton>
        </CCardBody>
      </CCol>
    </CRow>
  </CCard>

  <CCard class="mb-4">
    <CCardBody>
      <div class="table-responsive">
        <CSmartTable
          v-if="tenants.length > 0"
          :active-page="1"
          :items="tenants"
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
          <template #actions="{ item }">
            <td class="py-2" style="text-align: center">
              <CButton 
                color="primary" 
                variant="outline" 
                square 
                size="sm" 
                @click="viewDetails(item)"
                class="mx-1 my-1"
              >
                <CIcon icon="cil-pencil" />
              </CButton>
              <CButton 
                color="danger" 
                variant="outline" 
                square 
                size="sm" 
                class="mx-1 my-1"
                @click="deleteTenant(item)"
              >
                <CIcon icon="cil-trash" />
              </CButton>
            </td>
          </template>
        </CSmartTable>
      </div>
    </CCardBody>
  </CCard>
</template>

<script>
import TenantsService from '@/services/Tenants'
import Swal from 'sweetalert2'
import { ROUTE_NAMES } from '../../../router/routeNames';

export default {
  data() {
    return {
      tenants: [],
      columns: [
        {
          key: 'id',
          label: 'ID',
          _style: { width: '10%' },
        },
        {
          key: 'name',
          label: 'Name',
          _style: { width: '70%' },
        },
        {
          key: 'actions',
          label: 'Actions',
          _style: { width: '20%', textAlign: 'center' },
          sorter: false,
          filter: false
        }
      ]
    }
  },

  methods: {
    async fetchTenants() {
      try {
        const response = await TenantsService.getTenants()
        this.tenants = response.data.data || []
        return this.tenants
      } catch (error) {
        console.error('Error fetching tenants:', error)
        this.tenants = []
        return []
      }
    },

    newTenant() {
      this.$router.push({ name: ROUTE_NAMES.TENANTS_DETAIL, params: { id: 0 } })
    },

    viewDetails(item) {
      this.$router.push({ name: ROUTE_NAMES.TENANTS_DETAIL, params: { id: item.id } })
    },

    async deleteTenant(item) {
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
          await TenantsService.deleteTenant(item.id)
          await this.fetchTenants()
          
          Swal.fire({
            icon: 'success',
            title: 'Deleted successfully!',
            text: `${item.name} has been deleted.`,
            toast: true,
            position: 'bottom',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
          })
        } catch (error) {
          console.error('Error deleting tenant:', error)
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Error deleting tenant',
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
    return this.fetchTenants()
  }
}
</script>

<style scoped>
.table-responsive {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

@media (max-width: 768px) {
  .table-responsive {
    margin-bottom: 1rem;
  }
  
  :deep(.table) th,
  :deep(.table) td {
    white-space: nowrap;
    min-width: 100px;
  }
  
  :deep(.table) th:first-child,
  :deep(.table) td:first-child {
    position: sticky;
    left: 0;
    background: white;
    z-index: 1;
  }
}
</style> 