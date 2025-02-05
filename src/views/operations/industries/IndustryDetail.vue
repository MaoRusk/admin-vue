<template>
  <CCard class="mb-4">
    <CCardHeader>
      <strong>{{ isNew ? 'New Industry' : 'Edit Industry' }}</strong>
    </CCardHeader>
    <CCardBody>
      <CForm @submit.prevent="saveIndustry">
        <CRow>
          <CCol :md="6">
            <CFormInput
              label="Name"
              v-model="industry.name"
              :feedback="errors.name"
              :invalid="!!errors.name"
              required
            />
          </CCol>
        </CRow>
        <CRow class="mt-3">
          <CCol :xs="12">
            <CButton color="primary" type="submit">
              Save
            </CButton>
            <CButton 
              color="secondary" 
              variant="outline" 
              class="ms-2"
              @click="goBack"
            >
              Cancel
            </CButton>
          </CCol>
        </CRow>
      </CForm>
    </CCardBody>
  </CCard>
</template>

<script>
import IndustriesService from '@/services/Industries'
import Swal from 'sweetalert2'

export default {
  name: 'IndustryDetail',
  data() {
    return {
      industry: {
        name: ''
      },
      errors: {
        name: ''
      }
    }
  },
  computed: {
    isNew() {
      return this.$route.params.id === '0'
    }
  },
  methods: {
    async loadIndustry() {
      if (!this.isNew) {
        try {
          const response = await IndustriesService.getIndustries()
          const industry = response.data.data.find(
            i => i.id === parseInt(this.$route.params.id)
          )
          if (industry) {
            this.industry = { ...industry }
          }
        } catch (error) {
          console.error('Error loading industry:', error)
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Error loading industry',
            toast: true,
            position: 'bottom',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
          })
        }
      }
    },
    clearErrors() {
      this.errors = {
        name: ''
      }
    },
    async saveIndustry() {
      this.clearErrors()
      
      try {
        if (this.isNew) {
          await IndustriesService.createIndustry({
            name: this.industry.name.trim()
          })
          Swal.fire({
            icon: 'success',
            title: 'Created successfully!',
            text: 'New industry has been created.',
            toast: true,
            position: 'bottom',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
          })
        } else {
          await IndustriesService.updateIndustry(this.$route.params.id, {
            name: this.industry.name.trim()
          })
          Swal.fire({
            icon: 'success',
            title: 'Updated successfully!',
            text: 'Industry has been updated.',
            toast: true,
            position: 'bottom',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
          })
        }
        this.goBack()
      } catch (error) {
        console.error('Error saving industry:', error)
        if (error.response?.data?.errors) {
          this.errors = error.response.data.errors
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Error saving industry',
            toast: true,
            position: 'bottom',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
          })
        }
      }
    },
    goBack() {
      this.$router.push('/operacion/industries')
    }
  },
  mounted() {
    this.loadIndustry()
  }
}
</script> 