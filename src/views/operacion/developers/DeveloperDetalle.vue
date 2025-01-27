<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { API } from '@/services'

const route = useRoute()
const router = useRouter()
const developer = ref({
  name: '',
  is_developer: false,
  is_builder: false,
  is_owner: false,
  is_user_owner: false,
})

const loading = ref(false)
const error = ref(null)

onMounted(async () => {
  if (route.params.id !== 'create') {
    loading.value = true
    error.value = null
    try {
      const response = await API.developers.getDeveloper(route.params.id)
      developer.value = {
        name: response.data.data.name,
        is_developer: Boolean(response.data.data.is_developer),
        is_builder: Boolean(response.data.data.is_builder),
        is_owner: Boolean(response.data.data.is_owner),
        is_user_owner: Boolean(response.data.data.is_user_owner),
      }
      console.log('Developer data loaded:', developer.value)
    } catch (error) {
      console.error('Error fetching developer:', error)
      error.value = 'Error al cargar los datos del developer'
    } finally {
      loading.value = false
    }
  }
})

const saveDeveloper = async () => {
  loading.value = true
  error.value = null
  try {
    if (route.params.id === 'create') {
      await API.developers.createDeveloper(developer.value)
    } else {
      await API.developers.updateDeveloper(route.params.id, developer.value)
    }
    router.push('/operacion/developers')
  } catch (error) {
    console.error('Error saving developer:', error)
    error.value = 'Error al guardar los datos del developer'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <CRow>
    <CCol :xs="12">
      <CCard class="mb-4">
        <CCardHeader>
          <strong>{{ route.params.id === 'create' ? 'Nuevo Developer' : 'Editar Developer' }}</strong>
        </CCardHeader>
        <CCardBody>
          <div v-if="loading" class="text-center">
            <CSpinner />
            <p>Cargando datos...</p>
          </div>
          
          <CAlert v-if="error" color="danger">{{ error }}</CAlert>

          <CForm v-if="!loading" @submit.prevent="saveDeveloper">
            <CRow>
              <CCol :md="12">
                <CFormInput
                  label="Nombre"
                  v-model="developer.name"
                  required
                />
              </CCol>
              <CCol :md="3">
                <CFormSwitch
                  label="Is Developer"
                  v-model="developer.is_developer"
                />
              </CCol>
              <CCol :md="3">
                <CFormSwitch
                  label="Is Builder"
                  v-model="developer.is_builder"
                />
              </CCol>
              <CCol :md="3">
                <CFormSwitch
                  label="Is Owner"
                  v-model="developer.is_owner"
                />
              </CCol>
              <CCol :md="3">
                <CFormSwitch
                  label="Is User Owner"
                  v-model="developer.is_user_owner"
                />
              </CCol>
            </CRow>
            <CRow class="mt-3">
              <CCol>
                <CButton type="submit" color="primary">Guardar</CButton>
                <CButton
                  type="button"
                  color="secondary"
                  class="ms-2"
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