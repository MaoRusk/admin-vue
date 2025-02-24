<script setup>
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router'

import ReitMortgageForm from './ReitMortgageForm.vue'

import { ROUTE_NAMES } from '../../../router/routeNames';

const route = useRoute()
const router = useRouter()

const reitMortgageId = computed(() => Number(route.params.reitMortgageId) || null)

const submittingForm = ref(false)
const disabledSave = ref(false)

const reitMortgageRef = ref(null);


const activeItemKey = ref(route.query.tab || 'ReitMortgage')


function dispatchSubmitForm() {
  if (activeItemKey.value === 'ReitMortgage') {
    reitMortgageRef.value?.submit?.()
  } else if (activeItemKey.value === 'Availability') {
    availabilityRef.value?.submit?.()
  } else if (activeItemKey.value === 'Absorption') {
    absorptionRef.value?.submit?.()
  }
}

function showList() {
  if (activeItemKey.value === 'ReitMortgage') {
    router.push({ name: ROUTE_NAMES.REIT_MORTGAGE })
  } else if (activeItemKey.value === 'Availability') {
    availabilityRef.value?.handleReturn?.()
  } else if (activeItemKey.value === 'Absorption') {
    absorptionRef.value?.handleReturn?.()
  }
}

</script>
<template>
  <div>
    <CCard class="container-btn-flotante">
      <CCardBody class="ps-1 py-3">
        <CRow class="justify-content-center">
          <CCol xs="auto" class="btns-flotantes-customer-moviles">
            <CLoadingButton color="success" variant="outline" @click="dispatchSubmitForm" class="me-3" :loading="submittingForm" :disabled="disabledSave">
              <CIcon name="cilSave" size="sm" /> Save
            </CLoadingButton>
            <CButton color="primary" variant="outline" @click="showList()">
              <CIcon name="cilArrowCircleLeft" size="sm" /> List
            </CButton>
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>
    <!-- TODO. quitar cuando se detecte error, bug: aveces cuando se da click sobre un tab, no se muestra su contenido, coloco variable para monitorear -->


          <ReitMortgageForm  :reitMortgageId="reitMortgageId" ref="reitMortgageRef" @submitting="(value) => { submittingForm = value; disabledSave = value }" />

  </div>
</template>

<style scoped>
.nav-item {
  cursor: pointer;
  padding: 8px 16px;
  transition: background-color 0.2s;
}

.nav-item:hover {
  background-color: #f8f9fa;
}

.card-header {
  background-color: #f8f9fa;
}
</style>
