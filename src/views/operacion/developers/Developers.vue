<script setup>
import { ref, onMounted, computed } from 'vue'
import { API } from '@/services'
import { useRouter } from 'vue-router'

const router = useRouter()
const developers = ref([])
const loading = ref(false)
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = 20

const filteredDevelopers = computed(() => {
  return developers.value.filter(developer => 
    developer.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    developer.id.toString().includes(searchQuery.value)
  )
})

const totalPages = computed(() => Math.ceil(filteredDevelopers.value.length / itemsPerPage))
const paginatedDevelopers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredDevelopers.value.slice(start, end)
})

const fetchDevelopers = async () => {
  loading.value = true
  try {
    const response = await API.developers.getDevelopers()
    developers.value = Array.isArray(response.data) ? response.data : response.data.data
  } catch (error) {
    console.error('Error fetching developers:', error)
  } finally {
    loading.value = false
  }
}

const createDeveloper = () => {
  router.push('/operacion/developer/create')
}

const editDeveloper = (id) => {
  router.push(`/operacion/developer/${id}`)
}

const deleteDeveloper = async (id) => {
  if (confirm('¿Está seguro de eliminar este desarrollador?')) {
    try {
      await API.developers.deleteDeveloper(id)
      await fetchDevelopers()
    } catch (error) {
      console.error('Error deleting developer:', error)
    }
  }
}

const changePage = (page) => {
  currentPage.value = page
}

// Reset página cuando se busca
const handleSearch = () => {
  currentPage.value = 1
}

onMounted(() => {
  fetchDevelopers()
})
</script>

<template>
  <CRow>
    <CCol :xs="12">
      <CCard class="mb-4">
        <CCardHeader>
          <div class="d-flex justify-content-between align-items-center">
            <strong>Developers</strong>
            <div class="d-flex gap-3 align-items-center">
              <div class="search-box">
                <CFormInput
                  type="text"
                  placeholder="Buscar..."
                  v-model="searchQuery"
                  @input="handleSearch"
                />
              </div>
              <small class="text-medium-emphasis">
                Total: {{ filteredDevelopers.length }} registros
              </small>
              <CButton color="primary" @click="createDeveloper">
                <CIcon icon="cil-plus" /> Nuevo
              </CButton>
            </div>
          </div>
        </CCardHeader>
        <CCardBody>
          <div v-if="loading" class="text-center">
            <CSpinner color="primary" />
          </div>
          <div v-else>
            <CTable hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>ID</CTableHeaderCell>
                  <CTableHeaderCell>Nombre</CTableHeaderCell>
                  <CTableHeaderCell class="text-center">Developer</CTableHeaderCell>
                  <CTableHeaderCell class="text-center">Builder</CTableHeaderCell>
                  <CTableHeaderCell class="text-center">Owner</CTableHeaderCell>
                  <CTableHeaderCell class="text-center">User Owner</CTableHeaderCell>
                  <CTableHeaderCell>Acciones</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                <CTableRow v-for="developer in paginatedDevelopers" :key="developer.id">
                  <CTableDataCell>{{ developer.id }}</CTableDataCell>
                  <CTableDataCell>{{ developer.name }}</CTableDataCell>
                  <CTableDataCell class="text-center">
                    <CBadge :color="developer.is_developer === 1 ? 'success' : 'danger'">
                      {{ developer.is_developer === 1 ? 'Sí' : 'No' }}
                    </CBadge>
                  </CTableDataCell>
                  <CTableDataCell class="text-center">
                    <CBadge :color="developer.is_builder === 1 ? 'success' : 'danger'">
                      {{ developer.is_builder === 1 ? 'Sí' : 'No' }}
                    </CBadge>
                  </CTableDataCell>
                  <CTableDataCell class="text-center">
                    <CBadge :color="developer.is_owner === 1 ? 'success' : 'danger'">
                      {{ developer.is_owner === 1 ? 'Sí' : 'No' }}
                    </CBadge>
                  </CTableDataCell>
                  <CTableDataCell class="text-center">
                    <CBadge :color="developer.is_user_owner === 1 ? 'success' : 'danger'">
                      {{ developer.is_user_owner === 1 ? 'Sí' : 'No' }}
                    </CBadge>
                  </CTableDataCell>
                  <CTableDataCell>
                    <CButton
                      color="primary"
                      size="sm"
                      class="me-2"
                      @click="editDeveloper(developer.id)"
                    >
                      <CIcon icon="cil-pencil" />
                    </CButton>
                    <CButton
                      color="danger"
                      size="sm"
                      @click="deleteDeveloper(developer.id)"
                    >
                      <CIcon icon="cil-trash" />
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              </CTableBody>
            </CTable>

            <!-- Paginación -->
            <nav v-if="totalPages > 1" class="mt-3">
              <CPagination align="center">
                <CPaginationItem 
                  :disabled="currentPage === 1"
                  @click="changePage(currentPage - 1)"
                >
                  Anterior
                </CPaginationItem>
                <CPaginationItem
                  v-for="page in totalPages"
                  :key="page"
                  :active="page === currentPage"
                  @click="changePage(page)"
                >
                  {{ page }}
                </CPaginationItem>
                <CPaginationItem
                  :disabled="currentPage === totalPages"
                  @click="changePage(currentPage + 1)"
                >
                  Siguiente
                </CPaginationItem>
              </CPagination>
            </nav>
          </div>
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>
</template>

<style scoped>
.search-box {
  min-width: 200px;
}
</style> 