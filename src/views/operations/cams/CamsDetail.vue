<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import { ROUTE_NAMES } from '../../../router/routeNames';
import { API } from '../../../services';
import CamsForm from './CamsForm.vue'

const route = useRoute()
const router = useRouter()
const formRef = ref(null)
const submittingForm = ref(false)

const camId = computed(() => Number(route.params.camId) || null)
const cam = ref({})  // Inicializamos como objeto vacío en lugar de null

async function fetchCam() {
  try {
    const { data } = await API.cams.getCam(camId.value);
    if (data?.data) {
      const booleanFields = [
        'has_cam_services',
        'has_lightning_maintenance',
        'has_park_administration',
        'storm_sewer_maintenance',
        'has_surveillance',
        'has_management_fee'
      ];

      cam.value = Object.keys(data.data).reduce((acc, key) => {
        if (booleanFields.includes(key)) {
          acc[key] = Boolean(data.data[key]);
        } else {
          acc[key] = data.data[key] || '';
        }
        return acc;
      }, {});
    }
  } catch (error) {
    showError('Failed to load CAM data: ' + error.message);
  }
}

function showError(message) {
  Swal.fire({
    icon: 'error',
    title: 'Error',
    text: message,
    toast: true,
    position: 'bottom',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true
  });
}

function handleSuccess(message) {
  Swal.fire({
    icon: 'success',
    title: 'Success',
    text: message,
  });
  router.push({ name: ROUTE_NAMES.CAMS_INDEX })
}

function handleError({ message, errors }) {
  showError(message);
}

onMounted(async () => {
  if (camId.value) {
    await fetchCam();
  }
});
</script>

<template>
  <div>
    <CCard class="container-btn-flotante">
      <CCardBody class="ps-1 py-3">
        <CRow class="justify-content-center">
          <CCol xs="auto" class="btns-flotantes-customer-moviles">
            <CLoadingButton 
              color="primary" 
              variant="outline" 
              @click="formRef?.submit?.()" 
              class="me-3" 
              :loading="submittingForm"
            >
              <CIcon name="cilSave" size="sm" /> Save
            </CLoadingButton>
            <CButton 
              color="primary" 
              variant="outline" 
              @click="router.push({ name: ROUTE_NAMES.CAMS_INDEX })"
            >
              <CIcon name="cilArrowCircleLeft" size="sm" /> List
            </CButton>
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>

    <CamsForm 
      :camId="camId"
      :initialData="cam"
      ref="formRef"
      @submitting="(value) => submittingForm = value"
      @success="handleSuccess"
      @error="handleError"
    />
  </div>
</template> 