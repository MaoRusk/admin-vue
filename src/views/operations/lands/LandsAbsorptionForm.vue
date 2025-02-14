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
  absorptionId: {
    type: Number,
  },
});

const emit = defineEmits(['return', 'submitting']);

const isNewRecord = computed(() => !props.absorptionId);

const land = ref(null)

const absorptionObj = {
  land_id: props.landId,
  land_condition: '',
  natural_gas: '',
  sewage: '',
  water: '',
  electric: '',
  kvas: '',
  rail_spur: false,
  abs_size_ha: '',
  abs_date: '',
  abs_comments: '',
  abs_broker_id: '',
  abs_company_id: '',
  abs_country_id: '',
  abs_industry_id: '',
  abs_closing_price: '',
  abs_type_buyer: '',
  abs_company_type: '',
  abs_final_use: '',
  abs_kvas_price: '',
}

const absorption = reactive({...absorptionObj})
const formHtmlElement = ref(null)

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
      abs_date: absorption.abs_date ? dayjs(absorption.abs_date).format('YYYY-MM-DD') : '',
    }
    let data;
    if (isNewRecord.value) {
      ({ data } = await API.landsAbsorption.createLandAbsorption(props.landId, body));
    } else {
      ({ data } = await API.landsAbsorption.updateLandAbsorption(props.landId, props.absorptionId, body));
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
const landConditions = reactive({ loading: false, items: []})
const companyTypes = reactive({ loading: false, items: []})
const finalUses = reactive({ loading: false, items: []})
const industries = reactive({ loading: false, items: []})
const countries = reactive({ loading: false, items: []})
const companies = reactive({ loading: false, items: []})
const typesBuyers = reactive({ loading: false, items: []})

async function fetchTypesBuyers() {
  typesBuyers.loading = true
  const { data } = await new Promise(r => {
    r({
      data: {
        data: {
          'User': 'User',
          'Developer': 'Developer',
        }
      }
    })
  })
  typesBuyers.loading = false
  typesBuyers.items = Object.values(data.data).map(value => ({ value, label: value }))
}

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

async function fetchBrokers() {
  brokers.loading = true
  const { data } = await API.brokers.getBrokers();
  brokers.loading = false
  brokers.items = data.data.sort((a, b) => a.name.localeCompare(b.name))
}

async function fetchCompanies() {
  companies.loading = true
  const { data } = await API.companies.getCompanies();
  companies.loading = false
  companies.items = data.data.sort((a, b) => a.name.localeCompare(b.name))
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

async function fetchAbsorption() {
  try {
    const { data } = await API.landsAbsorption.getLandAbsorption(props.landId, props.absorptionId);
    ['land_condition', 'natural_gas', 'sewage', 'water', 'electric', 'kvas', 'rail_spur', 'abs_size_ha', 'abs_date', 'abs_comments', 'abs_closing_price', 'abs_type_buyer', 'abs_company_type', 'abs_final_use', 'abs_kvas_price']
    .forEach(prop => absorption[prop] = `${data.data[prop] ?? ''}`);
    ['abs_broker_id', 'abs_company_id', 'abs_country_id', 'abs_industry_id']
    .forEach(prop => absorption[prop] = data.data[prop] ? +data.data[prop] : '');
    ['rail_spur']
    .forEach(prop => absorption[prop] = Boolean(data.data[prop]));

  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to load land absorption data: ' + error.message,
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
    await fetchAbsorption();
  }
  await Promise.all([
    fetchBrokers(),
    fetchLandConditions(),
    fetchStateService(),
    fetchCompanyTypes(),
    fetchFinalUses(),
    fetchCompanies(),
    fetchIndustries(),
    fetchCountries(),
    fetchTypesBuyers(),
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
        absorption[field] = data.data.id
      }
      await fetchBrokers()
    } else if (field === 'abs_company_id') {
      const body = {
        name: values.name,
      }
      if (update) {
        ({ data } = await API.companies.updateCompany(values.id, body));
      } else {
        ({ data } = await API.companies.createCompany(body));
        absorption[field] = data.data.id
      }
      await fetchCompanies()
    } else if (field === 'abs_industry_id') {
      const body = {
        name: values.name,
      }
      if (update) {
        ({ data } = await API.industries.updateIndustry(values.id, body));
      } else {
        ({ data } = await API.industries.createIndustry(body));
        absorption[field] = data.data.id
      }
      await fetchIndustries()
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
    } else if (field === 'abs_company_id') {
      ({ data } = await API.companies.deleteCompany(option.id));
      await fetchCompanies();
    } else if (field === 'abs_industry_id') {
      ({ data } = await API.industries.deleteIndustry(option.id));
      await fetchIndustries();
    }
    console.info(data)
    if (absorption[field] === option.id) {
      absorption[field] = ''
    }
  } catch (error) {
    console.error('Error:', error);
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
        <h3>{{ isNewRecord ? 'New Land Absorption' : 'Edit Land Absorption' }}</h3>
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

                <div class="col-md-6 mb-3">
                  <CFormLabel>Land Condition</CFormLabel>
                  <MASelect
                    v-model="absorption.land_condition"
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
                    v-model="absorption.natural_gas"
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
                    v-model="absorption.sewage"
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
                    v-model="absorption.water"
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
                    v-model="absorption.electric"
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
                    v-model="absorption.kvas"
                  />
                </div>

                <div class="col-md-6 mb-3">
                  <label class="form-label">KVAS Price</label>
                  <CFormInput
                    type="number"
                    v-model="absorption.abs_kvas_price"
                  />
                </div>

                <div class="col-md-6 mb-3">
                  <CFormLabel>Listing Broker</CFormLabel>
                  <MASelect
                    v-model="absorption.abs_broker_id"
                    :options="brokers.items"
                    :reduce="option => option.id"
                    label="name"
                    placeholder="Select..."
                    :loading="brokers.loading"
                    edit-options
                    @submitOption="(option, update) => { saveOptionGeneral('abs_broker_id', option, update) }"
                    @deleteOption="(option) => { deleteOptionGeneral('abs_broker_id', option) }"
                  />
                </div>

                <div class="col-md-6 mb-3">
                  <CFormLabel>Company</CFormLabel>
                  <MASelect
                    v-model="absorption.abs_company_id"
                    :options="companies.items"
                    :reduce="option => option.id"
                    label="name"
                    placeholder="Select..."
                    :loading="companies.loading"
                    edit-options
                    @submitOption="(option, update) => { saveOptionGeneral('abs_company_id', option, update) }"
                    @deleteOption="(option) => { deleteOptionGeneral('abs_company_id', option) }"
                  />
                </div>

                <div class="col-md-6 mb-3">
                  <CFormLabel>Industry</CFormLabel>
                  <MASelect
                    v-model="absorption.abs_industry_id"
                    :options="industries.items"
                    :reduce="option => option.id"
                    label="name"
                    placeholder="Select..."
                    :loading="industries.loading"
                    edit-options
                    @submitOption="(option, update) => { saveOptionGeneral('abs_industry_id', option, update) }"
                    @deleteOption="(option) => { deleteOptionGeneral('abs_industry_id', option) }"
                  />
                </div>

                <div class="col-md-6 mb-3">
                  <CFormLabel>Country</CFormLabel>
                  <MASelect
                    v-model="absorption.abs_country_id"
                    :options="countries.items"
                    :reduce="option => option.id"
                    label="name"
                    placeholder="Select..."
                    :loading="countries.loading"
                  />
                </div>

                <div class="col-md-6 mb-3">
                  <CFormLabel>Size (ha)</CFormLabel>
                  <CFormInput
                    type="number"
                    v-model="absorption.abs_size_ha"
                  />
                </div>

                <div class="col-md-6 mb-3">
                  <CFormLabel>Closing Price</CFormLabel>
                  <CFormInput
                    type="number"
                    v-model="absorption.abs_closing_price"
                  />
                </div>

                <div class="col-md-6 mb-3">
                  <CFormLabel>Absorption Date</CFormLabel>
                  <CDatePicker
                    v-model:date="absorption.abs_date"
                  />
                </div>

                <div class="col-md-6 mb-3">
                  <label class="form-label">Type Buyer</label>
                  <MASelect
                    v-model="absorption.abs_type_buyer"
                    :options="typesBuyers.items"
                    :reduce="option => option.value"
                    label="label"
                    required
                    placeholder="Select..."
                    :loading="typesBuyers.loading"
                  />
                </div>

                <div class="col-md-6 mb-3">
                  <label class="form-label">Company Type</label>
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

                <div class="col-md-6 mb-3">
                  <label class="form-label">Final Use</label>
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

                <div class="col-md-6 mb-3">
                  <CFormLabel>Comments</CFormLabel>
                  <CFormTextarea
                    v-model="absorption.abs_comments"
                    rows="3"
                  />
                </div>

                <div class="col-md-6 mb-3">
                  <label class="form-label">Rail Spur</label>
                  <CFormSwitch
                    size="lg"
                    v-model="absorption.rail_spur"
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