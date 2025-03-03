<template>
  <div class="wrapper min-vh-100 d-flex flex-row align-items-center">
    <CContainer>
      <CRow class="justify-content-centerr">
        <div class="col">
          <img src="/police-91.svg" alt="police" style="max-height: 70vh;" class="d-block mx-auto">
        </div>
        <CCol md="5">
          <div class="clearfix">
            <h1 class="display-3 me-4 text-center">403</h1>
            <h4 class="pt-3">Oops! We can't find the page you're looking for.</h4>
            <p class="text-body-secondary">
              You don't have permission to access this resource
            </p>
          </div>
          <div class="d-grid">
            <CButton color="primary" @click="this.$router.go(-2)">Back</CButton>
          </div>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>
