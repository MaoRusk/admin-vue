<script setup>
  import { ref, onMounted, computed } from 'vue';
  import { useRouter } from 'vue-router'
  import { cilArrowCircleLeft, cilBasket } from '@coreui/icons'
  import axios from 'axios';
  import permissionsModules from './TabPermissions.vue'
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
    <div style="display: flex; justify-content: right;">
      <div style="margin-right: .5rem;">
        <CMultiSelect
          :multiple="false"
          label="Heredar Permisos"
          v-model="selectedCompany"
          :options="usersCbo"
          @change="handleCompanyChange($event)"
        />
      </div>
      <div style="display: flex;justify-content: flex-end;align-items: flex-end;">
          <CButton color="warning" variant="outline">
            Confirm
          </CButton>
      </div>
    </div>
    <CTabs activeItemKey="profile">
      <CTabList variant="tabs">
        <CTab itemKey="profile">Profile</CTab>
        <CTab itemKey="permissions">Permissions</CTab>
      </CTabList>
      <CTabContent>
        <h2>User Details</h2>
        <CTabPanel class="p-3" itemKey="profile">
          <!-- Modulo de perfil -->
          <profile :id="Number(props.id)"/> 
        </CTabPanel>
        <CTabPanel class="p-3" itemKey="permissions">
          <!-- Modulo de permisos -->
          <permissionsModules :id="Number(props.id)"/>
        </CTabPanel>
      </CTabContent>
    </CTabs>
  </div>
</template>