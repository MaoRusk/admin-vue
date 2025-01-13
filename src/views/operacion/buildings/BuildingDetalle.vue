<script setup>
import { ref, computed, watchEffect } from 'vue';
import { useRoute } from 'vue-router'
import { cilArrowCircleLeft, cilSave } from '@coreui/icons'

import BuildingData from './BuildingData.vue'
import BuildingAvailability from './BuildingAvailability.vue'
import BuildingContact from './BuildingContact.vue';
import BuildingImages from './BuildingsImages.vue';
import BuildingAbsorption from './BuildingAbsorption.vue'
import { ROUTE_NAMES } from '../../../router/routeNames';

const route = useRoute()

const buildingId = computed(() => Number(route.params.buildingId) || null)
const disabledTab = computed(() => !buildingId.value)

const activeTab = ref('DataBuilding')
const submittingForm = ref(false)

const buildingDataRef = ref(null);
const buildingAvailabilityRef = ref(null);
const buildingAbsorptionRef = ref(null);
const buildingContactRef = ref(null);
const buildingImagesRef = ref(null);

const tabDataLoaded = ref(false);
const tabAvailabilityLoaded = ref(false);
const tabContactLoaded = ref(false);
const tabImagesLoaded = ref(false);
const tabAbsorptionLoaded = ref(false);

function dispatchSubmitForm() {
  if (activeTab.value === 'DataBuilding') {
    buildingDataRef.value?.submit?.()
  } else if (activeTab.value === 'Availability') {
    buildingAvailabilityRef.value?.submit?.()
  } else if (activeTab.value === 'Absorption') {
    buildingAbsorptionRef.value?.submit?.()
  } else if (activeTab.value === 'ContactBuilding') {
    buildingImagesRef.value?.submit?.()
  } else if (activeTab.value === 'Files') {
    buildingContactRef.value?.submit?.()
  }
}

watchEffect(() => {
  if (activeTab.value === 'DataBuilding') {
    tabDataLoaded.value = true
  } else if (activeTab.value === 'Availability') {
    tabAvailabilityLoaded.value = true
  } else if (activeTab.value === 'Absorption') {
    tabAbsorptionLoaded.value = true
  } else if (activeTab.value === 'ContactBuilding') {
    tabContactLoaded.value = true
  } else if (activeTab.value === 'Files') {
    tabImagesLoaded.value = true
  }
})

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
        <CTab :disabled="disabledTab" itemKey="Availability" @click="activeTab = 'Availability'">Availability</CTab>
        <CTab :disabled="disabledTab" itemKey="Absorption" @click="activeTab = 'Absorption'">Absorption</CTab>
        <CTab :disabled="disabledTab" itemKey="ContactBuilding" @click="activeTab = 'ContactBuilding'">Building Contact</CTab>
        <CTab :disabled="disabledTab" itemKey="Files" @click="activeTab = 'Files'">Files</CTab>
      </CTabList>
      <CTabContent>
        <CTabPanel class="p-3" itemKey="DataBuilding">
          <BuildingData v-if="tabDataLoaded" :id="buildingId" ref="buildingDataRef" @submitting="(value) => submittingForm = value" />
        </CTabPanel>
        <CTabPanel class="p-3" itemKey="Availability">
          <BuildingAvailability v-if="tabAvailabilityLoaded" :id="buildingId" ref="buildingAvailabilityRef" />
        </CTabPanel>
        <CTabPanel class="p-3" itemKey="Absorption">
          <BuildingAbsorption v-if="tabAbsorptionLoaded" :id="buildingId" ref="buildingAbsorptionRef" />
        </CTabPanel>
        <CTabPanel class="p-3" itemKey="ContactBuilding">
          <BuildingContact v-if="tabContactLoaded" :id="buildingId" ref="buildingContactRef" />
        </CTabPanel>
        <CTabPanel class="p-3" itemKey="Files">
          <BuildingImages v-if="tabImagesLoaded" :id="buildingId" ref="buildingImagesRef" />
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