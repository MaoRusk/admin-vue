<script setup>
import { computed, onMounted, ref, watch, nextTick } from 'vue';
import Swal from 'sweetalert2';
import { cilX, cilPlus } from '@coreui/icons'
import axios from 'axios';
import { useRouter, useRoute } from 'vue-router'
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
const crane_input = ref('true');
const hvac_input = ref('true');
const railSpur_input = ref('true');
const sprinklers_input = ref('true');
const office_input = ref('true');
const leed_input = ref('true');
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
const availableSf_input = ref(null);
const minimumSpaceSf_input = ref(null);
const expansionUpToSf_input = ref(null);
const dockDoors_input = ref(null);
const driveInDoor_input = ref(null);
const floorThickness_input = ref(null);
const floorResistance_input = ref(null);
const truckCourt_input = ref(null);
const crossdock_input = ref(null);
const sharedTruck_input = ref(null);
const buildingDimensions1_input = ref(null);
const buildingDimensions2_input = ref(null);
const baySize1_input = ref(null);
const baySize2_input = ref(null);
const columnsSpacing1_input = ref(null);
const columnsSpacing2_input = ref(null);
const knockoutsDocks_input = ref(null);
const parkingSpace_input = ref(null);
const availableMonth_input = ref();
const availableYear_input = ref(null);
const minLease_input = ref(null);
const maxLease_input = ref(null);

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

  const handleFinalUse = (newValue) => {
    inputValue.value = newValue;
    finalUseId_input.value = inputValue.value.map(item => item.value).join(',');
  };
  const handleIndustry = (newValue) => {
    inputValue.value = newValue;
    industryId_input.value = inputValue.value.map(item => item.value).join(',');
  };
  const handleTenant = (newValue) => {
    inputValue.value = newValue;
    tenantId_input.value = inputValue.value.map(item => item.value).join(',');
  };
  const handleStatusSelect = (newValue) => {
    inputValue.value = newValue;
    statusId_input.value = inputValue.value.map(item => item.value).join(',');
  };
  const handleIndustrialParkSelect = (newValue) => {
    inputValue.value = newValue;
    industrialParkId_input.value = inputValue.value.map(item => item.value).join(',');
  };
  const handleMarket = (newValue) => {
    inputValue.value = newValue;
    marketId_input.value = inputValue.value.map(item => item.value).join(',');
  };
  const handleSubMarket = (newValue) => {
    inputValue.value = newValue;
    subMarketId_input.value = inputValue.value.map(item => item.value).join(',');
  };
  const handleTypeSelect = (newValue) => {
    inputValue.value = newValue;
    typeId_input.value = inputValue.value.map(item => item.value).join(',');
  };
  const handleOwnerSelect = (newValue) => {
    inputValue.value = newValue;
    ownerId_input.value = inputValue.value.map(item => item.value).join(',');
  };
  const handleDeveloperSelect = (newValue) => {
    inputValue.value = newValue;
    developerId_input.value = inputValue.value.map(item => item.value).join(',');
  };
  const handleBuilderSelect = (newValue) => {
    inputValue.value = newValue;
    builderId_input.value = inputValue.value.map(item => item.value).join(',');
  };
  const handleListingBroker = (newValue) => {
    inputValue.value = newValue;
    builderId_input.value = inputValue.value.map(item => item.value).join(',');
  };
  const handleCurrency = (newValue) => {
    inputValue.value = newValue;
    currencyId_input.value = inputValue.value.map(item => item.value).join(',');
  };
  const handleTenancy = (newValue) => {
    inputValue.value = newValue;
    tenancyId_input.value = inputValue.value.map(item => item.value).join(',');
  };
  const handleDeal = (newValue) => {
    inputValue.value = newValue;
    dealId_input.value = inputValue.value.map(item => item.value).join(',');
  };
  const handleRegionSelect = (newValue) => {
    inputValue.value = newValue;
    regionId_input.value = inputValue.value.map(item => item.value).join(',');
  };
  const handleLoadingDoorSelect = (newValue) => {
    inputValue.value = newValue;
    loadingDoorId_input.value = inputValue.value.map(item => item.value).join(',');
  };
  const handleBuildingState = (newValue) => {
    selectedBuildingState.value = newValue;
    builderStateId_input.value = newValue?.value ?? null;
    
    nextTick(() => {
      if (newValue?.value === 1) {
        leaseTermMonth_input.value = null;
        askingRateShell_input.value = null;
      } else if (newValue?.value === 2) {
        availableSf_input.value = null;
        minimumSpaceSf_input.value = null;
      }
    });
  };
  const handleBuildingClass = (newValue) => {
      inputValue.value = newValue;
      classId_input.value = inputValue.value.map(item => item.value).join(',');    
  }
  // Validaciones RADIO
  const updateStatus = (newStatus) => {
    status.value = newStatus;
  };
   const updateOfficeBool = (newStatus) => {
    office_input.value = newStatus;
  };
  const updateSPRINKLERSBool = (newStatus) => {
    sprinklers_input.value = newStatus;
  };
  const updateCRANEBool = (newStatus) => {
    crane_input.value = newStatus;
  }
  const updateHVACBool = (newStatus) => {
    hvac_input.value = newStatus;
  }
  const updateLEEDBool = (newStatus) => {
    leed_input.value = newStatus;
  }
  const updateRailSpurBool = (newStatus) => {
    railSpur_input.value = newStatus;
  }

  const route = useRoute();

  // Function to fetch building data
  const fetchBuildingData = async () => {
    try {
      const buildingId = route.params.id;
      // const response = await axios.get(`https://laravel-back-production-9320.up.railway.app/api/buildings/${buildingId}`);
      const response = await axios.get(`http://127.0.0.1:8000/api/buildings/${buildingId}`);
      
      const { buildingData } = response.data;
      console.log('Building Data:', buildingData);

      if (!buildingData) {
        throw new Error('Building data not found in response');
      }

      // Actualizar el BuildingState selector
      const buildingStateOption = BuildingState.find(item => item.value === buildingData.builderStateId);
      if (buildingStateOption) {
        selectedBuildingState.value = buildingStateOption;
        builderStateId_input.value = buildingStateOption.value;
      }

      // Resto de las asignaciones...
      buildingName_input.value = buildingData.buildingName;

      classId_input.value = buildingData.classId;
      buildingSizeSf_input.value = buildingData.buildingSizeSf;
      expansionLand_input.value = buildingData.expansionLand;
      statusId_input.value = buildingData.statusId;
      industrialParkId_input.value = buildingData.industrialParkId;
      typeId_input.value = buildingData.typeId;
      ownerId_input.value = buildingData.ownerId;
      developerId_input.value = buildingData.developerId;
      builderId_input.value = buildingData.builderId;
      regionId_input.value = buildingData.regionId;
      marketId_input.value = buildingData.marketId;
      subMarketId_input.value = buildingData.subMarketId;
      dealId_input.value = buildingData.dealId;
      currencyId_input.value = buildingData.currencyId;
      salePriceUsd_input.value = buildingData.salePriceUsd;
      tenancyId_input.value = buildingData.tenancyId;
      latitud_input.value = buildingData.latitud;
      longitud_input.value = buildingData.longitud;
      yearBuilt_input.value = buildingData.yearBuilt;
      clearHeight_input.value = buildingData.clearHeight;
      officesSpace_input.value = buildingData.officesSpace;
      
      // Valores booleanos
      crane_input.value = buildingData.crane.toString();
      hvac_input.value = buildingData.hvac.toString();
      railSpur_input.value = buildingData.railSpur.toString();
      sprinklers_input.value = buildingData.sprinklers.toString();
      office_input.value = buildingData.office.toString();
      leed_input.value = buildingData.leed.toString();
      
      // Resto de campos
      totalLand_input.value = buildingData.totalLand;
      hvacProductionArea_input.value = buildingData.hvacProductionArea;
      loadingDoorId_input.value = buildingData.loadingDoorId;
      lighting_input.value = buildingData.lighting;
      ventilation_input.value = buildingData.ventilation;
      transformerCapacity_input.value = buildingData.transformerCapacity;
      constructionType_input.value = buildingData.constructionType;
      constructionState_input.value = buildingData.constructionState;
      roofSystem_input.value = buildingData.roofSystem;
      fireProtectionSystem_input.value = buildingData.fireProtectionSystem;
      skylightsSf_input.value = buildingData.skylightsSf;
      coverage_input.value = buildingData.coverage;

      // Datos de disponibilidad (si builderStateId es 1)
      if (buildingData.builderStateId === 1) {
        availableSf_input.value = buildingData.availableSf;
        minimumSpaceSf_input.value = buildingData.minimumSpaceSf;
        expansionUpToSf_input.value = buildingData.expansionUpToSf;
        dockDoors_input.value = buildingData.dockDoors;
        driveInDoor_input.value = buildingData.driveInDoor;
        floorThickness_input.value = buildingData.floorThickness;
        floorResistance_input.value = buildingData.floorResistance;
        truckCourt_input.value = buildingData.truckCourt;
        crossdock_input.value = buildingData.crossdock;
        sharedTruck_input.value = buildingData.sharedTruck;
        buildingDimensions1_input.value = buildingData.buildingDimensions1;
        buildingDimensions2_input.value = buildingData.buildingDimensions2;
        baySize1_input.value = buildingData.baySize1;
        baySize2_input.value = buildingData.baySize2;
        columnsSpacing1_input.value = buildingData.columnsSpacing1;
        columnsSpacing2_input.value = buildingData.columnsSpacing2;
        knockoutsDocks_input.value = buildingData.knockoutsDocks;
        parkingSpace_input.value = buildingData.parkingSpace;
        
        if (buildingData.availableMonth) {
          availableMonth_input.value = new Date(buildingData.availableMonth);
        }
        availableYear_input.value = buildingData.availableYear;
        minLease_input.value = buildingData.minLease;
        maxLease_input.value = buildingData.maxLease;
      }

    } catch (error) {
      console.error('Error fetching building data:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load building data: ' + error.message,
      });
    }
  };

  onMounted(async () => {
    await fetchData();
    await fetchBuildingData();
  });

  const fetchData = async () => {
    try {
      const [ marketsResponse, submarketResponse] = await Promise.all([
        // axios.get('https://laravel-back-production-9320.up.railway.app/api/market'),
        // axios.get('https://laravel-back-production-9320.up.railway.app/api/submarket'),
        axios.get('http://127.0.0.1:8000/api/market'),
        axios.get('http://127.0.0.1:8000/api/submarket'),
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

  const getFormData = () => {
    return {
      builderStateId: builderStateId_input.value,
      buildingName: buildingName_input.value,
      classId: classId_input.value,
      buildingSizeSf: buildingSizeSf_input.value,
      expansionLand: expansionLand_input.value,
      statusId: statusId_input.value,
      industrialParkId: industrialParkId_input.value,
      typeId: typeId_input.value,
      ownerId: ownerId_input.value,
      developerId: developerId_input.value,
      builderId: builderId_input.value,
      regionId: regionId_input.value,
      marketId: marketId_input.value,
      subMarketId: subMarketId_input.value,
      dealId: dealId_input.value,
      currencyId: currencyId_input.value,
      salePriceUsd: salePriceUsd_input.value,
      tenancyId: tenancyId_input.value,
      latitud: latitud_input.value,
      longitud: longitud_input.value,
      yearBuilt: yearBuilt_input.value,
      clearHeight: clearHeight_input.value,
      officesSpace: officesSpace_input.value,
      crane: crane_input.value,
      hvac: hvac_input.value,
      railSpur: railSpur_input.value,
      sprinklers: sprinklers_input.value,
      office: office_input.value,
      leed: leed_input.value,
      totalLand: totalLand_input.value,
      hvacProductionArea: hvacProductionArea_input.value,
      status: status.value,
      loadingDoorId: loadingDoorId_input.value,
      lighting: lighting_input.value,
      ventilation: ventilation_input.value,
      transformerCapacity: transformerCapacity_input.value,
      constructionType: constructionType_input.value,
      constructionState: constructionState_input.value,
      roofSystem: roofSystem_input.value,
      fireProtectionSystem: fireProtectionSystem_input.value,
      skylightsSf: skylightsSf_input.value,
      coverage: coverage_input.value,
      availableSf:  availableSf_input.value,
      minimumSpaceSf:  minimumSpaceSf_input.value,
      expansionUpToSf:  expansionUpToSf_input.value,
      dockDoors:  dockDoors_input.value,
      driveInDoor:  driveInDoor_input.value,
      floorThickness:  floorThickness_input.value,
      floorResistance:  floorResistance_input.value,
      truckCourt:  truckCourt_input.value,
      crossdock:  crossdock_input.value,
      sharedTruck:  sharedTruck_input.value,
      buildingDimensions1:  buildingDimensions1_input.value,
      buildingDimensions2:  buildingDimensions2_input.value,
      baySize1:  baySize1_input.value,
      baySize2:  baySize2_input.value,
      columnsSpacing1:  columnsSpacing1_input.value,
      columnsSpacing2:  columnsSpacing2_input.value,
      knockoutsDocks:  knockoutsDocks_input.value,
      parkingSpace:  parkingSpace_input.value,
      availableMonth:  availableMonth_input.value,
      availableYear:  availableYear_input.value,
      minLease:  minLease_input.value,
      maxLease:  maxLease_input.value,
      leaseTermMonth: leaseTermMonth_input.value,
      askingRateShell: askingRateShell_input.value,
      closingRate: closingRate_input.value,
      KVAS: KVAS_input.value,
      closingQuarter: closingQuarter_input.value,
      leaseUp: leaseUp_input.value,
      month: month_input.value,
      newConstruction: newConstruction_input.value,
      startingConstruction: startingConstruction_input.value,
      tenantId: tenantId_input.value,
      industryId: industryId_input.value,
      finalUseId: finalUseId_input.value,
      shelterId: shelterId_input.value,
      copanyTypeId: copanyTypeId_input.value,
    };
  };

defineExpose({
  getFormData
});

// Asegurarse de que builderStateId_input sea reactivo
watch(builderStateId_input, (newValue) => {
  console.log('builderStateId_input changed:', newValue);
});

</script>

<template>
  <!-- <CContainer> -->
    <CRow>
      <CCol :md="9">
        <CRow>
          <!-- *** GENERAL INFORMATION *** -->
          <CCard id="general-information" class="card text-secondary mb-3 border-secondary card-header-customer-buildings " >
            <CCardBody class="card-body-customer-buildings">
              General Information
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
                      v-model="selectedBuildingState"
                      @change="handleBuildingState"
                      optionsStyle="text"
                      size="sm"
                      placeholder=""
                    >
                    </CMultiSelect>
                  </div>
                  <!-- BUILDING NAME (SF) -->
                  <div class="mt-2">
                    <CFormInput
                    type="text"
                    size="sm"
                    v-model="buildingName_input"
                    class="no-spinner"
                    label="Building Name"
                    />
                  </div>
                  
                </CCol>
                <CCol :md="3">
                  <!-- CLASS -->
                  <div  class="mt-2">
                    <CMultiSelect
                      label="Class"
                      :multiple="false"
                      :options="Class"
                      @change="handleBuildingClass"
                      optionsStyle="text"
                      size="sm"
                      placeholder=""
                    >
                    </CMultiSelect>
                  </div>
                  <!-- BUILDING SIZE (SF) -->
                  <div class="mt-2">
                    <CFormInput 
                    type="number" 
                    size="sm"
                    class="no-spinner"
                    v-model="buildingSizeSf_input"
                    @wheel.prevent
                    @touchstart.prevent
                    @touchmove.prevent
                    label="Building Size (SF)"
                    />
                  </div>
                </CCol>
                <CCol :md="3">
                  <!-- EXPANSION LAND -->
                  <div class="mt-2">
                    <CFormInput 
                    type="number" 
                    size="sm"
                    class="no-spinner"
                    v-model="expansionLand_input"
                    @wheel.prevent
                    @touchstart.prevent
                    @touchmove.prevent
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
                      size="sm"
                      placeholder=""
                      @change="handleStatusSelect"
                    >
                      <template #options="{ option }" >
                        <div class="d-flex">
                          <CIcon v-if="option.value == 0" class="me-1 mt-1" :icon="cilPlus" size="sm"/> {{option.label}}
                        </div>
                      </template>
                    </CMultiSelect>
                    <CInputGroup v-if="selectedStatus == '0'" class="mb-3 mt-2">
                      <CFormInput aria-label="New status.." aria-describedby="button-addon2"/>
                      <CButton type="button" color="success" variant="outline" id="button-addon2">Save</CButton>
                    </CInputGroup>
                  </div>
                </CCol>
                <CCol :md="3">
                  <!-- YEAR BUILT -->
                  <div class="mt-2">
                    <CDatePicker label="Year Built" v-model:date="yearBuilt_input" locale="en-US" size="sm" selectionType="year" placeholder=""/>
                  </div>
                  <!-- ! ****AGREGAR a tabla AVAILABLE SINCE (Available from) -->
                  <div class="mt-2">
                    <CDatePicker label="Available Since" locale="en-US" size="sm" selectionType="month" placeholder=""/>
                  </div>
                </CCol>
                <CCol :md="12">
                  <!-- STATUS (ACTIVO/INACTIVO) -->
                  <div style="display: flex; justify-content: left; align-items: center;margin-top: .5rem;">
                    <label for="status">Status</label>
                    <div style="margin-left: .6rem; padding-top: .5rem;">
                      <CFormCheck 
                        inline 
                        type="radio" 
                        name="inlineRadioOptions" 
                        id="inlineCheckbox1" 
                        value="Activo" 
                        label="Active"
                        :checked="status === 'Activo'"
                        @change="updateStatus('Activo')"                  />
                      <CFormCheck 
                        inline 
                        type="radio" 
                        name="inlineRadioOptions" 
                        id="inlineCheckbox2" 
                        value="Inactivo" 
                        label="Inactive"
                        :checked="status === 'Inactivo'"
                        @change="updateStatus('Inactivo')"                  />    
                    </div>
                  </div>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
          
          <!-- *** LOCATION *** -->
          <CCard id="location" class="card text-secondary mb-3 mt-4 border-secondary card-header-customer-buildings " >
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
                size="sm"
                placeholder=""
                @change="handleRegionSelect"
              >
                <template #options="{ option }" >
                  <div class="d-flex">
                    <CIcon v-if="option.value == 0" class="me-1 mt-1" :icon="cilPlus" size="sm"/> {{option.label}}
                  </div>
                </template>
              </CMultiSelect>
              <CInputGroup v-if="SelectedRegion == '0'" class="mb-3 mt-2">
                <CFormInput aria-label="New Region.." aria-describedby="button-addon2"/>
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
                size="sm"
                placeholder=""
                @change="handleIndustrialParkSelect"
              >
                <template #options="{ option }" >
                  <div class="d-flex">
                    <CIcon v-if="option.value == 0" class="me-1 mt-1" :icon="cilPlus" size="sm"/> {{option.label}}
                  </div>
                </template>
              </CMultiSelect>
              <CInputGroup v-if="SelectedIndustrialPark == '0'" class="mb-3 mt-2">
                <CFormInput aria-label="New Industrial Park.." aria-describedby="button-addon2"/>
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
                size="sm"
                placeholder=""
                @change="handleMarket"
              >
                <template #options="{ option }" >
                  <div class="d-flex">
                    <CIcon v-if="option.value == 0" class="me-1 mt-1" :icon="cilPlus" size="sm"/> {{option.label}}
                  </div>
                </template>
              </CMultiSelect>
              <CInputGroup v-if="SelectedRegion == '0'" class="mb-3 mt-2">
                <CFormInput aria-label="New Market.." aria-describedby="button-addon2"/>
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
                size="sm"
                placeholder=""
                @change="handleSubMarket"
              >
                <template #options="{ option }" >
                  <div class="d-flex">
                    <CIcon v-if="option.value == 0" class="me-1 mt-1" :icon="cilPlus" size="sm"/> {{option.label}}
                  </div>
                </template>
              </CMultiSelect>
              <CInputGroup v-if="SelectedRegion == '0'" class="mb-3 mt-2">
                <CFormInput aria-label="New Submarket.." aria-describedby="button-addon2"/>
                <CButton type="button" color="success" variant="outline" id="button-addon2">Save</CButton>
              </CInputGroup>
            </div>
          </CCol>
          <CCol :md="4">    
            <!-- LATITUD -->
            <div class="mt-2">
              <CFormInput
              type="text"
              size="sm"
              label="Latitude"
              v-model="latitud_input"
              />
            </div>
            <!-- ALTITUD -->
            <div class="mt-2">
              <CFormInput
              type="text"
              size="sm"
              label="Longitude"
              v-model="longitud_input"
              />
            </div>
          </CCol>
          
          <!-- *** PROPERTY DETAILS *** -->
          <CCard id="property-details" class="card text-secondary mb-3 mt-4 border-secondary card-header-customer-buildings " >
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
                      size="sm"
                      placeholder=""
                      @change="handleOwnerSelect"
                    >
                      <template #options="{ option }" >
                        <div class="d-flex">
                          <CIcon v-if="option.value == 0" class="me-1 mt-1" :icon="cilPlus" size="sm"/> {{option.label}}
                        </div>
                      </template>
                    </CMultiSelect>
                    <CInputGroup v-if="SelectedOwner == '0'" class="mb-3 mt-2">
                      <CFormInput aria-label="New Owner.." aria-describedby="button-addon2"/>
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
                      size="sm"
                      placeholder=""
                      @change="handleDeveloperSelect"
                    >
                      <template #options="{ option }" >
                        <div class="d-flex">
                          <CIcon v-if="option.value == 0" class="me-1 mt-1" :icon="cilPlus" size="sm"/> {{option.label}}
                        </div>
                      </template>
                    </CMultiSelect>
                    <CInputGroup v-if="SelectedDeveloper == '0'" class="mb-3 mt-2">
                      <CFormInput aria-label="New Developer.." aria-describedby="button-addon2"/>
                      <CButton type="button" color="success" variant="outline" id="button-addon2">Save</CButton>
                    </CInputGroup>
                  </div>
                </CCol>
                <CCol :md="3">    
                  <!-- BUILDER -->
                  <div class="mt-2">
                    <CMultiSelect
                      label="Builder"
                      v-model="SelectedBuilder"
                      :multiple="false"
                      :options="Developer"
                      optionsStyle="text"
                      size="sm"
                      placeholder=""
                      @change="handleBuilderSelect"
                    >
                      <template #options="{ option }" >
                        <div class="d-flex">
                          <CIcon v-if="option.value == 0" class="me-1 mt-1" :icon="cilPlus" size="sm"/> {{option.label}}
                        </div>
                      </template>
                    </CMultiSelect>
                    <CInputGroup v-if="SelectedBuilder == '0'" class="mb-3 mt-2">
                      <CFormInput aria-label="New Builder.." aria-describedby="button-addon2"/>
                      <CButton type="button" color="success" variant="outline" id="button-addon2">Save</CButton>
                    </CInputGroup>
                  </div>
                </CCol>
                <CCol :md="3">    
                  <!-- ! **** VERIFICAR QUE ESTE MAPPEADO EN EL SERVICIO **** LISTING BROKER -->
                  <div class="mt-2">
                    <CMultiSelect
                      label="Listing Broker"
                      :multiple="false"
                      :options="ListingBroker"
                      optionsStyle="text"
                      size="sm"
                      placeholder=""
                      @change="handleListingBroker"
                    >
                    </CMultiSelect>
                  </div>       
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
  
          <!-- *** TRANSACTIONS AND AGREEMENTS *** -->
          <CCard id="transactions-agreements" class="card text-secondary mb-3 mt-4 border-secondary card-header-customer-buildings " >
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
                    size="sm"
                    class="no-spinner"
                    v-model="salePriceUsd_input"
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
                size="sm"
                @change="handleCurrency"
                placeholder=""
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
                size="sm"
                @change="handleTenancy"
                placeholder=""
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
                size="sm"
                @change="handleDeal"
                placeholder=""
              >
            </CMultiSelect>
            </div>
          </CCol>
             
          <!-- *** TECHNICAL SPECIFICATIONS *** -->
          <CCard id="technical-specifications" class="card text-secondary mb-3 mt-4 border-secondary card-header-customer-buildings " >
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
                        size="sm"
                        placeholder=""
                        @change="handleTypeSelect"
                      >
                        <template #options="{ option }" >
                          <div class="d-flex">
                            <CIcon v-if="option.value == 0" class="me-1 mt-1" :icon="cilPlus" size="sm"/> {{option.label}}
                          </div>
                        </template>
                      </CMultiSelect>
                      <CInputGroup v-if="SelectedType == '0'" class="mb-3 mt-2">
                        <CFormInput aria-label="New Type.." aria-describedby="button-addon2"/>
                        <CButton type="button" color="success" variant="outline" id="button-addon2">Save</CButton>
                      </CInputGroup>
                  </div>
                  <!-- TOTAL LAND -->
                  <div class="mt-2">
                    <CFormInput 
                    type="number" 
                    size="sm"
                    class="no-spinner"
                    v-model="totalLand_input"
                    @wheel.prevent
                    @touchstart.prevent
                    @touchmove.prevent
                    label="Total Land"
                    />
                  </div>
                  <!-- CLEAR HEIGHT -->
                  <div class="mt-2">
                    <CFormInput 
                    type="number" 
                    size="sm"
                    class="no-spinner"
                    v-model="clearHeight_input"
                    @wheel.prevent
                    @touchstart.prevent
                    @touchmove.prevent
                    label="Clear Height"
                    />
                  </div>
                  <!-- CONSTRUCTION TYPE -->
                  <div class="mt-2">
                      <CFormInput
                      type="text"
                      size="sm"
                      v-model="constructionType_input"
                      label="Construction Type"
                      />
                  </div>
                  <!-- CONSTRUCTION STATE -->
                  <div class="mt-2">
                      <CFormInput
                      type="text"
                      size="sm"
                      v-model="constructionState_input"
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
                      size="sm"
                      placeholder=""
                      @change="handleLoadingDoorSelect"
                      >
                      <template #options="{ option }" >
                          <div class="d-flex">
                          <CIcon v-if="option == 0" class="me-1 mt-1" :icon="cilPlus" size="sm"/> {{option.label}}
                          </div>
                      </template>
                      </CMultiSelect>
                      <CInputGroup v-if="SelectedLoadingDoor == '0'" class="mb-3 mt-2">
                      <CFormInput aria-label="New Loading Door.." aria-describedby="button-addon2"/>
                      <CButton type="button" color="success" variant="outline" id="button-addon2">Save</CButton>
                      </CInputGroup>
                  </div>  
                  <!-- OFFICE -->
                  <div class="mt-2 d-flex" style="justify-content: space-between;">
                    <div style="width: 5.3rem;">
                      <label>OFFICE</label>
                    </div>
                    <CFormCheck 
                    type="radio" 
                    name="RadioOFFICE" 
                    id="RadioOFFICE_1" 
                    value="true" 
                    label="Yes" 
                    :checked="office_input == 'true'"
                    @change="updateOfficeBool('true')"/>
                    <CFormCheck 
                    type="radio" 
                    name="RadioOFFICE" 
                    id="RadioOFFICE_2" 
                    value="false" 
                    label="No" 
                    :checked="office_input == 'false'"
                    @change="updateOfficeBool('false')"      
                    />
                  </div>
                  <!-- SPRINKLERS -->
                  <div class="mt-2 d-flex" style="justify-content: space-between;">
                    <div style="width: 5.3rem;">
                      <label>SPRINKLERS</label>
                    </div>
                    <CFormCheck 
                    type="radio" 
                    name="RadioSPRINKLERS" 
                    id="RadioSPRINKLERS1" 
                    value="true" 
                    label="Yes"  
                    :checked="sprinklers_input == 'true'"
                    @change="updateSPRINKLERSBool('true')"     
                    />
                    <CFormCheck 
                    type="radio" 
                    name="RadioSPRINKLERS" 
                    id="RadioSPRINKLERS2" 
                    value="false" 
                    label="No" 
                    :checked="sprinklers_input == 'false'"
                    @change="updateSPRINKLERSBool('false')"      
                    />
                  </div>
                  <!-- CRANE -->
                  <div class="mt-2 d-flex" style="justify-content: space-between;">
                    <div style="width: 5.3rem;">
                      <label>CRANE</label>
                    </div>
                    <CFormCheck 
                    type="radio" 
                    name="RadioCRANE" 
                    id="RadioCRANE1" 
                    value="true" 
                    label="Yes"  
                    :checked="crane_input == 'true'"
                    @change="updateCRANEBool('true')"  
                    />
                    <CFormCheck 
                    type="radio" 
                    name="RadioCRANE" 
                    id="RadioCRANE2" 
                    value="false" 
                    label="No" 
                    :checked="crane_input == 'false'"
                    @change="updateCRANEBool('false')"
                    />
                  </div>
                  <!-- HVAC -->
                  <div class="mt-2 d-flex" style="justify-content: space-between;">
                    <div style="width: 5.3rem;">
                      <label>HVAC</label>
                    </div>
                    <CFormCheck 
                    type="radio" 
                    name="RadioHVAC" 
                    id="RadioHVAC1" 
                    value="true" 
                    label="Yes" 
                    :checked="hvac_input == 'true'"
                    @change="updateHVACBool('true')"
                    />
                    <CFormCheck 
                    type="radio" 
                    name="RadioHVAC" 
                    id="RadioHVAC2" 
                    value="false" 
                    label="No" 
                    :checked="hvac_input == 'false'"
                    @change="updateHVACBool('false')"
                    />
                  </div>
                  <!-- LEED -->
                  <div class="mt-2 d-flex" style="justify-content: space-between;">
                    <div style="width: 5.3rem;">
                      <label>LEED</label>
                    </div>
                    <CFormCheck 
                    type="radio" 
                    name="RadioLEED" 
                    id="RadioLEED1" 
                    value="true" 
                    label="Yes" 
                    :checked="leed_input == 'true'"
                    @change="updateLEEDBool('true')"
                    />
                    <CFormCheck 
                    type="radio" 
                    name="RadioLEED" 
                    id="RadioLEED2" 
                    value="false" 
                    label="No" 
                    :checked="leed_input == 'false'"
                    @change="updateLEEDBool('false')"
                    />
                  </div>
                  <!-- RAIL SPUR -->
                  <div class="mt-2 d-flex" style="justify-content: space-between;">
                    <div style="width: 5.3rem;">
                      <label>RAIL SPUR</label>
                    </div>
                    <CFormCheck 
                    type="radio" 
                    name="RadioRailSpur" 
                    id="RadioRailSpur1" 
                    value="true" 
                    label="Yes" 
                    :checked="railSpur_input == 'true'"
                    @change="updateRailSpurBool('true')"
                    />
                    <CFormCheck 
                    type="radio" 
                    name="RadioRailSpur" 
                    id="RadioRailSpur2" 
                    value="false" 
                    label="No" 
                    :checked="railSpur_input == 'false'"
                    @change="updateRailSpurBool('false')"
                    />
                  </div>
                </CCol>
                <CCol :md="3">
                  <!-- OFFICE SPACE -->
                  <div class="mt-2">
                    <CFormInput 
                    type="number" 
                    size="sm"
                    class="no-spinner"
                    v-model="officesSpace_input"
                    @wheel.prevent
                    @touchstart.prevent
                    @touchmove.prevent
                    label="Office Space"
                    />
                  </div>
                  <!-- HVAC PRODUCTION AREA -->
                  <div style="margin-top: .35rem;">
                    <CFormInput
                    type="text"
                    size="sm"
                    v-model="hvacProductionArea_input"
                    label="HVAC Production Area"
                    />
                  </div>
                  <!-- TRANSFORMER CAPACITY (Electric Substations) -->
                  <div class="mt-2">
                      <CFormInput
                      type="text"
                      size="sm"
                      v-model="transformerCapacity_input"
                      label="Transformer Capacity"
                      />
                  </div>
                  <!-- LIGHTING -->
                  <div class="mt-2">
                      <CFormInput
                      type="text"
                      size="sm"
                      v-model="lighting_input"
                      label="Lighting"
                      />
                  </div>
                </CCol>
                <CCol :md="3">
                  <!-- VENTILATION -->
                  <div class="mt-2">
                      <CFormInput
                      type="text"
                      size="sm"
                      v-model="ventilation_input"
                      label="Ventilation System"
                      />
                  </div>
                  <!-- ROOF SYSTEM (Roofing) -->
                  <div class="mt-2">
                      <CFormInput
                      type="text"
                      size="sm"
                      v-model="roofSystem_input"
                      label="Roof System"
                      />
                  </div>
                  <!-- FIRE PROTECTION SYSTEM (FPS) -->
                  <div class="mt-1">
                      <CFormInput
                      type="text"
                      size="sm"
                      class="no-spinner"
                      v-model="fireProtectionSystem_input"
                      label="Fire Protection System (FPS)"
                      />
                  </div>
                  <!-- SKYLIGHTS (SF) -->
                  <div class="mt-2">
                    <CFormInput 
                    type="number" 
                    size="sm"
                    class="no-spinner"
                    v-model="skylightsSf_input"
                    @wheel.prevent
                    @touchstart.prevent
                    @touchmove.prevent
                    label="Skylight %"
                    />
                  </div>
                  <!-- COVERAGE (FRA%) -->
                  <div class="mt-2">
                      <CFormInput 
                      type="number" 
                      size="sm"
                      class="no-spinner"
                      v-model="coverage_input"
                      @wheel.prevent
                      @touchstart.prevent
                      @touchmove.prevent
                      label="Coverage %"
                      />
                  </div>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
  
          <CRow v-if="builderStateId_input === 1">
            <!-- *** AVAILABILITY *** -->
            <CCard id="availability" class="card text-secondary mb-3 mt-4 border-secondary card-header-customer-buildings " >
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
                      size="sm"
                      class="no-spinner"
                      v-model="availableSf_input"
                      @wheel.prevent
                      @touchstart.prevent
                      @touchmove.prevent
                      label="Available (SF)"
                      />
                    </div>
                    <!-- MINIMUM SPACE (SF) -->
                    <div class="mt-2">
                      <CFormInput 
                      type="number" 
                      size="sm"
                      class="no-spinner"
                      v-model="minimumSpaceSf_input"
                      @wheel.prevent
                      @touchstart.prevent
                      @touchmove.prevent
                      label="Minimum Space (SF)"
                      />
                    </div>
                    <!-- EXPANSION UP TO (SF) -->
                    <div class="mt-2">
                      <CFormInput 
                      type="number" 
                      size="sm"
                      class="no-spinner"
                      v-model="expansionUpToSf_input"
                      @wheel.prevent
                      @touchstart.prevent
                      @touchmove.prevent
                      label="Expansion Up To (SF)"
                      />
                    </div>
                    <!-- DOCK DOORS -->
                    <div class="mt-2">
                      <CFormInput 
                      type="number" 
                      size="sm"
                      class="no-spinner"
                      v-model="dockDoors_input"
                      @wheel.prevent
                      @touchstart.prevent
                      @touchmove.prevent
                      label="Dock Doors"
                      />
                    </div>
                    <!-- DRIVE IN DOOR -->
                    <div class="mt-2">
                      <CFormInput 
                      type="number" 
                      size="sm"
                      class="no-spinner"
                      v-model="driveInDoor_input"
                      @wheel.prevent
                      @touchstart.prevent
                      @touchmove.prevent
                      label="Drive in Door"
                      />
                    </div>
                    <!-- TRUCK COURT -->
                    <div class="mt-2">
                      <CFormInput 
                        type="number" 
                        size="sm"
                        class="no-spinner"
                        v-model="truckCourt_input"
                        @wheel.prevent
                        @touchstart.prevent
                        @touchmove.prevent
                        label="Truck Court"
                        />
                    </div>
                  </CCol>
                  <CCol :md="3">
                    <!-- BUILDING DIMENSION 1 -->
                    <div class="mt-2">
                      <CFormInput 
                      type="number" 
                      size="sm"
                      class="no-spinner"
                      v-model="buildingDimensions1_input"
                      @wheel.prevent
                      @touchstart.prevent
                      @touchmove.prevent
                      label="Building Dimensions 1"
                      />
                    </div>
                    <!-- BUILDING DIMENSION 2 -->
                    <div class="mt-2">
                      <CFormInput 
                      type="number" 
                      size="sm"
                      class="no-spinner"
                      v-model="buildingDimensions2_input"
                      @wheel.prevent
                      @touchstart.prevent
                      @touchmove.prevent
                      label="Building Dimensions 2"
                      />
                    </div>
                    <!-- BAY SIZE 1 -->
                    <div class="mt-2">
                      <CFormInput 
                      type="number" 
                      size="sm"
                      class="no-spinner"
                      v-model="baySize1_input"
                      @wheel.prevent
                      @touchstart.prevent
                      @touchmove.prevent
                      label="Bay Size 1"
                      />
                    </div>
                    <!-- BAY SIZE 2 -->
                    <div class="mt-2">
                      <CFormInput 
                      type="number" 
                      size="sm"
                      class="no-spinner"
                      v-model="baySize2_input"
                      @wheel.prevent
                      @touchstart.prevent
                      @touchmove.prevent
                      label="Bay Size 2"
                      />
                    </div>
                    <!-- COLUMNS SPACING 1 -->
                    <div class="mt-2">
                      <CFormInput 
                      type="number" 
                      size="sm"
                      class="no-spinner"
                      v-model="columnsSpacing1_input"
                      @wheel.prevent
                      @touchstart.prevent
                      @touchmove.prevent
                      label="Columns Spacing 1"
                      />
                    </div>
                    <!-- COLUMNS SPACING 2 -->
                    <div class="mt-2">
                      <CFormInput 
                      type="number" 
                      size="sm"
                      class="no-spinner"
                      v-model="columnsSpacing2_input"
                      @wheel.prevent
                      @touchstart.prevent
                      @touchmove.prevent
                      label="Columns Spacing 2"
                      />
                    </div>
                  </CCol>
                  <CCol :md="3">
                    <!--  MIN. LEASE (SF/Mo) -->
                    <div class="mt-2">
                      <CFormInput 
                      type="number" 
                      size="sm"
                      class="no-spinner"
                      v-model="minLease_input"
                      @wheel.prevent
                      @touchstart.prevent
                      @touchmove.prevent
                      label="Min. Lease (SF/Mo)"
                      />
                    </div>
                    <!--  MAX. LEASE (SF/ Mo) -->
                    <div class="mt-2">
                      <CFormInput 
                      type="number" 
                      size="sm"
                      class="no-spinner"
                      v-model="maxLease_input"
                      @wheel.prevent
                      @touchstart.prevent
                      @touchmove.prevent
                      label="Max. Lease (SF/Mo)"
                      />
                    </div>
                    <!-- KNOCKOUTS DOCKS -->
                    <div class="mt-2">
                      <CFormInput 
                      type="number" 
                      size="sm"
                      class="no-spinner"
                      v-model="knockoutsDocks_input"
                      @wheel.prevent
                      @touchstart.prevent
                      @touchmove.prevent
                      label="Knockouts Docks"
                      />
                    </div>
                    <!-- PARKING SPACE -->
                    <div class="mt-2">
                      <CFormInput 
                      type="number" 
                      size="sm"
                      class="no-spinner"
                      v-model="parkingSpace_input"
                      @wheel.prevent
                      @touchstart.prevent
                      @touchmove.prevent
                      label="Parking Space"
                      />
                    </div>
                    <!-- AVAILABLE MONTH -->
                    <div class="mt-2">
                      <CDatePicker 
                      label="Available Month" 
                      locale="en-US" 
                      selectionType="month" 
                      placeholder="" 
                      v-model:date="availableMonth_input"
                      />
                    </div>
                    <!-- AVAILABLE YEAR -->
                    <div class="mt-2">
                      <CDatePicker 
                      label="Available Year" 
                      locale="en-US" 
                      selectionType="year" 
                      placeholder="" 
                      v-model:date="availableYear_input"
                      />
                    </div>          
                  </CCol>
                  <CCol :md="3">
                    <!-- FLOOR THICKNESS -->
                    <div class="mt-2">
                      <CFormInput 
                      type="number" 
                      size="sm"
                      class="no-spinner"
                      v-model="floorThickness_input"
                      @wheel.prevent
                      @touchstart.prevent
                      @touchmove.prevent
                      label="Floor Thickness"
                      />
                    </div>
                    <!-- FLOOR RESISTANCE -->
                    <div class="mt-2">
                      <CFormInput 
                      type="number" 
                      size="sm"
                      class="no-spinner"
                      v-model="floorResistance_input"
                      @wheel.prevent
                      @touchstart.prevent
                      @touchmove.prevent
                      label="Floor Resistance"
                      />
                    </div>
                    <!-- OFFICCES SPACE (SF) -->
                    <div class="mt-2">
                      <CFormInput 
                        type="number" 
                        size="sm"
                        class="no-spinner"
                        v-model="officesSpace_input"
                        @wheel.prevent
                        @touchstart.prevent
                        @touchmove.prevent
                        label="Offices (SF)"
                        />
                    </div>
                    <!-- CROSSDOCK -->
                    <div class="mt-2 d-flex" style="justify-content: space-between;">
                      <div style="width: 5.3rem;">
                        <label>Crossdock</label>
                      </div>
                      <CFormCheck 
                      type="radio" 
                      name="flexRadioDefault" 
                      id="flexRadioDefault1" 
                      label="Yes"
                      />
                      <CFormCheck 
                      type="radio" 
                      name="flexRadioDefault" 
                      id="flexRadioDefault2" 
                      label="No"
                      />
                    </div>
                    <!-- SHARED TRUCK -->
                    <div class="mt-2 d-flex" style="justify-content: space-between;">
                      <div style="width: 5.3rem;">
                        <label>Shared Truck</label>
                      </div>
                      <CFormCheck 
                      type="radio" 
                      name="flexRadioDefault" 
                      id="flexRadioDefault1" 
                      label="Yes"
                      />
                      <CFormCheck 
                      type="radio" 
                      name="flexRadioDefault" 
                      id="flexRadioDefault2" 
                      label="No"
                      />
                    </div>
                  </CCol>
                <!-- </CRow>
              </CCardBody>
            </CCard> -->
          </CRow>
  
          <CRow v-else-if="builderStateId_input === 2">
            <!-- *** ABSORPTION *** -->
            <CCard id="absorption" class="card text-secondary mb-3 mt-4 border-secondary card-header-customer-buildings " >
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
                        size="sm"
                        @change="handleTenant"
                        placeholder=""
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
                        size="sm"
                        @change="handleIndustry"
                        placeholder=""
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
                        size="sm"
                        @change="handleFinalUse"
                        placeholder=""
                      >
                      </CMultiSelect>
                    </div>
                  </CCol>
                  <CCol :md="3">
                    <!-- LEASE TERM MONTH -->
                    <div class="mt-2">
                      <CFormInput
                      type="number"
                      size="sm"
                      class="no-spinner"
                      v-model="leaseTermMonth_input"
                      @wheel.prevent
                      @touchstart.prevent
                      @touchmove.prevent
                      label="Lease Term Month"
                      />
                    </div>
                    <!-- ASKING RATE SHELL -->
                    <div class="mt-2">
                      <CFormInput
                      type="number"
                      size="sm"
                      class="no-spinner"
                      v-model="askingRateShell_input"
                      @wheel.prevent
                      @touchstart.prevent
                      @touchmove.prevent
                      label="Asking Rate Shell"
                      />
                    </div>
                    <!-- KVAS -->
                    <div class="mt-2">
                      <CFormInput
                      type="text"
                      size="sm"
                      class="no-spinner"
                      v-model="KVAS_input"
                      label="KVAS"
                      />
                    </div>
                  </CCol>
                  <CCol :md="3">
                    <!-- CLOSING RATE -->
                    <div class="mt-2">
                      <CFormInput
                      type="number"
                      size="sm"
                      class="no-spinner"
                      v-model="closingRate_input"
                      @wheel.prevent
                      @touchstart.prevent
                      @touchmove.prevent
                      label="Closing Rate"
                      />
                    </div>
                    <!-- CLOSING QUARTER -->
                    <div class="mt-2">
                      <CFormInput
                      type="text"
                      size="sm"
                      class="no-spinner"
                      v-model="closingQuarter_input"
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
                        size="sm"
                        placeholder=""
                      >
                      </CMultiSelect>
                    </div>
                  </CCol>
                  <CCol :md="3">
                    <!-- COMPANY TYPE -->
                    <div  class="mt-2">
                      <CMultiSelect
                        label="Company Type"
                        :multiple="false"
                        :options="BuildingState"
                        optionsStyle="text"
                        size="sm"
                        placeholder=""
                      >
                      </CMultiSelect>
                    </div>
                    <!-- LEASE UP -->
                    <div class="mt-2">
                      <CFormInput
                      type="text"
                      size="sm"
                      class="no-spinner"
                      v-model="leaseUp_input"
                      label="Lease Up"
                      />
                    </div>
                    <!-- MONTH -->
                    <div class="mt-2">
                      <CDatePicker 
                      label="Month" 
                      locale="en-US"
                      size="sm"
                      selectionType="month" 
                      placeholder=""
                      />
                    </div>
                  </CCol>
                  <CCol :md="4">
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
                <!-- </CRow>
              </CCardBody>
            </CCard> -->
          </CRow>
        </CRow>
      </CCol>
    </CRow>
  <!-- </CContainer> -->
</template>