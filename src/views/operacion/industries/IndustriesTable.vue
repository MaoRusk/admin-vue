<script>
import IndustriesService from '@/services/Industries'

export default {
  data() {
    return {
      industries: [],
      columns: [
        {
          key: 'id',
          label: 'ID',
          _style: { width: '10%' },
        },
        {
          key: 'name',
          label: 'Name',
          _style: { width: '53%' },
        },
        {
          key: 'actions',
          label: 'Actions',
          _style: { width: '37%', textAlign: 'center' },
          sorter: false,
          filter: false
        }
      ],
      toast: {
        show: false,
        message: '',
        color: 'success'
      }
    }
  },

  methods: {
    async fetchIndustries() {
      try {
        const response = await IndustriesService.getIndustries()
        this.industries = response.data.data || []
        return this.industries
      } catch (error) {
        console.error('Error fetching industries:', error)
        this.industries = []
        return []
      }
    },

    newIndustry() {
      this.$router.push({ name: 'IndustryDetail', params: { id: 0 } })
    },

    viewDetails(item) {
      this.$router.push({ name: 'IndustryDetail', params: { id: item.id } })
    },

    showToast(message, color = 'success') {
      this.toast.message = message
      this.toast.color = color
      this.toast.show = true
      setTimeout(() => {
        this.toast.show = false
      }, 3000)
    },

    async deleteIndustry(item) {
      if (confirm('Are you sure you want to delete this industry?')) {
        try {
          await IndustriesService.deleteIndustry(item.id)
          await this.fetchIndustries()
          this.showToast('Industry deleted successfully')
        } catch (error) {
          console.error('Error deleting industry:', error)
          this.showToast('Error deleting industry', 'danger')
        }
      }
    }
  },

  mounted() {
    return this.fetchIndustries()
  }
}
</script>

<template>
  <CToaster placement="top-end">
    <CToast
      :autohide="true"
      :visible="toast.show"
      :color="toast.color"
    >
      <CToastHeader closeButton>
        <span class="me-auto fw-bold">Notification</span>
      </CToastHeader>
      <CToastBody>
        {{ toast.message }}
      </CToastBody>
    </CToast>
  </CToaster>

  <CCard class="mb-4">
    <CRow>
      <CCol :xs="12" :xl="10">&nbsp;</CCol>
      <CCol :xs="12" :xl="2">
        <CCardBody>
          <CButton color="success" @click="newIndustry()">
            <CIcon icon="cilPlus" class="me-2" />New Industry
          </CButton>
        </CCardBody>
      </CCol>
    </CRow>
  </CCard>

  <CCard class="mb-4">
    <CCardBody>
      <CSmartTable
        v-if="industries.length > 0"
        :active-page="1"
        :items="industries"
        :columns="columns"
        :items-per-page="10"
        :table-filter="true"
        cleaner
        :table-filter-label="'Search:'"
        :table-filter-placeholder="'Type something...'"
        :pagination="true"
        hover
      >
        <template #actions="{ item }">
          <td class="py-2" style="text-align: center">
            <CButton 
              color="primary" 
              variant="outline" 
              square 
              size="sm" 
              @click="viewDetails(item)"
              class="mx-1"
            >
              <CIcon icon="cil-pencil" />
            </CButton>
            <CButton 
              color="danger" 
              variant="outline" 
              square 
              size="sm" 
              class="mx-1"
              @click="deleteIndustry(item)"
            >
              <CIcon icon="cil-trash" />
            </CButton>
          </td>
        </template>
      </CSmartTable>
    </CCardBody>
  </CCard>
</template> 