<script setup>
  import { ref, onMounted, computed } from 'vue';
  import axios from 'axios';
  import quarters from '../../../assets/json/quarters'
  import years from '../../../assets/json/years'
  import Swal from 'sweetalert2';
  import { cilColorBorder } from '@coreui/icons'

const props = defineProps({
  id: {
      type: Number,
      required: true
    },
});
  // Modules Permissions
  const modulesCbo = ref([]);
  
  // Markets Permissions
  const marketsCbo = ref([]);
  
  // Submarkets Permissions 
  const submarketCbo = ref([]);
  
  const optionsMarketsAndSubmarkets = ref([]);
  // Unique Permissions
  
  // Years Y quarters Combos
  const yearsCbo = ref(years);
  const quartersCbo = ref(quarters);
  const SelectedModulesCbo = ref('');
  const SelectedYearsCbo = ref('');
  const SelectedQuartersCbo = ref('');
  const selectedPermissions = ref([]);
  const ModulesSelectedString = ref('');
  const isLoading = ref(false);

  onMounted(() => {
    fetchData();
  });

  const fetchData = async () => { 
    try {
      const [modulesResponse, marketsResponse, submarketResponse] = await Promise.all([
        axios.get('https://laravel-back-production-9320.up.railway.app/api/modules'),
        axios.get('https://laravel-back-production-9320.up.railway.app/api/market'),
        axios.get('https://laravel-back-production-9320.up.railway.app/api/submarket'),
      ]);

      modulesCbo.value = modulesResponse.data.map(module => ({
        value: module.id,
        label: module.moduleName,
      }));

      marketsCbo.value = marketsResponse.data.map(market => ({
        value: market.id,
        label: market.marketName,
      }));

      submarketCbo.value = submarketResponse.data.map(submarket => ({
        value: submarket.id,
        label: submarket.subMarketName,
        marketId: submarket.marketId,
      }));

      buildOptionsSubmarkets(); 
    } catch (error) {
      console.error('There was an error getting the data:', error);
    }
  };

  
  // Ordenar y dar formato a Submarkets Permissions Para el Select
  const buildOptionsSubmarkets = () => {
    optionsMarketsAndSubmarkets.value = marketsCbo.value.map(market => ({
      label: market.label,
      value: "market_"+market.value,
      background: 'darkblue',
      color: '#fff',
      options: submarketCbo.value
        .filter(submarket => submarket.marketId === market.value)
        .map(submarket => ({
          value: submarket.value,
          label: submarket.label,
          selected: false, 
        })),
    }));
  };

    
  const handleModulesCbo = (newValue) => {
    selectedPermissions.value = newValue;
    SelectedModulesCbo.value = selectedPermissions.value.map(item => item.value).join(',');
    console.log("ModulesCbo: "+SelectedModulesCbo.value);    
      GetFunction();
  };
  const handleYearsCbo = (newValue) => {
    selectedPermissions.value = newValue;
    SelectedYearsCbo.value = selectedPermissions.value.map(item => item.value).join(',');
    console.log("YearsCbo: "+SelectedYearsCbo.value); 
      GetFunction();
  };

  const handleQuartersCbo = (newValue) => {
    selectedPermissions.value = newValue;
    SelectedQuartersCbo.value = selectedPermissions.value.map(item => item.value).join(',');
    console.log("QuartersCbo: "+SelectedQuartersCbo.value); 
      GetFunction();
  };


  const generateData = () => {
    ModulesSelectedString.value = selectedPermissions.value.map(item => item.value).join(',');
console.log(ModulesSelectedString);
  };

// *****************************SELECCIONES DE MERCADOS SURBMERCADOS****************************************
  const selectedMarkets = ref([]);
  const selectedSubMarkets = ref([]);

// ---------------MARTES Y SUBMARKETS---------------
const toggleGroup = (group, checked) => {
  group.selected = checked;

  if (checked) {
    // Seleccionar el mercado si no está ya seleccionado
    if (!selectedMarkets.value.includes(group.value)) {
      selectedMarkets.value.push(group.value);
    }
    
    // Seleccionar todos los submercados del grupo
    group.options.forEach(option => {
      option.selected = true;
      if (!selectedSubMarkets.value.some(sm => sm.subMarketId === option.value)) {
        selectedSubMarkets.value.push({
          subMarketId: option.value,
          marketId: group.value
        });
      }
    });
  } else {
    // Deseleccionar el mercado
    selectedMarkets.value = selectedMarkets.value.filter(val => val !== group.value);
    
    // Deseleccionar todos los submercados del grupo
    group.options.forEach(option => {
      option.selected = false;
    });
    selectedSubMarkets.value = selectedSubMarkets.value.filter(sm => sm.marketId !== group.value);
  }

  console.log("Selected markets:", selectedMarkets.value);
  console.log("Selected submarkets:", selectedSubMarkets.value);
};

const toggleOption = (group, option, checked) => {
  option.selected = checked;

  if (checked) {
    // Seleccionar el submercado
    if (!selectedSubMarkets.value.some(sm => sm.subMarketId === option.value)) {
      selectedSubMarkets.value.push({
        subMarketId: option.value,
        marketId: group.value
      });
    }
    
    // Asegurarse de que el mercado esté seleccionado
    if (!selectedMarkets.value.includes(group.value)) {
      selectedMarkets.value.push(group.value);
    }
  } else {
    // Deseleccionar el submercado
    selectedSubMarkets.value = selectedSubMarkets.value.filter(sm => sm.subMarketId !== option.value);
  }

  // Actualizar el estado 'selected' del grupo
  group.selected = group.options.every(opt => opt.selected);
  
  // Si no hay submercados seleccionados, deseleccionar el mercado
  if (!group.options.some(opt => opt.selected)) {
    selectedMarkets.value = selectedMarkets.value.filter(val => val !== group.value);
  }

  console.log("Selected markets:", selectedMarkets.value);
  console.log("Selected submarkets:", selectedSubMarkets.value);
};


// Seleccionar todos los markets y subMarkets
const selectAll = () => {
  optionsMarketsAndSubmarkets.value.forEach(group => {
    group.selected = true;
    if (!selectedMarkets.value.includes(group.value)) {
      selectedMarkets.value.push(group.value);
    }
    group.options.forEach(option => {
      option.selected = true;
      if (!selectedSubMarkets.value.some(sm => sm.subMarketId === option.value)) {
        selectedSubMarkets.value.push({
          subMarketId: option.value,
          marketId: group.value
        });
      }
    });
  });
  console.log("Seleccionar todos selectedSubMarkets: ", selectedSubMarkets.value);
  console.log("Seleccionar todos selectedMarkets: ", selectedMarkets.value);
};

// Deseleccionar todos los markets y subMarkets
const deselectAll = () => {
  selectedMarkets.value = [];
  selectedSubMarkets.value = [];
  optionsMarketsAndSubmarkets.value.forEach(group => {
    group.selected = false;
    group.options.forEach(option => {
      option.selected = false;
    });
  });
  console.log("Deseleccionar todos selectedSubMarkets: ", selectedSubMarkets.value);
  console.log("Deseleccionar todos selectedMarkets: ", selectedMarkets.value);
};

// GET PERMISSIONS
const GetFunction = async () => {
  try {
    if (SelectedModulesCbo.value !== '') {
      isLoading.value = true; // Mostrar el spinner
  
    const formPermissions = new FormData();
      formPermissions.append('moduleId', SelectedModulesCbo.value);
      formPermissions.append('year', SelectedYearsCbo.value);
      formPermissions.append('quarter', SelectedQuartersCbo.value);
      
      const response = await axios.post(`https://laravel-back-production-9320.up.railway.app/api/permissions/${props.id}`, formPermissions);
      const markets = response.data.markets;
  
      console.log("ORIGINAL GET MARKETS: ", markets);
  
      if (markets && Array.isArray(markets)) {
        optionsMarketsAndSubmarkets.value = markets.map(market => ({
          value: market.value,
          label: market.label,
          selected: market.selected,
          options: Array.isArray(market.options) 
            ? market.options.map(option => ({
                value: option.value,
                label: option.label,
                selected: option.selected
              }))
            : []
        }));
  
        // Inicializar selectedMarkets y selectedSubMarkets
        selectedMarkets.value = optionsMarketsAndSubmarkets.value
          .filter(market => market.selected)
          .map(market => market.value);
  
        selectedSubMarkets.value = optionsMarketsAndSubmarkets.value
          .flatMap(market => 
            market.options
              .filter(option => option.selected)
              .map(option => ({
                subMarketId: option.value,
                marketId: market.value
              }))
          );
  
        console.log("REFRESH MARKETS : ", optionsMarketsAndSubmarkets.value);
        console.log("SELECTED MARKETS : ", selectedMarkets.value);
        console.log("SELECTED SUBMARKETS : ", selectedSubMarkets.value);
      } else {
        buildOptionsSubmarkets();
      }
    }
  } catch (error) {
    console.error("Error en GetFunction:", error);
  } finally {
    isLoading.value = false; // Ocultar el spinner
  }
}

// POST ADD PERMISSIONS
const updateFunction = async () => {
  const formPermissions = new FormData();
  formPermissions.append('modulesCbo', SelectedModulesCbo.value);
  formPermissions.append('yearsCbo', SelectedYearsCbo.value);
  formPermissions.append('quartersCbo', SelectedQuartersCbo.value);
  formPermissions.append('marketsArray', JSON.stringify(selectedSubMarkets.value));
      
  axios.post(`https://laravel-back-production-9320.up.railway.app/api/permissions/update/${props.id}`, formPermissions).then(response => {
    Swal.fire({
      title: "Update!",
      text: "Permissions update successfully.",
      icon: "success",
      showConfirmButton: false,
      timer: 1500
      })
    })
  .catch(error => {
    Swal.fire({
      title: "Error update Permissions.",
      text: error.response.data.message,
      icon: "error",
      showConfirmButton: false,
      timer: 10000
    });
  });
}
</script>
<template>
    <div class="docs-example rounded-top p-4">
        <CContainer>
        <CRow>
          <CCol :md="6">
            <CCol>
              <CCol>
                <CMultiSelect 
                :multiple="false"
                label="Select Modulos"
                :options="modulesCbo"
                @change="handleModulesCbo($event)"
                selectionType="counter" />
              </CCol>

              <CRow>
                <CCol :md="6">
                  <CMultiSelect 
                  :multiple="false"
                  label="Select Years"
                  :options="yearsCbo" 
                  @change="handleYearsCbo($event)"
                  selectionType="text" 
                  />
                </CCol>
                <CCol :md="6">
                    <CMultiSelect
                    :multiple="false"
                    label="Select Quarters"
                    :options="quartersCbo"
                    @change="handleQuartersCbo($event)"
                    selectionType="text" />
                </CCol>
              </CRow>
            </CCol>
          </CCol>
          <CCol :md="6">
            <CCol>
            <CRow>
              <CCol :md="2">
              </CCol>
              <CCol :md="7">
                <label class="mt-1 d-flex justify-content-center"> Select Markets And Submarkets </label>
              </CCol>
              <CCol :md="3">
                <CButton 
                  color="primary" 
                  variant="outline" 
                  type="submit"
                  @click="updateFunction"
                  >Update
                  <CIcon :content="cilColorBorder" size="sm" />
                </CButton>
              </CCol>
            </CRow>
          <CRow>
            <CListGroup>
              <div :class="{ 'position-relative': isLoading }">
                <div v-if="isLoading" class="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-top" style="background-color: rgba(255,255,255,0.7); z-index: 1000;">
                  <CSpinner color="primary" class="mt-5" />
                </div>
                <div class="mt-1" style="display: flex;justify-content: center;">
                  <CButton color="primary" variant="ghost" @click="selectAll" class="me-2">Select All</CButton>
                  <CButton color="primary" variant="ghost" @click="deselectAll">Deselect All</CButton>
                </div>
                <CListGroupItem v-for="group in optionsMarketsAndSubmarkets" :key="group.value" class="list-group-item-pather-custom">
                  <CFormCheck
                    v-model="group.selected"
                    @update:modelValue="(checked) => toggleGroup(group, checked)"
                    :id="group.value"
                    :label="group.label"
                  />
                  <CListGroup class="mt-2">
                    <CListGroupItem v-for="option in group.options" :key="option.value" class="ms-4 list-group-children-custom">
                      <CFormCheck
                        v-model="option.selected"
                        @update:modelValue="(checked) => toggleOption(group, option, checked)"
                        :id="option.value"
                        :label="option.label"
                      />
                    </CListGroupItem>
                  </CListGroup>
                </CListGroupItem>
              </div>
            </CListGroup>
          </CRow>
            </CCol>
           </CCol>
        </CRow>
        </CContainer>
    </div>
</template>
