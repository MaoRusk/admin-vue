<script setup>
  import { ref, onMounted, computed } from 'vue';
  import { useRouter } from 'vue-router'
  import { cilArrowCircleLeft, cilBasket } from '@coreui/icons'
  import permissionsModules from './TabPermissions.vue'
  import profile from './TabProfile.vue'

  const router = useRouter()
  const userId = router.user
  
  onMounted(() => {
  console.log('User ID:', userId);
});

</script>
<template>
  <div>
    <div style="display: flex; justify-content: right;">
      <router-link to="../polizas">
        <CButton color="primary" variant="outline">
          <CIcon :content="cilArrowCircleLeft" size="sm" />
          return
        </CButton>
      </router-link>
    </div>

    <CTabs activeItemKey="profile">
      <CTabList variant="tabs">
        <CTab itemKey="profile">Profile</CTab>
        <CTab itemKey="permissions">Permissions</CTab>
      </CTabList>
      <CTabContent>
        <h2>User Details</h2>
    <p>User ID: </p>
    <pre>{{ userId }}</pre>
        <CTabPanel class="p-3" itemKey="profile">
          <!-- Modulo de perfil -->
          <profile /> 
        </CTabPanel>
        <CTabPanel class="p-3" itemKey="permissions">
          <!-- Modulo de permisos -->
          <permissionsModules />
        </CTabPanel>
      </CTabContent>
    </CTabs>
  </div>
</template>