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
        
        <!-- <div class="mt-2 d-flex" style="justify-content: space-evenly;">
            <div style="width: 10rem;">
                <label>HVAC</label>
            </div>
            <CFormCheck type="radio" name="flexRadioHVAC" id="flexRadioHVAC1" label="Yes"/>
            <CFormCheck type="radio" name="flexRadioHVAC" id="flexRadioHVAC2" label="No" checked/>
        </div>
        <div class="mt-2 d-flex" style="justify-content: space-evenly;">
            <div style="width: 10rem;">
                <label>RAIL SPUR</label>
            </div>
            <CFormCheck type="radio" name="flexRadioRAIL" id="flexRadioRAIL1" label="Yes"/>
            <CFormCheck type="radio" name="flexRadioRAIL" id="flexRadioRAIL2" label="No" checked/>
        </div> -->
        <div class="mt-2 d-flex" style="justify-content: space-evenly;">
            <div style="width: 10rem;">
                <label>SPRINKLERS</label>
            </div>
            <CFormCheck type="radio" name="flexRadioSPRINKLERS" id="flexRadioSPRINKLERS1" label="Yes"/>
            <CFormCheck type="radio" name="flexRadioSPRINKLERS" id="flexRadioSPRINKLERS2" label="No" checked/>
        </div>
        <div class="mt-2 d-flex" style="justify-content: space-evenly;">
            <div style="width: 10rem;">
                <label>CROSSDOCK</label>
            </div>
            <CFormCheck type="radio" name="flexRadioCROSSDOCK" id="flexRadioCROSSDOCK1" label="Yes"/>
            <CFormCheck type="radio" name="flexRadioCROSSDOCK" id="flexRadioCROSSDOCK2" label="No" checked/>
        </div>
        <div class="mt-2 d-flex" style="justify-content: space-evenly;">
            <div style="width: 10rem;">
                <label>OFFICE</label>
            </div>

            <CFormCheck type="radio" name="flexRadioOFFICE" id="flexRadioOFFICE1" label="Yes"/>
            <CFormCheck type="radio" name="flexRadioOFFICE" id="flexRadioOFFICE2" label="No" checked/>
        </div>
        <div class="mt-2 d-flex" style="justify-content: space-evenly;">
            <div style="width: 10rem;">
                <label>LEED</label>
            </div>
            <CFormCheck type="radio" name="flexRadioLEED" id="flexRadioLEED1" label="Yes"/>
            <CFormCheck type="radio" name="flexRadioLEED" id="flexRadioLEED2" label="No" checked/>
        </div>
        <div class="mt-2 d-flex" style="justify-content: space-evenly;">
            <div style="width: 10rem;">
                <label>Shared Truck </label>
            </div>


            <CFormCheck type="radio" name="flexRadioShared" id="flexRadioShared1" label="Yes"/>
            <CFormCheck type="radio" name="flexRadioShared" id="flexRadioShared2" label="No" checked/>
        </div>
        <div class="mt-2 d-flex" style="justify-content: space-evenly;">
            <div style="width: 10rem;">
                <label>EXPANSION LAND</label>
            </div>

            <CFormCheck type="radio" name="flexRadioEXPANSION" id="flexRadioEXPANSION1" label="Yes"/>
            <CFormCheck type="radio" name="flexRadioEXPANSION" id="flexRadioEXPANSION2" label="No" checked/>
        </div>
      </CCol>
    </CRow>
  </CContainer>
</template>