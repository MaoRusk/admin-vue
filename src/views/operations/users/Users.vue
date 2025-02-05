<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import { cilPlus, cilTrash, cilEyedropper } from '@coreui/icons';
import { API } from '../../../services';
import { useLocalStorage } from '../../../composables/useLocalStorage';
import { USERS_ITEMS_PER_PAGE } from '../../../constants';
import { ROUTE_NAMES } from '../../../router/routeNames';

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

const columns = [
  { key: 'status', label: 'Status' },
  { key: 'name', label: 'Name' },
  { key: 'lastName', label: 'Last Name' },
  { key: 'userName', label: 'User Name' },
  { key: 'email', label: 'Email' },
  { key: 'roleName', label: 'Role' },
  { key: 'actions', label: 'Actions', sorter: false, filter: false },
];

async function removeUser(id) {
  try {
    const { isConfirmed } = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    });
    
    if (isConfirmed) {
      const { data } = await API.users.deleteUser(id);
      Swal.fire('Deleted!', data.message, 'success');
      fetchUsers();
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    Swal.fire('Error!', 'Failed to delete user', 'error');
  }
}

async function fetchUsers() {
  loading.value = true;
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      router.push({ name: 'Login' });
      return;
    }

    const { data: response } = await API.users.getUsers({
      page: page.value,
      size: itemsPerPage.value,
      search: tableSearch.value,
    }, columnFilter.value, columnSorter.value);

    if (response.success) {
      page.value = response.current_page;
      totalItems.value = response.total;
      totalPages.value = response.last_page;

      // Obtener todos los roles una sola vez
      const { data: rolesResponse } = await API.roles.getAllRoles();
      const roles = rolesResponse.success ? rolesResponse.data : [];
      
      // Mapear usuarios con sus roles
      users.value = response.data.map((item) => {
        const userRole = roles.find(role => role.id === item.role_id);
        return {
          id: item.id,
          name: item.name,
          lastName: item.last_name,
          userName: item.user_name,
          email: item.email,
          status: item.status,
          roleName: userRole?.name || 'No Role',
        };
      });
    }
  } catch (error) {
    console.error('Error fetching users:', error);
    users.value = [];
    if (error.response?.status === 401) {
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
    <CButton 
      color="success" 
      variant="outline" 
      @click="$router.push({ name: ROUTE_NAMES.USERS_CREATE })"
    >
      <CIcon :content="cilPlus" size="sm" />
      New User
    </CButton>
  </div>

  <CSmartTable
    :pagination="{ external: true }"
    :column-filter="{ external: true }"
    :column-sorter="{ external: true }"
    :table-filter="{ external: true }"
    :loading="loading"
    :items="users"
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
      <td class="d-flex gap-1">
        <CButton 
          color="primary" 
          variant="outline" 
          square 
          size="sm" 
          @click="$router.push({ 
            name: ROUTE_NAMES.USERS_UPDATE, 
            params: { id: item.id } 
          })"
        >
          <CIcon :content="cilEyedropper" size="sm" />
        </CButton>
        <CButton 
          color="danger" 
          variant="outline" 
          square 
          size="sm" 
          @click="removeUser(item.id)"
        >
          <CIcon :content="cilTrash" size="sm" />
        </CButton>
      </td>
    </template>
  </CSmartTable>
  <div>
    Total records {{ totalItems }}
  </div>
</template>