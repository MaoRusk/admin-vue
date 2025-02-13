<script setup>
import { reactive, ref, computed, onMounted } from 'vue';
import { cilPencil, cilTrash } from '@coreui/icons'
import CIcon from '@coreui/icons-vue'
import Swal from 'sweetalert2'
import { API } from '../services'

defineOptions({
  inheritAttrs: false
})
const props = defineProps({
  modelValue: { 
    type: [String, Number, Array],
    default: null 
  },
  options: { type: Array, required: true },
  label: { type: String },
  btnTextSubmit: { type: String, default: 'Create' },
  modalTitle: { type: String, default: 'Create' },
  createOption: { type: Boolean, default: false },
  size: { type: String },
  isDevForm: { type: Boolean, default: false },
  isIndustrialParkForm: { type: Boolean, default: false },
  isIndustryForm: { type: Boolean, default: false },
  marketId: { type: String },
  submarketId: { type: String }
})

const emit = defineEmits(['update:modelValue', 'submitOption', 'editOption', 'deleteOption'])
const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref(null)
const showDropdown = ref(false)

// Modified form for industrial parks
const form = reactive({
  name: '',
  market_id: '',
  submarket_id: '',
  // Keep developer fields but only use them when isDevForm is true
  is_developer: false,
  is_builder: false,
  is_owner: false,
  is_user_owner: false
})

const selectedLabel = computed(() => {
  if (Array.isArray(props.modelValue)) {
    const selected = props.modelValue[0];
    const option = props.options.find(opt => opt.value === selected?.value);
    return option ? option.label : 'Select...';
  }
  const selected = props.options.find(opt => opt.value === props.modelValue);
  return selected ? selected.label : 'Select...';
})

async function onSubmit() {
  try {
    if (props.isIndustryForm) {
      if (isEditing.value) {
        // Update existing industry
        const { data } = await API.industries.updateIndustry(editingId.value, form)
        emit('editOption', { ...form, id: editingId.value })
        // Actualizar el valor seleccionado después de editar
        emit('update:modelValue', editingId.value)
      } else {
        // Create new industry - Solo emitir el form
        emit('submitOption', form)
      }
    } else if (props.isIndustrialParkForm) {
      // Set market and submarket IDs from props
      form.market_id = props.marketId
      form.submarket_id = props.submarketId

      if (isEditing.value) {
        // Update existing industrial park
        const { data } = await API.industrialparks.updateIndustrialPark(editingId.value, form)
        emit('editOption', { ...form, id: editingId.value })
        // Actualizar el valor seleccionado después de editar
        emit('update:modelValue', editingId.value)
      } else {
        // Create new industrial park - Emitir solo el form, no hacer la llamada API aquí
        emit('submitOption', form)
      }
    } else {
      // Existing developer handling code
      if (isEditing.value) {
        emit('editOption', { ...form, id: editingId.value })
      } else {
        emit('submitOption', form)
      }
    }
    
    showModal.value = false
    isEditing.value = false
    editingId.value = null
    showDropdown.value = false
    
    // Reset form
    Object.keys(form).forEach(key => {
      if (typeof form[key] === 'boolean') form[key] = false;
      else form[key] = '';
    });
  } catch (error) {
    console.error('Error submitting:', error)
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.response?.data?.message || 'Error submitting',
    })
  }
}

function startEdit(option) {
  isEditing.value = true
  editingId.value = option.value
  form.name = option.label
  
  if (props.isDevForm) {
    // Handle developer specific fields
    form.is_developer = Boolean(Number(option.is_developer))
    form.is_builder = Boolean(Number(option.is_builder))
    form.is_owner = Boolean(Number(option.is_owner))
    form.is_user_owner = Boolean(Number(option.is_user_owner))
  }
  
  if (props.isIndustrialParkForm) {
    // Handle industrial park specific fields
    form.market_id = props.marketId
    form.submarket_id = props.submarketId
  }
  
  showModal.value = true
}

function selectOption(option) {
  emit('update:modelValue', [{
    value: option.value,
    label: option.label
  }]);
  showDropdown.value = false;
}

async function handleDelete() {
  try {
    let entityType = 'Developer'
    if (props.isIndustrialParkForm) entityType = 'Industrial Park'
    if (props.isIndustryForm) entityType = 'Industry'

    const result = await Swal.fire({
      title: `Delete ${entityType}`,
      text: `Are you sure you want to delete "${form.name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    })

    if (result.isConfirmed) {
      if (props.isIndustryForm) {
        await API.industries.deleteIndustry(editingId.value)
      } else if (props.isIndustrialParkForm) {
        await API.industrialparks.deleteIndustrialPark(editingId.value)
      } else {
        await API.developers.deleteDeveloper(editingId.value)
      }
      
      showModal.value = false
      isEditing.value = false
      editingId.value = null
      showDropdown.value = false
      emit('deleteOption')
      
      Swal.fire({
        icon: 'success',
        title: 'Deleted successfully!',
        text: `${form.name} has been deleted.`,
        toast: true,
        position: 'bottom',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true
      })
    }
  } catch (error) {
    console.error('Error deleting:', error)
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.response?.data?.message || 'Error deleting item',
    })
  }
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
          <button v-if="(props.isDevForm || props.isIndustrialParkForm || props.isIndustryForm) && option.value" 
                  class="btn btn-sm btn-link p-0 ms-2"
                  @click.stop.prevent="startEdit(option)">
            <CIcon :icon="cilPencil" size="sm" />
          </button>
        </div>
      </div>
    </div>

    <CModal
      :visible="showModal"
      @close="() => { showModal = false; isEditing = false }"
      alignment="center"
      teleport
      v-if="props.createOption"
    >
      <CModalHeader>
        <CModalTitle>{{ isEditing ? 'Edit' : props.modalTitle }}</CModalTitle>
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
          
          <!-- Developer specific fields -->
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
            <div class="col d-flex justify-content-between align-items-center">
              <div>
                <CButton color="success" type="submit" class="text-white fw-bold me-2">
                  {{ isEditing ? 'Update' : props.btnTextSubmit }}
                </CButton>
                <CButton color="dark" type="reset" class="fw-bold">Cancel</CButton>
              </div>
              <div v-if="isEditing">
                <CButton color="danger" type="button" class="fw-bold" @click="handleDelete">
                  <CIcon :icon="cilTrash" size="sm" class="me-1" />
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
.hover-bg-light:hover {
  background-color: #f8f9fa;
}
.cursor-pointer {
  cursor: pointer;
}
.btn-link {
  color: #321fdb;
}
.btn-link:hover {
  color: #1b1b1b;
}
</style>