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

</script>

<template>
  <CContainer>
    <CRow>
        <!-- *** GENERAL INFORMATION *** -->
        <CCard class="card text-secondary mb-3 border-secondary card-customer-buildings " >
          <CCardBody class="card-body-customer-buildings">
            General information
          </CCardBody>
        </CCard>
        <CCol :md="3">
          <!-- BUILDING STATE -->
          <div  class="mt-2">
            <CMultiSelect
              label="Building State"
              :multiple="false"
              :options="BuildingState"
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
        
        <!-- *** LOCATION *** -->
        <CCard class="card text-secondary mb-3 mt-4 border-secondary card-customer-buildings " >
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
        <CCard class="card text-secondary mb-3 mt-4 border-secondary card-customer-buildings " >
          <CCardBody class="card-body-customer-buildings">
            Property Details
          </CCardBody>
        </CCard>
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

        <!-- *** TRANSACTIONS AND AGREEMENTS *** -->
        <CCard class="card text-secondary mb-3 mt-4 border-secondary card-customer-buildings " >
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
        <CCard class="card text-secondary mb-3 border-secondary card-customer-buildings " >
          <CCardBody class="card-body-customer-buildings">
            Technical Specifications
          </CCardBody>
        </CCard>
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
       
      </CCol>
      <CCol :md="3">
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
        <!-- FIRE PROTECTION SYSTEM (FPS) -->
        <!-- <div class="mt-1">
          <CFormInput
          type="text"
          class="no-spinner"
          placeholder="Fire Protection System (FPS)"
          label="Fire Protection System (FPS)"
          />
        </div> -->
        <!-- HVAC PRODUCTION AREA -->
        <div style="margin-top: .35rem;">
          <CFormInput
          type="text"
          placeholder="HVAC Production Area"
          label="HVAC Production Area"
          />
        </div>
      </CCol>
      <CCol :md="3">
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
      </CCol>
        <!-- *** AVAILABILITY *** -->
        <CCard class="card text-secondary mb-3 mt-4 border-secondary card-customer-buildings " >
          <CCardBody class="card-body-customer-buildings">
            AVAILABILITY
          </CCardBody>
        </CCard>
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
        <!-- LOADING DOOR -->
        <!-- <div class="mt-2">
          <CMultiSelect
            label="Loading Door"
            :multiple="false"
            :options="LoadingDoor"
            optionsStyle="text"
            @change="handleLoadingDoorSelect"
          >
            <template #options="{ option }" >
              <div class="d-flex">
                <CIcon v-if="option.value == 0" class="me-1 mt-1" :icon="cilPlus" size="sm"/> {{option.label}}
              </div>
            </template>
          </CMultiSelect>
          <CInputGroup v-if="SelectedLoadingDoor == '0'" class="mb-3 mt-2">
            <CFormInput placeholder="New Loading Door.." aria-label="New Loading Door.." aria-describedby="button-addon2"/>
            <CButton type="button" color="success" variant="outline" id="button-addon2">Save</CButton>
          </CInputGroup>
        </div>   -->
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
        <!-- LIGHTING -->
        <!-- <div class="mt-2">
          <CFormInput
          type="text"
          placeholder="Lighting"
          label="Lighting"
          />
        </div> -->
        <!-- VENTILATION -->
        <!-- <div class="mt-2">
          <CFormInput
          type="text"
          placeholder="Ventilation System"
          label="Ventilation System"
          />
        </div> -->
        <!-- TRANSFORMER CAPACITY (Electric Substations) -->
        <!-- <div class="mt-2">
          <CFormInput
          type="text"
          placeholder="Transformer Capacity"
          label="Transformer Capacity"
          />
        </div> -->
        <!-- CONSTRUCTION TYPE -->
        <!-- <div class="mt-2">
          <CFormInput
          type="text"
          placeholder="Construction Type"
          label="Construction Type"
          />
        </div> -->
         <!-- ROOF SYSTEM (Roofing) -->
         <!-- <div class="mt-2">
          <CFormInput
          type="text"
          placeholder="Roof System"
          label="Roof System"
          />
        </div> -->
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
         <!-- SKYLIGHTS (SF) -->
         <!-- <div class="mt-2">
          <CFormInput 
            type="number" 
            class="no-spinner"
            @wheel.prevent
            @touchstart.prevent
            @touchmove.prevent
            placeholder="Skylight %"
            label="Skylight %"
            />
        </div> -->
         <!-- COVERAGE (FRA%) -->
        <!-- <div class="mt-2">
          <CFormInput 
            type="number" 
            class="no-spinner"
            @wheel.prevent
            @touchstart.prevent
            @touchmove.prevent
            placeholder="Coverage %"
            label="Coverage %"
            />
        </div> -->
       
      </CCol>
    </CRow>
  </CContainer>
</template>