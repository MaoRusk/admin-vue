<script setup>
import SmartTablePolicies from './PoliciesTable.vue'  

</script>

<template>
  <CRow>
    <CCol :xs="12">
      <CCard class="mb-4">
        <CCardBody>
          <!-- Tabla de Polizas -->
          <SmartTablePolicies />
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>
</template>
  
