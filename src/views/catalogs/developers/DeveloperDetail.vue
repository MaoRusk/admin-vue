<template>
  <CCard class="mb-4">
    <CCardHeader>
      <strong>{{ isNew ? 'New Developer' : 'Edit Developer' }}</strong>
    </CCardHeader>
    <CCardBody>
      <CForm @submit.prevent="saveDeveloper">
        <CRow>
          <CCol :md="6">
            <CFormInput
              label="Name"
              v-model="developer.name"
              :feedback="errors.name"
              :invalid="!!errors.name"
              required
            />
          </CCol>
        </CRow>
        <CRow class="mt-3">
          <CCol :md="4">
            <CFormSwitch
              label="Is Developer"
              v-model="developer.is_developer"
            />
          </CCol>
          <CCol :md="4">
            <CFormSwitch
              label="Is Builder"
              v-model="developer.is_builder"
            />
          </CCol>
          <CCol :md="4">
            <CFormSwitch
              label="Is Owner"
              v-model="developer.is_owner"
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
import DevelopersService from '@/services/Developers'
import Swal from 'sweetalert2'

export default {
  name: 'DeveloperDetail',
  data() {
    return {
      developer: {
        name: '',
        is_developer: false,
        is_builder: false,
        is_owner: false
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
    async loadDeveloper() {
      if (!this.isNew) {
        try {
          const response = await DevelopersService.getDeveloper(this.$route.params.id)
          if (response.data.data) {
            this.developer = {
              name: response.data.data.name,
              is_developer: Boolean(response.data.data.is_developer),
              is_builder: Boolean(response.data.data.is_builder),
              is_owner: Boolean(response.data.data.is_owner)
            }
          }
        } catch (error) {
          console.error('Error loading developer:', error)
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Error loading developer',
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
    async saveDeveloper() {
      this.clearErrors()
      
      try {
        if (this.isNew) {
          await DevelopersService.createDeveloper(this.developer)
          Swal.fire({
            icon: 'success',
            title: 'Created successfully!',
            text: 'New developer has been created.',
            toast: true,
            position: 'bottom',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
          })
        } else {
          await DevelopersService.updateDeveloper(this.$route.params.id, this.developer)
          Swal.fire({
            icon: 'success',
            title: 'Updated successfully!',
            text: 'Developer has been updated.',
            toast: true,
            position: 'bottom',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
          })
        }
        this.goBack()
      } catch (error) {
        console.error('Error saving developer:', error)
        if (error.response?.data?.errors) {
          this.errors = error.response.data.errors
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Error saving developer',
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
      this.$router.push('/operacion/developers')
    }
  },
  mounted() {
    this.loadDeveloper()
  }
}
</script> 