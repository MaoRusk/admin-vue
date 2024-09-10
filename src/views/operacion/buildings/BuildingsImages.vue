<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import Swal from 'sweetalert2';
import { cilX, cilPlus } from '@coreui/icons'
import axios from 'axios';
import { useRouter } from 'vue-router'
import { Class, IndustrialPark, Status, Owner, Developer, Type, Region, LoadingDoor, Deal, Currency, Tenancy, ListingBroker } from '../../../assets/json/loadCats'
import { CRow, CTableBody, CTableDataCell, CTableHeaderCell } from '@coreui/vue-pro';

const selectedStatus = ref(null)
const SelectedIndustrialPark = ref(null)
const selectedFiles = ref([]);

// * Función que se ejecuta al seleccionar los archivos
const handleFileChange = (event) => {
  selectedFiles.value = Array.from(event.target.files);
}

// Función para simular la subida de archivos
const uploadFiles = () => {

  let formData = new FormData();
  // Agregar cada archivo individualmente al FormData
  selectedFiles.value.forEach((file) => {
    formData.append('photoTypes[]', file);
  });

  axios.post(`http://localhost:8000/api/buildings/docs/1`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }).then(response => {
    Swal.fire({
      title: response.data.title,
      text: response.data.text,
      icon: response.data.icon,
      showConfirmButton: false,
      timer: 1500
    })

  }).catch(error => {
    Swal.fire({
      title: "Error!",
      text: "Error uploading files.",
      icon: "error",
      showConfirmButton: false,
      timer: 1500
    });
  });
}

</script>

<template>
  <CCard class="mb-4">
    <CContainer>
      <CRow>
        <CCol :md="12"><!-- Name -->
          <CCardBody>
            <div class="mt-2">
              <div class="clearfix">
                <CRow>
                  <CCol :md="12">
                    <CInputGroup>
                      <CFormInput
                        type="file"
                        id="inputGroupFile04"
                        aria-describedby="inputGroupFileAddon04"
                        aria-label="Upload"
                        @change="handleFileChange"
                        multiple/>
                      <CButton
                        v-if="selectedFiles.length"
                        type="button"
                        color="success"
                        variant="outline"
                        id="inputGroupFileAddon04"
                        @click="uploadFiles">Upload Files
                      </CButton>
                    </CInputGroup>
                  </CCol>
                </CRow>
                <br>
                <!-- Mostrar los nombres de los archivos seleccionados -->
                <CRow>
                  <CCol :md="12">
                    <!-- Tabla de los nombres de los archivos -->
                    <CTable v-if="selectedFiles.length" hover>
                      <!-- Table Head -->
                      <CTableHead>
                        <CTableRow>
                          <CTableHeaderCell>#</CTableHeaderCell>
                          <CTableHeaderCell>File Name</CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <!-- Table body -->
                      <CTableBody>
                        <CTableRow v-for="(file, index) in selectedFiles" :key="index">
                          <CTableHeaderCell scope="row">{{index + 1}}</CTableHeaderCell>
                          <CTableDataCell>{{ file.name }}</CTableDataCell>
                        </CTableRow>
                      </CTableBody>
                    </CTable>
                  </CCol>
                </CRow>
              </div>
            </div>
          </CCardBody>
        </CCol>
      </CRow>
    </CContainer>
  </CCard>
</template>