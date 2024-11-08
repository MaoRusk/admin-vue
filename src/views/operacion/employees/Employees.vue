<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { cilPlus } from '@coreui/icons';
import data from './_data';

const router = useRouter();
const employees = ref([]);

const selectedStatus = ref('All');

const statusOptions = computed(() => ['All', ...new Set(employees.value.map(employee => employee.typeName))]);

const filteredEmployees = computed(() => {
  if (selectedStatus.value === 'All') {
    return employees.value;
  }
  return employees.value.filter(employee => employee.typeName === selectedStatus.value);
});

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' },
  { key: 'lastName', label: 'Last Name' },
  { key: 'userName', label: 'User Name' },
  { key: 'typeName', label: 'Position' },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: 'Actions' },
];

const showEmployeeDetails = (item) => {
  router.push({
    name: 'EmployeeDetalle',
    params: { id: Number(item.id) },
  });
};

const addUserFunction = () => {
  router.push({
    name: 'EmployeeDetalle',
    params: { id: 0 },
  });
};

onMounted(async () => {
  try {
    const response = await axios.get('https://laravel-back-production-9320.up.railway.app/api/employees');
    employees.value = response.data;
  } catch (error) {
    console.error('Error fetching employees:', error);
  }
});
</script>

<template>
  <div class="d-flex justify-content-end mb-3">
    <CButton color="success" @click="addUserFunction()">
      <CIcon :content="cilPlus" size="sm" />
      New Building
    </CButton>
  </div>

  <div class="d-flex justify-content-end align-items-center mb-3">
    <div>
      <CFormSelect v-model="selectedStatus" :options="statusOptions" style="width: 200px;" />
    </div>
  </div>

  <CSmartTable
    :active-page="1"
    cleaner
    column-filter
    column-sorter
    :columns="columns"
    clickable-rows
    header
    :items-per-page="10"
    items-per-page-select
    :items="filteredEmployees"
    pagination
    table-filter
    :table-props="{
      hover: true,
      striped: true,
      responsive: true,
    }"
  >

    <template #actions="{ item }">
      <td class="py-2">
        <CButton color="primary" variant="outline" square size="sm" @click="showEmployeeDetails(item)">
          {{ 'Details' }}
        </CButton>
      </td>
    </template>
  </CSmartTable>
</template>