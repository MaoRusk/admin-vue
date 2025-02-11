<template>
  <CCard class="mb-4">
    <CRow>
      <CCol :xs="12" :xl="10">&nbsp;</CCol>
      <CCol :xs="12" :xl="2">
        <CCardBody>
          <CButton color="success" @click="newIndustrialPark()">
            <CIcon icon="cilPlus" class="me-2" />New Industrial Park
          </CButton>
        </CCardBody>
      </CCol>
    </CRow>
  </CCard>

  <CCard class="mb-4">
    <CCardBody>
      <div class="table-responsive">
        <CSmartTable
          v-if="industrialParks.length > 0"
          :active-page="1"
          :items="tableItems"
          :columns="columns"
          :items-per-page="10"
          :table-filter="true"
          cleaner
          :table-filter-label="'Search:'"
          :table-filter-placeholder="'Type something...'"
          :pagination="true"
          hover
          responsive
        >
          <template #actions="{ item }">
            <td class="py-2 text-center">
              <CButton 
                color="primary" 
                variant="outline" 
                square 
                size="sm" 
                @click="viewDetails(item)"
                class="mx-1 my-1"
              >
                <CIcon icon="cil-pencil" />
              </CButton>
              <CButton 
                color="danger" 
                variant="outline" 
                square 
                size="sm" 
                class="mx-1 my-1"
                @click="deleteIndustrialPark(item)"
              >
                <CIcon icon="cil-trash" />
              </CButton>
            </td>
          </template>
        </CSmartTable>
      </div>
    </CCardBody>
  </CCard>
</template>

<script>
import IndustrialParksService from '@/services/IndustrialParks'
import MarketsService from '@/services/Markets'
import SubmarketsService from '@/services/Submarkets'
import Swal from 'sweetalert2'

export default {
  name: 'IndustrialParksTable',
  data() {
    return {
      industrialParks: [],
      markets: {},
      submarkets: {},
      columns: [
        {
          key: 'name',
          label: 'Name',
          _style: { minWidth: '200px' }
        },
        {
          key: 'market_name',
          label: 'Market',
          _style: { minWidth: '150px' }
        },
        {
          key: 'submarket_name',
          label: 'Submarket',
          _style: { minWidth: '150px' }
        },
        {
          key: 'actions',
          label: 'Actions',
          _style: { width: '120px', textAlign: 'center' }
        },
      ],
    }
  },
  computed: {
    tableItems() {
      return this.industrialParks.map(park => ({
        ...park,
        market_name: this.markets[park.market_id]?.name || '-',
        submarket_name: this.submarkets[park.submarket_id]?.name || '-'
      }))
    }
  },
  methods: {
    async fetchData() {
      try {
        const [parksResponse, marketsResponse, submarketResponse] = await Promise.all([
          IndustrialParksService.getIndustrialParks(),
          MarketsService.getMarkets(),
          SubmarketsService.getSubmarkets()
        ])

        this.industrialParks = parksResponse.data.data

        // Convert arrays to lookup objects for better performance
        this.markets = marketsResponse.data.data.reduce((acc, market) => {
          acc[market.id] = market
          return acc
        }, {})

        this.submarkets = submarketResponse.data.data.reduce((acc, submarket) => {
          acc[submarket.id] = submarket
          return acc
        }, {})
      } catch (error) {
        console.error('Error fetching data:', error)
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Error loading data',
          toast: true,
          position: 'bottom',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true
        })
      }
    },
    newIndustrialPark() {
      this.$router.push('/operacion/industrial-parks/0')
    },
    viewDetails(item) {
      this.$router.push(`/operacion/industrial-parks/${item.id}`)
    },
    async deleteIndustrialPark(item) {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      })

      if (result.isConfirmed) {
        try {
          await IndustrialParksService.deleteIndustrialPark(item.id)
          await this.fetchData()
          
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: `${item.name} has been deleted.`,
            toast: true,
            position: 'bottom',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
          })
        } catch (error) {
          console.error('Error deleting industrial park:', error)
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Error deleting industrial park',
            toast: true,
            position: 'bottom',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
          })
        }
      }
    }
  },
  mounted() {
    this.fetchData()
  }
}
</script>

