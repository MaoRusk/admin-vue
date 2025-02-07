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

        <!-- Permissions Table -->
        <CRow class="mt-4">
          <CCol :xs="12">
            <h4>Permissions</h4>
            <div class="table-responsive">
              <table class="table table-bordered permissions-table">
                <thead>
                  <tr>
                    <th>Resource</th>
                    <th v-for="action in actions" :key="action">
                      {{ formatActionName(action) }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(permissions, resource) in groupedPermissions" :key="resource">
                    <td class="resource-name">{{ formatResourceName(resource) }}</td>
                    <td v-for="action in actions" :key="action" class="text-center">
                      <CFormCheck
                        v-if="hasPermission(resource, action)"
                        :checked="isPermissionSelected(resource, action)"
                        @change="togglePermission(resource, action)"
                      />
                      <span v-else>-</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CCol>
        </CRow>

        <CRow class="mt-4">
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
      availablePermissions: [],
      selectedPermissions: [],
      actions: ['index', 'show', 'create', 'update', 'destroy'],
      errors: {
        name: '',
        guard_name: '',
        permissions: ''
      }
    }
  },
  computed: {
    isNew() {
      return this.id === 0 || this.id === '0'
    },
    groupedPermissions() {
      const grouped = {}
      this.availablePermissions.forEach(permission => {
        const [resource] = permission.name.split('.')
        if (!grouped[resource]) {
          grouped[resource] = {}
        }
        const [, action] = permission.name.split('.')
        grouped[resource][action] = permission
      })
      return grouped
    }
  },
  methods: {
    formatResourceName(resource) {
      return resource.charAt(0).toUpperCase() + resource.slice(1)
    },
    formatActionName(action) {
      return action.charAt(0).toUpperCase() + action.slice(1)
    },
    hasPermission(resource, action) {
      return this.availablePermissions.some(p => p.name === `${resource}.${action}`)
    },
    isPermissionSelected(resource, action) {
      return this.selectedPermissions.some(p => p.name === `${resource}.${action}`)
    },
    togglePermission(resource, action) {
      const permission = this.availablePermissions.find(p => p.name === `${resource}.${action}`)
      if (!permission) return

      const index = this.selectedPermissions.findIndex(p => p.id === permission.id)
      if (index === -1) {
        this.selectedPermissions.push(permission)
      } else {
        this.selectedPermissions.splice(index, 1)
      }
    },
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
            this.availablePermissions = permissions
            this.selectedPermissions = [...permissions]
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
        guard_name: '',
        permissions: ''
      }
    },
    async saveRole() {
      this.clearErrors()
      try {
        const roleData = {
          name: this.role.name,
          guard_name: this.role.guard_name,
          permissions: this.selectedPermissions.map(p => p.id)
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
  created() {
    this.loadRole()
  }
}
</script>

<style scoped>
.permissions-table {
  margin-top: 1rem;
}

.permissions-table th {
  background-color: #f8f9fa;
  text-align: center;
  vertical-align: middle;
}

.resource-name {
  font-weight: 500;
  background-color: #f8f9fa;
}

.table-responsive {
  max-height: 500px;
  overflow-y: auto;
}

/* Mantener el encabezado fijo al hacer scroll */
.table-responsive thead th {
  position: sticky;
  top: 0;
  background-color: #f8f9fa;
  z-index: 1;
}

/* Estilo para las celdas de checkbox */
.permissions-table td {
  vertical-align: middle;
  padding: 0.5rem;
}

/* Hover effect en las filas */
.permissions-table tbody tr:hover {
  background-color: rgba(0, 0, 0, 0.02);
}
</style> 