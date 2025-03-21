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

        <!-- Permissions Table -->
        <CRow class="mt-4">
          <CCol :xs="12">
            <div class="permissions-header mb-3">
              <h4 class="m-0">Permissions</h4>
            </div>
            <div class="table-responsive permissions-wrapper">
              <table class="table permissions-table">
                <thead>
                  <tr>
                    <th class="resource-column">Modules</th>
                    <th class="select-all-column text-center">
                      <div class="d-flex flex-column align-items-center gap-2">
                        <span>All</span>
                        <CFormCheck
                          :checked="isAllSelected"
                          :indeterminate="hasIndeterminateSelection"
                          @change="toggleAll"
                          class="action-select-all"
                        />
                      </div>
                    </th>
                    <th 
                      v-for="action in filteredActions" 
                      :key="action" 
                      class="action-column text-center"
                    >
                      <span>{{ formatActionName(action) }}</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(permissions, resource) in groupedPermissions" :key="resource">
                    <td class="resource-name">
                      {{ formatResourceName(resource) }}
                    </td>
                    <td class="text-center permission-cell">
                      <CFormCheck
                        :checked="isAllSelectedForResource(resource)"
                        :indeterminate="hasIndeterminateResource(resource)"
                        @change="toggleAllForResource(resource)"
                        class="resource-select-all"
                      />
                    </td>
                    <td v-for="action in filteredActions" :key="action" class="text-center permission-cell">
                      <div class="d-flex align-items-center gap-2 justify-content-center">
                        <CFormCheck
                          v-if="hasPermission(resource, action)"
                          :checked="isPermissionSelected(resource, action)"
                          @change="togglePermission(resource, action)"
                          :class="{'permission-checked': isPermissionSelected(resource, action)}"
                        />
                        <span v-if="hasPermission(resource, action)" class="permission-action-name">
                          {{ formatActionName(action) }}
                        </span>
                        <span v-else class="permission-unavailable">—</span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CCol>
        </CRow>

        <CRow class="mt-4">
          <CCol :xs="12">
            <CButton v-if="can('roles.create', 'roles.update')" color="primary" type="submit">
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
import PermissionsService from '@/services/Permissions'
import Swal from 'sweetalert2'
import { ROUTE_NAMES } from '../../../router/routeNames';
import { useAuthStore } from '../../../stores/auth';
import { mapActions } from 'pinia';
import { API } from '../../../services';

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
      actions: [],
      errors: {
        name: '',
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
    },
    isAllSelected() {
      return this.availablePermissions.length > 0 && 
             this.selectedPermissions.length === this.availablePermissions.length
    },
    hasIndeterminateSelection() {
      return this.selectedPermissions.length > 0 && 
             this.selectedPermissions.length < this.availablePermissions.length
    },
    filteredActions() {
      // Solo mostrar acciones que tengan al menos un permiso en algún módulo
      return this.actions.filter(action => {
        return Object.keys(this.groupedPermissions).some(resource => 
          this.hasPermission(resource, action)
        )
      })
    }
  },
  methods: {
    ...mapActions(useAuthStore, ['can', 'setUser']),
    extractUniqueActions() {
      const actionSet = new Set()
      
      // Solo agregar acciones que al menos un recurso utiliza
      this.availablePermissions.forEach(permission => {
        const [, action] = permission.name.split('.')
        if (action) {
          actionSet.add(action)
        }
      })

      // Definir el orden de los permisos CRUD y otros comunes
      const crudOrder = ['index', 'create', 'show', 'edit', 'update', 'destroy'];
      
      // Ordenar las acciones: primero CRUD, luego el resto alfabéticamente
      this.actions = Array.from(actionSet).sort((a, b) => {
        const aIndex = crudOrder.indexOf(a);
        const bIndex = crudOrder.indexOf(b);
        
        if (aIndex !== -1 && bIndex !== -1) {
          return aIndex - bIndex;
        }
        if (aIndex !== -1) {
          return -1;
        }
        if (bIndex !== -1) {
          return 1;
        }
        return a.localeCompare(b);
      });
    },
    formatResourceName(resource) {
      return resource.charAt(0).toUpperCase() + resource.slice(1)
    },
    formatActionName(action) {
      const specialCases = {
        'index': 'List',
        'destroy': 'Delete',
        'approve': 'Approve',
        'draft': 'Draft',
        'uploadFiles': 'Upload Files'
      }
      
      if (specialCases[action]) {
        return specialCases[action]
      }
      
      return action
        .split(/(?=[A-Z])/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ')
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
            const { name, permissions } = response.data.data
            this.role = {
              name,
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
        permissions: ''
      }
    },
    async saveRole() {
      this.clearErrors()
      try {
        const roleData = {
          name: this.role.name,
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
        const { data: me } = await API.auth.me()
        const authUser = me.data.user
        authUser.permissions = me.data.permissions
        this.setUser(authUser)

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
      this.$router.push({ name: ROUTE_NAMES.ROLES })
    },
    isAllSelectedForAction(action) {
      const availablePermissionsForAction = Object.keys(this.groupedPermissions)
        .filter(resource => this.hasPermission(resource, action))
        .length

      const selectedPermissionsForAction = Object.keys(this.groupedPermissions)
        .filter(resource => 
          this.hasPermission(resource, action) && 
          this.isPermissionSelected(resource, action)
        )
        .length

      return availablePermissionsForAction > 0 && 
             availablePermissionsForAction === selectedPermissionsForAction
    },
    hasIndeterminateAction(action) {
      const availablePermissionsForAction = Object.keys(this.groupedPermissions)
        .filter(resource => this.hasPermission(resource, action))
        .length

      const selectedPermissionsForAction = Object.keys(this.groupedPermissions)
        .filter(resource => 
          this.hasPermission(resource, action) && 
          this.isPermissionSelected(resource, action)
        )
        .length

      return selectedPermissionsForAction > 0 && 
             selectedPermissionsForAction < availablePermissionsForAction
    },
    toggleAllForAction(action) {
      const isCurrentlyAllSelected = this.isAllSelectedForAction(action)
      
      Object.keys(this.groupedPermissions).forEach(resource => {
        if (this.hasPermission(resource, action)) {
          const permission = this.availablePermissions.find(p => p.name === `${resource}.${action}`)
          if (!permission) return

          const index = this.selectedPermissions.findIndex(p => p.id === permission.id)
          
          if (!isCurrentlyAllSelected && index === -1) {
            this.selectedPermissions.push(permission)
          } else if (isCurrentlyAllSelected && index !== -1) {
            this.selectedPermissions.splice(index, 1)
          }
        }
      })
    },
    isAllSelectedForResource(resource) {
      const availablePermissionsForResource = this.actions
        .filter(action => this.hasPermission(resource, action))
        .length

      const selectedPermissionsForResource = this.actions
        .filter(action => 
          this.hasPermission(resource, action) && 
          this.isPermissionSelected(resource, action)
        )
        .length

      return availablePermissionsForResource > 0 && 
             availablePermissionsForResource === selectedPermissionsForResource
    },
    hasIndeterminateResource(resource) {
      const availablePermissionsForResource = this.actions
        .filter(action => this.hasPermission(resource, action))
        .length

      const selectedPermissionsForResource = this.actions
        .filter(action => 
          this.hasPermission(resource, action) && 
          this.isPermissionSelected(resource, action)
        )
        .length

      return selectedPermissionsForResource > 0 && 
             selectedPermissionsForResource < availablePermissionsForResource
    },
    toggleAllForResource(resource) {
      const isCurrentlyAllSelected = this.isAllSelectedForResource(resource)
      
      this.actions.forEach(action => {
        if (this.hasPermission(resource, action)) {
          const permission = this.availablePermissions.find(p => p.name === `${resource}.${action}`)
          if (!permission) return

          const index = this.selectedPermissions.findIndex(p => p.id === permission.id)
          
          if (!isCurrentlyAllSelected && index === -1) {
            this.selectedPermissions.push(permission)
          } else if (isCurrentlyAllSelected && index !== -1) {
            this.selectedPermissions.splice(index, 1)
          }
        }
      })
    },
    toggleAll() {
      if (this.isAllSelected || this.hasIndeterminateSelection) {
        this.selectedPermissions = []
      } else {
        this.selectedPermissions = [...this.availablePermissions]
      }
    }
  },
  async created() {
    try {
      const permissionsResponse = await PermissionsService.getPermissions()
      this.availablePermissions = permissionsResponse.data.data || []
      
      this.extractUniqueActions()
      
      if (!this.isNew) {
        const roleResponse = await RolesService.getRole(this.id)
        if (roleResponse.data.data) {
          const { name, permissions } = roleResponse.data.data
          this.role = {
            name,
            permissions: permissions || []
          }
          this.selectedPermissions = [...permissions]
        }
      }
    } catch (error) {
      console.error('Error loading data:', error)
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Error loading data',
        toast: true,
        position: 'bottom',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true
      })
    }
  }
}
</script>

<style scoped>
.permissions-wrapper {
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.permissions-table {
  margin-bottom: 0;
  border-collapse: separate;
  border-spacing: 0;
}

.permissions-table th {
  background-color: #f0f2f5;
  padding: 1.25rem 1rem;
  font-size: 0.8rem;
  letter-spacing: 0.03em;
  border-bottom: none;
}

.permissions-table tbody tr {
  transition: all 0.2s ease;
}

.permissions-table tbody tr:nth-child(even) {
  background-color: #f8fafc;
}

.resource-name {
  font-size: 0.95rem;
  font-weight: 600;
  color: #2c3e50;
  padding: 1rem 1.25rem !important;
}

.permission-cell {
  background-color: transparent;
  border-left: 1px solid #ebedef;
}

.form-check-input {
  width: 1.2rem;
  height: 1.2rem;
  border-radius: 4px;
  cursor: pointer;
}

.permission-action-name {
  font-size: 0.8rem;
  color: #64748b;
  margin-left: 0.5rem;
  min-width: 60px;
  text-align: left;
}

.select-all-column {
  width: 80px;
  min-width: 80px;
  background-color: #f8f9fa;
}

.resource-select-all .form-check-input,
.action-select-all .form-check-input {
  border-width: 2px;
}

.resource-select-all .form-check-input:indeterminate,
.action-select-all .form-check-input:indeterminate {
  background-color: #321fdb;
  border-color: #321fdb;
}

/* Mantener el encabezado fijo al hacer scroll */
.permissions-table thead th {
  position: sticky;
  top: 0;
  background-color: #f8f9fa;
  z-index: 1;
}

/* Estilo para los checkboxes */
.form-check-input {
  cursor: pointer;
  border-color: #321fdb;
  transition: all 0.2s ease;
}

.form-check-input:checked {
  background-color: #321fdb;
  border-color: #321fdb;
}

.form-check-input:hover:not(:checked) {
  border-color: #321fdb;
  background-color: rgba(50, 31, 219, 0.1);
}

/* Hover effect en las filas */
.permissions-table tbody tr:hover {
  background-color: #f1f5f9;
}

/* Estilo para las celdas de la tabla */
.permissions-table td, 
.permissions-table th {
  border-color: #ebedef;
}

/* Scrollbar más suave */
.permissions-wrapper::-webkit-scrollbar {
  width: 8px;
}

.permissions-wrapper::-webkit-scrollbar-track {
  background: #f8fafc;
  border-radius: 4px;
}

.permissions-wrapper::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 4px;
  border: 2px solid #f8fafc;
}

.permissions-wrapper::-webkit-scrollbar-thumb:hover {
  background-color: #94a3b8;
}

/* Estilo para los botones de selección */
.permissions-header .btn {
  transition: all 0.2s ease;
}

.permissions-header .btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

/* Animación para los checkboxes */
.form-check-input {
  transform-origin: center;
  transition: transform 0.2s ease;
}

.form-check-input:checked {
  transform: scale(1.1);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .permissions-wrapper {
    max-height: 400px;
  }
  
  .resource-column {
    min-width: 120px;
  }
  
  .action-column {
    min-width: 80px;
  }
}

/* Estilos para el checkbox de seleccionar todos */
.action-select-all {
  margin: 0;
}

.action-select-all .form-check-input {
  border-width: 2px;
}

.action-select-all .form-check-input:indeterminate {
  background-color: #321fdb;
  border-color: #321fdb;
}

/* Ajuste del padding para el encabezado con checkbox */
.permissions-table th {
  padding: 0.75rem 0.5rem;
}

/* Estilo para el contenedor del título y checkbox en el encabezado */
.permissions-table th .d-flex {
  min-height: 48px;
}

/* Ajuste del tamaño del texto en el encabezado */
.permissions-table th span {
  font-size: 0.75rem;
  letter-spacing: 0.5px;
}

/* Hover effect para el checkbox de seleccionar todos */
.action-select-all:hover .form-check-input:not(:checked):not(:indeterminate) {
  border-color: #321fdb;
  background-color: rgba(50, 31, 219, 0.1);
}

/* Hover effects para los checkboxes de selección múltiple */
.resource-select-all:hover .form-check-input:not(:checked):not(:indeterminate),
.action-select-all:hover .form-check-input:not(:checked):not(:indeterminate) {
  border-color: #321fdb;
  background-color: rgba(50, 31, 219, 0.1);
}

.permissions-header {
  background-color: #fff;
  padding: 1rem;
  border-bottom: 2px solid #ebedef;
}

.permissions-header h4 {
  color: #1e293b;
  font-weight: 600;
}

.permission-unavailable {
  color: #cbd5e1;
  font-size: 1.2rem;
  font-weight: 400;
}

.form-check-input:checked {
  box-shadow: 0 0 0 2px rgba(50, 31, 219, 0.1);
}
</style> 