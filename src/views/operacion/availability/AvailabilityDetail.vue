<script>
  import axios from 'axios';
  import Swal from 'sweetalert2';

  export default {
    props: {
      id: {
        // type: String,
        type: Number,
        required: true
      }
    },

    data() {
      return {
        company: {
          name: '',
          website: '',
          address: '',
          city: '',
          state: '',
          postalCode: '',
          country: '',
          primaryColor: '#4273D7',
          secondaryColor: '#FCFCFC',
          image: {},
        },
        validatedCustom01: null,
      };
    },

    created() {
      this.fetchCompanyDetails();
    },

    methods: {
      fetchCompanyDetails() {

        if (this.id != 0) {
          axios.get(`http://localhost:8000/api/companies/${this.id}`).then(response => {
            this.company = response.data;
          }).catch(error => {
              Swal.fire({
              title: "Error!",
              text: "Error has been ocurred to get the details.",
              icon: "error",
              showConfirmButton: false,
              timer: 1500
            })
          });
        }
      },

      handleImageUpload(event) {
        const file = event.target.files[0];
        this.company.image = file;
      },

      handleSubmitCustom01(event) {
        const form = event.currentTarget
        if (form.checkValidity() === false) {
          event.preventDefault()
          event.stopPropagation()
        } else {
          if (this.id == 0) {
            this.addCompany();
          } else {
            this.updateCompanyDetails();
          }
        }
        this.validatedCustom01 = true
      },

      addCompany() {

        const formData = new FormData();
        formData.append('nameCompany', this.company.nameCompany);
        formData.append('website', this.company.website);
        formData.append('primaryColor', this.company.primaryColor);
        formData.append('secondaryColor', this.company.secondaryColor);
        formData.append('status', 'Activo');
        formData.append('address', this.company.address);
        formData.append('postalCode', this.company.postalCode);
        formData.append('logoUrl', this.company.image);
        formData.append('city', this.company.city);
        formData.append('state', this.company.state);
        formData.append('country', this.company.country);

        axios.post('http://localhost:8000/api/companies', formData).then(response => {
          Swal.fire({
            title: "Added!",
            text: "Company added successfully.",
            icon: "success",
            showConfirmButton: false,
            timer: 1500
          }).then(() => {
            this.$router.push('/operacion/availability');
          });

        }).catch(error => {
          Swal.fire({
            title: "Error!",
            text: "Error adding company.",
            icon: "error",
            showConfirmButton: false,
            timer: 1500
          });
        });
      },

      updateCompanyDetails() {

        const formData = new FormData();

        formData.append('nameCompany', this.company.nameCompany);
        formData.append('website', this.company.website);
        formData.append('primaryColor', this.company.primaryColor);
        formData.append('secondaryColor', this.company.secondaryColor);
        formData.append('status', 'Activo');
        formData.append('address', this.company.address);
        formData.append('postalCode', this.company.postalCode);
        formData.append('city', this.company.city);
        formData.append('state', this.company.state);
        formData.append('country', this.company.country);
        formData.append('_method', "put");

        if (this.company.image) {
          formData.append('logoUrl', this.company.image);
        }

        axios.post(`http://localhost:8000/api/companies/${this.id}`, formData).then(response => {
          Swal.fire({
            title: "Updated!",
            text: "Company updated successfully.",
            icon: "success",
            showConfirmButton: false,
            timer: 1500
          }).then(() => {
            this.$router.push('/operacion/availability');
          });
        }).catch(error => {
          Swal.fire({
            title: "Error!",
            text: "Error updating company.",
            icon: "error",
            showConfirmButton: false,
            timer: 1500
          });
        });
      },

      deleteCompany() {

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
            axios.put(`http://localhost:8000/api/companies/${this.id}/delete`).then(response => {
              Swal.fire({
                title: "Deleted!",
                text: "Company deleted successfully.",
                icon: "success",
                showConfirmButton: false,
                timer: 1500
              }).then(() => {
                this.$router.push('/operacion/availability');
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
      },

      addNewImage() {
        this.company.image = null;
        this.company.logoUrl = null;
      },
    }
  };
</script>

<template>
  <CCard class="mb-4">
    <CRow>
      <CCol :xs="12" :xl="10"></CCol>
      <CCol :xs="12" :xl="2">
        <CCardBody>
          <router-link to="../availability">
            <CButton color="primary" type="submit" variant="outline">
              <CIcon icon="cil-arrow-left" class="me-2" />Go Back
            </CButton>
          </router-link>
        </CCardBody>
      </CCol>
    </CRow>
  </CCard>

  <CCard class="mb-4">
    <CCardBody>
      <CForm 
        class="row g-3 needs-validation" 
        novalidate 
        :validated="validatedCustom01" 
        @submit.prevent="handleSubmitCustom01"
        enctype="multipart/form-data"
      >
        <CCol md="6">
          <CFormLabel for="validationCustomNameCompany">Name Company</CFormLabel>
          <CInputGroup class="has-validation">
            <CFormInput 
              v-model="company.nameCompany"
              id="validationCustomNameCompany"
              aria-describedby="inputGroupPrepend"
              placeholder="Market Analysis"
              required
            />
          </CInputGroup>
        </CCol>
        <CCol md="6">
          <CFormInput 
            v-model="company.website"
            id="validationCustomWebSite"
            label="Web Site"
            placeholder="www.marketanalysis.mx"
            required
          />
        </CCol>

        <CCol md="6" class="mb-3" v-if="!company.logoUrl">
          <CFormLabel for="validationCustomLogo">Image:</CFormLabel>
          <CFormInput
            type="file"
            id="validationCustomLogo"
            aria-label="file example"
            @change="handleImageUpload"
            required
          />
        </CCol>

        <CCol md="6" class="mb-3" v-else>
          <CFormLabel></CFormLabel><br>
          <CAvatar color="secondary" size="xl" :src=company.logoUrl></CAvatar>
          &nbsp;
          <CButton color="primary" @click="addNewImage">
            <CIcon icon="cil-image-plus" class="me-2" />
            Change Image
          </CButton>          
        </CCol>

        <CCol md="3">
          <CFormLabel for="validationCustomPColor">Primary Color:</CFormLabel>
          <CFormInput 
            type="color"
            v-model="company.primaryColor"
            id="validationCustomPColor"
            title="Choose your color"
            style="width: 100%;"
          />
        </CCol>

        <CCol md="3">
          <CFormLabel for="validationCustomSColor">Secondary Color:</CFormLabel>
          <CFormInput 
            type="color"
            v-model="company.secondaryColor"
            id="validationCustomSColor"
            title="Choose your color"
            style="width: 100%;" 
          />
        </CCol>
        
        <CCol md="8">
          <CFormInput 
            v-model="company.address"
            id="address"
            label="Address"
            ref="autocomplete"
            placeholder="Enter address"
            required
          />
        </CCol>

        <CCol md="4">
          <CFormInput 
            v-model="company.postalCode"
            id="postalCode"
            label="Postal Code"
            ref="autocomplete"
            placeholder=""
            required
          />
        </CCol>

        <CCol md="4">
          <CFormInput 
            v-model="company.city"
            id="city"
            label="City"
            ref="autocomplete"
            placeholder=""
            required
          />
        </CCol>

        <CCol md="4">
          <CFormInput 
            v-model="company.state"
            id="state"
            label="State"
            ref="autocomplete"
            placeholder=""
            required
          />
        </CCol>

        <CCol md="4">
          <CFormInput 
            v-model="company.country"
            id="country"
            label="Country"
            ref="autocomplete"
            placeholder=""
            required
          />
        </CCol>

        <CCol :xs="6">
          <!-- * Para Agregar nuevo -->
          <CButton color="success" type="submit" variant="outline" v-if="this.id == 0">
            <CIcon icon="cil-plus" class="me-2" />Add Company
          </CButton>
          <!-- * Para Editar -->
          <CButton color="success" type="submit" variant="outline" v-else>
            <CIcon icon="cil-pencil" class="me-2" />Update Company
          </CButton>          
          &nbsp;
          <CButton color="danger" @click="deleteCompany()" variant="outline" v-if="this.id != 0">
            <CIcon icon="cil-trash" class="me-2" />Delete Company
          </CButton>
        </CCol>
      </CForm>
    </CCardBody>
  </CCard>
</template>
