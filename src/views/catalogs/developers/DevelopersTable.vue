<script>
import DevelopersService from '@/services/Developers'
import Swal from 'sweetalert2'
import { ROUTE_NAMES } from '@/router/routeNames'
import { mapActions } from 'pinia';
import { useAuthStore } from '../../../stores/auth';
import { API } from '@/services'

export default {
  data() {
    return {
      developers: [],
      markets: [],
      submarkets: [],
    }
  },

  async created() {
    await this.fetchMarkets()
    await this.fetchDevelopers()
  },

  methods: {
    ...mapActions(useAuthStore, ['can']),
    async fetchMarkets() {
      try {
        const response = await API.markets.getMarkets()
        this.markets = response
      } catch (error) {
        console.error('Error fetching markets:', error)
      }
    },

    async fetchSubmarkets(market_id) {
      try {
        const response = await API.submarkets.getSubmarkets({ market_id })
        this.submarkets = [...this.submarkets, ...response]
      } catch (error) {
        console.error('Error fetching submarkets:', error)
      }
    },

    async fetchDevelopers() {
      try {
        const response = await API.developers.getDevelopers()
        this.developers = response.map(developer => ({
          ...developer,
          market_name: this.getMarketName(developer.market_id),
          sub_market_name: this.getSubmarketName(developer.sub_market_id)
        }))
        
        // Fetch submarkets for each unique market_id
        const uniqueMarketIds = [...new Set(this.developers.map(d => d.market_id))]
        await Promise.all(uniqueMarketIds.map(id => this.fetchSubmarkets(id)))
      } catch (error) {
        console.error('Error fetching developers:', error)
        this.developers = []
      }
    },

    getMarketName(market_id) {
      const market = this.markets.find(m => m.id === market_id)
      return market ? market.name : '-'
    },

    getSubmarketName(submarket_id) {
      const submarket = this.submarkets.find(s => s.id === submarket_id)
      return submarket ? submarket.name : '-'
    },

    newDeveloper() {
      this.$router.push({ name: ROUTE_NAMES.DEVELOPERS_CREATE })
    },

    viewDetails(item) {
      this.$router.push({
        name: 'DeveloperDetail',
        params: { id: item.id.toString() }
      })
    },

    async deleteDeveloper(item) {
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
          await DevelopersService.deleteDeveloper(item.id)
          await this.fetchDevelopers()
          
          Swal.fire({
            icon: 'success',
            title: 'Deleted successfully!',
            text: `${item.name} has been deleted.`,
            toast: true,
            position: 'bottom',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
          })
        } catch (error) {
          console.error('Error deleting developer:', error)
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Error deleting developer',
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

  computed: {
    columns() {
      return [
        {
          key: 'id',
          label: 'ID',
          _style: { width: '5%' },
        },
        {
          key: 'name',
          label: 'Name',
          _style: { width: '20%' },
        },
        {
          key: 'is_developer',
          label: 'Developer',
          _style: { width: '10%' },
        },
        {
          key: 'is_builder',
          label: 'Builder',
          _style: { width: '10%' },
        },
        {
          key: 'is_owner',
          label: 'Owner',
          _style: { width: '10%' },
        },
        {
          key: 'market_name',
          label: 'Market',
          _style: { width: '20%' },
        },
        {
          key: 'sub_market_name',
          label: 'Submarket',
          _style: { width: '20%' },
        },
        {
          key: 'actions',
          label: 'Actions',
          _style: { width: '5%', textAlign: 'center' },
          sorter: false,
          filter: false
        }
      ]
    }
  }
}
</script>

<template>
  <CCard v-if="can('developers.create')" class="mb-4">
    <CRow>
      <CCol :xs="12" :xl="2">
        <CCardBody style="text-align: right;">
          <CButton color="success" @click="newDeveloper()">
            <CIcon icon="cilPlus" class="me-2" />New Developer
          </CButton>
        </CCardBody>
      </CCol>
    </CRow>
  </CCard>

  <CCard class="mb-4">
    <CCardBody>
      <div class="table-responsive">
        <CSmartTable
          v-if="developers.length > 0"
          :active-page="1"
          :items="developers"
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
          <template #is_developer="{ item }">
            <td>
              <CBadge :color="item.is_developer ? 'success' : 'danger'">
                {{ item.is_developer ? 'Yes' : 'No' }}
              </CBadge>
            </td>
          </template>

          <template #is_builder="{ item }">
            <td>
              <CBadge :color="item.is_builder ? 'success' : 'danger'">
                {{ item.is_builder ? 'Yes' : 'No' }}
              </CBadge>
            </td>
          </template>

          <template #is_owner="{ item }">
            <td>
              <CBadge :color="item.is_owner ? 'success' : 'danger'">
                {{ item.is_owner ? 'Yes' : 'No' }}
              </CBadge>
            </td>
          </template>

          <template #market_name="{ item }">
            <td>{{ getMarketName(item.market_id) }}</td>
          </template>

          <template #sub_market_name="{ item }">
            <td>{{ getSubmarketName(item.sub_market_id) }}</td>
          </template>

          <template #actions="{ item }">
            <td class="py-2" style="text-align: center">
              <CButton 
                v-if="can('developers.update', 'developers.show')"
                color="primary" 
                variant="outline" 
                square 
                size="sm" 
                @click="viewDetails(item)"
                class="mx-1"
              >
                <CIcon icon="cil-pencil" />
              </CButton>
              <CButton 
                v-if="can('developers.destroy')"
                color="danger" 
                variant="outline" 
                square 
                size="sm" 
                class="mx-1"
                @click="deleteDeveloper(item)"
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
