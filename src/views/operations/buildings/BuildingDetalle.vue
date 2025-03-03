<script setup>
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router'

import BuildingData from './BuildingData.vue'
import BuildingAvailability from './BuildingAvailability.vue'
import BuildingAbsorption from './BuildingAbsorption.vue'
import BuildingContactsIndex from './BuildingContactsIndex.vue';
import { ROUTE_NAMES } from '../../../router/routeNames';
import { useAuthStore } from '../../../stores/auth';

const router = useRouter()
const route = useRoute()
const { can } = useAuthStore()

const buildingId = computed(() => Number(route.params.buildingId) || null)
const showTab = computed(() => !!buildingId.value)

const activeTab = ref(route.query.tab || 'DataBuilding')
const submittingForm = ref(false)
const disabledSave = ref(false)
const showSave = ref(false)

const buildingDataRef = ref(null);
const buildingAvailabilityRef = ref(null);
const buildingAbsorptionRef = ref(null);
const buildingContactRef = ref(null);

const tabDataLoaded = ref(false);
const tabAvailabilityLoaded = ref(false);
const tabContactLoaded = ref(false);
const tabAbsorptionLoaded = ref(false);

function dispatchSubmitForm() {
  if (activeTab.value === 'DataBuilding') {
    buildingDataRef.value?.submit?.()
  } else if (activeTab.value === 'Availability') {
    buildingAvailabilityRef.value?.submit?.()
  } else if (activeTab.value === 'Absorption') {
    buildingAbsorptionRef.value?.submit?.()
  } else if (activeTab.value === 'ContactBuilding') {
    buildingContactRef.value?.submit?.()
  }
}

watch(activeTab, () => {
  if (activeTab.value === 'DataBuilding') {
    tabDataLoaded.value = true
    showSave.value = can('buildings.create', 'buildings.update')
  } else if (activeTab.value === 'Availability') {
    tabAvailabilityLoaded.value = true
    showSave.value = (buildingAvailabilityRef.value?.showForm ?? false) && can('buildings.availability.create', 'buildings.availability.update')
  } else if (activeTab.value === 'Absorption') {
    tabAbsorptionLoaded.value = true
    showSave.value = (buildingAbsorptionRef.value?.showForm ?? false) && can('buildings.absorption.create', 'buildings.absorption.update')
  } else if (activeTab.value === 'ContactBuilding') {
    tabContactLoaded.value = true
    showSave.value = (buildingContactRef.value?.showForm ?? false) && can('buildings.contacts.create', 'buildings.contacts.update')
  }
}, { immediate: true })

watch(() => route.query.tab, (newTab) => {
  if (['DataBuilding', 'Availability', 'Absorption', 'ContactBuilding'].includes(newTab)) {
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
  if (activeTab.value === 'DataBuilding') {
    router.push({ name: ROUTE_NAMES.BUILDINGS })
  } else if (activeTab.value === 'Availability') {
    buildingAvailabilityRef.value?.handleReturn?.()
  } else if (activeTab.value === 'Absorption') {
    buildingAbsorptionRef.value?.handleReturn?.()
  } else if (activeTab.value === 'ContactBuilding') {
    buildingContactRef.value?.handleReturn?.()
  }
}
</script>
<template>
  <div>
    <CCard class="container-btn-flotante">
      <CCardBody class="ps-1 py-3">
        <CRow class="justify-content-center">
          <CCol xs="auto" class="btns-flotantes-customer-moviles">
            <CLoadingButton color="success" variant="outline" @click="dispatchSubmitForm" class="me-3" :loading="submittingForm" :disabled="disabledSave" v-if="showSave">
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
        <CTab itemKey="DataBuilding" @click="changeTab('DataBuilding')" v-if="can('buildings.show', 'buildings.create', 'buildings.update')">Data Building</CTab>
        <CTab itemKey="Availability" @click="changeTab('Availability')" v-if="showTab && can('buildings.availability.show', 'buildings.availability.create', 'buildings.availability.update')">Availability</CTab>
        <CTab itemKey="Absorption" @click="changeTab('Absorption')" v-if="showTab && can('buildings.absorption.show', 'buildings.absorption.create', 'buildings.absorption.update')">Absorption</CTab>
        <CTab itemKey="ContactBuilding" @click="changeTab('ContactBuilding')" v-if="showTab && can('buildings.contacts.show', 'buildings.contacts.create', 'buildings.contacts.update')">Building Contact</CTab>
      </CTabList>
      <CTabContent>
        <CTabPanel class="p-3" itemKey="DataBuilding" v-if="can('buildings.show', 'buildings.create', 'buildings.update')">
          <BuildingData v-if="tabDataLoaded" :buildingId="buildingId" ref="buildingDataRef" @submitting="(value) => { submittingForm = value; disabledSave = value }" />
        </CTabPanel>
        <CTabPanel class="p-3" itemKey="Availability" v-if="can('buildings.availability.show', 'buildings.availability.create', 'buildings.availability.update')">
          <BuildingAvailability v-if="tabAvailabilityLoaded" :buildingId="buildingId" ref="buildingAvailabilityRef" @changeShowForm="(value) => showSave = value" @submitting="(value) => { submittingForm = value; disabledSave = value }" />
        </CTabPanel>
        <CTabPanel class="p-3" itemKey="Absorption" v-if="can('buildings.absorption.show', 'buildings.absorption.create', 'buildings.absorption.update')">
          <BuildingAbsorption v-if="tabAbsorptionLoaded" :buildingId="buildingId" ref="buildingAbsorptionRef" @changeShowForm="(value) => showSave = value" @submitting="(value) => { submittingForm = value; disabledSave = value }" />
        </CTabPanel>
        <CTabPanel class="p-3" itemKey="ContactBuilding" v-if="can('buildings.contacts.show', 'buildings.contacts.create', 'buildings.contacts.update')">
          <BuildingContactsIndex v-if="tabContactLoaded" :buildingId="buildingId" ref="buildingContactRef" @changeShowForm="(value) => showSave = value" @submitting="(value) => { submittingForm = value; disabledSave = value }" />
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
