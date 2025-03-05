<script setup>
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router'
import Swal from 'sweetalert2';
import { API } from '@/services';

import BuildingData from './BuildingData.vue'
import BuildingAvailability from './BuildingAvailability.vue'
import BuildingImages from './BuildingsImages.vue';
import BuildingAbsorption from './BuildingAbsorption.vue'
import { ROUTE_NAMES } from '../../../router/routeNames';
import { ContactForm, ContactsTable } from '@/components/contacts'

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
const tabAbsorptionLoaded = ref(false);
const tabImagesLoaded = ref(false);

// Add contact state
const contact = ref({
  contact_name: '',
  contact_email: '',
  contact_phone: '',
  contact_comments: '',
  is_buildings_contact: 1,
});

const contacts = ref([]);

// Add contact handlers
const handleSave = async (savedContact) => {
  await fetchContacts();
  contact.value = {
    contact_name: '',
    contact_email: '',
    contact_phone: '',
    contact_comments: '',
    is_buildings_contact: 1,
  };
};

const handleCancel = () => {
  contact.value = {
    contact_name: '',
    contact_email: '',
    contact_phone: '',
    contact_comments: '',
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
    const { data } = await API.BuildingsContacts.getContacts(buildingId.value);
    contacts.value = data.data;
  } catch (error) {
    console.error('Error fetching contacts:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to load contacts: ' + error.message,
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
  } else if (activeTab.value === 'Files') {
    buildingImagesRef.value?.submit?.()
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
    disabledSave.value = !(buildingContactRef.value?.showForm ?? false)
  }
  if (['DataBuilding', 'Files'].includes(activeTab.value)) {
    disabledSave.value = false
  }
}, { immediate: true })

watch(() => route.query.tab, (newTab) => {
  if (['DataBuilding', 'Availability', 'Absorption', 'ContactBuilding'].includes(newTab)) {
    activeTab.value = newTab
  } else {
    activeTab.value = 'DataBuilding'
  }
}, { immediate: true })

// Load contacts when tab becomes active
watch(activeTab, async (newTab) => {
  if (newTab === 'ContactBuilding') {
    await fetchContacts();
  }
});

function changeTab(tab) {
  activeTab.value = tab
  router.push({
    name: route.name,
    params: route.params,
    query: { ...route.query, tab }
  })
}

function showList() {
  if (['DataBuilding', 'Files'].includes(activeTab.value)) {
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
