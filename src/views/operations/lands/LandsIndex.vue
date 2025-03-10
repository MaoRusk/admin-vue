<script setup>
import { ref, onMounted, watch } from 'vue';
import Swal from 'sweetalert2';

import { API } from '../../../services';
import { ROUTE_NAMES } from '../../../router/routeNames';
import { useLocalStorage } from '../../../composables/useLocalStorage';
import { LANDS_ITEMS_PER_PAGE } from '../../../constants';

const storage = useLocalStorage()

const lands = ref([]);

const loading = ref(false)
const totalItems = ref(0)
const totalPages = ref(0)
const page = ref(1)
const itemsPerPage = ref(storage.getItem(LANDS_ITEMS_PER_PAGE) ?? 10)
const columnFilter = ref({})
const columnSorter = ref({})
const tableSearch = ref('')

const columns = [
  { key: 'status', label: 'Status' },
  { key: 'land_name', label: 'Land Name' },
  { key: 'marketName', label: 'Market' },
  { key: 'submarketName', label: 'Submarket' },
  { key: 'industrialParkName', label: 'Industrial Park' },
  { key: 'actions', label: 'actions', sorter: false, filter: false },
];

async function removeLand(id) {
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
      const { data } = await API.lands.deleteLand(id);
      Swal.fire('Deleted!', data.message, 'success')
      fetchLands()
    }
  } catch (error) {
    console.error('Error fetching land:', error);
  }
}
// TODO: aplicar filtros de busqueda y definir que campos se mostraran
async function fetchLands() {
  loading.value = true

  try {
    const { data } = await API.lands.getLands({
      page: page.value,
      size: itemsPerPage.value,
      search: tableSearch.value,
    }, columnFilter.value, columnSorter.value);
    page.value = data.data.current_page
    totalItems.value = data.data.total
    totalPages.value = data.data.last_page

    lands.value = data.data.data.map((item) => ({
      ...item,
      marketName: item.market?.name || '-',
      submarketName: item.sub_market?.name || '-',
      industrialParkName: item.industrial_park?.name || '-',
    }))
    loading.value = false
  } catch (error) {
    console.error('Error fetching lands:', error);
    lands.value = [];
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchLands();
});

watch([page, itemsPerPage, tableSearch], fetchLands)
watch([columnSorter, columnFilter], fetchLands, { deep: true })
</script>

<template>
  <div class="d-flex justify-content-end mb-3">
    <CButton color="success" @click="$router.push({ name: ROUTE_NAMES.LANDS_CREATE })">
      <CIcon name="cilPlus" size="sm" />
      New Land
    </CButton>
  </div>
  <CSmartTable
    :pagination="{ external: true }"
    :column-filter="{ external: true }"
    :column-sorter="{ external: true }"
    :table-filter="{ external: true }"
    :loading="loading"
    :items="lands"
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
      storage.setItem(LANDS_ITEMS_PER_PAGE, _itemsPerPage)
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
      $router.push({ name: ROUTE_NAMES.LANDS_UPDATE, params: { landId: item.id } })
    }"
  >
    <template #actions="{ item }">
      <td style="vertical-align: middle;">
        <div class="d-flex gap-1">
          <CButton color="primary" variant="outline" square size="sm" title="Go to availability" @click.stop="$router.push({ name: ROUTE_NAMES.LANDS_UPDATE, params: { landId: item.id }, query: { tab: 'Availability' } })">
            <CIcon name="cilBuilding" size="sm" />
          </CButton>
          <CButton color="primary" variant="outline" square size="sm" title="Go to absorption" @click.stop="$router.push({ name: ROUTE_NAMES.LANDS_UPDATE, params: { landId: item.id }, query: { tab: 'Absorption' } })">
            <CIcon name="cilIndustrySlash" size="sm" />
          </CButton>
          <CButton 
            color="primary" 
            variant="outline" 
            square 
            size="sm" 
            title="Go to contacts" 
            @click.stop="$router.push({ 
              name: ROUTE_NAMES.LANDS_UPDATE, 
              params: { landId: item.id }, 
              query: { tab: 'Contacts' } 
            })"
          >
            <CIcon name="cilContact" size="sm" />
          </CButton>
          <CButton color="danger" variant="outline" square size="sm" @click.stop="removeLand(item.id)">
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