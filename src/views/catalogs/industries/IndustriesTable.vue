<script>
import IndustriesService from '@/services/Industries'
import Swal from 'sweetalert2'
import { ROUTE_NAMES } from '@/router/routeNames'
import { mapActions } from 'pinia';
import { useAuthStore } from '../../../stores/auth';

export default {
  data() {
    return {
      industries: [],
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
    ...mapActions(useAuthStore, ['can']),
    async fetchIndustries() {
      try {
        const response = await IndustriesService.getIndustries()
        this.industries = response.data.data || []
      } catch (error) {
        console.error('Error fetching industries:', error)
        this.industries = []
      }
    },

    newIndustry() {
      this.$router.push({ name: ROUTE_NAMES.INDUSTRY_CREATE })
    },

    editIndustry(item) {
      this.$router.push({ 
        name: ROUTE_NAMES.INDUSTRY_UPDATE, 
        params: { id: item.id }
      })
    },

    async deleteIndustry(item) {
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
          await IndustriesService.deleteIndustry(item.id)
          await this.fetchIndustries()
          
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'Industry has been deleted.',
            toast: true,
            position: 'bottom',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
          })
        } catch (error) {
          console.error('Error deleting industry:', error)
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Error deleting industry',
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
    this.fetchIndustries()
  }
}
</script>

<template>
  <CCard class="mb-4" v-if="can('industries.create')">
    <CRow>
      <CCol :xs="12" :xl="10">&nbsp;</CCol>
      <CCol :xs="12" :xl="2">
        <CCardBody>
          <CButton color="success" @click="newIndustry">
            <CIcon icon="cilPlus" class="me-2" />New Industry
          </CButton>
        </CCardBody>
      </CCol>
    </CRow>
  </CCard>

  <CCard class="mb-4">
    <CCardBody>
      <CSmartTable
        v-if="industries.length > 0"
        :active-page="1"
        :items="industries"
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
              v-if="can('industries.update', 'industries.show')"
              color="primary" 
              variant="outline" 
              square 
              size="sm" 
              @click="editIndustry(item)"
              class="mx-1"
            >
              <CIcon icon="cil-pencil" />
            </CButton>
            <CButton 
              v-if="can('industries.destroy')"
              color="danger" 
              variant="outline" 
              square 
              size="sm" 
              @click="deleteIndustry(item)"
              class="mx-1"
            >
              <CIcon icon="cil-trash" />
            </CButton>
          </td>
        </template>
      </CSmartTable>
    </CCardBody>
  </CCard>
</template> 