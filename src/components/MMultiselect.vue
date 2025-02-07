<script setup>
import { reactive, ref, computed, onMounted } from 'vue';
import { cilPencil, cilTrash, cilX, cilSearch } from '@coreui/icons'
import CIcon from '@coreui/icons-vue'
import Swal from 'sweetalert2'

defineOptions({
  inheritAttrs: false
})

const props = defineProps({
  modelValue: { type: Array, default: () => [] },
  options: { type: Array, required: true },
  label: { type: String },
  size: { type: String },
  placeholder: { type: String, default: 'Select...' }
})

const emit = defineEmits(['update:modelValue'])
const showDropdown = ref(false)
const searchQuery = ref('')

const filteredOptions = computed(() => {
  if (!searchQuery.value) return props.options
  const query = searchQuery.value.toLowerCase()
  return props.options.filter(option => 
    option.name.toLowerCase().includes(query)
  )
})

const selectedLabels = computed(() => {
  return props.modelValue.map(value => {
    const option = props.options.find(opt => opt.id === value.id)
    return option ? option : value
  })
})

const selectedCount = computed(() => selectedLabels.value.length)

function toggleOption(option) {
  const currentSelection = [...props.modelValue]
  const index = currentSelection.findIndex(item => item.id === option.id)
  
  if (index === -1) {
    currentSelection.push(option)
  } else {
    currentSelection.splice(index, 1)
  }
  
  emit('update:modelValue', currentSelection)
}

function isSelected(option) {
  return props.modelValue.some(item => item.id === option.id)
}

function removeOption(option, event) {
  event.stopPropagation()
  const currentSelection = props.modelValue.filter(item => item.id !== option.id)
  emit('update:modelValue', currentSelection)
}

function clearAll() {
  emit('update:modelValue', [])
}

// Close dropdown when clicking outside
onMounted(() => {
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.multiselect-container')) {
      showDropdown.value = false
    }
  })
})
</script>

<template>
  <div class="multiselect-container position-relative">
    <label v-if="props.label" class="form-label d-flex justify-content-between align-items-center">
      {{ props.label }}
      <small v-if="selectedCount" class="text-muted">
        {{ selectedCount }} selected
      </small>
    </label>
    
    <div 
      class="form-control multiselect-input" 
      :class="{'form-control-sm': props.size === 'sm', 'form-control-lg': props.size === 'lg'}"
      @click="showDropdown = !showDropdown"
    >
      <div class="selected-badges">
        <template v-if="selectedLabels.length">
          <span 
            v-for="option in selectedLabels" 
            :key="option.id"
            class="badge bg-primary d-flex align-items-center gap-2"
          >
            {{ option.name }}
            <button 
              type="button"
              class="btn-close btn-close-white btn-close-sm"
              @click="removeOption(option, $event)"
            ></button>
          </span>
        </template>
        <span v-else class="text-muted">{{ placeholder }}</span>
      </div>
    </div>

    <!-- Dropdown Menu -->
    <div 
      v-if="showDropdown" 
      class="position-absolute top-100 start-0 w-100 bg-white border rounded mt-1 z-3 shadow-sm dropdown-menu show"
    >
      <!-- Search and Clear All Header -->
      <div class="dropdown-header d-flex justify-content-between align-items-center p-2 bg-light">
        <div class="search-container flex-grow-1 me-2">
          <div class="input-group input-group-sm">
            <span class="input-group-text bg-white border-end-0">
              <CIcon :icon="cilSearch" size="sm" />
            </span>
            <input
              type="text"
              class="form-control border-start-0"
              v-model="searchQuery"
              placeholder="Search..."
              @click.stop
            >
          </div>
        </div>
        <button 
          v-if="selectedCount"
          class="btn btn-link btn-sm text-danger p-0"
          @click.stop="clearAll"
        >
          Clear all
        </button>
      </div>

      <!-- Options List -->
      <div class="options-container">
        <div 
          v-for="option in filteredOptions" 
          :key="option.id" 
          class="dropdown-item d-flex justify-content-between align-items-center py-2 px-3 hover-bg-light cursor-pointer"
          :class="{ 'active': isSelected(option) }"
          @click="toggleOption(option)"
        >
          <div class="d-flex align-items-center gap-2">
            <input 
              type="checkbox" 
              :checked="isSelected(option)" 
              @click.stop
              class="form-check-input"
            >
            <span>{{ option.name }}</span>
          </div>
        </div>

        <!-- No Results Message -->
        <div 
          v-if="filteredOptions.length === 0" 
          class="dropdown-item text-muted text-center py-3"
        >
          No results found
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.multiselect-container {
  width: 100%;
}

.multiselect-input {
  min-height: 38px;
  max-height: 100px;
  overflow: hidden;
  cursor: pointer;
  padding: 0.375rem 0.75rem;
}

.selected-badges {
  max-height: 85px;
  overflow-y: auto;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-content: flex-start;
  scrollbar-width: thin;
  scrollbar-color: #321fdb #f8f9fa;
}

.selected-badges::-webkit-scrollbar {
  width: 4px;
}

.selected-badges::-webkit-scrollbar-track {
  background: #f8f9fa;
}

.selected-badges::-webkit-scrollbar-thumb {
  background-color: #321fdb;
  border-radius: 2px;
}

.dropdown-menu {
  max-height: 300px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.options-container {
  overflow-y: auto;
  flex-grow: 1;
  scrollbar-width: thin;
  scrollbar-color: #321fdb #f8f9fa;
}

.options-container::-webkit-scrollbar {
  width: 6px;
}

.options-container::-webkit-scrollbar-track {
  background: #f8f9fa;
}

.options-container::-webkit-scrollbar-thumb {
  background-color: #321fdb;
  border-radius: 3px;
}

.hover-bg-light:hover {
  background-color: #f8f9fa;
}

.cursor-pointer {
  cursor: pointer;
}

.badge {
  font-size: 0.875rem;
  font-weight: normal;
  white-space: normal;
  text-align: left;
  margin: 1px;
}

.btn-close-sm {
  font-size: 0.6rem;
}

.dropdown-item {
  cursor: pointer;
}

.dropdown-item.active {
  background-color: #ebedef;
  color: inherit;
}

.dropdown-item:hover {
  background-color: #f8f9fa;
}

.search-container {
  position: sticky;
  top: 0;
  z-index: 1;
}

.input-group-text {
  color: #768192;
}

.form-control:focus {
  border-color: #321fdb;
  box-shadow: none;
}

/* Estilos para el contenedor de badges cuando hay scroll */
.selected-badges {
  padding-right: 4px; /* Espacio para el scrollbar */
}

/* Ajuste para el placeholder cuando no hay selección */
.selected-badges .text-muted {
  margin: 0;
  line-height: 1.5;
}
</style> 