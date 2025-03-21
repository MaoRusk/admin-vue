<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const pendingItems = ref([]);
const selectedItems = ref([]);

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

const approveSelected = async () => {
  try {
    if (selectedItems.value.length === 0) {
      alert('Please select at least one building');
      return;
    }

    const selectedIds = selectedItems.value.map(item => item.id);
    
    await axios.post('http://127.0.0.1:8000/api/buildings/approve', {
      ids: selectedIds,
      vobo: 1
    });

    await fetchPendingApprovals();
    selectedItems.value = [];
    
    alert('Buildings approved successfully');
  } catch (error) {
    console.error('Error approving buildings:', error);
    alert('Error approving buildings');
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
      <CButton
        color="primary"
        class="mb-3"
        @click="approveSelected"
        :disabled="selectedItems.length === 0"
      >
        Approve Selected ({{ selectedItems.length }})
      </CButton>

      <CSmartTable
        v-model:selected="selectedItems"
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
        selectable
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