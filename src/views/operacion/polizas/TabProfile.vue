<script setup>
  import { ref, onMounted, computed } from 'vue';
  import axios from 'axios';
  import permissionsModules from './TabPermissions.vue'
  import profile from './TabProfile.vue'
  const props = defineProps({
    usuario: {
        type: Object,
        required: true,
    }
});

  const companiesCbo = ref([]);
  const selectedCompanyId = ref(null);

  onMounted(() => {
    fetchCompaniesCbo();
    if (props.usuario) {
        // selectedCompanyId.value = props.usuario;

        console.log("SI hay props");
    }else{
        console.log("No hay props");
    }
});

const fetchCompaniesCbo = async () => {
  try {
    const response = await axios.get('http://localhost:8000/api/companies');
    companiesCbo.value = response.data.map(company => ({
      value: company.id,
      label: company.nameCompany
    }));
  } catch (error) {
    console.error('Hubo un error obteniendo el combo companies:', error);
  }
};
</script>
<template>  
    <CContainer>
        <CRow>
            <CCol :md="6">
            <CCol>      
                hiii         
                {{props.usuario}}
                <CMultiSelect
                    :multiple="false"
                    label="Select companie"
                    :options="companiesCbo"
                    v-model="selectedCompanyId"
                    />
            </CCol>
            <CCol>
                <CFormInput type="text"
                label="Name" 
                placeholder="name" 
                aria-label="default input example"/>
            </CCol>
            <CCol>
                <CFormInput type="text"
                label="Last Name" 
                placeholder="lastName" 
                aria-label="default input example"/>
            </CCol>
            <CCol>
            <CForm>
                <CFormInput
                type="email"
                id="exampleFormControlInput1"
                label="Email address"
                placeholder="name@example.com"
                text="Must be 8-20 characters long."
                aria-describedby="exampleFormControlInputHelpInline"
                />
            </CForm>
            </CCol>
            <CCol>
                <CFormInput type="number"
                label="Total Screens" 
                placeholder="totalScreens" 
                aria-label="default input example"/>
            </CCol> 
            </CCol>
            <CCol :md="6">
            <CCol>
                <CFormInput type="text"
                label="Position" 
                placeholder="Position" 
                aria-label="default input example"/>
            </CCol>
            <CCol>
                <CFormInput type="text"
                label="UserName" 
                placeholder="userName" 
                aria-label="default input example"/>
            </CCol>
            <CCol>
                <CFormInput 
                label="Password" 
                type="password" 
                id="inputPassword"/>
            </CCol>
            <CCol>
                <CFormInput 
                label="Confirm Password" 
                type="password" 
                id="confirmInputPassword"/>
            </CCol>
            <CCol>
                <CFormInput 
                type="file"
                id="formFile" 
                label="Image Profile" />
            </CCol>
            <CCol>
                <div style="display: flex; justify-content: left; align-items: center;">
                <label for="status">Status</label>
                <div style="margin-left: 1rem; padding-top: 1rem;">
                    <CFormCheck inline type="radio" name="inlineRadioOptions" id="inlineCheckbox1" value="option1" label="Activo" />
                    <CFormCheck inline type="radio" name="inlineRadioOptions" id="inlineCheckbox2" value="option2" label="Inactivo" />
                </div>
                </div>
            </CCol>
            </CCol>
        </CRow>
    </CContainer>
</template>