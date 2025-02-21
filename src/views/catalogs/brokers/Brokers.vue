<template>
  <CCard class="mb-4">
    <CRow>
      <CCol :xs="12" :xl="10">&nbsp;</CCol>
      <CCol :xs="12" :xl="2">
        <CCardBody>
          <CButton color="success" @click="newBroker()">
            <CIcon icon="cilPlus" class="me-2" />New Broker
          </CButton>
        </CCardBody>
      </CCol>
    </CRow>
  </CCard>

  <CCard class="mb-4">
    <CCardBody>
      <div class="table-responsive">
        <CSmartTable
          v-if="brokers.length > 0"
          :active-page="1"
          :items="brokers"
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
                @click="deleteBroker(item)"
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
import { API } from '@/services'
import Swal from 'sweetalert2'
import { ROUTE_NAMES } from '@/router/routeNames'

export default {
  name: 'Brokers',
  data() {
    return {
      brokers: [],
      columns: [
        {
          key: 'name',
          label: 'Name',
          _style: { width: '40%' }
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
        const response = await API.brokers.getBrokers()
        this.brokers = response.data.data
      } catch (error) {
        console.error('Error fetching brokers:', error)
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Error loading brokers',
          toast: true,
          position: 'bottom',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true
        })
      }
    },
    newBroker() {
      this.$router.push({ name: ROUTE_NAMES.BROKERS_CREATE })
    },
    viewDetails(item) {
      this.$router.push({ name: ROUTE_NAMES.BROKERS_UPDATE, params: { id: item.id } })
    },
    async deleteBroker(item) {
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
          await API.brokers.deleteBroker(item.id)
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
          console.error('Error deleting broker:', error)
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Error deleting broker',
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