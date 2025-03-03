<template>
  <CCard class="mb-4">
    <CCardHeader>
      <strong>{{ isNew ? 'New Tenant' : 'Edit Tenant' }}</strong>
    </CCardHeader>
    <CCardBody>
      <CForm @submit.prevent="saveTenant">
        <CRow>
          <CCol :md="6">
            <CFormInput
              label="Name"
              v-model="tenant.name"
              :feedback="errors.name"
              :invalid="!!errors.name"
              required
            />
          </CCol>
        </CRow>
        <CRow class="mt-3">
          <CCol :xs="12">
            <CButton color="primary" type="submit" v-if="can('tenants.create', 'tenants.update')">
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
import TenantsService from '@/services/Tenants'
import { mapActions } from 'pinia';
import Swal from 'sweetalert2'
import { useAuthStore } from '../../../stores/auth';

export default {
  name: 'TenantDetail',
  data() {
    return {
      tenant: {
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
    ...mapActions(useAuthStore, ['can']),
    async loadTenant() {
      if (!this.isNew) {
        try {
          const response = await TenantsService.getTenant(this.$route.params.id)
          if (response.data.data) {
            this.tenant = {
              name: response.data.data.name
            }
          }
        } catch (error) {
          console.error('Error loading tenant:', error)
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Error loading tenant',
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
    async saveTenant() {
      this.clearErrors()
      
      try {
        if (this.isNew) {
          await TenantsService.createTenant(this.tenant)
          Swal.fire({
            icon: 'success',
            title: 'Created successfully!',
            text: 'New tenant has been created.',
            toast: true,
            position: 'bottom',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
          })
        } else {
          await TenantsService.updateTenant(this.$route.params.id, this.tenant)
          Swal.fire({
            icon: 'success',
            title: 'Updated successfully!',
            text: 'Tenant has been updated.',
            toast: true,
            position: 'bottom',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
          })
        }
        this.goBack()
      } catch (error) {
        console.error('Error saving tenant:', error)
        if (error.response?.data?.errors) {
          this.errors = error.response.data.errors
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Error saving tenant',
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
      this.$router.back()
    }
  },
  mounted() {
    this.loadTenant()
  }
}
</script> 