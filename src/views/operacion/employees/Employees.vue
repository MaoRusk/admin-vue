<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { cilPlus } from '@coreui/icons';

const router = useRouter();
const employees = ref([]);
const selectedStatus = ref('All');

// Asegurarnos de que employees.value sea siempre un array
const statusOptions = computed(() => {
  const employeesList = Array.isArray(employees.value) ? employees.value : [];
  const types = employeesList.map(employee => employee.typeName || 'Unknown');
  return ['All', ...new Set(types)];
});

const filteredEmployees = computed(() => {
  const employeesList = Array.isArray(employees.value) ? employees.value : [];
  if (selectedStatus.value === 'All') {
    return employeesList;
  }
  return employeesList.filter(employee => employee.typeName === selectedStatus.value);
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
    const response = await axios.get(`laravel-back.test/api/users`);
    console.log(response.data);
    
    // Asegurarnos de que la respuesta sea un array
    employees.value = Array.isArray(response.data) ? response.data : 
                     response.data?.data ? response.data.data : [];
                     
    if (!Array.isArray(employees.value)) {
      console.error('La respuesta de la API no es un array:', response.data);
      employees.value = []; // Asignar array vacío como fallback
    }
  } catch (error) {
    console.error('Error fetching employees:', error);
    employees.value = []; // Asignar array vacío en caso de error
  }
});
</script>

<template>
  <div class="d-flex justify-content-end mb-3">
    <CButton color="success" @click="addUserFunction()">
      <CIcon :content="cilPlus" size="sm" />
      Add Employee
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
        <CButton 
          color="primary" 
          variant="outline" 
          square 
          size="sm" 
          @click="showEmployeeDetails(item)"
        >
          {{ 'Details' }}
        </CButton>
      </td>
    </template>
  </CSmartTable>
</template>