<script>
  // import { ref } from 'vue'
  import axios from 'axios';

  export default {

    data() {

      return {
        companies: [],
        details: [],
        columns: [
          { key: 'nameCompany', _style: { width: '25%' } },
          { key: 'logoUrl', _style: { width: '15%' } },
          { key: 'primaryColor', _style: { width: '15%' } },
          { key: 'secondaryColor', _style: { width: '15%' } },
          { key: 'status', _style: { width: '15%' } },
          { key: 'actions', _style: { width: '15%' } }
        ]
      };
    },

    created() {
      this.fetchCompanies();
    },

    methods: {

      fetchCompanies() {
        axios.get('http://localhost:8000/api/companies').then(response => {
          this.companies = response.data;
        }).catch(error => {
          console.error('Hubo un error obteniendo las compañías:', error);
        });
      },

      getBadge(status) {
        switch (status) {
          case 'Activo': return 'success';
          case 'Inactivo': return 'danger';
        }
      },

      // ! Esta función ya no se utilizará
      toggleDetails(item) {
        const index = this.details.indexOf(item.id);
        if (index > -1) {
          this.details.splice(index, 1);
        } else {
          this.details.push(item.id);
        }
      },

      viewDetails(item) {
        this.$router.push({ name: 'Empresa Detalle', params: { id: item.id } });
      },

      colorStyle(color) {
        return {
          backgroundColor: color,
          width: '100%',
          height: '100%',
          display: 'block',
          borderRadius: '4px'
        }
      }
      
    }
  };
</script>

<template>
  <CSmartTable
    :active-page="1"
    cleaner
    column-filter
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
  >
    <template #status="{ item }">
      <td>
        <CBadge :color="getBadge(item.status)">{{ item.status }}</CBadge>
      </td>
    </template>

    <template #logoUrl="{ item }">
      <td class="text-center">
        <CImage fluid :src="item.logoUrl" class="d-block mx-auto" style="max-height: 32px;" />
      </td>
    </template>

    <template #primaryColor="{ item }">
      <td>
        <span :style="colorStyle(item.primaryColor)">&nbsp;</span>
      </td>
    </template>

    <template #secondaryColor="{ item }">
      <td>
        <span :style="colorStyle(item.secondaryColor)">&nbsp;</span>
      </td>
    </template>

    <template #actions="{ item }">
      <td class="py-2">
        <CButton color="primary" variant="outline" square size="sm" @click="viewDetails(item)">
          <!-- {{ details.includes(item.id) ? 'Ocultar' : 'Ver Opciones' }} -->
          {{'Details'}}
        </CButton>
      </td>
    </template>

    <!-- <template #details="{ item }">
      <CCollapse :visible="details.includes(item.id)">
        <CCardBody>
          <h4>{{ item.username }}</h4>
          <p class="text-body-secondary">User since: {{ item.registered }}</p>
          <CButton size="sm" color="info" class=""> User Settings </CButton>
          <CButton size="sm" color="danger" class="ml-1"> Delete </CButton>
        </CCardBody>
      </CCollapse>
    </template> -->

  </CSmartTable>
</template>
