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

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import httpClient from '../../plugins/axios';
import { ROUTE_NAMES } from '../../router/routeNames';
import { AUTH_TOKEN, AUTH_USER } from '../../constants';
import { useLocalStorage } from '../../composables/useLocalStorage';

const router = useRouter()
const { setItem } = useLocalStorage()

const userName = ref('')
const password = ref('')
const errorMessage = ref('')

async function login() {
  try {
    errorMessage.value = ''
    
    const response = await httpClient.post(`/auth/login`, {
      user_name: userName.value,
      password: password.value
    })

    setItem(AUTH_TOKEN, response.data.access_token)
    setItem(AUTH_USER, response.data.user)

    router.push({ name: ROUTE_NAMES.HOME })
  } catch (err) {
    errorMessage.value = err.response?.data?.message || 'Error al iniciar sesión'
  }
}
</script>
