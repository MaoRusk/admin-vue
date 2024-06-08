<script>
  import axios from 'axios';

  export default {
    props: {
      id: {
        type: String,
        required: true
      }
    },

    data() {
      return {
        company: null,
        validatedCustom01: null,
        address: {
          city: '',
          satate: '',
          postalCode: '',
          country: '',
        }
      };
      
    },

    mounted() {
      // this.initAutoComplete();
    },

    created() {
      this.fetchCompanyDetails();
    },

    methods: {
      fetchCompanyDetails() {
        axios.get(`http://localhost:8000/api/companies/${this.id}`).then(response => {
          this.company = response.data;
        }).catch(error => {
          console.error('Hubo un error obteniendo los detalles de la compañía:', error);
        });
      },

      handleSubmitCustom01(event) {
        const form = event.currentTarget
        if (form.checkValidity() === false) {
          event.preventDefault()
          event.stopPropagation()
        }
        this.validatedCustom01 = true
      },
      /*
      initAutocomplete() {
        const inputElement = this.$refs.autocomplete; 
        const autocomplete = new google.maps.places.Autocomplete(inputElement, {
          types: ['geocode']
        });
        autocomplete.setFields(['address_component']);
        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          this.address.city = '';
          this.address.state = '';
          this.address.postalCode = '';
          this.address.country = '';

          for (const component of place.address_components) {
            const addressType = component.types[0];
            if (addressType === 'locality') {
              this.address.city = component.long_name;
            } else if (addressType === 'administrative_area_level_1') {
              this.address.state = component.short_name;
            } else if (addressType === 'postal_code') {
              this.address.postalCode = component.long_name;
            } else if (addressType === 'country') {
              this.address.country = component.long_name;
            }
          }
        });
      },
      */
    }
  };
</script>

<template>
  <CCard class="mb-4">
    <CCardBody>
      <CForm 
        class="row g-3 needs-validation" 
        novalidate 
        :validated="validatedCustom01" 
        @submit="handleSubmitCustom01"
      >
        <CCol md="12">
          <CFormInput
            feedbackValid="Looks good!"
            id="validationCustom01"
            label="Name Company"
            placeholder="Market Analysis"
            required
          />
        </CCol>
        <CCol md="6">
          <CFormInput 
            feedbackValid="Looks good!"
            id="validationCustom02" 
            label="Web Site"
            placeholder="www.marketanalysis.mx"
            required
          />
        </CCol>
        <CCol md="6">
          <CFormLabel for="validationCustomUsername">Name Company</CFormLabel>
          <CInputGroup class="has-validation">
            <!-- <CInputGroupText id="inputGroupPrepend">@</CInputGroupText> -->
            <CFormInput 
              id="validationCustomUsername"
              aria-describedby="inputGroupPrepend" 
              placeholder="Market Analysis"
              feedbackInvalid="Please choose a username."
              required
            />
          </CInputGroup>
        </CCol>

        <CCol md="6" class="mb-3">
          <CFormLabel for="validationCustomUsername">Image:</CFormLabel>
            <CFormInput
              type="file"
              id="validationTextarea"
              feedbackInvalid="Example invalid form file feedback"
              aria-label="file example"
              required
            />
        </CCol>

        <CCol md="3">
          <CFormLabel for="validationCustomUsername">Primary Color:</CFormLabel>
          <CFormInput 
            type="color"
            id="validationColorInput"
            value="#4273D7"
            title="Choose your color"
            style="width: 100%;"
          />
        </CCol>

        <CCol md="3">
          <CFormLabel for="validationCustomUsername">Secondary Color:</CFormLabel>
          <CFormInput 
            type="color"
            id="validationColorInput"
            value="#FCFCFC"
            title="Choose your color"
            style="width: 100%;" 
          />
        </CCol>
        
        <CCol md="8">
          <CFormInput 
            feedbackInvalid="Please provide a valid address."
            id="address"
            label="Address"
            ref="autocomplete"
            placeholder="Enter address"
            required
          />
        </CCol>

        <CCol md="4">
          <CFormInput 
            feedbackInvalid=""
            id="portalCode"
            label="Postal Code"
            ref="autocomplete"
            placeholder=""
            required
          />
        </CCol>

        <CCol md="4">
          <CFormInput 
            feedbackInvalid=""
            id="city"
            label="City"
            ref="autocomplete"
            placeholder=""
            required
          />
        </CCol>

        <CCol md="4">
          <CFormInput 
            feedbackInvalid=""
            id="state"
            label="State"
            ref="autocomplete"
            placeholder=""
            required
          />
        </CCol>

        <CCol md="4">
          <CFormInput 
            feedbackInvalid=""
            id="country"
            label="Country"
            ref="autocomplete"
            placeholder=""
            required
          />
        </CCol>

        <CCol :xs="6">
          <CButton color="success" type="submit" variant="outline">Submit form</CButton>
          &nbsp;
          <CButton color="danger" type="submit" variant="outline">Back</CButton>
        </CCol>
      </CForm>
    </CCardBody>
  </CCard>
</template>