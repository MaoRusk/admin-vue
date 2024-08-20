<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { cilUserPlus } from '@coreui/icons';

const router = useRouter();
const usersData = ref([]);
const selected = ref([]);
const selectAll = ref(false);
const modulesCbo = ref([]);
const marketsCbo = ref([]);
const submarketCbo = ref([]);



const columns = [
  { key: 'name', _style: { width: '25%' } },
  { key: 'lastName', _style: { width: '15%' } },
  { key: 'userName', _style: { width: '15%' } },
  { key: 'status', _style: { width: '15%' } },
  { key: 'actions', _style: { width: '15%' } }
];

const processedUsersData = computed(() => {
  return usersData.value.map(user => ({
    ...user,
    _selected: selected.value.includes(user.id)
  }));
});

onMounted(fetchUsers);
onMounted(fetchData);

async function fetchUsers() {
  try {
    const response = await axios.get('http://localhost:8000/api/user');
    usersData.value = response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
}

function getBadge(status) {
  const badgeColors = {
    'Activo': 'success',
    'Inactivo': 'danger'
  };
  return badgeColors[status] || 'secondary';
}

function showUserDetails(item) {
  router.push({
    name: 'PolizaDetalle',
    params: { id: Number(item.id) },
  });
}

function addUserFunction() {
  router.push({
    name: 'PolizaDetalle',
    params: { id: 0 },
  });
}

function check(event, id) {
  if (event.target.checked) {
    selected.value.push(id);
  } else {
    selected.value = selected.value.filter(itemId => itemId !== id);
    selectAll.value = false; // Desmarca el checkbox padre si se desmarca alguno hijo
  }
}

function toggleSelectAll() {
  if (selectAll.value) {
    selected.value = usersData.value.map(user => user.id);
  } else {
    selected.value = [];
  }
}

async function fetchData() {
    try {
      const [modulesResponse, marketsResponse, submarketResponse] = await Promise.all([
        axios.get('http://localhost:8000/api/modules'),
        axios.get('http://localhost:8000/api/market'),
        axios.get('http://localhost:8000/api/submarket'),
      ]);

      modulesCbo.value = modulesResponse.data.map(module => ({
        value: module.id,
        label: module.moduleName,
      }));

      marketsCbo.value = marketsResponse.data.map(market => ({
        value: market.id,
        label: market.marketName,
      }));

      submarketCbo.value = submarketResponse.data.map(submarket => ({
        value: submarket.id,
        label: submarket.subMarketName,
        marketId: submarket.marketId,
      }));

    } catch (error) {
      console.error('Hubo un error obteniendo los datos:', error);
    }
  };
</script>

<template>
    <div style="display: flex; justify-content: right;">
      <div style="margin-right: .5rem;">
        <CMultiSelect
          :multiple="false"
          label="Heredar Permisos De:"
          v-model="selectedCompany"
          :options="usersCbo"
          @change="handleCompanyChange($event)"
        />
      </div>
      <div style="display: flex;justify-content: flex-end;align-items: flex-end;">
          <CButton color="warning" variant="outline">
            Confirm
          </CButton>
      </div>
    </div>
  <!-- <div class="d-flex justify-content-end mb-3">
    <div>
      <CMultiSelect 
        label="Select Modules"
        :options="modulesCbo"
        @change="handleModulesCbo($event)"
        selectionType="counter" />
    </div>
    <div>      
      <CMultiSelect 
        label="Select Markets"
        :options="modulesCbo"
        @change="handleModulesCbo($event)"
        selectionType="counter" />
    </div>
    <div>      
      <CMultiSelect 
        label="Select Submarket"
        :options="modulesCbo"
        @change="handleModulesCbo($event)"
        selectionType="counter" />
    </div>
    <div>      
      <CMultiSelect 
        label="Select Year"
        :options="modulesCbo"
        @change="handleModulesCbo($event)"
        selectionType="counter" />
    </div>
   
    
    <CButton color="success" @click="addUserFunction">
      <CIcon :content="cilUserPlus" size="sm" />
      Add User
    </CButton>
  </div> -->

  <CSmartTable
  selectable
    :columns="columns"
    :items="processedUsersData"
    :active-page="1"
    :items-per-page="10"
    cleaner
    column-filter
    column-sorter
    clickable-rows
    footer
    header
    items-per-page-select
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
          Details
        </CButton>
      </td>
    </template>
  </CSmartTable>
</template>
