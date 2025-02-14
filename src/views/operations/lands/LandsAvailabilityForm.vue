<script setup>
import { onMounted, computed, reactive, ref } from 'vue';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';
import { AxiosError } from 'axios';

import { API } from '../../../services';
import MASelect from '../../../components/MASelect.vue';

const props = defineProps({
  landId: {
    type: Number,
    required: true
  },
  availabilityId: {
    type: Number,
  },
});

const emit = defineEmits(['return', 'submitting']);

const isNewRecord = computed(() => !props.availabilityId);

const land = ref(null)
// const VALUE_SEPARATOR = ' x '

const availabilityObj = {
  land_id: props.landId,
  land_condition: '',
  natural_gas: '',
  sewage: '',
  water: '',
  electric: '',
  avl_broker_id: '',
  avl_minimum: '',
  avl_min_sale: '',
  avl_max_sale: '',
  avl_size_ha: '',
  avl_date: '',
  avl_deal: '',
  avl_comments: '',
  avl_conditioned_construction: false,
  rail_spur: false,
  kvas: '',
  // kvas_value_1: '',
  // kvas_value_2: '',
}

const availability = reactive({...availabilityObj})
const formHtmlElement = ref(null)

const handleReturn = () => {
  for (const prop in availability) {
    availability[prop] = availabilityObj[prop]
  }
  emit('return');
};

// const validateRangeInputs = (model, field1, field2, fieldName) => {
//   if (model && model[field1] && model[field2] && +(model[field1]) > +(model[field2])) {
//     Swal.fire({
//       icon: 'warning',
//       title: 'Invalid Range',
//       text: `The first ${fieldName} value cannot be greater than the second value`,
//     });
//     model[field1] = ''
//     model[field2] = ''
//   }
// }

// const validateRangeKvas = () => {
//   validateRangeInputs(availability, 'kvas_value_1', 'kvas_value_2', 'KVAS');
// }

async function saveAvailability() {
  emit('submitting', true)
  try {
    const body = {
      ...availability,
      avl_date: availability.avl_date ? dayjs(availability.avl_date).format('YYYY-MM-DD') : '',
      // kvas: (availability.kvas_value_1 && availability.kvas_value_2) ? `${availability.kvas_value_1}${VALUE_SEPARATOR}${availability.kvas_value_2}` : '',
    }
    let data;
    if (isNewRecord.value) {
      ({ data } = await API.landsAvailability.createLandAvailability(props.landId, body));
    } else {
      ({ data } = await API.landsAvailability.updateLandAvailability(props.landId, props.availabilityId, body));
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
const stateServices = reactive({ loading: false, items: []})
const deals = reactive({ loading: false, items: []})
const landConditions = reactive({ loading: false, items: []})

async function fetchLandConditions() {
  landConditions.loading = true
  const { data } = await new Promise(r => {
    r({
      data: {
        data: {
          'Fully Developed': 'Fully Developed',
          'Undeveloped': 'Undeveloped',
        }
      }
    })
  })
  landConditions.loading = false
  landConditions.items = Object.values(data.data).map(value => ({ value, label: value }))
}

async function fetchStateService() {
  stateServices.loading = true
  const { data } = await new Promise(r => {
    r({
      data: {
        data: {
          'yes': 'yes',
          'no': 'no',
          'feasibility': 'feasibility',
        }
      }
    })
  })
  stateServices.loading = false
  stateServices.items = Object.values(data.data).map(value => ({ value, label: value }))
}

async function fetchDeals() {
  deals.loading = true
  const { data } = await API.buildings.getBuildingsTypesDeals();
  deals.loading = false
  deals.items = Object.values(data.data).map(value => ({ value, label: value }))
}
async function fetchBrokers() {
  brokers.loading = true
  const { data } = await API.brokers.getBrokers();
  brokers.loading = false
  brokers.items = data.data.sort((a, b) => a.name.localeCompare(b.name))
}

async function fetchAvailability() {
  try {
    const { data } = await API.landsAvailability.getLandAvailability(props.landId, props.availabilityId);
    ['land_condition', 'natural_gas', 'sewage', 'water', 'electric', 'avl_broker_id', 'avl_minimum', 'avl_min_sale', 'avl_max_sale', 'avl_size_ha', 'avl_date', 'avl_deal', 'avl_comments', 'kvas']
    .forEach(prop => availability[prop] = `${data.data[prop] ?? ''}`);
    ['broker_id']
    .forEach(prop => availability[prop] = data.data[prop] ? +data.data[prop] : '');
    ['avl_conditioned_construction', 'rail_spur']
    .forEach(prop => availability[prop] = Boolean(data.data[prop]));

    // if (data.data.kvas && data.data.kvas.length > VALUE_SEPARATOR.length) {
    //   ([availability.kvas_value_1, availability.kvas_value_2] = data.data.kvas.split(VALUE_SEPARATOR))
    // }
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to load land availability data: ' + error.message,
    });
  }
}

async function fetchLand() {
  try {
    const { data } = await API.lands.getLand(props.landId);
    land.value = data.data
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to load land data: ' + error.message,
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
  if (props.landId) {
    await fetchLand();
  }
  if (!isNewRecord.value) {
    await fetchAvailability();
  }
  await Promise.all([
    fetchBrokers(),
    fetchLandConditions(),
    fetchDeals(),
    fetchStateService(),
  ])
  Swal.close()
});

async function saveOptionGeneral(field, values, update = false) {
  try {
    let data;
    if (['broker_id'].includes(field)) {
      const body = {
        name: values.name,
      }
      if (update) {
        ({ data } = await API.brokers.updateBroker(values.id, body));
      } else {
        ({ data } = await API.brokers.createBroker(body));
        availability[field] = data.data.id
      }
      await fetchBrokers()
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
      ({ data } = await API.brokers.deleteBroker(option.id));
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
  <div>
    <CCard>
      <CCardHeader class="d-flex justify-content-between align-items-center">
        <h3>{{ isNewRecord ? 'New Land Availability' : 'Edit Land Availability' }}</h3>
        <CButton color="primary" variant="outline" @click="handleReturn">
          List
        </CButton>
      </CCardHeader>
      
      <CCardBody>
        <form @submit.prevent="saveAvailability" ref="formHtmlElement">
          <CCard class="mb-4">
            <CCardHeader>Basic Information</CCardHeader>
            <CCardBody>
              <div class="row">

                <div class="col-md-6 mb-3">
                  <CFormLabel>Land Condition</CFormLabel>
                  <MASelect
                    v-model="availability.land_condition"
                    :options="landConditions.items"
                    :reduce="option => option.value"
                    label="label"
                    required
                    placeholder="Select..."
                    :loading="landConditions.loading"
                  />
                </div>

                <div class="col-md-6 mb-3">
                  <CFormLabel>Natural Gas</CFormLabel>
                  <MASelect
                    v-model="availability.natural_gas"
                    :options="stateServices.items"
                    :reduce="option => option.value"
                    label="label"
                    required
                    placeholder="Select..."
                    :loading="stateServices.loading"
                  />
                </div>

                <div class="col-md-6 mb-3">
                  <CFormLabel>Sewage</CFormLabel>
                  <MASelect
                    v-model="availability.sewage"
                    :options="stateServices.items"
                    :reduce="option => option.value"
                    label="label"
                    required
                    placeholder="Select..."
                    :loading="stateServices.loading"
                  />
                </div>

                <div class="col-md-6 mb-3">
                  <CFormLabel>Water</CFormLabel>
                  <MASelect
                    v-model="availability.water"
                    :options="stateServices.items"
                    :reduce="option => option.value"
                    label="label"
                    required
                    placeholder="Select..."
                    :loading="stateServices.loading"
                  />
                </div>

                <div class="col-md-6 mb-3">
                  <CFormLabel>Electric</CFormLabel>
                  <MASelect
                    v-model="availability.electric"
                    :options="stateServices.items"
                    :reduce="option => option.value"
                    label="label"
                    required
                    placeholder="Select..."
                    :loading="stateServices.loading"
                  />
                </div>

                <div class="col-md-6 mb-3">
                  <label class="form-label">KVAS</label>
                  <CFormInput
                    type="number"
                    v-model="availability.kvas"
                  />
                  <!-- <CInputGroup>
                    <CFormInput
                      type="number"
                      v-model="availability.kvas_value_1"
                      placeholder="value 1"
                      @blur="validateRangeKvas"
                    />
                    <CInputGroupText>@</CInputGroupText>
                    <CFormInput
                      type="number"
                      v-model="availability.kvas_value_2"
                      placeholder="value 2"
                      @blur="validateRangeKvas"
                    />
                  </CInputGroup> -->
                </div>

                <div class="col-md-6 mb-3">
                  <CFormLabel>Listing Broker</CFormLabel>
                  <MASelect
                    v-model="availability.avl_broker_id"
                    :options="brokers.items"
                    :reduce="option => option.id"
                    label="name"
                    placeholder="Select..."
                    :loading="brokers.loading"
                    edit-options
                    @submitOption="(option, update) => { saveOptionGeneral('broker_id', option, update) }"
                    @deleteOption="(option) => { deleteOptionGeneral('broker_id', option) }"
                  />
                </div>

                <div class="col-md-6 mb-3">
                  <CFormLabel>Size (ha)</CFormLabel>
                  <CFormInput
                    type="number"
                    v-model="availability.avl_size_ha"
                  />
                </div>

                <div class="col-md-6 mb-3">
                  <label class="form-label">Rail Spur</label>
                  <CFormSwitch
                    size="lg"
                    v-model="availability.rail_spur"
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
                  <CFormLabel>Minimun</CFormLabel>
                  <CFormInput
                    type="number"
                    v-model="availability.avl_minimum"
                  />
                </div>

                <div class="col-md-6 mb-3">
                  <CFormLabel>Availability Since</CFormLabel>
                  <CDatePicker
                    v-model:date="availability.avl_date"
                  />
                </div>

                <div class="col-md-6 mb-3">
                  <CFormLabel>Minimum sale</CFormLabel>
                  <CFormInput
                    type="number"
                    v-model="availability.avl_min_sale"
                    step="0.01"
                  />
                </div>

                <div class="col-md-6 mb-3">
                  <CFormLabel>Maximum sale</CFormLabel>
                  <CFormInput
                    type="number"
                    v-model="availability.avl_max_sale"
                    step="0.01"
                  />
                </div>

                <div class="col-md-6 mb-3">
                  <label class="form-label">Deal *</label>
                  <MASelect
                    v-model="availability.avl_deal"
                    :options="deals.items"
                    :reduce="option => option.value"
                    label="label"
                    required
                    placeholder="Select..."
                    :loading="deals.loading"
                  />
                </div>

                <div class="col-md-6 mb-3">
                  <CFormLabel>Comments</CFormLabel>
                  <CFormTextarea
                    v-model="availability.avl_comments"
                    rows="3"
                  />
                </div>
                  
                <div class="col-md-6 mb-3">
                  <label class="form-label">Conditioned Construction</label>
                  <CFormSwitch
                    size="lg"
                    v-model="availability.avl_conditioned_construction"
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
</style>