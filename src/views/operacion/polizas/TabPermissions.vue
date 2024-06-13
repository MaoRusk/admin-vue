<script setup>
  import { ref, onMounted, computed, watch } from 'vue';
  import axios from 'axios';
  import permissionsModules from './TabPermissions.vue'

  // Modules Permissions
  const modulesCbo = ref([]);
  const selectedModuleId = ref(null);
  // Markets Permissions
  const marketsCbo = ref([]);
  const selectedMarketId = ref(null);
  // Submarkets Permissions 1
  const submarketCbo = ref([]);
  const selectedSubmarketId = ref(null);  
  const optionsSubmarkets = ref([]);

  // Show Submarkets Permissions 3
  const buildOptionsSubmarkets = () => {
    optionsSubmarkets.value = marketsCbo.value.map(market => ({
      label: market.label,
      background: 'darkblue',
      color: '#fff',
      options: submarketCbo.value
        .filter(submarket => submarket.marketId === market.value)
        .map(submarket => ({
          value: submarket.value,
          label: submarket.label,
          selected: false, // Puedes ajustar esto según tus necesidades
        })),
    }));
  };

  onMounted(() => {
    fetchModulesCbo();
    fetchMarketsCbo();
    fetchSubmarketsCbo();
    
  });

watch(
  [marketsCbo, submarketCbo],
  ([newMarketsCbo, newSubmarketCbo]) => {
    if (newMarketsCbo && newSubmarketCbo) {
      buildOptionsSubmarkets();
    }
  },
  { deep: true }
);



// Get Modules
const fetchModulesCbo = async () => {
  try {
    const response = await axios.get('http://localhost:8000/api/modules');
    modulesCbo.value = response.data.map(module => ({
      value: module.id,
      label: module.moduleName
    }));
  } catch (error) {
    console.error('Hubo un error obteniendo el combo Modules:', error);
  }
};

// Get Markets 
const fetchMarketsCbo = async () => {
  try {
    const response = await axios.get('http://localhost:8000/api/market');
    marketsCbo.value = response.data.map(market => ({
      value: market.id,
      label: market.marketName,
    }));
  } catch (error) {
    console.error('Hubo un error obteniendo el combo Market:', error);
  }
};

// Get Submarkets 2
const fetchSubmarketsCbo = async () => {
  try {
    const response = await axios.get('http://localhost:8000/api/submarket');
    submarketCbo.value = response.data.map(submarket => ({
      value: submarket.id,
      label: submarket.subMarketName,
      marketId: submarket.marketId,
    }));
  } catch (error) {
    console.error('Hubo un error obteniendo el combo Market:', error);
  }
};

// Unique Permissions
const optionsPermissions = [
    {
      label: 'Columnas',
      options: [
        {
          value: 1,
          label: 'Mostrar tabla en Graficas (Availability, Gross Abso, Inv.-Bts-Exp., Ranking Availability, Ranking Gross Abso.)',
          selected: true,
        }
      ],
    },
    {
      label: 'Tablas',
      options: [
        {
          value: 2,
          label: 'Mostrar tabla en Graficas (Availability, Gross Abso, Inv.-Bts-Exp., Ranking Availability, Ranking Gross Abso.)',
          selected: true,
        }
      ],
    },
    {
      label: 'Fibras',
      options: [
        {
          value: 3,
          label: 'Mostrar Fibras',
          selected: true,
        }
      ],
    },
]

const yearsCbo = [ 
  {
    value: 2011,
    label: '2011',
  },
  {
    value: 2012,
    label: '2012',
  },
  {
    value: 2013,
    label: '2013',
  },
  {
    value: 2014,
    label: '2014',
  },
  {
    value: 2015,
    label: '2015',
  },
  {
    value: 2016,
    label: '2016',
  },
  {
    value: 2017,
    label: '2017',
  },
  {
    value: 2018,
    label: '2018',
  },
  {
    value: 2019,
    label: '2019',
  },
  {
    value: 2020,
    label: '2020',
  },
  {
    value: 2021,
    label: '2021',
  },
  {
    value: 2022,
    label: '2022',
  },
  {
    value: 2023,
    label: '2023',
  },
  {
    value: 2024,
    label: '2024',
  }   
]
const quartersCbo = [ 
  {
    value: 'Q1',
    label: 'Q1',
  },
  {
    value: 'Q2',
    label: 'Q2',
  },
  {
    value: 'Q3',
    label: 'Q3',
  },
  {
    value: 'Q4',
    label: 'Q4',
  }  
]
</script>

<template>
    <div class="docs-example rounded-top p-4">
        <CContainer>
        <CRow>
            <CCol :md="6">
            <CCol>
                <CMultiSelect 
                label="Select permissions"
                :options="optionsPermissions" 
                selectionType="counter" />
            </CCol>
            <CCol>
                <CMultiSelect 
                label="Select Modulos"
                :options="modulesCbo"
                v-model="selectedModuleId" 
                selectionType="counter" />
            </CCol>
            <CCol>
                <CMultiSelect 
                label="Select Markets"
                :options="marketsCbo" 
                v-model="selectedMarketId"
                selectionType="counter" />
            </CCol>
            <CCol>
                <CMultiSelect 
                label="Select SubMarkets"
                :options="optionsSubmarkets" 
                v-model="selectedSubmarketId"
                selectionType="counter" />
            </CCol>
            </CCol>
            <CCol :md="6">
            <CCol>
                <CMultiSelect 
                label="Select Years"
                :options="yearsCbo" 
                selectionType="counter" />
            </CCol>
            <CCol>
                <CMultiSelect 
                label="Select Quarters"
                :options="quartersCbo" 
                selectionType="counter" />
            </CCol>
            </CCol>
        </CRow>
        <CRow>
            <div style="display: flex; justify-content: center;padding:1rem">
            <CButton color="success" variant="outline" type="submit">Submit</CButton>
            </div>
        </CRow>
        </CContainer>
    </div>
</template>

<style>
.form-multi-select-optgroup-label
{
  background: #15598a !important;
  color: white !important;
}
</style>