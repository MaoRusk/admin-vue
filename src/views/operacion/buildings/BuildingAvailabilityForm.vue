<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import Swal from 'sweetalert2';

const route = useRoute();
const router = useRouter();
const loading = ref(false);
const isNewRecord = computed(() => route.params.id === '0');

const props = defineProps({
  buildingId: {
    type: Number,
    required: true
  }
});

const emit = defineEmits(['return']);

// Form fields
const formData = ref({
  id: null,
  building_state: '',
  size_sf: null,
  building_dimensions: '',
  minimum_space_sf: null,
  expansion_up_to_sf: null,
  dock_doors: null,
  drive_in_door: null,
  floor_thickness: null,
  floor_resistance: '',
  truck_court: null,
  has_crossdock: false,
  shared_truck: false,
  bay_size: '',
  columns_spacing: '',
  knockouts_docks: null,
  parking_space: null
});

// Building states for dropdown
const buildingStates = [
  { value: 'Available', label: 'Available' },
  { value: 'Under Construction', label: 'Under Construction' },
  { value: 'Partially Available', label: 'Partially Available' }
];

// Load building data if editing
const loadBuildingData = async () => {
  const buildingId = route.params.id;
  if (buildingId && buildingId !== '0') {
    loading.value = true;
    try {
      // En desarrollo, usa los datos mock
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
        // ... otros registros mock
      ];

      // Simula la obtención de datos
      const building = mockBuildings.find(b => b.id === parseInt(buildingId));
      if (building) {
        formData.value = { ...formData.value, ...building };
      }

      // En producción, usa esto:
      // const response = await axios.get(`http://127.0.0.1:8000/api/buildings/${buildingId}`);
      // formData.value = { ...formData.value, ...response.data };
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load building data'
      });
    } finally {
      loading.value = false;
    }
  }
};

// Save form data
const saveBuilding = async () => {
  try {
    loading.value = true;
    const buildingId = route.params.id;
    const isNew = buildingId === '0';
    const method = isNew ? 'post' : 'put';
    const url = isNew 
      ? 'http://127.0.0.1:8000/api/buildings'
      : `http://127.0.0.1:8000/api/buildings/${buildingId}`;

    // En producción, descomenta esto:
    // await axios[method](url, formData.value);
    
    // Simular el guardado en desarrollo
    console.log('Saving building:', formData.value);
    
    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: `Building successfully ${isNew ? 'created' : 'updated'}`
    });
    
    router.push(`/operacion/building/${route.params.id}/availability`);
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to save building'
    });
  } finally {
    loading.value = false;
  }
};

const handleReturn = () => {
  emit('return');
};

onMounted(() => {
  loadBuildingData();
});
</script>

<template>
  <div class="building-form p-4">
    <CCard>
      <CCardHeader class="d-flex justify-content-between align-items-center">
        <h3>{{ isNewRecord ? 'New Availability' : 'Edit Availability' }}</h3>
        <CButton 
          color="primary" 
          variant="outline" 
          @click="handleReturn"
        >
          Return
        </CButton>
      </CCardHeader>
      
      <CCardBody>
        <CForm @submit.prevent="saveBuilding">
          <div class="row">
            <!-- Basic Information -->
            <div class="col-md-6">
              <CCard class="mb-4">
                <CCardHeader>Basic Information</CCardHeader>
                <CCardBody>
                  <div class="mb-3">
                    <CFormLabel>Building State</CFormLabel>
                    <CFormSelect
                      v-model="formData.building_state"
                      :options="buildingStates"
                      required
                    />
                  </div>
                  
                  <div class="mb-3">
                    <CFormLabel>Size (SF)</CFormLabel>
                    <CFormInput
                      type="number"
                      v-model="formData.size_sf"
                      required
                    />
                  </div>
                  
                  <div class="mb-3">
                    <CFormLabel>Building Dimensions</CFormLabel>
                    <CFormInput
                      type="text"
                      v-model="formData.building_dimensions"
                      placeholder="e.g. 150x300"
                    />
                  </div>
                  
                  <div class="mb-3">
                    <CFormLabel>Minimum Space (SF)</CFormLabel>
                    <CFormInput
                      type="number"
                      v-model="formData.minimum_space_sf"
                    />
                  </div>
                  
                  <div class="mb-3">
                    <CFormLabel>Expansion Up To (SF)</CFormLabel>
                    <CFormInput
                      type="number"
                      v-model="formData.expansion_up_to_sf"
                    />
                  </div>
                </CCardBody>
              </CCard>
            </div>

            <!-- Additional Details -->
            <div class="col-md-6">
              <CCard class="mb-4">
                <CCardHeader>Additional Details</CCardHeader>
                <CCardBody>
                  <div class="mb-3">
                    <CFormLabel>Dock Doors</CFormLabel>
                    <CFormInput
                      type="number"
                      v-model="formData.dock_doors"
                    />
                  </div>
                  
                  <div class="mb-3">
                    <CFormLabel>Drive-In Doors</CFormLabel>
                    <CFormInput
                      type="number"
                      v-model="formData.drive_in_door"
                    />
                  </div>
                  
                  <div class="mb-3">
                    <CFormLabel>Floor Thickness</CFormLabel>
                    <CFormInput
                      type="number"
                      v-model="formData.floor_thickness"
                    />
                  </div>
                  
                  <div class="mb-3">
                    <CFormLabel>Floor Resistance</CFormLabel>
                    <CFormInput
                      type="text"
                      v-model="formData.floor_resistance"
                    />
                  </div>
                  
                  <div class="mb-3">
                    <CFormLabel>Truck Court</CFormLabel>
                    <CFormInput
                      type="number"
                      v-model="formData.truck_court"
                    />
                  </div>
                </CCardBody>
              </CCard>
            </div>

            <!-- Configuration -->
            <div class="col-md-12">
              <CCard class="mb-4">
                <CCardHeader>Configuration</CCardHeader>
                <CCardBody>
                  <div class="row">
                    <div class="col-md-6">
                      <div class="mb-3">
                        <CFormLabel>Bay Size</CFormLabel>
                        <CFormInput
                          type="text"
                          v-model="formData.bay_size"
                          placeholder="e.g. 50x50"
                        />
                      </div>
                      
                      <div class="mb-3">
                        <CFormLabel>Columns Spacing</CFormLabel>
                        <CFormInput
                          type="text"
                          v-model="formData.columns_spacing"
                        />
                      </div>
                    </div>
                    
                    <div class="col-md-6">
                      <div class="mb-3">
                        <CFormLabel>Knockouts Docks</CFormLabel>
                        <CFormInput
                          type="number"
                          v-model="formData.knockouts_docks"
                        />
                      </div>
                      
                      <div class="mb-3">
                        <CFormLabel>Parking Space</CFormLabel>
                        <CFormInput
                          type="number"
                          v-model="formData.parking_space"
                        />
                      </div>
                    </div>
                  </div>

                  <div class="row mt-3">
                    <div class="col-md-6">
                      <CFormCheck
                        id="crossdock"
                        v-model="formData.has_crossdock"
                        label="Has Crossdock"
                      />
                    </div>
                    <div class="col-md-6">
                      <CFormCheck
                        id="sharedTruck"
                        v-model="formData.shared_truck"
                        label="Shared Truck"
                      />
                    </div>
                  </div>
                </CCardBody>
              </CCard>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="d-flex justify-content-end gap-2">
            <CButton
              color="secondary"
              @click="handleReturn"
              :disabled="loading"
            >
              Cancel
            </CButton>
            <CButton
              color="primary"
              type="submit"
              :disabled="loading"
            >
              {{ loading ? 'Saving...' : (isNewRecord ? 'Create' : 'Update') }}
            </CButton>
          </div>
        </CForm>
      </CCardBody>

    
    </CCard>
  </div>
</template>

<style scoped>
.building-form {
  max-width: 1200px;
  margin: 0 auto;
}
</style>