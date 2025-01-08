<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useRouter } from 'vue-router';
import { CIcon } from '@coreui/icons-vue';
import { cilPencil, cilTrash, cilPlus } from '@coreui/icons';

const router = useRouter();
const buildings = ref([]);
const loading = ref(false);

// Mock data for development
const mockBuildings = [
  {
    id: 1,
    building_state: 'Available',
    size_sf: 45000,
    building_dimensions: '150x300',
    minimum_space_sf: 15000,
    expansion_up_to_sf: 60000,
    dock_doors: 8
  },
  // ... rest of mock data
];

const fetchBuildings = async () => {
  loading.value = true;
  try {
    buildings.value = mockBuildings;
  } catch (error) {
    console.error('Error fetching buildings:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to load buildings data'
    });
  } finally {
    loading.value = false;
  }
};

const handleEdit = (availabilityId) => {
  router.push(`availability/edit/${availabilityId}`);
};

const handleAddAvailability = () => {
  router.push('availability/add');
};

onMounted(() => {
  fetchBuildings();
});
</script>

<template>
  <div class="building-availability">
    <!-- Header with Add button -->
    <div class="mb-4 d-flex justify-content-between align-items-center">
      <h2>Building Availability</h2>
      <CButton color="primary" @click="handleAddAvailability">
        <CIcon :icon="cilPlus" class="me-2" />
        Add Availability
      </CButton>
    </div>

    <!-- Buildings Table -->
    <CCard>
      <CCardBody>
        <CTable hover responsive>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>ID</CTableHeaderCell>
              <CTableHeaderCell>Building State</CTableHeaderCell>
              <CTableHeaderCell>Size (SF)</CTableHeaderCell>
              <CTableHeaderCell>Building Dimensions</CTableHeaderCell>
              <CTableHeaderCell>Min. Space</CTableHeaderCell>
              <CTableHeaderCell>Expansion Up To</CTableHeaderCell>
              <CTableHeaderCell>Dock Doors</CTableHeaderCell>
              <CTableHeaderCell>Actions</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            <CTableRow v-if="loading">
              <CTableDataCell colspan="8" class="text-center">Loading...</CTableDataCell>
            </CTableRow>
            <CTableRow v-else v-for="building in buildings" :key="building.id">
              <CTableDataCell>{{ building.id }}</CTableDataCell>
              <CTableDataCell>{{ building.building_state }}</CTableDataCell>
              <CTableDataCell>{{ building.size_sf }}</CTableDataCell>
              <CTableDataCell>{{ building.building_dimensions }}</CTableDataCell>
              <CTableDataCell>{{ building.minimum_space_sf }}</CTableDataCell>
              <CTableDataCell>{{ building.expansion_up_to_sf }}</CTableDataCell>
              <CTableDataCell>{{ building.dock_doors }}</CTableDataCell>
              <CTableDataCell>
                <CButtonGroup>
                  <CButton color="info" size="sm" @click="handleEdit(building.id)" class="me-2">
                    <CIcon :icon="cilPencil" />
                  </CButton>
                  <CButton color="danger" size="sm" @click="handleDelete(building.id)">
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
.building-availability {
  padding: 1rem;
}
</style> 