<script setup>
import { onMounted, computed, reactive, ref, watch } from 'vue';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';

import { API } from '../../../services';
import MASelect from '../../../components/MASelect.vue';
import { AxiosError } from 'axios';

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

const building = ref(null)
const VALUE_SEPARATOR = ' x '
const months = Array.from({ length: 12 }, (_, i) =>
  dayjs().month(i).format("MMMM")
);

const absorptionObj = {
  building_id: props.buildingId,
  dock_doors: '',
  abs_tenant_id: '',
  abs_industry_id: '',
  abs_country_id: '',
  broker_id: '',
  ramps: '',
  offices_space_sf: '',
  avl_date: '',
  abs_min_lease: '',
  abs_max_lease: '',
  truck_court_ft: '',
  shared_truck: false,
  new_construction: false,
  is_starting_construction: false,
  abs_lease_term_month: '',
  parking_space: '',
  abs_closing_rate: '',
  abs_closing_date: '',
  abs_lease_up: '',
  abs_month: '',
  abs_sale_price: '',
  abs_type: '',
  abs_final_use: '',
  abs_company_type: '',
  size_sf: '',
  trailer_parking_space: '',
  fire_protection_system: [],
  above_market_tis: [],
  abs_deal: '',
  abs_shelter_id: '',
  sqftToM2: false,

  bay_size_value_1: '',
  bay_size_value_2: '',
}

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
const validateRangeBaySize = () => {
  validateRangeInputs(absorption, 'bay_size_value_1', 'bay_size_value_2', 'Bay size');
}

const absorption = reactive({...absorptionObj})
const formHtmlElement = ref(null)

const tenants = reactive({ loading: false, items: []})
const industries = reactive({ loading: false, items: []})
const countries = reactive({ loading: false, items: []})
const brokers = reactive({ loading: false, items: []})
const phases = reactive({ loading: false, items: []})
const finalUses = reactive({ loading: false, items: []})
const companyTypes = reactive({ loading: false, items: []})
const technicalImprovements = reactive({ loading: false, items: []})
const fireProtectionSystems = reactive({ loading: false, items: []})
const deals = reactive({ loading: false, items: []})
const shelters = reactive({ loading: false, items: []})

async function fetchCompanyTypes() {
  companyTypes.loading = true
  const { data } = await API.buildings.getBuildingsCompanyTypes()
  companyTypes.loading = false
  companyTypes.items = Object.values(data.data).map((value) => ({ label: value, value}))
}

async function fetchFinalUses() {
  finalUses.loading = true
  const { data } = await API.buildings.getBuildingsFinalUses()
  finalUses.loading = false
  finalUses.items = Object.values(data.data).map((value) => ({ label: value, value}))
}

async function fetchBuildingTechnicalImprovements() {
  technicalImprovements.loading = true
  const { data } = await API.buildings.getBuildingsTechnicalImprovements();
  technicalImprovements.loading = false
  technicalImprovements.items = Object.values(data.data).map(value => ({ value, label: value }))
}

async function fetchFireProtectionSystems() {
  fireProtectionSystems.loading = true
  const { data } = await API.buildings.getBuildingsFireProtectionSystems();
  fireProtectionSystems.loading = false
  fireProtectionSystems.items = Object.values(data.data).map(value => ({ value, label: value }))
}

async function fetchBuildingDeals() {
  deals.loading = true
  const { data } = await API.buildings.getBuildingsTypesDeals();
  deals.loading = false
  deals.items = Object.values(data.data).map(value => ({ value, label: value }))
}

async function fetchPhases() {
  phases.loading = true
  const { data } = await API.buildings.getBuildingsPhases({ absorption: true });
  phases.loading = false
  phases.items = Object.values(data.data).map(value => ({ value, label: value }))
}

async function fetchTenants() {
  tenants.loading = true
  const { data } = await API.tenants.getTenants();
  tenants.loading = false
  tenants.items = data.data.sort((a, b) => a.name.localeCompare(b.name))
}

async function fetchIndustries() {
  industries.loading = true
  const { data } = await API.industries.getIndustries();
  industries.loading = false
  industries.items = data.data.sort((a, b) => a.name.localeCompare(b.name))
}

async function fetchCountries() {
  countries.loading = true
  const { data } = await API.countries.getCountries();
  countries.loading = false
  countries.items = data.data
}

async function fetchShelters() {
  shelters.loading = true
  const { data } = await API.shelters.getShelters();
  shelters.loading = false
  shelters.items = data.data
}

async function fetchBrokers() {
  brokers.loading = true
  const { data } = await API.brokers.getBrokers();
  brokers.loading = false
  brokers.items = data.data.sort((a, b) => a.name.localeCompare(b.name))
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
      bay_size: (absorption.bay_size_value_1 && absorption.bay_size_value_2) ? `${absorption.bay_size_value_1}${VALUE_SEPARATOR}${absorption.bay_size_value_2}` : '',
      abs_closing_date: absorption.abs_closing_date ? dayjs(absorption.abs_closing_date).format('YYYY-MM-DD') : '',
      abs_lease_up: absorption.abs_lease_up ? dayjs(absorption.abs_lease_up).format('YYYY-MM-DD') : '',
      avl_date: absorption.avl_date ? dayjs(absorption.avl_date).format('YYYY-MM-DD') : '',
      fire_protection_system: absorption.fire_protection_system.length ? absorption.fire_protection_system : null,
      above_market_tis: absorption.above_market_tis.length ? absorption.above_market_tis : null,
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
    ['dock_doors', 'ramps', 'truck_court_ft', 'offices_space_sf', 'abs_min_lease', 'abs_max_lease', 'abs_lease_term_month', 'parking_space', 'avl_date', 'abs_closing_rate', 'abs_closing_date', 'abs_lease_up', 'abs_month', 'abs_sale_price', 'abs_type', 'abs_final_use', 'abs_company_type', 'size_sf', 'trailer_parking_space', 'abs_deal']
    .forEach(prop => absorption[prop] = `${data.data[prop] ?? ''}`);
    ['abs_tenant_id', 'abs_industry_id', 'abs_country_id', 'broker_id', 'abs_shelter_id']
    .forEach(prop => absorption[prop] = data.data[prop] ? +data.data[prop] : '');
    ['shared_truck', 'new_construction', 'is_starting_construction']
    .forEach(prop => absorption[prop] = Boolean(data.data[prop]));
    ['fire_protection_system', 'above_market_tis']
    .forEach(prop => {
      if (data.data[prop]) {
        if (Array.isArray(data.data[prop])) absorption[prop] = data.data[prop]
        else absorption[prop] = data.data[prop].split(',')
      } else {
        absorption[prop] = [];
      }
    });
    if (data.data.bay_size && data.data.bay_size.length > VALUE_SEPARATOR.length) {
      ([absorption.bay_size_value_1, absorption.bay_size_value_2] = data.data.bay_size.split(VALUE_SEPARATOR))
    }
    console.info(data)
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to load building data: ' + error.message,
    });
  }
}

async function saveOptionGeneral(field, values, update = false) {
  if (field === 'abs_industry_id') {
    if (update) {
      await API.industries.updateIndustry(values.id, { name: values.name })
    } else {
      const { data } = await API.industries.createIndustry({ name: values.name })
      absorption[field] = data.data.id
    }
    await fetchIndustries()
  } else if (field === 'abs_tenant_id') {
    if (update) {
      await API.tenants.updateTenant(values.id, { name: values.name })
    } else {
      const { data } = await API.tenants.createTenant({ name: values.name })
      absorption[field] = data.data.id
    }
    await fetchTenants()
  } else if (['broker_id'].includes(field)) {
    const body = {
      name: values.name,
    }
    let data;
    if (update) {
      ({ data } = await API.brokers.updateBroker(values.id, body));
    } else {
      ({ data } = await API.brokers.createBroker(body));
      absorption[field] = data.data.id
    }
    await fetchBrokers()
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
    if (['broker_id'].includes(field)) {
      ({ data } = await API.brokers.deleteBroker(option.id));
      await fetchBrokers();
      if (absorption.broker_id === option.id) absorption.broker_id = ''
    } else if (field === 'abs_industry_id') {
      ({ data } = await API.industries.deleteIndustry(option.id));
      await fetchIndustries();
    } else if (field === 'abs_tenant_id') {
      ({ data } = await API.tenants.deleteTenant(option.id));
      await fetchTenants()
    }
    console.info(data)
    if (absorption[field] === option.id) {
      absorption[field] = ''
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

async function fetchBuildingData() {
  try {
    const { data } = await API.buildings.getBuilding(props.buildingId);
    building.value = data.data
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
  if (props.buildingId) {
    await fetchBuildingData();
  }
  if (!isNewRecord.value) {
    await fetchAbsorption();
  }
  await Promise.all([
    fetchBuildingTechnicalImprovements(),
    fetchFireProtectionSystems(),
    fetchCompanyTypes(),
    fetchFinalUses(),
    fetchBuildingDeals(),
    fetchPhases(),
    fetchTenants(),
    fetchIndustries(),
    fetchCountries(),
    fetchShelters(),
    fetchBrokers(),
  ])
  Swal.close()
});

watch(() => absorption.abs_sale_price, (value) => {
  if (+value > 0) {
    absorption.abs_closing_rate = 0
  }
})

watch(() => absorption.abs_closing_rate, (value) => {
  if (+value > 0) {
    absorption.abs_sale_price = 0
  }
})

defineExpose({
  submit() {
    if (formHtmlElement.value?.reportValidity()) {
      formHtmlElement.value?.requestSubmit()
    }
  }
})
</script>

<template>
  <div class="">
    <CCard>
      <CCardHeader class="d-flex justify-content-between align-items-center">
        <h3>{{ isNewRecord ? 'New Absorption' : 'Edit Absorption' }}</h3>
        <CButton color="primary" variant="outline" @click="handleReturn">
          List
        </CButton>
      </CCardHeader>
      
      <CCardBody>
        <form @submit.prevent="saveAbsorption" ref="formHtmlElement">
          <CCard class="mb-4">
            <CCardHeader>Basic Information</CCardHeader>
            <CCardBody>
              <div class="row">
                <div class="col-12 mb-3">
                  <label class="form-label">SF/SM</label>
                  <CFormSwitch
                    size="lg"
                    v-model="absorption.sqftToM2"
                  />
                </div>
                <div class="col-md-6 mb-3">
                  <CFormLabel>Tenant *</CFormLabel>
                  <MASelect
                    v-model="absorption.abs_tenant_id"
                    :options="tenants.items"
                    :reduce="option => option.id"
                    label="name"
                    required
                    placeholder="Select..."
                    :loading="tenants.loading"
                    edit-options
                    @submitOption="(option, update) => { saveOptionGeneral('abs_tenant_id', option, update) }"
                    @deleteOption="(option) => { deleteOptionGeneral('abs_tenant_id', option) }"
                  />
                </div>
                <div class="col-md-6 mb-3">
                  <CFormLabel>Industry *</CFormLabel>
                  <MASelect
                    v-model="absorption.abs_industry_id"
                    :options="industries.items"
                    :reduce="option => option.id"
                    label="name"
                    required
                    placeholder="Select..."
                    :loading="industries.loading"
                    edit-options
                    @submitOption="(option, update) => { saveOptionGeneral('abs_industry_id', option, update) }"
                    @deleteOption="(option) => { deleteOptionGeneral('abs_industry_id', option) }"
                  />
                </div>
                <div class="col-md-6 mb-3">
                  <CFormLabel>Country *</CFormLabel>
                  <MASelect
                    v-model="absorption.abs_country_id"
                    :options="countries.items"
                    :reduce="option => option.id"
                    label="name"
                    required
                    placeholder="Select..."
                    :loading="countries.loading"
                  />
                </div>
                <div class="col-md-6 mb-3">
                  <CFormLabel>Listing Broker *</CFormLabel>
                  <MASelect
                    v-model="absorption.broker_id"
                    :options="brokers.items"
                    :reduce="option => option.id"
                    label="name"
                    required
                    placeholder="Select..."
                    :loading="brokers.loading"
                    edit-options
                    @submitOption="(option, update) => { saveOptionGeneral('broker_id', option, update) }"
                    @deleteOption="(option) => { deleteOptionGeneral('broker_id', option) }"
                  />
                </div>
                <div class="col-md-6 mb-3">
                  <CFormLabel>Shelter</CFormLabel>
                  <MASelect
                    v-model="absorption.abs_shelter_id"
                    :options="shelters.items"
                    :reduce="option => option.id"
                    label="name"
                    placeholder="Select..."
                    :loading="shelters.loading"
                  />
                </div>
                <div class="col-md-6 mb-3">
                  <CFormLabel>Building Phase *</CFormLabel>
                  <MASelect
                    v-model="absorption.abs_type"
                    :options="phases.items"
                    :reduce="option => option.value"
                    label="label"
                    required
                    placeholder="Select..."
                    :loading="phases.loading"
                  />
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Deal *</label>
                  <MASelect
                    v-model="absorption.abs_deal"
                    :options="deals.items"
                    :reduce="option => option.value"
                    label="label"
                    required
                    placeholder="Select..."
                    :loading="deals.loading"
                  />
                </div>
              </div>
            </CCardBody>
          </CCard>

          <CCard class="mb-4">
            <CCardHeader>Technical Details</CCardHeader>
            <CCardBody>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <CFormInput
                    type="number"
                    v-model="absorption.offices_space_sf"
                    :label="`Offices Space (${absorption.sqftToM2 ? 'SM' : 'SF'}) *`"
                    required
                  />
                </div>
                <div class="col-md-6 mb-3">
                  <CFormLabel>Dock Doors</CFormLabel>
                  <CFormInput type="number" v-model="absorption.dock_doors" min="0" />
                </div>
                <div class="col-md-6 mb-3">
                  <CFormLabel>Ramps</CFormLabel>
                  <CFormInput type="number" v-model="absorption.ramps" min="0" />
                </div>
                <div class="col-md-6 mb-3">
                  <CFormLabel>Truck Court</CFormLabel>
                  <CFormInput type="number" v-model="absorption.truck_court_ft" min="0" />
                </div>
                <div class="col-md-6 mb-3">
                  <CFormLabel>Size ({{absorption.sqftToM2 ? 'SM' : 'SF'}}) * </CFormLabel>
                  <CFormInput type="number" v-model="absorption.size_sf" required :max="building?.building_size_sf" />
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Fire Protection System (FPS) *</label>
                  <MASelect
                    v-model="absorption.fire_protection_system"
                    :options="fireProtectionSystems.items"
                    :reduce="option => option.value"
                    label="label"
                    required
                    placeholder="Select..."
                    :loading="fireProtectionSystems.loading"
                    multiple
                  />
                </div>
                
                <div class="col-md-6 mb-3">
                  <label class="form-label">Above Market TI's</label>
                  <MASelect
                    v-model="absorption.above_market_tis"
                    :options="technicalImprovements.items"
                    :reduce="option => option.value"
                    label="label"
                    placeholder="Select..."
                    :loading="technicalImprovements.loading"
                    multiple
                  />
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Bay Size</label>
                  <CInputGroup>
                    <CFormInput
                      type="number"
                      v-model="absorption.bay_size_value_1"
                      placeholder="value 1"
                      @blur="validateRangeBaySize"
                    />
                    <CInputGroupText>@</CInputGroupText>
                    <CFormInput
                      type="number"
                      v-model="absorption.bay_size_value_2"
                      placeholder="value 2"
                      @blur="validateRangeBaySize"
                    />
                  </CInputGroup>
                </div>
              </div>
            </CCardBody>
          </CCard>

          <!-- Additional Information -->
          <CCard class="mb-4">
            <CCardHeader>Additional Information</CCardHeader>
            <CCardBody>
              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <CFormLabel>Company Type</CFormLabel>
                    <MASelect
                      v-model="absorption.abs_company_type"
                      :options="companyTypes.items"
                      :reduce="option => option.value"
                      label="label"
                      required
                      placeholder="Select..."
                      :loading="companyTypes.loading"
                    />
                  </div>

                  <div class="mb-3">
                    <CFormLabel>Lease Term (MO)</CFormLabel>
                    <CFormInput type="number" v-model="absorption.abs_lease_term_month" />
                  </div>

                  <div class="mb-3">
                    <CFormLabel>Trailer Parking Spaces</CFormLabel>
                    <CFormInput type="number" v-model="absorption.trailer_parking_space" />
                  </div>

                  <div class="mb-3">
                    <CFormLabel>Minimum Lease (SF/Mo) *</CFormLabel>
                    <CFormInput
                      type="number"
                      v-model="absorption.abs_min_lease"
                      step="0.01"
                      required
                      min="0"
                    />
                  </div>

                  <div class="mb-3">
                    <CFormLabel>Closing Rate *</CFormLabel>
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
                    <MASelect
                      v-model="absorption.abs_final_use"
                      :options="finalUses.items"
                      :reduce="option => option.value"
                      label="label"
                      required
                      placeholder="Select..."
                      :loading="finalUses.loading"
                    />
                  </div>

                  <div class="mb-3">
                    <CFormLabel>Parking Space</CFormLabel>
                    <CFormInput type="number" v-model="absorption.parking_space" />
                  </div>

                  <div class="mb-3">
                    <CFormLabel>Sale Price</CFormLabel>
                    <CFormInput 
                      type="number" 
                      v-model="absorption.abs_sale_price"
                      step="0.01" 
                    />
                  </div>

                  <div class="mb-3">
                    <CFormLabel>Maximum Lease (SF/Mo) *</CFormLabel>
                    <CFormInput
                      type="number"
                      v-model="absorption.abs_max_lease"
                      step="0.01"
                      required
                      min="0"
                    />
                  </div>
                  <div class="mb-3">
                    <CFormLabel>Available Since</CFormLabel>
                    <CDatePicker
                      v-model:date="absorption.avl_date"
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
                          v-model="absorption.shared_truck"
                          label="Shared Truck"
                          size="lg"
                        />
                      </div>
                    </div>

                    <!-- Dates & Status -->
                    <div class="col-md-4 mb-4">
                      <h6 class="mb-3">Dates & Status</h6>
                      <div class="d-flex flex-column gap-1">
                        <CFormLabel>Closing Date</CFormLabel>
                        <CDatePicker
                          v-model:date="absorption.abs_closing_date"
                        />
                        <CFormLabel>Lease Up (MO)</CFormLabel>
                        <CDatePicker
                          v-model:date="absorption.abs_lease_up"
                        />
                        <CFormLabel>Month</CFormLabel>
                        <MASelect
                          v-model="absorption.abs_month"
                          :options="months"
                          placeholder="Select month"
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