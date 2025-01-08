<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useRouter } from 'vue-router';

const router = useRouter();
const buildings = ref([]);
const loading = ref(false);

// Fetch buildings data
const fetchBuildings = async () => {
  loading.value = true;
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/buildings');
    buildings.value = response.data.filter(building => building.builderStateId === 1); // Only available buildings
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

// Handle edit building
const handleEdit = (buildingId) => {
  router.push(`/buildings/edit/${buildingId}`);
};

// Handle delete building
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

// Handle add new availability
const handleAddAvailability = () => {
  router.push('/buildings/add');
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
              <CTableHeaderCell>Building Name</CTableHeaderCell>
              <CTableHeaderCell>Size (SF)</CTableHeaderCell>
              <CTableHeaderCell>Building Dimensions</CTableHeaderCell>
              <CTableHeaderCell>Minimum Space</CTableHeaderCell>
              <CTableHeaderCell>Building Phase</CTableHeaderCell>
              <CTableHeaderCell>Dock Doors</CTableHeaderCell>
              <CTableHeaderCell>Actions</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            <CTableRow v-if="loading">
              <CTableDataCell colspan="6" class="text-center">
                Loading...
              </CTableDataCell>
            </CTableRow>
            <CTableRow v-else-if="buildings.length === 0">
              <CTableDataCell colspan="6" class="text-center">
                No buildings available
              </CTableDataCell>
            </CTableRow>
            <CTableRow v-else v-for="building in buildings" :key="building.id">
              <CTableDataCell>{{ building.building_id }}</CTableDataCell>
              <CTableDataCell>{{ building.size_sf }}</CTableDataCell>
              <CTableDataCell>{{ building.building_dimensions }}</CTableDataCell>
              <CTableDataCell>{{ building.minimum_space_sf }}</CTableDataCell>
              <CTableDataCell>{{ building.building_phase }}</CTableDataCell>
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