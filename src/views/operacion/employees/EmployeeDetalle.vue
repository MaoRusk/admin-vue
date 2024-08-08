<script setup>
  import { ref, onMounted, computed, watch } from 'vue';
  import Swal from 'sweetalert2';
  import { cilTrash, cilPencil, cilLowVision } from '@coreui/icons'
  import axios from 'axios';
  import { useRouter } from 'vue-router'

  const router = useRouter()

  const props = defineProps({
    id: {
        type: Number,
        required: true
      },
  });



  const userTypesCbo = ref([]);
  const name = ref('Miriam');
  const lastName = ref('Herrera');
  const middleName = ref('');
  const userName = ref('MNHR');
  const password = ref('qqqq')
  const passwordFieldType = ref("password")
  const passwordVisible = ref(false)
  const totalScreens = ref('3');
  const status = ref('Activo');
  const selectedUserType = ref('');
  
  const confirmPassword = ref('')
  
    // const togglePasswordVisibility = () => {
    //     passwordFieldType.value = passwordFieldType.value === 'password' ? 'text' : 'password'
    // }

  onMounted(() => {
    if (props.id != 0) {
        fetchServices(props.id);
      }else{
        fetchCompanies();
      }
  });

  
  const fetchCompanies = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/user-types`);
      userTypesCbo.value = response.data;

    } catch (error) {
      console.error('Hubo un error obteniendo el combo companies:', error);
    }
  };
  
  
  const fetchServices = async (userId) => {
    try {
      // Llamado de apis en paralelo
      const [userResponse] = await Promise.all([
        axios.get(`http://localhost:8000/api/user/${userId}`),
      ]);

      const userInfo = userResponse.data;

      // const userInfoDetails = userDetailsResponse.data;
      const companies = companiesResponse.data;

      name.value          = userInfo.name;
      lastName.value      = userInfo.lastName;
      middleName.value    = userInfo.middleName;
      userName.value      = userInfo.userName;
      status.value = userInfo.status === "Activo" ? "Activo" : "Inactivo";

    } catch (error) {
      console.error('Hubo un error obteniendo los datos:', error);
    }
  };

  // Validaciones
  const updateStatus = (newStatus) => {
    status.value = newStatus;
  };
  
  const handleUserTypeChange = (value) => {
    if (value != 0) {   
      selectedUserType.value = value[0].value;
      console.log("Selected User type ID:", selectedUserType.value);
    }
  };
  const isPasswordMatch = computed(() => {
    return password.value === confirmPassword.value
  })

  const isFormValid = computed(() => {
    return (
      name.value.trim() !== '' &&
      lastName.value.trim() !== '' &&
      userName.value.trim() !== '' &&
      password.value.trim() !== '' &&
      // isValidEmail.value == 'true' &&
      (props.id == 0 || props.id === ''
        ? confirmPassword.value.trim() !== '' && password.value === confirmPassword.value
        : true)
    );
  });

  // Add A New User
  const submitFunction = async () => {
    if (!isFormValid.value) {
      Swal.fire({
        title: "Lo sentimos!",
        text: "Por favor, rellena todos los campos requeridos o revisa tu email en caso de tenerlo.",
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
          formData.append('password', password.value);
          formData.append('userTypeId', selectedUserType.value);
          formData.append('status', status.value);
  
          axios.post('http://localhost:8000/api/user', formData).then(response => {
            Swal.fire({
              title: "Added!",
              text: "User added successfully.",
              icon: "success",
              showConfirmButton: false,
              timer: 3500
            }).then(() => {
              router.push({
                name: 'Employees',
                params: { id: Number(0) },
              })
            });
  
          }).catch(error => {
            Swal.fire({
              title: "Error adding User.",
              text: error.response.data.message,
              icon: "error",
              showConfirmButton: false,
              timer: 3500
            });
          });
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
        formData.append('middleName', middleName.value);
        formData.append('userName', userName.value);
        formData.append('password', password.value);
        formData.append('companyId', selectedUserType.value);
        formData.append('userTypeId', 2);
        formData.append('totalScreens', totalScreens.value);
        formData.append('status', status.value);
        formData.append('_method', "put");

      axios.post(`http://localhost:8000/api/user/${props.id}`, formData).then(response => {
        Swal.fire({
          title: "Updated!",
          text: "User updated successfully.",
          icon: "success",
          showConfirmButton: false,
          timer: 1500
        }).then(() => {
          router.push({
            name: 'Employees',
            params: { id: Number(0) },
          })
        });
      }).catch(error => {
        Swal.fire({
              title: "Error update User.",
              text: error.response.data.message,
              icon: "error",
              showConfirmButton: false,
              timer: 2000
            });
      });
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
    }).then((result) => {
      if (result.isConfirmed) {
        axios.put(`http://localhost:8000/api/user/${props.id}/delete`).then(response => {
          Swal.fire({
            title: "Deleted!",
            text: "Company deleted successfully.",
            icon: "success",
            showConfirmButton: false,
            timer: 1500
          }).then(() => {
            router.push({
              name: 'Employees',
              params: { id: Number(0) },
            })
          });
          
        }).catch(error => {
          Swal.fire({
            title: "Error!",
            text: "Error deleting company.",
            icon: "error"
          });
        });
      }
    });
    }
</script>
<template>
    <CContainer>
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
                El campo nombre no puede estar vacío
              </div>
            </CCol>
            <CCol>
                <CFormInput type="text"
                label="Last Name *" 
                placeholder="lastName" 
                v-model="lastName"
                :class="{'is-invalid': lastName .trim() === ''}"
                aria-label="default input example"/>
                <div v-if="lastName.trim() === ''" class="invalid-feedback">
                El campo nombre no puede estar vacío
              </div>
            </CCol>
            <CCol>
              <CMultiSelect
                    :multiple="false"
                    label="Select Position *"
                    v-model="selectedUserType"
                    optionsStyle="text"
                    :options="userTypesCbo"
                  @change="handleUserTypeChange"
                    />
            </CCol>

            <CCol>
            </CCol>
            </CCol>
            <CCol :md="6">
            <CCol>
                <CFormInput type="text"
                label="UserName *" 
                placeholder="userName" 
                v-model="userName"
                aria-label="default input example"
                required
                />
            </CCol>
            <CCol>
              <label >Password *</label>
              <div style="display: flex;">
                <CFormInput
                  :type="passwordFieldType"
                  v-model="password"
                  id="inputPassword"
                />
              </div>

            </CCol>
            <CCol v-if="props.id == 0 || props.id === ''">
              <CFormInput
                label="Confirm Password"
                type="password"
                v-model="confirmPassword"
                id="confirmInputPassword"
                :invalid="!isPasswordMatch"
                :feedback="isPasswordMatch ? 'Las contraseñas coinciden' : 'Las contraseñas no coinciden'"
              />
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
                  Delete User
                </CButton>
              <CButton 
              color="primary" 
              variant="outline" 
              @click="updateFunction">
              <CIcon :content="cilPencil" size="sm" />
              Update</CButton>
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