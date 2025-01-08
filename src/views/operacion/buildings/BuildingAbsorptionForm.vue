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
  building_id: null,
  abs_tenant_id: null,
  abs_industry_id: null,
  abs_shelter_id: null,
  abs_country_id: null,
  broker_id: null,
  building_state: '',
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
  knockouts_docks: null,
  parking_space: null,
  abs_lease_term_month: null,
  abs_closing_date: null,
  abs_lease_up: null,
  abs_month: null,
  abs_final_use: '',
  abs_company_type: '',
  abs_sale_price: null
});

// Dropdowns options
const finalUseOptions = [
  { value: 'Manufacturing', label: 'Manufacturing' },
  { value: 'Distribution', label: 'Distribution' },
  { value: 'Warehouse', label: 'Warehouse' },
  { value: 'Logistics', label: 'Logistics' }
];

const companyTypeOptions = [
  { value: 'Local', label: 'Local' },
  { value: 'National', label: 'National' },
  { value: 'International', label: 'International' }
];

// Load absorption data if editing
const loadAbsorptionData = async () => {
  const absorptionId = route.params.id;
  if (absorptionId && absorptionId !== '0') {
    loading.value = true;
    try {
      // En producción, usa esto:
      // const response = await axios.get(`http://127.0.0.1:8000/api/absorptions/${absorptionId}`);
      // formData.value = { ...formData.value, ...response.data };

      // Mock data para desarrollo
      const mockData = {
        id: absorptionId,
        building_id: props.buildingId,
        abs_tenant_id: 'TENANT-001',
        abs_industry_id: 'IND-001',
        // ... otros campos con datos de ejemplo
      };
      formData.value = { ...formData.value, ...mockData };
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load absorption data'
      });
    } finally {
      loading.value = false;
    }
  }
};

// Save form data
const saveAbsorption = async () => {
  try {
    loading.value = true;
    const absorptionId = route.params.id;
    const isNew = absorptionId === '0';
    const method = isNew ? 'post' : 'put';
    const url = isNew 
      ? 'http://127.0.0.1:8000/api/absorptions'
      : `http://127.0.0.1:8000/api/absorptions/${absorptionId}`;

    // En producción, descomenta esto:
    // await axios[method](url, formData.value);
    
    console.log('Saving absorption:', formData.value);
    
    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: `Absorption record successfully ${isNew ? 'created' : 'updated'}`
    });
    
    router.push(`/operacion/building/${route.params.id}/absorption`);
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to save absorption data'
    });
  } finally {
    loading.value = false;
  }
};

const handleReturn = () => {
  emit('return');
};

onMounted(() => {
  loadAbsorptionData();
});
</script>

<template>
  <div class="absorption-form p-4">
    <CCard>
      <CCardHeader class="d-flex justify-content-between align-items-center">
        <h3>{{ isNewRecord ? 'New Absorption' : 'Edit Absorption' }}</h3>
        <CButton 
          color="primary" 
          variant="outline" 
          @click="handleReturn"
        >
          Return
        </CButton>
      </CCardHeader>
      
      <CCardBody>
        <CForm @submit.prevent="saveAbsorption">
          <div class="row">
            <!-- Tenant & Industry Information -->
            <div class="col-md-6">
              <CCard class="mb-4">
                <CCardHeader>Tenant & Industry Information</CCardHeader>
                <CCardBody>
                  <div class="mb-3">
                    <CFormLabel>Tenant</CFormLabel>
                    <CFormInput
                      v-model="formData.abs_tenant_id"
                      required
                    />
                  </div>
                  
                  <div class="mb-3">
                    <CFormLabel>Industry</CFormLabel>
                    <CFormInput
                      v-model="formData.abs_industry_id"
                      required
                    />
                  </div>
                  
                  <div class="mb-3">
                    <CFormLabel>Company Type</CFormLabel>
                    <CFormSelect
                      v-model="formData.abs_company_type"
                      :options="companyTypeOptions"
                      required
                    />
                  </div>
                  
                  <div class="mb-3">
                    <CFormLabel>Final Use</CFormLabel>
                    <CFormSelect
                      v-model="formData.abs_final_use"
                      :options="finalUseOptions"
                      required
                    />
                  </div>
                </CCardBody>
              </CCard>
            </div>

            <!-- Lease Information -->
            <div class="col-md-6">
              <CCard class="mb-4">
                <CCardHeader>Lease Information</CCardHeader>
                <CCardBody>
                  <div class="mb-3">
                    <CFormLabel>Lease Term (Months)</CFormLabel>
                    <CFormInput
                      type="number"
                      v-model="formData.abs_lease_term_month"
                      required
                    />
                  </div>

                  <div class="mb-3">
                    <CFormLabel>Closing Date</CFormLabel>
                    <CFormInput
                      type="date"
                      v-model="formData.abs_closing_date"
                    />
                  </div>

                  <div class="mb-3">
                    <CFormLabel>Lease Up Date</CFormLabel>
                    <CFormInput
                      type="date"
                      v-model="formData.abs_lease_up"
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
                </CCardBody>
              </CCard>
            </div>

            <!-- Additional Details -->
            <div class="col-md-12">
              <CCard class="mb-4">
                <CCardHeader>Additional Details</CCardHeader>
                <CCardBody>
                  <div class="row">
                    <div class="col-md-6">
                      <div class="mb-3">
                        <CFormLabel>Broker</CFormLabel>
                        <CFormInput
                          v-model="formData.broker_id"
                        />
                      </div>

                      <div class="mb-3">
                        <CFormLabel>Country</CFormLabel>
                        <CFormInput
                          v-model="formData.abs_country_id"
                        />
                      </div>
                    </div>

                    <div class="col-md-6">
                      <div class="mb-3">
                        <CFormCheck
                          id="newConstruction"
                          v-model="formData.new_construction"
                          label="New Construction"
                        />
                      </div>

                      <div class="mb-3">
                        <CFormCheck
                          id="startingConstruction"
                          v-model="formData.is_starting_construction"
                          label="Starting Construction"
                        />
                      </div>
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
.absorption-form {
  max-width: 1200px;
  margin: 0 auto;
}
</style>