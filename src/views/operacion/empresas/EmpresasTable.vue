<script>

  import axios from 'axios';

  const check = (event, id) => {
    if (event.target.checked) {
      selected.value = [...selected.value, id]
    } else {
      selected.value = selected.value.filter((itemId) => itemId !== id)
    }
  }

  export default {

    data() {

      return {
        companies: [],
        details: [],
        columns: [
          { key: 'select', label: '', filter: false, sorter: false, _style: { width: '3%' }},
          { key: 'nameCompany', label: 'Company', _style: { width: '22%' } },
          { key: 'primaryColor', label: 'Primary Color', _style: { width: '15%' } },
          { key: 'secondaryColor', label: 'Secondary Color', _style: { width: '15%' } },
          { key: 'status', label: 'Status', _style: { width: '15%' } },
          { key: 'actions', label: 'Actions', _style: { width: '15%' } }
        ]
      };
    },

    created() {
      this.fetchCompanies();
    },

    methods: {

      fetchCompanies() {

        axios.get('https://laravel-back-production-9320.up.railway.app/api/companies').then(response => {
          this.companies = response.data;

        }).catch(error => {
          Swal.fire({
            title: "Error!",
            text: "Hubo un error obteniendo las compañías.",
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
        this.$router.push({ name: 'Empresa Detalle', params: { id: Number(item.id) } });
      },

      newCompany(){
        this.$router.push({ name: 'Empresa Detalle', params: { id: 0 } });
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
          <CButton color="success" @click="newCompany()">
            <CIcon icon="cil-plus" class="me-2" />New Company
          </CButton>
        </CCardBody>
      </CCol>
    </CRow>
  </CCard>

  <CCard class="mb-4">

    <CCardBody>
      <!-- * PARAMETROS DE SMART-TABLE -->
      <!-- column-filter -->
      <!-- <CSmartTable
        :active-page="1"
        cleaner
        column-sorter
        :columns="columns"
        clickable-rows
        footer
        header
        :items-per-page="10"
        items-per-page-select
        :items="companies"
        pagination
        table-filter
        :table-props="{
          hover: true,
          striped: true,
          responsive: true,
        }"
      > -->
      <CSmartTable
        clickableRows
        :tableProps="{
          striped: true,
          hover: true,
        }"
        :active-page="1"
        header
        :items="companies"
        :columns="columns"
        tableFilter
        cleaner
        items-per-page-select
        :items-per-page="10"
        pagination
      >
        <template #select="{ item }">
          <td>
            <CFormCheck :id="`checkbox${item.id}`" />
          </td>
        </template>
        
        <template #nameCompany="{ item }">
          <td>
            <CAvatar :src="item.logoUrl"/>
            &nbsp;
            <span>{{item.nameCompany}}</span>
          </td>
        </template>
    
        <template #status="{ item }">
          <td class="text-center">
            <CBadge :color="getBadge(item.status)">{{ item.status }}</CBadge>
          </td>
        </template>
    
        <template #primaryColor="{ item }">
          <td class="text-center">
            <span :style="colorStyle(item.primaryColor)">&nbsp;</span>
          </td>
        </template>
    
        <template #secondaryColor="{ item }">
          <td class="text-center">
            <span :style="colorStyle(item.secondaryColor)">&nbsp;</span>
          </td>
        </template>
    
        <template #actions="{ item }">
          <td class="py-2 text-center">
            <CButton color="primary" variant="outline" square size="sm" @click="viewDetails(item)">
              {{'Details'}}
            </CButton>
          </td>
        </template>
    
      </CSmartTable>
    </CCardBody>
  </CCard>
</template>
