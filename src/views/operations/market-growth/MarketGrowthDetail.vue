<script setup>
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router'

import { ROUTE_NAMES } from '../../../router/routeNames';
import MarketGrowthForm from './MarketGrowthForm.vue'
import { useAuthStore } from '../../../stores/auth';

const route = useRoute()
const router = useRouter()
const { can } = useAuthStore()

const marketGrowthId = computed(() => Number(route.params.marketGrowthId) || null)

const submittingForm = ref(false)
const disabledSave = ref(false)

const marketGrowthRef = ref(null);

watch(
  () => route.params.marketGrowthId,
  () => {
    // Handle ID changes if needed
  }
)

function dispatchSubmitForm() {
  marketGrowthRef.value?.submit?.()
}

function showList() {
  router.push({ name: ROUTE_NAMES.MARKET_GROWTH_INDEX })
}

defineExpose({
  submit() {
    if (marketGrowthRef.value?.reportValidity()) {
      marketGrowthRef.value?.requestSubmit()
    }
  }
})
</script>

<template>
  <div>
    <CCard class="container-btn-flotante">
      <CCardBody class="ps-1 py-3">
        <CRow class="justify-content-center">
          <CCol xs="auto" class="btns-flotantes-customer-moviles">
            <CLoadingButton 
              color="success" 
              variant="outline" 
              @click="dispatchSubmitForm" 
              class="me-3" 
              :loading="submittingForm" 
              :disabled="disabledSave"
              v-if="can('market-growths.create', 'market-growths.update')"
            >
              <CIcon name="cilSave" size="sm" /> Save
            </CLoadingButton>
            <CButton color="primary" variant="outline" @click="showList()">
              <CIcon name="cilArrowCircleLeft" size="sm" /> List
            </CButton>
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>

    <MarketGrowthForm 
      :marketGrowthId="marketGrowthId" 
      ref="marketGrowthRef" 
      @submitting="(value) => { submittingForm = value; disabledSave = value }" 
    />
  </div>
</template>
