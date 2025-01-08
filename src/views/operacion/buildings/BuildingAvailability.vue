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
  {
    id: 2,
    building_state: 'Under Construction',
    size_sf: 75000,
    building_dimensions: '250x300',
    minimum_space_sf: 25000,
    expansion_up_to_sf: 100000,
    dock_doors: 12
  },
  {
    id: 3,
    building_state: 'Available',
    size_sf: 30000,
    building_dimensions: '100x300',
    minimum_space_sf: 10000,
    expansion_up_to_sf: 45000,
    dock_doors: 6
  },
  {
    id: 4,
    building_state: 'Partially Available',
    size_sf: 120000,
    building_dimensions: '300x400',
    minimum_space_sf: 40000,
    expansion_up_to_sf: 150000,
    dock_doors: 16
  },
  {
    id: 5,
    building_state: 'Available',
    size_sf: 25000,
    building_dimensions: '100x250',
    minimum_space_sf: 8000,
    expansion_up_to_sf: 35000,
    dock_doors: 4
  }
];

const fetchBuildings = async () => {
  loading.value = true;
  try {
    // Simulate API call with mock data
    // In production, replace this with actual API call:
    // const response = await axios.get('http://127.0.0.1:8000/api/buildings');
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

const handleEdit = (buildingId) => {
  router.push(`/buildings/edit/${buildingId}`);
};

const handleDelete = async (buildingId) => {
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
      await axios.delete(`http://127.0.0.1:8000/api/buildings/${buildingId}`);
      await fetchBuildings();
      Swal.fire('Deleted!', 'Building has been deleted.', 'success');
    } catch (error) {
      console.error('Error deleting building:', error);
      Swal.fire('Error!', 'Failed to delete building.', 'error');
    }
  }
};

const handleAddAvailability = () => {
  router.push('/buildings/add');
};

onMounted(() => {
  fetchBuildings();
});
</script>

<template>
  <div class="building-availability">
    <div class="mb-4 d-flex justify-content-between align-items-center">
      <h2>Building Availability</h2>
      <CButton color="primary" @click="handleAddAvailability">
        <CIcon :icon="cilPlus" class="me-2" />
        Add Availability
      </CButton>
    </div>

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
              <CTableDataCell colspan="8" class="text-center">
                Loading...
              </CTableDataCell>
            </CTableRow>
            <CTableRow v-else-if="buildings.length === 0">
              <CTableDataCell colspan="8" class="text-center">
                No buildings available
              </CTableDataCell>
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
                  <CButton 
                    color="info" 
                    size="sm" 
                    @click="handleEdit(building.id)"
                    class="me-2"
                  >
                    <CIcon :icon="cilPencil" />
                  </CButton>
                  <CButton 
                    color="danger" 
                    size="sm" 
                    @click="handleDelete(building.id)"
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
.building-availability {
  padding: 1rem;
}

.table-actions {
  white-space: nowrap;
}
</style>