<script setup>
import { ref, onMounted, watch } from 'vue';
import Swal from 'sweetalert2';

import { API } from '../../../services';
import { ROUTE_NAMES } from '../../../router/routeNames';
import { useLocalStorage } from '../../../composables/useLocalStorage';
import { CAMS_ITEMS_PER_PAGE } from '../../../constants';

const storage = useLocalStorage()

const cams = ref([]);

const loading = ref(false)
const totalItems = ref(0)
const totalPages = ref(0)
const page = ref(1)
const itemsPerPage = ref(storage.getItem(CAMS_ITEMS_PER_PAGE) ?? 10)
const columnFilter = ref({})
const columnSorter = ref({})
const tableSearch = ref('')

const columns = [
  { key: 'industrial_park_name', label: 'Industrial Park' },
  { key: 'developer_name', label: 'Developer' },
  { key: 'market_name', label: 'Market' },
  { key: 'cam_building_sf', label: 'Building SF' },
  { key: 'cam_land_sf', label: 'Land SF' },
  { key: 'actions', label: 'actions', sorter: false, filter: false },
];

async function removeCam(id) {
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
      const { data } = await API.cams.deleteCam(id);
      Swal.fire('Deleted!', data.message, 'success')
      fetchCams()
    }
  } catch (error) {
    console.error('Error deleting cam:', error);
    Swal.fire('Error!', 'Failed to delete CAM', 'error')
  }
}

async function fetchCams() {
  loading.value = true
  try {
    const { data } = await API.cams.getCams({
      page: page.value,
      size: itemsPerPage.value,
      search: tableSearch.value,
    }, columnFilter.value, columnSorter.value);

    if (data?.data) {
      page.value = data.data.current_page || 1
      totalItems.value = data.data.total || 0
      totalPages.value = data.data.last_page || 1

      cams.value = Array.isArray(data.data.data) 
        ? data.data.data.map((item) => ({
            ...item,
            industrial_park_name: item.industrial_park?.name || '-',
            developer_name: item.developer?.name || '-',
            market_name: item.market?.name || '-',
          }))
        : [];
    } else {
      cams.value = []
      console.warn('Unexpected API response structure:', data)
      Swal.fire({
        icon: 'warning',
        title: 'Warning',
        text: 'Received unexpected data format from server',
      })
    }
  } catch (error) {
    console.error('Error fetching cams:', error);
    cams.value = [];
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.response?.data?.message || 'Failed to fetch CAMs',
    })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchCams();
});

watch([page, itemsPerPage, tableSearch], fetchCams)
watch([columnSorter, columnFilter], fetchCams, { deep: true })
</script>

<template>
  <div class="d-flex justify-content-end mb-3">
    <CButton color="success" @click="$router.push({ name: ROUTE_NAMES.CAMS_CREATE })">
      <CIcon name="cilPlus" size="sm" />
      New CAM
    </CButton>
  </div>
  <CSmartTable
    :pagination="{ external: true }"
    :column-filter="{ external: true }"
    :column-sorter="{ external: true }"
    :table-filter="{ external: true }"
    :loading="loading"
    :items="cams"
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
      page = 1
      itemsPerPage = _itemsPerPage
      storage.setItem(CAMS_ITEMS_PER_PAGE, _itemsPerPage)
    }"
    @sorter-change="(sorter) => {
      columnSorter = sorter
    }"
    @table-filter-change="(filter) => {
      page = 1
      tableSearch = filter
    }"
    @column-filter-change="(filter) => {
      page = 1
      columnFilter = filter
    }"
    clickable-rows
    @row-click="item => {
      $router.push({ name: ROUTE_NAMES.CAMS_UPDATE, params: { camId: item.id } })
    }"
  >
    <template #actions="{ item }">
      <td style="vertical-align: middle;">
        <div class="d-flex gap-1">
          <CButton color="danger" variant="outline" square size="sm" @click.stop="removeCam(item.id)">
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