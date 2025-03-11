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
  { 
    key: 'industrial_park_name', 
    label: 'Industrial Park',
    _style: { width: '15%' }
  },
  { 
    key: 'developer_name', 
    label: 'Developer',
    _style: { width: '15%' }
  },
  { 
    key: 'region_name', 
    label: 'Region',
    _style: { width: '10%' }
  },
  { 
    key: 'market_name', 
    label: 'Market',
    _style: { width: '10%' }
  },
  { 
    key: 'sub_market_name', 
    label: 'Submarket',
    _style: { width: '10%' }
  },
  { 
    key: 'cam_building_sf', 
    label: 'Building SF Rate',
    _style: { width: '10%' }
  },
  { 
    key: 'cam_land_sf', 
    label: 'Land SF Rate',
    _style: { width: '10%' }
  },
  { 
    key: 'services', 
    label: 'Services',
    _style: { width: '15%' },
    sorter: false,
    filter: false
  },
  { 
    key: 'actions', 
    label: 'Actions',
    _style: { width: '5%' },
    sorter: false, 
    filter: false 
  },
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
      cams.value = data.data.map((item) => ({
        ...item,
        industrial_park_name: item.industrial_park?.name || '-',
        developer_name: item.developer?.name || '-',
        region_name: item.region?.name || '-', 
        market_name: item.market?.name || '-',
        sub_market_name: item.sub_market?.name || '-',
        cam_building_sf: `${Number(item.cam_building_sf || 0).toFixed(2)} ${item.currency || ''}`,
        cam_land_sf: `${Number(item.cam_land_sf || 0).toFixed(2)} ${item.currency || ''}`,
        has_cam_services: Boolean(item.has_cam_services),
        has_lightning_maintenance: Boolean(item.has_lightning_maintenance),
        has_park_administration: Boolean(item.has_park_administration),
        storm_sewer_maintenance: Boolean(item.storm_sewer_maintenance),
        has_surveillance: Boolean(item.has_surveillance),
        has_management_fee: Boolean(item.has_management_fee)
      }));

      totalItems.value = data.data.length;
      totalPages.value = Math.ceil(data.data.length / itemsPerPage.value);
      page.value = 1;

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
    <template #services="{ item }">
      <td>
        <div class="d-flex flex-wrap gap-1">
          <CBadge v-if="item.has_cam_services" color="info" class="me-1">
            CAM
          </CBadge>
          <CBadge v-if="item.has_lightning_maintenance" color="info" class="me-1">
            Lightning
          </CBadge>
          <CBadge v-if="item.has_park_administration" color="info" class="me-1">
            Admin
          </CBadge>
          <CBadge v-if="item.storm_sewer_maintenance" color="info" class="me-1">
            Sewer
          </CBadge>
          <CBadge v-if="item.has_surveillance" color="info" class="me-1">
            Security
          </CBadge>
          <CBadge v-if="item.has_management_fee" color="info">
            Management
          </CBadge>
        </div>
      </td>
    </template>

    <template #actions="{ item }">
      <td style="vertical-align: middle;">
        <div class="d-flex gap-1">
          <CButton 
            color="primary" 
            variant="outline" 
            square 
            size="sm" 
            @click.stop="$router.push({ 
              name: ROUTE_NAMES.CAMS_UPDATE, 
              params: { camId: item.id } 
            })"
          >
            <CIcon name="cilPencil" size="sm" />
          </CButton>
          <CButton 
            color="danger" 
            variant="outline" 
            square 
            size="sm" 
            @click.stop="removeCam(item.id)"
          >
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
.badge {
  font-size: 0.8em;
  padding: 0.3em 0.6em;
}
</style> 