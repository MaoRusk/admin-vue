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
  data() {
    return {
      isCollapsed: true, // Por defecto el formulario estará colapsado
    };
  },
  watch: {
    'contact.id': {
      handler(newVal) {
        // Si estamos editando un contacto, expandimos el formulario
        this.isCollapsed = !newVal;
      },
      immediate: true
    }
  },
  emits: ['save', 'cancel'],
  methods: {
    handleSubmit() {
      this.$emit('save', this.contact);
      this.isCollapsed = true; // Colapsamos después de guardar
    },
    handleCancel() {
      this.$emit('cancel');
      this.isCollapsed = true; // Colapsamos después de cancelar
    },
    toggleForm() {
      this.isCollapsed = !this.isCollapsed;
    },
  },
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
        <strong>{{ contact.id ? 'Edit Contact' : 'Add New Contact' }}</strong>
      </div>
      <CButton 
        v-if="contact.id"
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