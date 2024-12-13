<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const pendingItems = ref([]);

const columns = [
  { key: 'status', label: 'Status' },
  { key: 'name1', label: 'Building Name' },
  { key: 'market', label: 'Market' },
  { key: 'subMarket', label: 'Sub Market' },
  { key: 'industrialPark', label: 'Industrial Park' },
  { key: 'registered', label: 'Registered' },
  { key: 'actions', label: 'Actions' },
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
      return 'primary'
  }
}

const showDetails = (item) => {
  router.push({
    name: 'BuildingDetalle',
    params: { id: Number(item.id) },
  })
}

const fetchPendingApprovals = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/buildings/table/vo-bo');
    pendingItems.value = response.data.map(item => ({
      id: item.id || '',
      status: item.status || '',
      name1: item.name1 || '',
      market: item.market || '',
      subMarket: item.subMarket || '',
      industrialPark: item.industrialPark || '',
      registered: item.registered || '',
      typeName: item.typeName || ''
    }));
  } catch (error) {
    console.error('Error fetching pending approvals:', error);
    pendingItems.value = [];
  }
};

onMounted(async () => {
  await fetchPendingApprovals();
});
</script>

<template>
  <CCard class="mb-4">
    <CCardHeader>
      <strong>Pending Approvals</strong>
    </CCardHeader>
    <CCardBody>
      <CSmartTable
        :columns="columns"
        :items="pendingItems"
        :items-per-page="10"
        :table-props="{
          hover: true,
          responsive: true,
          striped: true,
        }"
        cleaner
        clickable-rows
        column-filter
        column-sorter
        footer
        header
        items-per-page-select
        pagination
        table-filter
      >
        <template #status="{ item }">
          <td>
            <CBadge :color="getBadge(item.status)">{{ item.status }}</CBadge>
          </td>
        </template>

        <template #actions="{ item }">
          <td class="py-2">
            <CButton
              color="primary"
              variant="outline"
              square
              size="sm"
              @click="showDetails(item)"
            >
              Details
            </CButton>
          </td>
        </template>
      </CSmartTable>
    </CCardBody>
  </CCard>
</template>