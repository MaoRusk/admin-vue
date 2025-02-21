<script setup>
import { onMounted, computed, reactive, ref } from 'vue';
import Swal from 'sweetalert2';

import { API } from '../../../services';

const props = defineProps({
  buildingId: {
    type: Number,
    required: true
  },
  contactId: {
    type: Number,
  },
});

const emit = defineEmits(['return', 'submitting']);

const isNewRecord = computed(() => !props.contactId);

const building = ref(null)

const contactObj = {
  building_id: props.buildingId,
  name: '',
  phone: '',
  email: '',
}

const contact = reactive({...contactObj})
const formHtmlElementRef = ref(null)

const handleReturn = () => {
  for (const prop in contact) {
    contact[prop] = contactObj[prop]
  }
  emit('return');
}

async function saveContact() {
  emit('submitting', true)
  try {
    const body = {
      ...contact,
    }
    let data;
    if (isNewRecord.value) {
      ({ data } = await API.BuildingsContacts.createContact(props.buildingId, body));
    } else {
      ({ data } = await API.BuildingsContacts.updateContact(props.buildingId, props.contactId, body));
    }
    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: data.message
    });
    handleReturn();
  } catch (error) {
    console.error(error)
    Swal.fire({
      icon: 'error',
      title: error.response.data.message,
      text: JSON.stringify(error.response.data.errors)
    });
  } finally {
    emit('submitting', false)
  }
}

async function fetchContact() {
  try {
    const { data } = await API.BuildingsContacts.getContact(props.buildingId, props.contactId);
    const [ rawContact ] = data.data
    contact['name'] = `${rawContact['contact_name'] ?? ''}`
    contact['phone'] = `${rawContact['contact_phone'] ?? ''}`
    contact['email'] = `${rawContact['contact_email'] ?? ''}`
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to load building contact data: ' + error.message,
    });
  }
}

async function fetchBuildingData() {
  try {
    const { data } = await API.buildings.getBuilding(props.buildingId);
    building.value = data.data
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to load building data: ' + error.message,
    });
  }
}

onMounted(async () => {
  Swal.fire({
    title: "Loading!",
    didOpen: () => {
      Swal.showLoading();
    },
    allowOutsideClick: false,
    allowEscapeKey: false,
  })
  if (props.buildingId) {
    await fetchBuildingData();
  }
  if (!isNewRecord.value) {
    await fetchContact();
  }
  Swal.close()
});

defineExpose({
  submit() {
    if (formHtmlElementRef.value?.reportValidity()) {
      formHtmlElementRef.value?.requestSubmit()
    }
  }
})
</script>

<template>
  <form @submit.prevent="saveContact" ref="formHtmlElementRef">
    <fieldset class="row">
      <div class="col">
        <CCard>
          <CCardBody>
            <div class="row">
              <div class="col-md-6 mt-2">
                <CFormInput 
                  type="text"
                  v-model="contact.name"
                  placeholder="John Doe"
                  label="Name *"
                  required
                />
              </div>

              <div class="col-md-6 mt-2">
                <CFormInput 
                  type="tel"
                  v-model="contact.phone"
                  placeholder="5551234567"
                  label="Phone"
                />
              </div>

              <div class="col-md-6 mt-2">
                <CFormInput 
                  type="email"
                  v-model="contact.email"
                  placeholder="johndoe@mail.com"
                  label="Email *"
                  required
                />
              </div>

            </div>
          </CCardBody>
        </CCard>
      </div>
    </fieldset>
  </form>
</template>