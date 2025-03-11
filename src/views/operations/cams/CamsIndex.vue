<script setup>
import { ref, onMounted } from 'vue';
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
    try {
      const { data } = await API.cams.deleteCam(id);
      await fetchCams();
      
      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: data.message,
        toast: true,
        position: 'bottom',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true
      })
    } catch (error) {
      console.error('Error deleting cam:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Failed to delete CAM',
        toast: true,
        position: 'bottom',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true
      })
    }
  }
}

async function fetchCams() {
  loading.value = true
  try {
    const { data } = await API.cams.getCams();
    if (data?.data) {
      const items = Array.isArray(data.data) ? data.data : data.data.data;
      
      if (items) {
        cams.value = items.map((item) => ({
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
      }
    }
  } catch (error) {
    console.error('Error fetching cams:', error);
    cams.value = [];
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.response?.data?.message || 'Failed to fetch CAMs',
      toast: true,
      position: 'bottom',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true
    });
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchCams();
});
</script>

<template>
  <CCard class="mb-4">
    <CRow>
      <CCol :xs="12" :xl="10">&nbsp;</CCol>
      <CCol :xs="12" :xl="2">
        <CCardBody>
          <CButton color="success" @click="$router.push({ name: ROUTE_NAMES.CAMS_CREATE })">
            <CIcon name="cilPlus" class="me-2" />
            New CAM
          </CButton>
        </CCardBody>
      </CCol>
    </CRow>
  </CCard>

  <CCard class="mb-4">
    <CCardBody>
      <CSmartTable
        v-if="cams.length > 0"
        :active-page="1"
        :items="cams"
        :columns="columns"
        :items-per-page="itemsPerPage"
        :table-filter="true"
        cleaner
        :table-filter-label="'Search:'"
        :table-filter-placeholder="'Type something...'"
        :pagination="true"
        hover
        @per-page-change="(newPerPage) => {
          itemsPerPage = newPerPage
          storage.setItem(CAMS_ITEMS_PER_PAGE, newPerPage)
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
    </CCardBody>
  </CCard>
</template>

<style scoped>
.badge {
  font-size: 0.8em;
  padding: 0.3em 0.6em;
}
</style> 