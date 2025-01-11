<script setup>
import { ref, onMounted } from 'vue';
import Swal from 'sweetalert2';
import BuildingAbsorptionForm from './BuildingAbsorptionForm.vue';
import { CIcon } from '@coreui/icons-vue';
import { cilPencil, cilTrash, cilPlus } from '@coreui/icons';

const props = defineProps({
  id: Number
})
console.log(props)

const absorptions = ref([]);
const loading = ref(false);
const showForm = ref(false);
const selectedAbsorptionId = ref(null);

// Mock data for development
const mockAbsorptions = [
  {
    id: 1,
    building_id: 'BLDG-001',
    abs_tenant_id: 'TNT-001',
    abs_industry_id: 'IND-001',
    abs_lease_term_month: 60,
    abs_closing_date: '2024-03-15',
    abs_final_use: 'Warehouse',
    abs_sale_price: 1500000.00
  }
];

const fetchAbsorptions = async () => {
  loading.value = true;
  try {
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
  selectedAbsorptionId.value = absorptionId;
  showForm.value = true;
};

const handleReturn = () => {
  showForm.value = false;
  selectedAbsorptionId.value = null;
  fetchAbsorptions(); // Refresh the data when returning
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
      // Simulate delete operation
      absorptions.value = absorptions.value.filter(b => b.id !== absorptionId);
      Swal.fire('Deleted!', 'Absorption has been deleted.', 'success');
    } catch (error) {
      console.error('Error deleting absorption:', error);
      Swal.fire('Error!', 'Failed to delete absorption.', 'error');
    }
  }
};

const handleAddAbsorption = () => {
  selectedAbsorptionId.value = 0; // 0 indicates new record
  showForm.value = true;
};

onMounted(() => {
  fetchAbsorptions();
});
</script>

<template>
  Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ut odio facilis harum est distinctio ad illo, accusamus quisquam alias, enim eos impedit vel reprehenderit eius labore similique debitis, praesentium iure.
  <div class="building-absorption">
    <div v-if="!showForm">
      <!-- Header with Add button -->
      <div class="mb-4 d-flex justify-content-between align-items-center">
        <h2>Building Absorption</h2>
        <CButton color="primary" @click="handleAddAbsorption">
          <CIcon :icon="cilPlus" class="me-2" />
          Add Absorption
        </CButton>
      </div>

      <!-- Absorptions Table -->
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
                <CTableDataCell colspan="8" class="text-center">Loading...</CTableDataCell>
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

    <!-- Show form when editing -->
    <div v-else>
      <BuildingAbsorptionForm 
        :buildingId="selectedAbsorptionId"
        @return="handleReturn"
      />
    </div>
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