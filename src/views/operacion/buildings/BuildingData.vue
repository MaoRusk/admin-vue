<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import Swal from 'sweetalert2';
import { cilX, cilPlus } from '@coreui/icons'
import axios from 'axios';
import { useRouter } from 'vue-router'
import { Class, IndustrialPark, Status, Owner, Developer, Type, Region, LoadingDoor, Deal, Currency, Tenancy, ListingBroker, BuildingState } from '../../../assets/json/loadCats'
import { CRow } from '@coreui/vue-pro';

const inputValue = ref(null)
const selectedStatus = ref(null)
const SelectedIndustrialPark = ref(null)
const SelectedType = ref(null)
const SelectedOwner = ref(null)
const SelectedDeveloper = ref(null)
const SelectedBuilder = ref(null)
const SelectedRegion = ref(null)
const marketsCbo = ref([]);
const submarketCbo = ref([]);
const SelectedLoadingDoor = ref(null)
const selectedBuildingState = ref('1');

// VARIABLES TABLA BUILDINGS
const builderStateId_input = ref(null);
const buildingName_input = ref(null);
const classId_input = ref(null);
const buildingSizeSf_input = ref(null);
const expansionLand_input = ref(null);
const statusId_input = ref(null);
const industrialParkId_input = ref(null);
const typeId_input = ref(null);
const ownerId_input = ref(null);
const developerId_input = ref(null);
const builderId_input = ref(null);
const regionId_input = ref(null);
const marketId_input = ref(null);
const subMarketId_input = ref(null);
const dealId_input = ref(null);
const currencyId_input = ref(null);
const salePriceUsd_input = ref(null);
const tenancyId_input = ref(null);
const latitud_input = ref(null);
const longitud_input = ref(null);
const yearBuilt_input = ref(null);
const clearHeight_input = ref(null);
const officesSpace_input = ref(null);
const crane_input = ref(null);
const hvac_input = ref(null);
const railSpur_input = ref(null);
const sprinklers_input = ref(null);
const office_input = ref(null);
const leed_input = ref(null);
const totalLand_input = ref(null);
const hvacProductionArea_input = ref(null);
const status = ref('Activo');

// VARIABLES TABLA buildings_features
const loadingDoorId_input = ref(null);
const lighting_input = ref(null);
const ventilation_input = ref(null);
const transformerCapacity_input = ref(null);
const constructionType_input = ref(null);
const constructionState_input = ref(null);
const roofSystem_input = ref(null);
const fireProtectionSystem_input = ref(null);
const skylightsSf_input = ref(null);
const coverage_input = ref(null);

// VARIABLES TABLA BUILDINGS AVAILABILITY
const  availableSf_input = ref(null);
const  minimumSpaceSf_input = ref(null);
const  expansionUpToSf_input = ref(null);
const  dockDoors_input = ref(null);
const  driveInDoor_input = ref(null);
const  floorThickness_input = ref(null);
const  floorResistance_input = ref(null);
const  truckCourt_input = ref(null);
const  crossdock_input = ref(null);
const  sharedTruck_input = ref(null);
const  buildingDimensions1_input = ref(null);
const  buildingDimensions2_input = ref(null);
const  baySize1_input = ref(null);
const  baySize2_input = ref(null);
const  columnsSpacing1_input = ref(null);
const  columnsSpacing2_input = ref(null);
const  knockoutsDocks_input = ref(null);
const  parkingSpace_input = ref(null);
const  availableMonth_input = ref(null);
const  availableYear_input = ref(null);
const  minLease_input = ref(null);
const  maxLease_input = ref(null);

// VARIABLES TABLA ABSORPTION

const leaseTermMonth_input = ref(null);
const askingRateShell_input = ref(null);
const closingRate_input = ref(null);
const KVAS_input = ref(null);
const closingQuarter_input = ref(null);
const leaseUp_input = ref(null);
const month_input = ref(null);
const newConstruction_input = ref(null);
const startingConstruction_input = ref(null);
const tenantId_input = ref(null);
const industryId_input = ref(null);
const finalUseId_input = ref(null);
const shelterId_input = ref(null);
const copanyTypeId_input = ref(null);


  const handleStatusSelect = (newValue) => {
    inputValue.value = newValue;
    selectedStatus.value = inputValue.value.map(item => item.value).join(',');
  };
  const handleIndustrialParkSelect = (newValue) => {
    inputValue.value = newValue;
    SelectedIndustrialPark.value = inputValue.value.map(item => item.value).join(',');
  };
  const handleTypeSelect = (newValue) => {
    inputValue.value = newValue;
    SelectedType.value = inputValue.value.map(item => item.value).join(',');
  };
  const handleOwnerSelect = (newValue) => {
    inputValue.value = newValue;
    SelectedOwner.value = inputValue.value.map(item => item.value).join(',');
  };
  const handleDeveloperSelect = (newValue) => {
    inputValue.value = newValue;
    SelectedDeveloper.value = inputValue.value.map(item => item.value).join(',');
  };
  const handleBuilderSelect = (newValue) => {
    inputValue.value = newValue;
    SelectedBuilder.value = inputValue.value.map(item => item.value).join(',');
  };
  const handleRegionSelect = (newValue) => {
    inputValue.value = newValue;
    SelectedRegion.value = inputValue.value.map(item => item.value).join(',');
  };
  const handleLoadingDoorSelect = (newValue) => {
    inputValue.value = newValue;
    SelectedLoadingDoor.value = inputValue.value.map(item => item.value).join(',');
  };
  const handleBuildingState = (newValue) => {
    inputValue.value = newValue;
    selectedBuildingState.value = inputValue.value.map(item => item.value).join(',');    
}
  // Validaciones
  const updateStatus = (newStatus) => {
    status.value = newStatus;
  };
  onMounted(() => {
    fetchData();
  });

  const fetchData = async () => {
    try {
      const [ marketsResponse, submarketResponse] = await Promise.all([
        axios.get('http://localhost:8000/api/market'),
        axios.get('http://localhost:8000/api/submarket'),
      ]);


      marketsCbo.value = marketsResponse.data.map(market => ({
        value: market.id,
        label: market.marketName,
      }));

      submarketCbo.value = submarketResponse.data.map(submarket => ({
        value: submarket.id,
        label: submarket.subMarketName,
        marketId: submarket.marketId,
      }));

    } catch (error) {
      console.error('Hubo un error obteniendo los datos:', error);
    }
  };

  // Add A New Building
  const submitFunction = async () => {
    if (!isFormValid.value) {
      Swal.fire({
        title: "Sorry!",
        text: "Please fill in all the required fields.",
        icon: "info",
        showConfirmButton: false,
        timer: 3000
      });
      return;
    }else{
      const formData = new FormData();

      // TABLA BUILDINGS
      formData.append('builderStateId', builderStateId_input.value);
      formData.append('buildingName', buildingName_input.value);
      formData.append('classId', classId_input.value);
      formData.append('buildingSizeSf', buildingSizeSf_input.value);
      formData.append('expansionLand', expansionLand_input.value);
      formData.append('statusId', statusId_input.value);
      formData.append('industrialParkId', industrialParkId_input.value);
      formData.append('typeId', typeId_input.value);
      formData.append('ownerId', ownerId_input.value);
      formData.append('developerId', developerId_input.value);
      formData.append('builderId', builderId_input.value);
      formData.append('regionId', regionId_input.value);
      formData.append('marketId', marketId_input.value);
      formData.append('subMarketId', subMarketId_input.value);
      formData.append('dealId', dealId_input.value);
      formData.append('currencyId', currencyId_input.value);
      formData.append('salePriceUsd', salePriceUsd_input.value);
      formData.append('tenancyId', tenancyId_input.value);
      formData.append('latitud', latitud_input.value);
      formData.append('longitud', longitud_input.value);
      formData.append('yearBuilt', yearBuilt_input.value);
      formData.append('clearHeight', clearHeight_input.value);
      formData.append('officesSpace', officesSpace_input.value);
      formData.append('crane', crane_input.value);
      formData.append('hvac', hvac_input.value);
      formData.append('railSpur', railSpur_input.value);
      formData.append('sprinklers', sprinklers_input.value);
      formData.append('office', office_input.value);
      formData.append('leed', leed_input.value);
      formData.append('totalLand', totalLand_input.value);
      formData.append('hvacProductionArea', hvacProductionArea_input.value);
      formData.append('status', status.value);

      // TABLA FEATURES
      formData.append('loadingDoorId', loadingDoorId_input.value);
      formData.append('lighting', lighting_input.value);
      formData.append('ventilation', ventilation_input.value);
      formData.append('transformerCapacity', transformerCapacity_input.value);
      formData.append('constructionType', constructionType_input.value);
      formData.append('constructionState', constructionState_input.value);
      formData.append('roofSystem', roofSystem_input.value);
      formData.append('fireProtectionSystem', fireProtectionSystem_input.value);
      formData.append('skylightsSf', skylightsSf_input.value);
      formData.append('coverage', coverage_input.value);
      
      // TABLA AVAILABILITY
      formData.append('availableSf', availableSf_input.value);
      formData.append('minimumSpaceSf', minimumSpaceSf_input.value);
      formData.append('expansionUpToSf', expansionUpToSf_input.value);
      formData.append('dockDoors', dockDoors_input.value);
      formData.append('driveInDoor', driveInDoor_input.value);
      formData.append('floorThickness', floorThickness_input.value);
      formData.append('floorResistance', floorResistance_input.value);
      formData.append('truckCourt', truckCourt_input.value);
      formData.append('crossdock', crossdock_input.value);
      formData.append('sharedTruck', sharedTruck_input.value);
      formData.append('buildingDimensions1', buildingDimensions1_input.value);
      formData.append('buildingDimensions2', buildingDimensions2_input.value);
      formData.append('baySize1', baySize1_input.value);
      formData.append('baySize2', baySize2_input.value);
      formData.append('columnsSpacing1', columnsSpacing1_input.value);
      formData.append('columnsSpacing2', columnsSpacing2_input.value);
      formData.append('knockoutsDocks', knockoutsDocks_input.value);
      formData.append('parkingSpace', parkingSpace_input.value);
      formData.append('availableMonth', availableMonth_input.value);
      formData.append('availableYear', availableYear_input.value);
      formData.append('minLease', minLease_input.value);
      formData.append('maxLease', maxLease_input.value);

      // TABLA Absoprtion
      formData.append('leaseTermMonth', leaseTermMonth_input.value);
      formData.append('askingRateShell', askingRateShell_input.value);
      formData.append('closingRate', closingRate_input.value);
      formData.append('KVAS', KVAS_input.value);
      formData.append('closingQuarter', closingQuarter_input.value);
      formData.append('leaseUp', leaseUp_input.value);
      formData.append('month', month_input.value);
      formData.append('newConstruction', newConstruction_input.value);
      formData.append('startingConstruction', startingConstruction_input.value);
      formData.append('tenantId', tenantId_input.value);
      formData.append('industryId', industryId_input.value);
      formData.append('finalUseId', finalUseId_input.value);
      formData.append('shelterId', shelterId_input.value);
      formData.append('copanyTypeId', copanyTypeId_input.value);

      axios.post('http://localhost:8000/api/employees', formData).then(response => {
        Swal.fire({
          title: "Added!",
          text: "Employee added successfully.",
          icon: "success",
          showConfirmButton: false,
          timer: 3500
        }).then(() => {
          router.push({
            name: 'Employees',
            params: { id: Number(0) },
          })
        });

      }).catch(error => {
        Swal.fire({
          title: "Error adding Employee.",
          text: error.response.data.message,
          icon: "error",
          showConfirmButton: false,
          timer: 3500
        });
      });
    }
  }
</script>

<template>
  <CContainer>
    <CRow>
        <!-- *** GENERAL INFORMATION *** -->
        <CCard class="card text-secondary mb-3 border-secondary card-header-customer-buildings " >
          <CCardBody class="card-body-customer-buildings">
            General information
          </CCardBody>
        </CCard>
        <CCard class="card-customer-buildings">
          <CCardBody>
            <CRow>
              <CCol :md="3">
                <!-- BUILDING STATE -->
                <div  class="mt-2">
                  <CMultiSelect
                    label="Building State"
                    :multiple="false"
                    :options="BuildingState"
                    @change="handleBuildingState"
                    optionsStyle="text"
                  >
                  </CMultiSelect>
                </div>
                <!-- BUILDING NAME (SF) -->
                <div class="mt-2">
                  <CFormInput
                  type="text"
                  class="no-spinner"
                  placeholder="Building Name"
                  label="Building Name"
                  />
                </div>
                <div style="display: flex; justify-content: left; align-items: center;">
                  <label for="status">Status</label>
                  <div style="margin-left: .6rem; padding-top: .5rem;">
                    <CFormCheck 
                      inline 
                      type="radio" 
                      name="inlineRadioOptions" 
                      id="inlineCheckbox1" 
                      value="Activo" 
                      label="Activo"
                      :checked="status === 'Activo'"
                      @change="updateStatus('Activo')"                  />
                    <CFormCheck 
                      inline 
                      type="radio" 
                      name="inlineRadioOptions" 
                      id="inlineCheckbox2" 
                      value="Inactivo" 
                      label="Inactivo"
                      :checked="status === 'Inactivo'"
                      @change="updateStatus('Inactivo')"                  />    
                  </div>
                </div>
              </CCol>
              <CCol :md="3">
                <!-- CLASS -->
                <div  class="mt-2">
                  <CMultiSelect
                    label="Class"
                    :multiple="false"
                    :options="Class"
                    optionsStyle="text"
                  >
                  </CMultiSelect>
                </div>
                <!-- BUILDING SIZE (SF) -->
                <div class="mt-2">
                  <CFormInput 
                  type="number" 
                  class="no-spinner"
                  @wheel.prevent
                  @touchstart.prevent
                  @touchmove.prevent
                  placeholder="Building Size (SF)" 
                  label="Building Size (SF)"
                  />
                </div>
              </CCol>
              <CCol :md="3">
                <!-- EXPANSION LAND -->
                <div class="mt-2">
                  <CFormInput 
                  type="number" 
                  class="no-spinner"
                  @wheel.prevent
                  @touchstart.prevent
                  @touchmove.prevent
                  placeholder="Expansion Land" 
                  label="Expansion Land"
                  />
                </div>
                <!-- STATUS -->
                <div class="mt-2">
                  <CMultiSelect
                    label="Status"
                    v-model="selectedStatus"
                    :multiple="false"
                    :options="Status"
                    optionsStyle="text"
                    @change="handleStatusSelect"
                  >
                    <template #options="{ option }" >
                      <div class="d-flex">
                        <CIcon v-if="option.value == 0" class="me-1 mt-1" :icon="cilPlus" size="sm"/> {{option.label}}
                      </div>
                    </template>
                  </CMultiSelect>
                  <CInputGroup v-if="selectedStatus == '0'" class="mb-3 mt-2">
                    <CFormInput placeholder="New status.." aria-label="New status.." aria-describedby="button-addon2"/>
                    <CButton type="button" color="success" variant="outline" id="button-addon2">Save</CButton>
                  </CInputGroup>
                </div>
              </CCol>
              <CCol :md="3">
                <!-- YEAR BUILT -->
                <div class="mt-2">
                  <CDatePicker label="Year Built" locale="en-US" selectionType="year" />
                </div>
                <!-- AVAILABLE SINCE (Available from) -->
                <div class="mt-2">
                  <CDatePicker label="Available Since" locale="en-US" selectionType="month" />
                </div>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
        
        <!-- *** LOCATION *** -->
        <CCard class="card text-secondary mb-3 mt-4 border-secondary card-header-customer-buildings " >
          <CCardBody class="card-body-customer-buildings">
            Location
          </CCardBody>
        </CCard>
        <CCol :md="4">
          <!-- REGION -->
          <div class="mt-2">
            <CMultiSelect
              label="Region"
              v-model="Region"
              :multiple="false"
              :options="Region"
              optionsStyle="text"
              @change="handleRegionSelect"
            >
              <template #options="{ option }" >
                <div class="d-flex">
                  <CIcon v-if="option.value == 0" class="me-1 mt-1" :icon="cilPlus" size="sm"/> {{option.label}}
                </div>
              </template>
            </CMultiSelect>
            <CInputGroup v-if="SelectedRegion == '0'" class="mb-3 mt-2">
              <CFormInput placeholder="New Region.." aria-label="New Region.." aria-describedby="button-addon2"/>
              <CButton type="button" color="success" variant="outline" id="button-addon2">Save</CButton>
            </CInputGroup>
          </div>
          <!-- INDUSTRIAL PARK -->
          <div class="mt-2">
            <CMultiSelect
              label="Industrial Park"
              v-model="IndustrialPark"
              :multiple="false"
              :options="IndustrialPark"
              optionsStyle="text"
              @change="handleIndustrialParkSelect  "
            >
              <template #options="{ option }" >
                <div class="d-flex">
                  <CIcon v-if="option.value == 0" class="me-1 mt-1" :icon="cilPlus" size="sm"/> {{option.label}}
                </div>
              </template>
            </CMultiSelect>
            <CInputGroup v-if="SelectedIndustrialPark == '0'" class="mb-3 mt-2">
              <CFormInput placeholder="New Industrial Park.." aria-label="New Industrial Park.." aria-describedby="button-addon2"/>
              <CButton type="button" color="success" variant="outline" id="button-addon2">Save</CButton>
            </CInputGroup>
          </div>
        </CCol>
        <CCol :md="4">
          <!-- MARKET -->
          <div class="mt-2">
            <CMultiSelect
              label="Market"
              v-model="marketsCbo"
              :multiple="false"
              :options="marketsCbo"
              optionsStyle="text"
            >
              <template #options="{ option }" >
                <div class="d-flex">
                  <CIcon v-if="option.value == 0" class="me-1 mt-1" :icon="cilPlus" size="sm"/> {{option.label}}
                </div>
              </template>
            </CMultiSelect>
            <CInputGroup v-if="SelectedRegion == '0'" class="mb-3 mt-2">
              <CFormInput placeholder="New Market.." aria-label="New Market.." aria-describedby="button-addon2"/>
              <CButton type="button" color="success" variant="outline" id="button-addon2">Save</CButton>
            </CInputGroup>
          </div>
          <!-- SUB MARKET -->
          <div class="mt-2">
            <CMultiSelect
              label="Submarket"
              :multiple="false"
              :options="submarketCbo"
              optionsStyle="text"
              @change="handleRegionSelect"
            >
              <template #options="{ option }" >
                <div class="d-flex">
                  <CIcon v-if="option.value == 0" class="me-1 mt-1" :icon="cilPlus" size="sm"/> {{option.label}}
                </div>
              </template>
            </CMultiSelect>
            <CInputGroup v-if="SelectedRegion == '0'" class="mb-3 mt-2">
              <CFormInput placeholder="New Submarket.." aria-label="New Submarket.." aria-describedby="button-addon2"/>
              <CButton type="button" color="success" variant="outline" id="button-addon2">Save</CButton>
            </CInputGroup>
          </div>
        </CCol>
        <CCol :md="4">    
          <!-- LATITUD -->
          <div class="mt-2">
            <CFormInput
            type="text"
            placeholder="Latitud"
            label="Latitud"
            />
          </div>
          <!-- ALTITUD -->
          <div class="mt-2">
            <CFormInput
            type="text"
            placeholder="Altitud"
            label="Altitud"
            />
          </div>
        </CCol>
        
        <!-- *** PROPERTY DETAILS *** -->
        <CCard class="card text-secondary mb-3 mt-4 border-secondary card-header-customer-buildings " >
          <CCardBody class="card-body-customer-buildings">
            Property Details
          </CCardBody>
        </CCard>
        <CCard class="card-customer-buildings">
          <CCardBody>
            <CRow>
              <CCol :md="3">
                <!-- OWNER -->
                <div class="mt-2">
                  <CMultiSelect
                    label="Owner"
                    v-model="Owner"
                    :multiple="false"
                    :options="Owner"
                    optionsStyle="text"
                    @change="handleOwnerSelect"
                  >
                    <template #options="{ option }" >
                      <div class="d-flex">
                        <CIcon v-if="option.value == 0" class="me-1 mt-1" :icon="cilPlus" size="sm"/> {{option.label}}
                      </div>
                    </template>
                  </CMultiSelect>
                  <CInputGroup v-if="SelectedOwner == '0'" class="mb-3 mt-2">
                    <CFormInput placeholder="New Owner.." aria-label="New Owner.." aria-describedby="button-addon2"/>
                    <CButton type="button" color="success" variant="outline" id="button-addon2">Save</CButton>
                  </CInputGroup>
                </div>
              </CCol>
              <CCol :md="3">
                <!-- DEVELOPER -->
                <div class="mt-2">
                  <CMultiSelect
                    label="Developer"
                    v-model="Developer"
                    :multiple="false"
                    :options="Developer"
                    optionsStyle="text"
                    @change="handleDeveloperSelect"
                  >
                    <template #options="{ option }" >
                      <div class="d-flex">
                        <CIcon v-if="option.value == 0" class="me-1 mt-1" :icon="cilPlus" size="sm"/> {{option.label}}
                      </div>
                    </template>
                  </CMultiSelect>
                  <CInputGroup v-if="SelectedDeveloper == '0'" class="mb-3 mt-2">
                    <CFormInput placeholder="New Developer.." aria-label="New Developer.." aria-describedby="button-addon2"/>
                    <CButton type="button" color="success" variant="outline" id="button-addon2">Save</CButton>
                  </CInputGroup>
                </div>
              </CCol>
              <CCol :md="3">    
                <!-- BUILDER -->
                <div class="mt-2">
                  <CMultiSelect
                    label="Builder"
                    v-model="Builder"
                    :multiple="false"
                    :options="Developer"
                    optionsStyle="text"
                    @change="handleBuilderSelect"
                  >
                    <template #options="{ option }" >
                      <div class="d-flex">
                        <CIcon v-if="option.value == 0" class="me-1 mt-1" :icon="cilPlus" size="sm"/> {{option.label}}
                      </div>
                    </template>
                  </CMultiSelect>
                  <CInputGroup v-if="SelectedBuilder == '0'" class="mb-3 mt-2">
                    <CFormInput placeholder="New Builder.." aria-label="New Builder.." aria-describedby="button-addon2"/>
                    <CButton type="button" color="success" variant="outline" id="button-addon2">Save</CButton>
                  </CInputGroup>
                </div>
              </CCol>
              <CCol :md="3">    
                <!-- LISTING BROKER -->
                <div class="mt-2">
                  <CMultiSelect
                    label="ListingBroker"
                    :multiple="false"
                    :options="ListingBroker"
                    optionsStyle="text"
                  >
                  </CMultiSelect>
                </div>       
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>

        <!-- *** TRANSACTIONS AND AGREEMENTS *** -->
        <CCard class="card text-secondary mb-3 mt-4 border-secondary card-header-customer-buildings " >
          <CCardBody class="card-body-customer-buildings">
            Transactions and Agreements
          </CCardBody>
        </CCard>
       
              <CCol :md="3">
                <!--   SALE PRICE (USD)  -->
                <div class="mt-2">
                  <label >Sale Price (USD) </label>
                  <CInputGroup class="mb-3 mt-2">
                    <CInputGroupText>$</CInputGroupText>
                      <CFormInput 
                        type="number" 
                        class="no-spinner"
                        @wheel.prevent
                        @touchstart.prevent
                        @touchmove.prevent 
                        />
                    <CInputGroupText>.00</CInputGroupText>
                  </CInputGroup>
                </div>
              </CCol>
              <CCol :md="3">
                <!-- CURRENCY -->
                <div class="mt-2">
                  <CMultiSelect
                    label="Currency"
                    :multiple="false"
                    :options="Currency"
                    optionsStyle="text"
                  >
                  </CMultiSelect>
                </div>
              </CCol>
              <CCol :md="3">
                <!-- TENANCY -->
                <div class="mt-2">
                  <CMultiSelect
                    label="Tenancy"
                    :multiple="false"
                    :options="Tenancy"
                    optionsStyle="text"
                  >
                  </CMultiSelect>
                </div>
              </CCol>
              <CCol :md="3">
                <!-- DEAL -->
                <div class="mt-2">
                  <CMultiSelect
                    label="Deal"
                    :multiple="false"
                    :options="Deal"
                    optionsStyle="text"
                  >
                </CMultiSelect>
                </div>
              </CCol>
           

        <!-- *** TECHNICAL SPECIFICATIONS *** -->
        <CCard class="card text-secondary mb-3 mt-4 border-secondary card-header-customer-buildings " >
          <CCardBody class="card-body-customer-buildings">
            Technical Specifications
          </CCardBody>
        </CCard>
        <CCard class="card-customer-buildings">
          <CCardBody>
            <CRow>
              <CCol :md="3">
                <!-- TYPE -->
                <div class="mt-2">
                    <CMultiSelect
                      label="Type"
                      v-model="Type"
                      :multiple="false"
                      :options="Type"
                      optionsStyle="text"
                      @change="handleTypeSelect"
                    >
                      <template #options="{ option }" >
                        <div class="d-flex">
                          <CIcon v-if="option.value == 0" class="me-1 mt-1" :icon="cilPlus" size="sm"/> {{option.label}}
                        </div>
                      </template>
                    </CMultiSelect>
                    <CInputGroup v-if="SelectedType == '0'" class="mb-3 mt-2">
                      <CFormInput placeholder="New Type.." aria-label="New Type.." aria-describedby="button-addon2"/>
                      <CButton type="button" color="success" variant="outline" id="button-addon2">Save</CButton>
                    </CInputGroup>
                </div>
                <!-- TOTAL LAND -->
                <div class="mt-2">
                  <CFormInput 
                  type="number" 
                  class="no-spinner"
                  @wheel.prevent
                  @touchstart.prevent
                  @touchmove.prevent
                  placeholder="Total Land" 
                  label="Total Land"
                  />
                </div>
                <!-- CLEAR HEIGHT -->
                <div class="mt-2">
                  <CFormInput 
                  type="number" 
                  class="no-spinner"
                  @wheel.prevent
                  @touchstart.prevent
                  @touchmove.prevent
                  placeholder="Clear Height" 
                  label="Clear Height"
                  />
                </div>
                <!-- CONSTRUCTION TYPE -->
                <div class="mt-2">
                    <CFormInput
                    type="text"
                    placeholder="Construction Type"
                    label="Construction Type"
                    />
                </div>
                <!-- CONSTRUCTION STATE -->
                <div class="mt-2">
                    <CFormInput
                    type="text"
                    placeholder="Construction State"
                    label="Construction State"
                    />
                </div>
              </CCol>
              <CCol :md="3">
                <!-- LOADING DOOR -->
                <div class="mt-2">
                    <CMultiSelect
                    label="Loading Door"
                    :multiple="false"
                    :options="LoadingDoor"
                    optionsStyle="text"
                    @change="handleLoadingDoorSelect"
                    >
                    <template #options="{ option }" >
                        <div class="d-flex">
                        <CIcon v-if="option == 0" class="me-1 mt-1" :icon="cilPlus" size="sm"/> {{option.label}}
                        </div>
                    </template>
                    </CMultiSelect>
                    <CInputGroup v-if="SelectedLoadingDoor == '0'" class="mb-3 mt-2">
                    <CFormInput placeholder="New Loading Door.." aria-label="New Loading Door.." aria-describedby="button-addon2"/>
                    <CButton type="button" color="success" variant="outline" id="button-addon2">Save</CButton>
                    </CInputGroup>
                </div>  
                <!-- OFFICE -->
                <div class="mt-2 d-flex" style="justify-content: space-between;">
                  <div style="width: 5.3rem;">
                    <label>OFFICE</label>
                  </div>
                  <CFormCheck type="radio" name="flexRadioDefault" id="flexRadioDefault1" label="Yes"/>
                  <CFormCheck type="radio" name="flexRadioDefault" id="flexRadioDefault2" label="No" checked/>
                </div>
                <!-- SPRINKLERS -->
                <div class="mt-2 d-flex" style="justify-content: space-between;">
                  <div style="width: 5.3rem;">
                    <label>SPRINKLERS</label>
                  </div>
                  <CFormCheck type="radio" name="flexRadioDefault" id="flexRadioDefault1" label="Yes"/>
                  <CFormCheck type="radio" name="flexRadioDefault" id="flexRadioDefault2" label="No" checked/>
                </div>
                <!-- CRANE -->
                <div class="mt-2 d-flex" style="justify-content: space-between;">
                  <div style="width: 5.3rem;">
                    <label>CRANE</label>
                  </div>
                  <CFormCheck type="radio" name="RadioCRANE" id="RadioCRANE1" label="Yes"/>
                  <CFormCheck type="radio" name="RadioCRANE" id="RadioCRANE2" label="No" checked/>
                </div>
                <!-- HVAC -->
                <div class="mt-2 d-flex" style="justify-content: space-between;">
                  <div style="width: 5.3rem;">
                    <label>HVAC</label>
                  </div>
                  <CFormCheck type="radio" name="flexRadioDefault" id="flexRadioDefault1" label="Yes"/>
                  <CFormCheck type="radio" name="flexRadioDefault" id="flexRadioDefault2" label="No" checked/>
                </div>
                <!-- LEED -->
                <div class="mt-2 d-flex" style="justify-content: space-between;">
                  <div style="width: 5.3rem;">
                    <label>LEED</label>
                  </div>
                  <CFormCheck type="radio" name="flexRadioDefault" id="flexRadioDefault1" label="Yes"/>
                  <CFormCheck type="radio" name="flexRadioDefault" id="flexRadioDefault2" label="No" checked/>
                </div>
                <!-- RAIL SPUR -->
                <div class="mt-2 d-flex" style="justify-content: space-between;">
                  <div style="width: 5.3rem;">
                    <label>RAIL SPUR</label>
                  </div>
                  <CFormCheck type="radio" name="flexRadioDefault" id="flexRadioDefault1" label="Yes"/>
                  <CFormCheck type="radio" name="flexRadioDefault" id="flexRadioDefault2" label="No" checked/>
                </div>
              </CCol>
              <CCol :md="3">
                <!-- OFFICE SPACE -->
                <div class="mt-2">
                  <CFormInput 
                  type="number" 
                  class="no-spinner"
                  @wheel.prevent
                  @touchstart.prevent
                  @touchmove.prevent
                  placeholder="Office Space" 
                  label="Office Space"
                  />
                </div>
                <!-- HVAC PRODUCTION AREA -->
                <div style="margin-top: .35rem;">
                  <CFormInput
                  type="text"
                  placeholder="HVAC Production Area"
                  label="HVAC Production Area"
                  />
                </div>
                <!-- TRANSFORMER CAPACITY (Electric Substations) -->
                <div class="mt-2">
                    <CFormInput
                    type="text"
                    placeholder="Transformer Capacity"
                    label="Transformer Capacity"
                    />
                </div>
                <!-- LIGHTING -->
                <div class="mt-2">
                    <CFormInput
                    type="text"
                    placeholder="Lighting"
                    label="Lighting"
                    />
                </div>
              </CCol>
              <CCol :md="3">
                <!-- VENTILATION -->
                <div class="mt-2">
                    <CFormInput
                    type="text"
                    placeholder="Ventilation System"
                    label="Ventilation System"
                    />
                </div>
                <!-- ROOF SYSTEM (Roofing) -->
                <div class="mt-2">
                    <CFormInput
                    type="text"
                    placeholder="Roof System"
                    label="Roof System"
                    />
                </div>
                <!-- FIRE PROTECTION SYSTEM (FPS) -->
                <div class="mt-1">
                    <CFormInput
                    type="text"
                    class="no-spinner"
                    placeholder="Fire Protection System (FPS)"
                    label="Fire Protection System (FPS)"
                    />
                </div>
                <!-- SKYLIGHTS (SF) -->
                <div class="mt-2">
                  <CFormInput 
                  type="number" 
                  class="no-spinner"
                  @wheel.prevent
                  @touchstart.prevent
                  @touchmove.prevent
                  placeholder="Skylight %"
                  label="Skylight %"
                  />
                </div>
                <!-- COVERAGE (FRA%) -->
                <div class="mt-2">
                    <CFormInput 
                    type="number" 
                    class="no-spinner"
                    @wheel.prevent
                    @touchstart.prevent
                    @touchmove.prevent
                    placeholder="Coverage %"
                    label="Coverage %"
                    />
                </div>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>

        <CRow v-if="selectedBuildingState == 1">
          <!-- *** AVAILABILITY *** -->
          <CCard class="card text-secondary mb-3 mt-4 border-secondary card-header-customer-buildings " >
            <CCardBody class="card-body-customer-buildings">
              AVAILABILITY
            </CCardBody>
          </CCard>
          <!-- <CCard class="card-customer-buildings">
            <CCardBody>
              <CRow> -->
                <CCol :md="3">
                  <!-- AVAILABLE (SF) -->
                  <div class="mt-2">
                    <CFormInput 
                    type="number" 
                    class="no-spinner"
                    @wheel.prevent
                    @touchstart.prevent
                    @touchmove.prevent
                    placeholder="Available (SF)" 
                    label="Available (SF)"
                    />
                  </div>
                  <!-- MINIMUM SPACE (SF) -->
                  <div class="mt-2">
                    <CFormInput 
                    type="number" 
                    class="no-spinner"
                    @wheel.prevent
                    @touchstart.prevent
                    @touchmove.prevent
                    placeholder="Minimum Space (SF)" 
                    label="Minimum Space (SF)"
                    />
                  </div>
                  <!-- EXPANSION UP TO (SF) -->
                  <div class="mt-2">
                    <CFormInput 
                    type="number" 
                    class="no-spinner"
                    @wheel.prevent
                    @touchstart.prevent
                    @touchmove.prevent
                    placeholder="Expansion Up To (SF)" 
                    label="Expansion Up To (SF)"
                    />
                  </div>
                  <!-- DOCK DOORS -->
                  <div class="mt-2">
                    <CFormInput 
                    type="number" 
                    class="no-spinner"
                    @wheel.prevent
                    @touchstart.prevent
                    @touchmove.prevent
                    placeholder="Doock Doors" 
                    label="Doock Doors"
                    />
                  </div>
                  <!-- DRIVE IN DOOR -->
                  <div class="mt-2">
                    <CFormInput 
                    type="number" 
                    class="no-spinner"
                    @wheel.prevent
                    @touchstart.prevent
                    @touchmove.prevent
                    placeholder="Drive in Door" 
                    label="Drive in Door"
                    />
                  </div>
                  <!-- TRUCK COURT -->
                  <div class="mt-2">
                    <CFormInput 
                      type="number" 
                      class="no-spinner"
                      @wheel.prevent
                      @touchstart.prevent
                      @touchmove.prevent
                      placeholder="Truck Court"
                      label="Truck Court"
                      />
                  </div>
                </CCol>
                <CCol :md="3">
                  <!-- BUILDING DIMENSION 1 -->
                  <div class="mt-2">
                    <CFormInput 
                    type="number" 
                    class="no-spinner"
                    @wheel.prevent
                    @touchstart.prevent
                    @touchmove.prevent
                    placeholder="Building Dimensions 1" 
                    label="Building Dimensions 1"
                    />
                  </div>
                  <!-- BUILDING DIMENSION 2 -->
                  <div class="mt-2">
                    <CFormInput 
                    type="number" 
                    class="no-spinner"
                    @wheel.prevent
                    @touchstart.prevent
                    @touchmove.prevent
                    placeholder="Building Dimensions 2" 
                    label="Building Dimensions 2"
                    />
                  </div>
                  <!-- BAY SIZE 1 -->
                  <div class="mt-2">
                    <CFormInput 
                    type="number" 
                    class="no-spinner"
                    @wheel.prevent
                    @touchstart.prevent
                    @touchmove.prevent
                    placeholder="Bay Size 1" 
                    label="Bay Size 1"
                    />
                  </div>
                  <!-- BAY SIZE 2 -->
                  <div class="mt-2">
                    <CFormInput 
                    type="number" 
                    class="no-spinner"
                    @wheel.prevent
                    @touchstart.prevent
                    @touchmove.prevent
                    placeholder="Bay Size 2" 
                    label="Bay Size 2"
                    />
                  </div>
                  <!-- COLUMNS SPACING 1 -->
                  <div class="mt-2">
                    <CFormInput 
                    type="number" 
                    class="no-spinner"
                    @wheel.prevent
                    @touchstart.prevent
                    @touchmove.prevent
                    placeholder="Columns Spacing 1" 
                    label="Columns Spacing 1"
                    />
                  </div>
                  <!-- COLUMNS SPACING 2 -->
                  <div class="mt-2">
                    <CFormInput 
                    type="number" 
                    class="no-spinner"
                    @wheel.prevent
                    @touchstart.prevent
                    @touchmove.prevent
                    placeholder="Columns Spacing 2" 
                    label="Columns Spacing 2"
                    />
                  </div>
                </CCol>
                <CCol :md="3">
                  <!--  MIN. LEASE (SF/Mo) -->
                  <div class="mt-2">
                    <CFormInput 
                    type="number" 
                    class="no-spinner"
                    @wheel.prevent
                    @touchstart.prevent
                    @touchmove.prevent
                    placeholder="Min Lease (SF/Mo)" 
                    label="Min Lease (SF/Mo)"
                    />
                  </div>
                  <!--  MAX. LEASE (SF/ Mo) -->
                  <div class="mt-2">
                    <CFormInput 
                    type="number" 
                    class="no-spinner"
                    @wheel.prevent
                    @touchstart.prevent
                    @touchmove.prevent
                    placeholder="Max. Lease (SF/Mo)" 
                    label="Max. Lease (SF/Mo)"
                    />
                  </div>
                  <!-- KNOCKOUTS DOCKS -->
                  <div class="mt-2">
                    <CFormInput 
                    type="number" 
                    class="no-spinner"
                    @wheel.prevent
                    @touchstart.prevent
                    @touchmove.prevent
                    placeholder="Knockouts Docks" 
                    label="Knockouts Docks"
                    />
                  </div>
                  <!-- PARKING SPACE -->
                  <div class="mt-2">
                    <CFormInput 
                    type="number" 
                    class="no-spinner"
                    @wheel.prevent
                    @touchstart.prevent
                    @touchmove.prevent
                    placeholder="parking Space" 
                    label="parking Space"
                    />
                  </div>
                  <!-- AVAILABLE MONTH -->
                  <div class="mt-2">
                    <CDatePicker label="Available Month" locale="en-US" selectionType="month" />
                  </div>
                  <!-- AVAILABLE YEAR -->
                  <div class="mt-2">
                    <CDatePicker label="Available Year" locale="en-US" selectionType="year" />
                  </div>          
                </CCol>
                <CCol :md="3">
                  <!-- FLOOR THICKNESS -->
                  <div class="mt-2">
                    <CFormInput 
                    type="number" 
                    class="no-spinner"
                    @wheel.prevent
                    @touchstart.prevent
                    @touchmove.prevent
                    placeholder="Floor Thickness" 
                    label="Floor Thickness"
                    />
                  </div>
                  <!-- FLOOR RESISTANCE -->
                  <div class="mt-2">
                    <CFormInput 
                    type="number" 
                    class="no-spinner"
                    @wheel.prevent
                    @touchstart.prevent
                    @touchmove.prevent
                    placeholder="Floor Resistance" 
                    label="Floor Resistance"
                    />
                  </div>
                  <!-- OFFICCES SPACE (SF) -->
                  <div class="mt-2">
                    <CFormInput 
                      type="number" 
                      class="no-spinner"
                      @wheel.prevent
                      @touchstart.prevent
                      @touchmove.prevent
                      placeholder="Offices (SF)" 
                      label="Offices (SF)"
                      />
                  </div>
                  <!-- CROSSDOCK -->
                  <div class="mt-2 d-flex" style="justify-content: space-between;">
                    <div style="width: 5.3rem;">
                      <label>Crossdock</label>
                    </div>
                    <CFormCheck type="radio" name="flexRadioDefault" id="flexRadioDefault1" label="Yes"/>
                    <CFormCheck type="radio" name="flexRadioDefault" id="flexRadioDefault2" label="No" checked/>
                  </div>
                  <!-- SHARED TRUCK -->
                  <div class="mt-2 d-flex" style="justify-content: space-between;">
                    <div style="width: 5.3rem;">
                      <label>Shared Truck</label>
                    </div>
                    <CFormCheck type="radio" name="flexRadioDefault" id="flexRadioDefault1" label="Yes"/>
                    <CFormCheck type="radio" name="flexRadioDefault" id="flexRadioDefault2" label="No" checked/>
                  </div>
                </CCol>
              <!-- </CRow>
            </CCardBody>
          </CCard> -->
        </CRow>

        <CRow v-else-if="selectedBuildingState == 2">
          <!-- *** ABSORPTION *** -->
          <CCard class="card text-secondary mb-3 mt-4 border-secondary card-header-customer-buildings " >
            <CCardBody class="card-body-customer-buildings">
              ABSORPTION
            </CCardBody>
          </CCard>
          <!-- <CCard class="card-customer-buildings">
            <CCardBody>
              <CRow> -->
                <CCol :md="3">
                  <!-- TENANT -->
                  <div  class="mt-2">
                    <CMultiSelect
                      label="Tenant"
                      :multiple="false"
                      :options="BuildingState"
                      optionsStyle="text"
                    >
                    </CMultiSelect>
                  </div>
                  <!-- INDUSTRY -->
                  <div  class="mt-2">
                    <CMultiSelect
                      label="Industry"
                      :multiple="false"
                      :options="BuildingState"
                      optionsStyle="text"
                    >
                    </CMultiSelect>
                  </div>
                  <!-- FINAL USE -->
                  <div  class="mt-2">
                    <CMultiSelect
                      label="Final Use"
                      :multiple="false"
                      :options="BuildingState"
                      optionsStyle="text"
                    >
                    </CMultiSelect>
                  </div>
                  <!-- NEW CONSTRUCTION -->
                  <div class="mt-3 d-flex" style="justify-content: space-between;">
                    <div style="width: 8.765rem;">
                      <label>New Construction</label>
                    </div>
                    <CFormCheck type="radio" name="flexRadioDefault" id="flexRadioDefault1" label="Yes"/>
                    <CFormCheck type="radio" name="flexRadioDefault" id="flexRadioDefault2" label="No" checked/>
                  </div>
                  <!-- STARTING CONSTRUCTION -->
                  <div class="mt-1 d-flex" style="justify-content: space-between;">
                    <div style="width: 8.765rem;">
                      <label>Starting Construction</label>
                    </div>
                    <CFormCheck type="radio" name="flexRadioDefault" id="flexRadioDefault1" label="Yes"/>
                    <CFormCheck type="radio" name="flexRadioDefault" id="flexRadioDefault2" label="No" checked/>
                  </div>
                </CCol>
                <CCol :md="3">
                  <!-- LEASE TERM MONTH -->
                  <div class="mt-2">
                    <CFormInput
                    type="number"
                    class="no-spinner"
                    @wheel.prevent
                    @touchstart.prevent
                    @touchmove.prevent
                    placeholder="Lease Term Month"
                    label="Lease Term Month"
                    />
                  </div>
                  <!-- ASKING RATE SHELL -->
                  <div class="mt-2">
                    <CFormInput
                    type="number"
                    class="no-spinner"
                    @wheel.prevent
                    @touchstart.prevent
                    @touchmove.prevent
                    placeholder="Asking Rate Shell"
                    label="Asking Rate Shell"
                    />
                  </div>
                  <!-- KVAS -->
                  <div class="mt-2">
                    <CFormInput
                    type="text"
                    class="no-spinner"
                    placeholder="KVAS"
                    label="KVAS"
                    />
                  </div>
                </CCol>
                <CCol :md="3">
                  <!-- CLOSING RATE -->
                  <div class="mt-2">
                    <CFormInput
                    type="number"
                    class="no-spinner"
                    @wheel.prevent
                    @touchstart.prevent
                    @touchmove.prevent
                    placeholder="Closing Rate"
                    label="Closing Rate"
                    />
                  </div>
                  <!-- CLOSING QUARTER -->
                  <div class="mt-2">
                    <CFormInput
                    type="text"
                    class="no-spinner"
                    placeholder="Closing Quarter"
                    label="Closing Quarter"
                    />
                  </div>
                  <!-- SHELTER -->
                  <div  class="mt-2">
                    <CMultiSelect
                      label="Shelter"
                      :multiple="false"
                      :options="BuildingState"
                      optionsStyle="text"
                    >
                    </CMultiSelect>
                  </div>
                </CCol>
                <CCol :md="3">
                  <!-- COMPANY TYPE -->
                  <div  class="mt-2">
                    <CMultiSelect
                      label="Copany Type"
                      :multiple="false"
                      :options="BuildingState"
                      optionsStyle="text"
                    >
                    </CMultiSelect>
                  </div>
                  <!-- LEASE UP -->
                  <div class="mt-2">
                    <CFormInput
                    type="text"
                    class="no-spinner"
                    placeholder="Lease Up"
                    label="Lease Up"
                    />
                  </div>
                  <!-- MONTH -->
                  <div class="mt-2">
                    <CDatePicker label="Month" locale="en-US" selectionType="month" />
                  </div>
                </CCol>
              <!-- </CRow>
            </CCardBody>
          </CCard> -->
        </CRow>
    </CRow>
  </CContainer>
</template>