<script setup>
import { onMounted, ref } from 'vue'
import { useColorModes } from '@coreui/vue-pro'
import AppHeaderDropdownAccnt from '@/components/AppHeaderDropdownAccnt.vue'
import AppHeaderDropdownMssgs from '@/components/AppHeaderDropdownMssgs.vue'
import { useSidebarStore } from '@/stores/sidebar.js'


const sidebar = useSidebarStore()
const headerClassNames = ref('mb-4 p-0')
const { colorMode, setColorMode } = useColorModes('coreui-pro-vue-admin-template-theme-modern')

onMounted(() => {
  document.addEventListener('scroll', () => {
    if (document.documentElement.scrollTop > 0) {
      headerClassNames.value = 'mb-4 p-0 shadow-sm'
    } else {
      headerClassNames.value = 'mb-4 p-0'
    }
  })
})
</script>

<template>
  <CHeader position="sticky" :class="headerClassNames">
    <CContainer class="px-4" fluid>
      <CHeaderToggler
        :class="['d-lg-none', { 'prevent-hide': !sidebar.visible }]"
        @click="sidebar.toggleVisible()"
        style="margin-inline-start: -14px"
      >
        <CIcon icon="cil-menu" size="lg" />
      </CHeaderToggler>
    
      <CHeaderNav class="d-none d-md-flex ms-auto">
        <AppHeaderDropdownMssgs />
      </CHeaderNav>
      <CHeaderNav class="ms-auto ms-md-0">
        <li class="nav-item py-1">
          <div class="vr h-100 mx-2 text-body text-opacity-75"></div>
        </li>
        <CDropdown variant="nav-item" placement="bottom-end">
          
          <CDropdownMenu>
            
           
          </CDropdownMenu>
        </CDropdown>
        <CDropdown variant="nav-item" placement="bottom-end">
          <CDropdownToggle :caret="false">
            <CIcon v-if="colorMode === 'dark'" icon="cil-moon" size="lg" />
            <CIcon v-else-if="colorMode === 'light'" icon="cil-sun" size="lg" />
            <CIcon v-else icon="cil-contrast" size="lg" />
          </CDropdownToggle>
          <CDropdownMenu>
            <CDropdownItem
              :active="colorMode === 'light'"
              as="button"
              class="d-flex align-items-center"
              type="button"
              @click="setColorMode('light')"
            >
              <CIcon class="me-2" icon="cil-sun" size="lg" /> Light
            </CDropdownItem>
            <CDropdownItem
              :active="colorMode === 'dark'"
              as="button"
              class="d-flex align-items-center"
              type="button"
              @click="setColorMode('dark')"
            >
              <CIcon class="me-2" icon="cil-moon" size="lg" /> Dark
            </CDropdownItem>
            <CDropdownItem
              :active="colorMode === 'auto'"
              as="button"
              class="d-flex align-items-center"
              type="button"
              @click="setColorMode('auto')"
            >
              <CIcon class="me-2" icon="cil-contrast" size="lg" /> Auto
            </CDropdownItem>
          </CDropdownMenu>
        </CDropdown>
        <li class="nav-item py-1">
          <div class="vr h-100 mx-2 text-body text-opacity-75"></div>
        </li>
      </CHeaderNav>
      <CHeaderNav>
        <AppHeaderDropdownAccnt />
      </CHeaderNav>
     
    </CContainer>
  </CHeader>
</template>
