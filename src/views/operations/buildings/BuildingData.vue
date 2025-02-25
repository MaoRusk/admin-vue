<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue';
import Swal from 'sweetalert2';
import { AxiosError } from 'axios';
import { useRoute, useRouter } from 'vue-router';

import { API } from '../../../services';
import { ROUTE_NAMES } from '../../../router/routeNames';
import MASelect from '../../../components/MASelect.vue';

const router = useRouter()
const route = useRoute()

watch(
  () => route.params.id,
  () => {
    fetchBuildingData()
  }
)


const props = defineProps({
  buildingId: Number
})

const emit = defineEmits(['submitting'])

const buildingEmpty = {
  region_id: '',
  market_id: '',
  sub_market_id: '',
  industrial_park_id: '',
  builder_id: '',
  developer_id: '',
  owner_id: '',
  building_name: '',
  building_size_sf: '',
  latitud: '',
  longitud: '',
  year_built: '',
  clear_height_ft: '',
  total_land_sf: '',
  offices_space_sf: '',
  has_crane: false,
  has_rail_spur: false,
  has_leed: false,
  ventilation: '',
  roof_system: '',
  skylights_sf: '',
  coverage: '',
  expansion_land: '',
  class: '',
  type_generation: '',
  currency: '',
  tenancy: '',
  construction_type: '',
  lightning: '',
  fire_protection_system: [],
  deal: '',
  loading_door: '',
  above_market_tis: [],
  status: 'Active',
  floor_thickness_in: '',
  floor_resistance: '',
  expansion_up_to_sf: '',

  hvacProduction: '',
  hvacArea: '',

  kvas_value_1: '',
  kvas_value_2: '',

  columns_spacing_value_1: '',
  columns_spacing_value_2: '',

  bay_size_value_1: '',
  bay_size_value_2: '',

  sfSm: false,
  files_by_type: '',
}

const building = reactive({...buildingEmpty})
const formHtmlElement = ref(null)
const VALUE_SEPARATOR = ' x '

const inputFiles = [
  {category: 'Front Page', type: 'frontpage', label: 'Upload Front Page File', multiple: false},
  {category: 'Aerial', type: 'aerial', label: 'Upload Aerial File', multiple: false},
  {category: '360', type: '360', label: 'Upload 360 File', multiple: false},
  {category: 'Layout', type: 'layout', label: 'Upload Layout File', multiple: false},
  {category: 'Gallery', type: 'gallery1', label: 'Upload Gallery Files', multiple: true},
]

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
}

const validateRangeHvac = () => {
  validateRangeInputs(building, 'hvacProduction', 'hvacArea', 'HVAC Production Area (TON)');
}
const validateRangeBaySize = () => {
  validateRangeInputs(building, 'bay_size_value_1', 'bay_size_value_2', 'Bay size');
}
const validateRangeColumnsSpacing = () => {
  validateRangeInputs(building, 'columns_spacing_value_1', 'columns_spacing_value_2', 'Column Spacing FT');
}
const validateRangeKvas = () => {
  validateRangeInputs(building, 'kvas_value_1', 'kvas_value_2', 'KVAS');
}

const coverage = computed(() => building.building_size_sf && building.total_land_sf ? ((+building.building_size_sf / +building.total_land_sf) * 100).toFixed(2) : '')


async function onSubmit() {
  emit('submitting', true);
  try {
    let data;
    const formData = new FormData();

    if (building.files && Object.keys(building.files).length) {
      Object.keys(building.files).forEach(filePrefix => {
        if (Array.isArray(building.files[filePrefix])) {
          building.files[filePrefix].forEach(file => {
            formData.append("files[]", file);
          });
        } else {
          console.warn(`Files for prefix "${filePrefix}" not found or dont have array type.`);
        }
      });
    }

    const body = {
      ...building,
      hvac_production_area: (building.hvacProduction && building.hvacArea) ? `${building.hvacProduction}${VALUE_SEPARATOR}${building.hvacArea}` : '',
      columns_spacing_ft: (building.columns_spacing_value_1 && building.columns_spacing_value_2) ? `${building.columns_spacing_value_1}${VALUE_SEPARATOR}${building.columns_spacing_value_2}` : '',
      bay_size: (building.bay_size_value_1 && building.bay_size_value_2) ? `${building.bay_size_value_1}${VALUE_SEPARATOR}${building.bay_size_value_2}` : '',
      kvas: (building.kvas_value_1 && building.kvas_value_2) ? `${building.kvas_value_1}${VALUE_SEPARATOR}${building.kvas_value_2}` : '',
      coverage: `${coverage.value}`,
      fire_protection_system: Array.isArray(building.fire_protection_system) ? building.fire_protection_system : [],
      above_market_tis: Array.isArray(building.above_market_tis) ? building.above_market_tis : [],
    };

    Object.keys(body).forEach((key) => {
      let value = body[key];

      if (typeof value === "boolean") {
        value = value ? 1 : 0;
      } else if (value === "true") {
        value = 1;
      } else if (value === "false") {
        value = 0;
      }

      if (Array.isArray(value)) {
        value.forEach(item => formData.append(`${key}[]`, item));
      } else if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });

    if (props.buildingId) {
      ({ data } = await API.buildings.updateBuilding(props.buildingId, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      }));
    } else {
      ({ data } = await API.buildings.createBuilding(formData, {
        headers: { "Content-Type": "multipart/form-data" }
      }));
    }

    emit('submitting', false);
    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: data.message,
    });

    router.push({ name: ROUTE_NAMES.BUILDINGS, params: { buildingId: data.data.id } });

  } catch (e) {
    emit('submitting', false);
    console.error(e);
    console.error("❌ Error sending:", e.response?.data || e);
    Swal.fire(e.response?.data?.message || "Error", JSON.stringify(e.response?.data?.errors) || "Unknown error", 'error');
  }
}

const fetchBuildingData = async () => {
  try {
    const buildingId = props.buildingId;
    const { data } = await API.buildings.getBuilding(buildingId);
    ['region_id', 'market_id', 'sub_market_id', 'industrial_park_id', 'builder_id', 'developer_id', 'owner_id']
    .forEach(prop => building[prop] = data.data[prop] ? +(data.data[prop]) : '');
    ['building_name', 'building_size_sf', 'latitud', 'longitud', 'clear_height_ft', 'total_land_sf', 'expansion_up_to_sf', 'offices_space_sf', 'ventilation', 'roof_system', 'skylights_sf', 'coverage', 'kvas', 'expansion_land', 'class', 'type_generation', 'currency', 'tenancy', 'construction_type', 'lightning', 'deal', 'loading_door', 'status', 'floor_thickness_in', 'floor_resistance']
    .forEach(prop => building[prop] = data.data[prop] ? `${data.data[prop]}` : '');
    ['has_crane', 'has_rail_spur', 'has_leed']
    .forEach(prop => building[prop] = Boolean(data.data[prop]));
    ['fire_protection_system', 'above_market_tis', 'files_by_type']
    .forEach(prop => building[prop] = data.data[prop] ? data.data[prop] : []);

    building.year_built = data.data.year_built ? `${data.data.year_built}` : ''
    if (data.data.hvac_production_area && data.data.hvac_production_area.length > VALUE_SEPARATOR.length) {
      ([building.hvacProduction, building.hvacArea] = data.data.hvac_production_area.split(VALUE_SEPARATOR))
    }
    if (data.data.columns_spacing_ft && data.data.columns_spacing_ft.length > VALUE_SEPARATOR.length) {
      ([building.columns_spacing_value_1, building.columns_spacing_value_2] = data.data.columns_spacing_ft.split(VALUE_SEPARATOR))
    }
    if (data.data.bay_size && data.data.bay_size.length > VALUE_SEPARATOR.length) {
      ([building.bay_size_value_1, building.bay_size_value_2] = data.data.bay_size.split(VALUE_SEPARATOR))
    }
    if (data.data.kvas && data.data.kvas.length > VALUE_SEPARATOR.length) {
      ([building.kvas_value_1, building.kvas_value_2] = data.data.kvas.split(VALUE_SEPARATOR))
    }
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

const allowedTypes = ['image/jpeg', 'image/jpeg', 'image/png', 'application/pdf', 'application/vnd.google-earth.kmz'];
const handleFiles = (filePrefix, event) => {
  if (!event || !event.target || !event.target.files) {
    console.error("Error: Failed to get files from event.");
    return;
  }

  const files = Array.from(event.target.files);

  if (files.length === 0) {
    console.log("No files selected.");
    return;
  }

  const invalidFiles = files.filter(file => !allowedTypes.includes(file.type));

  if (invalidFiles.length > 0) {
    console.error("Invalid files:", invalidFiles);
    return;
  }

  const updatedFiles = files.map(file => {
    const randomNumber = Math.floor(Math.random() * 1000);
    const newFileName = `${filePrefix}${randomNumber}_${file.name}`;

    return new File([file], newFileName, { type: file.type });
  });

  if (!building) {
    console.error("Error: building object not initialized.");
    return;
  }

  if (!building.files) {
    building.files = {};
  }

  if (!building.files[filePrefix]) {
    building.files[filePrefix] = [];
  }

  building.files[filePrefix] = [
    ...building.files[filePrefix],
    ...updatedFiles
  ];

  console.log("Updated files:", building.files);
};

async function fetchBuildingStatuses() {
  statuses.loading = true
  const { data } = await API.buildings.getBuildingsStatus()
  statuses.loading = false
  statuses.items = Object.values(data.data).map(value => ({ value, label: value }))
}

async function fetchBuildingTechnicalImprovements() {
  technicalImprovements.loading = true
  const { data } = await API.buildings.getBuildingsTechnicalImprovements();
  technicalImprovements.loading = false
  technicalImprovements.items = Object.values(data.data).map(value => ({ value, label: value }))
}

async function fetchBuildingLoadingDoors() {
  loadingDoors.loading = true
  const { data } = await API.buildings.getBuildingsLoadingDoors();
  loadingDoors.loading = false
  loadingDoors.items = Object.values(data.data).map(value => ({ value, label: value }))
}

async function fetchBuildingTypesLightnings() {
  typesLightnings.loading = true
  const { data } = await API.buildings.getBuildingsTypesLightnings();
  typesLightnings.loading = false
  typesLightnings.items = Object.values(data.data).map(value => ({ value, label: value }))
}

async function fetchBuildingTypeGenerations() {
  generationsTypes.loading = true
  const { data } = await API.buildings.getBuildingsTypesGeneration();
  generationsTypes.loading = false
  generationsTypes.items = Object.values(data.data).map(value => ({ value, label: value }))
}

async function fetchTenancies() {
  tenancies.loading = true
  const { data } = await API.buildings.getBuildingsTenancies();
  tenancies.loading = false
  tenancies.items = Object.values(data.data).map(value => ({ value, label: value }))
}

async function fetchCurrencies() {
  currencies.loading = true
  const { data } = await API.currencies.getCurrencies();
  currencies.loading = false
  currencies.items = Object.values(data.data).map(value => ({ value, label: value }))
}

async function fetchBuildingContructionTypes() {
  constructionTypes.loading = true
  const { data } = await API.buildings.getBuildingsTypesConstruction();
  constructionTypes.loading = false
  constructionTypes.items = Object.values(data.data).map(value => ({ value, label: value }))
}

async function fetchBuildingDeals() {
  deals.loading = true
  const { data } = await API.buildings.getBuildingsTypesDeals();
  deals.loading = false
  deals.items = Object.values(data.data).map(value => ({ value, label: value }))
}

async function fetchDevelopers(marketId, submarketId) {
  developers.loading = true
  const data = await API.developers.getDevelopers({ is_developer: true, marketId, submarketId });
  developers.loading = false
  developers.items = data.sort((a, b) => a.name.localeCompare(b.name))
}

async function fetchBuilders(marketId, submarketId) {
  builders.loading = true
  const data = await API.developers.getDevelopers({ is_builder: true, marketId, submarketId });
  builders.loading = false
  builders.items = data.sort((a, b) => a.name.localeCompare(b.name))
}

async function fetchOwners(marketId, submarketId) {
  owners.loading = true
  const data = await API.developers.getDevelopers({ is_owner: true, marketId, submarketId });
  owners.loading = false
  owners.items = data.sort((a, b) => a.name.localeCompare(b.name))
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
  submarkets.items = data.data.map(({ id, name }) => ({ label: name, value: id })).sort((a, b) => a.label.localeCompare(b.label))
}

async function fetchMarkets(regionId) {
  markets.loading = true
  const { data } = await API.markets.getMarkets({ regionId });
  markets.loading = false
  markets.items = data.data.map(({ id, name }) => ({ label: name, value: id })).sort((a, b) => a.label.localeCompare(b.label))
}

async function fetchClasses() {
  classes.loading = true
  const { data } = await API.buildings.getBuildingsClasses();
  classes.loading = false
  classes.items = Object.values(data.data).map(value => ({ value, label: value }))
}

async function fetchFireProtectionSystems() {
  fireProtectionSystems.loading = true
  const { data } = await API.buildings.getBuildingsFireProtectionSystems();
  fireProtectionSystems.loading = false
  fireProtectionSystems.items = Object.values(data.data).map(value => ({ value, label: value }))
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
  if (props.buildingId) {
    await fetchBuildingData();
  }
  Swal.close()
});

async function saveOptionGeneral(field, values, update = false) {
  try {
    let data;
    if (['owner_id', 'builder_id', 'developer_id'].includes(field)) {
      const body = {
        name: values.name,
        is_builder: !!values.is_builder,
        is_developer: !!values.is_developer,
        is_owner: !!values.is_owner,
        market_id: building.market_id,
        sub_market_id: building.sub_market_id
      }
      if (update) {
        ({ data } = await API.developers.updateDeveloper(values.id, body));

        if (building.owner_id === data.data.id && data.data.is_owner === false) building.owner_id = ''
        if (building.developer_id === data.data.id && data.data.is_developer === false) building.developer_id = ''
        if (building.builder_id === data.data.id && data.data.is_builder === false) building.builder_id = ''
      } else {
        ({ data } = await API.developers.createDeveloper(body));
        building[field] = data.data.id
      }
      await Promise.all([
        fetchOwners(building.market_id, building.sub_market_id),
        fetchDevelopers(building.market_id, building.sub_market_id),
        fetchBuilders(building.market_id, building.sub_market_id),
      ])
    } else if (field === 'industrial_park_id') {
      const body = {
        name: values.name,
        market_id: building.market_id,
        sub_market_id: building.sub_market_id
      }
      if (update) {
        ({ data } = await API.industrialparks.updateIndustrialPark(values.id, body))
      } else {
        ({ data } = await API.industrialparks.createIndustrialPark(body))
        building[field] = data.data.id
      }
      await fetchIndustrialParks(building.market_id, building.sub_market_id)
    }
  } catch (error) {
    console.error('Error:', error);
    if (error instanceof AxiosError) {
      const errorMessage = error.response?.data?.errors
        ? Object.values(error.response.data.errors).flat().join('\n')
        : error.response?.data?.message || 'An error occurred';
      Swal.fire({
        icon: "error",
        title: update ? "Error updating" : "Error creating",
        text: errorMessage,
      });
    } else {
      throw error
    }
  }
  Swal.fire({
    icon: "success",
    title: "Saved successfully",
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

async function deleteOptionGeneral(field, optionReactive) {
  const option = {...optionReactive}
  const result = await Swal.fire({
    title: `Delete option`,
    text: `Are you sure you want to delete?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel'
  })

  if (!result.isConfirmed) return

  try {
    let data;
    if (['owner_id', 'builder_id', 'developer_id'].includes(field)) {
      ({ data } = await API.developers.deleteDeveloper(option.id));
      await fetchDevelopers();
    } else if (field === 'industrial_park_id') {
      ({ data } = await API.industrialparks.deleteIndustrialPark(option.id))
      await fetchIndustrialParks(building.market_id, building.sub_market_id)
    }
    console.info(data)
    if (building[field] === option.id) {
      building[field] = ''
    }
  } catch (error) {
    console.error('Error with developer:', error);
    if (error instanceof AxiosError) {
      const errorMessage = error.response?.data?.errors
        ? Object.values(error.response.data.errors).flat().join('\n')
        : error.response?.data?.message || 'An error occurred';
      Swal.fire({
        icon: "error",
        title: "Error deleting",
        text: errorMessage,
      });
    } else {
      throw error
    }
    return
  }
  Swal.fire({
    icon: "success",
    title: "Deleted successfully",
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

watch(() => building.region_id, async () => {
  if (building.region_id) {
    await fetchMarkets(building.region_id)
    if (!markets.items.find(item => item.value === building.market_id)) {
      building.market_id = ''
    }
  } else {
    building.market_id = ''
  }
})

watch(() => building.market_id, async () => {
  if (building.market_id) {
    await fetchSubmarkets(building.market_id)
    if (!submarkets.items.find(item => item.value === building.sub_market_id)) {
      building.su_bmarket_id = ''
    }
  } else {
    building.sub_market_id = ''
  }
})

watch(() => building.sub_market_id, async () => {
  if (building.sub_market_id) {
    await Promise.all([
      fetchIndustrialParks(building.market_id, building.sub_market_id),
      fetchOwners(building.market_id, building.sub_market_id),
      fetchBuilders(building.market_id, building.sub_market_id),
      fetchDevelopers(building.market_id, building.sub_market_id),
    ])
    if (!industrialParks.items.find(item => item.id === building.industrial_park_id)) building.industrial_park_id = ''
    if (!owners.items.find(item => item.id === building.owner_id)) building.owner_id = ''
    if (!developers.items.find(item => item.id === building.developer_id)) building.developer_id = ''
    if (!builders.items.find(item => item.id === building.builder_id)) building.builder_id = ''
  } else {
    building.industrial_park_id = ''
    building.owner_id = ''
    building.builder_id = ''
    building.developer_id = ''
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
                      v-model="building.building_name"
                      label="Building Name *"
                      required
                    />
                  </div>
                </CCol>
                <CCol :md="3">
                  <div class="mt-2">
                    <label class="form-label">Class *</label>
                    <MASelect
                      v-model="building.class"
                      :options="classes.items"
                      :reduce="option => option.value"
                      label="label"
                      required
                      placeholder="Select..."
                      :loading="classes.loading"
                    />
                  </div>
                </CCol>
                <CCol :md="3">
                  <div class="mt-2">
                    <CFormInput
                      type="number"
                      v-model="building.building_size_sf"
                      label="Building Size (SF) *"
                      required
                    />
                  </div>
                </CCol>
                <CCol md="3">
                  <div class="mt-2">
                    <CFormInput
                      type="number"
                      v-model="building.expansion_land"
                      label="Expansion Land (SF) *"
                      required
                    />
                  </div>
                </CCol>
                <!-- TOTAL LAND -->
                <div class="col-md-3">
                  <div class="mt-2">
                    <CFormInput
                      type="number"
                      v-model="building.total_land_sf"
                      label="Total Land (SF)"
                    />
                  </div>
                </div>
                <CCol md="3">
                  <div class="mt-2">
                    <CFormInput
                      type="number"
                      v-model="building.expansion_up_to_sf"
                      label="Expansion up to SF *"
                      required
                    />
                  </div>
                </CCol>
                <CCol md="3">
                  <div class="mt-2">
                    <CDatePicker label="Year Built" v-model:date="building.year_built" locale="en-US" selectionType="year" />
                  </div>
                </CCol>
                <CCol md="3">
                  <div class="mt-2">
                    <label class="form-label">Status *</label>
                    <MASelect
                      v-model="building.status"
                      :options="statuses.items"
                      :reduce="option => option.value"
                      label="label"
                      required
                      placeholder="Select..."
                      :loading="statuses.loading"
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
              <label class="form-label">Region *</label>
              <MASelect
                v-model="building.region_id"
                :options="regions.items"
                :reduce="option => option.value"
                label="label"
                required
                placeholder="Select..."
                :loading="regions.loading"
              />
            </div>
          </div>
          <div class="col-md-4">
            <!-- MARKET -->
            <div class="mt-2">
              <label class="form-label">Market *</label>
              <MASelect
                v-model="building.market_id"
                :options="markets.items"
                :reduce="option => option.value"
                label="label"
                placeholder="Select..."
                :loading="markets.loading"
                :disabled="!building.region_id"
                required
              />
            </div>
          </div>
          <div class="col-md-4">
            <!-- SUB MARKET -->
            <div class="mt-2">
              <label class="form-label">Submarket *</label>
              <MASelect
                v-model="building.sub_market_id"
                :options="submarkets.items"
                :reduce="option => option.value"
                label="label"
                placeholder="Select..."
                :loading="submarkets.loading"
                :disabled="!building.market_id"
                required
              />
            </div>
          </div>
          <div class="col-md-4">
            <!-- INDUSTRIAL PARK -->
            <div class="mt-2">
              <label class="form-label">Industrial Park *</label>
              <MASelect
                v-model="building.industrial_park_id"
                :options="industrialParks.items"
                :reduce="option => option.id"
                label="name"
                placeholder="Select..."
                :loading="industrialParks.loading"
                :disabled="!building.sub_market_id"
                required
                edit-options
                @submitOption="(option, update) => { saveOptionGeneral('industrial_park_id', option, update) }"
                @deleteOption="(option) => { deleteOptionGeneral('industrial_park_id', option) }"
              />
            </div>
          </div>
          <div class="col-md-4">
            <!-- LATITUD -->
            <div class="mt-2">
              <CFormInput
              type="text"
              label="Latitude *"
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
              label="Longitude *"
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
                    <label class="form-label">Owner *</label>
                    <MASelect
                      v-model="building.owner_id"
                      :options="owners.items"
                      :reduce="option => option.id"
                      label="name"
                      placeholder="Select..."
                      :loading="owners.loading"
                      :disabled="!building.sub_market_id"
                      required
                      edit-options
                      @submitOption="(option, update) => { saveOptionGeneral('owner_id', option, update) }"
                      @deleteOption="(option) => { deleteOptionGeneral('owner_id', option) }"
                    >
                      <template #form-modal="{ form, isEditing }">
                        <div class="row">
                          <div class="col">
                            <CFormInput
                              v-model="form.name"
                              label="Name *"
                              type="text"
                              placeholder="write a value"
                              required
                            />
                          </div>
                        </div>
                        <div v-if="!isEditing" class="d-none">
                          <!-- checked por defecto is owner -->
                          {{  form.is_owner = true }}
                        </div>
                        <div class="row mt-3">
                          <div class="col">
                            <CFormCheck
                              v-model="form.is_owner"
                              label="Is Owner"
                              :disabled="!isEditing"
                            />
                            <CFormCheck
                              v-model="form.is_developer"
                              label="Is Developer"
                            />
                            <CFormCheck
                              v-model="form.is_builder"
                              label="Is Builder"
                            />
                          </div>
                        </div>
                      </template>
                    </MASelect>
                  </div>
                </CCol>
                <CCol md>
                  <!-- DEVELOPER -->
                  <div class="mt-2">
                    <label class="form-label">Developer *</label>
                    <MASelect
                      v-model="building.developer_id"
                      :options="developers.items"
                      :reduce="option => option.id"
                      label="name"
                      placeholder="Select..."
                      :loading="developers.loading"
                      :disabled="!building.sub_market_id"
                      required
                      edit-options
                      @submitOption="(option, update) => { saveOptionGeneral('developer_id', option, update) }"
                      @deleteOption="(option) => { deleteOptionGeneral('developer_id', option) }"
                    >
                      <template #form-modal="{ form, isEditing }">
                        <div class="row">
                          <div class="col">
                            <CFormInput
                              v-model="form.name"
                              label="Name *"
                              type="text"
                              placeholder="write a value"
                              required
                            />
                          </div>
                        </div>
                        <div v-if="!isEditing" class="d-none">
                          <!-- checked por defecto is developer -->
                          {{  form.is_developer = true }}
                        </div>
                        <div class="row mt-3">
                          <div class="col">
                            <CFormCheck
                              v-model="form.is_owner"
                              label="Is Owner"
                            />
                            <CFormCheck
                              v-model="form.is_developer"
                              label="Is Developer"
                              :disabled="!isEditing"
                            />
                            <CFormCheck
                              v-model="form.is_builder"
                              label="Is Builder"
                            />
                          </div>
                        </div>
                      </template>
                    </MASelect>
                  </div>
                </CCol>
                <CCol md>
                  <!-- BUILDER -->
                  <div class="mt-2">
                    <label class="form-label">Builder *</label>
                    <MASelect
                      v-model="building.builder_id"
                      :options="builders.items"
                      :reduce="option => option.id"
                      label="name"
                      placeholder="Select..."
                      :loading="builders.loading"
                      :disabled="!building.sub_market_id"
                      required
                      edit-options
                      @submitOption="(option, update) => { saveOptionGeneral('builder_id', option, update) }"
                      @deleteOption="(option) => { deleteOptionGeneral('builder_id', option) }"
                    >
                      <template #form-modal="{ form, isEditing }">
                        <div class="row">
                          <div class="col">
                            <CFormInput
                              v-model="form.name"
                              label="Name *"
                              type="text"
                              placeholder="write a value"
                              required
                            />
                          </div>
                        </div>
                        <div v-if="!isEditing" class="d-none">
                          <!-- checked por defecto is builder -->
                          {{  form.is_builder = true }}
                        </div>
                        <div class="row mt-3">
                          <div class="col">
                            <CFormCheck
                              v-model="form.is_owner"
                              label="Is Owner"
                            />
                            <CFormCheck
                              v-model="form.is_developer"
                              label="Is Developer"
                            />
                            <CFormCheck
                              v-model="form.is_builder"
                              label="Is Builder"
                              :disabled="!isEditing"
                            />
                          </div>
                        </div>
                      </template>
                    </MASelect>
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
              <label class="form-label">Currency *</label>
              <MASelect
                v-model="building.currency"
                :options="currencies.items"
                :reduce="option => option.value"
                label="label"
                required
                placeholder="Select..."
                :loading="currencies.loading"
              />
            </div>
          </CCol>
          <CCol md="4">
            <!-- TENANCY -->
            <div class="mt-2">
              <label class="form-label">Tenancy *</label>
              <MASelect
                v-model="building.tenancy"
                :options="tenancies.items"
                :reduce="option => option.value"
                label="label"
                required
                placeholder="Select..."
                :loading="tenancies.loading"
              />
            </div>
          </CCol>
          <CCol md="4">
            <!-- DEAL -->
            <div class="mt-2">
              <label class="form-label">Deal *</label>
              <MASelect
                v-model="building.deal"
                :options="deals.items"
                :reduce="option => option.value"
                label="label"
                required
                placeholder="Select..."
                :loading="deals.loading"
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
                    <label class="form-label">Type *</label>
                    <MASelect
                      v-model="building.type_generation"
                      :options="generationsTypes.items"
                      :reduce="option => option.value"
                      label="label"
                      required
                      placeholder="Select..."
                      :loading="generationsTypes.loading"
                    />
                  </div>
                  <!-- HEIGHT -->
                  <div class="mt-2">
                    <CFormInput
                      type="number"
                      v-model="building.clear_height_ft"
                      label="Clear Height FT"
                      max="99"
                    />
                  </div>
                  <!-- COVERAGE -->
                  <div class="mt-2">
                    <CFormInput
                      type="number"
                      :value="coverage"
                      label="Coverage (read only)"
                      readonly
                    />
                  </div>
                  <div class="mt-2">
                    <CFormInput
                      type="number"
                      v-model="building.offices_space_sf"
                      label="Offices Space SF"
                    />
                  </div>
                  <div class="mt-2">
                    <label class="form-label">Loading Door *</label>
                    <MASelect
                      v-model="building.loading_door"
                      :options="loadingDoors.items"
                      :reduce="option => option.value"
                      label="label"
                      required
                      placeholder="Select..."
                      :loading="loadingDoors.loading"
                    />
                  </div>
                  <div class="mt-2">
                    <label class="form-label">Floor Thickness FT *</label>
                    <CInputGroup>
                      <CFormInput
                        type="number"
                        v-model="building.floor_thickness_in"
                        required
                      />
                    </CInputGroup>
                  </div>
                </CCol>

                <!-- Segunda columna: Sistemas y características técnicas -->
                <CCol :md="3">
                  <!-- CONSTRUCTION TYPE -->
                  <div class="mt-2">
                    <label class="form-label">Construction Type *</label>
                    <MASelect
                      v-model="building.construction_type"
                      :options="constructionTypes.items"
                      :reduce="option => option.value"
                      label="label"
                      required
                      placeholder="Select..."
                      :loading="constructionTypes.loading"
                    />
                  </div>
                  <!-- ROOF SYSTEM -->
                  <div class="mt-2">
                    <CFormInput
                      v-model="building.roof_system"
                      label="Roof System"
                    />
                  </div>
                  <!-- FIRE PROTECTION SYSTEM -->
                  <div class="mt-2">
                    <label class="form-label">Fire Protection System (FPS) *</label>
                    <MASelect
                      v-model="building.fire_protection_system"
                      :options="fireProtectionSystems.items"
                      :reduce="option => option.value"
                      label="label"
                      required
                      placeholder="Select..."
                      :loading="fireProtectionSystems.loading"
                      multiple
                    />
                  </div>
                  <div class="mt-2">
                    <label class="form-label">Skylights SF</label>
                    <CInputGroup>
                      <CFormInput
                        type="number"
                        v-model="building.skylights_sf"
                      />
                      <CInputGroupText>%</CInputGroupText>
                    </CInputGroup>
                  </div>
                  <div class="mt-2">
                    <label class="form-label">Above Market TIS</label>
                    <MASelect
                      v-model="building.above_market_tis"
                      :options="technicalImprovements.items"
                      :reduce="option => option.value"
                      label="label"
                      placeholder="Select..."
                      :loading="technicalImprovements.loading"
                      multiple
                    />
                  </div>
                  <div class="mt-2">
                    <label class="form-label">Floor Resistance *</label>
                    <CInputGroup>
                      <CFormInput
                        type="text"
                        v-model="building.floor_resistance"
                        required
                      />
                    </CInputGroup>
                  </div>
                </CCol>

                <!-- Tercera columna: Sistemas eléctricos y ambientales -->
                <CCol :md="3">
                  <!-- LIGHTING -->
                  <div class="mt-2">
                    <label class="form-label">Lighting *</label>
                    <MASelect
                      v-model="building.lightning"
                      :options="typesLightnings.items"
                      :reduce="option => option.value"
                      label="label"
                      required
                      placeholder="Select..."
                      :loading="typesLightnings.loading"
                    />
                  </div>
                  <!-- VENTILATION -->
                  <div class="mt-2">
                    <label class="form-label">Ventilation System</label>
                    <CInputGroup>
                      <CFormInput
                        type="number"
                        v-model="building.ventilation"
                      />
                      <CInputGroupText>CH/PH</CInputGroupText>
                    </CInputGroup>
                  </div>
                  <div class="mt-2">
                    <label class="form-label">KVAS</label>
                    <CInputGroup>
                      <CFormInput
                        type="number"
                        v-model="building.kvas_value_1"
                        placeholder="value 1"
                        @blur="validateRangeKvas"
                      />
                      <CInputGroupText>@</CInputGroupText>
                      <CFormInput
                        type="number"
                        v-model="building.kvas_value_2"
                        placeholder="value 2"
                        @blur="validateRangeKvas"
                      />
                    </CInputGroup>
                  </div>
                  <!-- bay_size -->
                  <div class="mt-2">
                    <label class="form-label">Bay Size *</label>
                    <CInputGroup>
                      <CFormInput
                        type="number"
                        v-model="building.bay_size_value_1"
                        placeholder="value 1"
                        required
                        @blur="validateRangeBaySize"
                      />
                      <CInputGroupText>@</CInputGroupText>
                      <CFormInput
                        type="number"
                        v-model="building.bay_size_value_2"
                        placeholder="value 2"
                        required
                        @blur="validateRangeBaySize"
                      />
                    </CInputGroup>
                  </div>
                  <!-- HVAC PRODUCTION AREA -->
                  <div class="mt-2">
                    <label class="form-label">HVAC Production Area (TON)</label>
                    <CInputGroup>
                      <CFormInput
                        type="number"
                        v-model="building.hvacProduction"
                        placeholder="Production"
                        @blur="validateRangeHvac"
                      />
                      <CInputGroupText>@</CInputGroupText>
                      <CFormInput
                        type="number"
                        v-model="building.hvacArea"
                        placeholder="Area"
                        @blur="validateRangeHvac"
                      />
                    </CInputGroup>
                  </div>

                  <div class="mt-2">
                    <label class="form-label">Column Spacing FT *</label>
                    <CInputGroup>
                      <CFormInput
                        type="number"
                        v-model="building.columns_spacing_value_1"
                        placeholder="value 1"
                        required
                        @blur="validateRangeColumnsSpacing"
                      />
                      <CInputGroupText>@</CInputGroupText>
                      <CFormInput
                        type="number"
                        v-model="building.columns_spacing_value_2"
                        placeholder="value 2"
                        required
                        @blur="validateRangeColumnsSpacing"
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

            <!-- *** FILES  *** -->
          <CCard id="files" class="card text-secondary mb-3 mt-4 border-secondary card-header-customer-buildings " >
            <CCardBody class="card-body-customer-buildings">
              Files
            </CCardBody>
          </CCard>
          <CCard class="card-customer-buildings">
            <CCardBody>
              <CRow>
                  <div v-for="iFile in inputFiles" :key="iFile.category" class="col-12">
                    <div class="mt-2">
                      <label class="form-label">{{ iFile.label }}</label>
                      <input type="file" name="files" @change="handleFiles(iFile.type, $event)" :multiple="iFile.multiple" class="form-control" :accept="allowedTypes.join(',')" />
                      <div v-if="building.files_by_type[iFile.category]?.length" class="row gap-2 my-2">
                        <div v-for="(photo) in building.files_by_type[iFile.category]" :key="photo.path">
                          <div class="col-sm-6 col-md-3 col-lg-2">
                            <img :src="photo.path" class="rounded border" style="max-width: 200px; max-height: 50px;" :alt="photo.path" :title="photo.path" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
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

.flex {
  display:flex;
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
