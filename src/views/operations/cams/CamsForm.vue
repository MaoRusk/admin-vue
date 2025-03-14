<template>
  <form @submit.prevent="onSubmit" ref="formHtmlElement">
    <CCard>
      <CCardHeader>
        <h4>{{ props.camId ? 'Edit CAM' : 'New CAM' }}</h4>
      </CCardHeader>
      <CCardBody>
        <CRow>
          <!-- Location Section -->
          <CCol xs="12" md="6">
            <h5>Location</h5>
            <div class="mb-3">
              <label class="form-label">Region *</label>
              <MSelect
                v-model="cam.region_id"
                :options="regions.items"
                :reduce="option => option.value"
                required
                placeholder="Select..."
                :loading="regions.loading"
              />
            </div>

            <div class="mb-3">
              <label class="form-label">Market *</label>
              <MSelect
                v-model="cam.market_id"
                :options="markets.items"
                :reduce="option => option.value"
                required
                placeholder="Select..."
                :loading="markets.loading"
                :disabled="!cam.region_id"
              />
            </div>

            <div class="mb-3">
              <label class="form-label">Submarket *</label>
              <MSelect
                v-model="cam.sub_market_id"
                :options="submarkets.items"
                :reduce="option => option.value"
                required
                placeholder="Select..."
                :loading="submarkets.loading"
                :disabled="!cam.market_id"
              />
            </div>

            <div class="mb-3">
              <label class="form-label">Industrial Park *</label>
              <MSelect
                v-model="cam.industrial_park_id"
                :options="industrialParks.items"
                :reduce="option => option.value"
                required
                placeholder="Select..."
                :loading="industrialParks.loading"
                :disabled="!cam.sub_market_id"
                createOption
                :isIndustrialParkForm="true"
                :marketId="cam.market_id?.toString()"
                :submarketId="cam.sub_market_id?.toString()"
                @submitOption="saveOptionGeneral('industrial_park_id', $event)"
                @editOption="saveOptionGeneral('industrial_park_id', $event, true)"
                @deleteOption="fetchIndustrialParks(cam.market_id, cam.sub_market_id)"
              />
            </div>

            <div class="mb-3">
              <label class="form-label">Developer *</label>
              <MSelect
                v-model="cam.developer_id"
                :options="developers.items"
                :reduce="option => option.id"
                required
                placeholder="Select..."
                :loading="developers.loading"
                :disabled="!cam.sub_market_id"
                createOption
                :isDevForm="true"
                :marketId="cam.market_id?.toString()"
                :submarketId="cam.sub_market_id?.toString()"
                @submitOption="saveOptionGeneral('developer_id', $event)"
                @editOption="saveOptionGeneral('developer_id', $event, true)"
                @deleteOption="fetchDevelopers(cam.market_id, cam.sub_market_id)"
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
              <MSelect
                v-model="cam.currency"
                :options="currencies.items"
                :reduce="option => option.value"
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
                  v-model="cam.has_surveillance"
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

<script setup>
import { onMounted, reactive, ref, watch } from 'vue';
import Swal from 'sweetalert2';

import { API } from '../../../services';
import { ROUTE_NAMES } from '../../../router/routeNames';
import MSelect from '../../../components/MSelect.vue';

const props = defineProps({
  camId: Number,
  initialData: {
    type: Object,
    default: () => ({})
  }
})

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

const cam = reactive({ ...props.initialData || camEmpty })
const formHtmlElement = ref(null)

async function onSubmit() {
  emit('submitting', true)
  try {
    let data;
    if (props.camId) {
      ({ data } = await API.cams.updateCam(props.camId, cam));
    } else {
      ({ data } = await API.cams.createCam(cam));
    }
    emit('submitting', false)
    emit('success', data.message)
  } catch (e) {
    emit('submitting', false)
    emit('error', { message: e.response.data.message, errors: e.response.data.errors })
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
  try {
    const { data } = await API.industrialparks.getIndustrialParks({ marketId, submarketId });
    console.log('Industrial Parks Response:', data);
    
    // Asegurarnos de que data.data existe y es un array
    const parksArray = Array.isArray(data.data) ? data.data : [];
    
    industrialParks.items = parksArray
      .filter(park => park && park.name) // Asegurarnos de que el parque existe y tiene nombre
      .map(park => ({
        ...park,
        label: park.name,
        value: park.id
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    console.log('Processed Industrial Parks:', industrialParks.items);
  } catch (error) {
    console.error('Error fetching industrial parks:', error);
    industrialParks.items = [];
  } finally {
    industrialParks.loading = false
  }
}

async function fetchSubmarkets(marketId) {
  submarkets.loading = true
  const data = await API.submarkets.getSubmarkets({ market_id: marketId });
  submarkets.loading = false
  submarkets.items = data.map(({ id, name }) => ({ label: name, value: id }))
    .sort((a, b) => a.label.localeCompare(b.label))
}

async function fetchMarkets(regionId) {
  markets.loading = true
  const data = await API.markets.getMarkets({ regionId });
  markets.loading = false
  markets.items = data.map(({ id, name }) => ({ label: name, value: id }))
    .sort((a, b) => a.label.localeCompare(b.label))
}

async function fetchRegions() {
  regions.loading = true
  const { data } = await API.regions.getRegions();
  regions.loading = false
  regions.items = data.data.map(({ id, name }) => ({ label: name, value: id }))
}

async function saveOptionGeneral(field, values, update = false) {
  try {
    let data;
    if (field === 'developer_id') {
      const body = {
        name: values.name,
        is_developer: true,
        market_id: cam.market_id,
        sub_market_id: cam.sub_market_id
      }
      if (update) {
        ({ data } = await API.developers.updateDeveloper(values.id, body));
        if (cam.developer_id === data.data.id && !data.data.is_developer) {
          cam.developer_id = ''
        }
      } else {
        ({ data } = await API.developers.createDeveloper(body));
        cam[field] = data.data.id
      }
      await fetchDevelopers(cam.market_id, cam.sub_market_id)
    } else if (field === 'industrial_park_id') {
      const body = {
        name: values.name,
        market_id: cam.market_id,
        sub_market_id: cam.sub_market_id
      }
      if (update) {
        ({ data } = await API.industrialparks.updateIndustrialPark(values.id, body))
      } else {
        ({ data } = await API.industrialparks.createIndustrialPark(body))
        cam[field] = data.data.id
      }
      await fetchIndustrialParks(cam.market_id, cam.sub_market_id)
    }
    return data
  } catch (error) {
    console.error('Error saving option:', error);
    throw error;
  }
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
  
  try {
    await Promise.all([
      fetchRegions(),
      fetchCurrencies(),
    ])
  } catch (error) {
    console.error('Error loading initial data:', error);
    showError('Failed to load initial data');
  } finally {
    Swal.close();
  }
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
    if (!industrialParks.items.find(item => item.value === cam.industrial_park_id)) {
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

watch(() => props.initialData, (newData) => {
  if (newData) {
    Object.keys(newData).forEach(key => {
      cam[key] = newData[key]
    })
  }
}, { deep: true })

defineExpose({
  submit() {
    if (formHtmlElement.value?.reportValidity()) {
      formHtmlElement.value?.requestSubmit()
    }
  }
});
</script>

<style>
  /* No changes to style section */
</style> 