<template>
  <CCard class="mb-4">
    <CCardHeader>
      <strong>{{ isNew ? 'New Role' : 'Edit Role' }}</strong>
    </CCardHeader>
    <CCardBody>
      <CForm @submit.prevent="saveRole">
        <CRow>
          <CCol :md="6">
            <CFormInput
              label="Name"
              v-model="role.name"
              :feedback="errors.name"
              :invalid="!!errors.name"
              required
            />
          </CCol>
        </CRow>
        <CRow class="mt-3">
          <CCol :md="6">
            <CFormInput
              label="Guard Name"
              v-model="role.guard_name"
              :feedback="errors.guard_name"
              :invalid="!!errors.guard_name"
              required
              :disabled="!isNew"
              :value="isNew ? 'web' : role.guard_name"
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
import RolesService from '@/services/Roles'
import Swal from 'sweetalert2'

export default {
  name: 'RoleDetail',
  props: {
    id: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      role: {
        name: '',
        guard_name: 'web',
        permissions: []
      },
      errors: {
        name: '',
        guard_name: ''
      }
    }
  },
  computed: {
    isNew() {
      return this.id === 0 || this.id === '0'
    }
  },
  methods: {
    async loadRole() {
      if (!this.isNew) {
        try {
          const response = await RolesService.getRole(this.id)
          if (response.data.data) {
            const { name, guard_name, permissions } = response.data.data
            this.role = {
              name,
              guard_name,
              permissions: permissions || []
            }
          }
        } catch (error) {
          console.error('Error loading role:', error)
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Error loading role',
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
        name: '',
        guard_name: ''
      }
    },
    async saveRole() {
      this.clearErrors()
      
      try {
        const roleData = {
          name: this.role.name,
          guard_name: this.role.guard_name
        }

        if (this.isNew) {
          await RolesService.createRole(roleData)
          Swal.fire({
            icon: 'success',
            title: 'Created successfully!',
            text: 'New role has been created.',
            toast: true,
            position: 'bottom',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
          })
        } else {
          await RolesService.updateRole(this.id, roleData)
          Swal.fire({
            icon: 'success',
            title: 'Updated successfully!',
            text: 'Role has been updated.',
            toast: true,
            position: 'bottom',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
          })
        }
        this.goBack()
      } catch (error) {
        console.error('Error saving role:', error)
        if (error.response?.data?.errors) {
          this.errors = error.response.data.errors
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Error saving role',
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
      this.$router.push('/seguridad/roles')
    }
  },
  mounted() {
    this.loadRole()
  }
}
</script> 