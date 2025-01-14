<script setup>
import { ref, onMounted, watch } from 'vue';
import Swal from 'sweetalert2';
import { CIcon } from '@coreui/icons-vue';
import { cilPencil, cilTrash, cilPlus } from '@coreui/icons';

import BuildingAbsorptionForm from './BuildingAbsorptionForm.vue';
import { BUILDINGS_ITEMS_PER_PAGE } from '../../../constants';
import { useLocalStorage } from '../../../composables/useLocalStorage';
import { API } from '../../../services';

const props = defineProps({
  buildingId: {
    type: Number,
    required: true
  }
})
const emit = defineEmits(['submitting', 'changeShowForm'])

const storage = useLocalStorage()

const absorptions = ref([]);
const loading = ref(false)
const totalItems = ref(0)
const totalPages = ref(0)
const page = ref(1)
const itemsPerPage = ref(storage.getItem(BUILDINGS_ITEMS_PER_PAGE) ?? 10)
const columnFilter = ref({})
const columnSorter = ref({})
const tableSearch = ref('')

const showForm = ref(false);
const selectedAbsorptionId = ref(null);

const columns = [
  { key: 'tenantName', label: 'Tenant' },
  { key: 'industryName', label: 'Industry' },
  { key: 'abs_lease_term_month', label: 'Lease Term' },
  { key: 'abs_closing_date', label: 'Closing Date' },
  { key: 'abs_final_use', label: 'Final Use' },
  { key: 'abs_sale_price', label: 'Sale Price' },
  { key: 'actions', label: 'actions', sorter: false, filter: false },
];

async function fetchAbsorptions() {
  loading.value = true
  try {
    const { data } = await API.buildingsAbsorption.getAbsorptionBuildings(props.buildingId, {
      page: page.value,
      size: itemsPerPage.value,
      search: tableSearch.value,
    }, columnFilter.value, columnSorter.value);
    page.value = data.data.current_page
    totalItems.value = data.data.total
    totalPages.value = data.data.last_page
    absorptions.value = data.data.data.map(item => ({
      ...item,
      abs_lease_term_month: item.abs_lease_term_month ?? '',
      abs_closing_date: item.abs_closing_date ?? '',
      abs_final_use: item.abs_final_use ?? '',
      abs_sale_price: item.abs_sale_price ?? '',
      industryName: item.industry.name,
      tenantName: item.tenant.name,
    }))
    loading.value = false
  } catch (error) {
    console.error('Error fetching buildings:', error);
    absorptions.value = [];
  } finally {
    loading.value = false
  }
}

const handleEdit = ({ id: absorptionId }) => {
  selectedAbsorptionId.value = absorptionId;
  showForm.value = true;
};

const handleReturn = () => {
  showForm.value = false;
  selectedAbsorptionId.value = null;
  fetchAbsorptions(); // Refresh the data when returning
};

async function removeAbsorption(absorptionId) {
  try {
    const { isConfirmed } = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    })
    if (isConfirmed) {
      const { data } = await API.buildingsAbsorption.deleteAbsorptionBuilding(absorptionId, props.buildingId);
      Swal.fire('Deleted!', data.message, 'success')
      fetchAbsorptions()
    }
  } catch (error) {
    console.error('Error fetching buildings:', error);
    Swal.fire('Failed!', error.message, 'error')
  }
}

const handleAddAbsorption = () => {
  selectedAbsorptionId.value = 0; // 0 indicates new record
  showForm.value = true;
};

onMounted(() => {
  fetchAbsorptions();
});

watch(showForm, (newValue) => {
  emit('changeShowForm', newValue)
})

const formAbsorptionRef = ref(null)

watch([page, itemsPerPage, tableSearch], fetchAbsorptions)
watch([columnSorter, columnFilter], fetchAbsorptions, { deep: true })

defineExpose({
  showForm,
  submit() {
    formAbsorptionRef.value?.submit?.()
  }
})
</script>
<template>
  <div class="building-absorption">
    <div v-if="!showForm">
      <!-- Header with Add button -->
      <div class="mb-4 d-flex justify-content-between align-items-center">
        <h2>Building Absorption</h2>
        <CButton color="primary" @click="handleAddAbsorption">
          <CIcon :icon="cilPlus" class="me-2" />
          Add Absorption
        </CButton>
      </div>

      <!-- Absorptions Table -->
      <CCard>
        <CCardBody>
          <CSmartTable
            :pagination="{ external: true }"
            :column-filter="{ external: true }"
            :column-sorter="{ external: true }"
            :table-filter="{ external: true }"
            :loading="loading"
            :items="absorptions"
            :paginationProps="{
              activePage: page,
              pages: totalPages
            }"
            :columns="columns"
            cleaner
            footer
            header
            items-per-page-select
            :items-per-page="itemsPerPage"
            :table-props="{
              hover: true,
              striped: true,
              responsive: true,
            }"
            @active-page-change="(_activePage) => {
              page = _activePage
            }"
            @items-per-page-change="(_itemsPerPage) => {
              activePage = 1
              itemsPerPage = _itemsPerPage
              storage.setItem(BUILDINGS_ITEMS_PER_PAGE, _itemsPerPage)
            }"
            @sorter-change="(sorter) => {
              columnSorter = sorter
            }"
            @table-filter-change="(filter) => {
              activePage = 1
              tableSearch = filter
            }"
            @column-filter-change="(filter) => {
              activePage = 1
              columnFilter = filter
            }"
          >
            <template #actions="{ item }">
              <td class="d-flex gap-1">
                <CButton color="primary" variant="outline" square size="sm" >
                  <CIcon :content="cilPencil" size="sm" @click="handleEdit(item)" />
                </CButton>
                <CButton color="danger" variant="outline" square size="sm" @click="removeAbsorption(item.id)">
                  <CIcon :content="cilTrash" size="sm" />
                </CButton>
              </td>
            </template>
          </CSmartTable>
          <div>
            Total records {{ totalItems }}
          </div>
        </CCardBody>
      </CCard>
    </div>

    <!-- Show form when editing -->
    <div v-else>
      <BuildingAbsorptionForm 
        :buildingId="props.buildingId"
        :absorptionId="selectedAbsorptionId"
        @return="handleReturn"
        @submitting="() => emit('submitting', value)"
        ref="formAbsorptionRef"
      />
    </div>
  </div>
</template>

<style scoped>
.building-absorption {
  padding: 1rem;
}

.table-actions {
  white-space: nowrap;
}
</style>