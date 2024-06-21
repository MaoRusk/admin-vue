<script setup>
  import { ref, onMounted, computed, watch } from 'vue';
  import axios from 'axios';
  import permissionsModules from './TabPermissions.vue'
  import years from '../../../assets/json/years'
  import quarters from '../../../assets/json/quarters'
  import uniquePermissions from '../../../assets/json/uniquePermissions'
  import { useRouter } from 'vue-router'
  import Swal from 'sweetalert2';
  import { cilChevronCircleDownAlt } from '@coreui/icons'


  const router = useRouter()

const props = defineProps({
  id: {
      type: Number,
      required: true
    },
});
  // Modules Permissions
  const modulesCbo = ref([]);
  const selectedModuleId = ref(null);
  // Markets Permissions
  const marketsCbo = ref([]);
  const selectedMarketId = ref(null);
  // Submarkets Permissions 
  const submarketCbo = ref([]);
  const selectedSubmarketId = ref(null);  
  const optionsSubmarkets = ref([]);
  // Unique Permissions
  const uniquePermissionsCbo = ref(uniquePermissions);
  // Years Y quarters Combos
  const yearsCbo = ref(years);
  const quartersCbo = ref(quarters);

  const selectedPermissions = ref([]);
  const excelPermission = ref("");
  const fibrasPermission = ref("");
  const biChartsPermission = ref("");

  const selectedModules = ref([]);
  const selectedMarkets = ref([]);
  const selectedSubmarkets = ref([]);
  const data = ref([]);

  

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

  
  // Ordenar y dar formato a Submarkets Permissions 
  const buildOptionsSubmarkets = () => {
    optionsSubmarkets.value = marketsCbo.value.map(market => ({
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


  const generateData = () => {
    const userId = props.id; 

    selectedModules.value.forEach(module => {
      selectedMarkets.value.forEach(market => {
        selectedSubmarkets.value.forEach(submarket => {
          data.push({
            userId,
            moduleId: module.value,
            marketId: market.value,
            subMarketId: submarket.value,
            
          });
        });
      });
    });

    console.log(data);
    return data;
  };
  // Add services
  const submitFunction = async () => {
          const formPermissions = new formPermissions();
          formPermissions.append('userId', props.id);
          formPermissions.append('moduleId', 1);
          formPermissions.append('marketId', excelPermission.value);
          formPermissions.append('subMarketId', fibrasPermission.value);
          formPermissions.append('year', biChartsPermission.value);
          formPermissions.append('quarter', biChartsPermission.value);
          formPermissions.append('status', "Activo");
  
          axios.post('http://localhost:8000/api/premission', formPermissions).then(response => {
           
            const formDataUnique = new FormDataUnique();
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




  const selectedGroups = ref([]);
  const selectedOptions = ref([]);

  const toggleGroup = (group, checked) => {
    if (checked) {
      selectedGroups.value.push(group.value);
      group.options.forEach(option => {
        if (!selectedOptions.value.includes(option.value)) {
          selectedOptions.value.push(option.value);
          option.selected = true;
        }
      });
    } else {
      selectedGroups.value = selectedGroups.value.filter(val => val !== group.value);
      group.options.forEach(option => {
        selectedOptions.value = selectedOptions.value.filter(val => val !== option.value);
        option.selected = false;
      });
    }
  };


  const toggleOption = (group, option, checked) => {
    option.selected = checked;
    if (checked) {
      if (!selectedOptions.value.includes(option.value)) {
        selectedOptions.value.push(option.value);
      }
      if (!selectedGroups.value.includes(group.value)) {
        selectedGroups.value.push(group.value);
      }
    } else {
      selectedOptions.value = selectedOptions.value.filter(val => val !== option.value);
      const anyOptionSelected = group.options.some(opt => opt.selected);
      if (!anyOptionSelected) {
        selectedGroups.value = selectedGroups.value.filter(val => val !== group.value);
      }
    }
  };

  const selectAll = () => {
    optionsSubmarkets.value.forEach(group => {
      if (!selectedGroups.value.includes(group.value)) {
        selectedGroups.value.push(group.value);
      }
      group.options.forEach(option => {
        if (!selectedOptions.value.includes(option.value)) {
          selectedOptions.value.push(option.value);
          option.selected = true;
        }
      });
    });
  };

  const deselectAll = () => {
    selectedGroups.value = [];
    selectedOptions.value = [];
    optionsSubmarkets.value.forEach(group => {
      group.options.forEach(option => {
        option.selected = false;
      });
    });
  };
  const visibleA = ref(false)



</script>
<style>
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
</style>
<template>
    <div class="docs-example rounded-top p-4">
        <CContainer>
        <CRow>
            <CCol :md="6">
            <CCol>
                <CMultiSelect 
                label="Select permissions"
                :options="uniquePermissionsCbo" 
                @change="handleUniquePermissionsChange($event)"
                selectionType="counter"
                 />
            </CCol>
            <CCol>
                <CMultiSelect 
                label="Select Modulos"
                :options="modulesCbo"
                v-model="selectedModuleId" 
                @change="handletest($event)"
                selectionType="counter" />
            </CCol>
            <!-- <CCol>
                <CMultiSelect 
                label="Select Markets"
                :options="marketsCbo" 
                v-model="selectedMarketId"
                @change="handletest($event)"
                selectionType="counter" />
            </CCol>
            <CCol>
                <CMultiSelect 
                label="Select SubMarkets"
                :options="optionsSubmarkets" 
                v-model="selectedSubmarketId"
                @change="handletest($event)"
                selectionType="counter" />
            </CCol> -->
            <CCol>
              <CButton color="secondary"  variant="outline" @click="visibleA = !visibleA"  class="d-grid gap-2 col-12 mt-3">
                Select Markets And Submarkets
                <CIcon :content="cilChevronCircleDownAlt" size="sm" />
              </CButton>
              <CCollapse :visible="visibleA">
                  <div class="mt-1" style="display: flex;justify-content: center;">
                    <CButton color="primary" variant="ghost" @click="selectAll" class="me-2">Select All</CButton>
                    <CButton color="primary" variant="ghost" @click="deselectAll">Deselect All</CButton>
                  </div>
                  <CListGroup>
                    <CListGroupItem v-for="group in optionsSubmarkets" :key="group.value" class="list-group-item-pather-custom">
                      <CFormCheck
                        hitArea="full"
                        :id="group.value"
                        :label="group.label"
                        :modelValue="selectedGroups.includes(group.value)"
                        @update:modelValue="(checked) => toggleGroup(group, checked)"
                      />
                      <CListGroup class="mt-2" >
                        <CListGroupItem v-for="option in group.options" :key="option.value" class="ms-4 list-group-children-custom">
                          <CFormCheck
                            hitArea="full"
                            :id="option.value"
                            :label="option.label"
                            :modelValue="selectedOptions.includes(option.value)"
                            @update:modelValue="(checked) => toggleOption(group, option, checked)"
                          />
                        </CListGroupItem>
                      </CListGroup>
                    </CListGroupItem>
                  </CListGroup>
              </CCollapse>

            </CCol>
            </CCol>
            <CCol :md="6">
            <CCol>
                <CMultiSelect 
                label="Select Years"
                :options="yearsCbo" 
                @change="handletest($event)"
                selectionType="counter" />
            </CCol>
            <CCol>
                <CMultiSelect 
                label="Select Quarters"
                :options="quartersCbo" 
                @change="handletest($event)"
                selectionType="counter" />
            </CCol>
            </CCol>
        </CRow>
        <CRow>
            <div style="display: flex; justify-content: center;padding:1rem">
              <CButton 
              color="success" 
              variant="outline" 
              type="submit"
              @click="submitFunction"
              >Submit</CButton>
            </div>
        </CRow>
        </CContainer>
    </div>
</template>
