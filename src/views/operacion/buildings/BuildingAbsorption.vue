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

// Mock data for development
const mockAbsorptions = [
  {
    id: 1,
    building_id: 'BLDG-001',
    abs_tenant_id: 'TNT-001',
    abs_industry_id: 'IND-001',
    abs_shelter_id: 'SH-001',
    abs_country_id: 'USA',
    broker_id: 'BRK-001',
    building_state: 'Leased',
    dock_doors: 4,
    drive_in_door: 2,
    floor_thickness: 6,
    floor_resistance: '5000 PSF',
    truck_court: 120,
    has_crossdock: true,
    shared_truck: false,
    new_construction: true,
    is_starting_construction: false,
    bay_size: '50x50',
    columns_spacing: '40x40',
    knockouts_docks: 2,
    parking_space: 50,
    abs_lease_term_month: 60,
    abs_closing_date: '2024-03-15',
    abs_lease_up: '2024-06-15',
    abs_month: '2024-03',
    abs_final_use: 'Warehouse',
    abs_company_type: 'Logistics',
    abs_sale_price: 1500000.00
  },
  // Más datos mock aquí...
];

const fetchAbsorptions = async () => {
  loading.value = true;
  try {
    // Simulate API call with mock data
    // En producción, usar:
    // const response = await axios.get('http://127.0.0.1:8000/api/absorptions');
    absorptions.value = mockAbsorptions;
  } catch (error) {
    console.error('Error fetching absorptions:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to load absorption data'
    });
  } finally {
    loading.value = false;
  }
};

const handleEdit = (absorptionId) => {
  router.push({
    path: `/buildings/edit/${absorptionId}`,
    query: { tab: 'Absorption' }
  });
};

const handleDelete = async (absorptionId) => {
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
    try {
      await axios.delete(`http://127.0.0.1:8000/api/absorptions/${absorptionId}`);
      await fetchAbsorptions();
      Swal.fire('Deleted!', 'Absorption record has been deleted.', 'success');
    } catch (error) {
      console.error('Error deleting absorption:', error);
      Swal.fire('Error!', 'Failed to delete absorption record.', 'error');
    }
  }
};

const handleAddAbsorption = () => {
  router.push({
    path: '/buildings/add',
    query: { tab: 'Absorption' }
  });
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
              <CTableHeaderCell>Building ID</CTableHeaderCell>
              <CTableHeaderCell>Tenant</CTableHeaderCell>
              <CTableHeaderCell>Industry</CTableHeaderCell>
              <CTableHeaderCell>Lease Term</CTableHeaderCell>
              <CTableHeaderCell>Closing Date</CTableHeaderCell>
              <CTableHeaderCell>Final Use</CTableHeaderCell>
              <CTableHeaderCell>Sale Price</CTableHeaderCell>
              <CTableHeaderCell>Actions</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            <CTableRow v-if="loading">
              <CTableDataCell colspan="8" class="text-center">
                Loading...
              </CTableDataCell>
            </CTableRow>
            <CTableRow v-else-if="absorptions.length === 0">
              <CTableDataCell colspan="8" class="text-center">
                No absorption records available
              </CTableDataCell>
            </CTableRow>
            <CTableRow v-else v-for="absorption in absorptions" :key="absorption.id">
              <CTableDataCell>{{ absorption.building_id }}</CTableDataCell>
              <CTableDataCell>{{ absorption.abs_tenant_id }}</CTableDataCell>
              <CTableDataCell>{{ absorption.abs_industry_id }}</CTableDataCell>
              <CTableDataCell>{{ absorption.abs_lease_term_month }} months</CTableDataCell>
              <CTableDataCell>{{ new Date(absorption.abs_closing_date).toLocaleDateString() }}</CTableDataCell>
              <CTableDataCell>{{ absorption.abs_final_use }}</CTableDataCell>
              <CTableDataCell>${{ absorption.abs_sale_price.toLocaleString() }}</CTableDataCell>
              <CTableDataCell>
                <CButtonGroup>
                  <CButton 
                    color="info" 
                    size="sm" 
                    @click="handleEdit(absorption.id)"
                    class="me-2"
                  >
                    <CIcon :icon="cilPencil" />
                  </CButton>
                  <CButton 
                    color="danger" 
                    size="sm" 
                    @click="handleDelete(absorption.id)"
                  >
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

.table-actions {
  white-space: nowrap;
}
</style>