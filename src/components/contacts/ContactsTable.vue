<script setup>
import { computed } from 'vue';

const props = defineProps({
  contacts: {
    type: Array,
    required: true,
    default: () => []
  },
  type: {
    type: String,
    required: true,
    validator: (value) => ['building', 'company', 'land'].includes(value)
  }
});

const filteredContacts = computed(() => {
  return props.contacts
    .filter(contact => contact && (
      (props.type === 'building' && contact.is_buildings_contact === 1) ||
      (props.type === 'company' && contact.is_company_contact === 1) ||
      (props.type === 'land' && contact.is_land_contact === 1)
    ))
    .sort((a, b) => a.name.localeCompare(b.name));
});

const emit = defineEmits(['edit', 'delete']);
</script>

<template>
  <CCard>
    <CCardHeader>
      <strong>Contacts List</strong>
    </CCardHeader>
    <CCardBody class="p-0">
      <!-- Mobile view: Cards -->
      <div class="d-md-none">
        <div 
          v-for="contact in filteredContacts" 
          :key="contact.id"
          class="contact-card p-3 border-bottom"
        >
          <div class="d-flex justify-content-between align-items-start mb-2">
            <h6 class="mb-0">{{ contact.name }}</h6>
            <div class="d-flex gap-2">
              <CButton
                color="primary"
                size="sm"
                variant="ghost"
                @click="$emit('edit', contact)"
              >
                <CIcon icon="cil-pencil" />
              </CButton>
              <CButton
                color="danger"
                size="sm"
                variant="ghost"
                @click="$emit('delete', contact)"
              >
                <CIcon icon="cil-trash" />
              </CButton>
            </div>
          </div>
          <div class="contact-info">
            <p class="mb-1" v-if="contact.email">
              <CIcon icon="cil-envelope-closed" class="me-2 text-muted" />
              {{ contact.email }}
            </p>
            <p class="mb-1" v-if="contact.phone">
              <CIcon icon="cil-phone" class="me-2 text-muted" />
              {{ contact.phone }}
            </p>
            <p class="mb-1" v-if="contact.comments">
              <CIcon icon="cil-comment-square" class="me-2 text-muted" />
              {{ contact.comments }}
            </p>
          </div>
        </div>
      </div>

      <!-- Desktop view: Table -->
      <div class="d-none d-md-block">
        <div class="table-responsive">
          <CTable hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Name</CTableHeaderCell>
                <CTableHeaderCell>Email</CTableHeaderCell>
                <CTableHeaderCell>Phone</CTableHeaderCell>
                <CTableHeaderCell>Comments</CTableHeaderCell>
                <CTableHeaderCell class="text-center">Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              <CTableRow v-for="contact in filteredContacts" :key="contact.id">
                <CTableDataCell>{{ contact.name }}</CTableDataCell>
                <CTableDataCell>{{ contact.email }}</CTableDataCell>
                <CTableDataCell>{{ contact.phone }}</CTableDataCell>
                <CTableDataCell>{{ contact.comments }}</CTableDataCell>
                <CTableDataCell class="text-center">
                  <div class="d-flex justify-content-center gap-2">
                    <CButton
                      color="primary"
                      variant="outline"
                      size="sm"
                      @click="$emit('edit', contact)"
                    >
                      <CIcon icon="cil-pencil" />
                    </CButton>
                    <CButton
                      color="danger"
                      variant="outline"
                      size="sm"
                      @click="$emit('delete', contact)"
                    >
                      <CIcon icon="cil-trash" />
                    </CButton>
                  </div>
                </CTableDataCell>
              </CTableRow>
              <CTableRow v-if="filteredContacts.length === 0">
                <CTableDataCell colspan="5" class="text-center">
                  No contacts found
                </CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>
        </div>
      </div>
    </CCardBody>
  </CCard>
</template>

<style scoped>
.contact-card {
  background: white;
  transition: background-color 0.2s;
}

.contact-card:hover {
  background-color: #f8f9fa;
}

.contact-info {
  font-size: 0.9rem;
}

.contact-info p {
  display: flex;
  align-items: center;
}

@media (max-width: 768px) {
  .card {
    border-radius: 12px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  .contact-card {
    border-bottom: 1px solid #dee2e6;
  }

  .contact-card:last-child {
    border-bottom: none;
  }

  .table-responsive {
    font-size: 0.875rem;
  }
  
  :deep(.table td), :deep(.table th) {
    padding: 0.5rem;
  }

  .d-flex.gap-2 {
    gap: 0.25rem !important;
  }

  .btn-sm {
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
  }
}
</style> 