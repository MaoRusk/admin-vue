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
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

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
      try {
        this.errorMessage = ''
        const response = await axios.post(`${apiBaseUrl}/auth/login`, {
          user_name: this.userName,
          password: this.password
        }, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })

        // Guardar el token en localStorage
        // localStorage.setItem('auth_token', response.data.token)
        
        // Redireccionar al dashboard
        this.$router.push('/')
        
      } catch (err) {
        this.errorMessage = err.response?.data?.message || 'Error al iniciar sesión'
      }
    },
  },
};
</script>
