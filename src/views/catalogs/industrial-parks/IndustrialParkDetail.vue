<template>
  <CCard class="mb-4">
    <CCardHeader>
      <strong>{{ isNew ? 'New Industrial Park' : 'Edit Industrial Park' }}</strong>
    </CCardHeader>
    <CCardBody>
      <CForm @submit.prevent="saveIndustrialPark">
        <CRow>
          <CCol :md="6">
            <CFormInput
              label="Name"
              v-model="industrialPark.name"
              :feedback="errors.name"
              :invalid="!!errors.name"
              required
            />
          </CCol>
        </CRow>
        <CRow class="mt-3">
          <CCol :md="6">
            <CFormSelect
              label="Market"
              v-model="industrialPark.market_id"
              :options="marketOptions"
              :feedback="errors.market_id"
              :invalid="!!errors.market_id"
              required
            />
          </CCol>
          <CCol :md="6">
            <CFormSelect
              label="Submarket"
              v-model="industrialPark.sub_market_id"
              :options="submarketOptions"
              :feedback="errors.sub_market_id"
              :invalid="!!errors.sub_market_id"
              :disabled="!industrialPark.market_id"
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
import IndustrialParksService from '@/services/IndustrialParks'
import MarketsService from '@/services/Markets'
import SubmarketsService from '@/services/Submarkets'
import Swal from 'sweetalert2'
import { ROUTE_NAMES } from '../../../router/routeNames';

export default {
  name: 'IndustrialParkDetail',
  data() {
    return {
      isLoading: true,
      previousMarketId: null,
      industrialPark: {
        name: '',
        market_id: '',
        sub_market_id: ''
      },
      errors: {
        name: '',
        market_id: '',
        sub_market_id: ''
      },
      markets: [],
      submarkets: []
    }
  },
  computed: {
    isNew() {
      return this.$route.params.id === '0'
    },
    marketOptions() {
      return [
        { value: '', label: 'Select a market' },
        ...this.markets.map(market => ({
          value: market.id,
          label: market.name
        }))
      ]
    },
    submarketOptions() {
      const filteredSubmarkets = this.submarkets.filter(
        submarket => submarket.market_id === Number(this.industrialPark.market_id)
      )
      return [
        { value: '', label: 'Select a submarket' },
        ...filteredSubmarkets.map(submarket => ({
          value: submarket.id,
          label: submarket.name
        }))
      ]
    }
  },
  methods: {
    async loadMarkets() {
      try {
        const response = await MarketsService.getMarkets()
        this.markets = response || []
      } catch (error) {
        console.error('Error loading markets:', error)
        this.markets = []
      }
    },
    async loadSubmarkets() {
      try {
        const response = await SubmarketsService.getSubmarkets()
        this.submarkets = response || []
      } catch (error) {
        console.error('Error loading submarkets:', error)
        this.submarkets = []
      }
    },
    async loadIndustrialPark() {
      if (!this.isNew) {
        try {
          this.isLoading = true
          const response = await IndustrialParksService.getIndustrialPark(this.$route.params.id)
          if (response.data.data) {
            this.industrialPark = {
              name: response.data.data.name,
              market_id: response.data.data.market_id,
              sub_market_id: response.data.data.sub_market_id
            }
            this.previousMarketId = response.data.data.market_id
          }
        } catch (error) {
          console.error('Error loading industrial park:', error)
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Error loading industrial park',
            toast: true,
            position: 'bottom',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
          })
        } finally {
          this.isLoading = false
        }
      } else {
        this.isLoading = false
      }
    },
    clearErrors() {
      this.errors = {
        name: '',
        market_id: '',
        sub_market_id: ''
      }
    },
    async saveIndustrialPark() {
      this.clearErrors()
      
      try {
        if (this.isNew) {
          await IndustrialParksService.createIndustrialPark(this.industrialPark)
          Swal.fire({
            icon: 'success',
            title: 'Created successfully!',
            text: 'New industrial park has been created.',
            toast: true,
            position: 'bottom',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
          })
        } else {
          await IndustrialParksService.updateIndustrialPark(this.$route.params.id, this.industrialPark)
          Swal.fire({
            icon: 'success',
            title: 'Updated successfully!',
            text: 'Industrial park has been updated.',
            toast: true,
            position: 'bottom',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
          })
        }
        this.goBack()
      } catch (error) {
        console.error('Error saving industrial park:', error)
        if (error.response?.data?.errors) {
          this.errors = error.response.data.errors
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Error saving industrial park',
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
      this.$router.push({ name: ROUTE_NAMES.INDUSTRIAL_PARKS })
    }
  },
  watch: {
    'industrialPark.market_id'(newValue) {
      if (!this.isLoading && this.previousMarketId !== null && newValue !== this.previousMarketId) {
        this.industrialPark.sub_market_id = ''
      }
      this.previousMarketId = newValue
    }
  },
  async mounted() {
    await Promise.all([
      this.loadMarkets(),
      this.loadSubmarkets(),
      this.loadIndustrialPark()
    ])
  }
}
</script> 