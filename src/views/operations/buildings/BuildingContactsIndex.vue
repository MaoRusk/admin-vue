<script setup>
import { ref, onMounted, watch } from 'vue';
import Swal from 'sweetalert2';

import { useLocalStorage } from '../../../composables/useLocalStorage';
import { API } from '../../../services';
import { BUILDING_CONTACTS_ITEMS_PER_PAGE } from '../../../constants';
import BuildingContactForm from './BuildingContactForm.vue';

const props = defineProps({
  buildingId: {
    type: Number,
    required: true
  }
})
const emit = defineEmits(['submitting', 'changeShowForm'])

const storage = useLocalStorage()

const contacts = ref([]);

const loading = ref(false)
const itemsPerPage = ref(storage.getItem(BUILDING_CONTACTS_ITEMS_PER_PAGE) ?? 10)

const showForm = ref(false);
const selectedContactId = ref(null);

const columns = [
  { key: 'contact_name', label: 'Name' },
  { key: 'contact_phone', label: 'Phone' },
  { key: 'contact_email', label: 'Email' },
  { key: 'actions', label: 'actions', sorter: false, filter: false },
];

async function fetchContacts() {
  loading.value = true
  try {
    const { data } = await API.BuildingsContacts.getContacts(props.buildingId);
    contacts.value = data.data
    loading.value = false
  } catch (error) {
    console.error('Error fetching contacts:', error);
    contacts.value = [];
  } finally {
    loading.value = false
  }
}

// Handle edit building
const handleEdit = ({ id: contactId }) => {
  selectedContactId.value = contactId;
  showForm.value = true;
};

const handleReturn = () => {
  showForm.value = false;
  selectedContactId.value = null;
  fetchContacts(); // Refresh the data when returning
};

async function removeContact(contactId) {
  try {
    const { isConfirmed } = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    })
    if (isConfirmed) {
      const { data } = await API.BuildingsContacts.deleteContact(props.buildingId, contactId);
      Swal.fire('Deleted!', data.message, 'success')
      fetchContacts()
    }
  } catch (error) {
    console.error('Error fetching contacts:', error);
    Swal.fire('Failed!', error.message, 'error')
  }
}

const handleAddContact = () => {
  selectedContactId.value = 0; // 0 indicates new record
  showForm.value = true;
};

onMounted(() => {
  fetchContacts();
});

watch(showForm, (newValue) => {
  emit('changeShowForm', newValue)
})

const formContactRef = ref(null)

defineExpose({
  showForm,
  handleReturn,
  submit() {
    formContactRef.value?.submit?.()
  }
})
</script>

<template>
  <div class="p-1">
    <div v-if="!showForm">
      <div class="mb-4 d-flex justify-content-between align-items-center">
        <h2>Building Contacts</h2>
        <CButton color="primary" @click="handleAddContact">
          <CIcon icon="cilPlus" class="me-2" />
          Add Contact
        </CButton>
      </div>

      <CCard>
        <CCardBody>
          <CSmartTable
            :loading="loading"
            :items="contacts"
            :columns="columns"
            cleaner
            footer
            header
            :items-per-page="itemsPerPage"
            :table-props="{
              hover: true,
              striped: true,
              responsive: true,
            }"
            @items-per-page-change="(_itemsPerPage) => {
              itemsPerPage = _itemsPerPage
              storage.setItem(BUILDING_CONTACTS_ITEMS_PER_PAGE, _itemsPerPage)
            }"
            itemsPerPageSelect
            columnFilter
            columnSorter
            tableFilter
            pagination
          >
            <template #actions="{ item }">
              <td class="d-flex gap-1">
                <CButton color="primary" variant="outline" square size="sm" v-if="can('buildings.contacts.show', 'buildings.contacts.create', 'buildings.contacts.update')">
                  <CIcon name="cilPencil" size="sm" @click="handleEdit(item)" />
                </CButton>
                <CButton color="danger" variant="outline" square size="sm" @click="removeContact(item.id)" v-if="can('buildings.contacts.destroy')">
                  <CIcon name="cilTrash" size="sm" />
                </CButton>
              </td>
            </template>
          </CSmartTable>
          <div>
            Total records {{ contacts.length }}
          </div>
        </CCardBody>
      </CCard>
    </div>

    <!-- Show form when editing -->
    <div v-else>
      <BuildingContactForm 
        :buildingId="props.buildingId"
        :contactId="selectedContactId"
        @return="handleReturn"
        @submitting="(value) => emit('submitting', value)"
        ref="formContactRef"
      />
    </div>
  </div>
</template>
<style scoped>
</style>