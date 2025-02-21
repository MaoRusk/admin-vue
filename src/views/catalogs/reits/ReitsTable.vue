<script>
import ReitsService from '@/services/Reits'
import Swal from 'sweetalert2'
import { ROUTE_NAMES } from '@/router/routeNames'

export default {
  data() {
    return {
      reits: [],
      columns: [
        {
          key: 'id',
          label: 'ID',
          _style: { width: '10%' },
        },
        {
          key: 'name',
          label: 'Name',
          _style: { width: '75%' },
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
    async fetchReits() {
      try {
        const response = await ReitsService.getReits()
        this.reits = response || []
        return this.reits
      } catch (error) {
        console.error('Error fetching REITs:', error)
        this.reits = []
        return []
      }
    },

    newReit() {
      this.$router.push({ name: ROUTE_NAMES.REITS_CREATE })
    },

    viewDetails(item) {
      this.$router.push({ name: ROUTE_NAMES.REITS_UPDATE, params: { id: item.id } })
    },

    async deleteReit(item) {
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
          await ReitsService.deleteReit(item.id)
          await this.fetchReits()
          
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
          console.error('Error deleting REIT:', error)
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Error deleting REIT',
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
    return this.fetchReits()
  }
}
</script>

<template>
  <CCard class="mb-4">
    <CRow>
      <CCol :xs="12" :xl="2">
        <CCardBody style="text-align: end;">
          <CButton color="success" @click="newReit()">
            <CIcon icon="cilPlus" class="me-2" />New REIT
          </CButton>
        </CCardBody>
      </CCol>
    </CRow>
  </CCard>

  <CCard class="mb-4">
    <CCardBody>
      <CSmartTable
        v-if="reits.length > 0"
        :active-page="1"
        :items="reits"
        :columns="columns"
        :items-per-page="10"
        :table-filter="true"
        cleaner
        :table-filter-label="'Search:'"
        :table-filter-placeholder="'Type something...'"
        :pagination="true"
        hover
      >
        <template #actions="{ item }">
          <td class="py-2" style="text-align: center">
            <CButton 
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
              color="danger" 
              variant="outline" 
              square 
              size="sm" 
              class="mx-1"
              @click="deleteReit(item)"
            >
              <CIcon icon="cil-trash" />
            </CButton>
          </td>
        </template>
      </CSmartTable>
    </CCardBody>
  </CCard>
</template> 