<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import { API } from '../../../services';
import MSelect from '../../../components/MSelect.vue';
import { ROUTE_NAMES } from '../../../router/routeNames';
import { useAuthStore } from '../../../stores/auth';

const router = useRouter();
const { can } = useAuthStore()

const props = defineProps({
  id: {
    type: Number,
    required: true
  },
});

const userRoles = ref([]);
const selectedRole = ref(null);  // Mantener como null inicialmente
const loading = ref(false);
const marketsCbo = ref([]);

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
  markets: [],
});

const selectedUserType = ref('');
const selectedMarket = ref(null);

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
    const { data: response } = await API.roles.getRoles();
    console.log('Response from getRoles:', response); // Debug log
    
    if (response.success) {
      userRoles.value = response.data.map(role => ({
        value: role.id.toString(),
        label: role.name,
        guardName: role.guard_name
      }));
      console.log('Processed userRoles:', userRoles.value); // Debug log
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


const handleRoleChange = async (value) => {
  console.log('Role changed to:', value); // Debug log
  selectedRole.value = value;
  console.log('selectedRole.value after change:', selectedRole.value); // Debug log
  
  // Asegurarse de que value es un array y tiene al menos un elemento
  if (Array.isArray(value) && value[0]?.value === '5') {
    await fetchMarkets();
  }
};

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
      const { data: rolesResponse } = await API.roles.getRoles();
      
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

const handleSubmit = async () => {
  if (!isFormValid.value) {
    Swal.fire({
      title: 'Validation Error',
      text: 'Please fill all required fields correctly',
      icon: 'error'
    });
    return;
  }

  try {
    console.log('Selected role before submit:', selectedRole.value);
    
    const userData = {
      name: formData.value.name.trim(),
      middle_name: formData.value.middleName?.trim() || null,
      last_name: formData.value.lastName.trim(),
      user_name: formData.value.userName.trim(),
      email: formData.value.email.trim(),
      status: formData.value.status === 'Activo' ? 'Active' : 'Inactive',
      role_id: selectedRole.value?.[0]?.value ? Number(selectedRole.value[0].value) : null,
      company_id: 1
    };

    console.log('userData being sent:', userData);

    if (isNewRecord.value || formData.value.password !== '********') {
      userData.password = formData.value.password;
      userData.password_confirmation = formData.value.confirmPassword;
    }

    const response = isNewRecord.value
      ? await API.users.createUser(userData)
      : await API.users.updateUser(props.id, userData);

    if (response.status === 200 && response.data) {
      await Swal.fire({
        title: isNewRecord.value ? 'Created!' : 'Updated!',
        text: `User has been ${isNewRecord.value ? 'created' : 'updated'} successfully`,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });

      try {
        await router.push({ 
          name: ROUTE_NAMES.USERS,
          replace: true
        });
      } catch (routerError) {
        window.location.href = '/#/operations/users';
      }
    } else {
      throw new Error('Failed to save user');
    }
  } catch (error) {
    if (error.response?.data?.errors) {
      const errorMessages = Object.entries(error.response.data.errors)
        .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
        .join('\n');
      
      Swal.fire({
        title: 'Validation Error',
        html: errorMessages.replace(/\n/g, '<br>'),
        icon: 'error'
      });
    } else {
      Swal.fire({
        title: 'Error',
        text: error.response?.data?.message || 'Failed to save user',
        icon: 'error'
      });
    }
  }
};

// Agregar método para volver a la lista
const goBack = () => {
  router.push({ 
    name: ROUTE_NAMES.USERS,
    replace: true
  });
};

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
  <CCard>
    <CCardHeader style="text-align: right;">
      <CButton color="primary" variant="outline" @click="goBack">
        <CIcon name="cilArrowCircleLeft" size="sm" />
        Return
      </CButton>
    </CCardHeader>

    <CCardBody>
      <CRow>
        <CCol :md="6">
          <CCard class="mb-4">
            <CCardBody>
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
                <CFormInput 
                  type="text"
                  label="Last Name *" 
                  placeholder="lastName" 
                  v-model="formData.lastName"
                  :class="{'is-invalid': formData.lastName.trim() === ''}"
                  aria-label="default input example"
                />
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
              <CCol v-if="selectedUserType === '5'">
                <MSelect
                  label="Select Markets *"
                  :options="marketsCbo"
                  v-model="selectedMarket"
                  @update:modelValue="handleMarketsChange"
                  size="sm"
                  required
                />
              </CCol>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol :md="6">
          <CCard class="mb-4">
            <CCardBody>
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
                <div class="mb-3">
                  <label for="status">Status</label>
                  <div class="mt-2">
                    <CFormCheck 
                      inline 
                      type="radio" 
                      name="status" 
                      id="statusActive" 
                      value="Activo"
                      label="Active"
                      :checked="formData.status === 'Activo'"
                      @change="formData.status = 'Activo'"
                    />
                    <CFormCheck 
                      inline 
                      type="radio" 
                      name="status" 
                      id="statusInactive" 
                      value="Inactivo"
                      label="Inactive"
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
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CCard class="mb-4">
        <CCardBody>
          <CRow>
            <CCol class="text-center">
              <template v-if="props.id != 0 && props.id !== ''">
                <CButton 
                  v-if="can('users.update')"
                  color="primary" 
                  variant="outline" 
                  @click="handleSubmit"
                  :disabled="!isFormValid"
                  class="mx-2"
                >
                  <CIcon name="cilPencil" size="sm" />
                  Save
                </CButton>
              </template>
              <template v-else>
                <CButton
                  v-if="can('users.create')"
                  color="primary" 
                  variant="outline" 
                  type="submit"
                  @click="handleSubmit"
                  :disabled="!isFormValid"
                  class="mx-2"
                >
                  <CIcon name="cilPlus" size="sm" />
                  Save
                </CButton>
              </template>
              <CButton 
                color="secondary" 
                variant="outline" 
                @click="goBack" 
                class="mx-2"
              >
                Cancel
              </CButton>

            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </CCardBody>
  </CCard>
</template>