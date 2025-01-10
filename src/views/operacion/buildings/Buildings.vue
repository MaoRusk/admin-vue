<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { cilPlus } from '@coreui/icons'
import { API } from '../../../services';
import { ROUTE_NAMES } from '../../../router/routeNames';

  const router = useRouter();
  const buildings = ref([]);

  const selectedStatus = ref('All');

  const statusOptions = computed(() => ['All', ...new Set(buildings.value.map(user => user.status))]);

  const filteredBuildings = computed(() => {
    if (selectedStatus.value === 'All') {
      return buildings.value;
    }
    return buildings.value.filter(user => user.status === selectedStatus.value);
  });

  const columns = [
    { key: 'status', label: 'status' },
    { key: 'name1', label: 'BuildingName' },
    { key: 'market', label: 'market' },
    { key: 'subMarket', label: 'subMarket' },
    { key: 'industrialPark', label: 'industrialPark' },
    { key: 'registered', label: 'registered' },
    { key: 'actions', label: 'actions' },
  ];

  
const getBadge = (status) => {
  switch (status) {
    case 'Availability':
      return 'success'
    case 'Absorption':
      return 'danger'
    case 'NegativeAbsoprtion':
      return 'secondary'
    default:
      'primary'
  }
}

  const showUserDetails = (item) => {
    router.push({
      name: 'BuildingDetalle',
      params: { id: Number(item.id) },
    })
  }

  const fetchBuildings = async () => {
    try {
      const response = await API.buildings.getBuildings();
      console.log(response)
    } catch (error) {
      console.error('Error fetching buildings:', error);
      buildings.value = [];
    }
  };

  onMounted(async () => {
    await fetchBuildings();
  });
</script>

<template>
  <!-- Botón para agregar usuario -->
  <div class="d-flex justify-content-end mb-3">
    <CButton color="success" @click="router.push({ name: ROUTE_NAMES.BUILDINGS_CREATE })">
      <CIcon :content="cilPlus" size="sm" />
      New Building
    </CButton>
  </div>
  <div class="d-flex justify-content-end align-items-center mb-3">
    <div>
      <CFormSelect
        v-model="selectedStatus"
        :options="statusOptions"
        style="width: 200px;"
      />
    </div>

  </div>
  <CSmartTable
    :active-page="1"
    cleaner
    column-filter
    column-sorter
    :columns="columns"
    clickable-rows
    footer
    header
    :items-per-page="10"
    items-per-page-select
    :items="filteredBuildings"
    pagination
    table-filter
    :table-props="{
      hover: true,
      striped: true,
      responsive: true,
    }"
  >
  <template #status="{ item }">
      <td>
        <CBadge :color="getBadge(item.status)">{{ item.status }}</CBadge>
      </td>
    </template>

    <template #actions="{ item }">
      <td class="py-2">
        <CButton color="primary" variant="outline" square size="sm" @click="showUserDetails(item)">
          {{ 'Details' }}
        </CButton>
      </td>
    </template>
  </CSmartTable>
</template>