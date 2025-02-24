<script setup>
import { ref, onMounted, watch } from 'vue';
import Swal from 'sweetalert2';

import { API } from '../../../services';
import { ROUTE_NAMES } from '../../../router/routeNames';
import { useLocalStorage } from '../../../composables/useLocalStorage';
import { REIT_ANNUAL_ITEMS_PER_PAGE } from '../../../constants';

const storage = useLocalStorage()

const reits = ref([]);

const loading = ref(false)
const totalItems = ref(0)
const totalPages = ref(0)
const page = ref(1)
const itemsPerPage = ref(storage.getItem(REIT_ANNUAL_ITEMS_PER_PAGE) ?? 10)
const columnFilter = ref({})
const columnSorter = ref({})
const tableSearch = ref('')

const columns = [
  { key: 'reitName', label: 'REIT' },
  { key: 'year', label: 'Year' },
  { key: 'noi', label: 'NOI' },
  { key: 'cap_rate', label: 'CAP Rate' },
  { key: 'occupancy', label: 'Occupancy' },
  { key: 'sqft', label: 'sqft' },
  { key: 'actions', label: 'actions', sorter: false, filter: false },
];

async function removeReit(id) {
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
      const { data } = await API.ReitAnnual.deleteReitAnnual(id);
      Swal.fire('Deleted!', data.message, 'success')
      fetchReit()
    }
  } catch (error) {
    console.error('Error fetching reit:', error);
  }
}

async function fetchReit() {
  loading.value = true

  try {
    const { data } = await API.ReitAnnual.getAllReitAnnual({
      page: page.value,
      size: itemsPerPage.value,
      search: tableSearch.value,
    }, {...columnFilter.value, type: 'annual'}, columnSorter.value);
    page.value = data.data.current_page
    totalItems.value = data.data.total
    totalPages.value = data.data.last_page

    reits.value = data.data.data.map((item) => ({
      ...item,
      year: item.year || '-',
      noi: item.noi || '-',
      cap_rate: item.cap_rate || '-',
      occupancy: item.occupancy || '-',
      sqft: item.sqft || '-',
      reitName: item.reit?.name || '-',
    }))
    loading.value = false
  } catch (error) {
    console.error('Error fetching REITs:', error);
    reits.value = [];
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchReit();
});

watch([page, itemsPerPage, tableSearch], fetchReit)
watch([columnSorter, columnFilter], fetchReit, { deep: true })
</script>

<template>
  <div class="d-flex justify-content-end mb-3">
    <CButton color="success" @click="$router.push({ name: ROUTE_NAMES.REIT_ANNUAL_CREATE })">
      <CIcon name="cilPlus" size="sm" />
      New Reit Annual
    </CButton>
  </div>
  <CSmartTable
    :pagination="{ external: true }"
    :column-filter="{ external: true }"
    :column-sorter="{ external: true }"
    :table-filter="{ external: true }"
    :loading="loading"
    :items="reits"
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
      storage.setItem(REIT_ANNUAL_ITEMS_PER_PAGE, _itemsPerPage)
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
      <td style="vertical-align: middle;">
        <div class="d-flex gap-1">
          <CButton color="primary" variant="outline" square size="sm" @click.stop="$router.push({ name: ROUTE_NAMES.REIT_ANNUAL_UPDATE, params: { reitAnnualId: item.id } })">
            <CIcon name="cilPencil" size="sm" />
          </CButton>
          <CButton color="danger" variant="outline" square size="sm" @click.stop="removeReit(item.id)">
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