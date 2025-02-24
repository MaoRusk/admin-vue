<script setup>
import { onMounted, reactive, ref, watch, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import { AxiosError } from 'axios';

import { API } from '../../../services';
import { ROUTE_NAMES } from '../../../router/routeNames';
import MASelect from '../../../components/MASelect.vue';

const router = useRouter()
const route = useRoute()

watch(
  () => route.params.reitMortgageId,
  () => {
    fetchReitMortgage()
  }
)

const props = defineProps({
  reitMortgageId: Number
})

const emit = defineEmits(['submitting'])

const reitMortgageEmpty = {
  reit_id: '',
  reit_type_id: '',
  year: null,
  quarter: '',
  net_income: null,
  return_on_enquity: null,
  return_on_assets: null,
  return_on_invested_capital: 'Active',
  interest_income: null,
  number_loans: null,
  outstanding_portfolio: null,
  overdue_portfolio: null,
  avg_interest_rate_fovisste: null,
  avg_interest_rate_pdh: null,
  dollar: null,
  divided_yield: null,
  total_portfolio: null,
};

const reitMortgage = reactive({ ...reitMortgageEmpty })
const formHtmlElement = ref(null)
const VALUE_SEPARATOR = ' x '


async function onSubmit() {
  console.log("onSubmit called");
  emit('submitting', true);

  try {
    let data;
    const body = {
      ...reitMortgage,
      reit_id: reitMortgage.reit_id ? Number(reitMortgage.reit_id.value) : null,
    };

    console.log("Submitting body:", body);

    if (props.reitMortgageId) {
      console.log(`Updating reitMortgage with ID: ${props.reitMortgageId}`);
      ({ data } = await API.reitMortgages.updateReitMortgages(props.reitMortgageId, body));
      console.log(props.reitMortgageId);

      router.push({ name: ROUTE_NAMES.REIT_MORTGAGE_DETAILS, params: { id: props.reitMortgageId } });

    } else {
      ({ data } = await API.reitMortgages.createReitMortgages(body));

      router.push({ name: ROUTE_NAMES.REIT_MORTGAGE_EDIT, params: { id: data.data.id } });
    }

    emit('submitting', false);
    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: data.message || "Operation successful",
    });

  } catch (e) {
    emit('submitting', false);
    console.error("Error in onSubmit:", e);

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
      text: errorMessage,
      /*footer: errorDetails ? `<pre>${errorDetails}</pre>` : null,*/
    });
  }
}



async function fetchReitMortgage() {
  try {
    const { data } = await API.reitMortgages.getReitMortgage(props.reitMortgageId);

    const selectedReit = reits.items.find(item => item.value === data.data.reit_id);

    Object.assign(reitMortgage, {
      reit_id: selectedReit || { label: '', value: '' },
      reit_type_id: data.data.reit_type_id || '',
      year: data.data.year || null,
      quarter: data.data.quarter || '',
      net_income: data.data.net_income || null,
      return_on_enquity: data.data.return_on_enquity || null,
      return_on_assets: data.data.return_on_assets || null,
      return_on_invested_capital: data.data.return_on_invested_capital || null,
      interest_income: data.data.interest_income || null,
      number_loans: data.data.number_loans || null,
      outstanding_portfolio: data.data.outstanding_portfolio || null,
      overdue_portfolio: data.data.overdue_portfolio || null,
      avg_interest_rate_fovisste: data.data.avg_interest_rate_fovisste || null,
      avg_interest_rate_pdh: data.data.avg_interest_rate_pdh || null,
      dollar: data.data.dollar || null,
      divided_yield: data.data.divided_yield || null,
      total_portfolio: data.data.total_portfolio || null,
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
const reitType = reactive({ loading: false, item: {} })



async function fetchReits() {
  reits.loading = true
  const data = await API.reits.getReits();
  reits.loading = false
  reits.items = data.data.data.map(({ id, name }) => ({ label: name, value: id })).sort((a, b) => a.label.localeCompare(b.label))
  console.log(reits.items)
}

async function fetchReitType(reitTypeId) {
  reitType.loading = true;
  const data = await API.reitTypes.getReitType(reitTypeId);
  console.log(data.data.data.name)
  reitType.item = { id: reitTypeId, name: data.data.data.name };
  reitType.loading = false;
  console.log(reitType.item)
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
  if (newReit?.value) {
    await fetchReitType(newReit.value);
    reitMortgage.reit_type_id = reitType.item.id || '';
  } else {
    reitMortgage.reit_type_id = '';
  }
});


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
                  <label class="form-label">Reit *</label>
                  <MASelect
                    label="label"
                    v-model="reitMortgage.reit_id"
                    :options="reits.items"
                    required
                    placeholder="Select..."
                    :loading="reits.loading"
                    value-key="id"
                  />
                </div>

                <div class="col-md-4 mt-2">
                  <label class="form-label">Reit Type</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="reitType.item.name"
                    readonly
                  />
                </div>

                <!-- Year -->
                <div class="col-md-4 mt-2">
                  <label class="form-label">Year *</label>
                  <input type="number" class="form-control" v-model="reitMortgage.year" required />
                </div>

                <!-- Quarter -->
                <div class="col-md-4 mt-2">
                  <label class="form-label">Quarter *</label>
                  <input type="text" class="form-control" v-model="reitMortgage.quarter" maxlength="2" required />
                </div>

                <!-- Net Income -->
                <div class="col-md-4 mt-2">
                  <label class="form-label">Net Income *</label>
                  <input type="number" step="0.01" class="form-control" v-model="reitMortgage.net_income" required />
                </div>

                <!-- Return on Equity -->
                <div class="col-md-4 mt-2">
                  <label class="form-label">Return on Equity *</label>
                  <input type="number" step="0.01" class="form-control" v-model="reitMortgage.return_on_enquity" required />
                </div>

                <!-- Return on Assets -->
                <div class="col-md-4 mt-2">
                  <label class="form-label">Return on Assets *</label>
                  <input type="number" step="0.01" class="form-control" v-model="reitMortgage.return_on_assets" required />
                </div>

                <!-- Return on Invested Capital -->
                <div class="col-md-4 mt-2">
                  <label class="form-label">Return on Invested Capital *</label>
                  <input type="number" step="0.01" class="form-control" v-model="reitMortgage.return_on_invested_capital" required />
                </div>

                <!-- Interest Income -->
                <div class="col-md-4 mt-2">
                  <label class="form-label">Interest Income *</label>
                  <input type="number" step="0.01" class="form-control" v-model="reitMortgage.interest_income" required />
                </div>

                <!-- Number of Loans -->
                <div class="col-md-4 mt-2">
                  <label class="form-label">Number of Loans *</label>
                  <input type="number" step="0.01" class="form-control" v-model="reitMortgage.number_loans" required />
                </div>

                <!-- Outstanding Portfolio -->
                <div class="col-md-4 mt-2">
                  <label class="form-label">Outstanding Portfolio *</label>
                  <input type="number" step="0.01" class="form-control" v-model="reitMortgage.outstanding_portfolio" required />
                </div>

                <!-- Overdue Portfolio -->
                <div class="col-md-4 mt-2">
                  <label class="form-label">Overdue Portfolio *</label>
                  <input type="number" step="0.01" class="form-control" v-model="reitMortgage.overdue_portfolio" required />
                </div>

                <!-- Avg Interest Rate Fovisste -->
                <div class="col-md-4 mt-2">
                  <label class="form-label">Avg Interest Rate Fovisste *</label>
                  <input type="number" step="0.01" class="form-control" v-model="reitMortgage.avg_interest_rate_fovisste" required />
                </div>

                <!-- Avg Interest Rate PDH -->
                <div class="col-md-4 mt-2">
                  <label class="form-label">Avg Interest Rate PDH *</label>
                  <input type="number" step="0.01" class="form-control" v-model="reitMortgage.avg_interest_rate_pdh" required />
                </div>

                <!-- Dollar -->
                <div class="col-md-4 mt-2">
                  <label class="form-label">Dollar *</label>
                  <input type="number" step="0.01" class="form-control" v-model="reitMortgage.dollar" required />
                </div>

                <!-- Dividend Yield -->
                <div class="col-md-4 mt-2">
                  <label class="form-label">Dividend Yield *</label>
                  <input type="number" step="0.01" class="form-control" v-model="reitMortgage.divided_yield" required />
                </div>

                <!-- Total Portfolio -->
                <div class="col-md-4 mt-2">
                  <label class="form-label">Total Portfolio *</label>
                  <input type="number" step="0.01" class="form-control" v-model="reitMortgage.total_portfolio" required />
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
