<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import Swal from 'sweetalert2';

const route = useRoute();
const router = useRouter();
const loading = ref(false);
const isNewRecord = computed(() => route.params.id === '0');

// Referencias para los dropdowns
const tenants = ref([]);
const industries = ref([]);
const shelters = ref([]);
const countries = ref([]);
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
  abs_tenant_id: null,
  abs_industry_id: null,
  abs_shelter_id: null,
  abs_country_id: null,
  broker_id: null,
  building_state: '',
  abs_building_phase: '',
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
  abs_lease_term_month: null,
  knockouts_docks: null,
  parking_space: null,
  abs_asking_rate_shell: null,
  abs_closing_rate: null,
  abs_closing_date: false,
  abs_lease_up: false,
  abs_month: false,
  abs_final_use: '',
  abs_company_type: '',
  abs_sale_price: null
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

const finalUses = [
  { value: 'Manufacturing', label: 'Manufacturing' },
  { value: 'Distribution', label: 'Distribution' },
  { value: 'Warehouse', label: 'Warehouse' }
];

const companyTypes = [
  { value: 'Type 1', label: 'Type 1' },
  { value: 'Type 2', label: 'Type 2' },
  { value: 'Type 3', label: 'Type 3' }
];

const handleReturn = () => {
  emit('return');
};

const saveAbsorption = async () => {
  try {
    loading.value = true;
    console.log('Saving absorption:', formData.value);
    
    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: `Absorption successfully ${isNewRecord.value ? 'created' : 'updated'}`
    });
    
    handleReturn();
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to save absorption'
    });
  } finally {
    loading.value = false;
  }
};

// Fetch dropdown data
const fetchDropdownData = async () => {
  try {
    // Simulated data for dropdowns
    tenants.value = [{ value: 1, label: 'Tenant 1' }];
    industries.value = [{ value: 1, label: 'Industry 1' }];
    shelters.value = [{ value: 1, label: 'Shelter 1' }];
    countries.value = [{ value: 1, label: 'Country 1' }];
    brokers.value = [{ value: 1, label: 'Broker 1' }];
  } catch (error) {
    console.error('Error fetching dropdown data:', error);
  }
};

onMounted(() => {
  fetchDropdownData();
});
</script>

<template>
  <div class="absorption-form p-4">
    <CCard>
      <CCardHeader class="d-flex justify-content-between align-items-center">
        <h3>{{ isNewRecord ? 'New Absorption' : 'Edit Absorption' }}</h3>
        <CButton color="primary" variant="outline" @click="handleReturn">
          Return
        </CButton>
      </CCardHeader>
      
      <CCardBody>
        <CForm @submit.prevent="saveAbsorption">
          <div class="row">
            <!-- Basic Information -->
            <div class="col-md-6">
              <CCard class="mb-4">
                <CCardHeader>Basic Information</CCardHeader>
                <CCardBody>
                  <div class="mb-3">
                    <CFormLabel>Tenant</CFormLabel>
                    <CMultiSelect
                      v-model="formData.abs_tenant_id"
                      :options="tenants"
                      :multiple="false"
                      required
                    />
                  </div>

                  <div class="mb-3">
                    <CFormLabel>Industry</CFormLabel>
                    <CMultiSelect
                      v-model="formData.abs_industry_id"
                      :options="industries"
                      :multiple="false"
                      required
                    />
                  </div>

                  <div class="mb-3">
                    <CFormLabel>Shelter</CFormLabel>
                    <CMultiSelect
                      v-model="formData.abs_shelter_id"
                      :options="shelters"
                      :multiple="false"
                    />
                  </div>

                  <div class="mb-3">
                    <CFormLabel>Country</CFormLabel>
                    <CMultiSelect
                      v-model="formData.abs_country_id"
                      :options="countries"
                      :multiple="false"
                    />
                  </div>

                  <div class="mb-3">
                    <CFormLabel>Broker</CFormLabel>
                    <CMultiSelect
                      v-model="formData.broker_id"
                      :options="brokers"
                      :multiple="false"
                    />
                  </div>

                  <div class="mb-3">
                    <CFormLabel>Building State</CFormLabel>
                    <CMultiSelect
                      v-model="formData.building_state"
                      :options="buildingStates"
                      :multiple="false"
                    />
                  </div>

                  <div class="mb-3">
                    <CFormLabel>Building Phase</CFormLabel>
                    <CMultiSelect
                      v-model="formData.abs_building_phase"
                      :options="buildingPhases"
                      :multiple="false"
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
                    <CFormInput type="number" v-model="formData.dock_doors" />
                  </div>

                  <div class="mb-3">
                    <CFormLabel>Drive-in Door</CFormLabel>
                    <CFormInput type="number" v-model="formData.drive_in_door" />
                  </div>

                  <div class="mb-3">
                    <CFormLabel>Floor Thickness</CFormLabel>
                    <CFormInput type="number" v-model="formData.floor_thickness" />
                  </div>

                  <div class="mb-3">
                    <CFormLabel>Floor Resistance</CFormLabel>
                    <CFormInput type="text" v-model="formData.floor_resistance" />
                  </div>

                  <div class="mb-3">
                    <CFormLabel>Truck Court</CFormLabel>
                    <CFormInput type="number" v-model="formData.truck_court" />
                  </div>

                  <div class="mb-3">
                    <CFormLabel>Bay Size</CFormLabel>
                    <CFormInput type="text" v-model="formData.bay_size" />
                  </div>

                  <div class="mb-3">
                    <CFormLabel>Columns Spacing</CFormLabel>
                    <CFormInput type="text" v-model="formData.columns_spacing" />
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
                    <CFormLabel>Lease Term (months)</CFormLabel>
                    <CFormInput type="number" v-model="formData.abs_lease_term_month" />
                  </div>

                  <div class="mb-3">
                    <CFormLabel>Knockouts Docks</CFormLabel>
                    <CFormInput type="number" v-model="formData.knockouts_docks" />
                  </div>

                  <div class="mb-3">
                    <CFormLabel>Parking Space</CFormLabel>
                    <CFormInput type="number" v-model="formData.parking_space" />
                  </div>

                  <div class="mb-3">
                    <CFormLabel>Asking Rate Shell</CFormLabel>
                    <CFormInput 
                      type="number" 
                      v-model="formData.abs_asking_rate_shell"
                      step="0.01" 
                    />
                  </div>

                  <div class="mb-3">
                    <CFormLabel>Closing Rate</CFormLabel>
                    <CFormInput 
                      type="number" 
                      v-model="formData.abs_closing_rate"
                      step="0.01" 
                    />
                  </div>
                </div>

                <div class="col-md-6">
                  <div class="mb-3">
                    <CFormLabel>Final Use</CFormLabel>
                    <CMultiSelect
                      v-model="formData.abs_final_use"
                      :options="finalUses"
                      :multiple="false"
                    />
                  </div>

                  <div class="mb-3">
                    <CFormLabel>Company Type</CFormLabel>
                    <CMultiSelect
                      v-model="formData.abs_company_type"
                      :options="companyTypes"
                      :multiple="false"
                    />
                  </div>

                  <div class="mb-3">
                    <CFormLabel>Sale Price</CFormLabel>
                    <CFormInput 
                      type="number" 
                      v-model="formData.abs_sale_price"
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

              <div class="row mt-3">
                <div class="col-md-4">
                  <CFormSwitch
                    v-model="formData.abs_closing_date"
                    label="Closing Date"
                  />
                </div>
                <div class="col-md-4">
                  <CFormSwitch
                    v-model="formData.abs_lease_up"
                    label="Lease Up"
                  />
                </div>
                <div class="col-md-4">
                  <CFormSwitch
                    v-model="formData.abs_month"
                    label="Month"
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
.absorption-form {
  max-width: 1200px;
  margin: 0 auto;
}
</style>