<script setup>
import { ref, reactive, watch } from 'vue';
import VueSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'

defineOptions({
  inheritAttrs: false
})
const props = defineProps({
  required: { type: Boolean, default: false },
  // modal props
  editOptions: { type: Boolean, default: false },
  modalTitle: { type: String, default: 'Option' },
  btnTextSubmit: { type: String, default: 'Save' },
})

const emit = defineEmits(['submitOption', 'deleteOption'])

const showModal = ref(false)
const isEditing = ref(false)
const form = reactive({})

async function onSubmit() {
  emit('submitOption', form, isEditing.value)
  showModal.value = false
}

function startEdit(option) {
  isEditing.value = true
  Object.keys(option).forEach(key => form[key] = option[key]);
  showModal.value = true
}

watch(showModal, (value) => {
  if (!value) {
    isEditing.value = false
    // Reset form
    Object.keys(form).forEach(key => delete form[key]);
  }
})
</script>
<template>
  <div class="market-analysis-wrapper-select">
    <div class="market-analysis-wrapper-select-group d-flex align-items-center">
      <VueSelect
        class="ma-select flex-grow-1"
        v-bind="$attrs"
      >
        <template v-if="props.required" #search="{attributes, events}">
          <input
            class="vs__search"
            :required="Array.isArray($attrs.modelValue) ? !$attrs.modelValue.length : !$attrs.modelValue"
            v-bind="attributes"
            v-on="events"
          />
        </template>
        <template v-if="props.editOptions" #option="slotProps">
          <li class="d-flex">
            <div class="flex-grow-1">{{ slotProps.name }}</div>
            <button
              class="btn btn-sm p-0"
              @click.stop.prevent="startEdit(slotProps)"
            >
              <CIcon icon="cilPencil" size="sm" />
            </button>
          </li>
        </template>
        <template v-for="(slotFn, name) in $slots" v-slot:[name]="slotProps">
          <slot :name="name" v-bind="slotProps" />
        </template>
      </VueSelect>
      <button v-if="props.editOptions" :disabled="$attrs?.disabled ?? false" class="btn btn-secondary btn-edit-options" type="button" @click="showModal = true;">+</button>
    </div>

    <CModal
      :visible="showModal"
      @close="() => { showModal = false }"
      alignment="center"
      teleport
      v-if="props.editOptions"
    >
      <CModalHeader>
        <CModalTitle>{{ isEditing ? 'Edit' : 'Create' }} {{ props.modalTitle }}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <form @submit.prevent="onSubmit" @reset="showModal = false">
          <div v-if="$slots['form-modal']" class="row">
            <slot name="form-modal" :form="form" :isEditing="isEditing" />
          </div>
          <div v-else class="row">
            <div class="col">
              <CFormInput
                v-model="form.name"
                label="Name"
                type="text"
                placeholder="write a value"
                required
              />
            </div>
          </div>

          <div class="row mt-3">
            <div class="col d-flex justify-content-between align-items-center">
              <div>
                <CButton color="success" type="submit" class="text-white fw-bold me-2">
                  {{ props.btnTextSubmit }}
                </CButton>
                <CButton color="dark" type="reset" class="fw-bold">Cancel</CButton>
              </div>
              <div v-if="isEditing">
                <CButton color="danger" type="button" class="fw-bold" @click="emit('deleteOption', form); showModal = false">
                  <CIcon icon="cilTrash" size="sm" class="me-1" />
                  Delete
                </CButton>
              </div>
            </div>
          </div>
        </form>
      </CModalBody>
    </CModal>
  </div>
</template>

<style scoped>
:deep() {
  --vs-controls-color: var(--cui-body-color);
  --vs-border-color: var(--cui-border-color);
  --vs-font-size: 0.9375rem;

  --vs-dropdown-bg: var(--cui-body-bg);
  --vs-dropdown-color: var(--cui-body-color);
  --vs-dropdown-option-color: var(--cui-body-color);

  --vs-selected-bg: var(--cui-body-bg);
  --vs-selected-color: var(--cui-body-color);

  --vs-search-input-color: var(--cui-body-color);

  --vs-dropdown-option--active-bg: #5897fb;
  --vs-dropdown-option--active-color: var(--cui-body-bg);
}
.ma-select {
  background: var(--cui-body-bg);
}
.market-analysis-wrapper-select-group .btn-edit-options {
  padding: 4px 12px;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}
</style>