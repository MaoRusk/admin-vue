<script setup>
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router'

import { ROUTE_NAMES } from '../../../router/routeNames';
import LandsForm from './LandsForm.vue'
import LandsAvailabilityIndex from './LandsAvailabilityIndex.vue';
import LandsAbsorptionIndex from './LandsAbsorptionIndex.vue';
import { useAuthStore } from '../../../stores/auth';

const route = useRoute()
const router = useRouter()
const { can } = useAuthStore()

const landId = computed(() => Number(route.params.landId) || null)
const showTab = computed(() => !!landId.value)

const submittingForm = ref(false)
const disabledSave = ref(false)
const showSave = ref(false)

const landRef = ref(null);
const availabilityRef = ref(null);
const absorptionRef = ref(null);

const tabLandLoaded = ref(false);
const tabAvailabilityLoaded = ref(false);
const tabAbsorptionLoaded = ref(false);

const activeItemKey = ref(route.query.tab || 'Land')
const tabs = [
  { name: 'Land', visible: can('lands.create', 'lands.show', 'lands.update')},
  { name: 'Availability', visible: showTab.value && can('lands.available.create', 'lands.available.show', 'lands.available.update')},
  { name: 'Absorption', visible: showTab.value && can('lands.absorption.create', 'lands.absorption.show', 'lands.absorption.update')},
];

function dispatchSubmitForm() {
  if (activeItemKey.value === 'Land') {
    landRef.value?.submit?.()
  } else if (activeItemKey.value === 'Availability') {
    availabilityRef.value?.submit?.()
  } else if (activeItemKey.value === 'Absorption') {
    absorptionRef.value?.submit?.()
  }
}

function showList() {
  if (activeItemKey.value === 'Land') {
    router.push({ name: ROUTE_NAMES.LANDS_INDEX })
  } else if (activeItemKey.value === 'Availability') {
    availabilityRef.value?.handleReturn?.()
  } else if (activeItemKey.value === 'Absorption') {
    absorptionRef.value?.handleReturn?.()
  }
}

watch(() => route.query.tab, (newTab) => {
  if (['Land', 'Availability', 'Absorption'].includes(newTab)) {
    activeItemKey.value = newTab
  } else {
    activeItemKey.value = 'Land'
  }
}, { immediate: true })

function changeTab(tab) {
  activeItemKey.value = tab
  router.push({
    name: route.name,
    params: route.params,
    query: { ...route.query, tab }
  })
}

watch(activeItemKey, (newTab) => {
  if (newTab === 'Land') {
    tabLandLoaded.value = true
    showSave.value = can('lands.create', 'lands.update')
  } else if (newTab === 'Availability') {
    tabAvailabilityLoaded.value = true
    showSave.value = (availabilityRef.value?.showForm ?? false) && can('lands.available.create', 'lands.available.update')
  } else if (newTab === 'Absorption') {
    tabAbsorptionLoaded.value = true
    showSave.value = (absorptionRef.value?.showForm ?? false) && can('lands.absoption.create', 'lands.absoption.update')
  }
}, { immediate: true })
</script>
<template>
  <div>
    <CCard class="container-btn-flotante">
      <CCardBody class="ps-1 py-3">
        <CRow class="justify-content-center">
          <CCol xs="auto" class="btns-flotantes-customer-moviles">
            <CLoadingButton color="success" variant="outline" @click="dispatchSubmitForm" class="me-3" :loading="submittingForm" :disabled="disabledSave" v-if="showSave">
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
    {{ activeItemKey }}
    <CTabs :activeItemKey="activeItemKey">
      <CTabList variant="tabs" class="mt-4">
        <CTab v-for="tab in tabs.filter(({ visible }) => visible)" :itemKey="tab.name" :key="tab.name" @click="changeTab(tab.name)">{{ tab.name }}</CTab>
      </CTabList>
      <CTabContent>
        <CTabPanel class="p-3" itemKey="Land">
          <LandsForm v-if="tabLandLoaded" :landId="landId" ref="landRef" @submitting="(value) => { submittingForm = value; disabledSave = value }" />
        </CTabPanel>
        <CTabPanel class="p-3" itemKey="Availability">
          <LandsAvailabilityIndex v-if="tabAvailabilityLoaded" :landId="landId" ref="availabilityRef" @submitting="(value) => { submittingForm = value; disabledSave = value }" @changeShowForm="(value) => showSave = value" />
        </CTabPanel>
        <CTabPanel class="p-3" itemKey="Absorption">
          <LandsAbsorptionIndex v-if="tabAbsorptionLoaded" :landId="landId" ref="absorptionRef" @submitting="(value) => { submittingForm = value; disabledSave = value }" @changeShowForm="(value) => showSave = value" />
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