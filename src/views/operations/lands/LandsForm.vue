<script setup>
import { onMounted, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import { AxiosError } from 'axios';

import { API } from '../../../services';
import { ROUTE_NAMES } from '../../../router/routeNames';
import MASelect from '../../../components/MASelect.vue';

const router = useRouter()
const route = useRoute()

watch(
  () => route.params.landId,
  () => {
    fetchLand()
  }
)

const props = defineProps({
  landId: Number
})

const emit = defineEmits(['submitting'])

const landEmpty = {
  region_id: '', 
  market_id: '', 
  sub_market_id: '', 
  industrial_park_id: '', 
  developer_id: '', 
  owner_id: '', 
  currency: '', 
  status: 'Active', 
  land_name: '', 
  latitud: '', 
  longitud: '', 
  size_ha: '', 
  zoning: '', 
  parcel_shape: '', 
  
  kvas_value_1: '',
  kvas_value_2: '',

  // 'contact_id' => 'nullable|integer|exists:contacts,id',
}

const land = reactive({ ...landEmpty })
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
}
const validateRangeKvas = () => {
  validateRangeInputs(land, 'kvas_value_1', 'kvas_value_2', 'KVAS');
}

async function onSubmit() {
  emit('submitting', true)
  try {
    let data;
    const body = {
      ...land,
      kvas: (land.kvas_value_1 && land.kvas_value_2) ? `${land.kvas_value_1}${VALUE_SEPARATOR}${land.kvas_value_2}` : '',
    }
    if (props.landId) {
      ({ data } = await API.lands.updateLand(props.landId, body));
    } else {
      ({ data } = await API.lands.createLand(body));
    }
    emit('submitting', false)
    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: data.message,
    });
    router.push({ name: ROUTE_NAMES.LANDS_INDEX })
  } catch (e) {
    emit('submitting', false)
    Swal.fire(e.response.data.message, JSON.stringify(e.response.data.errors), 'error')
  }
}

async function fetchLand() {
  try {
    const { data } = await API.lands.getLand(props.landId);
    ['region_id', 'market_id', 'sub_market_id', 'industrial_park_id', 'developer_id', 'owner_id']
    .forEach(prop => land[prop] = data.data[prop] ? +(data.data[prop]) : '');
    ['currency', 'status', 'land_name', 'latitud', 'longitud', 'size_ha', 'zoning', 'parcel_shape']
    .forEach(prop => land[prop] = data.data[prop] ? `${data.data[prop]}` : '');
    if (data.data.kvas && data.data.kvas.length > VALUE_SEPARATOR.length) {
      ([land.kvas_value_1, land.kvas_value_2] = data.data.kvas.split(VALUE_SEPARATOR))
    }
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to load land data: ' + error.message,
    });
  }
}

const statuses = reactive({ loading: false, items: []})
const regions = reactive({ loading: false, items: []})
const markets = reactive({ loading: false, items: []})
const industrialParks = reactive({ loading: false, items: []})
const submarkets = reactive({ loading: false, items: []})
const owners = reactive({ loading: false, items: []})
const developers = reactive({ loading: false, items: []})
const currencies = reactive({ loading: false, items: []})
const parcelShape = reactive({ loading: false, items: []})
const zoning = reactive({ loading: false, items: []})

async function fetchLandParcelShape() {
  parcelShape.loading = true
  const { data } = await API.lands.getLandParcelShape()
  parcelShape.loading = false
  parcelShape.items = Object.values(data.data).map(value => ({ value, label: value }))
}

async function fetchZoning() {
  zoning.loading = true
  const { data } = await API.lands.getLandZoning()
  zoning.loading = false
  zoning.items = Object.values(data.data).map(value => ({ value, label: value }))
}

async function fetchBuildingStatuses() {
  statuses.loading = true
  const { data } = await API.buildings.getBuildingsStatus()
  statuses.loading = false
  statuses.items = Object.values(data.data).map(value => ({ value, label: value }))
}

async function fetchCurrencies() {
  currencies.loading = true
  const { data } = await API.currencies.getCurrencies();
  currencies.loading = false
  currencies.items = Object.values(data.data).map(value => ({ value, label: value }))
}


async function fetchDevelopers(marketId, submarketId) {
  developers.loading = true
  const data = await API.developers.getDevelopers({ is_developer: true, marketId, submarketId });
  developers.loading = false
  developers.items = data.sort((a, b) => a.name.localeCompare(b.name))
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
  const data = await API.submarkets.getSubmarkets({ market_id: marketId });
  submarkets.loading = false
  submarkets.items = data.map(({ id, name }) => ({ label: name, value: id })).sort((a, b) => a.label.localeCompare(b.label))
}

async function fetchMarkets(regionId) {
  markets.loading = true
  const data = await API.markets.getMarkets({ regionId });
  markets.loading = false
  markets.items = data.map(({ id, name }) => ({ label: name, value: id })).sort((a, b) => a.label.localeCompare(b.label))
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
    fetchRegions(),
    fetchCurrencies(),
    fetchBuildingStatuses(),
    fetchLandParcelShape(),
    fetchZoning(),
  ])
  if (props.landId) {
    await fetchLand();
  }
  Swal.close()
});

async function saveOptionGeneral(field, values, update = false) {
  try {
    let data;
    if (['owner_id', 'developer_id'].includes(field)) {
      const body = {
        name: values.name,
        is_builder: !!values.is_builder,
        is_developer: !!values.is_developer,
        is_owner: !!values.is_owner,
        market_id: land.market_id,
        sub_market_id: land.sub_market_id
      }
      if (update) {
        ({ data } = await API.developers.updateDeveloper(values.id, body));

        if (land.owner_id === data.data.id && data.data.is_owner === false) land.owner_id = ''
        if (land.developer_id === data.data.id && data.data.is_developer === false) land.developer_id = ''
      } else {
        ({ data } = await API.developers.createDeveloper(body));
        land[field] = data.data.id
      }
      await Promise.all([
        fetchOwners(land.market_id, land.sub_market_id),
        fetchDevelopers(land.market_id, land.sub_market_id),
      ])
    } else if (field === 'industrial_park_id') {
      const body = {
        name: values.name,
        market_id: land.market_id,
        sub_market_id: land.sub_market_id
      }
      if (update) {
        ({ data } = await API.industrialparks.updateIndustrialPark(values.id, body))
      } else {
        ({ data } = await API.industrialparks.createIndustrialPark(body))
        land[field] = data.data.id
      }
      await fetchIndustrialParks(land.market_id, land.sub_market_id)
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
    if (['owner_id', 'developer_id'].includes(field)) {
      ({ data } = await API.developers.deleteDeveloper(option.id));
      await fetchDevelopers();
    } else if (field === 'industrial_park_id') {
      ({ data } = await API.industrialparks.deleteIndustrialPark(option.id))
      await fetchIndustrialParks(land.market_id, land.sub_market_id)
    }
    console.info(data)
    if (land[field] === option.id) {
      land[field] = ''
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

watch(() => land.region_id, async () => {
  if (land.region_id) {
    await fetchMarkets(land.region_id)
    if (!markets.items.find(item => item.value === land.market_id)) {
      land.market_id = ''
    }
  } else {
    land.market_id = ''
  }
})

watch(() => land.market_id, async () => {
  if (land.market_id) {
    await fetchSubmarkets(land.market_id)
    if (!submarkets.items.find(item => item.value === land.sub_market_id)) {
      land.sub_market_id = ''
    }
  } else {
    land.sub_market_id = ''
  }
})

watch(() => land.sub_market_id, async () => {
  if (land.sub_market_id) {
    await Promise.all([
      fetchIndustrialParks(land.market_id, land.sub_market_id),
      fetchOwners(land.market_id, land.sub_market_id),
      fetchDevelopers(land.market_id, land.sub_market_id),
    ])
    if (!industrialParks.items.find(item => item.id === land.industrial_park_id)) land.industrial_park_id = ''
    if (!owners.items.find(item => item.id === land.owner_id)) land.owner_id = ''
    if (!developers.items.find(item => item.id === land.developer_id)) land.developer_id = ''
  } else {
    land.industrial_park_id = ''
    land.owner_id = ''
    land.developer_id = ''
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
      <CCol xs="12">
        <CRow>
          <!-- *** GENERAL INFORMATION *** -->
          <CCard id="general-information" class="card text-secondary mb-3 border-secondary card-header-customer-buildings " >
            <CCardBody class="card-body-customer-buildings">
              General Information
            </CCardBody>
          </CCard>

          <CCard class="card-customer-buildings">
            <CCardBody>
              <div class="row">
                <div class="col-md-4 mt-2">
                  <CFormInput
                    v-model="land.land_name"
                    label="Land Name *"
                    required
                  />
                </div>

                <div class="col-md-4 mt-2">
                  <CFormInput
                    v-model="land.size_ha"
                    label="Size Ha"
                    type="number"
                  />
                </div>

                <div class="col-md-4 mt-2">
                  <label class="form-label">Zoning *</label>
                  <MASelect
                    v-model="land.zoning"
                    :options="zoning.items"
                    :reduce="option => option.value"
                    label="label"
                    required
                    placeholder="Select..."
                    :loading="zoning.loading"
                  />
                </div>

                <div class="col-md-4 mt-2">
                  <label class="form-label">Parcel Shape *</label>
                  <MASelect
                    v-model="land.parcel_shape"
                    :options="parcelShape.items"
                    :reduce="option => option.value"
                    label="label"
                    required
                    placeholder="Select..."
                    :loading="parcelShape.loading"
                  />
                </div>

                <div class="col-md-4 mt-2">
                  <label class="form-label">Status *</label>
                  <MASelect
                    v-model="land.status"
                    :options="statuses.items"
                    :reduce="option => option.value"
                    label="label"
                    required
                    placeholder="Select..."
                    :loading="statuses.loading"
                  />
                </div>

                <div class="col-md-4 mt-2">
                  <label class="form-label">Currency *</label>
                  <MASelect
                    v-model="land.currency"
                    :options="currencies.items"
                    :reduce="option => option.value"
                    label="label"
                    required
                    placeholder="Select..."
                    :loading="currencies.loading"
                  />
                </div>
              </div>

              <div class="col-md-4 mt-2">
                <label class="form-label">KVAS</label>
                <CInputGroup>
                  <CFormInput
                    type="number" 
                    v-model="land.kvas_value_1"
                    placeholder="value 1"
                    @blur="validateRangeKvas"
                  />
                  <CInputGroupText>@</CInputGroupText>
                  <CFormInput 
                    type="number"
                    v-model="land.kvas_value_2"
                    placeholder="value 2"
                    @blur="validateRangeKvas"
                  />
                </CInputGroup>
              </div>
            </CCardBody>
          </CCard>
          
          <!-- *** LOCATION *** -->
          <CCard id="location" class="card text-secondary mb-3 mt-4 border-secondary card-header-customer-buildings " >
            <CCardBody class="card-body-customer-buildings">
              Location
            </CCardBody>
          </CCard>

          <div class="row">
            <div class="col-md-4 mt-2">
              <label class="form-label">Region *</label>
              <MASelect
                v-model="land.region_id"
                :options="regions.items"
                :reduce="option => option.value"
                label="label"
                required
                placeholder="Select..."
                :loading="regions.loading"
              />
            </div>

            <div class="col-md-4 mt-2">
              <label class="form-label">Market *</label>
              <MASelect
                v-model="land.market_id"
                :options="markets.items"
                :reduce="option => option.value"
                label="label"
                placeholder="Select..."
                :loading="markets.loading"
                :disabled="!land.region_id"
                required
              />
            </div>

            <div class="col-md-4 mt-2">
              <label class="form-label">Submarket *</label>
              <MASelect
                v-model="land.sub_market_id"
                :options="submarkets.items"
                :reduce="option => option.value"
                label="label"
                placeholder="Select..."
                :loading="submarkets.loading"
                :disabled="!land.market_id"
                required
              />
            </div>
            
            <div class="col-md-4 mt-2">
              <label class="form-label">Industrial Park *</label>
              <MASelect
                v-model="land.industrial_park_id"
                :options="industrialParks.items"
                :reduce="option => option.id"
                label="name"
                placeholder="Select..."
                :loading="industrialParks.loading"
                :disabled="!land.sub_market_id"
                required
                edit-options
                @submitOption="(option, update) => { saveOptionGeneral('industrial_park_id', option, update) }"
                @deleteOption="(option) => { deleteOptionGeneral('industrial_park_id', option) }"
              />
            </div>

            <div class="col-md-4 mt-2">
              <CFormInput
                type="text"
                label="Latitude *"
                v-model="land.latitud"
                required
              />
            </div>
            <div class="col-md-4 mt-2">
              <CFormInput
                type="text"
                label="Longitude *"
                v-model="land.longitud"
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
                      v-model="land.owner_id"
                      :options="owners.items"
                      :reduce="option => option.id"
                      label="name"
                      placeholder="Select..."
                      :loading="owners.loading"
                      :disabled="!land.sub_market_id"
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
                      v-model="land.developer_id"
                      :options="developers.items"
                      :reduce="option => option.id"
                      label="name"
                      placeholder="Select..."
                      :loading="developers.loading"
                      :disabled="!land.sub_market_id"
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
              </CRow>
            </CCardBody>
          </CCard>

        </CRow>
      </CCol>
    </CRow>
  </form>
</template>
<style scoped>
</style>