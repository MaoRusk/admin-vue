<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ContactForm',
  props: {
    contact: {
      type: Object,
      default: () => ({
        contact_name: '',
        contact_email: '',
        contact_phone: '',
        contact_comments: '',
        is_company_contact: 1,
      }),
    },
  },
  emits: ['save', 'cancel'],
  methods: {
    handleSubmit() {
      this.$emit('save', this.contact);
    },
    handleCancel() {
      this.$emit('cancel');
    },
  },
});
</script>

<template>
  <CCard class="mb-4">
    <CCardHeader class="d-flex justify-content-between align-items-center">
      <strong>{{ contact.id ? 'Edit Contact' : 'Add New Contact' }}</strong>
      <CButton 
        v-if="contact.id"
        color="secondary"
        size="sm"
        variant="ghost"
        @click="handleCancel"
      >
        <CIcon icon="cil-x" /> Cancel
      </CButton>
    </CCardHeader>
    <CCardBody>
      <CForm @submit.prevent="handleSubmit">
        <CRow>
          <CCol :xs="12" class="mb-3">
            <CFormInput
              label="Name"
              v-model="contact.contact_name"
              required
              placeholder="Enter contact name"
            />
          </CCol>
          <CCol :xs="12" class="mb-3">
            <CFormInput
              label="Email"
              type="email"
              v-model="contact.contact_email"
              required
              placeholder="Enter email address"
            />
          </CCol>
          <CCol :xs="12" class="mb-3">
            <CFormInput
              label="Phone"
              v-model="contact.contact_phone"
              placeholder="Enter phone number"
              type="tel"
            />
          </CCol>
          <CCol :xs="12" class="mb-3">
            <CFormTextarea
              label="Comments"
              v-model="contact.contact_comments"
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
            <CIcon :icon="contact.id ? 'cil-save' : 'cil-plus'" class="me-2" />
            {{ contact.id ? 'Update Contact' : 'Add Contact' }}
          </CButton>
        </div>
      </CForm>
    </CCardBody>
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