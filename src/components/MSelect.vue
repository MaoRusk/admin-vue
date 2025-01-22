<script setup>
import { reactive, ref, computed, onMounted } from 'vue';

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
  isDevForm: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue', 'submitOption', 'editOption'])
const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref(null)
const showDropdown = ref(false)

// Formulario expandido para developers
const form = reactive({
  name: '',
  is_developer: false,
  is_builder: false,
  is_owner: false,
  is_user_owner: false
})

const selectedLabel = computed(() => {
  const selected = props.options.find(opt => opt.value === props.modelValue)
  return selected ? selected.label : 'Select...'
})

function onSubmit() {
  if (isEditing.value) {
    emit('editOption', { ...form, id: editingId.value })
  } else {
    emit('submitOption', form)
  }
  showModal.value = false
  isEditing.value = false
  editingId.value = null
  // Reset form
  Object.keys(form).forEach(key => {
    if (typeof form[key] === 'boolean') form[key] = false;
    else form[key] = '';
  });
}

function startEdit(option) {
  isEditing.value = true
  editingId.value = option.value
  form.name = option.label
  // Convert numeric values to boolean
  form.is_developer = Boolean(Number(option.is_developer))
  form.is_builder = Boolean(Number(option.is_builder))
  form.is_owner = Boolean(Number(option.is_owner))
  form.is_user_owner = Boolean(Number(option.is_user_owner))
  showModal.value = true
}

function selectOption(option) {
  emit('update:modelValue', option.value)
  showDropdown.value = false
}

// Close dropdown when clicking outside
onMounted(() => {
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.position-relative')) {
      showDropdown.value = false
    }
  })
})
</script>

<template>
  <div class="position-relative">
    <label v-if="props.label" class="form-label">{{ props.label }}</label>
    <div class="input-group" :class="{'input-group-sm': props.size === 'sm', 'input-group-lg': props.size === 'lg'}">
      <div class="form-select" @click="showDropdown = !showDropdown">
        {{ selectedLabel }}
      </div>
      <button v-if="props.createOption" :disabled="$attrs?.disabled ?? false" class="btn btn-secondary" type="button" @click="showModal = true">+</button>
      
      <!-- Custom Dropdown -->
      <div v-if="showDropdown" class="position-absolute top-100 start-0 w-100 bg-white border rounded mt-1 z-3">
        <div v-for="option in props.options" 
             :key="option.value" 
             class="d-flex justify-content-between align-items-center p-2 hover-bg-light cursor-pointer"
             @click="selectOption(option)">
          <span>{{ option.label }}</span>
          <button v-if="props.isDevForm && option.value" 
                  class="btn btn-sm btn-outline-primary"
                  @click.stop="startEdit(option)">
            Edit
          </button>
        </div>
      </div>
    </div>

    <CModal
      :visible="showModal"
      @close="() => { showModal = false; isEditing.value = false }"
      alignment="center"
      teleport
      v-if="props.createOption"
    >
      <CModalHeader>
        <CModalTitle>{{ isEditing.value ? 'Edit' : props.modalTitle }}</CModalTitle>
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
          
          <div v-if="props.isDevForm" class="row mt-3">
            <div class="col">
              <CFormCheck
                v-model="form.is_developer"
                label="Is Developer"
              />
              <CFormCheck
                v-model="form.is_builder"
                label="Is Builder"
              />
              <CFormCheck
                v-model="form.is_owner"
                label="Is Owner"
              />
              <CFormCheck
                v-model="form.is_user_owner"
                label="Is User Owner"
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
</template>

<style scoped>
.hover-bg-light:hover {
  background-color: #f8f9fa;
}
.cursor-pointer {
  cursor: pointer;
}
</style>