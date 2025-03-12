<script setup>
import { ref, watch, reactive, onMounted } from 'vue';
import Swal from 'sweetalert2';
import { API } from '@/services';

const props = defineProps({
  contact: {
    type: Object,
    default: () => ({
      name: '',
      email: '',
      phone: '',
      comments: '',
      is_buildings_contact: 0,
      is_company_contact: 0,
      is_land_contact: 0,
    }),
  },
  type: {
    type: String,
    required: true,
    validator: (value) => ['building', 'company', 'land'].includes(value)
  },
  parentId: {
    type: Number,
    required: true
  }
});

const emit = defineEmits(['save', 'cancel']);
const isCollapsed = ref(true);
const contactForm = reactive({...props.contact});

const existingContacts = ref([]);
const selectedContactId = ref(null);

// Update form when contact prop changes
watch(() => props.contact, (newContact) => {
  Object.assign(contactForm, {...newContact});
}, { deep: true });

const fetchExistingContacts = async () => {
  try {
    const params = {
      page: 1,
      size: 25
    };
    
    // Add not_building_id filter if type is building
    if (props.type === 'building' && props.parentId) {
      params.not_building_id = props.parentId;
    }

    const response = await API.contacts.getContacts(params);
    if (response.data.success) {
      existingContacts.value = response.data.data;
    }
  } catch (error) {
    console.error('Error fetching contacts:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.response?.data?.message || 'Failed to fetch contacts'
    });
  }
};

const handleContactSelect = async (contactId) => {
  if (!contactId) {
    Object.assign(contactForm, {
      name: '',
      email: '',
      phone: '',
      comments: '',
      is_buildings_contact: props.type === 'building' ? 1 : 0,
      is_company_contact: props.type === 'company' ? 1 : 0,
      is_land_contact: props.type === 'land' ? 1 : 0
    });
    return;
  }

  try {
    // If selecting existing contact
    if (props.type === 'building') {
      await API.contacts.addContactToBuilding(props.parentId, contactId);
      emit('save');
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Contact added successfully'
      });
    }
  } catch (error) {
    console.error('Error adding existing contact:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.response?.data?.message || 'Failed to add contact'
    });
  }
};

const handleSubmit = async () => {
  try {
    const requestData = {
      name: contactForm.name,
      email: contactForm.email,
      phone: contactForm.phone,
      comments: contactForm.comments,
      is_buildings_contact: props.type === 'building' ? 1 : 0,
      is_company_contact: props.type === 'company' ? 1 : 0,
      is_land_contact: props.type === 'land' ? 1 : 0
    };

    let response;
    const service = {
      'building': API.BuildingsContacts,
      'company': API.contacts,
      'land': API.landsContacts
    }[props.type];
    
    if (contactForm.id) {
      response = await service.updateContact(props.parentId, contactForm.id, requestData);
    } else {
      response = await service.createContact(props.parentId, requestData);
    }

    if (response.data.success) {
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: response.data.message || 'Contact saved successfully'
      });
      
      emit('save', response.data.data);
      isCollapsed.value = true;
    } else {
      throw new Error(response.data.message || 'Failed to save contact');
    }
  } catch (error) {
    console.error('Error saving contact:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.response?.data?.message || error.message || 'An error occurred'
    });
  }
};

const handleCancel = () => {
  Object.assign(contactForm, {
    name: '',
    email: '',
    phone: '', 
    comments: '',
    is_buildings_contact: props.type === 'building' ? 1 : 0,
    is_company_contact: props.type === 'company' ? 1 : 0,
    is_land_contact: props.type === 'land' ? 1 : 0
  });
  emit('cancel');
  isCollapsed.value = true;
};

const toggleForm = () => {
  isCollapsed.value = !isCollapsed.value;
};

watch(() => props.contact.id, (newVal) => {
  isCollapsed.value = !newVal;
}, { immediate: true });

// Fetch contacts when component mounts
onMounted(() => {
  fetchExistingContacts();
});
</script>

<template>
  <CCard class="mb-4">
    <CCardHeader 
      class="d-flex justify-content-between align-items-center cursor-pointer"
      @click="toggleForm"
    >
      <div class="d-flex align-items-center">
        <CIcon 
          :icon="isCollapsed ? 'cil-plus' : 'cil-minus'"
          class="me-2"
        />
        <strong>{{ contactForm.id ? 'Edit Contact' : 'Add New Contact' }}</strong>
      </div>
      <CButton 
        v-if="contactForm.id"
        color="secondary"
        size="sm"
        variant="ghost"
        @click.stop="handleCancel"
      >
        <CIcon icon="cil-x" /> Cancel
      </CButton>
    </CCardHeader>
    
    <CCollapse :visible="!isCollapsed">
      <CCardBody>
        <!-- Add select for existing contacts -->
        <CRow class="mb-3">
          <CCol :xs="12">
            <CFormSelect
              label="Select Existing Contact"
              v-model="selectedContactId"
              @change="handleContactSelect($event.target.value)"
            >
              <option value="">Create New Contact</option>
              <option 
                v-for="contact in existingContacts" 
                :key="contact.id" 
                :value="contact.id"
              >
                {{ contact.name }}
              </option>
            </CFormSelect>
          </CCol>
        </CRow>

        <!-- Existing form -->
        <CForm @submit.prevent="handleSubmit" v-if="!selectedContactId">
          <CRow>
            <CCol :xs="12" class="mb-3">
              <CFormInput
                label="Name"
                v-model="contactForm.name"
                required
                placeholder="Enter contact name"
              />
            </CCol>
            <CCol :xs="12" class="mb-3">
              <CFormInput
                label="Email"
                type="email"
                v-model="contactForm.email"
                required
                placeholder="Enter email address"
              />
            </CCol>
            <CCol :xs="12" class="mb-3">
              <CFormInput
                label="Phone"
                v-model="contactForm.phone"
                placeholder="Enter phone number"
                type="tel"
              />
            </CCol>
            <CCol :xs="12" class="mb-3">
              <CFormTextarea
                label="Comments"
                v-model="contactForm.comments"
                placeholder="Add any additional comments"
                rows="3"
              />
            </CCol>
          </CRow>
          <div class="d-grid gap-2">
            <CButton 
              type="submit" 
              color="primary"
              size="lg"
            >
              <CIcon :icon="contactForm.id ? 'cil-save' : 'cil-plus'" class="me-2" />
              {{ contactForm.id ? 'Update Contact' : 'Add Contact' }}
            </CButton>
          </div>
        </CForm>
      </CCardBody>
    </CCollapse>
  </CCard>
</template>

<style scoped>
.card {
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.form-control {
  padding: 0.75rem;
  border-radius: 8px;
}

.form-label {
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.cursor-pointer {
  cursor: pointer;
}

.card-header {
  transition: background-color 0.2s;
}

.card-header:hover {
  background-color: #f8f9fa;
}

@media (max-width: 768px) {
  .card-body {
    padding: 1rem;
  }
  
  .btn-lg {
    padding: 0.75rem;
    font-size: 1rem;
  }
}
</style> 