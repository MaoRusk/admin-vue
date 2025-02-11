<template>
  <CRow>
    <CCol :xs="12">
      <TenantsTable />
    </CCol>
  </CRow>
</template>

<script>
import TenantsTable from './TenantsTable.vue'

export default {
  name: 'Tenants',
  components: {
    TenantsTable
  }
}
</script> 