<script setup>
import { onMounted, reactive, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Swal from 'sweetalert2';

import { API } from '../../../services';
import { ROUTE_NAMES } from '../../../router/routeNames';
import MASelect from '../../../components/MASelect.vue';
import { computed } from 'vue';

const router = useRouter()
const route = useRoute()

watch(
  () => route.params.reitAnnualId,
  () => {
    fetchReit()
  }
)

const reitAnnualId = computed(() => Number(route.params.reitAnnualId) || null)

const reitEmpty = {
  reit_id: '', // 'required|exists:cat_reits,id',
  year: '', // 'required|integer|min:1900|max:' . date('Y'),
  quarter: '', // 'nullable|string|in:Q1,Q2,Q3,Q4',
  noi: '', // 'required|numeric|min:0|max:999999.99',
  cap_rate: '', // 'required|numeric|min:0|max:99.99',
  occupancy: '', // 'required|numeric|min:0|max:100',
  m2: '', // 'nullable|integer|min:0',
  sqft: '', // 'required|numeric|min:0|max:9999999999.99',
  buildings: '', // 'required|integer|min:0',
  customer_retention_rate: '', // 'required|numeric|min:0|max:100',
  average_rent: '', // 'required|numeric|min:0|max:999999.99',
  contracts: '', // 'required|numeric|min:0|max:99.99',
  rental_income: '', // 'required|numeric|min:0|max:99999999.99',
  dolar: '', // 'required|numeric|min:0|max:99999.99',
  prop_investment: '', // 'required|numeric|min:0|max:99999999.99',
  type: '', // 'required|in:annual,quarter',
}

const reit = reactive({ ...reitEmpty })

async function onSubmit() {
  try {
    let data;
    const body = {
      ...reit,
    }
    if (reitAnnualId.value) {
      ({ data } = await API.ReitAnnual.updateReitAnnual(reitAnnualId.value, body));
    } else {
      ({ data } = await API.ReitAnnual.createReitAnnual(body));
    }
    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: data.message,
    });
    router.push({ name: ROUTE_NAMES.REIT_ANNUAL_INDEX })
  } catch (e) {
    Swal.fire(e.response.data.message, JSON.stringify(e.response.data.errors), 'error')
  }
}

async function fetchReit() {
  try {
    const { data } = await API.ReitAnnual.getReitAnnual(reitAnnualId.value);
    ['reit_id']
    .forEach(prop => reit[prop] = data.data[prop] ? +(data.data[prop]) : '');
    ['year', 'quarter', 'noi', 'cap_rate', 'occupancy', 'm2', 'sqft', 'buildings', 'customer_retention_rate', 'average_rent', 'contracts', 'rental_income', 'dolar', 'prop_investment', 'type']
    .forEach(prop => reit[prop] = data.data[prop] ? `${data.data[prop]}` : '');
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to load land data: ' + error.message,
    });
  }
}

const reits = reactive({ loading: false, items: []})

async function fetchReits() {
  reits.loading = true
  const { data } = {data: {data: [{id: 1, name: 'Reit 1'}]}};
  reits.loading = false
  reits.items = data.data.sort((a, b) => a.name.localeCompare(b.name))
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
                  <label class="form-label">Zoning *</label>
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
                  <label class="form-label">Type *</label>
                  <MASelect
                    v-model="reit.type"
                    :options="['annual', 'quarter']"
                    required
                    placeholder="Select..."
                  />
                </div>

                <div class="col-md-4 mt-2">
                  <label class="form-label">Year *</label>
                  <CDatePicker label="Year Built" v-model:date="reit.year" locale="en-US" selectionType="year" required />
                </div>

                <div v-if="reit.type === 'quarter'" class="col-md-4 mt-2">
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
                    label="sqft"
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
                    label="average_rent *"
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
                    label="rental_income *"
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
                    label="prop_investment *"
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
                    label="dolar *"
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
                    label="contracts *"
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
                    <CButton color="primary" type="submit">
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