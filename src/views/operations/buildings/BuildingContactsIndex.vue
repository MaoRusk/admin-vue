<script setup>
import { ref, onMounted } from 'vue';
import Swal from 'sweetalert2';
import { API } from '../../../services';
import BuildingContactForm from './BuildingContactForm.vue';
import BuildingContactsTable from './BuildingContactsTable.vue';

const props = defineProps({
  buildingId: {
    type: Number,
    required: true
  }
});

const contacts = ref([]);
const selectedContact = ref({});

async function fetchContacts() {
  try {
    const { data } = await API.BuildingsContacts.getContacts(props.buildingId);
    contacts.value = data.data;
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to load contacts: ' + error.message,
    });
  }
}

const handleEdit = (contact) => {
  selectedContact.value = { ...contact };
};

const handleSave = async () => {
  await fetchContacts();
  selectedContact.value = {};
};

const handleCancel = () => {
  selectedContact.value = {};
};

const handleDelete = async (contact) => {
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
      await API.BuildingsContacts.deleteContact(props.buildingId, contact.id);
      await fetchContacts();
      Swal.fire('Deleted!', 'Contact has been deleted.', 'success');
    }
  } catch (error) {
    Swal.fire('Error!', 'Failed to delete contact.', 'error');
  }
};

onMounted(fetchContacts);
</script>

<template>
  <div class="contacts-section">
    <BuildingContactForm
      :buildingId="buildingId"
      :contact="selectedContact"
      @save="handleSave"
      @cancel="handleCancel"
    />

    <BuildingContactsTable
      :contacts="contacts"
      @edit="handleEdit"
      @delete="handleDelete"
    />
  </div>
</template>
<style scoped>
</style>