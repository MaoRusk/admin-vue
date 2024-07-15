<script setup>
  import { ref, onMounted, computed, watch } from 'vue';
  import axios from 'axios';
  import quarters from '../../../assets/json/quarters'
  import years from '../../../assets/json/years'
  import { uniquePermissions, biChartsModules } from '../../../assets/json/uniquePermissions'
  import { useRouter } from 'vue-router'
  import Swal from 'sweetalert2';
  import checkedExcelImage from '../../../assets/images/excel_icon.png';
  import checkedPdfImage from '../../../assets/images/pdf.png';


  const router = useRouter()

const props = defineProps({
  id: {
      type: Number,
      required: true
    },
});
  const modulesCbo = ref([]);
  const selectedModuleId = ref(null);
  const marketsCbo = ref([]);
  const submarketCbo = ref([]);
  const optionsMarketsAndSubmarkets = ref([]);
  // const uniquePermissionsCbo = ref(uniquePermissions);
  const biChartsModulesCbo = ref(biChartsModules);
  const yearsCbo = ref(years);
  const quartersCbo = ref(quarters);
  const selectedPermissions = ref([]);
  const excelPermission = ref("");
  const fibrasPermission = ref("");
  const biChartsPermission = ref("");
  const SelectedModulesString = ref("");
  const SelectedBichartsOptions = ref("");
  const SelectedModulesCbo = ref("");
  const SelectedYearsCbo = ref("");
  const SelectedQuartersCbo = ref("");
  const inputCheckExcel = ref(true);
  const inputCheckPdf = ref(true);
  const inputCheckColumns = ref(true);
  const inputCheckFibras = ref(true);

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

    
    const handleBichartsOptions = (newValue) => {
      selectedPermissions.value = newValue;
      // Format String 
      SelectedBichartsOptions.value = selectedPermissions.value.map(item => item.value).join(',');
      console.log("BiCHartsOptions: "+SelectedBichartsOptions.value);
    };
    const handleModulesCbo = (newValue) => {
      selectedPermissions.value = newValue;
      SelectedModulesCbo.value = selectedPermissions.value.map(item => item.value).join(',');
      console.log("ModulesCbo: "+SelectedModulesCbo.value);    
    };
    const handleYearsCbo = (newValue) => {
      selectedPermissions.value = newValue;
      SelectedYearsCbo.value = selectedPermissions.value.map(item => item.value).join(',');
      console.log("YearsCbo: "+SelectedYearsCbo.value);    
    };

    const handleQuartersCbo = (newValue) => {
      selectedPermissions.value = newValue;
      SelectedQuartersCbo.value = selectedPermissions.value.map(item => item.value).join(',');
      console.log("QuartersCbo: "+SelectedQuartersCbo.value);    
    };


    
    const handleExcel = (event) => {
          inputCheckExcel.value = event.target.checked;
          console.log('Excel checkbox state:', inputCheckExcel.value);
    };
    const handlePdf = (event) => {
          inputCheckPdf.value = event.target.checked;
          console.log('PDF checkbox state:', inputCheckPdf.value);
    };
    const handleColumns = (event) => {
          inputCheckColumns.value = event.target.checked;
          console.log('Columns checkbox state:', inputCheckColumns.value);
    };
    const handleFibras = (event) => {
          inputCheckFibras.value = event.target.checked;
          console.log('Fibras checkbox state:', inputCheckFibras.value);
    };


    // const updatePermissions = () => {
    //   const selectedValues = selectedPermissions.value.map(value => value.value);
    //   excelPermission.value = selectedValues.includes(2) ? 1 : 0;
    //   fibrasPermission.value = selectedValues.includes(3) ? 1 : 0;
    //   biChartsPermission.value = selectedValues.includes(1) ? 1 : 0;
    //   console.log("Permisos");
    //   console.log(excelPermission.value);
    // };


//   const generateData = () => {
//     SelectedModulesString.value = selectedPermissions.value.map(item => item.value).join(',');
// console.log(SelectedModulesString);
//   };
  // Add services
  const submitFunction = async () => {
          const formPermissions = new FormData();
          formPermissions.append('quarters', selectedQuarters.value);
          formPermissions.append('years', selectedYears.value);
          formPermissions.append('markets', selectedMarkets.value);
          formPermissions.append('submarkets', selectedSubMarkets.value);
          formPermissions.append('modules', SelectedModulesString.value);
                
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

// ---------------MARTES Y SUBMARKETS---------------

// *Deseleccionar O Seleccionar* el Market con todos sus subMarkets
  const toggleGroup = (group, checked) => {
    if (checked) {
      selectedMarkets.value.push(group.value);
      group.options.forEach(option => {
        if (!selectedSubMarkets.value.includes(option.value)) {
          selectedSubMarkets.value.push({
            subMarketId: option.value,
            marketId: group.value
          });          
          option.selected = true;
        }
      });
    } else {
      selectedMarkets.value = selectedMarkets.value.filter(val => val !== group.value);
      group.options.forEach(option => {
        selectedSubMarkets.value = selectedSubMarkets.value.filter(val => val.subMarketId !== option.value);
        option.selected = false;
      });
    }
    console.log("Deseleccionar O Seleccionar* el Market con todos sus selectedSubMarkets: " ,  selectedSubMarkets.value);
    console.log("Deseleccionar O Seleccionar* el Market con todos sus selectedMarkets: " +  selectedMarkets.value);

  };

// Deseleccionar un SubMarket
  const toggleOption = (group, option, checked) => {
    option.selected = checked;
    if (checked) {
      if (!selectedSubMarkets.value.includes(option.value)) {
        selectedSubMarkets.value.push({
            subMarketId: option.value,
            marketId: group.value
          });  
        }
      if (!selectedMarkets.value.includes(group.value)) {
        selectedMarkets.value.push(group.value);
      }
    } else {
      selectedSubMarkets.value = selectedSubMarkets.value.filter(val => val.subMarketId !== option.value);
      const anyOptionSelected = group.options.some(opt => opt.selected);
      if (!anyOptionSelected) {
        selectedMarkets.value = selectedMarkets.value.filter(val => val !== group.value);
      }
    }
    console.log("Deseleccionar un selectedSubMarkets: " , selectedSubMarkets.value);
    console.log("Deseleccionar un selectedMarkets: " + selectedMarkets.value);
  };
  
// Seleccionar todos los markets y subMarkets
  const selectAll = () => {
    optionsMarketsAndSubmarkets.value.forEach(group => {
      if (!selectedMarkets.value.includes(group.value)) {
        selectedMarkets.value.push(group.value);
      }
      group.options.forEach(option => {
        if (!selectedSubMarkets.value.includes(option.value)) {
          selectedSubMarkets.value.push({
            subMarketId: option.value,
            marketId: group.value
          });  
          option.selected = true;
        }
      });
      console.log("Seleccionar todos selectedSubMarkets: " , selectedSubMarkets.value);
      console.log("Seleccionar todos selectedMarkets: " + selectedMarkets.value);
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
    console.log("Deseleccionar todos selectedSubMarkets: ", selectedSubMarkets.value);
    console.log("Deseleccionar todos selectedMarkets: "+ selectedMarkets.value);
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
  .iconsPermissions{
    width:2rem;
    margin-inline: .5rem;
  }
  /* .form-multi-select-options{
    max-height: 200px;
   overflow: overlay;
  } */ 
</style>
<template>
    <div class="docs-example rounded-top p-4">
      <CContainer>
        <CRow>
            <CCol :md="6">
              <CCol>
              <CCard class="mb-1" >
                <CCardBody style="padding: .6rem 1rem;">
                  <div style="    display: flex;">
                    <div>
                      <CFormCheck                        
                      @change="handleExcel($event)"
                      v-model="inputCheckExcel" />
                      <img :src="checkedExcelImage" alt="Checkbox Image" class="iconsPermissions"/>
                    </div>
                    <div style="margin-left: 2rem;">
                      <CFormCheck 
                       v-model="inputCheckPdf"
                       :checked="inputCheckPdf"
                        @change="handlePdf($event)"
                        />
                      <img :src="checkedPdfImage" alt="Checkbox Image" class="iconsPermissions"/>
                    </div>
                 </div>
                </CCardBody>
              </CCard>
              <CCard class="mb-1">
                <CCardBody>
                  <div >
                    <CFormCheck  
                    v-model="inputCheckColumns" 
                    @change="handleColumns($event)"
                    label="Show Columnas (Owner, Developer, Builder, Contact, Phone, Mail)" 
                     />                    
                 </div>
                </CCardBody>
              </CCard>
              <CCard class="mb-1">
                <CCardBody>
                  <div >
                    <CFormCheck  
                    v-model="inputCheckFibras" 
                    @change="handleFibras($event)"
                    label="Show Modulo Fibras" 
                     />
                 </div>
                </CCardBody>

              </CCard>
            </CCol>          
            <CCol>
                <CMultiSelect 
                label="Select BiChart options"
                :options="biChartsModulesCbo" 
                @change="handleBichartsOptions($event)"
                selectionType="counter"
                 />
            </CCol>
          
            </CCol>
            <CCol :md="6">
              <CCol>
              <CMultiSelect 
              label="Select Modules"
              :options="modulesCbo"
              v-model="selectedModuleId" 
              @change="handleModulesCbo($event)"
              selectionType="counter" />
          </CCol>
              <CRow>
                <CCol :md="6">
                  <CMultiSelect 
                  label="Select Years"
                  :options="yearsCbo" 
                  @change="handleYearsCbo($event)"
                  selectionType="text" 
                  />
              </CCol>
              <CCol :md="6">
                  <CMultiSelect 
                  label="Select Quarters"
                  :options="quartersCbo"
                  @change="handleQuartersCbo($event)"
                  selectionType="text" />
              </CCol>
              </CRow>
            <CCol>
              <label for="" class="mt-1"> Select Markets And Submarkets </label>
              <CAccordion class="mt-2">
                <CAccordionItem :item-key="1">
                  <CAccordionHeader>
                    Select...
                  </CAccordionHeader>
                  <CAccordionBody>
                    <div class="mt-1" style="display: flex;justify-content: center;">
                      <CButton color="primary" variant="ghost" @click="selectAll" class="me-2">Select All</CButton>
                      <CButton color="primary" variant="ghost" @click="deselectAll">Deselect All</CButton>
                    </div>
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
                              :modelValue="selectedSubMarkets.some(item => item.subMarketId === option.value)"
                              @update:modelValue="(checked) => toggleOption(group, option, checked)"
                            />
                          </CListGroupItem>
                        </CListGroup>
                      </CListGroupItem>
                    </CListGroup>
                  </CAccordionBody>
                </CAccordionItem>
              </CAccordion>
            </CCol>
            </CCol>
        </CRow>
        <CRow>
            <div style="display: flex; justify-content: space-evenly; padding:1rem">
              <CButton 
              color="success" 
              variant="outline" 
              type="submit"
              @click="submitFunction"
              >Add Permissions</CButton>
              <CButton 
              color="danger" 
              variant="outline" 
              type="submit"
              @click="submitFunctions"
              >Delete Permisions</CButton>
            </div>
        </CRow>
        </CContainer>
    </div>
</template>
