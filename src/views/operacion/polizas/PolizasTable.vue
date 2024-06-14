<script setup>
  import { ref, onMounted, computed } from 'vue';
  import axios from 'axios';
  import { useRouter } from 'vue-router';
  import { cilUserPlus } from '@coreui/icons'

  const users = ref([]);
  const router = useRouter();

  const columns = [
    { key: 'name', _style: { width: '25%' } },
    { key: 'lastName', _style: { width: '15%' } },
    { key: 'userName', _style: { width: '15%' } },
    { key: 'status', _style: { width: '15%' } },
    { key: 'actions', _style: { width: '15%' } }
  ];

  onMounted(() => {
    fetchUsers();
  });

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/user');
      users.value = response.data;
    } catch (error) {
      console.error('Hubo un error obteniendo las polizas:', error);
    }
  };

  const getBadge = (status) => {
    switch (status) {
      case 'Activo': return 'success';
      case 'Inactivo': return 'danger';
      default: return 'secondary';
    }
  };

  const showUserDetails = (item) => {
    router.push({
      name: 'PolizaDetalle',
      params: { id: Number(item.id) },
    })
  }
  const addUserFunction = () => {
    router.push({
      name: 'PolizaDetalle',
      params: { id: Number(0) },
    })
  }
</script>

<template>
  <!-- Botón para agregar usuario -->
  <div class="d-flex justify-content-end mb-3">
    <CButton color="success" @click="addUserFunction()">
      <CIcon :content="cilUserPlus" size="sm" />
      Add User
    </CButton>
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
    :items="users"
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

    <template #logoUrl="{ item }">
      <td class="text-center">
        <CImage fluid :src="item.logoUrl" class="d-block mx-auto" style="max-height: 32px;" />
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