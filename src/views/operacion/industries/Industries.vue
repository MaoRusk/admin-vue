<template>
  <CRow>
    <CCol :xs="12">
      <SmartTableIndustries />
    </CCol>
  </CRow>
</template>

<script>
import SmartTableIndustries from './IndustriesTable.vue'

export default {
  name: 'Industries',
  components: {
    SmartTableIndustries
  }
}
</script> 