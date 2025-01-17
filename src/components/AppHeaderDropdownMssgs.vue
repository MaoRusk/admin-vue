<script setup>
import { useTranslation } from 'i18next-vue'

const { t } = useTranslation()
const itemsCount = 7
</script>

<template>
  <CDropdown placement="bottom-end" variant="nav-item">
    <CDropdownToggle :caret="false">
      <span class="d-inline-block my-1 mx-2 position-relative">
        <CIcon icon="cil-envelope-open" size="lg" />
        <CBadge
          color="danger"
          position="top-end"
          shape="rounded-circle"
          class="p-1"
        >
          <span class="visually-hidden">{{ itemsCount }} new alerts</span>
        </CBadge>
      </span>
    </CDropdownToggle>
    <CDropdownMenu class="py-0" style="min-width: 24rem">
      <CDropdownHeader class="bg-body-secondary text-body-secondary fw-semibold rounded-top mb-2">
        {{ t('messagesCounter', { counter: itemsCount }) }}
      </CDropdownHeader>
      <CDropdownItem href="#">
        <div class="d-flex">
          <CAvatar class="flex-shrink-0 my-3 me-3" color="success">A</CAvatar>
          <div class="message text-wrap">
            <div class="d-flex justify-content-between mt-1">
              <div class="small text-body-secondary">Jessica Williams</div>
              <div class="small text-body-secondary">Just now</div>
            </div>
            <div class="fw-semibold">
              <span class="text-danger">!</span> Urgent: System Maintenance Tonight
            </div>
            <div class="small text-body-secondary">
              Attention team, we&#39;ll be conducting critical system maintenance tonight from 10 PM
              to 2 AM. Plan accordingly...
            </div>
          </div>
        </div>
      </CDropdownItem>
      <CDropdownItem href="#">
        <div class="d-flex">
          <CAvatar class="flex-shrink-0 my-3 me-3" color="warning">B</CAvatar>
          <div class="message text-wrap">
            <div class="d-flex justify-content-between mt-1">
              <div class="small text-body-secondary">Richard Johnson</div>
              <div class="small text-body-secondary">5 minutes ago</div>
            </div>
            <div class="fw-semibold">
              <span class="text-danger">!</span> Project Update: Milestone Achieved
            </div>
            <div class="small text-body-secondary">
              Kudos on hitting sales targets last quarter! Let&#39;s keep the momentum. New goals,
              new victories ahead...
            </div>
          </div>
        </div>
      </CDropdownItem>
      <CDropdownItem href="#">
        <div class="d-flex">
          <CAvatar class="flex-shrink-0 my-3 me-3" color="secondary">C</CAvatar>
          <div class="message text-wrap">
            <div class="d-flex justify-content-between mt-1">
              <div class="small text-body-secondary">Angela Rodriguez</div>
              <div class="small text-body-secondary">1:52 PM</div>
            </div>
            <div class="fw-semibold">Social Media Campaign Launch</div>
            <div class="small text-body-secondary">
              Exciting news! Our new social media campaign goes live tomorrow. Brace yourselves for
              engagement...
            </div>
          </div>
        </div>
      </CDropdownItem>
      <CDropdownItem href="#">
        <div class="d-flex">
          <CAvatar class="flex-shrink-0 my-3 me-3" color="success">E</CAvatar>
          <div class="message text-wrap">
            <div class="d-flex justify-content-between mt-1">
              <div class="small text-body-secondary">Jane Lewis</div>
              <div class="small text-body-secondary">4:03 PM</div>
            </div>
            <div class="fw-semibold">Inventory Checkpoint</div>
            <div class="small text-body-secondary">
              Team, it&#39;s time for our monthly inventory check. Accurate counts ensure smooth
              operations. Let&#39;s nail it...
            </div>
          </div>
        </div>
      </CDropdownItem>
      <div class="p-2">
        <CButton color="primary" variant="outline" class="w-100">
          {{t('viewAllMessages')}}
        </CButton>
      </div>
    </CDropdownMenu>
  </CDropdown>
</template>
