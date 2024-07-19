<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import Swal from 'sweetalert2';
import { cilX, cilPlus } from '@coreui/icons'
import axios from 'axios';
import { useRouter } from 'vue-router'
import { Class, IndustrialPark, Status, Owner, Developer, Type, Region, LoadingDoor, Deal, Currency, Tenancy, ListingBroker } from '../../../assets/json/loadCats'

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
      <CCol :md="3">
        <!-- CLASS -->
        <div>
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
        <!-- STATUS -->
        <div>
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
        <!-- INDUSTRIAL PARK -->
        <div>
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
      <CCol :md="3">
        <!-- CLEAR HEIGHT -->
        <div>
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
         <!-- OWNER -->
         <div>
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
        <div>
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
                <CIcon v-if="option.value == 0" class="me-1 mt-1" :icon="cilPlus" size="sm"/> {{option.label}}
              </div>
            </template>
          </CMultiSelect>
          <CInputGroup v-if="SelectedLoadingDoor == '0'" class="mb-3 mt-2">
            <CFormInput placeholder="New Loading Door.." aria-label="New Loading Door.." aria-describedby="button-addon2"/>
            <CButton type="button" color="success" variant="outline" id="button-addon2">Save</CButton>
          </CInputGroup>
        </div>
        <!-- DEAL -->
        <CMultiSelect
          label="Deal"
          :multiple="false"
          :options="Deal"
          optionsStyle="text"
        >
        </CMultiSelect>
         <!-- CURRENCY -->
         <CMultiSelect
          label="Currency"
          :multiple="false"
          :options="Currency"
          optionsStyle="text"
        >
        </CMultiSelect>
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
        <!--   SALE PRICE (USD)  -->
        <div class="mt-2">
          <label >Sale Price (USD) </label>
          <CInputGroup class="mb-3">
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
        <div>
          <!-- TENANCY -->
          <CMultiSelect
            label="Tenancy"
            :multiple="false"
            :options="Tenancy"
            optionsStyle="text"
          >
          </CMultiSelect>
        </div>
        <div>
          <!-- LISTING BROKER -->
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
  </CContainer>
</template>