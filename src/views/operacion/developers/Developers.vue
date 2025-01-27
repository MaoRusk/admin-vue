<template>
  <CRow>
    <CCol :xs="12">
      <SmartTableDevelopers />
    </CCol>
  </CRow>
</template>

<script>
import SmartTableDevelopers from './DevelopersTable.vue'

export default {
  name: 'Developers',
  components: {
    SmartTableDevelopers
  }
}
</script> 