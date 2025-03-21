<script setup>
import { onMounted, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import { AxiosError } from 'axios';
import dayjs from 'dayjs';

import { API } from '../../../services';
import { ROUTE_NAMES } from '../../../router/routeNames';
import MASelect from '../../../components/MASelect.vue';

const router = useRouter()
const route = useRoute()

const props = defineProps({
  marketGrowthId: Number
})

const emit = defineEmits(['submitting'])

const marketGrowthEmpty = {
  building_id: '',
  owner_id: '',
  developer_id: '',
  builder_id: '',
  industrial_park_id: '',
  region_id: '',
  market_id: '',
  sub_market_id: '',
  size_sf: '',
  deal: '',
  type: '',
  start_date: '',
  end_date: '',
  comments: '',
  latitude: '',
  longitude: '',
}

const marketGrowth = reactive({ ...marketGrowthEmpty })
const formHtmlElement = ref(null)

async function onSubmit() {
  emit('submitting', true)
  try {
    let data;
    const body = {
      ...marketGrowth,
      start_date: marketGrowth.start_date ? dayjs(marketGrowth.start_date).format('YYYY-MM-DD') : '',
      end_date: marketGrowth.end_date ? dayjs(marketGrowth.end_date).format('YYYY-MM-DD') : '',
    }
    if (props.marketGrowthId) {
      ({ data } = await API.marketGrowth.updateMarketGrowth(props.marketGrowthId, body));
    } else {
      ({ data } = await API.marketGrowth.createMarketGrowth(body));
    }
    emit('submitting', false)
    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: data.message,
    });
    router.push({ name: ROUTE_NAMES.MARKET_GROWTH_INDEX })
  } catch (e) {
    emit('submitting', false)
    Swal.fire(e.response.data.message, JSON.stringify(e.response.data.errors), 'error')
  }
}

async function fetchMarketGrowth() {
  try {
    const { data } = await API.marketGrowth.getMarketGrowth(props.marketGrowthId);
    ['building_id', 'owner_id', 'developer_id', 'builder_id', 'industrial_park_id', 'region_id', 'market_id', 'sub_market_id']
    .forEach(prop => marketGrowth[prop] = data.data[prop] ? +(data.data[prop]) : '');
    ['size_sf', 'deal', 'type', 'comments', 'latitude', 'longitude']
    .forEach(prop => marketGrowth[prop] = data.data[prop] ? `${data.data[prop]}` : '');
    
    if (data.data.start_date) {
      marketGrowth.start_date = dayjs(data.data.start_date).format('YYYY-MM-DD')
    }
    if (data.data.end_date) {
      marketGrowth.end_date = dayjs(data.data.end_date).format('YYYY-MM-DD')
    }
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to load market growth data: ' + error.message,
    });
  }
}

const regions = reactive({ loading: false, items: []})
const markets = reactive({ loading: false, items: []})
const submarkets = reactive({ loading: false, items: []})
const industrialParks = reactive({ loading: false, items: []})
const buildings = reactive({ loading: false, items: []})
const owners = reactive({ loading: false, items: []})
const developers = reactive({ loading: false, items: []})
const builders = reactive({ loading: false, items: []})
const deals = reactive({ loading: false, items: []})
const types = reactive({ loading: false, items: []})

async function fetchDeals() {
  deals.loading = true
  try {
    // Valores estáticos para deals
    const data = {
      'SALE': 'Sale',
      'LEASE': 'Lease',
    }
    deals.items = Object.entries(data).map(([value, label]) => ({ value, label }))
  } catch (error) {
    console.error('Error setting deals:', error)
  } finally {
    deals.loading = false
  }
}

async function fetchTypes() {
  types.loading = true
  try {
    // Valores estáticos para types
    const data = {
      'EXPANSION': 'Expansion',
      'NEW': 'New',
      'RELOCATION': 'Relocation'
    }
    types.items = Object.entries(data).map(([value, label]) => ({ value, label }))
  } catch (error) {
    console.error('Error setting types:', error)
  } finally {
    types.loading = false
  }
}

async function fetchBuildings(marketId, submarketId, industrialParkId) {
  buildings.loading = true
  try {
    const { data } = await API.buildings.getBuildings({
      marketId,
      submarketId,
      industrial_park_id: industrialParkId,
      page: 1,
      size: 100,
    });
    
    buildings.items = data.data.data
      .filter(building => building.industrial_park_id === industrialParkId)
      .map(building => ({
        id: building.id,
        name: building.building_name || `Building ${building.id}`,
        size_sf: building.building_size_sf,
        marketName: building.marketName,
        submarketName: building.submarketName,
        industrialParkName: building.industrialParkName
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error('Error fetching buildings:', error);
    buildings.items = [];
  } finally {
    buildings.loading = false;
  }
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
    fetchDeals(),
    fetchTypes(),
  ])
  if (props.marketGrowthId) {
    await fetchMarketGrowth();
  }
  Swal.close()
});

// Watch for changes in region/market/submarket to update dependent dropdowns
watch(() => marketGrowth.region_id, async (newValue) => {
  if (newValue) {
    await fetchMarkets(newValue)
  } else {
    markets.items = []
  }
  marketGrowth.market_id = ''
  marketGrowth.sub_market_id = ''
})

watch(() => marketGrowth.market_id, async (newValue) => {
  if (newValue) {
    await fetchSubmarkets(newValue)
  } else {
    submarkets.items = []
  }
  marketGrowth.sub_market_id = ''
})

watch(() => marketGrowth.sub_market_id, async (newValue) => {
  if (newValue) {
    await Promise.all([
      fetchIndustrialParks(marketGrowth.market_id, newValue),
      fetchOwners(marketGrowth.market_id, newValue),
      fetchDevelopers(marketGrowth.market_id, newValue),
      fetchBuilders(marketGrowth.market_id, newValue),
    ])
  } else {
    buildings.items = []
    industrialParks.items = []
    owners.items = []
    developers.items = []
    builders.items = []
  }
})

watch(() => marketGrowth.industrial_park_id, async (newValue) => {
  if (newValue && marketGrowth.market_id && marketGrowth.sub_market_id) {
    await fetchBuildings(
      marketGrowth.market_id, 
      marketGrowth.sub_market_id, 
      newValue
    )
  } else {
    buildings.items = []
    marketGrowth.building_id = ''
  }
})

async function saveOptionGeneral(field, values, update = false) {
  try {
    let data;
    if (['owner_id', 'developer_id', 'builder_id'].includes(field)) {
      const body = {
        name: values.name,
        is_builder: field === 'builder_id' || !!values.is_builder,
        is_developer: field === 'developer_id' || !!values.is_developer,
        is_owner: field === 'owner_id' || !!values.is_owner,
        market_id: marketGrowth.market_id,
        sub_market_id: marketGrowth.sub_market_id
      }
      if (update) {
        ({ data } = await API.developers.updateDeveloper(values.id, body));

        if (marketGrowth.owner_id === data.data.id && data.data.is_owner === false) marketGrowth.owner_id = ''
        if (marketGrowth.developer_id === data.data.id && data.data.is_developer === false) marketGrowth.developer_id = ''
        if (marketGrowth.builder_id === data.data.id && data.data.is_builder === false) marketGrowth.builder_id = ''
      } else {
        ({ data } = await API.developers.createDeveloper(body));
        marketGrowth[field] = data.data.id
      }
      await Promise.all([
        fetchOwners(marketGrowth.market_id, marketGrowth.sub_market_id),
        fetchDevelopers(marketGrowth.market_id, marketGrowth.sub_market_id),
        fetchBuilders(marketGrowth.market_id, marketGrowth.sub_market_id),
      ])
    } else if (field === 'industrial_park_id') {
      const body = {
        name: values.name,
        market_id: marketGrowth.market_id,
        sub_market_id: marketGrowth.sub_market_id
      }
      if (update) {
        ({ data } = await API.industrialparks.updateIndustrialPark(values.id, body))
      } else {
        ({ data } = await API.industrialparks.createIndustrialPark(body))
        marketGrowth[field] = data.data.id
      }
      await fetchIndustrialParks(marketGrowth.market_id, marketGrowth.sub_market_id)
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

async function deleteOptionGeneral(field, option) {
  try {
    if (['owner_id', 'developer_id', 'builder_id'].includes(field)) {
      await API.developers.deleteDeveloper(option.id)
      await Promise.all([
        fetchOwners(marketGrowth.market_id, marketGrowth.sub_market_id),
        fetchDevelopers(marketGrowth.market_id, marketGrowth.sub_market_id),
        fetchBuilders(marketGrowth.market_id, marketGrowth.sub_market_id),
      ])
    } else if (field === 'industrial_park_id') {
      await API.industrialparks.deleteIndustrialPark(option.id)
      await fetchIndustrialParks(marketGrowth.market_id, marketGrowth.sub_market_id)
    }
  } catch (error) {
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
  <form @submit.prevent="onSubmit" ref="formHtmlElement">
    <CRow>
      <CCol>
        <CRow>
          <!-- *** BASIC INFORMATION *** -->
          <CCard class="mb-4 p-0">
            <CCardHeader>Basic Information</CCardHeader>
            <CCardBody>
              <div class="row">
                <div class="col-md-4 mt-2">
                  <label class="form-label">Type *</label>
                  <MASelect
                    v-model="marketGrowth.type"
                    :options="types.items"
                    :reduce="option => option.value"
                    label="label"
                    required
                    placeholder="Select..."
                    :loading="types.loading"
                  />
                </div>

                <div class="col-md-4 mt-2">
                  <label class="form-label">Deal *</label>
                  <MASelect
                    v-model="marketGrowth.deal"
                    :options="deals.items"
                    :reduce="option => option.value"
                    label="label"
                    required
                    placeholder="Select..."
                    :loading="deals.loading"
                  />
                </div>

                <div class="col-md-4 mt-2">
                  <label class="form-label">Size SF *</label>
                  <CFormInput
                    type="number"
                    v-model="marketGrowth.size_sf"
                    required
                  />
                </div>

                <div class="col-md-4 mt-2">
                  <label class="form-label">Start Date *</label>
                  <CDatePicker
                    v-model:date="marketGrowth.start_date"
                    required
                  />
                </div>

                <div class="col-md-4 mt-2">
                  <label class="form-label">End Date</label>
                  <CDatePicker
                    v-model:date="marketGrowth.end_date"
                  />
                </div>

                <div class="col-md-4 mt-2">
                  <label class="form-label">Comments</label>
                  <CFormTextarea
                    v-model="marketGrowth.comments"
                    rows="3"
                  />
                </div>
              </div>
            </CCardBody>
          </CCard>

          <!-- *** LOCATION *** -->
          <CCard class="mb-4 p-0">
            <CCardHeader>Location</CCardHeader>
            <CCardBody>
              <div class="row">
                <div class="col-md-4 mt-2">
                  <label class="form-label">Region *</label>
                  <MASelect
                    v-model="marketGrowth.region_id"
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
                    v-model="marketGrowth.market_id"
                    :options="markets.items"
                    :reduce="option => option.value"
                    label="label"
                    placeholder="Select..."
                    :loading="markets.loading"
                    :disabled="!marketGrowth.region_id"
                    required
                  />
                </div>

                <div class="col-md-4 mt-2">
                  <label class="form-label">Submarket *</label>
                  <MASelect
                    v-model="marketGrowth.sub_market_id"
                    :options="submarkets.items"
                    :reduce="option => option.value"
                    label="label"
                    placeholder="Select..."
                    :loading="submarkets.loading"
                    :disabled="!marketGrowth.market_id"
                    required
                  />
                </div>

                <div class="col-md-4 mt-2">
                  <label class="form-label">Industrial Park *</label>
                  <MASelect
                    v-model="marketGrowth.industrial_park_id"
                    :options="industrialParks.items"
                    :reduce="option => option.id"
                    label="name"
                    placeholder="Select..."
                    :loading="industrialParks.loading"
                    :disabled="!marketGrowth.sub_market_id"
                    required
                    edit-options
                    @submitOption="(option, update) => { saveOptionGeneral('industrial_park_id', option, update) }"
                    @deleteOption="(option) => { deleteOptionGeneral('industrial_park_id', option) }"
                  />
                </div>

                <div class="col-md-4 mt-2">
                  <label class="form-label">Building</label>
                  <MASelect
                    v-model="marketGrowth.building_id"
                    :options="buildings.items"
                    :reduce="option => option.id"
                    label="name"
                    placeholder="Select..."
                    :loading="buildings.loading"
                    :disabled="!marketGrowth.sub_market_id"
                  >
                    <template #option="{ name, size_sf, industrialParkName }">
                      {{ name }} - {{ size_sf }} SF - {{ industrialParkName }}
                    </template>
                  </MASelect>
                </div>

                <div class="col-md-4 mt-2">
                  <CFormInput
                    type="text"
                    label="Latitude *"
                    v-model="marketGrowth.latitude"
                    required
                  />
                </div>

                <div class="col-md-4 mt-2">
                  <CFormInput
                    type="text"
                    label="Longitude *"
                    v-model="marketGrowth.longitude"
                    required
                  />
                </div>
              </div>
            </CCardBody>
          </CCard>

          <!-- *** PROPERTY DETAILS *** -->
          <CCard class="mb-4 p-0">
            <CCardHeader>Property Details</CCardHeader>
            <CCardBody>
              <div class="row">
                <div class="col-md-4 mt-2">
                  <label class="form-label">Owner *</label>
                  <MASelect
                    v-model="marketGrowth.owner_id"
                    :options="owners.items"
                    :reduce="option => option.id"
                    label="name"
                    placeholder="Select..."
                    :loading="owners.loading"
                    :disabled="!marketGrowth.sub_market_id"
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

                <div class="col-md-4 mt-2">
                  <label class="form-label">Developer *</label>
                  <MASelect
                    v-model="marketGrowth.developer_id"
                    :options="developers.items"
                    :reduce="option => option.id"
                    label="name"
                    placeholder="Select..."
                    :loading="developers.loading"
                    :disabled="!marketGrowth.sub_market_id"
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

                <div class="col-md-4 mt-2">
                  <label class="form-label">Builder *</label>
                  <MASelect
                    v-model="marketGrowth.builder_id"
                    :options="builders.items"
                    :reduce="option => option.id"
                    label="name"
                    placeholder="Select..."
                    :loading="builders.loading"
                    :disabled="!marketGrowth.sub_market_id"
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
              </div>
            </CCardBody>
          </CCard>
        </CRow>
      </CCol>
    </CRow>
  </form>
</template> 