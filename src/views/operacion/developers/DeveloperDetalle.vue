<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { API } from '@/services'

const route = useRoute()
const router = useRouter()

// Validar si estamos en la ruta de creación
const isCreating = computed(() => {
  return route.path === '/operacion/developer/create' || route.name === 'DEVELOPERS_CREATE'
})

const developer = ref({
  name: '',
  is_developer: false,
  is_builder: false,
  is_owner: false,
  is_user_owner: false,
})

const loading = ref(false)
const error = ref(null)

const loadDeveloper = async (id) => {
  if (!id || isCreating.value) return

  loading.value = true
  error.value = null
  try {
    const response = await API.developers.getDeveloper(id)
    if (response.data && response.data.data) {
      developer.value = {
        name: response.data.data.name,
        is_developer: Boolean(response.data.data.is_developer),
        is_builder: Boolean(response.data.data.is_builder),
        is_owner: Boolean(response.data.data.is_owner),
        is_user_owner: Boolean(response.data.data.is_user_owner),
      }
    }
  } catch (error) {
    console.error('Error fetching developer:', error)
    error.value = 'Error al cargar los datos del developer'
    router.push('/operacion/developers')
  } finally {
    loading.value = false
  }
}

// Solo cargar datos si estamos editando y tenemos un ID válido
if (!isCreating.value && route.params.id) {
  loadDeveloper(route.params.id)
}

const saveDeveloper = async () => {
  if (!developer.value.name.trim()) {
    error.value = 'El nombre es requerido'
    return
  }

  loading.value = true
  error.value = null
  
  try {
    const developerData = {
      name: developer.value.name.trim(),
      is_developer: Number(developer.value.is_developer),
      is_builder: Number(developer.value.is_builder),
      is_owner: Number(developer.value.is_owner),
      is_user_owner: Number(developer.value.is_user_owner),
    }

    // Validar la operación basada en la ruta actual
    if (isCreating.value) {
      await API.developers.createDeveloper(developerData)
    } else if (route.params.id) {
      await API.developers.updateDeveloper(route.params.id, developerData)
    } else {
      throw new Error('Operación no válida')
    }
    
    router.push('/operacion/developers')
  } catch (error) {
    console.error('Error saving developer:', error)
    if (error.response?.status === 422) {
      const validationErrors = error.response.data.errors
      if (validationErrors) {
        error.value = Object.values(validationErrors).flat().join('\n')
      } else {
        error.value = error.response.data.message || 'Error de validación'
      }
    } else {
      error.value = isCreating.value 
        ? 'Error al crear el developer'
        : 'Error al actualizar el developer'
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <CRow>
    <CCol xs="12" lg="8" xl="6" class="mx-auto">
      <CCard class="mb-4">
        <CCardHeader>
          <strong>{{ isCreating ? 'Nuevo Developer' : 'Editar Developer' }}</strong>
        </CCardHeader>
        <CCardBody>
          <div v-if="loading" class="text-center">
            <CSpinner />
            <p>{{ isCreating ? 'Creando...' : 'Cargando datos...' }}</p>
          </div>
          
          <CAlert v-if="error" color="danger">{{ error }}</CAlert>

          <CForm v-if="!loading" @submit.prevent="saveDeveloper">
            <CRow class="mb-3">
              <CCol xs="12">
                <CFormInput
                  label="Nombre"
                  v-model.trim="developer.name"
                  required
                  :state="developer.name.trim() ? true : null"
                  invalid-feedback="El nombre es requerido"
                />
              </CCol>
            </CRow>
            <CRow class="mb-3">
              <CCol xs="12" sm="6" md="3">
                <CFormSwitch
                  label="Is Developer"
                  v-model="developer.is_developer"
                />
              </CCol>
              <CCol xs="12" sm="6" md="3">
                <CFormSwitch
                  label="Is Builder"
                  v-model="developer.is_builder"
                />
              </CCol>
              <CCol xs="12" sm="6" md="3">
                <CFormSwitch
                  label="Is Owner"
                  v-model="developer.is_owner"
                />
              </CCol>
              <CCol xs="12" sm="6" md="3">
                <CFormSwitch
                  label="Is User Owner"
                  v-model="developer.is_user_owner"
                />
              </CCol>
            </CRow>
            <CRow>
              <CCol xs="12" class="d-flex gap-2 justify-content-end">
                <CButton type="submit" color="primary">Guardar</CButton>
                <CButton
                  type="button"
                  color="secondary"
                  @click="router.push('/operacion/developers')"
                >
                  Cancelar
                </CButton>
              </CCol>
            </CRow>
          </CForm>
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>
</template>

<style scoped>
.form-switch {
  padding-left: 2.5em;
}

@media (max-width: 768px) {
  .form-switch {
    margin-bottom: 1rem;
  }
}
</style> 