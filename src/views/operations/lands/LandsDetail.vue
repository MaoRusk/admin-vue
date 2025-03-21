<script setup>
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router'
import Swal from 'sweetalert2';
import { API } from '@/services';

import { ROUTE_NAMES } from '../../../router/routeNames';
import LandsForm from './LandsForm.vue'
import LandsAvailabilityIndex from './LandsAvailabilityIndex.vue';
import LandsAbsorptionIndex from './LandsAbsorptionIndex.vue';
import { useAuthStore } from '../../../stores/auth';
import { ContactForm, ContactsTable } from '@/components/contacts'

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

const tabLandLoaded = ref(true);
const tabAvailabilityLoaded = ref(true);
const tabAbsorptionLoaded = ref(true);

const activeItemKey = ref(route.query.tab || 'Land')
const tabs = [
  { name: 'Land', visible: can('lands.create', 'lands.show', 'lands.update')},
  { name: 'Availability', visible: showTab.value && can('lands.available.create', 'lands.available.show', 'lands.available.update')},
  { name: 'Absorption', visible: showTab.value && can('lands.absorption.create', 'lands.absorption.show', 'lands.absorption.update')},
  { name: 'Contacts', visible: showTab.value && can('lands.contacts.create', 'lands.contacts.show', 'lands.contacts.update')},
];

const contact = ref({
  name: '',
  email: '',
  phone: '',
  comments: '',
  is_land_contact: 1,
});

const contacts = ref([]);

const fetchContacts = async () => {
  try {
    const response = await API.landsContacts.getContacts(landId.value);
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

const handleSave = async (savedContact) => {
  await fetchContacts();
  contact.value = {
    name: '',
    email: '',
    phone: '',
    comments: '',
    is_land_contact: 1,
  };
};

const handleCancel = () => {
  contact.value = {
    name: '',
    email: '',
    phone: '',
    comments: '',
    is_land_contact: 1,
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
      await API.landsContacts.deleteContact(landId.value, contactToDelete.id);
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
  router.push({ name: ROUTE_NAMES.LANDS_INDEX })
}

watch(() => route.query.tab, (newTab) => {
  if (['Land', 'Availability', 'Absorption', 'Contacts'].includes(newTab)) {
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

watch(landId, async (newId) => {
  if (newId && activeItemKey.value === 'Contacts') {
    await fetchContacts();
  }
}, { immediate: true });

watch(activeItemKey, async (newTab) => {
  if (newTab === 'Land') {
    showSave.value = can('lands.create', 'lands.update')
  } else if (newTab === 'Availability') {
    showSave.value = can('lands.available.create', 'lands.available.update')
    disabledSave.value = false
  } else if (newTab === 'Absorption') {
    showSave.value = can('lands.absorption.create', 'lands.absorption.update')
    disabledSave.value = false
  } else if (newTab === 'Contacts' && landId.value) {
    await fetchContacts();
    showSave.value = can('lands.contacts.create', 'lands.contacts.update')
  }
  
  if (['Land'].includes(newTab)) {
    disabledSave.value = false
  }
}, { immediate: true })

const goToList = () => {
  router.push({ name: ROUTE_NAMES.LANDS_INDEX })
}

// Verifica en la consola del navegador si tienes los permisos necesarios
const auth = useAuthStore();
console.log(auth.can('lands.contacts.index'));
</script>
<template>
  <div>
    <CCard class="container-btn-flotante">
      <CCardBody class="ps-1 py-3">
        <CRow class="justify-content-center">
          <CCol xs="auto" class="btns-flotantes-customer-moviles">
            <CLoadingButton color="primary" variant="outline" @click="dispatchSubmitForm" class="me-3" :loading="submittingForm" :disabled="disabledSave" v-if="showSave">
              <CIcon name="cilSave" size="sm" /> Save
            </CLoadingButton>
            <CButton color="primary" variant="outline" @click="showList()">
              <CIcon name="cilArrowCircleLeft" size="sm" /> List
            </CButton>
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>
    {{ activeItemKey }}
    <div class="flex justify-between items-center">
      <div class="flex items-center gap-2">
        <CButton
          color="primary"
          variant="ghost"
          @click="goToList"
        >
          <CIcon name="cilList" size="sm" />
        </CButton>
      </div>
    </div>
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
        <CTabPanel class="p-3" itemKey="Contacts">
          <ContactForm
            :contact="contact"
            type="land"
            :parentId="landId"
            @save="handleSave"
            @cancel="handleCancel"
          />
          <ContactsTable
            :contacts="contacts"
            type="land"
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