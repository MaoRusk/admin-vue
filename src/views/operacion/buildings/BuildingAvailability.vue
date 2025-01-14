<script setup>
import { ref, onMounted, watch } from 'vue';
import Swal from 'sweetalert2';
import { cilPencil, cilTrash, cilPlus } from '@coreui/icons';

import BuildingAvailabilityForm from './BuildingAvailabilityForm.vue';

const props = defineProps({
  buildingId: {
    type: Number,
    required: true
  }
})
const emit = defineEmits(['submitting', 'changeShowForm'])

const buildings = ref([]);
const loading = ref(false);
const showForm = ref(false);
const selectedAvailabilityId = ref(null);

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
];

const fetchBuildings = async () => {
  loading.value = true;
  try {
    // Simulate API call with mock data
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

// Handle edit building
const handleEdit = (buildingId) => {
  selectedAvailabilityId.value = buildingId;
  showForm.value = true;
};

// Handle return from form
const handleReturn = () => {
  showForm.value = false;
  selectedAvailabilityId.value = null;
  fetchBuildings(); // Refresh the data when returning
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
      // Simulate delete operation
      buildings.value = buildings.value.filter(b => b.id !== buildingId);
      Swal.fire('Deleted!', 'Building has been deleted.', 'success');
    } catch (error) {
      console.error('Error deleting building:', error);
      Swal.fire('Error!', 'Failed to delete building.', 'error');
    }
  }
};

const handleAddAvailability = () => {
  selectedAvailabilityId.value = 0; // 0 indicates new record
  showForm.value = true;
};

onMounted(() => {
  fetchBuildings();
});

watch(showForm, (newValue) => {
  emit('changeShowForm', newValue)
})

const formAvailabilityRef = ref(null)

defineExpose({
  showForm,
  submit() {
    formAvailabilityRef.value?.submit?.()
  }
})

</script>

<template>
  <div class="p-1">
    <div v-if="!showForm">
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

    <!-- Show form when editing -->
    <div v-else>
      <BuildingAvailabilityForm 
        :buildingId="props.buildingId"
        :availabilityId="selectedAvailabilityId"
        @return="handleReturn"
        @submitting="() => emit('submitting', value)"
        ref="formAvailabilityRef"
      />
    </div>
  </div>
</template>
<style scoped>
</style>