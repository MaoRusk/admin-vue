<script setup>
import { computed, onMounted, reactive, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Swal from 'sweetalert2';

import { API } from '../../../services';
import { ROUTE_NAMES } from '../../../router/routeNames';
import MASelect from '../../../components/MASelect.vue';
import { useAuthStore } from '../../../stores/auth';

const router = useRouter()
const route = useRoute()
const { can } = useAuthStore()

watch(
  () => route.params.reitAnnualId,
  () => {
    fetchReit()
  }
)

const reitAnnualId = computed(() => Number(route.params.reitAnnualId) || null)
const isReitAnnual = computed(() => [ROUTE_NAMES.REIT_ANNUAL_CREATE, ROUTE_NAMES.REIT_ANNUAL_UPDATE].includes(route.name))
const reitType = computed(() => isReitAnnual.value ? 'annual' : 'quarter')
const routeIndex = computed(() => isReitAnnual.value ? ROUTE_NAMES.REIT_ANNUAL_INDEX : ROUTE_NAMES.REIT_QUARTER_INDEX)

const reitEmpty = {
  reit_id: '',
  year: '',
  quarter: '',
  noi: '',
  cap_rate: '',
  occupancy: '',
  m2: '',
  sqft: '',
  buildings: '',
  customer_retention_rate: '',
  average_rent: '',
  contracts: '',
  rental_income: '',
  dolar: '',
  prop_investment: '',
}

const reit = reactive({ ...reitEmpty })

async function onSubmit() {
  try {
    let data;
    const body = {
      ...reit,
      type: reitType.value
    }
    if (reitAnnualId.value) {
      ({ data } = await API.ReitAnnual.updateReitAnnual(reitAnnualId.value, body));
    } else {
      ({ data } = await API.ReitAnnual.createReitAnnual(body));
    }
    console.log(data)
    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: `Reit ${reitType.value} saved successfully`,
    });
    router.push({ name: routeIndex.value })
  } catch (e) {
    Swal.fire(e.response.data.message, JSON.stringify(e.response.data.errors), 'error')
  }
}

async function fetchReit() {
  try {
    const { data } = await API.ReitAnnual.getReitAnnual(reitAnnualId.value);
    ['reit_id']
    .forEach(prop => reit[prop] = data.data[prop] ? +(data.data[prop]) : '');
    ['year', 'quarter', 'noi', 'cap_rate', 'occupancy', 'm2', 'sqft', 'buildings', 'customer_retention_rate', 'average_rent', 'contracts', 'rental_income', 'dolar', 'prop_investment']
    .forEach(prop => reit[prop] = data.data[prop] ? `${data.data[prop]}` : '');
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to load reits data: ' + error.message,
    });
  }
}

const reits = reactive({ loading: false, items: []})

async function fetchReits() {
  reits.loading = true
  const data = await API.reits.getReits()
  reits.loading = false
  reits.items = data.sort((a, b) => a.name.localeCompare(b.name))
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
    fetchReits(),
  ])
  if (reitAnnualId.value) {
    await fetchReit();
  }
  Swal.close()
});
</script>
<template>
  <form @submit.prevent="onSubmit">
    <CRow>
      <CCol xs="12">
        <CRow>
          <CCard class="">
            <CCardBody>
              <div class="row">
                <div class="col-md-4 mt-2">
                  <label class="form-label">REIT *</label>
                  <MASelect
                    v-model="reit.reit_id"
                    :options="reits.items"
                    :reduce="option => option.id"
                    label="name"
                    required
                    placeholder="Select..."
                    :loading="reits.loading"
                  />
                </div>

                <div class="col-md-4 mt-2">
                  <label class="form-label">Year *</label>
                  <CDatePicker v-model:date="reit.year" locale="en-US" selectionType="year" required />
                </div>

                <div v-if="reitType === 'quarter'" class="col-md-4 mt-2">
                  <label class="form-label">Quarter *</label>
                  <MASelect
                    v-model="reit.quarter"
                    :options="['Q1', 'Q2', 'Q3', 'Q4']"
                    required
                    placeholder="Select..."
                  />
                </div>

                <div class="col-md-4 mt-2">
                  <CFormInput
                    type="number"
                    label="Noi *"
                    v-model="reit.noi"
                    min="0"
                    max="999999.99"
                    step=".01"
                    required
                  />
                </div>

                <div class="col-md-4 mt-2">
                  <CFormInput
                    type="number"
                    label="Cap Rate *"
                    v-model="reit.cap_rate"
                    min="0"
                    max="99.99"
                    step=".01"
                    required
                  />
                </div>

                <div class="col-md-4 mt-2">
                  <CFormInput
                    type="number"
                    label="Occupancy *"
                    v-model="reit.occupancy"
                    min="0"
                    max="100"
                    required
                  />
                </div>

                <div class="col-md-4 mt-2">
                  <CFormInput
                    type="number"
                    label="M2"
                    v-model="reit.m2"
                    min="0"
                  />
                </div>

                <div class="col-md-4 mt-2">
                  <CFormInput
                    type="number"
                    label="sqft *"
                    v-model="reit.sqft"
                    min="0"
                    max="9999999999.99"
                    step=".01"
                    required
                  />
                </div>

                <div class="col-md-4 mt-2">
                  <CFormInput
                    type="number"
                    label="Buildings *"
                    v-model="reit.buildings"
                    min="0"
                    required
                  />
                </div>

                <div class="col-md-4 mt-2">
                  <CFormInput
                    type="number"
                    label="Customer retention rate *"
                    v-model="reit.customer_retention_rate"
                    min="0"
                    max="100"
                    required
                  />
                </div>

                <div class="col-md-4 mt-2">
                  <CFormInput
                    type="number"
                    label="Average Rent *"
                    v-model="reit.average_rent"
                    min="0"
                    max="999999.99"
                    step=".01"
                    required
                  />
                </div>

                <div class="col-md-4 mt-2">
                  <CFormInput
                    type="number"
                    label="Rental Income *"
                    v-model="reit.rental_income"
                    min="0"
                    max="999999.99"
                    step=".01"
                    required
                  />
                </div>

                <div class="col-md-4 mt-2">
                  <CFormInput
                    type="number"
                    label="Prop Investment *"
                    v-model="reit.prop_investment"
                    min="0"
                    max="999999.99"
                    step=".01"
                    required
                  />
                </div>

                <div class="col-md-4 mt-2">
                  <CFormInput
                    type="number"
                    label="Dolar *"
                    v-model="reit.dolar"
                    min="0"
                    max="9999.99"
                    step=".01"
                    required
                  />
                </div>

                <div class="col-md-4 mt-2">
                  <CFormInput
                    type="number"
                    label="Contracts *"
                    v-model="reit.contracts"
                    min="0"
                    max="99.99"
                    step=".01"
                    required
                  />
                </div>

              </div>

              <CRow class="mt-3">
                  <CCol>
                    <CButton color="primary" type="submit" v-if="can('reit-annual.update', 'reit-annual.create')">
                      Save
                    </CButton>
                    <CButton 
                      color="secondary" 
                      variant="outline" 
                      class="ms-2"
                      @click="this.$router.back()"
                    >
                      Cancel
                    </CButton>
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