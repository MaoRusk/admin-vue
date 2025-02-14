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
    getLogoUrl(logoUrl) {
      if (!logoUrl) return null;
      if (logoUrl.match(/^(http|https):\/\//)) {
        return logoUrl;
      }
      return `https://laravel-back-production-9320.up.railway.app/storage/${logoUrl}`;
    },
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
      this.$router.push('/operations/company/create')
    },
    viewDetails(item) {
      this.$router.push(`/operations/company/${item.id}`)
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
  <CCard class="mb-4">
    <CRow>
      <CCol :xs="12" :xl="10">&nbsp;</CCol>
      <CCol :xs="12" :xl="2">
        <CCardBody>
          <CButton color="success" @click="newCompany()">
            <CIcon icon="cilPlus" class="me-2" />New Company
          </CButton>
        </CCardBody>
      </CCol>
    </CRow>
  </CCard>

  <CCard class="mb-4">
    <CCardBody>
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
          <template #logo="{ item }">
            <td class="text-center">
              <img 
                v-if="getLogoUrl(item.logo_url)"
                :src="getLogoUrl(item.logo_url)"
                alt="Company Logo"
                style="max-height: 40px; max-width: 100px; object-fit: contain;"
              />
              <span v-else class="text-muted small">No logo</span>
            </td>
          </template>

          <template #colors="{ item }">
            <td>
              <div class="d-flex align-items-center gap-3">
                <div class="d-flex align-items-center gap-2">
                  <div 
                    class="color-box"
                    :style="{
                      backgroundColor: item.primary_color,
                      width: '20px',
                      height: '20px',
                      border: '1px solid #ddd',
                      borderRadius: '4px'
                    }"
                  ></div>
                  <small>{{ item.primary_color }}</small>
                </div>
                <div class="d-flex align-items-center gap-2">
                  <div 
                    class="color-box"
                    :style="{
                      backgroundColor: item.secondary_color,
                      width: '20px',
                      height: '20px',
                      border: '1px solid #ddd',
                      borderRadius: '4px'
                    }"
                  ></div>
                  <small>{{ item.secondary_color }}</small>
                </div>
              </div>
            </td>
          </template>

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
                @click="deleteCompany(item)"
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

<style scoped>
.color-box {
  display: inline-block;
  vertical-align: middle;
}

.gap-2 {
  gap: 0.5rem;
}

.gap-3 {
  gap: 1rem;
}

@media (max-width: 768px) {
  .d-flex {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>
  
