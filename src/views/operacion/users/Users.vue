<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { cilPlus } from '@coreui/icons';
import { API } from '../../../services';
import { useLocalStorage } from '../../../composables/useLocalStorage';
import { USERS_ITEMS_PER_PAGE, AUTH_TOKEN } from '../../../constants';

const router = useRouter();
const storage = useLocalStorage();

const users = ref([]);
const loading = ref(false);
const totalItems = ref(0);
const totalPages = ref(0);
const page = ref(1);
const itemsPerPage = ref(storage.getItem(USERS_ITEMS_PER_PAGE) ?? 10);
const columnFilter = ref({});
const columnSorter = ref({});
const tableSearch = ref('');

const selectedStatus = ref('All');

const statusOptions = computed(() => ['All', ...new Set(users.value.map(user => user.typeName))]);

const filteredUsers = computed(() => {
  if (selectedStatus.value === 'All') {
    return users.value;
  }
  return users.value.filter(user => user.typeName === selectedStatus.value);
});

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' },
  { key: 'lastName', label: 'Last Name' },
  { key: 'userName', label: 'User Name' },
  { key: 'typeName', label: 'Position' },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: 'Actions', sorter: false, filter: false },
];

const showUserDetails = (item) => {
  router.push({
    name: 'UserDetail',
    params: { id: Number(item.id) },
  });
};

const addUser = () => {
  router.push({
    name: 'UserDetail',
    params: { id: 0 },
  });
};

async function fetchUsers() {
  loading.value = true;
  try {
    const response = await API.users.getUsers({
      page: page.value,
      size: itemsPerPage.value,
      search: tableSearch.value,
    }, columnFilter.value, columnSorter.value);

    const { success, data: userData } = response.data;

    if (!success) {
      throw new Error('Error al obtener usuarios');
    }

    // Adaptar el formato de respuesta
    const adaptedData = {
      data: {
        current_page: page.value,
        data: userData.map(item => ({
          id: item.id,
          name: item.name,
          lastName: item.last_name,
          userName: item.user_name,
          typeName: item.role_id ? 'Admin' : 'User',
          status: item.status
        })),
        total: userData.length,
        last_page: 1
      }
    };

    page.value = adaptedData.data.current_page;
    totalItems.value = adaptedData.data.total;
    totalPages.value = adaptedData.data.last_page;
    users.value = adaptedData.data.data;

  } catch (error) {
    console.error('Error en fetchUsers:', {
      mensaje: error.message,
      tipo: error.name,
      stack: error.stack
    });
    
    users.value = [];
    
    if (error.response?.status === 401) {
      localStorage.removeItem(AUTH_TOKEN);
      router.push({ name: 'Login' });
    }
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchUsers();
});

watch([page, itemsPerPage, tableSearch], fetchUsers);
watch([columnSorter, columnFilter], fetchUsers, { deep: true });
</script>

<template>
  <div class="d-flex justify-content-end mb-3">
    <CButton color="success" @click="addUser">
      <CIcon :content="cilPlus" size="sm" />
      Add User
    </CButton>
  </div>

  <div class="d-flex justify-content-end align-items-center mb-3">
    <div>
      <CFormSelect v-model="selectedStatus" :options="statusOptions" style="width: 200px;" />
    </div>
  </div>

  <CSmartTable
    :pagination="{ external: true }"
    :column-filter="{ external: true }"
    :column-sorter="{ external: true }"
    :table-filter="{ external: true }"
    :loading="loading"
    :items="filteredUsers"
    :paginationProps="{
      activePage: page,
      pages: totalPages
    }"
    :columns="columns"
    cleaner
    footer
    header
    items-per-page-select
    :items-per-page="itemsPerPage"
    :table-props="{
      hover: true,
      striped: true,
      responsive: true,
    }"
    @active-page-change="(_activePage) => {
      page = _activePage;
    }"
    @items-per-page-change="(_itemsPerPage) => {
      page = 1;
      itemsPerPage = _itemsPerPage;
      storage.setItem(USERS_ITEMS_PER_PAGE, _itemsPerPage);
    }"
    @sorter-change="(sorter) => {
      columnSorter = sorter;
    }"
    @table-filter-change="(filter) => {
      page = 1;
      tableSearch = filter;
    }"
    @column-filter-change="(filter) => {
      page = 1;
      columnFilter = filter;
    }"
  >
    <template #actions="{ item }">
      <td class="py-2">
        <CButton color="primary" variant="outline" square size="sm" @click="showUserDetails(item)">
          Details
        </CButton>
      </td>
    </template>
  </CSmartTable>
  <div>
    Total records {{ totalItems }}
  </div>
</template>