<script setup>
import { computed, onMounted, reactive, ref, watchEffect } from 'vue';
import Swal from 'sweetalert2';
import { API } from '../../../services';
import { useRouter } from 'vue-router';
import { ROUTE_NAMES } from '../../../router/routeNames';
import MSelect from '../../../components/MSelect.vue';

const router = useRouter()

const props = defineProps({
  buildingId: Number
})

const emit = defineEmits(['submitting'])

const buildingEmpty = {
  region_id: '', 
  market_id: '', 
  submarket_id: '', 
  builder_id: '', 
  industrial_park_id: '', 
  developer_id: '', 
  owner_id: '', 
  building_name: '', 
  building_size_sf: '', 
  latitud: '', 
  longitud: '', 
  year_built: '', 
  clear_height_ft: '', 
  total_land_sf: '', 
  offices_space_ft: '', 
  has_crane: false,
  has_rail_spur: false,
  has_leed: false,
  ventilation: '', 
  construction_state: '', 
  roof_system: '', 
  skylights_sf: '', 
  coverage: '', 
  kvas: '', 
  expansion_land: '', 
  class: '', 
  type_generation: '', 
  currency: '', 
  tenancy: '', 
  construction_type: '', 
  lightning: '', 
  fire_protection_system: '', 
  deal: '', 
  loading_door: '', 
  above_market_tis: '', 
  status: 'Active',
  floor_thickness_ft: '',
  floor_resistance: '',
  expansion_up_to_sf: '',

  hvacProduction: '',
  hvacArea: '',

  transformer_capacity_value_1: '',
  transformer_capacity_value_2: '',

  columns_spacing_value_1: '',
  columns_spacing_value_2: '',

  bay_size_value_1: '',
  bay_size_value_2: '',

  sfSm: false, // TODO, esta variable no esta en building
}

const building = reactive({...buildingEmpty})
const formHtmlElement = ref(null)
const VALUE_SEPARATOR = ' x '

const validateRangeInputs = (model, field1, field2, fieldName) => {
  if (model && model[field1] && model[field2] && +(model[field1]) > +(model[field2])) {
    Swal.fire({
      icon: 'warning',
      title: 'Invalid Range',
      text: `The first ${fieldName} value cannot be greater than the second value`,
    });
    model[field1] = ''
    model[field2] = ''
  }
};

const validateHvacRange = () => {
  validateRangeInputs(
    building,
    'hvacProduction',
    'hvacArea',
    'HVAC Production Area'
  );
}

const coverage = computed(() => building.building_size_sf && building.total_land_sf ? (+building.building_size_sf * +building.total_land_sf) : '')

async function onSubmit() {
  emit('submitting', true)
  try {
    let data;
    const body = {
      ...building,
      hvac_production_area: (building.hvacProduction && building.hvacArea) ? `${building.hvacProduction}${VALUE_SEPARATOR}${building.hvacArea}` : '',
      transformer_capacity: (building.transformer_capacity_value_1 && building.transformer_capacity_value_2) ? `${building.transformer_capacity_value_1}${VALUE_SEPARATOR}${building.transformer_capacity_value_2}` : '',
      columns_spacing_ft: (building.columns_spacing_value_1 && building.columns_spacing_value_2) ? `${building.columns_spacing_value_1}${VALUE_SEPARATOR}${building.columns_spacing_value_2}` : '',
      bay_size: (building.bay_size_value_1 && building.bay_size_value_2) ? `${building.bay_size_value_1}${VALUE_SEPARATOR}${building.bay_size_value_2}` : '',
      coverage: coverage.value
    }
    if (props.buildingId) {
      ({ data } = await API.buildings.updateBuilding(props.buildingId, body));
    } else {
      ({ data } = await API.buildings.createBuilding(body));
    }
    emit('submitting', false)
    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: data.message,
    });
    router.push({ name: ROUTE_NAMES.BUILDINGS_UPDATE, params: { buildingId: data.data.id } })
  } catch (e) {
    emit('submitting', false)
    Swal.fire(e.response.data.message, JSON.stringify(e.response.data.errors), 'error')
  }
}

const fetchBuildingData = async () => {
  try {
    const buildingId = props.buildingId;
    const { data } = await API.buildings.getBuilding(buildingId);
    ['region_id', 'market_id', 'submarket_id', 'industrial_park_id', 'builder_id', 'developer_id', 'owner_id', 'building_name', 'building_size_sf', 'latitud', 'longitud', 'clear_height_ft', 'total_land_sf', 'offices_space_ft', 'ventilation', 'construction_state', 'roof_system', 'skylights_sf', 'coverage', 'kvas', 'expansion_land', 'class', 'type_generation', 'currency', 'tenancy', 'construction_type', 'lightning', 'fire_protection_system', 'deal', 'loading_door', 'above_market_tis', 'status', 'floor_thickness_ft', 'floor_resistance']
    .forEach(prop => building[prop] = data.data[prop] ? `${data.data[prop]}` : '');
    ['has_crane', 'has_rail_spur', 'has_leed']
    .forEach(prop => building[prop] = Boolean(data.data[prop]));

    building.year_built = `${data.data.year_built}`
    if (data.data.hvac_production_area && data.data.hvac_production_area.length > VALUE_SEPARATOR.length) {
      ([building.hvacProduction, building.hvacArea] = data.data.hvac_production_area.split(VALUE_SEPARATOR))
    }
    if (data.data.transformer_capacity && data.data.transformer_capacity.length > VALUE_SEPARATOR.length) {
      ([building.transformer_capacity_value_1, building.transformer_capacity_value_2] = data.data.transformer_capacity.split(VALUE_SEPARATOR))
    }
    if (data.data.columns_spacing && data.data.columns_spacing.length > VALUE_SEPARATOR.length) {
      ([building.columns_spacing_value_1, building.columns_spacing_value_2] = data.data.columns_spacing.split(VALUE_SEPARATOR))
    }
    if (data.data.bay_size && data.data.bay_size.length > VALUE_SEPARATOR.length) {
      ([building.bay_size_value_1, building.bay_size_value_2] = data.data.bay_size.split(VALUE_SEPARATOR))
    }
    building.sfSm = false // TODO, esta variable no esta en building
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to load building data: ' + error.message,
    });
  }
};

const classes = reactive({ loading: false, items: []})
const statuses = reactive({ loading: false, items: []})
const fireProtectionSystems = reactive({ loading: false, items: []})
const regions = reactive({ loading: false, items: []})
const markets = reactive({ loading: false, items: []})
const industrialParks = reactive({ loading: false, items: []})
const submarkets = reactive({ loading: false, items: []})
const owners = reactive({ loading: false, items: []})
const developers = reactive({ loading: false, items: []})
const builders = reactive({ loading: false, items: []})
const currencies = reactive({ loading: false, items: []})
const tenancies = reactive({ loading: false, items: []})
const deals = reactive({ loading: false, items: []})
const constructionTypes = reactive({ loading: false, items: []})
const generationsTypes = reactive({ loading: false, items: []})
const typesLightnings = reactive({ loading: false, items: []})
const loadingDoors = reactive({ loading: false, items: []})
const technicalImprovements = reactive({ loading: false, items: []})

async function fetchBuildingStatuses() {
  statuses.loading = true
  const { data } = await API.buildings.getBuildingsStatus()
  statuses.loading = false
  statuses.items = Object.values(data.data).map(value => ({ value, label: value, selected: value === building.status }))
  statuses.items.unshift({ value: '', label: 'Select...' })
}

async function fetchBuildingTechnicalImprovements() {
  technicalImprovements.loading = true
  const { data } = await API.buildings.getBuildingsTechnicalImprovements();
  technicalImprovements.loading = false
  technicalImprovements.items = Object.values(data.data).map(value => ({ value, label: value, selected: value === building.above_market_tis }))
  technicalImprovements.items.unshift({ value: '', label: 'Select...' })
}

async function fetchBuildingLoadingDoors() {
  loadingDoors.loading = true
  const { data } = await API.buildings.getBuildingsLoadingDoors();
  loadingDoors.loading = false
  loadingDoors.items = Object.values(data.data).map(value => ({ value, label: value, selected: value === building.loading_door }))
  loadingDoors.items.unshift({ value: '', label: 'Select...' })
}

async function fetchBuildingTypesLightnings() {
  typesLightnings.loading = true
  const { data } = await API.buildings.getBuildingsTypesLightnings();
  typesLightnings.loading = false
  typesLightnings.items = Object.values(data.data).map(value => ({ value, label: value, selected: value === building.lightning }))
  typesLightnings.items.unshift({ value: '', label: 'Select...' })
}

async function fetchBuildingTypeGenerations() {
  generationsTypes.loading = true
  const { data } = await API.buildings.getBuildingsTypesGeneration();
  generationsTypes.loading = false
  generationsTypes.items = Object.values(data.data).map(value => ({ value, label: value, selected: value === building.type_generation }))
  generationsTypes.items.unshift({ value: '', label: 'Select...' })
}

async function fetchTenancies() {
  tenancies.loading = true
  const { data } = await API.buildings.getBuildingsTenancies();
  tenancies.loading = false
  tenancies.items = Object.values(data.data).map(value => ({ value, label: value, selected: value === building.tenancy }))
  tenancies.items.unshift({ value: '', label: 'Select...' })
}

async function fetchCurrencies() {
  currencies.loading = true
  const { data } = await API.currencies.getCurrencies();
  currencies.loading = false
  currencies.items = Object.values(data.data).map(value => ({ value, label: value, selected: value === building.currency }))
  currencies.items.unshift({ value: '', label: 'Select...' })
}

async function fetchBuildingContructionTypes() {
  constructionTypes.loading = true
  const { data } = await API.buildings.getBuildingsTypesConstruction();
  constructionTypes.loading = false
  constructionTypes.items = Object.values(data.data).map(value => ({ value, label: value, selected: value === building.construction_type }))
  constructionTypes.items.unshift({ value: '', label: 'Select...' })
}

async function fetchBuildingDeals() {
  deals.loading = true
  const { data } = await API.buildings.getBuildingsTypesDeals();
  deals.loading = false
  deals.items = Object.values(data.data).map(value => ({ value, label: value, selected: value === building.deal }))
  deals.items.unshift({ value: '', label: 'Select...' })
}

async function fetchDevelopers(marketId, submarketId) {
  developers.loading = true
  const { data } = await API.developers.getDevelopers({ is_developer: true, marketId, submarketId });
  developers.loading = false
  const items = data.data.map(({ id, name }) => ({ label: name, value: id, selected: id === building.developer_id })).sort((a, b) => a.label.localeCompare(b.label))
  items.unshift({ value: '', label: 'Select...' })
  developers.items = items
}

async function fetchBuilders(marketId, submarketId) {
  builders.loading = true
  const { data } = await API.developers.getDevelopers({ is_builder: true, marketId, submarketId });
  builders.loading = false
  const items = data.data.map(({ id, name }) => ({ label: name, value: id, selected: id === building.builder_id })).sort((a, b) => a.label.localeCompare(b.label))
  items.unshift({ value: '', label: 'Select...' })
  builders.items = items
}

async function fetchOwners(marketId, submarketId) {
  owners.loading = true
  const { data } = await API.developers.getDevelopers({ is_owner: true, marketId, submarketId });
  owners.loading = false
  const items = data.data.map(({ id, name }) => ({ label: name, value: id, selected: id === building.owner_id })).sort((a, b) => a.label.localeCompare(b.label))
  items.unshift({ value: '', label: 'Select...' })
  owners.items = items
}

async function fetchIndustrialParks(marketId, submarketId) {
  industrialParks.loading = true
  const { data } = await API.industrialparks.getIndustrialParks({ marketId, submarketId});
  industrialParks.loading = false
  industrialParks.items = data.data.map(({ id, name }) => ({ label: name, value: id, selected: id === building.industrial_park_id })).sort((a, b) => a.label.localeCompare(b.label))
  industrialParks.items.unshift({ value: '', label: 'Select...' })
}

async function fetchSubmarkets(marketId) {
  submarkets.loading = true
  const { data } = await API.submarkets.getSubmarkets({ marketId });
  submarkets.loading = false
  submarkets.items = data.data.map(({ id, name }) => ({ label: name, value: id, selected: id === building.submarket_id })).sort((a, b) => a.label.localeCompare(b.label))
  submarkets.items.unshift({ value: '', label: 'Select...' })
}

async function fetchMarkets(regionId) {
  markets.loading = true
  const { data } = await API.markets.getMarkets({ regionId });
  markets.loading = false
  markets.items = data.data.map(({ id, name }) => ({ label: name, value: id, selected: id === building.market_id })).sort((a, b) => a.label.localeCompare(b.label))
  markets.items.unshift({ value: '', label: 'Select...' })
}

async function fetchClasses() {
  classes.loading = true
  const { data } = await API.buildings.getBuildingsClasses();
  classes.loading = false
  classes.items = Object.values(data.data).map(value => ({ value, label: value, selected: value === building.class }))
  classes.items.unshift({ value: '', label: 'Select...' })
}

async function fetchFireProtectionSystems() {
  fireProtectionSystems.loading = true
  const { data } = await API.buildings.getBuildingsFireProtectionSystems();
  fireProtectionSystems.loading = false
  fireProtectionSystems.items = Object.values(data.data).map(value => ({ value, label: value, selected: value === building.fire_protection_system }))
  fireProtectionSystems.items.unshift({ value: '', label: 'Select...' })
}

async function fetchRegions() {
  regions.loading = true
  const { data } = await API.regions.getRegions();
  regions.loading = false
  regions.items = data.data.map(({ id, name }) => ({ label: name, value: id, selected: id === building.region_id}))
  regions.items.unshift({ value: '', label: 'Select...' })
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
  if (props.buildingId) {
    await fetchBuildingData();
  }
  await Promise.all([
    fetchClasses(),
    fetchRegions(),
    fetchTenancies(),
    fetchCurrencies(),
    fetchFireProtectionSystems(),
    fetchBuildingDeals(),
    fetchBuildingContructionTypes(),
    fetchBuildingTypeGenerations(),
    fetchBuildingLoadingDoors(),
    fetchBuildingTypesLightnings(),
    fetchBuildingTechnicalImprovements(),
    fetchBuildingStatuses()
  ])
  Swal.close()
});

async function createOptionGeneral(field, value) {
  if (['owner_id', 'builder_id', 'developer_id'].includes(field)) {
    try {
      let data;
      if (value.id) {
        // Edit existing developer
        ({ data } = await API.developers.updateDeveloper(value.id, {
          name: value.name,
          is_developer: Boolean(value.is_developer),
          is_builder: Boolean(value.is_builder),
          is_owner: Boolean(value.is_owner),
          is_user_owner: Boolean(value.is_user_owner),
        }));
      } else {
        // Create new developer
        ({ data } = await API.developers.createDeveloper(value));
      }
      
      if (data.success) {
        building[field] = data.data.id;
        await fetchDevelopers();
        Swal.fire({
          icon: "success",
          title: value.id ? "Updated successfully" : "Created successfully",
          toast: true,
          position: "bottom",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true
        });
      }
    } catch (error) {
      console.error('Error with developer:', error);
      const errorMessage = error.response?.data?.errors 
        ? Object.values(error.response.data.errors).flat().join('\n')
        : error.response?.data?.message || 'An error occurred';
        
      Swal.fire({
        icon: "error",
        title: value.id ? "Error updating developer" : "Error creating developer",
        text: errorMessage,
      });
    }
  } else if (field === 'industrial_park_id') {
    const { data } = await API.industrialparks.createIndustrialPark({ 
      name: value.name, 
      market_id: building.market_id, 
      submarket_id: building.submarket_id 
    })
    building[field] = data.data.id
    fetchIndustrialParks(building.market_id, building.submarket_id)
  }
  Swal.fire({
    icon: "success",
    title: "Created successfully",
    toast: true,
    position: "bottom",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    }
  });
}

async function editOptionGeneral(field, value) {
  if (field === 'industrial_park_id') {
    // Just refresh the list after edit
    fetchIndustrialParks(building.market_id, building.submarket_id)
  } else {
    // Handle other types of edits
    await createOptionGeneral(field, value);
  }
}

watchEffect(async () => {
  if (building.region_id) {
    await fetchMarkets(building.region_id)
    building.market_id = props.buildingId ? building.market_id : ''
  }
})

watchEffect(async () => {
  if (building.market_id) {
    await fetchSubmarkets(building.market_id)
    building.submarket_id = props.buildingId ? building.submarket_id : ''
  }
})

watchEffect(async () => {
  if (building.submarket_id) {
    await Promise.all([
      fetchIndustrialParks(building.market_id, building.submarket_id),
      fetchOwners(building.market_id, building.submarket_id),
      fetchBuilders(building.market_id, building.submarket_id),
      fetchDevelopers(building.market_id, building.submarket_id),
    ])
    building.industrial_park_id = props.buildingId ? building.industrial_park_id : ''
    building.owner_id = props.buildingId ? building.owner_id : ''
    building.builder_id = props.buildingId ? building.builder_id : ''
    building.developer_id = props.buildingId ? building.developer_id : ''
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
    <CRow>
      <CCol :md="12">
        <CRow>
          <!-- *** GENERAL INFORMATION *** -->
          <CCard id="general-information" class="card text-secondary mb-3 border-secondary card-header-customer-buildings " >
            <CCardBody class="card-body-customer-buildings">
              General Information
            </CCardBody>
          </CCard>

          <CCard class="card-customer-buildings">
            <CCardBody>
              <CRow>
                <CCol :md="3">
                  <div class="mt-2">
                    <CFormInput
                      size="sm"
                      v-model="building.building_name"
                      label="Building Name"
                      required
                    />
                  </div>
                </CCol>
                <CCol :md="3">
                  <div class="mt-2">
                    <CFormSelect
                      label="Class"
                      v-model="building.class"
                      :options="classes.items"
                      size="sm"
                      required
                    />
                  </div>
                </CCol>
                <CCol :md="3">
                  <div class="mt-2">
                    <CFormInput 
                      type="number"
                      size="sm"
                      v-model="building.building_size_sf"
                      label="Building Size (SF)"
                      required
                    />
                  </div>
                </CCol>
                <CCol md="3">
                  <div class="mt-2">
                    <CFormInput 
                      type="number"
                      size="sm"
                      v-model="building.expansion_land"
                      label="Expansion Land (SF)"
                      required
                    />
                  </div>
                </CCol>
                <!-- TOTAL LAND -->
                <div class="col-md-3">
                  <div class="mt-2">
                    <CFormInput 
                      type="number" 
                      size="sm"
                      v-model="building.total_land_sf"
                      label="Total Land (SF)"
                    />
                  </div>
                </div>
                <CCol md="3">
                  <div class="mt-2">
                    <CFormInput 
                      type="number"
                      size="sm"
                      v-model="building.expansion_up_to_sf"
                      label="Expansion up to SF"
                      required
                    />
                  </div>
                </CCol>
                <CCol md="3">
                  <div class="mt-2">
                    <CDatePicker label="Year Built" v-model:date="building.year_built" locale="en-US" size="sm" selectionType="year" />
                  </div>
                </CCol>
                <CCol md="3">
                  <div class="mt-2">
                    <CFormSelect
                      label="Status"
                      v-model="building.status"
                      :options="statuses.items"
                      size="sm"
                      required
                    />
                  </div>
                </CCol>
                <div class="col-md-3">
                  <div class="mt-2">
                    <label class="form-label">SF/SM</label>
                    <CFormSwitch
                      size="lg"
                      v-model="building.sfSm"
                    />
                  </div>
                </div>
              </CRow>
            </CCardBody>
          </CCard>
          
          <!-- *** LOCATION *** -->
          <CCard id="location" class="card text-secondary mb-3 mt-4 border-secondary card-header-customer-buildings " >
            <CCardBody class="card-body-customer-buildings">
              Location
            </CCardBody>
          </CCard>
          <div class="col-md-4">
            <!-- REGION -->
            <div class="mt-2">
              <CFormSelect
                label="Region"
                v-model="building.region_id"
                :options="regions.items"
                size="sm"
                required
              />
            </div>
          </div>
          <div class="col-md-4">
            <!-- MARKET -->
            <div class="mt-2">
              <CFormSelect
                label="Market"
                v-model="building.market_id"
                :options="markets.items"
                size="sm"
                required
                :disabled="!building.region_id"
              />
            </div>
          </div>
          <div class="col-md-4">
            <!-- SUB MARKET -->
            <div class="mt-2">
              <CFormSelect
                label="Submarket"
                v-model="building.submarket_id"
                :options="submarkets.items"
                size="sm"
                required
                :disabled="!building.market_id"
              />
            </div>
          </div>
          <div class="col-md-4">
            <!-- INDUSTRIAL PARK -->
            <div class="mt-2">
              <MSelect
                label="Industrial Park"
                :options="industrialParks.items"
                v-model="building.industrial_park_id"
                @submitOption="value => createOptionGeneral('industrial_park_id', value)"
                @editOption="value => editOptionGeneral('industrial_park_id', value)"
                @deleteOption="() => fetchIndustrialParks(building.market_id, building.submarket_id)"
                create-option
                size="sm"
                :disabled="!building.submarket_id"
                required
                isIndustrialParkForm
                :marketId="building.market_id"
                :submarketId="building.submarket_id"
              />
            </div>
          </div>
          <div class="col-md-4">
            <!-- LATITUD -->
            <div class="mt-2">
              <CFormInput
              type="text"
              size="sm"
              label="Latitude"
              v-model="building.latitud"
              required
              />
            </div>
          </div>
          <div class="col-md-4">
            <!-- ALTITUD -->
            <div class="mt-2">
              <CFormInput
              type="text"
              size="sm"
              label="Longitude"
              v-model="building.longitud"
              required
              />
            </div>
          </div>
          
          <!-- *** PROPERTY DETAILS *** -->
          <CCard id="property-details" class="card text-secondary mb-3 mt-4 border-secondary card-header-customer-buildings " >
            <CCardBody class="card-body-customer-buildings">
              Property Details
            </CCardBody>
          </CCard>
          <CCard class="card-customer-buildings">
            <CCardBody>
              <CRow>
                <CCol md>
                  <!-- OWNER -->
                  <div class="mt-2">
                    <MSelect
                      label="Owner"
                      :options="owners.items" 
                      v-model="building.owner_id"
                      @submitOption="value => createOptionGeneral('owner_id', value)"
                      @editOption="value => editOptionGeneral('owner_id', value)"
                      @deleteOption="fetchDevelopers"
                      create-option
                      size="sm"
                      required
                      isDevForm
                      modalTitle="Create Owner"
                      :disabled="!building.submarket_id"
                    />
                  </div>
                </CCol>
                <CCol md>
                  <!-- DEVELOPER -->
                  <div class="mt-2">
                    <MSelect
                      label="Developer"
                      :options="developers.items" 
                      v-model="building.developer_id"
                      @submitOption="value => createOptionGeneral('developer_id', value)"
                      @editOption="value => editOptionGeneral('developer_id', value)"
                      @deleteOption="fetchDevelopers"
                      create-option
                      size="sm"
                      required
                      isDevForm
                      modalTitle="Create Developer"
                      :disabled="!building.submarket_id"
                    />
                  </div>
                </CCol>
                <CCol md>
                  <!-- BUILDER -->
                  <div class="mt-2">
                    <MSelect
                      label="Builder"
                      :options="builders.items" 
                      v-model="building.builder_id"
                      @submitOption="value => createOptionGeneral('builder_id', value)"
                      @editOption="value => editOptionGeneral('builder_id', value)"
                      @deleteOption="fetchDevelopers"
                      create-option
                      size="sm"
                      required
                      isDevForm
                      modalTitle="Create Builder"
                      :disabled="!building.submarket_id"
                    />
                  </div>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
  
          <!-- *** TRANSACTIONS AND AGREEMENTS *** -->
          <CCard id="transactions-agreements" class="card text-secondary mb-3 mt-4 border-secondary card-header-customer-buildings " >
            <CCardBody class="card-body-customer-buildings">
              Transactions and Agreements
            </CCardBody>
          </CCard>

          <CCol md="4">
            <!-- CURRENCY -->
            <div class="mt-2">
              <CFormSelect
                label="Currency"
                v-model="building.currency"
                :options="currencies.items"
                size="sm"
                required
              />
            </div>
          </CCol>
          <CCol md="4">
            <!-- TENANCY -->
            <div class="mt-2">
              <CFormSelect
                label="Tenancy"
                v-model="building.tenancy"
                :options="tenancies.items"
                size="sm"
                required
              />
            </div>
          </CCol>
          <CCol md="4">
            <!-- DEAL -->
            <div class="mt-2">
              <CFormSelect
                label="Deal"
                v-model="building.deal"
                :options="deals.items"
                size="sm"
                required
              />
            </div>
          </CCol>
          <!-- *** TECHNICAL SPECIFICATIONS *** -->
          <CCard id="technical-specifications" class="card text-secondary mb-3 mt-4 border-secondary card-header-customer-buildings " >
            <CCardBody class="card-body-customer-buildings">
              Technical Specifications
            </CCardBody>
          </CCard>
          <CCard class="card-customer-buildings">
            <CCardBody>
              <CRow>
                <!-- Primera columna: Dimensiones y características principales -->
                <CCol :md="3">
                  <!-- TYPE -->
                  <div class="mt-2">
                    <CFormSelect
                      label="Type"
                      v-model="building.type_generation"
                      :options="generationsTypes.items"
                      size="sm"
                      required
                    />
                  </div>
                  <!-- HEIGHT -->
                  <div class="mt-2">
                    <CFormInput 
                      type="number" 
                      size="sm"
                      v-model="building.clear_height_ft"
                      label="Clear Height FT"
                      max="99"
                    />
                  </div>
                  <!-- COVERAGE -->
                  <div class="mt-2">
                    <CFormInput 
                      type="number" 
                      size="sm"
                      :value="coverage"
                      label="Coverage % (read only)"
                      readonly
                    />
                    <small class="text-secondary">Building Size (SF) * Total Land (SF)</small>
                  </div>
                  <div class="mt-2">
                    <CFormInput 
                      type="number" 
                      size="sm"
                      v-model="building.offices_space_ft"
                      label="Offices Space SF"
                    />
                  </div>
                  <div class="mt-2">
                    <CFormSelect
                      label="Loading Door"
                      v-model="building.loading_door"
                      :options="loadingDoors.items"
                      size="sm"
                      required
                    />
                  </div>
                  <div class="mt-2">
                    <label class="form-label">Floor Thickness FT</label>
                    <CInputGroup size="sm">
                      <CFormInput
                        type="number"
                        v-model="building.floor_thickness_ft"
                      />
                    </CInputGroup>
                  </div>
                </CCol>

                <!-- Segunda columna: Sistemas y características técnicas -->
                <CCol :md="3">
                  <!-- CONSTRUCTION TYPE -->
                  <div class="mt-2">
                    <CFormSelect
                      label="Construction Type"
                      v-model="building.construction_type"
                      :options="constructionTypes.items"
                      size="sm"
                      required
                    />
                  </div>
                  <!-- CONSTRUCTION STATE -->
                  <div class="mt-2">
                    <CFormInput
                      size="sm"
                      v-model="building.construction_state"
                      label="Construction State"
                    />
                  </div>
                  <!-- ROOF SYSTEM -->
                  <div class="mt-2">
                    <CFormInput
                      size="sm"
                      v-model="building.roof_system"
                      label="Roof System"
                    />
                  </div>
                  <!-- FIRE PROTECTION SYSTEM -->
                  <div class="mt-2">
                    <CFormSelect
                      label="Fire Protection System (FPS)"
                      v-model="building.fire_protection_system"
                      :options="fireProtectionSystems.items"
                      size="sm"
                      required
                    />
                  </div>
                  <div class="mt-2">
                    <label class="form-label">Skylights SF</label>
                    <CInputGroup size="sm">
                      <CFormInput
                        type="number"
                        v-model="building.skylights_sf"
                      />
                      <CInputGroupText>%</CInputGroupText>
                    </CInputGroup>
                  </div>
                  <div class="mt-2">
                    <CFormSelect
                      label="Above Market TIS"
                      v-model="building.above_market_tis"
                      :options="technicalImprovements.items"
                      size="sm"
                      required
                    />
                  </div>
                  <div class="mt-2">
                    <label class="form-label">Floor Resistance</label>
                    <CInputGroup size="sm">
                      <CFormInput
                        type="number"
                        v-model="building.floor_resistance"
                      />
                    </CInputGroup>
                  </div>
                </CCol>

                <!-- Tercera columna: Sistemas eléctricos y ambientales -->
                <CCol :md="3">
                  <!-- LIGHTING -->
                  <div class="mt-2">
                    <CFormSelect
                      label="Lighting"
                      v-model="building.lightning"
                      :options="typesLightnings.items"
                      size="sm"
                      required
                    />
                  </div>
                  <!-- VENTILATION -->
                  <div class="mt-2">
                    <label class="form-label">Ventilation System</label>
                    <CInputGroup size="sm">
                      <CFormInput
                        type="number"
                        v-model="building.ventilation"
                      />
                      <CInputGroupText>CH/PH</CInputGroupText>
                    </CInputGroup>
                  </div>
                  <div class="mt-2">
                    <CFormInput
                      type="text"
                      size="sm"
                      v-model="building.kvas"
                      label="KVAS"
                    />
                  </div>
                  <!-- bay_size -->
                  <div class="mt-2">
                    <label class="form-label">Bay Size</label>
                    <CInputGroup size="sm">
                      <CFormInput 
                        type="number" 
                        v-model="building.bay_size_value_1"
                        placeholder="value 1"
                      />
                      <CInputGroupText>@</CInputGroupText>
                      <CFormInput 
                        type="number"
                        v-model="building.bay_size_value_2"
                        placeholder="value 2"
                      />
                    </CInputGroup>
                  </div>
                  <!-- TRANSFORMER CAPACITY -->
                  <div class="mt-2">
                    <label class="form-label">Transformer Capacity</label>
                    <CInputGroup size="sm">
                      <CFormInput 
                        type="number" 
                        v-model="building.transformer_capacity_value_1"
                        placeholder="value 1"
                      />
                      <CInputGroupText>@</CInputGroupText>
                      <CFormInput 
                        type="number"
                        v-model="building.transformer_capacity_value_2"
                        placeholder="value 2"
                      />
                    </CInputGroup>
                  </div>
                  <!-- HVAC PRODUCTION AREA -->
                  <div class="mt-2">
                    <label class="form-label">HVAC Production Area (TON)</label>
                    <CInputGroup size="sm">
                      <CFormInput 
                        type="number" 
                        v-model="building.hvacProduction"
                        placeholder="Production"
                        @blur="validateHvacRange"
                      />
                      <CInputGroupText>@</CInputGroupText>
                      <CFormInput 
                        type="number"
                        v-model="building.hvacArea"
                        placeholder="Area"
                        @blur="validateHvacRange"
                      />
                    </CInputGroup>
                  </div>

                  <div class="mt-2">
                    <label class="form-label">Column Spacing FT</label>
                    <CInputGroup size="sm">
                      <CFormInput 
                        type="number" 
                        v-model="building.columns_spacing_value_1"
                        placeholder="value 1"
                      />
                      <CInputGroupText>@</CInputGroupText>
                      <CFormInput 
                        type="number"
                        v-model="building.columns_spacing_value_2"
                        placeholder="value 2"
                      />
                    </CInputGroup>
                  </div>
                </CCol>

                <!-- Cuarta columna: Switches de características -->
                <CCol :md="3">
                  <div class="switches-container">
                    <!-- CRANE -->
                    <div class="switch-item">
                      <label class="switch-label">Crane</label>
                      <CFormSwitch 
                        size="lg"
                        v-model="building.has_crane"
                      />
                    </div>
                    <!-- LEED -->
                    <div class="switch-item">
                      <label class="switch-label">LEED</label>
                      <CFormSwitch 
                        size="lg"
                        v-model="building.has_leed"
                      />
                    </div>
                    <!-- RAIL SPUR -->
                    <div class="switch-item">
                      <label class="switch-label">Rail Spur</label>
                      <CFormSwitch 
                        size="lg"
                        v-model="building.has_rail_spur"
                      />
                    </div>
                  </div>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CRow>
      </CCol>
    </CRow>
  </form>
</template>

<style scoped>
.switches-container {
  display: flex;
  flex-direction: column;
  gap: .1rem;
  padding: 0.5rem;
}

.switch-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0.25rem 0;
}

.switch-label {
  margin: 0;
  min-width: 100px; /* Asegura un ancho mínimo para las etiquetas */
}

/* Ajuste para los switches */
:deep(.form-switch) {
  padding-left: 2.5em;
  margin-right: 0.5rem;
}
</style>