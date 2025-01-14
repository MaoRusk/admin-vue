<script setup>
import { onMounted, computed, reactive, ref } from 'vue';
import Swal from 'sweetalert2';
import { API } from '../../../services';
import dayjs from 'dayjs';

const props = defineProps({
  buildingId: {
    type: Number,
    required: true
  },
  absorptionId: {
    type: Number,
  },
});

const emit = defineEmits(['return', 'submitting']);

const isNewRecord = computed(() => !props.absorptionId);

const absorptionObj = {
  building_id: props.buildingId,
  abs_tenant_id: '', // id
  abs_industry_id: '', // id
  abs_country_id: '', // id
  broker_id: '', // id
  dock_doors: '', // number
  drive_in_door: '', // number
  floor_thickness: '', // number
  floor_resistance: '', // string,
  truck_court: '', // number
  has_crossdock: false,
  shared_truck: false,
  new_construction: false,
  is_starting_construction: false,
  bay_size: '', // string
  columns_spacing: '', // string
  abs_lease_term_month: '', // number
  knockouts_docks: '', // number
  parking_space: '', // number
  abs_asking_rate_shell: '', // number
  abs_closing_rate: '', // number
  abs_closing_date: '', // string date
  abs_lease_up: '', // string date
  abs_month: '', // string date
  abs_sale_price: '', // number
  building_state: '', // string enum
  abs_building_phase: '', // string enum
  abs_final_use: '', // string
  abs_company_type: '', // string
}

const absorption = reactive({...absorptionObj})
const formHtmlElement = ref(null)

const tenants = reactive({ loading: false, items: []})
const industries = reactive({ loading: false, items: []})
const countries = reactive({ loading: false, items: []})
const brokers = reactive({ loading: false, items: []})
const phases = reactive({ loading: false, items: []})
const buildingStates = reactive({ loading: false, items: []})
const finalUses = reactive({ loading: false, items: []})
const companyTypes = reactive({ loading: false, items: []})

// TODO, no encontre catalogo en backend
async function fetchCompanyTypes() {
  companyTypes.loading = true
  const { data } = await new Promise(r => {
    r({
      data: {
        data: [
          { value: '', label: 'Select' },
          { value: 'Existing Company', label: 'Existing Company' },
          { value: 'New Company in Market', label: 'New Company in Market' },
          { value: 'New Company in Mexico', label: 'New Company in Mexico' }
        ]
      }
    })
  });
  companyTypes.loading = false
  companyTypes.items = data.data.map(({ value, label }) => ({ label: label, value: value, selected: value === absorption.abs_company_type}))
}

// TODO, no encontre catalogo en backend
async function fetchFinalUses() {
  finalUses.loading = true
  const { data } = await new Promise(r => {
    r({
      data: {
        data: [
          { value: '', label: 'Select' },
          { value: 'Manufacturing', label: 'Manufacturing' },
          { value: 'Logistic', label: 'Logistic' },
        ]
      }
    })
  });
  finalUses.loading = false
  finalUses.items = data.data.map(({ value, label }) => ({ label: label, value: value, selected: value === absorption.abs_final_use}))
}

// TODO. este catalogo es de backend? y solo tendra siempre un valor?
async function fetchBuildingStates() {
  buildingStates.loading = true
  const { data } = await new Promise(r => {
    r({
      data: {
        data: [
          { value: '', label: 'Select' },
          { value: 'Absorption', label: 'Absorption' },
        ]
      }
    })
  });
  buildingStates.loading = false
  buildingStates.items = data.data.map(({ value, label }) => ({ label: label, value: value, selected: value === absorption.building_state}))
}

async function fetchPhases() {
  phases.loading = true
  const { data } = await API.buildings.getBuildingsPhases();
  phases.loading = false
  phases.items = Object.keys(data.data).map(item => ({ value: data.data[item], label: item, selected: data.data[item] === absorption.abs_building_phases }))
  phases.items.unshift({label: 'Select', value: ''})
}

async function fetchTenants() {
  tenants.loading = true
  const { data } = await API.tenants.getTenants();
  tenants.loading = false
  tenants.items = data.data.map(({ id, name }) => ({ label: name, value: id, selected: id === absorption.abs_tenant_id}))
  tenants.items.unshift({label: 'Select', value: ''})
}

async function fetchIndustries() {
  industries.loading = true
  const { data } = await API.industries.getIndustries();
  industries.loading = false
  industries.items = data.data.map(({ id, name }) => ({ label: name, value: id, selected: id === absorption.abs_industry_id}))
  industries.items.unshift({label: 'Select', value: ''})
}

async function fetchCountries() {
  countries.loading = true
  const { data } = await API.countries.getCountries();
  countries.loading = false
  countries.items = data.data.map(({ id, name }) => ({ label: name, value: id, selected: id === absorption.abs_country_id}))
  countries.items.unshift({label: 'Select', value: ''})
}

async function fetchBrokers() {
  brokers.loading = true
  const { data } = await API.developers.getDevelopers();
  brokers.loading = false
  brokers.items = data.data.map(({ id, name }) => ({ label: name, value: id, selected: id === absorption.broker_id}))
  brokers.items.unshift({label: 'Select', value: ''})
}

const handleReturn = () => {
  for (const prop in absorption) {
    absorption[prop] = absorptionObj[prop]
  }
  emit('return');
};

async function saveAbsorption() {
  emit('submitting', true)
  try {
    const body = {
      ...absorption,
      abs_closing_date: absorption.abs_closing_date ? dayjs(absorption.abs_closing_date).format('YYYY-MM-DD') : '',
      abs_lease_up: absorption.abs_lease_up ? dayjs(absorption.abs_lease_up).format('YYYY-MM-DD') : '',
      abs_month: absorption.abs_month ? dayjs(absorption.abs_month).format('YYYY-MM-DD') : '',
    }
    let data;
    if (isNewRecord.value) {
      ({ data } = await API.buildingsAbsorption.createAbsorptionBuilding(props.buildingId, body));
    } else {
      ({ data } = await API.buildingsAbsorption.updateAbsorptionBuilding(props.absorptionId, props.buildingId, body));
    }
    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: data.message
    });
    handleReturn();
  } catch (error) {
    console.error(error)
    Swal.fire({
      icon: 'error',
      title: error.response.data.message,
      text: JSON.stringify(error.response.data.errors)
    });
  } finally {
    emit('submitting', false)
  }
}

async function fetchAbsorption() {
  try {
    const { data } = await API.buildingsAbsorption.getAbsorptionBuilding(props.absorptionId, props.buildingId);
    ['abs_tenant_id', 'abs_industry_id', 'abs_country_id', 'broker_id', 'dock_doors', 'drive_in_door', 'floor_thickness', 'floor_resistance', 'truck_court', 'bay_size', 'columns_spacing', 'abs_lease_term_month', 'knockouts_docks', 'parking_space', 'abs_asking_rate_shell', 'abs_closing_rate', 'abs_closing_date', 'abs_lease_up', 'abs_month', 'abs_sale_price', 'building_state', 'abs_building_phase', 'abs_final_use', 'abs_company_type']
    .forEach(prop => absorption[prop] = `${data.data[prop] ?? ''}`);
    ['has_crossdock', 'shared_truck', 'new_construction', 'is_starting_construction']
    .forEach(prop => absorption[prop] = Boolean(data.data[prop]))
    console.log(data)
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to load building data: ' + error.message,
    });
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
  if (!isNewRecord.value) {
    await fetchAbsorption();
  }
  await Promise.all([
    fetchCompanyTypes(),
    fetchFinalUses(),
    fetchBuildingStates(),
    fetchPhases(),
    fetchTenants(),
    fetchIndustries(),
    fetchCountries(),
    fetchBrokers(),
  ])
  Swal.close()
});

defineExpose({
  submit() {
    if (formHtmlElement.value?.reportValidity()) {
      formHtmlElement.value?.requestSubmit()
    }
  }
})
</script>

<template>
  <div class="absorption-form p-4">
    <CCard>
      <CCardHeader class="d-flex justify-content-between align-items-center">
        <h3>{{ isNewRecord ? 'New Absorption' : 'Edit Absorption' }}</h3>
        <CButton color="primary" variant="outline" @click="handleReturn">
          List
        </CButton>
      </CCardHeader>
      
      <CCardBody>
        <form @submit.prevent="saveAbsorption" ref="formHtmlElement">
          <div class="row">
            <!-- Basic Information -->
            <div class="col-md-6">
              <CCard class="mb-4">
                <CCardHeader>Basic Information</CCardHeader>
                <CCardBody>
                  <div class="mb-3">
                    <CFormLabel>Tenant</CFormLabel>
                    <CFormSelect
                      v-model="absorption.abs_tenant_id"
                      :options="tenants.items"
                      required
                    />
                  </div>

                  <div class="mb-3">
                    <CFormLabel>Industry</CFormLabel>
                    <CFormSelect
                      v-model="absorption.abs_industry_id"
                      :options="industries.items"
                      required
                    />
                  </div>

                  <div class="mb-3">
                    <CFormLabel>Country</CFormLabel>
                    <CFormSelect
                      v-model="absorption.abs_country_id"
                      :options="countries.items"
                      required
                    />
                  </div>

                  <div class="mb-3">
                    <CFormLabel>Broker</CFormLabel>
                    <CFormSelect
                      v-model="absorption.broker_id"
                      :options="brokers.items"
                      required
                    />
                  </div>

                  <div class="mb-3">
                    <CFormLabel>Building State</CFormLabel>
                    <CFormSelect
                      v-model="absorption.building_state"
                      :options="buildingStates.items"
                      required
                    />
                  </div>

                  <div class="mb-3">
                    <CFormLabel>Building Phase</CFormLabel>
                    <CFormSelect
                      v-model="absorption.abs_building_phase"
                      :options="phases.items"
                      required
                    />
                  </div>
                </CCardBody>
              </CCard>
            </div>

            <!-- Technical Details -->
            <div class="col-md-6">
              <CCard class="mb-4">
                <CCardHeader>Technical Details</CCardHeader>
                <CCardBody>
                  <div class="mb-3">
                    <CFormLabel>Dock Doors</CFormLabel>
                    <CFormInput type="number" v-model="absorption.dock_doors" />
                  </div>

                  <div class="mb-3">
                    <CFormLabel>Drive-in Door</CFormLabel>
                    <CFormInput type="number" v-model="absorption.drive_in_door" />
                  </div>

                  <div class="mb-3">
                    <CFormLabel>Floor Thickness</CFormLabel>
                    <CFormInput type="number" v-model="absorption.floor_thickness" />
                  </div>

                  <div class="mb-3">
                    <CFormLabel>Floor Resistance</CFormLabel>
                    <CFormInput type="text" v-model="absorption.floor_resistance" />
                  </div>

                  <div class="mb-3">
                    <CFormLabel>Truck Court</CFormLabel>
                    <CFormInput type="number" v-model="absorption.truck_court" />
                  </div>

                  <div class="mb-3">
                    <CFormLabel>Bay Size</CFormLabel>
                    <CFormInput type="text" v-model="absorption.bay_size" />
                  </div>

                  <div class="mb-3">
                    <CFormLabel>Columns Spacing</CFormLabel>
                    <CFormInput type="text" v-model="absorption.columns_spacing" />
                  </div>
                </CCardBody>
              </CCard>
            </div>
          </div>

          <!-- Additional Information -->
          <CCard class="mb-4">
            <CCardHeader>Additional Information</CCardHeader>
            <CCardBody>
              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <CFormLabel>Lease Term (months)</CFormLabel>
                    <CFormInput type="number" v-model="absorption.abs_lease_term_month" />
                  </div>

                  <div class="mb-3">
                    <CFormLabel>Knockouts Docks</CFormLabel>
                    <CFormInput type="number" v-model="absorption.knockouts_docks" />
                  </div>

                  <div class="mb-3">
                    <CFormLabel>Parking Space</CFormLabel>
                    <CFormInput type="number" v-model="absorption.parking_space" />
                  </div>

                  <div class="mb-3">
                    <CFormLabel>Asking Rate Shell</CFormLabel>
                    <CFormInput 
                      type="number" 
                      v-model="absorption.abs_asking_rate_shell"
                      step="0.01" 
                      required
                    />
                  </div>

                  <div class="mb-3">
                    <CFormLabel>Closing Rate</CFormLabel>
                    <CFormInput 
                      type="number" 
                      v-model="absorption.abs_closing_rate"
                      step="0.01" 
                      required
                    />
                  </div>
                </div>

                <div class="col-md-6">
                  <div class="mb-3">
                    <CFormLabel>Final Use</CFormLabel>
                    <CFormSelect
                      v-model="absorption.abs_final_use"
                      :options="finalUses.items"
                      required
                    />
                  </div>

                  <div class="mb-3">
                    <CFormLabel>Company Type</CFormLabel>
                    <CFormSelect
                      v-model="absorption.abs_company_type"
                      :options="companyTypes.items"
                      required
                    />
                  </div>

                  <div class="mb-3">
                    <CFormLabel>Sale Price</CFormLabel>
                    <CFormInput 
                      type="number" 
                      v-model="absorption.abs_sale_price"
                      step="0.01" 
                    />
                  </div>
                </div>
              </div>

              <!-- Switches Section -->
              <CCard class="mb-4">
                <CCardHeader>Status & Features</CCardHeader>
                <CCardBody>
                  <div class="row">
                    <!-- Construction Status -->
                    <div class="col-md-4 mb-4">
                      <h6 class="mb-3">Construction Status</h6>
                      <div class="d-flex flex-column gap-3">
                        <CFormSwitch
                          v-model="absorption.new_construction"
                          label="New Construction"
                          size="lg"
                        />
                        <CFormSwitch
                          v-model="absorption.is_starting_construction"
                          label="Starting Construction"
                          size="lg"
                        />
                      </div>
                    </div>

                    <!-- Building Features -->
                    <div class="col-md-4 mb-4">
                      <h6 class="mb-3">Building Features</h6>
                      <div class="d-flex flex-column gap-3">
                        <CFormSwitch
                          v-model="absorption.has_crossdock"
                          label="Has Crossdock"
                          size="lg"
                        />
                        <CFormSwitch
                          v-model="absorption.shared_truck"
                          label="Shared Truck"
                          size="lg"
                        />
                      </div>
                    </div>

                    <!-- Dates & Status -->
                    <div class="col-md-4 mb-4">
                      <h6 class="mb-3">Dates & Status</h6>
                      <div class="d-flex flex-column gap-3">
                        <CFormLabel>Closing Date</CFormLabel>
                        <CDatePicker
                          v-model:date="absorption.abs_closing_date"
                        />
                        <CFormLabel>Lease Up</CFormLabel>
                        <CDatePicker
                          v-model:date="absorption.abs_lease_up"
                        />
                        <CFormLabel>Month</CFormLabel>
                        <CDatePicker
                          v-model:date="absorption.abs_month"
                        />
                      </div>
                    </div>
                  </div>
                </CCardBody>
              </CCard>
            </CCardBody>
          </CCard>
        </form>
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