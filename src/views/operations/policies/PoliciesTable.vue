<script setup>

import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useRouter } from 'vue-router';
import { cilUserPlus } from '@coreui/icons';
import { ROUTE_NAMES } from '@/router/routeNames';

const router = useRouter();
const usersData = ref([]);
const selected = ref([])
const modulesCbo = ref([]);
const marketsCbo = ref([]);
const submarketCbo = ref([]);
const usersCbo = ref([]);
const selectedCompany = ref([]);

const columns = [
  { key: 'select', label: '', filter: false, sorter: false },
  { key: 'name', _style: { width: '25%' } },
  { key: 'lastName', _style: { width: '15%' } },
  { key: 'userName', _style: { width: '15%' } },
  { label: 'Company', key: 'nameCompany', _style: { width: '15%' } },
  { key: 'status', _style: { width: '15%' } },
  { key: 'actions', _style: { width: '15%' } }
];

const processedUsersData = computed(() => {
  return usersData.value.map(user => ({
    ...user,
    _selected: selected.value.includes(user.id)
  }));
});

const check = (event, id) => {
  if (event.target.checked) {
    selected.value = [...selected.value, id]

    getUserCombo();

  } else {
    selected.value = selected.value.filter((itemId) => itemId !== id)
  }
}

onMounted(fetchUsers);
onMounted(fetchData);
onMounted(fetchData);
getUserCombo(getUserCombo);

async function getUserCombo(){
  try {
    const response = await axios.get('https://laravel-back-production-9320.up.railway.app/api/security/users');
    usersCbo.value = response.data.map(user => ({
      value: user.id,
      label: user.name,
      selected: false
    }));
  } catch (error) {
    console.error('Error fetching users:', error);
    Swal.fire({
      title: 'Error!',
      text: 'Error fetching users.',
      icon: 'error',
      showConfirmButton: false,
      timer: 1500
    });
  }
}

async function fetchUsers() {
  try {
    const response = await axios.get('https://laravel-back-production-9320.up.railway.app/api/user');
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
    name: ROUTE_NAMES.POLICY_DETAIL,
    params: { id: Number(item.id) },
  });
}

function addUserFunction() {
  router.push({
    name: ROUTE_NAMES.POLICY_DETAIL,
    params: { id: 0 },
  });
}

const setUserCombo = (value) => {

  if (value != 0) {   
    selectedCompany.value = value[0].value;
  }
};

const inheritPermissions = () => {
  
  // * validando que almenos se seleccione un check
  if(selected.value.length == 0){
    Swal.fire({
      title: "Empty checks",
      text: "Please select at least one user",
      icon: "error",
      showConfirmButton: false,
      timer: 3000
    });
  }

  if (selectedCompany.value == "") {
    Swal.fire({
      title: "Empty User",
      text: "Please select one user",
      icon: "error",
      showConfirmButton: false,
      timer: 3000
    });
  }

  const formData = new FormData();
  formData.append('userClones', selected.value);

  try {            
      axios.post(`https://laravel-back-production-9320.up.railway.app/api/permissions/clone/multiple/${selectedCompany.value}`, formData).then(response => {

        
        Swal.fire({
          title: response.data.title,
          text: response.data.text,
          icon: response.data.icon,
          showConfirmButton: false,
          timer: 3000
        }).then(() => {

          if (response.data.icon == "success") {
            location.reload();
          }
        })
        
      }).catch(error => {
        Swal.fire({
          title: "Error cloning permissions",
          text: error.response.data.message,
          icon: "error",
          showConfirmButton: false,
          timer: 3000
        });
      });

  } catch (error) {
    console.error('Error processing request:', error);
  }
}

async function fetchData() {
    try {
      const [modulesResponse, marketsResponse, submarketResponse] = await Promise.all([
        axios.get('https://laravel-back-production-9320.up.railway.app/api/modules'),
        axios.get('https://laravel-back-production-9320.up.railway.app/api/market'),
        axios.get('https://laravel-back-production-9320.up.railway.app/api/submarket'),
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
      console.error('Error fetching data:', error);
    }
  };
</script>

<template>

  Selected: {{ JSON.stringify(selected) }}

  <div style="display: flex; justify-content: right;">
    <div style="margin-right: .5rem;">
      <CMultiSelect
        :multiple="false"
        label="Inherit Permissions From:"
        v-model="selectedCompany"
        :options="usersCbo"
        @change="setUserCombo($event)"
      />
    </div>
    <div style="display: flex; justify-content: flex-end; align-items: flex-end;">
      <CButton color="warning" variant="outline" @click="inheritPermissions">
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

    <template #select="{ item }">
      <td>
        <CFormCheck
          :id="`checkbox${item.id}`"
          :checked="item._selected"
          @change="(event) => check(event, item.id)"
        />

        <CFormLabel variant="custom-checkbox" :for="`checkbox${item.id}`" />
      </td>
    </template>
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
