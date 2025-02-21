<script setup>
import { ref, onMounted, watch } from 'vue';
import Swal from 'sweetalert2';

import { useLocalStorage } from '../../../composables/useLocalStorage';
import { API } from '../../../services';
import { LANDS_ITEMS_PER_PAGE } from '../../../constants';
import LandsAbsorptionForm from './LandsAbsorptionForm.vue';

const props = defineProps({
  landId: {
    type: Number,
    required: true
  }
})
const emit = defineEmits(['submitting', 'changeShowForm'])

const storage = useLocalStorage()

const landsAbs = ref([]);

const loading = ref(false)
const totalItems = ref(0)
const totalPages = ref(0)
const page = ref(1)
const itemsPerPage = ref(storage.getItem(LANDS_ITEMS_PER_PAGE) ?? 10)
const columnFilter = ref({})
const columnSorter = ref({})
const tableSearch = ref('')

const showForm = ref(false);
const selectedAbsorptionId = ref(null);

const columns = [
  { key: 'land_condition', label: 'Land Condition' },
  { key: 'abs_size_ha', label: 'Size ha' },
  { key: 'abs_final_use', label: 'Final Use' },
  { key: 'abs_closing_price', label: 'Closing Price' },
  { key: 'rail_spur', label: 'Rail Spur' },
  { key: 'actions', label: 'actions', sorter: false, filter: false },
];

async function fetchLandsAbs() {
  loading.value = true
  try {
    const { data } = await API.landsAbsorption.getLandsAbsorption(props.landId, {
      page: page.value,
      size: itemsPerPage.value,
      search: tableSearch.value,
    }, columnFilter.value, columnSorter.value);
    page.value = data.data.current_page
    totalItems.value = data.data.total
    totalPages.value = data.data.last_page
    landsAbs.value = data.data.data.map(item => ({
      ...item,
      land_condition: item.land_condition ?? '',
      abs_size_ha: item.abs_size_ha ?? '',
      abs_final_use: item.abs_final_use ?? '',
      abs_closing_price: item.abs_closing_price ?? '',
      rail_spur: item.rail_spur ? 'YES' : 'NO',
    }))
    loading.value = false
  } catch (error) {
    console.error('Error fetching lands Absorptions:', error);
    landsAbs.value = [];
  } finally {
    loading.value = false
  }
}

const handleEdit = ({ id: absorptionId }) => {
  selectedAbsorptionId.value = absorptionId;
  showForm.value = true;
};

const handleReturn = () => {
  showForm.value = false;
  selectedAbsorptionId.value = null;
  fetchLandsAbs();
};

async function removeAbsorption(absorptionId) {
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
      const { data } = await API.landsAbsorption.deleteLandAbsorption(props.landId, absorptionId);
      Swal.fire('Deleted!', data.message, 'success')
      fetchLandsAbs()
    }
  } catch (error) {
    console.error('Error fetching landsAbs:', error);
    Swal.fire('Failed!', error.message, 'error')
  }
}

const handleAddAbsorption = () => {
  selectedAbsorptionId.value = 0;
  showForm.value = true;
};

onMounted(() => {
  fetchLandsAbs();
});

watch(showForm, (newValue) => {
  emit('changeShowForm', newValue)
})

const formAbsorptionRef = ref(null)

watch([page, itemsPerPage, tableSearch], fetchLandsAbs)
watch([columnSorter, columnFilter], fetchLandsAbs, { deep: true })

defineExpose({
  showForm,
  handleReturn,
  submit() {
    formAbsorptionRef.value?.submit?.()
  }
})
</script>

<template>
  <div class="p-1">
    <div v-if="!showForm">
      <div class="mb-4 d-flex justify-content-between align-items-center">
        <h2>Lands Absorption</h2>
        <CButton color="primary" @click="handleAddAbsorption">
          <CIcon name="cilPlus" class="me-2" />
          Add Absorption
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
            :items="landsAbs"
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
              <td style="vertical-align: middle;">
                <div class="d-flex gap-1">
                  <CButton color="primary" variant="outline" square size="sm" >
                      <CIcon name="cilPencil" size="sm" @click="handleEdit(item)" />
                  </CButton>
                  <CButton color="danger" variant="outline" square size="sm" @click="removeAbsorption(item.id)">
                    <CIcon name="cilTrash" size="sm" />
                  </CButton>
                </div>
              </td>
            </template>
          </CSmartTable>
          <div>
            Total records {{ totalItems }}
          </div>
        </CCardBody>
      </CCard>
    </div>
    <div v-else>
      <LandsAbsorptionForm 
        :landId="props.landId"
        :absorptionId="selectedAbsorptionId"
        @return="handleReturn"
        @submitting="(value) => emit('submitting', value)"
        ref="formAbsorptionRef"
      />
    </div>
  </div>
</template>
<style scoped>
</style>