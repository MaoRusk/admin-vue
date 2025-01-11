<script setup>
import { ref, watch, computed } from 'vue';
import { useRoute } from 'vue-router'
import { cilArrowCircleLeft, cilSave } from '@coreui/icons'
import BuildingData from './BuildingData.vue'
import BuildingAvailability from './BuildingAvailability.vue'
import BuildingContact from './BuildingContact.vue';
import BuildingImages from './BuildingsImages.vue';
import BuildingAbsorption from './BuildingAbsorption.vue'
import { ROUTE_NAMES } from '../../../router/routeNames';

const route = useRoute()

watch(
  () => route.params.buildingId,
  (newId) => {
    console.log(newId)
  }
)

const buildingId = computed(() => Number(route.params.buildingId) || null)

const activeTab = ref('DataBuilding')
const submittingForm = ref(false)

const buildingDataRef = ref(null);
const buildingAvailabilityRef = ref(null);
const buildingContactRef = ref(null);
const buildingImagesRef = ref(null);
const buildingAbsorptionRef = ref(null);

function dispatchSubmitForm() {
  if (activeTab.value === 'DataBuilding') {
    buildingDataRef.value?.submit()
  } else if (activeTab.value === 'Availability') {
    buildingAvailabilityRef.value?.submit()
  } else if (activeTab.value === 'Absorption') {
    buildingContactRef.value?.submit()
  } else if (activeTab.value === 'ContactBuilding') {
    buildingImagesRef.value?.submit()
  } else if (activeTab.value === 'Files') {
    buildingAbsorptionRef.value?.submit()
  }
}

</script>
<template>
  <div>
    <CCard class="container-btn-flotante">
      <CCardBody class="ps-1 py-3">
        <CRow class="justify-content-center">
          <CCol xs="auto" class="btns-flotantes-customer-moviles">
            <CLoadingButton color="success" variant="outline" @click="dispatchSubmitForm" class="me-3" :loading="submittingForm">
              <CIcon :content="cilSave" size="sm" />
              Save
            </CLoadingButton>
            <router-link :to="{ name: ROUTE_NAMES.BUILDINGS_CREATE }">
              <CButton color="primary" variant="outline" @click="this.$router.back()">
                <CIcon :content="cilArrowCircleLeft" size="sm" /> back
              </CButton>
            </router-link>
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>

    <CTabs activeItemKey="DataBuilding">
      <CTabList variant="tabs" class="mt-4">
        <CTab itemKey="DataBuilding" @click="activeTab = 'DataBuilding'">Data Building</CTab>
        <CTab itemKey="Availability" @click="activeTab = 'Availability'">Availability</CTab>
        <CTab itemKey="Absorption" @click="activeTab = 'Absorption'">Absorption</CTab>
        <CTab itemKey="ContactBuilding" @click="activeTab = 'ContactBuilding'">Building Contact</CTab>
        <CTab itemKey="Files" @click="activeTab = 'Files'">Files</CTab>
      </CTabList>
      <CTabContent>
        <CTabPanel class="p-3" itemKey="DataBuilding">
          <BuildingData :id="buildingId" ref="buildingDataRef" @submitting="(value) => submittingForm = value" />
        </CTabPanel>
        <CTabPanel class="p-3" itemKey="Availability">
          <BuildingAvailability :id="buildingId" ref="buildingAvailabilityRef" />
        </CTabPanel>
        <CTabPanel class="p-3" itemKey="Absorption">
          <BuildingAbsorption :id="buildingId" ref="buildingAbsorptionRef" />
        </CTabPanel>
        <CTabPanel class="p-3" itemKey="ContactBuilding">
          <BuildingContact :id="buildingId" ref="buildingContactRef" />
        </CTabPanel>
        <CTabPanel class="p-3" itemKey="Files">
          <BuildingImages :id="buildingId" ref="buildingImagesRef" />
        </CTabPanel>
      </CTabContent>
    </CTabs>
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