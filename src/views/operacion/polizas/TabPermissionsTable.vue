<script setup>
  import { ref, onMounted, computed, watch } from 'vue';
  import axios from 'axios';
  // import years from '../../../assets/json/years'

  import { useRouter } from 'vue-router'
  import Swal from 'sweetalert2';
  import quarters from '../../../assets/json/quarters'
  import years from '../../../assets/json/years'



  const router = useRouter()

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

  const selectedPermissions = ref([]);
  const excelPermission = ref("");
  const fibrasPermission = ref("");
  const biChartsPermission = ref("");
  const ModulesSelectedString = ref("");

  const arrayPermission = ref({})

  onMounted(() => {
    fetchData();
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

  const fetchData = async () => {
    try {
      const [modulesResponse, marketsResponse, submarketResponse] = await Promise.all([
        axios.get('http://localhost:8000/api/modules'),
        axios.get('http://localhost:8000/api/market'),
        axios.get('http://localhost:8000/api/submarket'),
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
      console.error('Hubo un error obteniendo los datos:', error);
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

    
    const handleUniquePermissionsChange = (newValue) => {
      selectedPermissions.value = newValue;
      updatePermissions();
    };
    const handletest = (newValue) => {
      selectedPermissions.value = newValue;
      console.log(selectedPermissions.value);
      generateData();
    };
    const updatePermissions = () => {
      const selectedValues = selectedPermissions.value.map(value => value.value);
      excelPermission.value = selectedValues.includes(2) ? 1 : 0;
      fibrasPermission.value = selectedValues.includes(3) ? 1 : 0;
      biChartsPermission.value = selectedValues.includes(1) ? 1 : 0;
      console.log("Permisos");
      console.log(excelPermission.value);
    };

  // const newString = ref('');
  // const generateMarkets = () => {
  //   const userId = props.id; 

  //   selectedMarkets.value.forEach(module => {
  //     const removeMarketPrefix = (str) => {
  //       return str.replace('market_', '');
  //     };

  //     newString.value = removeMarketPrefix(module.value);

  //     dataModules.push({
  //       ID:0,
  //       userId: userId,
  //       moduleID: newString.value,
  //     });      
  //   });
  //   console.log(dataModules);
  //   return dataModules;
  // };

  const generateData = () => {
    ModulesSelectedString.value = selectedPermissions.value.map(item => item.value).join(',');
console.log(ModulesSelectedString);
  };
  // Add services
  const submitFunction = async () => {
          const formPermissions = new FormData();
          formPermissions.append('quarters', selectedQuarters.value);
          formPermissions.append('years', selectedYears.value);
          formPermissions.append('markets', selectedMarkets.value);
          formPermissions.append('submarkets', selectedSubMarkets.value);
          formPermissions.append('modules', ModulesSelectedString.value);
                
          axios.post(`http://localhost:8000/api/permission/${props.id}`, formPermissions).then(response => {
           
            const formDataUnique = new FormData();
            formDataUnique.append('userId', props.id);
            formDataUnique.append('moduleId', 1);
            formDataUnique.append('excelPermission', excelPermission.value);
            formDataUnique.append('fibrasPermission', fibrasPermission.value);
            formDataUnique.append('biChartsPermission', biChartsPermission.value);
            formDataUnique.append('status', "Activo");
              axios.post('http://localhost:8000/api/unique', formDataUnique)
              .then(segundaRespuesta => {
                Swal.fire({
                  title: "Added!",
                  text: "Permissions added successfully.",
                  icon: "success",
                  showConfirmButton: false,
                  timer: 1500
                }).then(() => {
                  router.push({
                    name: 'Polizas',
                    params: { id: Number(0) },
                  })
                });
              })
          })
          
          .catch(error => {
            Swal.fire({
              title: "Error adding Permissions.",
              text: error.response.data.message,
              icon: "error",
              showConfirmButton: false,
              timer: 2000
            });
          });
    }

// *****************************SELECCIONES DE MERCADOS SURBMERCADOS / AÑOS Y TRIMESTRES****************************************
  const selectedMarkets = ref([]);
  const selectedSubMarkets = ref([]);
  const selectedYears = ref([]);
  const selectedQuarters = ref([]);

// ---------------AÑOS Y TRIMESTRES------------------
  // *Deseleccionar O Seleccionar* el Año con todos sus quarters
  const toggleGroupYeasAndQuarters = (group, checked) => {
    if (checked) {
      selectedYears.value.push(group.value);
      group.options.forEach(option => {
        if (!selectedQuarters.value.includes(option.value)) {
          selectedQuarters.value.push(option.value);
          option.selected = true;
        }
      });
    } else {
      selectedYears.value = selectedYears.value.filter(val => val !== group.value);
      group.options.forEach(option => {
        selectedQuarters.value = selectedQuarters.value.filter(val => val !== option.value);
        option.selected = false;
      });
    }
    console.log("Deseleccionar O Seleccionar* el Years And Quarters: " +  selectedQuarters.value);
    console.log("Deseleccionar O Seleccionar* el Years And Quarters: " +  selectedYears.value);

  };

  // Deseleccionar un Trimestre
  const toggleOptionQuarters = (group, option, checked) => {
    option.selected = checked;
    if (checked) {
      if (!selectedQuarters.value.includes(option.value)) {
        selectedQuarters.value.push(option.value);
      }
      if (!selectedYears.value.includes(group.value)) {
        selectedYears.value.push(group.value);
      }
    } else {
      selectedQuarters.value = selectedQuarters.value.filter(val => val !== option.value);
      const anyOptionSelected = group.options.some(opt => opt.selected);
      if (!anyOptionSelected) {
        selectedYears.value = selectedYears.value.filter(val => val !== group.value);
      }
    }
    console.log("Deseleccionar qurter: " + selectedQuarters.value);
    console.log("Deseleccionar qurter: " + selectedYears.value);
  };
// Seleccionar todos los años y trimestres
  const selectAllYearsAndQuarters = () => {
    quartersAndYearsCbo.value.forEach(group => {
        if (!selectedYears.value.includes(group.value)) {
          selectedYears.value.push(group.value);
        }
        group.options.forEach(option => {
          if (!selectedQuarters.value.includes(option.value)) {
            selectedQuarters.value.push(option.value);
            option.selected = true;
          }
        });
        console.log("Seleccionar todos los Years And Quarters: " + selectedQuarters.value);
        console.log("Seleccionar todos los Years And Quarters: " + selectedYears.value);
      });
    };

    const deselectAllYearsAndQuarters = () => {
    selectedYears.value = [];
    selectedQuarters.value = [];
    quartersAndYearsCbo.value.forEach(group => {
      group.options.forEach(option => {
        option.selected = false;
      });
    });
    console.log("Deseleccionar todos YQ: "+ selectedQuarters.value);
    console.log("Deseleccionar todos YQ: "+ selectedYears.value);
  };

// ---------------MARTES Y SUBMARKETS---------------

// *Deseleccionar O Seleccionar* el Market con todos sus subMarkets
  const toggleGroup = (group, checked) => {
    if (checked) {
      selectedMarkets.value.push(group.value);
      group.options.forEach(option => {
        if (!selectedSubMarkets.value.includes(option.value)) {
          selectedSubMarkets.value.push(option.value);
          option.selected = true;
        }
      });
    } else {
      selectedMarkets.value = selectedMarkets.value.filter(val => val !== group.value);
      group.options.forEach(option => {
        selectedSubMarkets.value = selectedSubMarkets.value.filter(val => val !== option.value);
        option.selected = false;
      });
    }
    console.log("Deseleccionar O Seleccionar* el Market con todos sus subMarkets" +  selectedSubMarkets.value);
    console.log("Deseleccionar O Seleccionar* el Market con todos sus subMarkets" +  selectedMarkets.value);

  };

// Deseleccionar un SubMarket
  const toggleOption = (group, option, checked) => {
    option.selected = checked;
    if (checked) {
      if (!selectedSubMarkets.value.includes(option.value)) {
        selectedSubMarkets.value.push(option.value);
      }
      if (!selectedMarkets.value.includes(group.value)) {
        selectedMarkets.value.push(group.value);
      }
    } else {
      selectedSubMarkets.value = selectedSubMarkets.value.filter(val => val !== option.value);
      const anyOptionSelected = group.options.some(opt => opt.selected);
      if (!anyOptionSelected) {
        selectedMarkets.value = selectedMarkets.value.filter(val => val !== group.value);
      }
    }
    console.log("Deseleccionar un SubMarket" + selectedSubMarkets.value);
    console.log("Deseleccionar un SubMarket" + selectedMarkets.value);
  };
  
// Seleccionar todos los markets y subMarkets
  const selectAll = () => {
    optionsMarketsAndSubmarkets.value.forEach(group => {
      if (!selectedMarkets.value.includes(group.value)) {
        selectedMarkets.value.push(group.value);
      }
      group.options.forEach(option => {
        if (!selectedSubMarkets.value.includes(option.value)) {
          selectedSubMarkets.value.push(option.value);
          option.selected = true;
        }
      });
      console.log("Seleccionar todos los markets y subMarkets" + selectedSubMarkets.value);
      console.log("Seleccionar todos los markets y subMarkets" + selectedMarkets.value);
    });
  };

// Deseleccionar todos los markets y subMarkets
  const deselectAll = () => {
    selectedMarkets.value = [];
    selectedSubMarkets.value = [];
    optionsMarketsAndSubmarkets.value.forEach(group => {
      group.options.forEach(option => {
        option.selected = false;
      });
    });
    console.log("Deseleccionar todos los markets y subMarkets"+ selectedSubMarkets.value);
    console.log("Deseleccionar todos los markets y subMarkets"+ selectedMarkets.value);
  };
</script>
<style>
  /* Css para el select de markets y submarkets */
  .list-group-item-pather-custom{
    background: #15598a;
    color: white;
    padding: 5px 16px;
  }
  .list-group-children-custom {
    padding: 2px 16px;
  }
  .form-check {
    margin-bottom: 0rem;
  }
  .accordion-button {
    padding: 6px 12px;
  }
  .accordion-body
  {
    padding-top: 0px;
  }
  .accordion-button:not(.collapsed) {
      color: var(--cui-accordion-border-color);
      background-color: #d6ebff00;
  }
</style>
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
                @change="handletest($event)"
                selectionType="counter" />
            </CCol>

            <CRow>
                <CCol :md="6">
                  <CMultiSelect 
                  :multiple="false"
                  label="Select Years"
                  :options="yearsCbo" 
                  @change="handletest($event)"
                  selectionType="text" 
                  />
              </CCol>
              <CCol :md="6">
                  <CMultiSelect
                  :multiple="false"
                  label="Select Quarters"
                  :options="quartersCbo"
                  @change="handletest($event)"
                  selectionType="text" />
              </CCol>
              </CRow>
            </CCol>
            </CCol>
            <CCol :md="6">
           
           <CCol>
             <label for="" class="mt-1"> Select Markets And Submarkets </label>
             <!-- <CAccordion class="mt-2">
               <CAccordionItem :item-key="1">
                 <CAccordionHeader>
                   Select...
                 </CAccordionHeader>
                 <CAccordionBody>
                   <div class="mt-1" style="display: flex;justify-content: center;">
                     <CButton color="primary" variant="ghost" @click="selectAll" class="me-2">Select All</CButton>
                     <CButton color="primary" variant="ghost" @click="deselectAll">Deselect All</CButton>
                   </div> -->
                   <CListGroup>
                     <CListGroupItem v-for="group in optionsMarketsAndSubmarkets" :key="group.value" class="list-group-item-pather-custom">
                       <CFormCheck
                         hitArea="full"
                         :id="group.value"
                         :label="group.label"
                         :modelValue="selectedMarkets.includes(group.value)"
                         @update:modelValue="(checked) => toggleGroup(group, checked)"
                       />
                       <CListGroup class="mt-2" >
                         <CListGroupItem v-for="option in group.options" :key="option.value" class="ms-4 list-group-children-custom">
                           <CFormCheck
                             hitArea="full"
                             :id="option.value"
                             :label="option.label"
                             :modelValue="selectedSubMarkets.includes(option.value)"
                             @update:modelValue="(checked) => toggleOption(group, option, checked)"
                           />
                         </CListGroupItem>
                       </CListGroup>
                     </CListGroupItem>
                   </CListGroup>
                 <!-- </CAccordionBody>
               </CAccordionItem>
             </CAccordion> -->
           </CCol>
           </CCol>
        </CRow>
        <!-- <CRow>
            <div style="display: flex; justify-content: center;padding:1rem">
              <CButton 
              color="success" 
              variant="outline" 
              type="submit"
              @click="submitFunction"
              >Submit</CButton>
            </div>
        </CRow> -->
        </CContainer>
    </div>
</template>
