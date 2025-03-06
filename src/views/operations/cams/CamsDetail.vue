<script setup>
import { onMounted, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Swal from 'sweetalert2';

import { API } from '../../../services';
import { ROUTE_NAMES } from '../../../router/routeNames';
import MASelect from '../../../components/MASelect.vue';

const router = useRouter()
const route = useRoute()
const camId = ref(Number(route.params.camId) || null)

const emit = defineEmits(['submitting'])

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
  has_survelliance: false,
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
    Object.keys(camEmpty).forEach(key => {
      cam[key] = data.data[key] || ''
    });
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to load CAM data: ' + error.message,
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

defineExpose({
  submit() {
    if (formHtmlElement.value?.reportValidity()) {
      formHtmlElement.value?.requestSubmit()
    }
  }
});
</script>

<template>
  <form @submit.prevent="onSubmit" ref="formHtmlElement">
    <CCard>
      <CCardHeader>
        <h4>{{ camId ? 'Edit CAM' : 'New CAM' }}</h4>
      </CCardHeader>
      <CCardBody>
        <CRow>
          <!-- Location Section -->
          <CCol xs="12" md="6">
            <h5>Location</h5>
            <div class="mb-3">
              <label class="form-label">Region *</label>
              <MASelect
                v-model="cam.region_id"
                :options="regions.items"
                :reduce="option => option.value"
                label="label"
                required
                placeholder="Select..."
                :loading="regions.loading"
              />
            </div>

            <div class="mb-3">
              <label class="form-label">Market *</label>
              <MASelect
                v-model="cam.market_id"
                :options="markets.items"
                :reduce="option => option.value"
                label="label"
                required
                placeholder="Select..."
                :loading="markets.loading"
                :disabled="!cam.region_id"
              />
            </div>

            <div class="mb-3">
              <label class="form-label">Submarket *</label>
              <MASelect
                v-model="cam.sub_market_id"
                :options="submarkets.items"
                :reduce="option => option.value"
                label="label"
                required
                placeholder="Select..."
                :loading="submarkets.loading"
                :disabled="!cam.market_id"
              />
            </div>

            <div class="mb-3">
              <label class="form-label">Industrial Park *</label>
              <MASelect
                v-model="cam.industrial_park_id"
                :options="industrialParks.items"
                :reduce="option => option.id"
                label="name"
                required
                placeholder="Select..."
                :loading="industrialParks.loading"
                :disabled="!cam.sub_market_id"
              />
            </div>

            <div class="mb-3">
              <label class="form-label">Developer *</label>
              <MASelect
                v-model="cam.developer_id"
                :options="developers.items"
                :reduce="option => option.id"
                label="name"
                required
                placeholder="Select..."
                :loading="developers.loading"
                :disabled="!cam.sub_market_id"
              />
            </div>
          </CCol>

          <!-- Details Section -->
          <CCol xs="12" md="6">
            <h5>Details</h5>
            <div class="mb-3">
              <CFormInput
                v-model="cam.cam_building_sf"
                type="number"
                label="Building SF *"
                required
              />
            </div>

            <div class="mb-3">
              <CFormInput
                v-model="cam.cam_land_sf"
                type="number"
                label="Land SF *"
                required
              />
            </div>

            <div class="mb-3">
              <label class="form-label">Currency *</label>
              <MASelect
                v-model="cam.currency"
                :options="currencies.items"
                :reduce="option => option.value"
                label="label"
                required
                placeholder="Select..."
                :loading="currencies.loading"
              />
            </div>

            <div class="mb-3">
              <CFormInput
                v-model="cam.latitude"
                label="Latitude *"
                required
              />
            </div>

            <div class="mb-3">
              <CFormInput
                v-model="cam.longitude"
                label="Longitude *"
                required
              />
            </div>
          </CCol>

          <!-- Services Section -->
          <CCol xs="12">
            <h5>Services</h5>
            <CRow>
              <CCol xs="12" md="4">
                <CFormSwitch
                  v-model="cam.has_cam_services"
                  label="CAM Services"
                  size="lg"
                />
              </CCol>
              <CCol xs="12" md="4">
                <CFormSwitch
                  v-model="cam.has_lightning_maintenance"
                  label="Lightning Maintenance"
                  size="lg"
                />
              </CCol>
              <CCol xs="12" md="4">
                <CFormSwitch
                  v-model="cam.has_park_administration"
                  label="Park Administration"
                  size="lg"
                />
              </CCol>
              <CCol xs="12" md="4">
                <CFormSwitch
                  v-model="cam.storm_sewer_maintenance"
                  label="Storm Sewer Maintenance"
                  size="lg"
                />
              </CCol>
              <CCol xs="12" md="4">
                <CFormSwitch
                  v-model="cam.has_survelliance"
                  label="Surveillance"
                  size="lg"
                />
              </CCol>
              <CCol xs="12" md="4">
                <CFormSwitch
                  v-model="cam.has_management_fee"
                  label="Management Fee"
                  size="lg"
                />
              </CCol>
            </CRow>
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>
  </form>
</template> 