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
          image: null,
          logo: null,
          logo_id: null,
        },
        errors: {
          name: '',
          website: '',
          primary_color: '',
          secondary_color: '',
          logo: '',
        },
        isSubmitting: false,
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
      previewImage() {
        if (this.company.image) {
          return URL.createObjectURL(this.company.image);
        }
        return this.company.logo;
      },
      isNew() {
        return !this.id || this.id === '0' || this.id === 0;
      },
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
            console.log('Loading company with ID:', this.id);
            const response = await API.companies.getCompany(this.id);
            
            if (response.data && response.data.data) {
              const companyData = response.data.data;
              console.log('Loaded company data:', companyData);
              
              this.company = {
                name: companyData.name || '',
                website: companyData.website || '',
                primary_color: (companyData.primary_color || '#4273D7').slice(0, 7),
                secondary_color: (companyData.secondary_color || '#FCFCFC').slice(0, 7),
                logo: companyData.logo || null,
                logo_id: companyData.logo_id || null,
                image: null
              };
            } else {
              throw new Error('Invalid company data structure');
            }
          } catch (error) {
            console.error('Error loading company:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error!',
              text: error.message || 'Error loading company',
              toast: true,
              position: 'bottom',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true
            });
            this.goBack();
          }
        }
      },

      clearErrors() {
        this.errors = {
          name: '',
          website: '',
          primary_color: '',
          secondary_color: '',
          logo: '',
        }
      },

      async saveCompany() {
        try {
          this.clearErrors();
          this.isSubmitting = true;

          const formData = new FormData();
          
          // Asegurarse de que los valores sean strings
          const data = {
            name: String(this.company.name || ''),
            website: String(this.company.website || ''),
            primary_color: String(this.company.primary_color || '#4273D7').slice(0, 7),
            secondary_color: String(this.company.secondary_color || '#FCFCFC').slice(0, 7),
          };

          // Log de datos antes de enviar
          console.log('Data to update:', data);

          // Agregar campos al FormData
          Object.entries(data).forEach(([key, value]) => {
            formData.append(key, value);
          });

          if (!this.isNew) {
            formData.append('_method', 'PUT');
          }

          if (this.company.image instanceof File) {
            formData.append('logo', this.company.image);
          }

          let response;
          if (this.isNew) {
            response = await API.companies.createCompany(formData);
          } else {
            console.log('Updating company with ID:', this.id);
            response = await API.companies.updateCompany(this.id, formData);
          }

          console.log('API Response:', response.data);

          if (response.data.success) {
            // Recargar los datos de la compañía inmediatamente
            if (!this.isNew) {
              await this.loadCompany();
            }

            await Swal.fire({
              icon: 'success',
              title: 'Success!',
              text: `Company ${this.isNew ? 'created' : 'updated'} successfully`,
              toast: true,
              position: 'bottom',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
            });

            // Redirección después de la actualización exitosa
            await this.$router.push({ 
              name: ROUTE_NAMES.COMPANIES_INDEX,
              query: { 
                refresh: Date.now(),
                updated: this.id
              }
            });
          } else {
            throw new Error(response.data.message || 'Update failed');
          }

        } catch (error) {
          console.error('Error details:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
          });
          
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: error.response?.data?.message || error.message || 'An error occurred while saving the company',
            toast: true,
            position: 'bottom',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });
        } finally {
          this.isSubmitting = false;
        }
      },

      triggerFileInput() {
        this.$refs.fileInput.click();
      },

      handleImageUpload(event) {
        const file = event.target.files[0];
        if (file) {
          // Validación básica del archivo
          if (!file.type.startsWith('image/')) {
            this.errors.logo = 'Please upload an image file';
            return;
          }
          if (file.size > 5 * 1024 * 1024) { // 5MB limit
            this.errors.logo = 'Image size should be less than 5MB';
            return;
          }
          this.company.image = file;
          this.errors.logo = '';
        }
      },

      addNewImage() {
        this.company.image = null;
        this.company.logo = null;
        if (this.$refs.fileInput) {
          this.$refs.fileInput.value = '';
        }
      },

      goBack() {
        this.$router.push({ 
          name: ROUTE_NAMES.COMPANIES_INDEX,
          query: { 
            refresh: Date.now() 
          }
        });
      },

      async loadContacts() {
        try {
          const response = await API.contacts.getCompanyContacts(this.id);
          console.log('Contacts response:', response);
          if (response.data.success) {
            this.contacts = response.data.data.filter(contact => contact !== null);
          }
        } catch (error) {
          console.error('Error loading contacts:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Error loading contacts',
            toast: true,
            position: 'bottom',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
          });
        }
      },

      async handleSaveContact(contactData) {
        try {
          if (contactData.id) {
            // Actualizar contacto existente
            await API.contacts.updateContact(this.id, contactData.id, {
              ...contactData,
              company_id: this.id
            });
          } else {
            // Crear nuevo contacto
            contactData.is_company_contact = 1;
            await API.contacts.createContact(this.id, {
              ...contactData,
              company_id: this.id
            });
          }
          
          // Recargar la lista de contactos
          await this.loadContacts();
          
          // Resetear el formulario
          this.resetContactForm();
          
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: `Contact ${contactData.id ? 'updated' : 'created'} successfully`,
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
            text: error.response?.data?.message || 'Error saving contact',
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

      goToCompanies() {
        this.$router.push({ name: ROUTE_NAMES.COMPANIES_INDEX });
      },

      async deleteContact(contact) {
        try {
          const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
          });

          if (result.isConfirmed) {
            await API.contacts.deleteContact(this.id, contact.id);
            await this.loadContacts();
            
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'Contact has been deleted.',
              toast: true,
              position: 'bottom',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true
            });
          }
        } catch (error) {
          console.error('Error deleting contact:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: error.response?.data?.message || 'Error deleting contact',
            toast: true,
            position: 'bottom',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
          });
        }
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
        Return
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
                      <!-- Preview de la imagen actual -->
                      <div v-if="company.logo || company.image" class="mb-3">
                        <div class="logo-preview">
                          <CImage
                            :src="previewImage"
                            alt="Company Logo"
                            rounded
                            thumbnail
                            width="200"
                            height="200"
                            class="company-logo"
                          />
                          <CButton
                            color="danger"
                            variant="outline"
                            size="sm"
                            class="remove-logo"
                            @click="addNewImage"
                          >
                            <CIcon icon="cil-x" />
                          </CButton>
                        </div>
                      </div>

                      <!-- Input para nueva imagen -->
                      <div v-if="!company.logo && !company.image" class="mb-3">
                        <CFormInput
                          type="file"
                          accept="image/*"
                          @change="handleImageUpload"
                          label="Upload Logo"
                          :class="{ 'is-invalid': errors.logo }"
                        />
                        <div v-if="errors.logo" class="invalid-feedback">
                          {{ errors.logo }}
                        </div>
                      </div>

                      <!-- Botón para cambiar imagen -->
                      <div v-if="company.logo || company.image" class="mb-3">
                        <CFormInput
                          type="file"
                          accept="image/*"
                          @change="handleImageUpload"
                          class="d-none"
                          ref="fileInput"
                        />
                        <CButton
                          color="primary"
                          variant="outline"
                          @click="triggerFileInput"
                        >
                          Change Logo
                        </CButton>
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
.logo-preview {
  position: relative;
  display: inline-block;
  margin-bottom: 1rem;
}

.company-logo {
  object-fit: contain;
}

.remove-logo {
  position: absolute;
  top: -10px;
  right: -10px;
  border-radius: 50%;
  padding: 0.25rem;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (max-width: 768px) {
  :deep(.company-logo) {
    width: 150px;
    height: 150px;
  }
}
</style>
