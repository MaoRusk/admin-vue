<template>
  <div class="wrapper min-vh-100 d-flex flex-row align-items-center">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol :md="8">
          <CCardGroup>
            <CCard class="p-4">
              <CCardBody>
                <CForm @submit.prevent="login">
                  <h1>Market Analysis</h1>
                  <p class="text-body-secondary">Sign In to your account</p>
                  <CInputGroup class="mb-3">
                    <CInputGroupText>
                      <CIcon icon="cil-user" />
                    </CInputGroupText>
                    <CFormInput
                      v-model="userName"
                      placeholder="Username"
                      autocomplete="username"
                    />
                  </CInputGroup>
                  <CInputGroup class="mb-4">
                    <CInputGroupText>
                      <CIcon icon="cil-lock-locked" />
                    </CInputGroupText>
                    <CFormInput
                      v-model="password"
                      type="password"
                      placeholder="Password"
                      autocomplete="current-password"
                    />
                  </CInputGroup>
                  <CRow>
                    <CButton color="primary" class="px-4" type="submit"> Login </CButton>
                  </CRow>
                  <!-- Espacio para mostrar mensajes de error -->
                  <p v-if="errorMessage" class="text-danger mt-2">{{ errorMessage }}</p>
                </CForm>
              </CCardBody>
            </CCard>
            <CCard class="text-white bg-primary py-5">
              <CCardBody class="text-center">
                <CImage align="center" rounded src="/src/assets/images/market-logo.jpg" width="300" height="150"/>
              </CCardBody>
            </CCard>
          </CCardGroup>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      userName: '',
      password: '',
      errorMessage: '', // Propiedad para almacenar el mensaje de error
    };
  },
  methods: {
    async login() {

      this.errorMessage = ""

      try {
        const response = await axios.post('http://localhost:8000/api/login', {
          userName: this.userName,
          password: this.password,
        });
        
        sessionStorage.setItem('auth_token', response.data.access_token);

        this.$router.push('/dashboard'); // Redirige a la página de inicio o la que desees

      } catch (error) {
        console.error('Error during login:', error);
        // Verifica el tipo de error para mostrar el mensaje adecuado
        if (error.response && error.response.status === 401) {
          this.errorMessage = 'Username or password incorrect.';
        } else {
          this.errorMessage = 'Login failed. Please check your credentials.';
        }
      }
    },
  },
};
</script>
