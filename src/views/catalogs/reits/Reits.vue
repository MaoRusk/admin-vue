<template>
  <CRow>
    <CCol :xs="12">
      <SmartTableReits />
    </CCol>
  </CRow>
</template>

<script>
import SmartTableReits from './ReitsTable.vue'

export default {
  name: 'Reits',
  components: {
    SmartTableReits
  }
}
</script> 