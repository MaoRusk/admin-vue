<template>
  <CCard class="mb-4">
    <CCardHeader>
      <strong>{{ isNew ? 'New Industry' : 'Edit Industry' }}</strong>
    </CCardHeader>
    <CCardBody>
      <CForm @submit.prevent="saveIndustry">
        <CRow>
          <CCol :md="6">
            <CFormInput
              label="Name"
              v-model="industry.name"
              :feedback="nameError"
              :invalid="!!nameError"
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
import IndustriesService from '@/services/Industries'

export default {
  name: 'IndustryDetail',
  data() {
    return {
      industry: {
        name: ''
      },
      nameError: ''
    }
  },
  computed: {
    isNew() {
      return this.$route.params.id === '0'
    }
  },
  methods: {
    async loadIndustry() {
      if (!this.isNew) {
        try {
          const response = await IndustriesService.getIndustries()
          const industry = response.data.data.find(
            i => i.id === parseInt(this.$route.params.id)
          )
          if (industry) {
            this.industry = { ...industry }
          }
        } catch (error) {
          console.error('Error loading industry:', error)
        }
      }
    },
    async saveIndustry() {
      try {
        if (this.isNew) {
          await IndustriesService.createIndustry(this.industry)
        } else {
          await IndustriesService.updateIndustry(this.$route.params.id, this.industry)
        }
        this.goBack()
      } catch (error) {
        console.error('Error saving industry:', error)
      }
    },
    goBack() {
      this.$router.push('/operacion/industries')
    }
  },
  mounted() {
    this.loadIndustry()
  }
}
</script> 