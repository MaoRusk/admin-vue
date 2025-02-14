<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ContactsTable',
  props: {
    contacts: {
      type: Array,
      default: () => [],
    },
  },
  emits: ['edit', 'delete'],
});
</script>

<template>
  <CCard>
    <CCardHeader>
      <strong>Contacts List</strong>
    </CCardHeader>
    <CCardBody class="p-0">
      <!-- Vista móvil: Cards -->
      <div class="d-md-none">
        <div 
          v-for="contact in contacts" 
          :key="contact.id"
          class="contact-card p-3 border-bottom"
        >
          <div class="d-flex justify-content-between align-items-start mb-2">
            <h6 class="mb-0">{{ contact.contact_name }}</h6>
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
                @click="$emit('delete', contact.id)"
              >
                <CIcon icon="cil-trash" />
              </CButton>
            </div>
          </div>
          <div class="contact-info">
            <p class="mb-1">
              <CIcon icon="cil-envelope-closed" class="me-2 text-muted" />
              {{ contact.contact_email }}
            </p>
            <p class="mb-1">
              <CIcon icon="cil-phone" class="me-2 text-muted" />
              {{ contact.contact_phone }}
            </p>
            <p class="mb-0 text-muted" v-if="contact.contact_comments">
              <CIcon icon="cil-comment-square" class="me-2" />
              {{ contact.contact_comments }}
            </p>
          </div>
        </div>
      </div>

      <!-- Vista desktop: Tabla -->
      <div class="d-none d-md-block">
        <CTable hover responsive>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>Name</CTableHeaderCell>
              <CTableHeaderCell>Email</CTableHeaderCell>
              <CTableHeaderCell>Phone</CTableHeaderCell>
              <CTableHeaderCell>Comments</CTableHeaderCell>
              <CTableHeaderCell class="text-end">Actions</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            <CTableRow v-for="contact in contacts" :key="contact.id">
              <CTableDataCell>{{ contact.contact_name }}</CTableDataCell>
              <CTableDataCell>{{ contact.contact_email }}</CTableDataCell>
              <CTableDataCell>{{ contact.contact_phone }}</CTableDataCell>
              <CTableDataCell>{{ contact.contact_comments }}</CTableDataCell>
              <CTableDataCell class="text-end">
                <div class="d-flex gap-2 justify-content-end">
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
                    @click="$emit('delete', contact.id)"
                  >
                    <CIcon icon="cil-trash" />
                  </CButton>
                </div>
              </CTableDataCell>
            </CTableRow>
          </CTableBody>
        </CTable>
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
}
</style> 