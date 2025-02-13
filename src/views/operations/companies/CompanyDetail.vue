<script>
  import { defineComponent } from 'vue';
  import Swal from 'sweetalert2';
  import { ROUTE_NAMES } from '@/router/routeNames';
  import { API } from '@/services';

  export default defineComponent({
    name: 'CompanyDetail',
    props: {
      id: {
        type: [String, Number],
        required: true,
        validator: (value) => {
          return !isNaN(Number(value)) || value === '0' || value === 0;
        }
      }
    },

    data() {
      return {
        company: {
          name: '',
          website: '',
          primary_color: '#4273D7',
          secondary_color: '#FCFCFC',
          logo_id: null,
          address: '',
          city: '',
          state: '',
          postalCode: '',
          country: '',
          image: {},
          logoUrl: null,
        },
        validatedCustom01: null,
        errors: {
          name: '',
        }
      };
    },

    computed: {
      imageUrl() {
        const logoUrl = this.company.logoUrl
        // Si la URL ya es una URL completa, retornarla directamente
        if (logoUrl && logoUrl.match(/^(http|https):\/\//)) {
          return logoUrl
        }
        // Si es una ruta relativa y no contiene ya la URL base
        else if (logoUrl && !logoUrl.includes('laravel-back-production-9320.up.railway.app')) {
          return `https://laravel-back-production-9320.up.railway.app/storage/${logoUrl}`
        }
        // Si no hay URL, retornar null o una imagen por defecto
        return null
      },
      isNew() {
        return !this.id || this.id === '0' || this.id === 0;
      }
    },

    created() {
      this.loadCompany();
    },

    methods: {
      async loadCompany() {
        if (!this.isNew) {
          try {
            const companyId = Number(this.id);
            if (isNaN(companyId)) {
              throw new Error('Invalid company ID');
            }
            
            const response = await API.companies.getCompany(companyId);
            if (response.data.data) {
              const companyData = response.data.data;
              this.company = {
                ...this.company,
                name: companyData.name,
                website: companyData.website,
                primary_color: companyData.primary_color,
                secondary_color: companyData.secondary_color,
                logo_id: companyData.logo_id,
              };
            }
          } catch (error) {
            console.error('Error loading company:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error!',
              text: 'Error loading company',
              toast: true,
              position: 'bottom',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true
            });
            // Redirigir al listado si hay un error
            this.goBack();
          }
        }
      },

      clearErrors() {
        this.errors = {
          name: '',
        }
      },

      async saveCompany() {
        this.clearErrors()
        try {
          const formData = new FormData()
          formData.append('name', this.company.name)
          formData.append('website', this.company.website)
          formData.append('primary_color', this.company.primary_color)
          formData.append('secondary_color', this.company.secondary_color)

          if (this.company.image instanceof File) {
            formData.append('logo', this.company.image)
          }

          if (this.isNew) {
            await API.companies.createCompany(formData)
            Swal.fire({
              icon: 'success',
              title: 'Created successfully!',
              text: 'New company has been created.',
              toast: true,
              position: 'bottom',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true
            })
          } else {
            formData.append('_method', 'PUT')
            await API.companies.updateCompany(this.id, formData)
            Swal.fire({
              icon: 'success',
              title: 'Updated successfully!',
              text: 'Company has been updated.',
              toast: true,
              position: 'bottom',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true
            })
          }
          this.goBack()
        } catch (error) {
          console.error('Error saving company:', error)
          if (error.response?.data?.errors) {
            this.errors = error.response.data.errors
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error!',
              text: 'Error saving company',
              toast: true,
              position: 'bottom',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true
            })
          }
        }
      },

      handleImageUpload(event) {
        const file = event.target.files[0];
        this.company.image = file;
      },

      addNewImage() {
        this.company.image = null;
        this.company.logoUrl = null;
      },

      goBack() {
        this.$router.push({ name: ROUTE_NAMES.COMPANIES });
      },
    },
  });
</script>

<template>
  <CCard class="mb-4">
    <CCardHeader>
      <strong>{{ isNew ? 'New Company' : 'Edit Company' }}</strong>
    </CCardHeader>
    <CCardBody>
      <CForm @submit.prevent="saveCompany">
        <!-- Basic Information -->
        <div class="mb-4">
          <h6 class="mb-3">Basic Information</h6>
          <CRow>
            <CCol :md="6">
              <CFormInput
                label="Name"
                v-model="company.name"
                :feedback="errors.name"
                :invalid="!!errors.name"
                required
                class="mb-3"
              />
            </CCol>
            <CCol :md="6">
              <CFormInput
                label="Website"
                v-model="company.website"
                placeholder="www.example.com"
                class="mb-3"
              />
            </CCol>
          </CRow>
        </div>

        <!-- Brand Colors -->
        <div class="mb-4">
          <h6 class="mb-3">Brand Colors</h6>
          <CRow>
            <CCol :md="6">
              <div class="mb-3">
                <CFormLabel>Primary Color</CFormLabel>
                <div class="d-flex align-items-center gap-2">
                  <CFormInput
                    type="color"
                    v-model="company.primary_color"
                    id="primaryColor"
                    title="Choose primary color"
                    style="width: 100px"
                  />
                  <span>{{ company.primary_color }}</span>
                </div>
              </div>
            </CCol>
            <CCol :md="6">
              <div class="mb-3">
                <CFormLabel>Secondary Color</CFormLabel>
                <div class="d-flex align-items-center gap-2">
                  <CFormInput
                    type="color"
                    v-model="company.secondary_color"
                    id="secondaryColor"
                    title="Choose secondary color"
                    style="width: 100px"
                  />
                  <span>{{ company.secondary_color }}</span>
                </div>
              </div>
            </CCol>
          </CRow>
        </div>

        <!-- Logo Section -->
        <div class="mb-4">
          <h6 class="mb-3">Company Logo</h6>
          <CRow>
            <CCol :md="12">
              <div class="mb-3">
                <CFormInput
                  type="file"
                  accept="image/*"
                  @change="handleImageUpload"
                  label="Upload Logo"
                />
                <small class="text-muted" v-if="company.logo_id">
                  Current Logo ID: {{ company.logo_id }}
                </small>
              </div>
            </CCol>
          </CRow>
        </div>

        <!-- Action Buttons -->
        <div class="d-flex gap-2 justify-content-end">
          <CButton 
            color="secondary" 
            variant="outline" 
            @click="goBack"
          >
            Cancel
          </CButton>
          <CButton 
            color="primary" 
            type="submit"
          >
            Save
          </CButton>
        </div>
      </CForm>
    </CCardBody>
  </CCard>
</template>
