<script setup>
import { onMounted, computed, reactive, ref } from 'vue';
import Swal from 'sweetalert2';
import { API } from '../../../services';
import dayjs from 'dayjs';
import MASelect from '../../../components/MASelect.vue';
import { AxiosError } from 'axios';

const props = defineProps({
  buildingId: {
    type: Number,
    required: true
  },
  availabilityId: {
    type: Number,
  },
});

const emit = defineEmits(['return', 'submitting']);

const isNewRecord = computed(() => !props.availabilityId);

const building = ref(null)
const VALUE_SEPARATOR = ' x '

const availabilityObj = {
  building_id: props.buildingId, // id
  broker_id: '',
  avl_minimum_space_sf: '',
  dock_doors: '',
  shared_truck: false,
  new_construction: false,
  is_starting_construction: false,
  
  avl_date: '',
  parking_space: '',
  avl_min_lease: '',
  avl_max_lease: '',
  avl_building_phase: '',
  
  size_sf: '',
  truck_court_ft: '',
  rams: '',
  
  trailer_parking_space: '',

  fire_protection_system: [],
  above_market_tis: [],

  sqftToM2: false,

  avl_building_dimensions_value_1: '',
  avl_building_dimensions_value_2: '',

  columns_spacing_value_1: '',
  columns_spacing_value_2: '',

  bay_size_value_1: '',
  bay_size_value_2: '',
}

const availability = reactive({...availabilityObj})
const formHtmlElement = ref(null)

const handleReturn = () => {
  for (const prop in availability) {
    availability[prop] = availabilityObj[prop]
  }
  emit('return');
};

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

const validateRangeAvlBuildingDimensions = () => {
  validateRangeInputs(availability, 'avl_building_dimensions_value_1', 'avl_building_dimensions_value_2', 'Building Dimensions');
}
const validateRangeBaySize = () => {
  validateRangeInputs(building, 'bay_size_value_1', 'bay_size_value_2', 'Bay size');
}
const validateRangeColumnsSpacing = () => {
  validateRangeInputs(building, 'columns_spacing_value_1', 'columns_spacing_value_2', 'Column Spacing FT');
}

async function saveAvailability() {
  emit('submitting', true)
  try {
    const body = {
      ...availability,
      avl_date: availability.avl_date ? dayjs(availability.avl_date).format('YYYY-MM-DD') : '',
      avl_building_dimensions_ft: (availability.avl_building_dimensions_value_1 && availability.avl_building_dimensions_value_2) ? `${availability.avl_building_dimensions_value_1}${VALUE_SEPARATOR}${availability.avl_building_dimensions_value_2}` : '',
      columns_spacing: (availability.columns_spacing_value_1 && availability.columns_spacing_value_2) ? `${availability.columns_spacing_value_1}${VALUE_SEPARATOR}${availability.columns_spacing_value_2}` : '',
      bay_size: (availability.bay_size_value_1 && availability.bay_size_value_2) ? `${availability.bay_size_value_1}${VALUE_SEPARATOR}${availability.bay_size_value_2}` : '',
      fire_protection_system: availability.fire_protection_system.length ? availability.fire_protection_system : null,
      above_market_tis: availability.above_market_tis.length ? availability.above_market_tis : null,
    }
    let data;
    if (isNewRecord.value) {
      ({ data } = await API.buildingsAvailability.createAvailableBuilding(props.buildingId, body));
    } else {
      ({ data } = await API.buildingsAvailability.updateAvailableBuilding(props.availabilityId, props.buildingId, body));
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

const brokers = reactive({ loading: false, items: []})
const phases = reactive({ loading: false, items: []})
const technicalImprovements = reactive({ loading: false, items: []})
const fireProtectionSystems = reactive({ loading: false, items: []})

async function fetchPhases() {
  phases.loading = true
  const { data } = await API.buildings.getBuildingsPhases({ availability: true });
  phases.loading = false
  phases.items = Object.values(data.data).map(value => ({ value, label: value }))
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

// TODO. existe un endpoint de brokers, pero en el validador solo acepta registros de developers, pero en developers no hay bandera para brokers
async function fetchBrokers(marketId, submarketId) {
  brokers.loading = true
  const data = await API.developers.getDevelopers({ is_developer: true, marketId, submarketId });
  brokers.loading = false
  brokers.items = data.sort((a, b) => a.name.localeCompare(b.name))
}

async function fetchAvailability() {
  try {
    const { data } = await API.buildingsAvailability.getAvailableBuilding(props.availabilityId, props.buildingId);
    ['size_sf', 'avl_building_dimensions', 'avl_minimum_space_sf', 'dock_doors', 'rams', 'truck_court_ft', 'trailer_parking_space', 'avl_date', 'parking_space', 'avl_min_lease', 'avl_max_lease', 'avl_building_phase']
    .forEach(prop => availability[prop] = `${data.data[prop] ?? ''}`);
    ['broker_id']
    .forEach(prop => availability[prop] = data.data[prop] ? +data.data[prop] : '');
    ['shared_truck', 'new_construction', 'is_starting_construction']
    .forEach(prop => availability[prop] = Boolean(data.data[prop]));
    ['fire_protection_system', 'above_market_tis']
    .forEach(prop => {
      if (data.data[prop]) {
        if (Array.isArray(data.data[prop])) availability[prop] = data.data[prop]
        else availability[prop] = data.data[prop].split(',')
      } else {
        availability[prop] = [];
      }
    });

    if (data.data.avl_building_dimensions_ft && data.data.avl_building_dimensions_ft.length > VALUE_SEPARATOR.length) {
      ([availability.avl_building_dimensions_value_1, availability.avl_building_dimensions_value_2] = data.data.avl_building_dimensions_ft.split(VALUE_SEPARATOR))
    }
    if (data.data.columns_spacing && data.data.columns_spacing.length > VALUE_SEPARATOR.length) {
      ([availability.columns_spacing_value_1, availability.columns_spacing_value_2] = data.data.columns_spacing.split(VALUE_SEPARATOR))
    }
    if (data.data.bay_size && data.data.bay_size.length > VALUE_SEPARATOR.length) {
      ([availability.bay_size_value_1, availability.bay_size_value_2] = data.data.bay_size.split(VALUE_SEPARATOR))
    }
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to load building availability data: ' + error.message,
    });
  }
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
    await fetchAvailability();
  }
  await Promise.all([
    fetchBrokers(building.value.market_id, building.value.submarket_id),
    fetchPhases(),
    fetchFireProtectionSystems(),
    fetchBuildingTechnicalImprovements(),
  ])
  Swal.close()
});

async function saveOptionGeneral(field, values, update = false) {
  try {
    let data;
    if (['broker_id'].includes(field)) {
      const body = {
        name: values.name,
        is_builder: true,
        is_developer: false,
        is_owner: false,
        market_id: building.value.market_id,
        submarket_id: building.value.submarket_id
      }
      if (update) {
        ({ data } = await API.developers.updateDeveloper(values.id, body));
      } else {
        ({ data } = await API.developers.createDeveloper(body));
        building[field] = data.data.id
      }
      await fetchBrokers(building.value.market_id, building.value.submarket_id)
    }
  } catch (error) {
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
    return
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
      ({ data } = await API.developers.deleteDeveloper(option.id));
      await fetchBrokers();
    }
    console.info(data)
    if (availability[field] === option.id) {
      availability[field] = ''
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

defineExpose({
  submit() {
    if (formHtmlElement.value?.reportValidity()) {
      formHtmlElement.value?.requestSubmit()
    }
  }
})
</script>

<template>
  <div class="building-form p-4">
    <CCard>
      <CCardHeader class="d-flex justify-content-between align-items-center">
        <h3>{{ isNewRecord ? 'New Availability' : 'Edit Availability' }}</h3>
        <CButton color="primary" variant="outline" @click="handleReturn">
          List
        </CButton>
      </CCardHeader>
      
      <CCardBody>
        <form @submit.prevent="saveAvailability" ref="formHtmlElement">
          <div class="row">
            <!-- Basic Information -->
            <div class="col-md-6">
              <CCard class="mb-4">
                <CCardHeader>Basic Information</CCardHeader>
                <CCardBody>
                  <div class="mb-3">
                    <label class="form-label">SF/SM</label>
                    <CFormSwitch
                      size="lg"
                      v-model="availability.sqftToM2"
                    />
                  </div>
                  <div class="mb-3">
                    <CFormLabel>Building Phase *</CFormLabel>
                    <MASelect
                      v-model="availability.avl_building_phase"
                      :options="phases.items"
                      :reduce="option => option.value"
                      label="label"
                      required
                      placeholder="Select..."
                      :loading="phases.loading"
                    />
                  </div>

                  <div class="mb-3">
                    <CFormLabel>Availability Size (SF) *</CFormLabel>
                    <CFormInput
                      type="number"
                      v-model="availability.size_sf"
                      required
                    />
                  </div>

                  <div class="mb-3">
                    <label class="form-label">Building Dimensions</label>
                    <CInputGroup>
                      <CFormInput 
                        type="number" 
                        v-model="availability.avl_building_dimensions_value_1"
                        placeholder="value 1"
                        required
                        @blur="validateRangeAvlBuildingDimensions"
                      />
                      <CInputGroupText>@</CInputGroupText>
                      <CFormInput 
                        type="number"
                        v-model="availability.avl_building_dimensions_value_2"
                        placeholder="value 2"
                        required
                        @blur="validateRangeAvlBuildingDimensions"
                      />
                    </CInputGroup>
                  </div>

                  <div class="mb-3">
                    <CFormLabel>Minimum Space (SF)</CFormLabel>
                    <CFormInput
                      type="number"
                      v-model="availability.avl_minimum_space_sf"
                    />
                  </div>

                  <div class="mb-3">
                    <!-- TODO, para saber si hago crud de developer o broker -->
                    <CFormLabel>Listing Broker *</CFormLabel>
                    <MASelect
                      v-model="availability.broker_id"
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
                    <CFormInput
                      type="number"
                      v-model="availability.dock_doors"
                    />
                  </div>

                  <div class="mb-3">
                    <CFormLabel>Ramp</CFormLabel>
                    <CFormInput
                      type="number"
                      v-model="availability.rams"
                    />
                  </div>

                  <div class="mb-3">
                    <CFormLabel>Truck Court (FT)</CFormLabel>
                    <CFormInput
                      type="number"
                      v-model="availability.truck_court_ft"
                    />
                  </div>

                  <div class="mb-3">
                    <CFormLabel>Trailerp Parking Space</CFormLabel>
                    <CFormInput
                      type="number"
                      v-model="availability.trailer_parking_space"
                    />
                  </div>

                  <div class="mb-3">
                    <label class="form-label">Fire Protection System (FPS) *</label>
                    <MASelect
                      v-model="availability.fire_protection_system"
                      :options="fireProtectionSystems.items"
                      :reduce="option => option.value"
                      label="label"
                      required
                      placeholder="Select..."
                      :loading="fireProtectionSystems.loading"
                      multiple
                    />
                  </div>
                  
                  <div class="mb-3">
                    <label class="form-label">Above Market TIS</label>
                    <MASelect
                      v-model="availability.above_market_tis"
                      :options="technicalImprovements.items"
                      :reduce="option => option.value"
                      label="label"
                      placeholder="Select..."
                      :loading="technicalImprovements.loading"
                      multiple
                    />
                  </div>

                  <div class="mb-3">
                    <label class="form-label">Bay Size</label>
                    <CInputGroup>
                      <CFormInput 
                        type="number" 
                        v-model="availability.bay_size_value_1"
                        placeholder="value 1"
                        @blur="validateRangeBaySize"
                      />
                      <CInputGroupText>@</CInputGroupText>
                      <CFormInput 
                        type="number"
                        v-model="availability.bay_size_value_2"
                        placeholder="value 2"
                        @blur="validateRangeBaySize"
                      />
                    </CInputGroup>
                  </div>

                  <div class="mb-3">
                    <label class="form-label">Column Spacing FT</label>
                    <CInputGroup>
                      <CFormInput 
                        type="number" 
                        v-model="availability.columns_spacing_value_1"
                        placeholder="value 1"
                        @blur="validateRangeColumnsSpacing"
                      />
                      <CInputGroupText>@</CInputGroupText>
                      <CFormInput 
                        type="number"
                        v-model="availability.columns_spacing_value_2"
                        placeholder="value 2"
                        @blur="validateRangeColumnsSpacing"
                      />
                    </CInputGroup>
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
                    <CFormLabel>Availability Since</CFormLabel>
                    <CDatePicker
                      v-model:date="availability.avl_date"
                    />
                  </div>

                  <div class="mb-3">
                    <CFormLabel>Parking Space</CFormLabel>
                    <CFormInput
                      type="number"
                      v-model="availability.parking_space"
                    />
                  </div>
                </div>

                <div class="col-md-6">
                  <div class="mb-3">
                    <CFormLabel>Minimum Lease *</CFormLabel>
                    <CFormInput
                      type="number"
                      v-model="availability.avl_min_lease"
                      step="0.01"
                      required
                    />
                  </div>

                  <div class="mb-3">
                    <CFormLabel>Maximum Lease *</CFormLabel>
                    <CFormInput
                      type="number"
                      v-model="availability.avl_max_lease"
                      step="0.01"
                      required
                    />
                  </div>
                </div>
              </div>

              <!-- Switches -->
              <div class="row mt-3">
                <div class="col-md-3">
                  <CFormSwitch
                    v-model="availability.shared_truck"
                    label="Shared Truck"
                  />
                </div>
                <div class="col-md-3">
                  <CFormSwitch
                    v-model="availability.new_construction"
                    label="New Construction"
                  />
                </div>
                <div class="col-md-3">
                  <CFormSwitch
                    v-model="availability.is_starting_construction"
                    label="Starting Construction"
                  />
                </div>
              </div>
            </CCardBody>
          </CCard>
        </form>
      </CCardBody>
    </CCard>
  </div>
</template>

<style scoped>
.building-form {
  max-width: 1200px;
  margin: 0 auto;
}
</style>