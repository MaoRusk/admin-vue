<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useRouter } from 'vue-router';
import { CIcon } from '@coreui/icons-vue';
import { cilPencil, cilTrash, cilPlus } from '@coreui/icons';

const router = useRouter();
const absorptions = ref([]);
const loading = ref(false);

const mockAbsorptions = [
  {
    id: 1,
    tenant: 'Company A',
    industry: 'Manufacturing',
    lease_term: 60,
    space_absorbed: 45000,
    absorption_date: '2024-01-15'
  }
];

const fetchAbsorptions = async () => {
  loading.value = true;
  try {
    absorptions.value = mockAbsorptions;
  } finally {
    loading.value = false;
  }
};

const handleEdit = (absorptionId) => {
  router.push(`absorption/edit/${absorptionId}`);
};

const handleAddAbsorption = () => {
  router.push('absorption/add');
};

onMounted(() => {
  fetchAbsorptions();
});
</script>

<template>
  <div class="building-absorption">
    <div class="mb-4 d-flex justify-content-between align-items-center">
      <h2>Building Absorption</h2>
      <CButton color="primary" @click="handleAddAbsorption">
        <CIcon :icon="cilPlus" class="me-2" />
        Add Absorption
      </CButton>
    </div>

    <CCard>
      <CCardBody>
        <CTable hover responsive>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>ID</CTableHeaderCell>
              <CTableHeaderCell>Tenant</CTableHeaderCell>
              <CTableHeaderCell>Industry</CTableHeaderCell>
              <CTableHeaderCell>Lease Term</CTableHeaderCell>
              <CTableHeaderCell>Space Absorbed</CTableHeaderCell>
              <CTableHeaderCell>Date</CTableHeaderCell>
              <CTableHeaderCell>Actions</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            <CTableRow v-if="loading">
              <CTableDataCell colspan="7" class="text-center">Loading...</CTableDataCell>
            </CTableRow>
            <CTableRow v-else v-for="absorption in absorptions" :key="absorption.id">
              <CTableDataCell>{{ absorption.id }}</CTableDataCell>
              <CTableDataCell>{{ absorption.tenant }}</CTableDataCell>
              <CTableDataCell>{{ absorption.industry }}</CTableDataCell>
              <CTableDataCell>{{ absorption.lease_term }}</CTableDataCell>
              <CTableDataCell>{{ absorption.space_absorbed }}</CTableDataCell>
              <CTableDataCell>{{ absorption.absorption_date }}</CTableDataCell>
              <CTableDataCell>
                <CButtonGroup>
                  <CButton color="info" size="sm" @click="handleEdit(absorption.id)" class="me-2">
                    <CIcon :icon="cilPencil" />
                  </CButton>
                  <CButton color="danger" size="sm" @click="handleDelete(absorption.id)">
                    <CIcon :icon="cilTrash" />
                  </CButton>
                </CButtonGroup>
              </CTableDataCell>
            </CTableRow>
          </CTableBody>
        </CTable>
      </CCardBody>
    </CCard>
  </div>
</template>

<style scoped>
.building-absorption {
  padding: 1rem;
}
</style> 