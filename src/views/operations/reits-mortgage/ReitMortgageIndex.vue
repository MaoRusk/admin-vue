<script setup>
import { ref, onMounted, watch } from 'vue';
import Swal from 'sweetalert2';

import { API } from '../../../services';
import { ROUTE_NAMES } from '../../../router/routeNames';
import { useLocalStorage } from '../../../composables/useLocalStorage';
import { REIT_MORTGAGE_ITEMS_PER_PAGE } from '../../../constants';
import { useAuthStore } from '../../../stores/auth';

const storage = useLocalStorage()
const { can } = useAuthStore()

const reitMortgages = ref([]);

const loading = ref(false)
const totalItems = ref(0)
const totalPages = ref(0)
const page = ref(1)
const itemsPerPage = ref(storage.getItem(REIT_MORTGAGE_ITEMS_PER_PAGE) ?? 10)
const columnFilter = ref({})
const columnSorter = ref({})
const tableSearch = ref('')

const columns = [
  { key: 'reitName', label: 'Reit Name' },
  { key: 'reitTypeName', label: 'Reit Type' },
  { key: 'year', label: 'Year' },
  { key: 'quarter', label: 'Quarter' },
  { key: 'actions', label: 'actions', sorter: false, filter: false },
];

async function removeReitMortgage(id) {
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
      const { data } = await API.reitMortgages.deleteReitMortgage(id);
      Swal.fire('Deleted!', data.message, 'success')
      fetchReitMortgages()
    }
  } catch (error) {
    console.error('Error fetching reit mortgage:', error);
  }
}

async function fetchReitMortgages() {
  loading.value = true

  try {
    const { data } = await API.reitMortgages.getReitMortgages({
      page: page.value,
      size: itemsPerPage.value,
      search: tableSearch.value,
    }, columnFilter.value, columnSorter.value);
    page.value = data.data.current_page
    totalItems.value = data.data.total
    totalPages.value = data.data.last_page

    reitMortgages.value = data.data.data.map((item) => ({
      ...item,
      reitName: item.reitName || '-',
      reitTypeName: item.reitTypeName || '-',
      year: item.year || '-',
      quarter: item.quarter || '-',
    }))
    loading.value = false
  } catch (error) {
    console.error('Error fetching reits mortgages:', error);
    reitMortgages.value = [];
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchReitMortgages();
});
watch([page, itemsPerPage, tableSearch], fetchReitMortgages)
watch([columnSorter, columnFilter], fetchReitMortgages, { deep: true })
</script>

<template>
  <div class="d-flex justify-content-end mb-3">
    <CButton color="success" @click="$router.push({ name: ROUTE_NAMES.REIT_MORTGAGE_CREATE })" v-if="can('reit-mortgage.create')">
      <CIcon name="cilPlus" size="sm" />
      New Reit Mortgage
    </CButton>
  </div>
  <CSmartTable
    :pagination="{ external: true }"
    :column-filter="{ external: true }"
    :column-sorter="{ external: true }"
    :table-filter="{ external: true }"
    :loading="loading"
    :items="reitMortgages"
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
      storage.setItem(REIT_MORTGAGE_ITEMS_PER_PAGE, _itemsPerPage)
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
    clickable-rows
    @row-click="item => {
      if (can('reit-mortgage.update', 'reit-mortgage.show')) {
        $router.push({ name: ROUTE_NAMES.REIT_MORTGAGE_UPDATE, params: { reitMortgageId: item.id } })
      }
    }"
  >
    <template #actions="{ item }">
      <td style="vertical-align: middle;">
        <div class="d-flex gap-1">
          <CButton color="primary" variant="outline" square size="sm" title="Edit" @click.stop="$router.push({ name: ROUTE_NAMES.REIT_MORTGAGE_UPDATE, params: { reitMortgageId: item.id } })" v-if="can('reit-mortgage.show', 'reit-mortgage.update')">
            <CIcon name="cilPencil" size="sm" />
          </CButton>
          <CButton color="danger" variant="outline" square size="sm" @click.stop="removeReitMortgage(item.id)" v-if="can('reit-mortgage.destroy')">
            <CIcon name="cilTrash" size="sm" />
          </CButton>
        </div>
      </td>
    </template>
  </CSmartTable>
  <div>
    Total records {{ totalItems }}
  </div>
</template>

<style scoped>

</style>
