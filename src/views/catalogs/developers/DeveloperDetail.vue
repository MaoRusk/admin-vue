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
            <MSelect
              v-model="developer.market_id"
              :options="marketOptions"
              label="Market"
            />
          </CCol>
          <CCol :md="6">
            <MSelect
              v-model="developer.sub_market_id"
              :options="submarketOptions"
              label="SubMarket"
              :disabled="!developer.market_id"
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
      if (this.isNew) {
        console.log('Creating new developer')
        return
      }

      const id = this.$route.params.id
      console.log('Loading developer with ID:', id)

      try {
        const response = await API.developers.getDeveloper(id)
        console.log('Full response:', response)

        if (response && response.data) {
          console.log('Developer data before processing:', response.data)
          
          // Crear un objeto temporal con los datos procesados
          const processedData = {
            id: response.data.id,
            name: response.data.name || '',
            is_developer: Boolean(Number(response.data.is_developer)),
            is_builder: Boolean(Number(response.data.is_builder)),
            is_owner: Boolean(Number(response.data.is_owner)),
            market_id: Number(response.data.market_id) || null,
            sub_market_id: Number(response.data.sub_market_id) || null
          }
          
          console.log('Processed developer data:', processedData)
          
          // Asignar los datos procesados al developer
          Object.assign(this.developer, processedData)
          
          console.log('Current developer state:', this.developer)

          if (this.developer.market_id) {
            console.log('Loading submarkets for market:', this.developer.market_id)
            await this.loadSubmarkets(this.developer.market_id)
          }
        } else {
          console.warn('No data received from API')
        }
      } catch (error) {
        console.error('Error in loadDeveloper:', error)
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
        const developerData = {
          ...this.developer,
          market_id: this.developer.market_id ? Number(this.developer.market_id) : null,
          sub_market_id: this.developer.sub_market_id ? Number(this.developer.sub_market_id) : null,
          is_developer: Boolean(this.developer.is_developer),
          is_builder: Boolean(this.developer.is_builder),
          is_owner: Boolean(this.developer.is_owner)
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
          await DevelopersService.updateDeveloper(this.$route.params.id, developerData)
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