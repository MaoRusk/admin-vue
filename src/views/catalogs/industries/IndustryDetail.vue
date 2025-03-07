<template>
  <CRow>
    <CCol :xs="12">
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
                <CButton color="primary" type="submit" v-if="can('industries.create', 'industries.update')">
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
    </CCol>
  </CRow>
</template>

<script>
import Industries from '@/services/Industries'
import Swal from 'sweetalert2'
import { ROUTE_NAMES } from '@/router/routeNames'
import { mapActions } from 'pinia';
import { useAuthStore } from '../../../stores/auth';

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
      return this.$route.name === ROUTE_NAMES.INDUSTRY_CREATE
    }
  },
  methods: {
    ...mapActions(useAuthStore, ['can']),
    async loadIndustry() {
      if (!this.isNew) {
        try {
          const response = await Industries.getIndustries()
          const industry = response.data.data.find(
            ind => ind.id === parseInt(this.$route.params.id)
          )
          if (industry) {
            this.industry = {
              name: industry.name
            }
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
          this.goBack()
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
      
      if (!this.industry.name.trim()) {
        this.errors.name = 'Name is required'
        return
      }
      
      try {
        if (this.isNew) {
          await Industries.createIndustry({ name: this.industry.name.trim() })
          Swal.fire({
            icon: 'success',
            title: 'Created successfully!',
            text: 'Industry has been created.',
            toast: true,
            position: 'bottom',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
          })
        } else {
          await Industries.updateIndustry(this.$route.params.id, { 
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
      this.$router.push({ name: ROUTE_NAMES.INDUSTRIES })
    }
  },
  mounted() {
    this.loadIndustry()
  }
}
</script> 