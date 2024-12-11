<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import Swal from 'sweetalert2';
import { cilX, cilPlus } from '@coreui/icons'
import axios from 'axios';
import { useRouter } from 'vue-router'
import { Class, IndustrialPark, Status, Owner, Developer, Type, Region, LoadingDoor, Deal, Currency, Tenancy, ListingBroker } from '../../../assets/json/loadCats'

const selectedStatus = ref(null)
const SelectedIndustrialPark = ref(null)

const contact = ref('');
const phone = ref('');
const emailUsername = ref('');
const emailServer = ref('');
const comments = ref('');

const getFormData = () => {
  return {
    contact: contact.value,
    phone: phone.value,
    email: `${emailUsername.value}@${emailServer.value}`,
    comments: comments.value,
  };
};

defineExpose({
  getFormData
});

</script>

<template>
  <!-- <CContainer> -->
    <CRow>
      <CCol :md="6">
       <!-- Name -->
       <div class="mt-2">
          <CFormInput 
          type="text"           
          v-model="contact"
          placeholder="Contact"  
          label="Contact"
          />
        </div>
         <!-- PHONE -->
         <div class="mt-2">
          <CFormInput 
          type="number" 
          v-model="phone"
          class="no-spinner"
          @wheel.prevent
          @touchstart.prevent
          @touchmove.prevent
          placeholder="Phone"  
          label="Phone"
          />
        </div>
         <!-- EMAIL -->
         <div class="mt-2">
            <label> Email </label>
          <CInputGroup class="mb-3 mt-2">
            <CFormInput placeholder="Username" v-model="emailUsername" aria-label="Username"/>
            <CInputGroupText>@</CInputGroupText>
            <CFormInput placeholder="Server" v-model="emailServer" aria-label="Server"/>
          </CInputGroup>
        </div>
         <!-- COMMENTS -->
         <div class="mt-2">
            <label> Comments </label>
            <CInputGroup>
                <CFormTextarea aria-label="With textarea" v-model="comments"></CFormTextarea>
            </CInputGroup>
        </div>
      </CCol>
    </CRow>
  <!-- </CContainer> -->
</template>