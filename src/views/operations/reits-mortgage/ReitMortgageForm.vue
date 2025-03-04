<script setup>
import { onMounted, reactive, ref, watch } from 'vue';
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
  () => route.params.reitMortgageId,
  () => {
    fetchReitMortgage()
  }
)

const props = defineProps({
  reitMortgageId: Number
})

const reitMortgageEmpty = {
  reit_id: '',
  reit_type_id: '',
  reit_type_name: '',
  year: '',
  quarter: '',
  net_income: '',
  return_on_enquity: '',
  return_on_assets: '',
  return_on_invested_capital: '',
  interest_income: '',
  number_loans: '',
  outstanding_portfolio: '',
  overdue_portfolio: '',
  avg_interest_rate_fovisste: '',
  avg_interest_rate_pdh: '',
  dollar: '',
  divided_yield: '',
  total_portfolio: '',
};

const reitMortgage = reactive({ ...reitMortgageEmpty })
const submitting = ref(false)

async function onSubmit() {
  submitting.value = true
  try {
    let data;
    const body = {
      ...reitMortgage,
    };

    if (props.reitMortgageId) {
      ({ data } = await API.reitMortgages.updateReitMortgages(props.reitMortgageId, body));
    } else {
      ({ data } = await API.reitMortgages.createReitMortgages(body));
    }

    submitting.value = false
    await Swal.fire({
      icon: 'success',
      title: 'Success',
      text: data.message || "Operation successful",
    });
    router.push({name: ROUTE_NAMES.REIT_MORTGAGE})
  } catch (e) {
    submitting.value = false
    let errorMessage = "An unexpected error occurred.";
    let errorDetails = "";
    if (e.response) {
      errorMessage = e.response.data?.message || "An error occurred.";
      errorDetails = e.response.data?.errors
        ? JSON.stringify(e.response.data.errors, null, 2)
        : "";
    }
    Swal.fire({
      icon: "error",
      title: "Error",
      text: errorDetails || errorMessage,
    });
  }
}

async function fetchReitMortgage() {
  try {
    const { data } = await API.reitMortgages.getReitMortgage(props.reitMortgageId);
    Object.assign(reitMortgage, {
      reit_id: data.data.reit_id,
      reit_type_id: data.data.reit_type_id || '',
      year: data.data.year ? `${data.data.year}` : '',
      quarter: data.data.quarter || '',
      net_income: data.data.net_income || '',
      return_on_enquity: data.data.return_on_enquity || '',
      return_on_assets: data.data.return_on_assets || '',
      return_on_invested_capital: data.data.return_on_invested_capital || '',
      interest_income: data.data.interest_income || '',
      number_loans: data.data.number_loans || '',
      outstanding_portfolio: data.data.outstanding_portfolio || '',
      overdue_portfolio: data.data.overdue_portfolio || '',
      avg_interest_rate_fovisste: data.data.avg_interest_rate_fovisste || '',
      avg_interest_rate_pdh: data.data.avg_interest_rate_pdh || '',
      dollar: data.data.dollar || '',
      divided_yield: data.data.divided_yield || '',
      total_portfolio: data.data.total_portfolio || '',
    });

  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to load mortgage data: ' + error.message,
    });
  }
}

const reits = reactive({ loading: false, items: []})

async function fetchReits() {
  reits.loading = true
  const data = await API.reits.getReits();
  reits.loading = false
  reits.items = data.data.data.sort((a, b) => a.name.localeCompare(b.name))
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
  if (props.reitMortgageId) {
    await fetchReitMortgage();
  }
  Swal.close()
});

watch(() => reitMortgage.reit_id, async (newReit) => {
  if (newReit) {
    const { data } = await API.reitTypes.getReitType(newReit);
    reitMortgage.reit_type_id = data.data.id || ''
    reitMortgage.reit_type_name = data.data.name || ''
  } else {
    reitMortgage.reit_type_id = ''
    reitMortgage.reit_type_name = ''
  }
});
</script>
<template>
  <form @submit.prevent="onSubmit">
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
                  <label class="form-label">Reit *</label>
                  <MASelect
                    label="name"
                    :reduce="option => option.id"
                    :options="reits.items"
                    v-model="reitMortgage.reit_id"
                    placeholder="Select..."
                    :loading="reits.loading"
                    required
                  />
                </div>

                <div class="col-md-4 mt-2">
                  <label class="form-label">Reit Type</label>
                  <input
                    type="text"
                    class="form-control"
                    :value="reitMortgage.reit_type_name"
                    readonly
                  />
                </div>

                <!-- Year -->
                <div class="col-md-4 mt-2">
                  <label class="form-label">Year *</label>
                  <CDatePicker v-model:date="reitMortgage.year" locale="en-US" selectionType="year" required />
                </div>

                <!-- Quarter -->
                <div class="col-md-4 mt-2">
                  <label class="form-label">Quarter</label>
                  <MASelect
                    v-model="reitMortgage.quarter"
                    :options="['Q1', 'Q2', 'Q3', 'Q4']"
                    placeholder="Select..."
                  ></MASelect>
                </div>

                <!-- Net Income -->
                <div class="col-md-4 mt-2">
                  <label class="form-label">Net Income *</label>
                  <input type="number" step="0.01" min="0" max="999.99" class="form-control" v-model="reitMortgage.net_income" required />
                </div>

                <!-- Return on Equity -->
                <div class="col-md-4 mt-2">
                  <label class="form-label">Return on Equity *</label>
                  <input type="number" step="0.01" min="0" max="99.99" class="form-control" v-model="reitMortgage.return_on_enquity" required />
                </div>

                <!-- Return on Assets -->
                <div class="col-md-4 mt-2">
                  <label class="form-label">Return on Assets *</label>
                  <input type="number" step="0.01" min="0" max="99.99" class="form-control" v-model="reitMortgage.return_on_assets" required />
                </div>

                <!-- Return on Invested Capital -->
                <div class="col-md-4 mt-2">
                  <label class="form-label">Return on Invested Capital *</label>
                  <input type="number" step="0.01" min="0" max="999.99" class="form-control" v-model="reitMortgage.return_on_invested_capital" required />
                </div>

                <!-- Interest Income -->
                <div class="col-md-4 mt-2">
                  <label class="form-label">Interest Income *</label>
                  <input type="number" step="0.01" min="0" max="99999999.99" class="form-control" v-model="reitMortgage.interest_income" required />
                </div>

                <!-- Number of Loans -->
                <div class="col-md-4 mt-2">
                  <label class="form-label">Number of Loans *</label>
                  <input type="number" step="0.01" min="0" max="99999999.99" class="form-control" v-model="reitMortgage.number_loans" required />
                </div>

                <!-- Outstanding Portfolio -->
                <div class="col-md-4 mt-2">
                  <label class="form-label">Outstanding Portfolio *</label>
                  <input type="number" step="0.01" min="0" max="999.99" class="form-control" v-model="reitMortgage.outstanding_portfolio" required />
                </div>

                <!-- Overdue Portfolio -->
                <div class="col-md-4 mt-2">
                  <label class="form-label">Overdue Portfolio *</label>
                  <input type="number" step="0.01" min="0" max="999.99" class="form-control" v-model="reitMortgage.overdue_portfolio" required />
                </div>

                <!-- Avg Interest Rate Fovisste -->
                <div class="col-md-4 mt-2">
                  <label class="form-label">Avg Interest Rate Fovisste *</label>
                  <input type="number" step="0.01" min="0" max="99.99" class="form-control" v-model="reitMortgage.avg_interest_rate_fovisste" required />
                </div>

                <!-- Avg Interest Rate PDH -->
                <div class="col-md-4 mt-2">
                  <label class="form-label">Avg Interest Rate PDH *</label>
                  <input type="number" step="0.01" min="0" max="99.99" class="form-control" v-model="reitMortgage.avg_interest_rate_pdh" required />
                </div>

                <!-- Dollar -->
                <div class="col-md-4 mt-2">
                  <label class="form-label">Dollar *</label>
                  <input type="number" step="0.01" min="0" max="999.99" class="form-control" v-model="reitMortgage.dollar" required />
                </div>

                <!-- Dividend Yield -->
                <div class="col-md-4 mt-2">
                  <label class="form-label">Dividend Yield *</label>
                  <input type="number" step="0.01" min="0" max="99.99" class="form-control" v-model="reitMortgage.divided_yield" required />
                </div>

                <!-- Total Portfolio -->
                <div class="col-md-4 mt-2">
                  <label class="form-label">Total Portfolio *</label>
                  <input type="number" step="0.01" min="0" max="99999999.99" class="form-control" v-model="reitMortgage.total_portfolio" required />
                </div>
              </div>

              <div class="row mt-4">
                <div class="col">
                  <CLoadingButton color="primary" type="submit" :loading="submitting" :disabled="submitting" class="me-3" v-if="can('reit-mortgage.create', 'reit-mortgage.update')">
                    <CIcon name="cilSave" size="sm" /> Save
                  </CLoadingButton>
                  <CButton type="button" color="secondary" variant="outline" @click="router.push({ name: ROUTE_NAMES.REIT_MORTGAGE })">
                    <CIcon name="cilArrowCircleLeft" size="sm" /> Cancel
                  </CButton>
                </div>
              </div>
            </CCardBody>
          </CCard>
        </CRow>
      </CCol>
    </CRow>
  </form>
</template>
<style scoped>
</style>
