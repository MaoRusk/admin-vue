<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import Swal from 'sweetalert2';

const route = useRoute();
const router = useRouter();
const loading = ref(false);
const isNewRecord = computed(() => route.params.id === '0');
const brokers = ref([]);

const props = defineProps({
  buildingId: {
    type: Number,
    required: true
  }
});

const emit = defineEmits(['return']);

// Form fields
const formData = ref({
  broker_id: null,
  building_state: '',
  avl_size_sf: null,
  avl_building_dimensions: '',
  avl_building_phase: '',
  avl_minimum_space_sf: null,
  avl_expansion_up_to_sf: null,
  dock_doors: null,
  drive_in_door: null,
  floor_thickness: null,
  floor_resistance: '',
  truck_court: null,
  has_crossdock: false,
  shared_truck: false,
  new_construction: false,
  is_starting_construction: false,
  bay_size: '',
  columns_spacing: '',
  avl_date: '',
  knockouts_docks: null,
  parking_space: null,
  avl_min_lease: null,
  avl_max_lease: null
});

// Options for dropdowns
const buildingStates = [
  { value: 'Available', label: 'Available' },
  { value: 'Under Construction', label: 'Under Construction' },
  { value: 'Partially Available', label: 'Partially Available' }
];

const buildingPhases = [
  { value: 'Phase 1', label: 'Phase 1' },
  { value: 'Phase 2', label: 'Phase 2' },
  { value: 'Phase 3', label: 'Phase 3' }
];

const handleReturn = () => {
  emit('return');
};

const saveBuilding = async () => {
  try {
    loading.value = true;
    console.log('Saving building:', formData.value);
    
    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: `Building successfully ${isNewRecord.value ? 'created' : 'updated'}`
    });
    
    handleReturn();
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

// Fetch brokers for dropdown
const fetchBrokers = async () => {
  try {
    // Simulated broker data
    brokers.value = [
      { value: 1, label: 'Broker 1' },
      { value: 2, label: 'Broker 2' },
      { value: 3, label: 'Broker 3' }
    ];
  } catch (error) {
    console.error('Error fetching brokers:', error);
  }
};

onMounted(() => {
  fetchBrokers();
});
</script>

<template>
  <div class="building-form p-4">
    <CCard>
      <CCardHeader class="d-flex justify-content-between align-items-center">
        <h3>{{ isNewRecord ? 'New Availability' : 'Edit Availability' }}</h3>
        <CButton color="primary" variant="outline" @click="handleReturn">
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
                    <CFormLabel>Broker</CFormLabel>
                    <CMultiSelect
                      v-model="formData.broker_id"
                      :options="brokers"
                      :multiple="false"
                      required
                    />
                  </div>

                  <div class="mb-3">
                    <CFormLabel>Building State</CFormLabel>
                    <CMultiSelect
                      v-model="formData.building_state"
                      :options="buildingStates"
                      :multiple="false"
                      required
                    />
                  </div>

                  <div class="mb-3">
                    <CFormLabel>Building Phase</CFormLabel>
                    <CMultiSelect
                      v-model="formData.avl_building_phase"
                      :options="buildingPhases"
                      :multiple="false"
                      required
                    />
                  </div>

                  <div class="mb-3">
                    <CFormLabel>Size (SF)</CFormLabel>
                    <CFormInput
                      type="number"
                      v-model="formData.avl_size_sf"
                      required
                    />
                  </div>

                  <div class="mb-3">
                    <CFormLabel>Building Dimensions</CFormLabel>
                    <CFormInput
                      type="text"
                      v-model="formData.avl_building_dimensions"
                    />
                  </div>

                  <div class="mb-3">
                    <CFormLabel>Minimum Space (SF)</CFormLabel>
                    <CFormInput
                      type="number"
                      v-model="formData.avl_minimum_space_sf"
                    />
                  </div>

                  <div class="mb-3">
                    <CFormLabel>Expansion Up To (SF)</CFormLabel>
                    <CFormInput
                      type="number"
                      v-model="formData.avl_expansion_up_to_sf"
                    />
                  </div>
                </CCardBody>
              </CCard>
            </div>

            <!-- Technical Details -->
            <div class="col-md-6">
              <CCard class="mb-4">
                <CCardHeader>Technical Details</CCardHeader>
                <CCardBody>
                  <div class="mb-3">
                    <CFormLabel>Dock Doors</CFormLabel>
                    <CFormInput
                      type="number"
                      v-model="formData.dock_doors"
                    />
                  </div>

                  <div class="mb-3">
                    <CFormLabel>Drive-in Door</CFormLabel>
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

                  <div class="mb-3">
                    <CFormLabel>Bay Size</CFormLabel>
                    <CFormInput
                      type="text"
                      v-model="formData.bay_size"
                    />
                  </div>

                  <div class="mb-3">
                    <CFormLabel>Columns Spacing</CFormLabel>
                    <CFormInput
                      type="text"
                      v-model="formData.columns_spacing"
                    />
                  </div>
                </CCardBody>
              </CCard>
            </div>
          </div>

          <!-- Additional Information -->
          <CCard class="mb-4">
            <CCardHeader>Additional Information</CCardHeader>
            <CCardBody>
              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <CFormLabel>Availability Date</CFormLabel>
                    <CDatePicker
                      v-model="formData.avl_date"
                      selectionType="year"
                    />
                  </div>

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

                <div class="col-md-6">
                  <div class="mb-3">
                    <CFormLabel>Minimum Lease</CFormLabel>
                    <CFormInput
                      type="number"
                      v-model="formData.avl_min_lease"
                      step="0.01"
                    />
                  </div>

                  <div class="mb-3">
                    <CFormLabel>Maximum Lease</CFormLabel>
                    <CFormInput
                      type="number"
                      v-model="formData.avl_max_lease"
                      step="0.01"
                    />
                  </div>
                </div>
              </div>

              <!-- Switches -->
              <div class="row mt-3">
                <div class="col-md-3">
                  <CFormSwitch
                    v-model="formData.has_crossdock"
                    label="Has Crossdock"
                  />
                </div>
                <div class="col-md-3">
                  <CFormSwitch
                    v-model="formData.shared_truck"
                    label="Shared Truck"
                  />
                </div>
                <div class="col-md-3">
                  <CFormSwitch
                    v-model="formData.new_construction"
                    label="New Construction"
                  />
                </div>
                <div class="col-md-3">
                  <CFormSwitch
                    v-model="formData.is_starting_construction"
                    label="Starting Construction"
                  />
                </div>
              </div>
            </CCardBody>
          </CCard>

          <!-- Form Actions -->
          <div class="d-flex justify-content-end gap-2">
            <CButton color="secondary" @click="handleReturn" :disabled="loading">
              Cancel
            </CButton>
            <CButton color="primary" type="submit" :disabled="loading">
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