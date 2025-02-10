<script setup>
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router'

import BuildingData from './BuildingData.vue'
import BuildingAvailability from './BuildingAvailability.vue'
import BuildingContact from './BuildingContact.vue';
import BuildingImages from './BuildingsImages.vue';
import BuildingAbsorption from './BuildingAbsorption.vue'
import { ROUTE_NAMES } from '../../../router/routeNames';

const router = useRouter()
const route = useRoute()

const buildingId = computed(() => Number(route.params.buildingId) || null)
const disabledTab = computed(() => !buildingId.value)

const activeTab = ref(route.query.tab || 'DataBuilding')
const submittingForm = ref(false)
const disabledSave = ref(false)

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

watch(activeTab, () => {
  if (activeTab.value === 'DataBuilding') {
    tabDataLoaded.value = true
  } else if (activeTab.value === 'Availability') {
    tabAvailabilityLoaded.value = true
    disabledSave.value = !(buildingAvailabilityRef.value?.showForm ?? false)
  } else if (activeTab.value === 'Absorption') {
    tabAbsorptionLoaded.value = true
    disabledSave.value = !(buildingAbsorptionRef.value?.showForm ?? false)
  } else if (activeTab.value === 'ContactBuilding') {
    tabContactLoaded.value = true
  } else if (activeTab.value === 'Files') {
    tabImagesLoaded.value = true
  }
  if (['DataBuilding', 'Files', 'ContactBuilding'].includes(activeTab.value)) {
    disabledSave.value = false
  }
}, { immediate: true })

watch(() => route.query.tab, (newTab) => {
  if (['DataBuilding', 'Availability', 'Absorption', 'ContactBuilding', 'Files'].includes(newTab)) {
    activeTab.value = newTab
  } else {
    activeTab.value = 'DataBuilding'
  }
}, { immediate: true })

function changeTab(tab) {
  activeTab.value = tab
  router.push({
    name: route.name,
    params: route.params,
    query: { ...route.query, tab }
  })
}

function showList() {
  if (['DataBuilding', 'ContactBuilding', 'Files'].includes(activeTab.value)) {
    router.push({ name: ROUTE_NAMES.BUILDINGS })
  } else if (activeTab.value === 'Availability') {
    buildingAvailabilityRef.value?.handleReturn?.()
  } else if (activeTab.value === 'Absorption') {
    buildingAbsorptionRef.value?.handleReturn?.()
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
              <CIcon name="cilSave" size="sm" />
              Save
            </CLoadingButton>
            <CButton color="primary" variant="outline" @click="showList()">
              <CIcon name="cilArrowCircleLeft" size="sm" /> List
            </CButton>
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>
    <!-- TODO. quitar cuando se detecte error, bug: aveces cuando se da click sobre un tab, no se muestra su contenido, coloco variable para monitorear -->
    {{ activeTab }}
    <CTabs :activeItemKey="activeTab">
      <CTabList variant="tabs" class="mt-4">
        <CTab itemKey="DataBuilding" @click="changeTab('DataBuilding')">Data Building</CTab>
        <CTab itemKey="Availability" @click="changeTab('Availability')" :disabled="disabledTab">Availability</CTab>
        <CTab itemKey="Absorption" @click="changeTab('Absorption')" :disabled="disabledTab">Absorption</CTab>
        <CTab itemKey="ContactBuilding" @click="changeTab('ContactBuilding')" :disabled="disabledTab">Building Contact</CTab>
        <CTab itemKey="Files" @click="changeTab('Files')" :disabled="disabledTab">Files</CTab>
      </CTabList>
      <CTabContent>
        <CTabPanel class="p-3" itemKey="DataBuilding">
          <BuildingData v-if="tabDataLoaded" :buildingId="buildingId" ref="buildingDataRef" @submitting="(value) => { submittingForm = value; disabledSave = value }" />
        </CTabPanel>
        <CTabPanel class="p-3" itemKey="Availability">
          <BuildingAvailability v-if="tabAvailabilityLoaded" :buildingId="buildingId" ref="buildingAvailabilityRef" @changeShowForm="(value) => disabledSave = !value" @submitting="(value) => { submittingForm = value; disabledSave = value }" />
        </CTabPanel>
        <CTabPanel class="p-3" itemKey="Absorption">
          <BuildingAbsorption v-if="tabAbsorptionLoaded" :buildingId="buildingId" ref="buildingAbsorptionRef" @changeShowForm="(value) => disabledSave = !value" @submitting="(value) => { submittingForm = value; disabledSave = value }" />
        </CTabPanel>
        <CTabPanel class="p-3" itemKey="ContactBuilding">
          <BuildingContact v-if="tabContactLoaded" :buildingId="buildingId" ref="buildingContactRef" />
        </CTabPanel>
        <CTabPanel class="p-3" itemKey="Files">
          <BuildingImages v-if="tabImagesLoaded" :buildingId="buildingId" ref="buildingImagesRef" />
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