<script setup>
  import { ref, onMounted, computed, watch } from 'vue';
  import Swal from 'sweetalert2';
  import { cilArrowCircleLeft, cilBasket } from '@coreui/icons'
  import { cilPlus, cilTrash, cilPencil } from '@coreui/icons'
  import axios from 'axios';
  import { useRouter } from 'vue-router'

  const router = useRouter()

  const props = defineProps({
    id: {
        type: Number,
        required: true
      },
  });


  const inputValue = ref(null)
  const userTypesCbo = ref([]);
  const name = ref('');
  const lastName = ref('');
  const userName = ref('');
  const passwordInput = ref('')
  const submitUserTypeInput = ref('')
  const marketsCbo = ref([]);

  const selectedValues = ref([]);
  const SelectedModules = ref("");
  const modulesCbo = ref([
  { value: '1', label: 'Buildings' },
]);
  const status = ref('Activo');
  const selectedUserType = ref('');
  const selectedMarket = ref('');
  
  const confirmPassword = ref('')

  onMounted(() => {
    if (props.id != 0) {
        fetchServices(props.id);
      }else{
        fetchUserTypes();
      }
  });

  const handleModulesCbo = (newValue) => {
    selectedValues.value = newValue;
    SelectedModules.value = selectedValues.value.map(item => item.value).join(',');
  };
  
  const fetchUserTypes = async () => { //Cargar todos los user Types para nuevo empleado
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/user-types`);
      const modifiedUserTypes = Array.isArray(response.data) ? response.data : [];

      userTypesCbo.value = [
        { value: 'New', label: 'Add object' },
        ...modifiedUserTypes
      ];
    } catch (error) {
      console.error('Hubo un error obteniendo el combo user Types:', error);
      Swal.fire({
        title: 'Error',
        text: 'No se pudieron cargar los tipos de usuario',
        icon: 'error',
        timer: 3000
      });
    }
  };

  const fetchMarkets = async () => {
    try {
      if (props.id == 0 && selectedUserType.value == 5) {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/market`);
        if (Array.isArray(response.data)) {
          marketsCbo.value = response.data.map(company => ({
            value: company.id || '',
            label: company.marketName || company.name || '',
            selected: false
          }));
        } else {
          marketsCbo.value = [];
        }
      }
    } catch (error) {
      console.error('Hubo un error obteniendo el combo companies:', error);
      Swal.fire({
        title: 'Error',
        text: 'No se pudieron cargar los mercados',
        icon: 'error',
        timer: 3000
      });
    }
  };
  
  const fetchServices = async (userId) => {
    try {
      // Llamado de apis en paralelo
      const [employeeResponse, userTypesResponse, marketsResponse] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/users/${userId}`),
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/user-types`),
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/market`),
      ]);

      const employeeInfo = employeeResponse.data;
      
      // Asignar valores básicos del usuario
      name.value = employeeInfo.name || '';
      lastName.value = employeeInfo.lastName || '';
      userName.value = employeeInfo.userName || '';
      
      // Manejar los módulos con validación
      if (Array.isArray(employeeInfo.modules)) {
        modulesCbo.value = employeeInfo.modules.map(module => ({
          label: module.label || module.name || '',
          value: module.value || module.id || '',
          selected: module.selected || false
        }));
      } else {
        // Si no hay módulos, mantener el valor por defecto
        modulesCbo.value = [
          { value: '1', label: 'Buildings' }
        ];
      }

      // Manejar los mercados con validación
      if (employeeInfo.userTypeId == 5) {
        if (Array.isArray(employeeInfo.markets)) {
          marketsCbo.value = employeeInfo.markets.map(mrkt => ({
            label: mrkt.label || mrkt.name || '',
            value: mrkt.value || mrkt.id || '',
            selected: mrkt.selected || false
          }));
        }
      } else if (Array.isArray(marketsResponse.data)) {
        marketsCbo.value = marketsResponse.data.map(mrkt => ({
          value: mrkt.id || '',
          label: mrkt.marketName || mrkt.name || '',
        }));
      } else {
        marketsCbo.value = []; // Valor por defecto si no hay datos
      }

      passwordInput.value = "********"; // Valor por defecto para password
      status.value = employeeInfo.status === "Activo" ? "Activo" : "Inactivo";

      // Manejar tipos de usuario con validación
      if (Array.isArray(userTypesResponse.data)) {
        const modifiedUserTypes = userTypesResponse.data.map(userType => ({
          ...userType,
          selected: userType.value === employeeInfo.userTypeId
        }));
        
        userTypesCbo.value = [
          { value: 'New', label: 'Add position' },
          ...modifiedUserTypes
        ];
      }

      // Establecer el tipo de usuario seleccionado
      selectedUserType.value = employeeInfo.userTypeId;

    } catch (error) {
      console.error('Hubo un error obteniendo los datos:', error);
      Swal.fire({
        title: 'Error',
        text: 'Hubo un error al cargar los datos del usuario',
        icon: 'error',
        timer: 3000
      });
    }
  };

  // Validaciones
  const updateStatus = (newStatus) => {
    status.value = newStatus;
  };
  

  const handleModulesChange = (newValue) => {   
    inputValue.value = newValue;
    selectedUserType.value = inputValue.value.map(item => item.value).join(',');
    fetchMarkets();
  };

  const handleMarketsChange = (newValue) => {
    inputValue.value = newValue;
    selectedMarket.value = inputValue.value.map(item => item.value).join(',');
  };

  const isPasswordMatch = computed(() => {
    return passwordInput.value === confirmPassword.value
  })

  const isFormValid = computed(() => {
    return (
      name.value.trim() !== '' &&
      lastName.value.trim() !== '' &&
      userName.value.trim() !== '' &&
      passwordInput.value.trim() !== '' &&
      (props.id == 0 || props.id === ''
        ? confirmPassword.value.trim() !== '' && passwordInput.value === confirmPassword.value
        : true)
    );
  });

  // Add New User Type (Position)
  const submitUserType = async () => {
  const formData = new FormData();
  formData.append('typeName', submitUserTypeInput.value);
  formData.append('status', 'Activo');

  try {
    await axios.post('https://laravel-back-production-9320.up.railway.app/api/user-types', formData);
    await Swal.fire({
      title: "Added!",
      text: "Position added successfully.",
      icon: "success",
      showConfirmButton: false,
      timer: 1000
    });
    
    // Recargar los tipos de usuario
    await fetchUserTypes();
    
    // Resetear el input y la selección
    submitUserTypeInput.value = '';
    selectedUserType.value = null;
    
    // Forzar la actualización del componente
    await nextTick();
  } catch (error) {
    Swal.fire({
      title: "Error adding Position Employee.",
      text: error.response.data.message,
      icon: "error",
      showConfirmButton: false,
      timer: 3500
    });
  }
};


  // Add A New User
  const submitFunction = async () => {
    if (!isFormValid.value) {
      Swal.fire({
        title: "Sorry!",
        text: "Please fill in all the required fields.",
        icon: "info",
        showConfirmButton: false,
        timer: 3000
      });
      return;
    }else{
      const formData = new FormData();
      formData.append('name', name.value);
      formData.append('lastName', lastName.value);
      formData.append('userName', userName.value);
      formData.append('modules', SelectedModules.value);
      formData.append('markets', selectedMarket.value);
      formData.append('password', passwordInput.value);
      formData.append('userTypeId', selectedUserType.value);
      formData.append('companyId', 36);
      formData.append('totalScreens', 0);
      formData.append('status', status.value);
  
      try {
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/users`, formData);
        await Swal.fire({
          title: "Added!",
          text: "Employee added successfully.",
          icon: "success",
          showConfirmButton: false,
          timer: 3500
        });
        router.push({
          name: 'Employees',
          params: { id: Number(0) },
        });
      } catch (error) {
        Swal.fire({
          title: "Error adding Employee.",
          text: error.response?.data?.message || "Unknown error occurred",
          icon: "error",
          showConfirmButton: false,
          timer: 3500
        });
      }
    }
  }

  // Modify User
  const updateFunction = async () => {
    if (!isFormValid.value) {
      Swal.fire({
        title: "Lo sentimos!",
        text: "Por favor, rellena todos los campos requeridos.",
        icon: "info",
        showConfirmButton: false,
        timer: 1500
      });
      return;
    }else{
      const formData = new FormData();
      formData.append('name', name.value);
      formData.append('lastName', lastName.value);
      formData.append('middleName', "");
      formData.append('userName', userName.value);
      formData.append('modules', SelectedModules.value);
      formData.append('markets', selectedMarket.value);
      formData.append('userTypeId', selectedUserType.value);
      formData.append('companyId', 36);
      formData.append('totalScreens', 0);
      // formData.append('_method', "put");

      
      try {
        await axios.put(`${import.meta.env.VITE_API_BASE_URL}/users/${props.id}`, formData);
        await Swal.fire({
          title: "Updated!",
          text: "User updated successfully.",
          icon: "success",
          showConfirmButton: false,
          timer: 1500
        });
        router.push({
          name: 'Employees',
          params: { id: Number(0) },
        });
      } catch (error) {
        Swal.fire({
          title: "Error update User.",
          text: error.response?.data?.message || "Unknown error occurred",
          icon: "error",
          showConfirmButton: false,
          timer: 2000
        });
      }
      }
  }

  // Delete User
  const deleteUser = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/users/${props.id}`);
          await Swal.fire({
            title: "Deleted!",
            text: "User deleted successfully.",
            icon: "success",
            showConfirmButton: false,
            timer: 1500
          });
          router.push({
            name: 'Employees',
            params: { id: Number(0) },
          });
        } catch (error) {
          Swal.fire({
            title: "Error!",
            text: "Error deleting user.",
            icon: "error"
          });
        }
      }
    });
    }
</script>
<template>
    <CContainer>

      <div style="display: flex; justify-content: right;">
        <div>
          <router-link to="../employees">
            <CButton color="primary" variant="outline">
              <CIcon :content="cilArrowCircleLeft" size="sm" />
              return
            </CButton>
          </router-link>
        </div>
      </div>

        <CRow>
            <CCol :md="6">
            <CCol>
              <CFormInput
                type="text"
                label="Name *"
                placeholder="name"
                v-model="name"
                :class="{'is-invalid': name.trim() === ''}"
                aria-label="default input example"
              />
              <div v-if="name.trim() === ''" class="invalid-feedback">
                This field is required
              </div>
            </CCol>
            <CCol>
                <CFormInput type="text"
                label="Last Name *" 
                placeholder="lastName" 
                v-model="lastName"
                :class="{'is-invalid': lastName.trim() === ''}"
                aria-label="default input example"/>
                <div v-if="lastName.trim() === ''" class="invalid-feedback">
                  This field is required
                </div>
            </CCol>
            <CCol>
              <CMultiSelect
                  label="Select Position*"
                  v-model="selectedUserType"
                  :multiple="false"
                  :options="userTypesCbo"
                  optionsStyle="text"
                  @change="handleModulesChange"
                  >
                  <template #options="{ option }" >
                    <div class="d-flex">
                      <CIcon v-if="option.value == 'New'" class="me-1 mt-1" :icon="cilPlus" size="sm"/> {{option.label}}
                    </div>
                  </template>
                </CMultiSelect>
                <CInputGroup v-if="selectedUserType === 'New'" class="mb-3 mt-2">
                  <CFormInput 
                    placeholder="New Position.." 
                    aria-label="New Position.." 
                    aria-describedby="button-addon2" 
                    v-model="submitUserTypeInput"
                  />
                  <CButton 
                    type="button" 
                    color="success" 
                    variant="outline" 
                    id="button-addon2" 
                    @click="submitUserType"
                  >
                    Save
                  </CButton>
                </CInputGroup>                            
            </CCol>
            <CCol>
              <CMultiSelect
              v-if="selectedUserType === '5'"
                  label="Select Markets *"
                  @change="handleMarketsChange"
                  :options="marketsCbo"
                  />
            </CCol>

            <CCol>
            </CCol>
            </CCol>
            <CCol :md="6">
              <CCol>
                <CMultiSelect 
                label="Select Admin Modules"
                :options="modulesCbo"
                @change="handleModulesCbo($event)"
                selectionType="text" />
            </CCol>
            <CCol>
                <CFormInput 
                type="text"
                label="UserName *" 
                placeholder="userName" 
                v-model="userName"
                :class="{'is-invalid': userName.trim() === ''}"
                aria-label="default input example"
                required
                />
                <div v-if="userName.trim() === ''" class="invalid-feedback">
                  This field is required
                </div>
            </CCol>
            <CCol>
              <div style="">
                <CFormInput
                  label="Password *" 
                  type="password"
                  v-model="passwordInput"
                  :class="{'is-invalid': passwordInput.trim() === ''}"
                  id="inputPassword"
                />
                <div v-if="passwordInput.trim() === ''" class="invalid-feedback">
                  This field is required
                </div>
              </div>

            </CCol>
            <CCol v-if="props.id == 0 || props.id === ''">
              <CFormInput
                label="Confirm Password"
                type="password"
                v-model="confirmPassword"
                :class="{'is-invalid': confirmPassword.trim() === ''}"
                id="confirmInputPassword"
                :invalid="!isPasswordMatch"
                :feedback="isPasswordMatch ? 'Passwords match' : 'Passwords do not match'"
              />
              <div v-if="confirmPassword.trim() === ''" class="invalid-feedback">
                This field is required
              </div>
            </CCol>
            <CCol>
                <div style="display: flex; justify-content: left; align-items: center;">
                  <label for="status">Status</label>
                  <div style="margin-left: 1rem; padding-top: 1rem;">
                    <CFormCheck 
                      inline 
                      type="radio" 
                      name="inlineRadioOptions" 
                      id="inlineCheckbox1" 
                      value="Activo" 
                      label="Activo"
                      :checked="status === 'Activo'"
                      @change="updateStatus('Activo')"                  />
                    <CFormCheck 
                      inline 
                      type="radio" 
                      name="inlineRadioOptions" 
                      id="inlineCheckbox2" 
                      value="Inactivo" 
                      label="Inactivo"
                      :checked="status === 'Inactivo'"
                      @change="updateStatus('Inactivo')"                  />    
                  </div>
                </div>
            </CCol>
            </CCol>
        </CRow>
        <CRow>
            <template v-if="props.id != 0 && props.id !== ''">
              <div style="display: flex; justify-content: center;padding:1rem">
                <CButton color="danger" variant="outline" @click="deleteUser()" style="margin-right: 1rem;">
                  <CIcon :content="cilTrash" size="sm" />
                  Delete Employee
                </CButton>
                <CButton 
                  color="primary" 
                  variant="outline" 
                  @click="updateFunction">
                  <CIcon :content="cilPencil" size="sm" />
                  Update
                </CButton>
            </div>
            </template>
            <template v-else>
              <div style="display: flex; justify-content: center;padding:1rem">
                <CButton 
                color="success" 
                variant="outline" 
                type="submit"
                @click="submitFunction" >Save</CButton>
              </div>
            </template>
        </CRow>
    </CContainer>
</template>