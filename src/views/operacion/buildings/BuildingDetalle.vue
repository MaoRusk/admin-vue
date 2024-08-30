<script setup>
  import { ref, onMounted, computed } from 'vue';
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
    const buildingData = buildingDataRef.value?.getFormData();
    const contactData = buildingContactRef.value?.getFormData();
    const imagesData = buildingImagesRef.value?.getFormData();

    console.log("SAVEEEE", contactData);
    

    const allData = {
      buildingData,
      contactData,
      imagesData,
    };

    // Aquí realizarías la llamada al API para guardar los datos
    const response = await axios.post('http://localhost:8000/api/buildings', allData);
    
    console.log('Datos guardados exitosamente:', response.data);
    // Aquí puedes agregar alguna notificación de éxito para el usuario
  } catch (error) {
    console.error('Error al guardar los datos:', error);
    // Aquí puedes agregar alguna notificación de error para el usuario
  }
};
</script>
<template>
  <div>
    <!-- <div class="movil-response"></div> -->
    <CCard class="container-btn-flotante">
      <CCardBody>
        <div style="text-align: center;">
          <CButton color="success mr-2" variant="outline" @click="saveAllData">
            <CIcon :content="cilSave" size="sm" />
            Save
          </CButton>
          <router-link to="../buildings">
            <CButton color="primary" variant="outline" style="margin-left: .7rem;">
              <CIcon :content="cilArrowCircleLeft" size="sm" />
              return
            </CButton>
          </router-link>
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