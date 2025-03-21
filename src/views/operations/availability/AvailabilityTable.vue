<script>

  import axios from 'axios';

  // const check = (event, id) => {
  //   if (event.target.checked) {
  //     selected.value = [...selected.value, id]
  //   } else {
  //     selected.value = selected.value.filter((itemId) => itemId !== id)
  //   }
  // }

  export default {

    data() {

      return {
        availability: [],
        details: [],
        columns: [
          // { key: 'select', label: '', filter: false, sorter: false, _style: { width: '3%' }},
          { key: 'CLASS', label: 'Class',  _style: { width: '3%' }},
          { key: 'BUILDING NAME', label: 'Building Name',  _style: { width: '15%' }},
          { key: 'BUILDING SIZE (SF)', label: 'Building Size (SF)',  _style: { width: '10%' }},
          { key: 'AVAILABLE (SF)', label: 'Available (SF)',  _style: { width: '10%' }},
          { key: 'MINIMUM SPACE (SF)', label: 'Minimum Space (SF)',  _style: { width: '10%' }},
          { key: 'EXPANSION UP TO (SF)', label: 'Expansion Up To (SF)',  _style: { width: '10%' }},
          { key: 'INDUSTRIAL PARK', label: 'Industrial Park',  _style: { width: '10%' }},
          { key: 'CLEAR HEIGHT', label: 'Clear Height',  _style: { width: '10%' }},
          { key: 'DOCK DOORS', label: 'Dock Doors',  _style: { width: '10%' }},
          { key: 'DRIVE IN DOOR', label: 'Drive In Door',  _style: { width: '10%' }},
          // { key: 'FLOOR THICKNESS', label: 'Floor Thickness',  _style: { width: '4%' }},
          // { key: 'STATUS', label: 'Status',  _style: { width: '4%' }},
          // { key: 'OWNER', label: 'Owner',  _style: { width: '4%' }},
          // { key: 'DEVELOPER', label: 'Developer',  _style: { width: '4%' }},
          // { key: 'BUILDER', label: 'Builder',  _style: { width: '4%' }},
          // { key: 'TYPE', label: 'Type',  _style: { width: '4%' }},
          // { key: 'MARKET', label: 'Market',  _style: { width: '4%' }},
          // { key: 'SUBMARKET', label: 'SubMarket',  _style: { width: '4%' }},
          // { key: 'DEAL', label: 'Deal',  _style: { width: '4%' }},
          // { key: 'SINGLE OR MULTITENANT', label: 'Single Or Multitenant',  _style: { width: '4%' }},
          // { key: 'LISTING BROKER', label: 'Listing Broker',  _style: { width: '4%' }},
          // { key: 'COMMENTS', label: 'Comments',  _style: { width: '4%' }},
          // { key: 'CRANE', label: 'Crane',  _style: { width: '4%' }},
          // { key: 'HVAC', label: 'HVAC',  _style: { width: '4%' }},
          // { key: 'actions', label: 'Actions', _style: { width: '15%' } }
        ]
      };
    },

    created() {
      this.fetchAvailability();
    },

    methods: {

      fetchAvailability() {

        axios.get('https://laravel-back-production-9320.up.railway.app/api/excel-data').then(response => {

          this.availability = response.data;

        }).catch(error => {
          Swal.fire({
            title: "Error!",
            text: "Hubo un error obteniendo los datos.",
            icon: "error",
            showConfirmButton: false,
            timer: 1500
          });
        });
      },

      getBadge(status) {
        switch (status) {
          case 'Activo': return 'success';
          case 'Inactivo': return 'danger';
        }
      },

      viewDetails(item) {
        this.$router.push({ name: 'Availability Detail', params: { id: Number(item.id) } });
      },

      newAvailability(){
        this.$router.push({ name: 'Availability Detail', params: { id: 0 } });
      },

      colorStyle(color) {
        return {
          backgroundColor: color,
          width: '50%',
          height: '100%',
          display: 'block',
          borderRadius: '4px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }
      }
    }
  };
  
</script>

<template>
  <CCard class="mb-4">
    <CRow>
      <CCol :xs="12" :xl="10">&nbsp;</CCol>
      <CCol :xs="12" :xl="2">
        <CCardBody>
          <CButton color="primary" @click="newAvailability()">
            <CIcon icon="cilCloudUpload" class="me-2" />Upload
          </CButton>
        </CCardBody>
      </CCol>
    </CRow>
  </CCard>

  <CCard class="mb-4">

    <CCardBody>
      <CSmartTable
        clickableRows
        :tableProps="{
          striped: true,
          hover: true,
          style: { overflowX: 'auto' }
        }"
        :active-page="1"
        header
        :items="availability"
        :columns="columns"
        tableFilter
        cleaner
        items-per-page-select
        :items-per-page="10"
        pagination
      >
        <!-- * CONTENIDO ADICINAL -->
      </CSmartTable>
    </CCardBody>
  </CCard>
</template>