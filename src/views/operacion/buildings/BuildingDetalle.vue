<script setup>
  import { ref, onMounted, computed } from 'vue';
  import { useRouter } from 'vue-router'
  import { cilArrowCircleLeft, cilBasket } from '@coreui/icons'
  import axios from 'axios';
  import BuildingData from './BuildingData.vue'
  import BuildingContact from './BuildingContact.vue';
  import BuildingsExtra from './BuildingsExtra.vue';

  const router = useRouter()
  const props = defineProps({
    id: {
        type: Number,
        required: true
      },
  });
  const usersCbo = ref([]);
  const user = ref('');
 
  onMounted(() => {
    if (props.id) {
        fetchCompaniesCbo(props.id);
      }
  });
  const fetchCompaniesCbo = async (userId) => {
    try {
      const [userResponse, companiesResponse] = await Promise.all([
        axios.get(`http://localhost:8000/api/user/`),
      ]);

      const userInfo = userResponse.data;

      // Mapeo de empresa seleccionada
      usersCbo.value = userInfo.map(usr => ({
        value: usr.id,
        label: usr.name + " " + usr.lastName,
        selected: usr.id === userInfo.companyId
      }));

      // user.value      = userInfo.va;

    } catch (error) {
      console.error('Hubo un error obteniendo los datos:', error);
    }
  };
  const handleCompanyChange = (value) => {
    if (value != 0) {   
      selectedCompany.value = value[0].value;
      console.log("Selected company ID:", selectedCompany.value);
    }
  };
</script>
<template>
  <div>
    <div style="display: flex; justify-content: right;">
      <div >
        <router-link to="../buildings">
          <CButton color="primary" variant="outline">
            <CIcon :content="cilArrowCircleLeft" size="sm" />
            return
          </CButton>
        </router-link>
      </div>
    </div>
    <CTabs activeItemKey="DataBuilding">
      <CTabList variant="tabs">
        <CTab itemKey="DataBuilding">Data Building</CTab>
        <CTab itemKey="Extra">Extra</CTab>
        <CTab itemKey="ContactBuilding">Building Contact</CTab>
      </CTabList>
      <CTabContent>
        <CTabPanel class="p-3" itemKey="DataBuilding">
          <!-- <h2>User Details</h2> -->
          <!-- Modulo de perfil -->
          <BuildingData :id="Number(props.id)"/> 
        </CTabPanel>
        <CTabPanel class="p-3" itemKey="ContactBuilding">  
          <BuildingContact :id="Number(props.id)"/> 
        </CTabPanel>
        <CTabPanel class="p-3" itemKey="Extra">  
          <BuildingsExtra :id="Number(props.id)"/> 
        </CTabPanel>
      </CTabContent>
    

    </CTabs>
  </div>
</template>