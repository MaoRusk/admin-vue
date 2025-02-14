<script>
  import { defineComponent } from 'vue';
  import Swal from 'sweetalert2';
  import { ROUTE_NAMES } from '@/router/routeNames';
  import { API } from '@/services';
  import ContactForm from './components/ContactForm.vue';
  import ContactsTable from './components/ContactsTable.vue';

  export default defineComponent({
    name: 'CompanyDetail',
    components: {
      ContactForm,
      ContactsTable,
    },
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
        },
        activeTab: '1',
        contacts: [],
        newContact: {
          contact_name: '',
          contact_email: '',
          contact_phone: '',
          contact_comments: '',
          is_company_contact: 1,
        },
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
      if (!this.isNew) {
        this.loadContacts();
      }
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

      async loadContacts() {
        try {
          const response = await API.contacts.getContacts(this.id);
          this.contacts = response.data.data;
        } catch (error) {
          console.error('Error loading contacts:', error);
        }
      },

      async saveContact() {
        try {
          if (this.newContact.id) {
            await API.contacts.updateContact(this.id, this.newContact.id, this.newContact);
          } else {
            await API.contacts.createContact(this.id, this.newContact);
          }
          this.loadContacts();
          this.resetContactForm();
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: `Contact ${this.newContact.id ? 'updated' : 'created'} successfully`,
            toast: true,
            position: 'bottom',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
          });
        } catch (error) {
          console.error('Error saving contact:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Error saving contact',
            toast: true,
            position: 'bottom',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
          });
        }
      },

      async deleteContact(contactId) {
        try {
          await API.contacts.deleteContact(this.id, contactId);
          this.loadContacts();
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Contact deleted successfully',
            toast: true,
            position: 'bottom',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
          });
        } catch (error) {
          console.error('Error deleting contact:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Error deleting contact',
            toast: true,
            position: 'bottom',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
          });
        }
      },

      editContact(contact) {
        this.newContact = { ...contact };
      },

      resetContactForm() {
        this.newContact = {
          contact_name: '',
          contact_email: '',
          contact_phone: '',
          contact_comments: '',
          is_company_contact: 1,
        };
      },

      handleSaveContact(contactData) {
        this.newContact = contactData;
        this.saveContact();
      },

      goToCompanies() {
        this.$router.push({ name: ROUTE_NAMES.COMPANIES });
      },
    },
  });
</script>

<template>
  <div>
    <!-- Botón de retorno -->
    <div class="mb-3" style="text-align: -webkit-right;">
      <CButton 
        color="primary" 
        variant="outline"
        @click="goToCompanies"
        class="d-flex align-items-center gap-2"
      >
        <CIcon icon="cil-arrow-left" />
        Back to Companies
      </CButton>
    </div>

    <CCard class="mb-4">
      <CCardHeader>
        <strong>{{ isNew ? 'New Company' : 'Edit Company' }}</strong>
      </CCardHeader>
      <CCardBody>
        <CTabs v-model="activeTab">
          <CNav variant="tabs">
            <CNavItem>
              <CNavLink :active="activeTab === '1'" @click="activeTab = '1'">
                Company Information
              </CNavLink>
            </CNavItem>
            <CNavItem v-if="!isNew">
              <CNavLink :active="activeTab === '2'" @click="activeTab = '2'">
                Contacts
              </CNavLink>
            </CNavItem>
          </CNav>
          
          <CTabContent>
            <!-- Company Information Tab -->
            <CTabPane :visible="activeTab === '1'">
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
            </CTabPane>

            <!-- Contacts Tab -->
            <CTabPane :visible="activeTab === '2'" v-if="!isNew">
              <div class="mt-4">
                <ContactForm
                  :contact="newContact"
                  @save="handleSaveContact"
                  @cancel="resetContactForm"
                />
                <div class="mt-4">
                  <ContactsTable
                    :contacts="contacts"
                    @edit="editContact"
                    @delete="deleteContact"
                  />
                </div>
              </div>
            </CTabPane>
          </CTabContent>
        </CTabs>
      </CCardBody>
    </CCard>
  </div>
</template>

<style scoped>
@media (max-width: 768px) {
  .mb-3 {
    margin-bottom: 1rem !important;
  }
  
  .gap-2 {
    gap: 0.5rem !important;
  }
}
</style>
