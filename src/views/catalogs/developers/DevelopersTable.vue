<script>
import DevelopersService from '@/services/Developers'
import Swal from 'sweetalert2'
import { ROUTE_NAMES } from '@/router/routeNames'
import { mapActions } from 'pinia';
import { useAuthStore } from '../../../stores/auth';

export default {
  data() {
    return {
      developers: [],
      columns: [
        {
          key: 'id',
          label: 'ID',
          _style: { width: '5%' },
        },
        {
          key: 'name',
          label: 'Name',
          _style: { width: '20%' },
        },
        {
          key: 'is_developer',
          label: 'Developer',
          _style: { width: '20%' },
        },
        {
          key: 'is_builder',
          label: 'Builder',
          _style: { width: '20%' },
        },
        {
          key: 'is_owner',
          label: 'Owner',
          _style: { width: '20%' },
        },
        {
          key: 'actions',
          label: 'Actions',
          _style: { width: '15%', textAlign: 'center' },
          sorter: false,
          filter: false
        }
      ]
    }
  },

  methods: {
    ...mapActions(useAuthStore, ['can']),
    async fetchDevelopers() {
      try {
        const response = await DevelopersService.getDevelopers()
        this.developers = response || []
        return this.developers
      } catch (error) {
        console.error('Error fetching developers:', error)
        this.developers = []
        return []
      }
    },

    newDeveloper() {
      this.$router.push({ name: ROUTE_NAMES.DEVELOPERS_CREATE })
    },

    viewDetails(item) {
      this.$router.push({ name: ROUTE_NAMES.DEVELOPERS_UPDATE, params: { id: item.id } })
    },

    async deleteDeveloper(item) {
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
          await DevelopersService.deleteDeveloper(item.id)
          await this.fetchDevelopers()
          
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
          console.error('Error deleting developer:', error)
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Error deleting developer',
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
    return this.fetchDevelopers()
  }
}
</script>

<template>
  <CCard v-if="can('developers.create')" class="mb-4">
    <CRow>
      <CCol :xs="12" :xl="10">&nbsp;</CCol>
      <CCol :xs="12" :xl="2">
        <CCardBody>
          <CButton color="success" @click="newDeveloper()">
            <CIcon icon="cilPlus" class="me-2" />New Developer
          </CButton>
        </CCardBody>
      </CCol>
    </CRow>
  </CCard>

  <CCard class="mb-4">
    <CCardBody>
      <CSmartTable
        v-if="developers.length > 0"
        :active-page="1"
        :items="developers"
        :columns="columns"
        :items-per-page="10"
        :table-filter="true"
        cleaner
        :table-filter-label="'Search:'"
        :table-filter-placeholder="'Type something...'"
        :pagination="true"
        hover
      >
        <template #is_developer="{ item }">
          <td>
            <CBadge :color="item.is_developer ? 'success' : 'danger'">
              {{ item.is_developer ? 'Yes' : 'No' }}
            </CBadge>
          </td>
        </template>

        <template #is_builder="{ item }">
          <td>
            <CBadge :color="item.is_builder ? 'success' : 'danger'">
              {{ item.is_builder ? 'Yes' : 'No' }}
            </CBadge>
          </td>
        </template>

        <template #is_owner="{ item }">
          <td>
            <CBadge :color="item.is_owner ? 'success' : 'danger'">
              {{ item.is_owner ? 'Yes' : 'No' }}
            </CBadge>
          </td>
        </template>

        <template #actions="{ item }">
          <td class="py-2" style="text-align: center">
            <CButton 
              v-if="can('developers.update', 'developers.show')"
              color="primary" 
              variant="outline" 
              square 
              size="sm" 
              @click="viewDetails(item)"
              class="mx-1"
            >
              <CIcon icon="cil-pencil" />
            </CButton>
            <CButton 
              v-if="can('developers.destroy')"
              color="danger" 
              variant="outline" 
              square 
              size="sm" 
              class="mx-1"
              @click="deleteDeveloper(item)"
            >
              <CIcon icon="cil-trash" />
            </CButton>
          </td>
        </template>
      </CSmartTable>
    </CCardBody>
  </CCard>
</template> 