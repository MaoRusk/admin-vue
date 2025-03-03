<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router'
import ReitMortgageForm from './ReitMortgageForm.vue'

const route = useRoute()
const reitMortgageId = computed(() => Number(route.params.reitMortgageId) || null)
</script>
<template>
  <div>
    <ReitMortgageForm  :reitMortgageId="reitMortgageId" />
  </div>
</template>