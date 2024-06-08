<script setup>
import SmartTableCompanies from './EmpresasTable.vue'
// import SmartTableDownloadableExample from './SmartTableDownloadableExample.vue'
// import SmartTableSelectableExample from './SmartTableSelectableExample.vue'
</script>

<template>
  <CRow>
    <CCol :xs="12">
      <CCard class="mb-4">
        <CCardBody>
          <SmartTableCompanies />
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>
</template>
