<script setup>
import { ref, onMounted, watch } from 'vue';
import Swal from 'sweetalert2';
import { useRouter } from 'vue-router';

import { useLocalStorage } from '../../../composables/useLocalStorage';
import { API } from '../../../services';
import { MARKET_GROWTH_ITEMS_PER_PAGE } from '../../../constants';
import { ROUTE_NAMES } from '../../../router/routeNames';
import { useAuthStore } from '../../../stores/auth';

const router = useRouter()
const storage = useLocalStorage()
const { can } = useAuthStore()

const marketGrowths = ref([]);

const loading = ref(false)
const totalItems = ref(0)
const totalPages = ref(0)
const page = ref(1)
const itemsPerPage = ref(storage.getItem(MARKET_GROWTH_ITEMS_PER_PAGE) ?? 10)
const columnFilter = ref({})
const columnSorter = ref({})
const tableSearch = ref('')

const columns = [
  { key: 'type', label: 'Type' },
  { key: 'deal', label: 'Deal' },
  { key: 'size_sf', label: 'Size SF' },
  { key: 'marketName', label: 'Market' },
  { key: 'submarketName', label: 'Submarket' },
  { key: 'industrialParkName', label: 'Industrial Park' },
  { key: 'actions', label: 'actions', sorter: false, filter: false },
];

async function removeMarketGrowth(id) {
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
      const { data } = await API.marketGrowth.deleteMarketGrowth(id);
      Swal.fire('Deleted!', data.message, 'success')
      fetchMarketGrowths()
    }
  } catch (error) {
    console.error('Error deleting market growth:', error);
    Swal.fire('Failed!', error.message, 'error')
  }
}

async function fetchMarketGrowths() {
  loading.value = true
  try {
    const { data } = await API.marketGrowth.getMarketGrowths({
      page: page.value,
      size: itemsPerPage.value,
      search: tableSearch.value,
    }, columnFilter.value, columnSorter.value);
    
    page.value = data.data.current_page
    totalItems.value = data.data.total
    totalPages.value = data.data.last_page

    marketGrowths.value = data.data.data.map((item) => ({
      ...item,
      marketName: item.market?.name || '-',
      submarketName: item.sub_market?.name || '-',
      industrialParkName: item.industrial_park?.name || '-',
    }))
  } catch (error) {
    console.error('Error fetching market growths:', error);
    marketGrowths.value = [];
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchMarketGrowths();
});

watch([page, itemsPerPage, tableSearch], fetchMarketGrowths)
watch([columnSorter, columnFilter], fetchMarketGrowths, { deep: true })
</script>

<template>
  <div class="d-flex justify-content-end mb-3">
    <CButton color="success" @click="$router.push({ name: ROUTE_NAMES.MARKET_GROWTH_CREATE })" v-if="can('market-growth.create')">
      <CIcon name="cilPlus" size="sm" />
      New Market Growth
    </CButton>
  </div>
  <CSmartTable
    :pagination="{ external: true }"
    :column-filter="{ external: true }"
    :column-sorter="{ external: true }"
    :table-filter="{ external: true }"
    :loading="loading"
    :items="marketGrowths"
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
      storage.setItem(MARKET_GROWTH_ITEMS_PER_PAGE, _itemsPerPage)
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
    clickable-rows
    @row-click="item => {
      if (can('market-growth.update', 'market-growth.show')) {
        $router.push({ name: ROUTE_NAMES.MARKET_GROWTH_UPDATE, params: { marketGrowthId: item.id } })
      }
    }"
  >
    <template #actions="{ item }">
      <td style="vertical-align: middle;">
        <div class="d-flex gap-1">
          <CButton color="danger" variant="outline" square size="sm" @click.stop="removeMarketGrowth(item.id)" v-if="can('market-growth.destroy')">
            <CIcon name="cilTrash" size="sm" />
          </CButton>
        </div>
      </td>
    </template>
  </CSmartTable>
  <div>
    Total records {{ totalItems }}
  </div>
</template> 