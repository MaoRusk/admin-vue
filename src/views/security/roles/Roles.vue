<template>
  <CCard class="mb-4">
    <CRow>
      <CCol :xs="12" :xl="10">&nbsp;</CCol>
      <CCol :xs="12" :xl="2">
        <CCardBody>
          <CButton color="success" @click="newRole()">
            <CIcon icon="cilPlus" class="me-2" />New Role
          </CButton>
        </CCardBody>
      </CCol>
    </CRow>
  </CCard>

  <CCard class="mb-4">
    <CCardBody>
      <div class="table-responsive">
        <CSmartTable
          v-if="roles.length > 0"
          :active-page="1"
          :items="roles"
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
            <td class="py-2 text-center">
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
                @click="deleteRole(item)"
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
import RolesService from '@/services/Roles'
import Swal from 'sweetalert2'
import { ROUTE_NAMES } from '../../../router/routeNames'

const RolesComponent = {
  name: 'Roles',
  data() {
    return {
      roles: [],
      columns: [
        {
          key: 'name',
          label: 'Name',
          _style: { minWidth: '200px' }
        },
        {
          key: 'actions',
          label: 'Actions',
          _style: { width: '120px', textAlign: 'center' }
        },
      ],
    }
  },
  methods: {
    async fetchData() {
      try {
        const response = await RolesService.getRoles()
        this.roles = response.data.data
      } catch (error) {
        console.error('Error fetching roles:', error)
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Error loading roles',
          toast: true,
          position: 'bottom',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true
        })
      }
    },
    newRole() {
      this.$router.push({ name: ROUTE_NAMES.ROLES_CREATE })
    },
    viewDetails(item) {
      this.$router.push({ name: ROUTE_NAMES.ROLES_UPDATE, params: { id: item.id } })
    },
    async deleteRole(item) {
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
          await RolesService.deleteRole(item.id)
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
          console.error('Error deleting role:', error)
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Error deleting role',
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

export default RolesComponent
</script> 