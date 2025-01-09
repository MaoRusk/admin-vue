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

const formData = ref({
  id: null,
  building_id: '',
  abs_tenant_id: '',
  abs_industry_id: '',
  abs_lease_term_month: null,
  abs_closing_date: '',
  abs_final_use: '',
  abs_sale_price: null
});

const handleReturn = () => {
  emit('return');
};

const saveAbsorption = async () => {
  try {
    loading.value = true;
    // Simular guardado
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

onMounted(() => {
  if (!isNewRecord.value) {
    // Cargar datos para edición
    formData.value = {
      id: 1,
      building_id: 'BLDG-001',
      abs_tenant_id: 'TNT-001',
      abs_industry_id: 'IND-001',
      abs_lease_term_month: 60,
      abs_closing_date: '2024-03-15',
      abs_final_use: 'Warehouse',
      abs_sale_price: 1500000.00
    };
  }
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
          <!-- Form fields -->
          <div class="row">
            <div class="col-md-6 mb-3">
              <CFormLabel>Tenant</CFormLabel>
              <CFormInput v-model="formData.abs_tenant_id" required />
            </div>
            <div class="col-md-6 mb-3">
              <CFormLabel>Industry</CFormLabel>
              <CFormInput v-model="formData.abs_industry_id" required />
            </div>
          </div>

          <div class="row">
            <div class="col-md-6 mb-3">
              <CFormLabel>Lease Term (months)</CFormLabel>
              <CFormInput type="number" v-model="formData.abs_lease_term_month" required />
            </div>
            <div class="col-md-6 mb-3">
              <CFormLabel>Closing Date</CFormLabel>
              <CFormInput type="date" v-model="formData.abs_closing_date" required />
            </div>
          </div>

          <div class="row">
            <div class="col-md-6 mb-3">
              <CFormLabel>Final Use</CFormLabel>
              <CFormInput v-model="formData.abs_final_use" required />
            </div>
            <div class="col-md-6 mb-3">
              <CFormLabel>Sale Price</CFormLabel>
              <CFormInput type="number" v-model="formData.abs_sale_price" required />
            </div>
          </div>

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