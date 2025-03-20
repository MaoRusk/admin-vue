<script setup>
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router'
import Swal from 'sweetalert2';
import { API } from '@/services';

import BuildingData from './BuildingData.vue'
import BuildingAvailability from './BuildingAvailability.vue'
import BuildingAbsorption from './BuildingAbsorption.vue'
import { ROUTE_NAMES } from '../../../router/routeNames';
import { useAuthStore } from '../../../stores/auth';
import { ContactForm, ContactsTable } from '@/components/contacts'

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

// Add contact state
const contact = ref({
  name: '',
  email: '',
  phone: '',
  comments: '',
  is_buildings_contact: 1,
});

const contacts = ref([]);

// Add contact handlers
const handleSave = async () => {
  await fetchContacts();
  contact.value = {
    name: '',
    email: '',
    phone: '',
    comments: '',
    is_buildings_contact: 1,
  };
};

const handleCancel = () => {
  contact.value = {
    name: '',
    email: '',
    phone: '',
    comments: '',
    is_buildings_contact: 1,
  };
};

const handleEdit = (contactToEdit) => {
  contact.value = { ...contactToEdit };
};

const handleDelete = async (contactToDelete) => {
  try {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      await API.BuildingsContacts.deleteContact(buildingId.value, contactToDelete.id);
      await fetchContacts();
      
      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: 'Contact has been deleted.',
        toast: true,
        position: 'bottom',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true
      });
    }
  } catch (error) {
    console.error('Error deleting contact:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error!',
      text: error.response?.data?.message || 'Error deleting contact',
      toast: true,
      position: 'bottom',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true
    });
  }
};

const fetchContacts = async () => {
  try {
    const response = await API.BuildingsContacts.getContacts(buildingId.value);
    if (response.data.success) {
      contacts.value = response.data.data;
    }
  } catch (error) {
    console.error('Error loading contacts:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error!',
      text: error.response?.data?.message || 'Error loading contacts',
      toast: true,
      position: 'bottom',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true
    });
  }
};

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

watch(buildingId, async (newId) => {
  if (newId && activeTab.value === 'ContactBuilding') {
    await fetchContacts();
  }
}, { immediate: true });

watch(activeTab, async (newTab) => {
  if (newTab === 'DataBuilding') {
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
}, { immediate: true });

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
    <!-- {{ activeTab }} -->
    <CTabs :activeItemKey="activeTab">
      <CTabList variant="tabs" class="mt-4">
        <CTab itemKey="DataBuilding" @click="changeTab('DataBuilding')" v-if="can('buildings.show', 'buildings.create', 'buildings.update')">Building Data</CTab>
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
        <CTabPanel class="p-3" itemKey="ContactBuilding">
          <ContactForm
            :contact="contact"
            type="building"
            :parentId="buildingId"
            @save="handleSave"
            @cancel="handleCancel"
          />
          <ContactsTable
            :contacts="contacts"
            type="building"
            @edit="handleEdit"
            @delete="handleDelete"
          />
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
