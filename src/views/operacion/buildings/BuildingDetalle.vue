<script setup>
  import { ref, onMounted, computed, registerRuntimeCompiler } from 'vue';
  import { useRouter } from 'vue-router'
  import { cilArrowCircleLeft, cilBasket, cilSave } from '@coreui/icons'
  import axios from 'axios';
  import BuildingData from './BuildingData.vue'
  import BuildingContact from './BuildingContact.vue';
  import BuildingImages from './BuildingsImages.vue';

  const router = useRouter()
  const props = defineProps({
    id: {
        type: Number,
        required: true
      },
  });

  const buildingDataRef = ref(null);
  const buildingContactRef = ref(null);
  const buildingImagesRef = ref(null);


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
    // const response = await axios.post('https://laravel-back-production-9320.up.railway.app/api/buildings', allData);
    const response = await axios.post('http://127.0.0.1:8000/api/buildings', allData);
    
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
    const offset = 200; // Ajusta este valor según lo que necesites
    const sectionPosition = section.getBoundingClientRect().top + window.pageYOffset - offset;

    window.scrollTo({
      top: sectionPosition,
      behavior: 'smooth',
    });
  }
};

</script>
<template>
  <div>
    <!-- <div class="movil-response"></div> -->
    <CCard class="container-btn-flotante">
      <CCardBody>
        <div style="text-align: center;">
        <CRow>
          <CCol :md="6">
            <CAccordion>
              <CAccordionItem :item-key="1">
                <CAccordionHeader>
                  Index
                </CAccordionHeader>
                <CAccordionBody>
                  <CCol :md="12">
                    <CButton size="sm" color="link" shape="rounded-pill" @click="scrollToSection('general-information')">General information</CButton>
                  </CCol>
                  <CCol :md="12">
                    <CButton size="sm" color="link" shape="rounded-pill" @click="scrollToSection('location')" style="margin-left: .7rem;">Location</CButton>
                  </CCol>
                  <CCol :md="12">
                    <CButton size="sm" color="link" shape="rounded-pill" @click="scrollToSection('property-details')" style="margin-left: .7rem;">Property Details</CButton>
                  </CCol>
                  <CCol :md="12">
                    <CButton size="sm" color="link" shape="rounded-pill" @click="scrollToSection('transactions-agreements')" style="margin-left: .7rem;">Transactions and Agreements</CButton>
                  </CCol>
                  <CCol :md="12">
                    <CButton size="sm" color="link" shape="rounded-pill" @click="scrollToSection('technical-specifications')" style="margin-left: .7rem;">Technical Specifications</CButton>
                  </CCol>
                  <CCol :md="12">
                    <CButton size="sm" color="link" shape="rounded-pill" @click="scrollToSection('availability')" style="margin-left: .7rem;">Availabbility</CButton>
                  </CCol>
                  <CCol :md="12">
                    <CButton size="sm" color="link" shape="rounded-pill" @click="scrollToSection('absorption')" style="margin-left: .7rem;">Absorption</CButton>
                  </CCol>
                </CAccordionBody>
              </CAccordionItem>
            </CAccordion>
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
        <CTab itemKey="ContactBuilding">Building Contact</CTab>
        <CTab itemKey="Images">Images</CTab>
      </CTabList>
      <CTabContent>
        <CTabPanel class="p-3" itemKey="DataBuilding">
          <BuildingData :id="Number(props.id)" ref="buildingDataRef" />
        </CTabPanel>
        <CTabPanel class="p-3" itemKey="ContactBuilding">
          <BuildingContact :id="Number(props.id)" ref="buildingContactRef" />
        </CTabPanel>
        <CTabPanel class="p-3" itemKey="Images">
          <BuildingImages :id="Number(props.id)" ref="buildingImagesRef" />
        </CTabPanel>
      </CTabContent>    

    </CTabs>
  </div>
</template>