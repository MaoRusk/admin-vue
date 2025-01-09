<script setup>
import { useTranslation } from 'i18next-vue'
import avatar from '@/assets/images/avatars/8.jpg'
import { useRouter } from 'vue-router';
import { useLocalStorage } from '../composables/useLocalStorage';
import { AUTH_TOKEN, AUTH_USER } from '../constants';
import { ROUTE_NAMES } from '../router/routeNames';

const { t } = useTranslation()
const { removeItem } = useLocalStorage()
const itemsCount = 42
const router = useRouter()

const logout = () => {
  removeItem(AUTH_TOKEN)
  removeItem(AUTH_USER)
  router.push({ name: ROUTE_NAMES.LOGIN })
}
</script>

<template>
  <CDropdown placement="bottom-end" variant="nav-item">
    <CDropdownToggle class="py-0" :caret="false">
      <CAvatar :src="avatar" size="md" status="success"/>
    </CDropdownToggle>
    <CDropdownMenu class="pt-0">
      <CDropdownHeader
        as="h6"
        class="bg-body-secondary text-body-secondary fw-semibold rounded-top mb-2"
      >
        {{ t('account') }}
      </CDropdownHeader>
      <CDropdownItem>
        <CIcon icon="cil-bell" /> {{ t('updates') }}
        <CBadge color="info-gradient" class="ms-auto">{{ itemsCount }}</CBadge>
      </CDropdownItem>
      <CDropdownItem>
        <CIcon icon="cil-envelope-open" /> {{ t('messages') }}
        <CBadge color="success-gradient" class="ms-auto">{{ itemsCount }}</CBadge>
      </CDropdownItem>
      <CDropdownItem>
        <CIcon icon="cil-task" /> {{ t('tasks') }}
        <CBadge color="danger-gradient" class="ms-auto">{{ itemsCount }}</CBadge>
      </CDropdownItem>
      <CDropdownItem>
        <CIcon icon="cil-comment-square" /> {{ t('comments') }}
        <CBadge color="warning-gradient" class="ms-auto">{{ itemsCount }}</CBadge>
      </CDropdownItem>
      <CDropdownHeader as="h6" class="bg-body-secondary text-body-secondary fw-semibold my-2">
        {{ t('settings') }}
      </CDropdownHeader>
      <CDropdownItem> <CIcon icon="cil-user" /> {{ t('profile') }} </CDropdownItem>
      <CDropdownItem> <CIcon icon="cil-settings" /> {{ t('settings') }} </CDropdownItem>
      <CDropdownItem>
        <CIcon icon="cil-dollar" /> {{ t('payments') }}
        <CBadge color="secondary" class="ms-auto">{{ itemsCount }}</CBadge>
      </CDropdownItem>
      <CDropdownItem>
        <CIcon icon="cil-file" /> {{ t('projects') }}
        <CBadge color="primary-gradient" class="ms-auto">{{ itemsCount }}</CBadge>
      </CDropdownItem>
      <CDropdownDivider />
      <CDropdownItem> <CIcon icon="cil-shield-alt" /> {{ t('lockAccount') }} </CDropdownItem>
      <CDropdownItem @click="logout"> <CIcon icon="cil-lock-locked" /> {{ t('logout') }} </CDropdownItem>
    </CDropdownMenu>
  </CDropdown>
</template>
