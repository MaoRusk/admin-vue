<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { cilUserPlus } from '@coreui/icons';

const router = useRouter();
const usersData = ref([]);
const selected = ref([]);
const selectAll = ref(false);

const columns = [
  {
    key: 'select',
    label: '',
    _style: { width: '1%' },
    filter: false,
    sorter: false,
  },
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
</script>

<template>
  <div class="d-flex justify-content-end mb-3">
    <CButton color="success" @click="addUserFunction">
      <CIcon :content="cilUserPlus" size="sm" />
      Add User
    </CButton>
  </div>

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
    <!-- Checkbox padre -->
    <template #column-select>
      <th>
        <CFormCheck
          v-model="selectAll"
          @change="toggleSelectAll"
        />
      </th>
    </template>

    <!-- Checkbox hijo -->
    <template #select="{ item }">
      <td class="py-2">
        <CFormCheck
          :id="`checkbox${item.id}`"
          :checked="item._selected"
          @change="(event) => check(event, item.id)"
        />
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
