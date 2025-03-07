<script setup>
import { useTranslation } from 'i18next-vue'
import { useRouter } from 'vue-router';
import { ROUTE_NAMES } from '../router/routeNames';
import { useAuthStore } from '../stores/auth';

const { t } = useTranslation()

const router = useRouter()
const authStore = useAuthStore()

const logout = () => {
  authStore.destroyAuth()
  router.push({ name: ROUTE_NAMES.LOGIN })
}
</script>

<template>
  <CDropdown placement="bottom-end" variant="nav-item">
    <CDropdownToggle class="py-0" :caret="false">
      <CAvatar size="md" color="success">A</CAvatar>
    </CDropdownToggle>
    <CDropdownMenu class="pt-0">
    
      <CDropdownHeader as="h6" class="bg-body-secondary text-body-secondary fw-semibold my-2">
        {{ t('settings') }}
      </CDropdownHeader>
      <CDropdownItem> <CIcon icon="cil-user" /> {{ t('profile') }} </CDropdownItem>
      <CDropdownItem @click="logout"> <CIcon icon="cil-lock-locked" /> {{ t('logout') }} </CDropdownItem>
    </CDropdownMenu>
  </CDropdown>
</template>
