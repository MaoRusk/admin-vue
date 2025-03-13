<script setup>
import { ref, onMounted, watch } from 'vue';
import Swal from 'sweetalert2';

import { useLocalStorage } from '../../../composables/useLocalStorage';
import { API } from '../../../services';
import { LANDS_ITEMS_PER_PAGE } from '../../../constants';
import LandsAvailabilityForm from './LandsAvailabilityForm.vue';
import { useAuthStore } from '../../../stores/auth';

const props = defineProps({
  landId: {
    type: Number,
    required: true
  }
})
const emit = defineEmits(['submitting', 'changeShowForm'])

const storage = useLocalStorage()
const { can } = useAuthStore()

const landsAvl = ref([]);

const loading = ref(false)
const totalItems = ref(0)
const totalPages = ref(0)
const page = ref(1)
const itemsPerPage = ref(storage.getItem(LANDS_ITEMS_PER_PAGE) ?? 10)
const columnFilter = ref({})
const columnSorter = ref({})
const tableSearch = ref('')

const showForm = ref(false);
const selectedAvailabilityId = ref(null);

const columns = [
  { key: 'land_condition', label: 'Land Condition' },
  { key: 'avl_size_ha', label: 'Size ha' },
  { key: 'avl_deal', label: 'Land Deal' },
  { key: 'avl_minimum', label: 'Minimum' },
  { key: 'rail_spur', label: 'Rail Spur' },
  { key: 'actions', label: 'actions', sorter: false, filter: false },
];

async function fetchLandsAvl() {
  loading.value = true
  try {
    const { data } = await API.landsAvailability.getLandsAvailability(props.landId, {
      page: page.value,
      size: itemsPerPage.value,
      search: tableSearch.value,
    }, columnFilter.value, columnSorter.value);
    page.value = data.data.current_page
    totalItems.value = data.data.total
    totalPages.value = data.data.last_page
    landsAvl.value = data.data.data.map(item => ({
      ...item,
      land_condition: item.land_condition ?? '',
      avl_size_ha: item.avl_size_ha ?? '',
      avl_deal: item.avl_deal ?? '',
      avl_minimum: item.avl_minimum ?? '',
      rail_spur: item.rail_spur ? 'YES' : 'NO',
    }))
    loading.value = false
  } catch (error) {
    console.error('Error fetching landsAvl:', error);
    landsAvl.value = [];
  } finally {
    loading.value = false
  }
}

const handleEdit = ({ id: availabilityId }) => {
  selectedAvailabilityId.value = availabilityId;
  showForm.value = true;
};

const handleReturn = () => {
  showForm.value = false;
  selectedAvailabilityId.value = null;
  emit('changeShowForm', false);
  fetchLandsAvl();
};

async function removeAvailability(availabilityId) {
  try {
    const { isConfirmed } = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    })
    if (isConfirmed) {
      const { data } = await API.landsAvailability.deleteLandAvailability(props.landId, availabilityId);
      Swal.fire('Deleted!', data.message, 'success')
      fetchLandsAvl()
    }
  } catch (error) {
    console.error('Error fetching landsAvl:', error);
    Swal.fire('Failed!', error.message, 'error')
  }
}

const handleAddAvailability = () => {
  selectedAvailabilityId.value = 0;
  showForm.value = true;
  emit('changeShowForm', true);
};

onMounted(() => {
  fetchLandsAvl();
});

watch(showForm, (newValue) => {
  emit('changeShowForm', newValue);
});

const formAvailabilityRef = ref(null)

watch([page, itemsPerPage, tableSearch], fetchLandsAvl)
watch([columnSorter, columnFilter], fetchLandsAvl, { deep: true })

defineExpose({
  showForm,
  handleReturn,
  submit() {
    formAvailabilityRef.value?.submit?.()
  }
})
</script>

<template>
  <div class="p-1">
    <div v-if="!showForm">
      <div class="mb-4 d-flex justify-content-between align-items-center">
        <h2>Lands Availability</h2>
        <CButton color="primary" @click="handleAddAvailability" v-if="can('lands.available.create')">
          <CIcon name="cilPlus" class="me-2" />
          Add Availability
        </CButton>
      </div>

      <CCard>
        <CCardBody>
          <CSmartTable
            :pagination="{ external: true }"
            :column-filter="{ external: true }"
            :column-sorter="{ external: true }"
            :table-filter="{ external: true }"
            :loading="loading"
            :items="landsAvl"
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
              page = _activePage
            }"
            @items-per-page-change="(_itemsPerPage) => {
              activePage = 1
              itemsPerPage = _itemsPerPage
              storage.setItem(LANDS_ITEMS_PER_PAGE, _itemsPerPage)
            }"
            @sorter-change="(sorter) => {
              columnSorter = sorter
            }"
            @table-filter-change="(filter) => {
              activePage = 1
              tableSearch = filter
            }"
            @column-filter-change="(filter) => {
              activePage = 1
              columnFilter = filter
            }"
          >
            <template #actions="{ item }">
              <td class="d-flex gap-1">
                <CButton color="primary" variant="outline" square size="sm" v-if="can('lands.available.show', 'lands.available.update')">
                  <CIcon name="cilPencil" size="sm" @click="handleEdit(item)" />
                </CButton>
                <CButton color="danger" variant="outline" square size="sm" @click="removeAvailability(item.id)" v-if="can('lands.available.destroy')">
                  <CIcon name="cilTrash" size="sm" />
                </CButton>
              </td>
            </template>
          </CSmartTable>
          <div>
            Total records {{ totalItems }}
          </div>
        </CCardBody>
      </CCard>
    </div>

    <!-- Show form when editing -->
    <div v-else>
      <LandsAvailabilityForm 
        :landId="props.landId"
        :availabilityId="selectedAvailabilityId"
        @return="handleReturn"
        @submitting="(value) => emit('submitting', value)"
        @changeShowForm="(value) => emit('changeShowForm', value)"
        ref="formAvailabilityRef"
      />
    </div>
  </div>
</template>
<style scoped>
</style>