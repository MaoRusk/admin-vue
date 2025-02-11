<script setup>
import { ref, onMounted, watch } from 'vue';
import Swal from 'sweetalert2';
import { cilPencil, cilTrash, cilPlus } from '@coreui/icons';

import BuildingAvailabilityForm from './BuildingAvailabilityForm.vue';
import { useLocalStorage } from '../../../composables/useLocalStorage';
import { API } from '../../../services';
import { BUILDINGS_ITEMS_PER_PAGE } from '../../../constants';

const props = defineProps({
  buildingId: {
    type: Number,
    required: true
  }
})
const emit = defineEmits(['submitting', 'changeShowForm'])

const storage = useLocalStorage()

const buildings = ref([]);

const loading = ref(false)
const totalItems = ref(0)
const totalPages = ref(0)
const page = ref(1)
const itemsPerPage = ref(storage.getItem(BUILDINGS_ITEMS_PER_PAGE) ?? 10)
const columnFilter = ref({})
const columnSorter = ref({})
const tableSearch = ref('')

const showForm = ref(false);
const selectedAvailabilityId = ref(null);

const columns = [
  { key: 'building_state', label: 'Building State' },
  { key: 'avl_size_sf', label: 'Size (SF)' },
  { key: 'avl_building_dimensions', label: 'Building Dimensions' },
  { key: 'avl_minimum_space_sf', label: 'Min. Space' },
  { key: 'dock_doors', label: 'Dock Doors' },
  { key: 'actions', label: 'actions', sorter: false, filter: false },
];

async function fetchBuildings() {
  loading.value = true
  try {
    const { data } = await API.buildingsAvailability.getAvailableBuildings(props.buildingId, {
      page: page.value,
      size: itemsPerPage.value,
      search: tableSearch.value,
    }, columnFilter.value, columnSorter.value);
    page.value = data.data.current_page
    totalItems.value = data.data.total
    totalPages.value = data.data.last_page
    buildings.value = data.data.data.map(item => ({
      ...item,
      building_state: item.building_state ?? '',
      avl_size_sf: item.size_sf ?? '',
      avl_building_dimensions: item.avl_building_dimensions_ft ?? '',
      avl_minimum_space_sf: item.avl_minimum_space_sf ?? '',
      dock_doors: item.dock_doors ?? '',
    }))
    loading.value = false
  } catch (error) {
    console.error('Error fetching buildings:', error);
    buildings.value = [];
  } finally {
    loading.value = false
  }
}

// Handle edit building
const handleEdit = ({ id: availabilityId }) => {
  selectedAvailabilityId.value = availabilityId;
  showForm.value = true;
};

const handleReturn = () => {
  showForm.value = false;
  selectedAvailabilityId.value = null;
  fetchBuildings(); // Refresh the data when returning
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
      const { data } = await API.buildingsAvailability.deleteAvailableBuilding(availabilityId, props.buildingId);
      Swal.fire('Deleted!', data.message, 'success')
      fetchBuildings()
    }
  } catch (error) {
    console.error('Error fetching buildings:', error);
    Swal.fire('Failed!', error.message, 'error')
  }
}

const handleAddAvailability = () => {
  selectedAvailabilityId.value = 0; // 0 indicates new record
  showForm.value = true;
};

onMounted(() => {
  fetchBuildings();
});

watch(showForm, (newValue) => {
  emit('changeShowForm', newValue)
})

const formAvailabilityRef = ref(null)

watch([page, itemsPerPage, tableSearch], fetchBuildings)
watch([columnSorter, columnFilter], fetchBuildings, { deep: true })

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
      <!-- Header with Add button -->
      <div class="mb-4 d-flex justify-content-between align-items-center">
        <h2>Building Availability</h2>
        <CButton color="primary" @click="handleAddAvailability">
          <CIcon :icon="cilPlus" class="me-2" />
          Add Availability
        </CButton>
      </div>

      <!-- Buildings Table -->
      <CCard>
        <CCardBody>
          <CSmartTable
            :pagination="{ external: true }"
            :column-filter="{ external: true }"
            :column-sorter="{ external: true }"
            :table-filter="{ external: true }"
            :loading="loading"
            :items="buildings"
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
              storage.setItem(BUILDINGS_ITEMS_PER_PAGE, _itemsPerPage)
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
                <CButton color="primary" variant="outline" square size="sm" >
                  <CIcon :content="cilPencil" size="sm" @click="handleEdit(item)" />
                </CButton>
                <CButton color="danger" variant="outline" square size="sm" @click="removeAvailability(item.id)">
                  <CIcon :content="cilTrash" size="sm" />
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
      <BuildingAvailabilityForm 
        :buildingId="props.buildingId"
        :availabilityId="selectedAvailabilityId"
        @return="handleReturn"
        @submitting="(value) => emit('submitting', value)"
        ref="formAvailabilityRef"
      />
    </div>
  </div>
</template>
<style scoped>
</style>