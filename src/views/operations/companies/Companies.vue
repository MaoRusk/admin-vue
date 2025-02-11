<script>
import { defineComponent } from 'vue'
import CompaniesTable from './CompaniesTable.vue'
// import SmartTableDownloadableExample from './SmartTableDownloadableExample.vue'
// import SmartTableSelectableExample from './SmartTableSelectableExample.vue'

export default defineComponent({
  name: 'Companies',
  components: {
    CompaniesTable
  }
})
</script>

<template>
  <div>
    <CompaniesTable />
  </div>
</template>
  
