<script setup>
  import { ref, onMounted, computed } from 'vue';
  import { useRouter } from 'vue-router'
  import { cilArrowCircleLeft, cilBasket } from '@coreui/icons'
  import axios from 'axios';
  import MultiplePermissionsModules from './TabMultiplePermissions.vue'
  import permissionsModules from './TabPermissionsOneToOne.vue'
  import profile from './TabProfile.vue'

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
        <router-link to="../polizas">
          <CButton color="primary" variant="outline">
            <CIcon :content="cilArrowCircleLeft" size="sm" />
            return
          </CButton>
        </router-link>
      </div>
    </div>
  
    <CTabs activeItemKey="profile">
      <CTabList variant="tabs">
        <CTab itemKey="profile">Profile</CTab>
        <CTab itemKey="multiplePermissions">Give Permissions</CTab>
        <CTab itemKey="permissions">Show Permissions</CTab>
      </CTabList>
      <CTabContent>
        <CTabPanel class="p-3" itemKey="profile">
          <h2>User Details</h2>
          <!-- Modulo de perfil -->
          <profile :id="Number(props.id)"/> 
        </CTabPanel>
        <CTabPanel class="p-3" itemKey="multiplePermissions">
          <!-- <h2>Give multiple permissions</h2> -->
          <!-- Modulo de permisos -->
          <MultiplePermissionsModules :id="Number(props.id)"/>
        </CTabPanel>
        <CTabPanel class="p-3" itemKey="permissions">
          <!-- <h2>Give permissions</h2> -->
          <!-- Modulo de permisos -->
          <permissionsModules :id="Number(props.id)"/>
        </CTabPanel>
      </CTabContent>
    </CTabs>
  </div>
</template>