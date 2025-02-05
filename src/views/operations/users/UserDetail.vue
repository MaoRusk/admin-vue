<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import { cilArrowCircleLeft, cilTrash, cilPencil, cilPlus } from '@coreui/icons';
import { API } from '../../../services';
import MSelect from '../../../components/MSelect.vue';

const router = useRouter();

const props = defineProps({
  id: {
    type: Number,
    required: true
  },
});

const userRoles = ref([]);
const selectedRole = ref(null);  // Inicializar como array vacío en lugar de string
const loading = ref(false);
const marketsCbo = ref([]);
// const modulesCbo = ref([
//   { value: '1', label: 'Buildings' },
// ]);

// Form data
const formData = ref({
  name: '',
  middleName: '',
  lastName: '',
  userName: '',
  password: '',
  confirmPassword: '',
  email: '',     
  status: 'Activo', // Por defecto Activo
  userTypeId: '',
  // modules: [],
  markets: [],
});


const selectedValues = ref(null);
const selectedUserType = ref('');
const selectedMarket = ref(null);

const submitUserTypeInput = ref('');

// Computed properties
const isNewRecord = computed(() => props.id === 0);

const isPasswordMatch = computed(() => {
  return !isNewRecord.value || formData.value.password === formData.value.confirmPassword;
});

// Agregar validación de email
const isValidEmail = computed(() => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return !formData.value.email || emailRegex.test(formData.value.email);
});

// Actualizar isFormValid para incluir la validación de email
const isFormValid = computed(() => {
  const baseValidation = 
    formData.value.name.trim() !== '' &&
    formData.value.lastName.trim() !== '' &&
    formData.value.userName.trim() !== '' &&
    formData.value.password.trim() !== '' &&
    formData.value.email.trim() !== '' &&
    isValidEmail.value;                  

  if (isNewRecord.value) {
    return baseValidation && 
           formData.value.confirmPassword.trim() !== '' && 
           isPasswordMatch.value;
  }

  return baseValidation;
});
// Methods
async function fetchMarkets() {
  try {
    if (isNewRecord.value && selectedUserType.value === '5') {
      const { data } = await API.markets.getMarkets();
      marketsCbo.value = data.map(market => ({
        value: market.id,
        label: market.marketName,
        selected: false
      }));
    }
  } catch (error) {
    console.error('Error fetching markets:', error);
  }
}
async function fetchUserRole(roleId) {
  try {
    const { data: response } = await API.roles.getRoleById(roleId);
    
    if (response.success) {
      // Encontrar si el rol ya existe en la lista
      const existingRoleIndex = userRoles.value.findIndex(
        r => r.value === roleId.toString()
      );

      const roleData = {
        value: response.data.id.toString(),
        label: response.data.name,
        guardName: response.data.guard_name,
        permissions: response.data.permissions // Guardamos los permisos si los necesitamos después
      };

      // Si el rol ya existe, actualizarlo
      if (existingRoleIndex >= 0) {
        userRoles.value[existingRoleIndex] = roleData;
      } else {
        // Si no existe, agregarlo a la lista
        userRoles.value.push(roleData);
      }

      // Establecer como seleccionado
      selectedRole.value = [roleData];
    }
  } catch (error) {
    console.error('Error fetching user role:', error);
    Swal.fire({
      title: 'Error',
      text: 'Failed to load user role',
      icon: 'error'
    });
  }
}

async function fetchUserData() {
    loading.value = true;
    try {
      formData.value = {
        name: '',
        middleName: '',
        lastName: '',
        userName: '',
        password: '',
        confirmPassword: '',
        email: '',
        status: 'Activo',
        roleId: '',
        // modules: [],
        markets: []
      };
    
    // Cargar roles primero
    await fetchRoles();

    if (!isNewRecord.value) {
      const { data: response } = await API.users.getUser(props.id);      
      // Agregar console.log para ver la respuesta completa
      console.log('Respuesta completa del usuario:', response);
      console.log('Datos del usuario:', response.data);
      if (response.success) {
        const userData = response.data;
        
        formData.value = {
          name: userData.name || '',
          middleName: userData.middle_name || '',
          lastName: userData.last_name || '',
          userName: userData.user_name || '',
          password: '********',
          confirmPassword: '********',
          email: userData.email || '',
          status: userData.status === 'Active' ? 'Activo' : 'Inactivo',
          roleId: userData.role_id || '',
          // modules: [],
          markets: []
        };

    
        if (userData.role_id) {
          selectedRole.value = userData.role_id.toString();
        }
      }
    }
  } catch (error) {
    console.error('Error completo:', error);
    if (!isNewRecord.value) {
      Swal.fire({
        title: 'Error',
        text: 'Failed to load user data',
        icon: 'error'
      });
    }
  } finally {
    loading.value = false;
  }
}

// Actualizar los métodos
async function fetchRoles() {
  try {
    const { data: response } = await API.roles.getAllRoles();
    // console.log('Roles obtenidos:', response.data); // Debug log
    
    if (response.success) {
      userRoles.value = [
        ...response.data.map(role => ({
          value: role.id.toString(), // Asegurarse que sea string
          label: role.name,
          guardName: role.guard_name
        }))
      ];
      // console.log('userRoles procesados:', userRoles.value); // Debug log
    }
  } catch (error) {
    console.error('Error fetching roles:', error);
    Swal.fire({
      title: 'Error',
      text: 'Failed to load roles',
      icon: 'error'
    });
  }
}


async function handleRoleChange(value) {
  selectedRole.value = value;
  if (value[0]?.value === '5') {
    fetchMarkets();
  }
}

async function submitRole(roleName) {
  if (!roleName?.trim()) {
    Swal.fire({
      title: 'Validation Error',
      text: 'Role name is required',
      icon: 'warning'
    });
    return;
  }

  try {
    const { data: response } = await API.roles.createRole({
      name: roleName.trim(),
      guard_name: 'web'
    });

    if (response.success) {
      // Recargar roles
      const { data: rolesResponse } = await API.roles.getAllRoles();
      
      if (rolesResponse.success) {
        // Actualizar la lista de roles
        userRoles.value = [
          { value: 'New', label: 'Add role' },
          ...rolesResponse.data.map(role => ({
            value: role.id.toString(),
            label: role.name,
            guardName: role.guard_name
          }))
        ];

        // Seleccionar el nuevo rol
        selectedRole.value = response.data.id.toString();
      }

      Swal.fire({
        title: 'Success',
        text: 'New role created successfully',
        icon: 'success',
        timer: 1500
      });
    }
  } catch (error) {
    console.error('Error creating role:', error);
    Swal.fire({
      title: 'Error',
      text: error.response?.data?.message || 'Failed to create role',
      icon: 'error'
    });
  }
}

async function handleSubmit() {
  if (!isFormValid.value) {
    Swal.fire({
      title: 'Validation Error',
      text: 'Please fill in all required fields correctly',
      icon: 'warning'
    });
    return;
  }

  loading.value = true;
  try {
    const userData = {
      name: formData.value.name,
      middle_name: formData.value.middleName,
      last_name: formData.value.lastName,
      user_name: formData.value.userName,
      email: formData.value.email,
      status: formData.value.status === 'Activo' ? 'Active' : 'Inactive',
      role_id: selectedRole.value ? parseInt(selectedRole.value) : null,
      company_id: 1,
      password: formData.value.password,
      created_at: new Date().toISOString(),
      created_by: 1,
      deleted_at: "",
      deleted_by: 0
    };

    let response;
    if (props.id === 0) {
      response = await API.users.createUser(userData);
    } else {
      if (formData.value.password === '********') {
        delete userData.password;
      }
      response = await API.users.updateUser(props.id, userData);
    }

    // Check if response exists and has data property
    if (response && response.data) {
      await Swal.fire({
        title: 'Success',
        text: `User ${props.id === 0 ? 'created' : 'updated'} successfully`,
        icon: 'success',
        timer: 1500
      });

      router.push({ name: 'Users' });
    } else {
      throw new Error(response.data.message || 'Failed to save user');
    }
  } catch (error) {
    console.error('Error saving user:', error);
    Swal.fire({
      title: 'Error',
      text: error.response?.data?.message || `Failed to ${props.id === 0 ? 'create' : 'update'} user`,
      icon: 'error'
    });
  } finally {
    loading.value = false;
  }
}

async function handleDelete() {
  try {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      loading.value = true;
      const response = await API.users.deleteUser(props.id);

      if (response.data.success) {
        await Swal.fire({
          title: 'Deleted!',
          text: 'User has been deleted successfully.',
          icon: 'success',
          timer: 1500
        });
        
        router.push({ name: 'Users' });
      } else {
        throw new Error(response.data.message || 'Failed to delete user');
      }
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    Swal.fire({
      title: 'Error',
      text: error.response?.data?.message || 'Failed to delete user',
      icon: 'error'
    });
  } finally {
    loading.value = false;
  }
}

// Event handlers
// const handleModulesCbo = (newValue) => {
//   selectedValues.value = newValue;
//   formData.value.modules = Array.isArray(newValue) ? newValue : [newValue];
// };
const handleModulesCbo = (newValue) => {
  selectedValues.value = newValue;
  formData.value.modules = newValue ? [newValue] : [];
};
// const handleUserTypeChange = (value) => {
//   selectedUserType.value = value[0]?.value;
//   fetchMarkets();
// };

const handleMarketsChange = (value) => {
  selectedMarket.value = value;
};

// Lifecycle hooks
onMounted(() => {
  fetchRoles();
  fetchUserData();
});

async function createOptionGeneral(field, value) {
  if (field === 'role') {
    await submitRole(value.name);
    // Forzar recarga de roles después de crear uno nuevo
    await fetchRoles();
  }
}
</script>

<template>
    <CContainer>

      <div style="display: flex; justify-content: right;">
        <div>
          <router-link :to="{ name: 'Users' }">
            <CButton color="primary" variant="outline">
              <CIcon :content="cilArrowCircleLeft" size="sm" />
              Return
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
                v-model="formData.name"
                :class="{'is-invalid': formData.name.trim() === ''}"
                aria-label="default input example"
              />
              <div v-if="formData.name.trim() === ''" class="invalid-feedback">
                This field is required
              </div>
            </CCol>
            <CCol>
              <CFormInput 
                type="text"
                label="Middle Name" 
                placeholder="Middle name" 
                v-model="formData.middleName"
                aria-label="default input example"
              />
            </CCol>
            <CCol>
                <CFormInput type="text"
                label="Last Name *" 
                placeholder="lastName" 
                v-model="formData.lastName"
                :class="{'is-invalid': formData.lastName.trim() === ''}"
                aria-label="default input example"/>
                <div v-if="formData.lastName.trim() === ''" class="invalid-feedback">
                  This field is required
                </div>
            </CCol>
            <CCol>
              <MSelect
                label="Select Role *"
                :options="userRoles"
                v-model="selectedRole"
                @update:modelValue="handleRoleChange"
                @submitOption="value => createOptionGeneral('role', value)"
                create-option
                size="sm"
                required
              />               
            </CCol>
            <CCol>
              <MSelect
                v-if="selectedUserType === '5'"
                label="Select Markets *"
                :options="marketsCbo"
                v-model="selectedMarket"
                @update:modelValue="handleMarketsChange"
                size="sm"
                required
              />
            </CCol>

            <CCol>
            </CCol>
            <CCol>
              <!-- <MSelect 
                label="Select Admin Modules"
                :options="modulesCbo"
                v-model="selectedValues"
                @update:modelValue="handleModulesCbo"
                size="sm"
              /> -->
            </CCol>
            </CCol>
            <CCol :md="6">
              
            <CCol>
                <CFormInput 
                type="text"
                label="UserName *" 
                placeholder="userName" 
                v-model="formData.userName"
                :class="{'is-invalid': formData.userName.trim() === ''}"
                aria-label="default input example"
                required
                />
                <div v-if="formData.userName.trim() === ''" class="invalid-feedback">
                  This field is required
                </div>
            </CCol>
            <CCol>
              <div style="">
                <CFormInput
                  label="Password *" 
                  type="password"
                  v-model="formData.password"
                  :class="{'is-invalid': formData.password.trim() === ''}"
                  id="inputPassword"
                />
                <div v-if="formData.password.trim() === ''" class="invalid-feedback">
                  This field is required
                </div>
              </div>

            </CCol>
            <CCol v-if="props.id == 0 || props.id === ''">
              <CFormInput
                label="Confirm Password"
                type="password"
                v-model="formData.confirmPassword"
                :class="{'is-invalid': formData.confirmPassword.trim() === ''}"
                id="confirmInputPassword"
                :invalid="!isPasswordMatch"
                :feedback="isPasswordMatch ? 'Passwords match' : 'Passwords do not match'"
              />
              <div v-if="formData.confirmPassword.trim() === ''" class="invalid-feedback">
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
                    name="status" 
                    id="statusActive" 
                    value="Activo"
                    label="Activo"
                    :checked="formData.status === 'Activo'"
                    @change="formData.status = 'Activo'"
                  />
                  <CFormCheck 
                    inline 
                    type="radio" 
                    name="status" 
                    id="statusInactive" 
                    value="Inactivo"
                    label="Inactivo"
                    :checked="formData.status === 'Inactivo'"
                    @change="formData.status = 'Inactivo'"
                  />    
                </div>
              </div>
            </CCol>
            <CCol>
              <CFormInput
                type="email"
                label="Email *"
                placeholder="email@example.com"
                v-model="formData.email"
                :class="{'is-invalid': !isValidEmail || formData.email.trim() === ''}"
                aria-label="email input"
              />
              <div v-if="formData.email.trim() === ''" class="invalid-feedback">
                This field is required
              </div>
              <div v-else-if="!isValidEmail" class="invalid-feedback">
                Please enter a valid email address
              </div>
            </CCol>
            </CCol>
        </CRow>
        <CRow>
            <template v-if="props.id != 0 && props.id !== ''">
              <div style="display: flex; justify-content: center;padding:1rem">
                <CButton color="danger" variant="outline" @click="handleDelete()" style="margin-right: 1rem;">
                  <CIcon :content="cilTrash" size="sm" />
                  Delete Employee
                </CButton>
                <CButton 
                  color="primary" 
                  variant="outline" 
                  @click="handleSubmit">
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
                @click="handleSubmit" >Save</CButton>
              </div>
            </template>
        </CRow>
    </CContainer>
</template>