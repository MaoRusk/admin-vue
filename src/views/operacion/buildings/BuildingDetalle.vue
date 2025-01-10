<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useRoute } from 'vue-router'
import { cilArrowCircleLeft, cilSave } from '@coreui/icons'
import BuildingData from './BuildingData.vue'
import BuildingAvailability from './BuildingAvailability.vue'
import BuildingContact from './BuildingContact.vue';
import BuildingImages from './BuildingsImages.vue';
import BuildingAbsorption from './BuildingAbsorption.vue'
import { API } from '../../../services';

// const router = useRouter()
const route = useRoute()

watch(
  () => route.params.buildingId,
  (newId) => {
    // react to route changes...
    console.log(newId)
  }
)

const buildingId = computed(() => Number(route.params.buildingId) || null)

const buildingDataRef = ref(null);
const buildingAvailabilityRef = ref(null);
const buildingContactRef = ref(null);
const buildingImagesRef = ref(null);
const buildingAbsorptionRef = ref(null);
const isMenuOpen = ref(false)
const availableSections = ref([]);

const sections = [
  { id: 'general-information', label: 'General information' },
  { id: 'location', label: ' Location ' },
  { id: 'property-details', label: 'Property Details' },
  { id: 'transactions-agreements', label: 'Transactions and Agreements' },
  { id: 'technical-specifications', label: 'Technical Specifications' },
  { id: 'availability', label: 'Availability' },
  { id: 'absorption', label: 'Absorption' }
];

onMounted(() => {
  // Verificar qué secciones existen en el DOM
  availableSections.value = sections.filter(section => 
    document.getElementById(section.id) !== null
  );
});

const saveAllData = async () => {
  try {
    const buildingData = buildingDataRef.value.getFormData();
    console.log(buildingData)

    const response = await API.buildings.createBuilding(buildingData);
    console.log('Datos guardados exitosamente:', response.data);
  } catch (error) {
    console.error('Error al guardar los datos:', error);
  }
};

const scrollToSection = (sectionId) => {
  const section = document.getElementById(sectionId);
  if (section) {
    const offset = 480;
    const sectionPosition = section.getBoundingClientRect().top + window.pageYOffset - offset;
    
    window.scrollTo({
      top: sectionPosition,
      behavior: 'smooth'
    });
    
    // Cerrar el menú
    isMenuOpen.value = false;
  }
};

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
}
</script>
<template>
  <div>
    <CCard class="container-btn-flotante">
      <CCardBody style="padding: 8px 16px;">
        <div style="text-align: center;">
        <CRow>
          <CCol :md="6">
            <CCard>
              <CCardHeader @click="toggleMenu" style="cursor: pointer;">
                <strong>Index</strong>
              </CCardHeader>
              <CCollapse :visible="isMenuOpen">
                <CCardBody>
                  <CNav vertical>
                    <template v-for="section in availableSections" :key="section.id">
                      <CNavItem 
                        href="#" 
                        @click="scrollToSection(section.id)"
                      >
                        {{ section.label }}
                      </CNavItem>
                    </template>
                  </CNav>
                </CCardBody>
              </CCollapse>
            </CCard>
          </CCol>
          <CCol :md="6" class="btns-flotantes-customer-moviles">
            <CButton color="success mr-2" variant="outline" style="margin-left: .7rem;" @click="saveAllData">
              <CIcon :content="cilSave" size="sm" />
              Save
            </CButton>
            <router-link to="../buildings">
              <CButton color="primary" variant="outline" style="margin-left: .7rem;">
                <CIcon :content="cilArrowCircleLeft" size="sm" /> back
              </CButton>
            </router-link>
          </CCol>
        </CRow>
        </div>
      </CCardBody>
    </CCard>

    <CTabs activeItemKey="DataBuilding">
      <CTabList variant="tabs" style="margin-top: 1rem;">
        <CTab itemKey="DataBuilding">Data Building</CTab>
        <CTab itemKey="Availability">Availability</CTab>
        <CTab itemKey="Absorption">Absorption</CTab>
        <CTab itemKey="ContactBuilding">Building Contact</CTab>
        <CTab itemKey="Files">Files</CTab>
      </CTabList>
      <CTabContent>
        <CTabPanel class="p-3" itemKey="DataBuilding">
          <BuildingData :id="buildingId" ref="buildingDataRef" />
        </CTabPanel>
        <CTabPanel class="p-3" itemKey="Availability">
          <BuildingAvailability :id="buildingId" ref="buildingAvailabilityRef" />
        </CTabPanel>
        <CTabPanel class="p-3" itemKey="Absorption">
          <BuildingAbsorption :id="buildingId" ref="buildingAbsorptionRef" />
        </CTabPanel>
        <CTabPanel class="p-3" itemKey="ContactBuilding">
          <BuildingContact :id="buildingId" ref="buildingContactRef" />
        </CTabPanel>
        <CTabPanel class="p-3" itemKey="Files">
          <BuildingImages :id="buildingId" ref="buildingImagesRef" />
        </CTabPanel>
      </CTabContent>    

    </CTabs>
  </div>
</template>

<style scoped>
.nav-item {
  cursor: pointer;
  padding: 8px 16px;
  transition: background-color 0.2s;
}

.nav-item:hover {
  background-color: #f8f9fa;
}

.card-header {
  background-color: #f8f9fa;
}
</style>