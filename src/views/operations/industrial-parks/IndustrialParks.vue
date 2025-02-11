<template>
  <CRow>
    <CCol :xs="12">
      <IndustrialParksTable />
    </CCol>
  </CRow>
</template>

<script>
import IndustrialParksTable from './IndustrialParksTable.vue'

export default {
  name: 'IndustrialParks',
  components: {
    IndustrialParksTable
  }
}
</script> 