<script setup>
  import { ref, onMounted, computed, watch } from 'vue';
  import Swal from 'sweetalert2';
  import { cilTrash, cilPencil } from '@coreui/icons'
  import axios from 'axios';
  import { useRouter } from 'vue-router'

  const router = useRouter()

  const props = defineProps({
    id: {
        type: Number,
        required: true
      },
  });

  const companiesCbo = ref([]);
  const name = ref('Miriam');
  const lastName = ref('Herrera');
  const middleName = ref('');
  const userName = ref('MNHR');
  const password = ref('1234');
  const totalScreens = ref('3');
  const status = ref('Activo');
  const position = ref('developer');
  // const email = ref('');
  const selectedCompany = ref('');
  
  const confirmPassword = ref('')

  onMounted(() => {
    if (props.id) {
        fetchCompaniesCbo(props.id);
      }else{
        fetchCompanies();
      }
  });

  const fetchCompanies = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/companies');
      companiesCbo.value = response.data.map(company => ({
        value: company.id,
        label: company.nameCompany,
        selected: false
      }));
    } catch (error) {
      console.error('Hubo un error obteniendo el combo companies:', error);
    }
  };
  
  const fetchCompaniesCbo = async (userId) => {
    try {
      // Llamado de apis en paralelo
      const [userResponse, companiesResponse] = await Promise.all([
        axios.get(`http://localhost:8000/api/user/${userId}`),
        axios.get('http://localhost:8000/api/companies')
      ]);

      const userInfo = userResponse.data;
      const companies = companiesResponse.data;

      // Mapeo de empresa seleccionada
      companiesCbo.value = companies.map(company => ({
        value: company.id,
        label: company.nameCompany,
        selected: company.id === userInfo.companyId
      }));

      name.value          = userInfo.name;
      lastName.value      = userInfo.lastName;
      middleName.value    = userInfo.middleName;
      userName.value      = userInfo.userName;
      totalScreens.value  = userInfo.totalScreens;
      status.value = userInfo.status === "Activo" ? "Activo" : "Inactivo";

    } catch (error) {
      console.error('Hubo un error obteniendo los datos:', error);
    }
  };

  // Validaciones
  const updateStatus = (newStatus) => {
    status.value = newStatus;
  };
  
  const handleCompanyChange = (value) => {
    if (value != 0) {   
      selectedCompany.value = value[0].value;
      console.log("Selected company ID:", selectedCompany.value);
    }
  };
  const isPasswordMatch = computed(() => {
    return password.value === confirmPassword.value
  })

  const isFormValid = computed(() => {
    return (
      name.value.trim() !== '' &&
      lastName.value.trim() !== '' &&
      // email.value.trim() !== '' &&
      totalScreens.value !== '' &&
      position.value.trim() !== '' &&
      userName.value.trim() !== '' &&
      password.value.trim() !== '' &&
      (props.id === 0 || props.id === ''
        ? confirmPassword.value.trim() !== '' && password.value === confirmPassword.value
        : true)
    );
  });

  // Add A New User
  const submitFunction = async () => {
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
          formData.append('companyId', selectedCompany.value);
          formData.append('userTypeId', 2);
          formData.append('totalScreens', totalScreens.value);
          formData.append('status', status.value);
  
          axios.post('http://localhost:8000/api/user', formData).then(response => {
            Swal.fire({
              title: "Added!",
              text: "User added successfully.",
              icon: "success",
              showConfirmButton: false,
              timer: 1500
            }).then(() => {
              router.push({
                name: 'Polizas',
                params: { id: Number(0) },
              })
            });
  
          }).catch(error => {
            Swal.fire({
              title: "Error adding User.",
              text: error.response.data.message,
              icon: "error",
              showConfirmButton: false,
              timer: 2000
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
        formData.append('companyId', selectedCompany.value);
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
            name: 'Polizas',
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
              name: 'Polizas',
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
              <CMultiSelect
                  :multiple="false"
                  label="Select companie *"
                  v-model="selectedCompany"
                  :options="companiesCbo"
                  @change="handleCompanyChange($event)"
                  />
            </CCol>
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
              <CRow>
                <CCol class="mb-4">
                  <CFormInput type="number"
                  label="Total Screens *" 
                  placeholder="totalScreens" 
                  v-model="totalScreens"
                  aria-label="default input example"/>
                </CCol>
                <CCol class="mb-8">
                  <CMultiSelect
                    :multiple="false"
                    label="Select companie *"
                    v-model="selectedCompany"
                    :options="companiesCbo"
                    @change="handleCompanyChange($event)"
                    />
                </CCol>
              </CRow>
            </CCol> 
            </CCol>
            <CCol :md="6">
            <CCol>
                <CFormInput type="text"
                label="Position *" 
                placeholder="Position" 
                v-model="position"
                aria-label="default input example"/>
            </CCol>
            <CCol>
                <CFormInput type="text"
                label="UserName *" 
                placeholder="userName" 
                v-model="userName"
                aria-label="default input example"/>
            </CCol>
            <CCol>
              <CFormInput
                label="Password *"
                type="password"
                v-model="password"
                id="inputPassword"
              />
            </CCol>
            <CCol v-if="props.id === 0 || props.id === ''">
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
                <CFormInput 
                type="file"
                id="formFile" 
                label="Image Profile" />
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
            <template v-if="props.id !== 0 && props.id !== ''">
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
                @click="submitFunction" >Submit</CButton>
              </div>
            </template>
        </CRow>
    </CContainer>
</template>