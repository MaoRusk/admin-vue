<script setup>
import SmartTablePolizas from './PolizasTable.vue'  

</script>

<template>
  <CRow>
    <CCol :xs="12">
      <CCard class="mb-4">
        <CCardBody>
          <!-- Tabla de Polizas -->
          <SmartTablePolizas />
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>
</template>
  
