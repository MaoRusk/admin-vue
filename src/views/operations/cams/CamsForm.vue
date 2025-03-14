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
                :get-option-label="option => option.name"
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
                @deleteOption="fetchDevelopers()"
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
  industrial_park_id: null,
  developer_id: null,
  region_id: null,
  market_id: null,
  sub_market_id: null,
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
    // Define field mappings for better error messages and validation
    const numericFieldMappings = {
      'region_id': 'Region',
      'market_id': 'Market',
      'sub_market_id': 'Submarket',
      'industrial_park_id': 'Industrial Park',
      'developer_id': 'Developer',
      'cam_building_sf': 'Building SF',
      'cam_land_sf': 'Land SF'
    };

    const formData = {};
    const invalidFields = [];

    // Improved ID extraction function
    const extractId = (value) => {
      if (value === null || value === undefined) return null;
      
      // Handle array values (from select components)
      if (Array.isArray(value)) {
        value = value[0]; // Take the first item if it's an array
      }
      
      // Handle primitive number or numeric string
      if (typeof value === 'number') return value;
      if (typeof value === 'string' && !isNaN(value)) return Number(value);
      
      // Handle object with id or value property
      if (typeof value === 'object' && value !== null) {
        if ('id' in value && value.id !== null) return Number(value.id);
        if ('value' in value && value.value !== null) return Number(value.value);
      }
      
      return null;
    };

    // Process numeric fields
    Object.entries(numericFieldMappings).forEach(([field, label]) => {
      const value = cam[field];
      const extractedId = extractId(value);
      
      console.log(`Processing ${label}:`, {
        originalValue: value,
        extractedId: extractedId,
        valueType: typeof value,
        isArray: Array.isArray(value)
      });

      if (extractedId === null || isNaN(extractedId) || extractedId <= 0) {
        invalidFields.push(`${label} (received: ${JSON.stringify(value)})`);
      } else {
        formData[field] = extractedId;
      }
    });

    // Extract and validate currency
    const currencyValue = Array.isArray(cam.currency) ? cam.currency[0]?.value : 
                         typeof cam.currency === 'object' ? cam.currency.value : 
                         cam.currency;
                         
    console.log('Processing currency:', {
      originalValue: cam.currency,
      extractedValue: currencyValue,
      typeOf: typeof cam.currency,
      isArray: Array.isArray(cam.currency)
    });

    if (!currencyValue) {
      invalidFields.push('Currency');
    } else {
      formData.currency = currencyValue;
    }

    // Validate other required non-numeric fields
    if (!cam.latitude?.toString().trim()) {
      invalidFields.push('Latitude');
    }
    if (!cam.longitude?.toString().trim()) {
      invalidFields.push('Longitude');
    }

    if (invalidFields.length > 0) {
      throw new Error(`Please provide valid values for: ${invalidFields.join(', ')}`);
    }

    // Add non-numeric fields to form data
    formData.latitude = String(cam.latitude).trim();
    formData.longitude = String(cam.longitude).trim();
    
    // Add boolean fields
    const booleanFields = [
      'has_cam_services',
      'has_lightning_maintenance',
      'has_park_administration',
      'storm_sewer_maintenance',
      'has_surveillance',
      'has_management_fee'
    ];
    
    booleanFields.forEach(field => {
      formData[field] = Boolean(cam[field]);
    });

    console.log('Final validated form data:', formData);

    let data;
    if (props.camId) {
      ({ data } = await API.cams.updateCam(props.camId, formData));
    } else {
      ({ data } = await API.cams.createCam(formData));
    }
    
    console.log('API Response:', data);
    emit('submitting', false)
    emit('success', data.message)
  } catch (e) {
    console.error('Form submission error:', e);
    console.error('Error details:', e.response?.data);
    emit('submitting', false)
    const errorMessage = e.response?.data?.message || e.message || 'Error submitting form';
    emit('error', { 
      message: errorMessage, 
      errors: e.response?.data?.errors || {}
    })
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
  try {
    const { data } = await API.currencies.getCurrencies();
    currencies.loading = false
    currencies.items = Object.values(data.data).map(value => ({ 
      value: value,
      label: value
    }))
  } catch (error) {
    console.error('Error fetching currencies:', error);
    currencies.items = [];
  } finally {
    currencies.loading = false;
  }
}

async function fetchDevelopers() {
  developers.loading = true;
  try {
    const response = await API.developers.getDevelopers({ is_developer: true });
    console.log('Developers API Response:', response);
    
    // Manejar el caso donde response es directamente el array
    const developersData = Array.isArray(response) ? response : response?.data || [];
    
    developers.items = developersData
      .filter(dev => dev && dev.name)
      .map(dev => ({
        id: dev.id,
        name: dev.name,
        label: dev.name,
        value: dev.id,
        ...dev
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
    
    console.log('Final developers items:', developers.items);
  } catch (error) {
    console.error('Error fetching developers:', error);
    developers.items = [];
  } finally {
    developers.loading = false;
  }
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
      await fetchDevelopers();
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
      fetchDevelopers(),
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