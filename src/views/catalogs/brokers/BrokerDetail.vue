<template>
  <CCard class="mb-4">
    <CCardHeader>
      <strong>{{ isNew ? 'New Broker' : 'Edit Broker' }}</strong>
    </CCardHeader>
    <CCardBody>
      <CForm @submit.prevent="saveBroker">
        <CRow>
          <CCol :md="6">
            <CFormInput
              label="Name"
              v-model="broker.name"
              :feedback="errors.name"
              :invalid="!!errors.name"
              required
            />
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
import { API } from '@/services'
import Swal from 'sweetalert2'
import { ROUTE_NAMES } from '@/router/routeNames'

export default {
  name: 'BrokerDetail',
  props: {
    id: {
      type: [String, Number],
      default: 0
    }
  },
  data() {
    return {
      broker: {
        name: '',
      },
      errors: {
        name: '',
      }
    }
  },
  computed: {
    isNew() {
      return this.id === 0 || this.id === '0'
    }
  },
  methods: {
    async loadBroker() {
      if (!this.isNew) {
        try {
          const response = await API.brokers.getBroker(this.id)
          if (response.data.data) {
            const { name } = response.data.data
            this.broker = { name }
          }
        } catch (error) {
          console.error('Error loading broker:', error)
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Error loading broker',
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
      }
    },
    async saveBroker() {
      this.clearErrors()
      try {
        const brokerData = {
          name: this.broker.name,
        }

        if (this.isNew) {
          await API.brokers.createBroker(brokerData)
          Swal.fire({
            icon: 'success',
            title: 'Created successfully!',
            text: 'New broker has been created.',
            toast: true,
            position: 'bottom',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
          })
        } else {
          await API.brokers.updateBroker(this.id, brokerData)
          Swal.fire({
            icon: 'success',
            title: 'Updated successfully!',
            text: 'Broker has been updated.',
            toast: true,
            position: 'bottom',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
          })
        }
        this.goBack()
      } catch (error) {
        console.error('Error saving broker:', error)
        if (error.response?.data?.errors) {
          this.errors = error.response.data.errors
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Error saving broker',
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
      this.$router.push({ name: ROUTE_NAMES.BROKERS_INDEX })
    }
  },
  mounted() {
    this.loadBroker()
  }
}
</script> 