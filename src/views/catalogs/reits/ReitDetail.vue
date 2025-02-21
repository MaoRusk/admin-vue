<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ReitsService from '@/services/Reits'
import { ROUTE_NAMES } from '@/router/routeNames'

const route = useRoute()
const router = useRouter()

const isCreating = computed(() => {
  return route.path === '/operations/reits/create' || route.name === ROUTE_NAMES.REITS_CREATE
})

const reit = ref({
  name: '',
})

const loading = ref(false)
const error = ref(null)

const loadReit = async (id) => {
  if (!id || isCreating.value) return

  loading.value = true
  error.value = null
  try {
    const response = await ReitsService.getReit(id)
    if (response.data && response.data.data) {
      reit.value = {
        name: response.data.data.name,
      }
    }
  } catch (error) {
    console.error('Error fetching REIT:', error)
    error.value = 'Error al cargar los datos del REIT'
    router.push('/operations/reits')
  } finally {
    loading.value = false
  }
}

if (!isCreating.value && route.params.id) {
  loadReit(route.params.id)
}

const saveReit = async () => {
  if (!reit.value.name.trim()) {
    error.value = 'El nombre es requerido'
    return
  }

  loading.value = true
  error.value = null
  
  try {
    const reitData = {
      name: reit.value.name.trim(),
    }

    if (isCreating.value) {
      await ReitsService.createReit(reitData)
    } else if (route.params.id) {
      await ReitsService.updateReit(route.params.id, reitData)
    } else {
      throw new Error('Operación no válida')
    }
    
    router.push({ name: ROUTE_NAMES.REITS })
  } catch (error) {
    console.error('Error saving REIT:', error)
    if (error.response?.status === 422) {
      const validationErrors = error.response.data.errors
      if (validationErrors) {
        error.value = Object.values(validationErrors).flat().join('\n')
      } else {
        error.value = error.response.data.message || 'Error de validación'
      }
    } else {
      error.value = isCreating.value 
        ? 'Error al crear el REIT'
        : 'Error al actualizar el REIT'
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <CRow>
    <CCol xs="12">
      <CCard>
        <CCardHeader>
          <CRow class="align-items-center">
            <CCol>
              <div class="d-flex align-items-center justify-content-between">
                <h5 class="mb-0">
                  {{ isCreating ? 'New REIT' : 'Edit REIT' }}
                </h5>
                <router-link to="../reits">
                  <CButton color="primary" variant="outline">
                    <CIcon icon="cil-arrow-circle-left" class="me-2" />
                    Return
                  </CButton>
                </router-link>
              </div>
            </CCol>
          </CRow>
        </CCardHeader>

        <CCardBody>
          <div v-if="loading" class="text-center">
            <CSpinner />
            <p>{{ isCreating ? 'Creating...' : 'Loading data...' }}</p>
          </div>
          
          <CAlert v-if="error" color="danger">{{ error }}</CAlert>

          <CForm v-if="!loading" @submit.prevent="saveReit">
            <CRow class="mb-3">
              <CCol xs="12">
                <CFormInput
                  label="Name"
                  v-model.trim="reit.name"
                  required
                  :state="reit.name.trim() ? true : null"
                  invalid-feedback="Name is required"
                />
              </CCol>
            </CRow>
            <CRow>
              <CCol xs="12" class="d-flex gap-2 justify-content-end">
                <CButton type="submit" color="primary">Save</CButton>
                <CButton
                  type="button"
                  color="secondary"
                  @click="router.push('/operations/reits')"
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