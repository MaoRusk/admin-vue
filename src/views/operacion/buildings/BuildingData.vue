<script setup>
import { onMounted, reactive, ref } from 'vue';
import Swal from 'sweetalert2';
import { API } from '../../../services';

const props = defineProps({
  id: Number
})

const buildingEmpty = {
  region_id: '', // number
  market_id: '', // number
  sub_market_id: '', // number
  builder_id: '', // number
  industrial_park_id: '', // number
  developer_id: '', // number
  owner_id: '', // number
  user_owner_id: '', // number

  building_name: '', // string
  building_size_sf: '', // number
  latitud: '', // string
  longitud: '', // string
  year_built: '', // number
  clear_height: '', // number
  total_land: '', // number
  offices_space: '', // number

  'has_expansion_land': true,
  has_crane: false,
  has_hvac: true,
  has_rail_spur: false,
  has_sprinklers: true,
  has_office: true,
  has_leed: false,

  // 'hvac_production_area': '', // string
  ventilation: '', // string
  transformer_capacity: '', // string
  construction_state: '', // string
  roof_system: '', // string
  skylights_sf: '', // number
  coverage: '', // string
  'kvas': '', // string
  expansion_land: '', // number
  class: '', // string enum
  type_generation: '', // string enum
  currency: '', // string enum
  tenancy: '', // string enum
  construction_type: '', // string enum
  lightning: '', // string enum
  fire_protection_system: '', // string enum
  deal: '', // string enum
  'loading_door': '', // string enum
  'above_market_tis': '', // string enum
  status: '', // string enum

  hvacProduction: '',
  hvacArea: '',

  availableSince: ''
}

const building = reactive(buildingEmpty)

const hvacProductionArea_input = ref(null);
const hvacProductionArea2_input = ref(null);

const validateRangeInputs = (value1, value2, field1Ref, field2Ref, fieldName) => {
  if (value1 && value2 && Number(value1) > Number(value2)) {
    Swal.fire({
      icon: 'warning',
      title: 'Invalid Range',
      text: `The first ${fieldName} value cannot be greater than the second value`,
    });
    
    // Reset the values
    field1Ref.value = null;
    field2Ref.value = null;
    return false;
  }
  return true;
};

const validateHvacRange = () => {
  validateRangeInputs(
    hvacProductionArea_input.value,
    hvacProductionArea2_input.value,
    hvacProductionArea_input,
    hvacProductionArea2_input,
    'HVAC Production Area'
  );
};

// Function to fetch building dat
const fetchBuildingData = async () => {
  try {
    const buildingId = props.id;
    const { data } = await API.buildings.getBuilding(buildingId)
    console.log(data)

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
const userOwners = reactive({ loading: false, items: []})
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
  statuses.items = Object.keys(data.data).map(item => ({ label: data.data[item], value: item }))
}

async function fetchBuildingTechnicalImprovements() {
  technicalImprovements.loading = true
  const { data } = await API.buildings.getBuildingsTechnicalImprovements();
  technicalImprovements.loading = false
  technicalImprovements.items = Object.keys(data.data).map(item => ({ label: data.data[item], value: item }))
}

async function fetchBuildingLoadingDoors() {
  loadingDoors.loading = true
  const { data } = await API.buildings.getBuildingsLoadingDoors();
  loadingDoors.loading = false
  loadingDoors.items = Object.keys(data.data).map(item => ({ label: data.data[item], value: item }))
}

async function fetchBuildingTypesLightnings() {
  typesLightnings.loading = true
  const { data } = await API.buildings.getBuildingsTypesLightnings();
  typesLightnings.loading = false
  typesLightnings.items = Object.keys(data.data).map(item => ({ label: data.data[item], value: item }))
}

async function fetchBuildingTypeGenerations() {
  generationsTypes.loading = true
  const { data } = await API.buildings.getBuildingsTypesGeneration();
  generationsTypes.loading = false
  generationsTypes.items = Object.keys(data.data).map(item => ({ label: data.data[item], value: item }))
}

async function fetchTenancies() {
  tenancies.loading = true
  const { data } = await API.buildings.getBuildingsTenancies();
  tenancies.loading = false
  tenancies.items = Object.keys(data.data).map(item => ({ label: data.data[item], value: item }))
}

async function fetchCurrencies() {
  currencies.loading = true
  const { data } = await API.currencies.getCurrencies();
  currencies.loading = false
  currencies.items = Object.keys(data.data).map(item => ({ label: data.data[item], value: item }))
}

async function fetchBuildingContructionTypes() {
  constructionTypes.loading = true
  const { data } = await API.buildings.getBuildingsTypesConstruction();
  constructionTypes.loading = false
  constructionTypes.items = Object.keys(data.data).map(item => ({ label: data.data[item], value: item }))
}

async function fetchBuildingDeals() {
  deals.loading = true
  const { data } = await API.buildings.getBuildingsTypesDeals();
  deals.loading = false
  deals.items = Object.keys(data.data).map(item => ({ label: data.data[item], value: item }))
}

async function fetchDevelopers() {
  developers.loading = true
  owners.loading = true
  builders.loading = true
  userOwners.loading = true
  const { data } = await API.developers.getDevelopers();
  developers.loading = false
  owners.loading = false
  builders.loading = false
  userOwners.loading = false
  
  const items = data.data.map(({ id, name }) => ({ label: name, value: id })).sort((a, b) => a.label.localeCompare(b.label))

  developers.items = items
  owners.items = items
  builders.items = items
  userOwners.items = items
}

async function fetchIndustrialParks() {
  industrialParks.loading = true
  const { data } = await API.industrialparks.getIndustrialParks();
  industrialParks.loading = false
  industrialParks.items = data.data.map(({ id, name }) => ({ label: name, value: id })).sort((a, b) => a.label.localeCompare(b.label))
}

async function fetchSubmarkets() {
  submarkets.loading = true
  const { data } = await API.submarkets.getSubmarkets();
  submarkets.loading = false
  submarkets.items = data.data.map(({ id, name }) => ({ label: name, value: id })).sort((a, b) => a.label.localeCompare(b.label))
}

async function fetchMarkets() {
  markets.loading = true
  const { data } = await API.markets.getMarkets();
  markets.loading = false
  markets.items = data.data.map(({ id, name }) => ({ label: name, value: id })).sort((a, b) => a.label.localeCompare(b.label))
}

async function fetchClasses() {
  classes.loading = true
  const { data } = await API.buildings.getBuildingsClasses();
  classes.loading = false
  classes.items = Object.keys(data.data).map(item => ({ label: data.data[item], value: item }))
}

async function fetchFireProtectionSystems() {
  fireProtectionSystems.loading = true
  const { data } = await API.buildings.getBuildingsFireProtectionSystems();
  fireProtectionSystems.loading = false
  fireProtectionSystems.items = Object.keys(data.data).map(item => ({ label: data.data[item], value: item }))
}

async function fetchRegions() {
  regions.loading = true
  const { data } = await API.regions.getRegions();
  regions.loading = false
  regions.items = data.data.map(({ id, name }) => ({ label: name, value: id }))
}

onMounted(async () => {
  if (props.id) {
    await fetchBuildingData();
  }
  fetchClasses()
  fetchRegions()
  fetchMarkets()
  fetchSubmarkets()
  fetchIndustrialParks()
  fetchDevelopers()
  fetchFireProtectionSystems()
  fetchBuildingDeals()
  fetchTenancies()

  fetchCurrencies()
  fetchBuildingContructionTypes()
  fetchBuildingTypeGenerations()
  fetchBuildingLoadingDoors()
  fetchBuildingTypesLightnings()
  fetchBuildingTechnicalImprovements()
  fetchBuildingStatuses()
});

const getFormData = () => building

defineExpose({
  getFormData
});
</script>
<template>
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
                    />
                  </div>
                </CCol>
                <CCol :md="3">
                  <div class="mt-2">
                    <CMultiSelect
                      label="Class"
                      :multiple="false"
                      :options="classes.items"
                      optionsStyle="text"
                      size="sm"
                      :loading="classes.loading"
                      @change="([option]) => { building.class = option?.value ?? '' }"
                    />
                  </div>
                </CCol>
                <CCol :md="3">
                  <div class="mt-2">
                    <CFormInput 
                      type="number"
                      size="sm"
                      class="no-spinner"
                      v-model="building.building_size_sf"
                      label="Building Size (SF)"
                    />
                  </div>
                </CCol>
                <CCol :md="3">
                  <div class="mt-2">
                    <CFormInput 
                      type="number"
                      size="sm"
                      class="no-spinner"
                      v-model="building.expansion_land"
                      label="Expansion Land"
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
                    <CDatePicker label="Available Since" locale="en-US" size="sm" selectionType="month" v-model:date="building.availableSince" />
                  </div>
                </CCol>
                <CCol md="3">
                  <div class="mt-2">
                    <CMultiSelect
                      label="Status"
                      :multiple="false"
                      :options="statuses.items"
                      optionsStyle="text"
                      size="sm"
                      :loading="statuses.loading"
                      @change="([option]) => { building.status = option?.value ?? '' }"
                    />
                  </div>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
          
          <!-- *** LOCATION *** -->
          <CCard id="location" class="card text-secondary mb-3 mt-4 border-secondary card-header-customer-buildings " >
            <CCardBody class="card-body-customer-buildings">
              Location
            </CCardBody>
          </CCard>
          <CCol :md="4">
            <!-- REGION -->
            <div class="mt-2">
              <CMultiSelect
                label="Region"
                :multiple="false"
                :options="regions.items"
                optionsStyle="text"
                size="sm"
                :loading="regions.loading"
                @change="([option]) => { building.region_id = option?.value ?? '' }"
              />
            </div>
            <!-- INDUSTRIAL PARK -->
            <div class="mt-2">
              <CMultiSelect
                label="Industrial Park"
                :multiple="false"
                :options="industrialParks.items"
                optionsStyle="text"
                size="sm"
                :loading="industrialParks.loading"
                @change="([option]) => { building.industrial_park_id = option?.value ?? '' }"
              />
            </div>
          </CCol>
          <CCol :md="4">
            <!-- MARKET -->
            <div class="mt-2">
              <CMultiSelect
                label="Market"
                :multiple="false"
                :options="markets.items"
                optionsStyle="text"
                size="sm"
                :loading="markets.loading"
                @change="([option]) => { building.market_id = option?.value ?? '' }"
              />
            </div>
            <!-- SUB MARKET -->
            <div class="mt-2">
              <CMultiSelect
                label="Submarket"
                :multiple="false"
                :options="submarkets.items"
                optionsStyle="text"
                size="sm"
                :loading="submarkets.loading"
                @change="([option]) => { building.sub_market_id = option?.value ?? '' }"
              />
            </div>
          </CCol>
          <CCol :md="4">    
            <!-- LATITUD -->
            <div class="mt-2">
              <CFormInput
              type="text"
              size="sm"
              label="Latitude"
              v-model="building.latitud"
              />
            </div>
            <!-- ALTITUD -->
            <div class="mt-2">
              <CFormInput
              type="text"
              size="sm"
              label="Longitude"
              v-model="building.longitud"
              />
            </div>
          </CCol>
          
          <!-- *** PROPERTY DETAILS *** -->
          <CCard id="property-details" class="card text-secondary mb-3 mt-4 border-secondary card-header-customer-buildings " >
            <CCardBody class="card-body-customer-buildings">
              Property Details
            </CCardBody>
          </CCard>
          <CCard class="card-customer-buildings">
            <CCardBody>
              <CRow>
                <CCol :md="3">
                  <!-- OWNER -->
                  <div class="mt-2">
                    <CMultiSelect
                      label="Owner"
                      :multiple="false"
                      :options="owners.items"
                      optionsStyle="text"
                      size="sm"
                      :loading="owners.loading"
                      @change="([option]) => { building.owner_id = option?.value ?? '' }"
                    />
                  </div>
                </CCol>
                <CCol :md="3">
                  <!-- DEVELOPER -->
                  <div class="mt-2">
                    <CMultiSelect
                      label="Developer"
                      :multiple="false"
                      :options="developers.items"
                      optionsStyle="text"
                      size="sm"
                      :loading="developers.loading"
                      @change="([option]) => { building.developer_id = option?.value ?? '' }"
                    />
                  </div>
                </CCol>
                <CCol :md="3">    
                  <!-- BUILDER -->
                  <div class="mt-2">
                    <CMultiSelect
                      label="Builder"
                      :multiple="false"
                      :options="builders.items"
                      optionsStyle="text"
                      size="sm"
                      :loading="builders.loading"
                      @change="([option]) => { building.builder_id = option?.value ?? '' }"
                    />
                  </div>
                </CCol>
                <CCol :md="3">
                  <div class="mt-2">
                    <CMultiSelect
                      label="User Owner"
                      :multiple="false"
                      :options="userOwners.items"
                      optionsStyle="text"
                      size="sm"
                      :loading="userOwners.loading"
                      @change="([option]) => { building.user_owner_id = option?.value ?? '' }"
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
              <CMultiSelect
                label="Currency"
                :multiple="false"
                :options="currencies.items"
                optionsStyle="text"
                size="sm"
                :loading="currencies.loading"
                @change="([option]) => { building.currency = option?.value ?? '' }"
              />
            </div>
          </CCol>
          <CCol md="4">
            <!-- TENANCY -->
            <div class="mt-2">
              <CMultiSelect
                label="Tenancy"
                :multiple="false"
                :options="tenancies.items"
                optionsStyle="text"
                size="sm"
                :loading="tenancies.loading"
                @change="([option]) => { building.tenancy = option?.value ?? '' }"
              />
            </div>
          </CCol>
          <CCol md="4">
            <!-- DEAL -->
            <div class="mt-2">
              <CMultiSelect
                label="Deal"
                :multiple="false"
                :options="deals.items"
                optionsStyle="text"
                size="sm"
                :loading="deals.loading"
                @change="([option]) => { building.deal = option?.value ?? '' }"
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
                    <CMultiSelect
                      label="Type"
                      :multiple="false"
                      :options="generationsTypes.items"
                      optionsStyle="text"
                      size="sm"
                      :loading="generationsTypes.loading"
                      @change="([option]) => { building.type_generation = option?.value ?? '' }"
                    />
                  </div>
                  <!-- HEIGHT -->
                  <div class="mt-2">
                    <CFormInput 
                      type="number" 
                      size="sm"
                      v-model="building.clear_height"
                      label="Clear Height"
                    />
                  </div>
                  <!-- TOTAL LAND -->
                  <div class="mt-2">
                    <CFormInput 
                      type="number" 
                      size="sm"
                      v-model="building.total_land"
                      label="Total Land"
                    />
                  </div>
                  <!-- COVERAGE -->
                  <div class="mt-2">
                    <CFormInput 
                      type="number" 
                      size="sm"
                      v-model="building.coverage"
                      label="Coverage %"
                    />
                  </div>
                  <div class="mt-2">
                    <CFormInput 
                      type="number" 
                      size="sm"
                      v-model="building.offices_space"
                      label="Offices Space"
                    />
                  </div>
                </CCol>

                <!-- Segunda columna: Sistemas y características técnicas -->
                <CCol :md="3">
                  <!-- CONSTRUCTION TYPE -->
                  <div class="mt-2">
                    <CMultiSelect
                      label="Construction Type"
                      :multiple="false"
                      :options="constructionTypes.items"
                      optionsStyle="text"
                      size="sm"
                      :loading="constructionTypes.loading"
                      @change="([option]) => { building.construction_type = option?.value ?? '' }"
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
                    <CMultiSelect
                      label="Fire Protection System (FPS)"
                      :multiple="false"
                      :options="fireProtectionSystems.items"
                      optionsStyle="text"
                      size="sm"
                      :loading="fireProtectionSystems.loading"
                      @change="([option]) => { building.fire_protection_system = option?.value ?? '' }"
                    />
                  </div>
                  <div class="mt-2">
                    <CFormInput
                      type="number"
                      size="sm"
                      v-model="building.skylights_sf"
                      label="Skylights SF"
                    />
                  </div>
                </CCol>

                <!-- Tercera columna: Sistemas eléctricos y ambientales -->
                <CCol :md="3">
                  <!-- TRANSFORMER CAPACITY -->
                  <div class="mt-2">
                    <CFormInput
                      type="text"
                      size="sm"
                      v-model="building.transformer_capacity"
                      label="Transformer Capacity"
                    />
                  </div>
                  <!-- LIGHTING -->
                  <div class="mt-2">
                    <CMultiSelect
                      label="Lighting"
                      :multiple="false"
                      :options="typesLightnings.items"
                      optionsStyle="text"
                      size="sm"
                      :loading="typesLightnings.loading"
                      @change="([option]) => { building.lightning = option?.value ?? '' }"
                    />
                  </div>
                  <!-- VENTILATION -->
                  <div class="mt-2">
                    <CFormInput
                      type="text"
                      size="sm"
                      v-model="building.ventilation"
                      label="Ventilation System"
                    />
                  </div>
                  <!-- HVAC PRODUCTION AREA -->
                  <div class="mt-2">
                    <label>HVAC Production Area</label>
                    <CInputGroup class="mb-3">
                      <CFormInput 
                        type="number" 
                        size="sm"
                        class="no-spinner"
                        v-model="building.hvacProduction"
                        placeholder="Production"
                        aria-label="Production"
                        @blur="validateHvacRange"
                      />
                      <CInputGroupText>@</CInputGroupText>
                      <CFormInput 
                        type="number"
                        size="sm"
                        class="no-spinner"
                        v-model="building.hvacArea"
                        placeholder="Area"
                        aria-label="Area"
                        @blur="validateHvacRange"
                      />
                    </CInputGroup>
                  </div>
                </CCol>

                <!-- Cuarta columna: Switches de características -->
                <CCol :md="3">
                  <div class="switches-container">
                    <!-- SF/SM SWITCH -->
                    <div class="switch-item">
                      <label class="switch-label">SF/SM</label>
                      <CFormSwitch 
                        size="lg"
                        v-model="building.sfSm"
                      />
                    </div>
                    <!-- OFFICE -->
                    <div class="switch-item">
                      <label class="switch-label">Office</label>
                      <CFormSwitch 
                        size="lg"
                        v-model="building.has_office"
                      />
                    </div>
                    <!-- SPRINKLERS -->
                    <div class="switch-item">
                      <label class="switch-label">Sprinklers</label>
                      <CFormSwitch 
                        size="lg"
                        v-model="building.has_sprinklers"
                      />
                    </div>
                    <!-- CRANE -->
                    <div class="switch-item">
                      <label class="switch-label">Crane</label>
                      <CFormSwitch 
                        size="lg"
                        v-model="building.has_crane"
                      />
                    </div>
                    <!-- HVAC -->
                    <div class="switch-item">
                      <label class="switch-label">HVAC</label>
                      <CFormSwitch 
                        size="lg"
                        v-model="building.has_hvac"
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