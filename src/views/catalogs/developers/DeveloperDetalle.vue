<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import Swal from 'sweetalert2'
import { useRoute, useRouter } from 'vue-router'
import { API } from '@/services'
import { ROUTE_NAMES } from '@/router/routeNames'
import { useAuthStore } from '../../../stores/auth'

const route = useRoute()
const router = useRouter()
const { can } = useAuthStore()

const markets = ref([])
const submarkets = ref([])
const loading = ref(false)
const error = ref(null)

// Inicializar developer con valores por defecto
const developer = ref({
  name: '',
  is_developer: false,
  is_builder: false,
  is_owner: false,
  market_id: null,
  sub_market_id: null
})

// Validar si estamos en la ruta de creación
const isCreating = computed(() => {
  return route.name === ROUTE_NAMES.DEVELOPERS_CREATE
})

const loadDeveloper = async () => {
  if (isCreating.value) return

  const id = route.params.id
  if (!id) return

  loading.value = true
  error.value = null

  try {
    const response = await API.developers.getDeveloper(id)
    if (response?.data) {
      developer.value = {
        id: response.data.id,
        name: response.data.name || '',
        is_developer: Boolean(response.data.is_developer),
        is_builder: Boolean(response.data.is_builder),
        is_owner: Boolean(response.data.is_owner),
        market_id: response.data.market_id || null,
        sub_market_id: response.data.sub_market_id || null
      }

      // Si hay un market_id, cargar los submarkets correspondientes
      if (developer.value.market_id) {
        await loadSubmarkets(developer.value.market_id)
      }
    }
  } catch (err) {
    console.error('Error loading developer:', err)
    error.value = 'Error al cargar los datos del developer'
    Swal.fire({
      icon: 'error',
      title: 'Error!',
      text: 'Error al cargar los datos del developer',
      toast: true,
      position: 'bottom',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true
    })
  } finally {
    loading.value = false
  }
}

const loadMarkets = async () => {
  try {
    const response = await API.markets.getMarkets()
    markets.value = Array.isArray(response) ? response : []
  } catch (err) {
    console.error('Error loading markets:', err)
    markets.value = []
  }
}

const loadSubmarkets = async (marketId) => {
  if (!marketId) {
    submarkets.value = []
    developer.value.sub_market_id = null
    return
  }
  try {
    const response = await API.submarkets.getSubmarkets({ market_id: marketId })
    submarkets.value = Array.isArray(response) ? response : []
  } catch (err) {
    console.error('Error loading submarkets:', err)
    submarkets.value = []
  }
}

// Watch para market_id
watch(() => developer.value.market_id, async (newMarketId) => {
  if (newMarketId) {
    await loadSubmarkets(newMarketId)
  } else {
    submarkets.value = []
    developer.value.sub_market_id = null
  }
})

const handleSubmit = async () => {
  try {
    if (isCreating.value) {
      await API.developers.createDeveloper(developer.value)
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
      await API.developers.updateDeveloper(developer.value.id, developer.value)
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
    router.push({ name: ROUTE_NAMES.DEVELOPERS })
  } catch (err) {
    console.error('Error saving developer:', err)
    Swal.fire({
      icon: 'error',
      title: 'Error!',
      text: 'Error al guardar los datos',
      toast: true,
      position: 'bottom',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true
    })
  }
}

onMounted(async () => {
  await loadMarkets()
  await loadDeveloper()
})
</script>

<template>
  <CRow>
    <CCol :xs="12">
      <CCard>
        <CCardHeader>
          <strong>{{ isCreating ? 'Nuevo Developer' : 'Editar Developer' }}</strong>
        </CCardHeader>
        <CCardBody>
          <CForm @submit.prevent="handleSubmit">
            <CRow class="mb-3">
              <CCol xs="12" md="6">
                <CFormInput
                  label="Name"
                  v-model="developer.name"
                  required
                />
              </CCol>
            </CRow>
            <CRow class="mb-3">
              <CCol xs="12" md="4">
                <CFormSwitch
                  label="Is Developer"
                  v-model="developer.is_developer"
                />
              </CCol>
              <CCol xs="12" md="4">
                <CFormSwitch
                  label="Is Builder"
                  v-model="developer.is_builder"
                />
              </CCol>
              <CCol xs="12" md="4">
                <CFormSwitch
                  label="Is Owner"
                  v-model="developer.is_owner"
                />
              </CCol>
            </CRow>
            <CRow class="mb-3">
              <CCol xs="12" md="6">
                <CFormSelect
                  label="Market"
                  v-model="developer.market_id"
                  :options="[
                    { value: null, label: 'Seleccione un Market' },
                    ...markets.map(market => ({
                      value: market.id,
                      label: market.name
                    }))
                  ]"
                />
              </CCol>
              <CCol xs="12" md="6">
                <CFormSelect
                  label="SubMarket"
                  v-model="developer.sub_market_id"
                  :options="[
                    { value: null, label: 'Seleccione un SubMarket' },
                    ...submarkets.map(submarket => ({
                      value: submarket.id,
                      label: submarket.name
                    }))
                  ]"
                  :disabled="!developer.market_id"
                />
              </CCol>
            </CRow>
            <CRow>
              <CCol xs="12" class="d-flex gap-2 justify-content-end">
                <CButton v-if="can('developers.update', 'developers.create')" type="submit" color="primary">Guardar</CButton>
                <CButton
                  type="button"
                  color="secondary"
                  @click="router.push({ name: ROUTE_NAMES.DEVELOPERS })"
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