<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import Swal from 'sweetalert2';
import { cilX, cilPlus } from '@coreui/icons'
import axios from 'axios';
import { useRouter } from 'vue-router'
import { Class, IndustrialPark, Status, Owner, Developer, Type, Region, LoadingDoor, Deal, Currency, Tenancy, ListingBroker } from '../../../assets/json/loadCats'

const selectedStatus = ref(null)
const SelectedIndustrialPark = ref(null)


</script>

<template>
  <CContainer>
    <CRow>
      <CCol :md="6">
       <!-- Name -->
       <div class="mt-2">
        <div class="clearfix">
            <CImage align="start" rounded src="/images/vue400.jpg" width="200" height="200"/>
            <CImage align="end" rounded src="/images/vue400.jpg" width="200" height="200"/>
        </div>
        </div>
      </CCol>
    </CRow>
  </CContainer>
</template>