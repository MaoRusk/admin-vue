<script setup>
import { reactive, ref } from 'vue';

defineOptions({
  inheritAttrs: false
})
const props = defineProps({
  modelValue: { type: [String, Number] },
  options: { type: Array, required: true },
  label: { type: String },
  btnTextSubmit: { type: String, default: 'Create' },
  modalTitle: { type: String, default: 'Create' },
  createOption: { type: Boolean, default: false },
  size: { type: String },
})
const emit = defineEmits(['update:modelValue', 'submitOption'])
// select
const showModal = ref(false)
// form modal
const form = reactive({
  name: ''
})
function onSubmit() {
  emit('submitOption', form)
  showModal.value = false
}
</script>
<template>
  <div>
    <label v-if="props.label" class="form-label">{{ props.label }}</label>
    <div class="input-group" :class="{'input-group-sm': props.size === 'sm', 'input-group-lg': props.size === 'lg'}">
      <select
        :value="props.modelValue"
        class="form-select"
        @change="ev => emit('update:modelValue', ev.target.value)"
        v-bind="$attrs"
      >
        <option v-for="option in props.options" :key="option.value" :value="option.value">{{ option.label }}</option>
      </select>
      <button v-if="props.createOption" :disabled="$attrs?.disabled ?? false" class="btn btn-secondary" type="button" @click="showModal = true">+</button>

      <CModal
        :visible="showModal"
        @close="() => { showModal = false }"
        alignment="center"
        teleport
        v-if="props.createOption"
      >
        <CModalHeader>
          <CModalTitle>{{ props.modalTitle }}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <form @submit.prevent="onSubmit" @reset="showModal = false">
            <div class="row">
              <div class="col">
                <CFormInput
                  v-model="form.name"
                  label="Name"
                  type="text"
                  placeholder="write a new value"
                  required
                />
              </div>
            </div>
            <div class="row mt-3">
              <div class="col-auto">
                <CButton color="success" type="submit" class="text-white fw-bold">{{ props.btnTextSubmit }}</CButton>
              </div>
              <div class="col-auto">
                <CButton color="dark" type="reset" class="fw-bold">Cancel</CButton>
              </div>
            </div>
          </form>
        </CModalBody>
      </CModal>
    </div>
  </div>
</template>