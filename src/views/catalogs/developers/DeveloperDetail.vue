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
          <CCol :md="6">
            <CFormSelect
              label="Market *"
              v-model="developer.market_id"
              :options="marketOptions"
              :invalid="!developer.market_id"
              required
            />
          </CCol>
          <CCol :md="6">
            <CFormSelect
              label="SubMarket *"
              v-model="developer.sub_market_id"
              :options="submarketOptions"
              :invalid="!developer.sub_market_id"
              :disabled="!developer.market_id"
              required
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
import { ref, onMounted, watch } from 'vue'
import DevelopersService from '@/services/Developers'
import { API } from '@/services'
import Swal from 'sweetalert2'
import MSelect from '@/components/MSelect.vue'
import { ROUTE_NAMES } from '@/router/routeNames';

export default {
  name: 'DeveloperDetail',
  components: {
    MSelect
  },
  data() {
    return {
      developer: {
        id: null,
        name: '',
        is_developer: false,
        is_builder: false,
        is_owner: false,
        market_id: null,
        sub_market_id: null
      },
      markets: [],
      submarkets: [],
      errors: {
        name: ''
      }
    }
  },
  computed: {
    isNew() {
      return !this.$route.params.id || this.$route.params.id === '0'
    },
    marketOptions() {
      return this.markets.map(market => ({
        value: market.id,
        label: market.name
      }))
    },
    submarketOptions() {
      return this.submarkets.map(submarket => ({
        value: submarket.id,
        label: submarket.name
      }))
    }
  },
  methods: {
    async loadMarkets() {
      try {
        const response = await API.markets.getMarkets()
        this.markets = Array.isArray(response) ? response : []
      } catch (error) {
        console.error('Error loading markets:', error)
        this.markets = []
      }
    },
    async loadSubmarkets(marketId) {
      if (!marketId) return
      try {
        const response = await API.submarkets.getSubmarkets({ market_id: marketId })
        this.submarkets = Array.isArray(response) ? response : []
      } catch (error) {
        console.error('Error loading submarkets:', error)
        this.submarkets = []
      }
    },
    async loadDeveloper() {
      if (this.isNew) return;

      const id = this.$route.params.id
      try {
        const response = await API.developers.getDeveloper(id)
        if (response?.data) {
          this.developer = {
            id: response.data.id,
            name: response.data.name || '',
            is_developer: Boolean(Number(response.data.is_developer)),
            is_builder: Boolean(Number(response.data.is_builder)),
            is_owner: Boolean(Number(response.data.is_owner)),
            market_id: response.data.market_id ? Number(response.data.market_id) : null,
            sub_market_id: response.data.sub_market_id ? Number(response.data.sub_market_id) : null
          }

          if (this.developer.market_id) {
            await this.loadSubmarkets(this.developer.market_id)
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
    },
    clearErrors() {
      this.errors = {
        name: ''
      }
    },
    async saveDeveloper() {
      this.clearErrors()
      
      try {
        // Validar todos los campos requeridos
        if (!this.developer.name?.trim()) {
          throw new Error('Name is required')
        }
        if (!this.developer.market_id) {
          throw new Error('Market is required')
        }
        if (!this.developer.sub_market_id) {
          throw new Error('SubMarket is required')
        }

        const developerData = {
          name: this.developer.name.trim(),
          is_developer: this.developer.is_developer ? 1 : 0,
          is_builder: this.developer.is_builder ? 1 : 0,
          is_owner: this.developer.is_owner ? 1 : 0,
          market_id: Number(this.developer.market_id),
          sub_market_id: Number(this.developer.sub_market_id)
        }

        if (this.isNew) {
          await DevelopersService.createDeveloper(developerData)
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
          const id = this.$route.params.id
          await DevelopersService.updateDeveloper(id, developerData)
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
        
        // Manejar errores de validación
        if (error.response?.status === 422) {
          const validationErrors = error.response.data.errors
          const firstError = Object.values(validationErrors)[0][0]
          Swal.fire({
            icon: 'error',
            title: 'Validation Error',
            text: firstError || 'Please check all required fields',
            toast: true,
            position: 'bottom',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
          })
        } else {
          // Manejar errores de validación local
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: error.message || 'Error saving developer',
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
      this.$router.push({ name: ROUTE_NAMES.DEVELOPERS });
    }
  },
  watch: {
    'developer.market_id': {
      immediate: true,
      async handler(newValue) {
        if (newValue) {
          await this.loadSubmarkets(newValue)
        } else {
          this.submarkets = []
          this.developer.sub_market_id = null
        }
      }
    },
    '$route.params.id': {
      immediate: true,
      handler(newId) {
        console.log('Route ID changed to:', newId)
        this.loadDeveloper()
      }
    },
    developer: {
      deep: true,
      handler(newVal) {
        console.log('Developer object changed:', newVal)
      }
    }
  },
  async mounted() {
    console.log('Component mounted')
    console.log('Route params:', this.$route.params)
    await this.loadMarkets()
    await this.loadDeveloper()
  }
}
</script> 