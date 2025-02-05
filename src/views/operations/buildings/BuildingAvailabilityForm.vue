<script setup>
import { onMounted, computed, reactive, ref } from 'vue';
import Swal from 'sweetalert2';
import { API } from '../../../services';
import dayjs from 'dayjs';
import MSelect from '../../../components/MSelect.vue';

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

const availabilityObj = {
  building_id: props.buildingId, // id
  broker_id: '', //  id
  avl_size_sf: '', // number,
  avl_building_dimensions: '', // '50x100',
  avl_minimum_space_sf: '', // number
  avl_expansion_up_to_sf: '', // number
  dock_doors: '', // number
  drive_in_door: '', // number
  floor_thickness: '', // number
  floor_resistance: '', // string
  truck_court: '', // number
  has_crossdock: false,
  shared_truck: false,
  new_construction: false,
  is_starting_construction: false,
  bay_size: '', //'25x50',
  columns_spacing: '', // '20x20',
  avl_date: null, // string fecha,
  knockouts_docks: '', // number
  parking_space: '', // number
  avl_min_lease: '', // number
  avl_max_lease: '', // number
  building_state: '', // enum
  avl_building_phase: '', // enum
}

const availability = reactive({...availabilityObj})
const formHtmlElement = ref(null)

const handleReturn = () => {
  for (const prop in availability) {
    availability[prop] = availabilityObj[prop]
  }
  emit('return');
};

async function saveAvailability() {
  emit('submitting', true)
  try {
    const body = {
      ...availability,
      avl_date: availability.avl_date ? dayjs(availability.avl_date).format('YYYY-MM-DD') : '',
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
const buildingStates = reactive({ loading: false, items: []})

// TODO, no encontre catalogo en backend, solo tendra un valor?
async function fetchBuildingStates() {
  buildingStates.loading = true
  const { data } = await new Promise(r => {
    r({
      data: {
        data: [
          { value: '', label: 'Select...' },
          { value: 'Availability', label: 'Availability' },
        ]
      }
    })
  });
  buildingStates.loading = false
  buildingStates.items = data.data
}

async function fetchPhases() {
  phases.loading = true
  const { data } = await API.buildings.getBuildingsPhases();
  phases.loading = false
  phases.items = Object.keys(data.data).map(item => ({ value: data.data[item], label: item, selected: data.data[item] === availability.avl_building_phase }))
  phases.items.unshift({label: 'Select...', value: ''})
}

// TODO. existe un endpoint de brokers, pero en el validador solo acepta registros de developers, pero en developers no hay bandera para brokers
async function fetchBrokers() {
  brokers.loading = true
  const { data } = await API.developers.getDevelopers();
  brokers.loading = false
  brokers.items = data.data.map(({ id, name }) => ({ label: name, value: id, selected: id === availability.broker_id})).sort((a, b) => a.label.localeCompare(b.name))
  brokers.items.unshift({label: 'Select...', value: ''})
}

async function fetchAvailability() {
  try {
    const { data } = await API.buildingsAvailability.getAvailableBuilding(props.availabilityId, props.buildingId);
    ['broker_id', 'avl_size_sf', 'avl_building_dimensions', 'avl_minimum_space_sf', 'avl_expansion_up_to_sf', 'dock_doors', 'drive_in_door', 'floor_thickness', 'floor_resistance', 'truck_court', 'bay_size', 'columns_spacing', 'avl_date', 'knockouts_docks', 'parking_space', 'avl_min_lease', 'avl_max_lease', 'building_state', 'avl_building_phase']
    .forEach(prop => availability[prop] = `${data.data[prop] ?? ''}`);
    ['has_crossdock', 'shared_truck', 'new_construction', 'is_starting_construction']
    .forEach(prop => availability[prop] = Boolean(data.data[prop]))
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
    await fetchAvailability();
  }
  await Promise.all([
    fetchBrokers(),

    fetchPhases(),
    fetchBuildingStates()
  ])
  Swal.close()
});

async function createOptionGeneral(field, value) {
  if (field === 'broker_id') {
    const { data } = await API.brokers.createBroker({ name: value.name })
    availability.broker_id = data.data.id
    fetchBrokers()
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
                    <CFormLabel>Broker</CFormLabel>
                    <MSelect
                      :options="brokers.items" 
                      v-model="availability.broker_id"
                      @submitOption="value => createOptionGeneral('broker_id', value)"
                      create-option
                      required
                    />
                  </div>

                  <div class="mb-3">
                    <CFormLabel>Building State</CFormLabel>
                    <CFormSelect
                      v-model="availability.building_state"
                      :options="buildingStates.items"
                      required
                    />
                  </div>

                  <div class="mb-3">
                    <CFormLabel>Building Phase</CFormLabel>
                    <CFormSelect
                      v-model="availability.avl_building_phase"
                      :options="phases.items"
                      required
                    />
                  </div>

                  <div class="mb-3">
                    <CFormLabel>Size (SF)</CFormLabel>
                    <CFormInput
                      type="number"
                      v-model="availability.avl_size_sf"
                      required
                    />
                  </div>

                  <div class="mb-3">
                    <CFormLabel>Building Dimensions</CFormLabel>
                    <CFormInput
                      type="text"
                      v-model="availability.avl_building_dimensions"
                      required
                    />
                  </div>

                  <div class="mb-3">
                    <CFormLabel>Minimum Space (SF)</CFormLabel>
                    <CFormInput
                      type="number"
                      v-model="availability.avl_minimum_space_sf"
                    />
                  </div>

                  <div class="mb-3">
                    <CFormLabel>Expansion Up To (SF)</CFormLabel>
                    <CFormInput
                      type="number"
                      v-model="availability.avl_expansion_up_to_sf"
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
                    <CFormLabel>Drive-in Door</CFormLabel>
                    <CFormInput
                      type="number"
                      v-model="availability.drive_in_door"
                    />
                  </div>

                  <div class="mb-3">
                    <CFormLabel>Floor Thickness</CFormLabel>
                    <CFormInput
                      type="number"
                      v-model="availability.floor_thickness"
                    />
                  </div>

                  <div class="mb-3">
                    <CFormLabel>Floor Resistance</CFormLabel>
                    <CFormInput
                      type="text"
                      v-model="availability.floor_resistance"
                    />
                  </div>

                  <div class="mb-3">
                    <CFormLabel>Truck Court</CFormLabel>
                    <CFormInput
                      type="number"
                      v-model="availability.truck_court"
                    />
                  </div>

                  <div class="mb-3">
                    <CFormLabel>Bay Size</CFormLabel>
                    <CFormInput
                      type="text"
                      v-model="availability.bay_size"
                    />
                  </div>

                  <div class="mb-3">
                    <CFormLabel>Columns Spacing</CFormLabel>
                    <CFormInput
                      type="text"
                      v-model="availability.columns_spacing"
                    />
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
                    <CFormLabel>Availability Date</CFormLabel>
                    <CDatePicker
                      v-model:date="availability.avl_date"
                    />
                  </div>

                  <div class="mb-3">
                    <CFormLabel>Knockouts Docks</CFormLabel>
                    <CFormInput
                      type="number"
                      v-model="availability.knockouts_docks"
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
                    <CFormLabel>Minimum Lease</CFormLabel>
                    <CFormInput
                      type="number"
                      v-model="availability.avl_min_lease"
                      step="0.01"
                      required
                    />
                  </div>

                  <div class="mb-3">
                    <CFormLabel>Maximum Lease</CFormLabel>
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
                    v-model="availability.has_crossdock"
                    label="Has Crossdock"
                  />
                </div>
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