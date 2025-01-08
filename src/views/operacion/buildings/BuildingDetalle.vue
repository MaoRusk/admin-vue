<script setup>
  import { ref, onMounted, computed, registerRuntimeCompiler, nextTick } from 'vue';
  import { useRouter } from 'vue-router'
  import { cilArrowCircleLeft, cilBasket, cilSave } from '@coreui/icons'
  import axios from 'axios';
  import BuildingData from './BuildingData.vue'
  import BuildingAvailability from './BuildingAvailability.vue'
  import BuildingContact from './BuildingContact.vue';
  import BuildingImages from './BuildingsImages.vue';
  import BuildingAbsorption from './BuildingAbsorption.vue'

  const router = useRouter()
  const props = defineProps({
    id: {
        type: Number,
        required: true
      },
  });

  const buildingDataRef = ref(null);
  const buildingAvailabilityRef = ref(null);
  const buildingContactRef = ref(null);
  const buildingImagesRef = ref(null);
  const buildingAbsorptionRef = ref(null);
  const activeAccordionKey = ref(null);
  const accordion = ref(null);
  const isAccordionVisible = ref(true);
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
    // const buildingData = buildingDataRef.value?.getFormData();
    // const contactData = buildingContactRef.value?.getFormData();
    // const imagesData = buildingImagesRef.value?.getFormData();
    const buildingData = buildingDataRef.value.getFormData();
    const contactData = buildingContactRef.value.getFormData();
    
    const allData = new FormData(); // Creas un nuevo FormData
    allData.append('buildingData', JSON.stringify(buildingData)); // Añades los datos al FormData
    allData.append('contactData', JSON.stringify(contactData));
    // Aquí realizarías la llamada al API para guardar los datos
    const response = await axios.post('https://laravel-back-production-9320.up.railway.app/api/buildings', allData);
    // const response = await axios.post('http://127.0.0.1:8000/api/buildings', allData);
    
    console.log('Datos guardados exitosamente:', response.data);
    // Aquí puedes agregar alguna notificación de éxito para el usuario
  } catch (error) {
    console.error('Error al guardar los datos:', error);
    // Aquí puedes agregar alguna notificación de error para el usuario
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
    <!-- <div class="movil-response"></div> -->
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
                <CIcon :content="cilArrowCircleLeft" size="sm" />
                Return
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
          <BuildingData :id="Number(props.id)" ref="buildingDataRef" />
        </CTabPanel>
        <CTabPanel class="p-3" itemKey="Availability">
          <BuildingAvailability :id="Number(props.id)" ref="buildingAvailabilityRef" />
        </CTabPanel>
        <CTabPanel class="p-3" itemKey="Absorption">
          <BuildingAbsorption :id="Number(props.id)" ref="buildingAbsorptionRef" />
        </CTabPanel>
        <CTabPanel class="p-3" itemKey="ContactBuilding">
          <BuildingContact :id="Number(props.id)" ref="buildingContactRef" />
        </CTabPanel>
        <CTabPanel class="p-3" itemKey="Files">
          <BuildingImages :id="Number(props.id)" ref="buildingImagesRef" />
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