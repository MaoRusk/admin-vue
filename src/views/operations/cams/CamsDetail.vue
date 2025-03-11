<script setup>
import { onMounted, reactive, ref, watch, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Swal from 'sweetalert2';

import { API } from '../../../services';
import { ROUTE_NAMES } from '../../../router/routeNames';
import MASelect from '../../../components/MASelect.vue';
import CamsForm from './CamsForm.vue'

const route = useRoute()
const router = useRouter()

const camId = computed(() => Number(route.params.camId) || null)

const submittingForm = ref(false)
const formRef = ref(null)

const emit = defineEmits(['submitting', 'success', 'error'])

const camEmpty = {
  industrial_park_id: '',
  developer_id: '',
  region_id: '',
  market_id: '',
  sub_market_id: '',
  cam_building_sf: '',
  cam_land_sf: '',
  has_cam_services: false,
  has_lightning_maintenance: false,
  has_park_administration: false,
  storm_sewer_maintenance: false,
  has_surveillance: false,
  has_management_fee: false,
  currency: '',
  latitude: '',
  longitude: '',
}

const cam = reactive({ ...camEmpty })
const formHtmlElement = ref(null)

async function onSubmit() {
  emit('submitting', true)
  try {
    let data;
    if (camId.value) {
      ({ data } = await API.cams.updateCam(camId.value, cam));
    } else {
      ({ data } = await API.cams.createCam(cam));
    }
    emit('submitting', false)
    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: data.message,
    });
    router.push({ name: ROUTE_NAMES.CAMS_INDEX })
  } catch (e) {
    emit('submitting', false)
    Swal.fire(e.response.data.message, JSON.stringify(e.response.data.errors), 'error')
  }
}

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

      Object.keys(camEmpty).forEach(key => {
        if (booleanFields.includes(key)) {
          cam[key] = data.data[key] === 1 || data.data[key] === true;
        } else {
          cam[key] = data.data[key] || '';
        }
      });
    }
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to load CAM data: ' + error.message,
      toast: true,
      position: 'bottom',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true
    });
  }
}

const regions = reactive({ loading: false, items: []})
const markets = reactive({ loading: false, items: []})
const submarkets = reactive({ loading: false, items: []})
const industrialParks = reactive({ loading: false, items: []})
const developers = reactive({ loading: false, items: []})
const currencies = reactive({ loading: false, items: []})

async function fetchCurrencies() {
  currencies.loading = true
  const { data } = await API.currencies.getCurrencies();
  currencies.loading = false
  currencies.items = Object.values(data.data).map(value => ({ value, label: value }))
}

async function fetchDevelopers(marketId, submarketId) {
  developers.loading = true
  const data = await API.developers.getDevelopers({ is_developer: true, marketId, submarketId });
  developers.loading = false
  developers.items = data.sort((a, b) => a.name.localeCompare(b.name))
}

async function fetchIndustrialParks(marketId, submarketId) {
  industrialParks.loading = true
  const { data } = await API.industrialparks.getIndustrialParks({ marketId, submarketId});
  industrialParks.loading = false
  industrialParks.items = data.data.sort((a, b) => a.name.localeCompare(b.name))
}

async function fetchSubmarkets(marketId) {
  submarkets.loading = true
  const { data } = await API.submarkets.getSubmarkets({ marketId });
  submarkets.loading = false
  submarkets.items = data.data.map(({ id, name }) => ({ label: name, value: id }))
}

async function fetchMarkets(regionId) {
  markets.loading = true
  const { data } = await API.markets.getMarkets({ regionId });
  markets.loading = false
  markets.items = data.data.map(({ id, name }) => ({ label: name, value: id }))
}

async function fetchRegions() {
  regions.loading = true
  const { data } = await API.regions.getRegions();
  regions.loading = false
  regions.items = data.data.map(({ id, name }) => ({ label: name, value: id}))
}

onMounted(async () => {
  Swal.fire({
    title: "Loading!",
    didOpen: () => {
      Swal.showLoading();
    },
    allowOutsideClick: false,
    allowEscapeKey: false,
  })
  await Promise.all([
    fetchRegions(),
    fetchCurrencies(),
  ])
  if (camId.value) {
    await fetchCam();
  }
  Swal.close()
});

watch(() => cam.region_id, async () => {
  if (cam.region_id) {
    await fetchMarkets(cam.region_id)
    if (!markets.items.find(item => item.value === cam.market_id)) {
      cam.market_id = ''
    }
  } else {
    cam.market_id = ''
  }
})

watch(() => cam.market_id, async () => {
  if (cam.market_id) {
    await fetchSubmarkets(cam.market_id)
    if (!submarkets.items.find(item => item.value === cam.sub_market_id)) {
      cam.sub_market_id = ''
    }
  } else {
    cam.sub_market_id = ''
  }
})

watch(() => cam.sub_market_id, async () => {
  if (cam.sub_market_id) {
    await Promise.all([
      fetchIndustrialParks(cam.market_id, cam.sub_market_id),
      fetchDevelopers(cam.market_id, cam.sub_market_id),
    ])
    if (!industrialParks.items.find(item => item.id === cam.industrial_park_id)) {
      cam.industrial_park_id = ''
    }
    if (!developers.items.find(item => item.id === cam.developer_id)) {
      cam.developer_id = ''
    }
  } else {
    cam.industrial_park_id = ''
    cam.developer_id = ''
  }
})

function dispatchSubmitForm() {
  formRef.value?.submit?.()
}

function showList() {
  router.push({ name: ROUTE_NAMES.CAMS_INDEX })
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
  Swal.fire(message, JSON.stringify(errors), 'error')
}
</script>

<template>
  <div>
    <CCard class="container-btn-flotante">
      <CCardBody class="ps-1 py-3">
        <CRow class="justify-content-center">
          <CCol xs="auto" class="btns-flotantes-customer-moviles">
            <CLoadingButton 
              color="success" 
              variant="outline" 
              @click="dispatchSubmitForm" 
              class="me-3" 
              :loading="submittingForm"
            >
              <CIcon name="cilSave" size="sm" /> Save
            </CLoadingButton>
            <CButton color="primary" variant="outline" @click="showList()">
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