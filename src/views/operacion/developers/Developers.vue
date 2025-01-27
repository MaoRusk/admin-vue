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
          <div class="header-container">
            <strong class="mb-2 mb-md-0">Developers</strong>
            <div class="controls-container">
              <div class="search-box mb-2 mb-md-0">
                <CFormInput
                  type="text"
                  placeholder="Buscar..."
                  v-model="searchQuery"
                  @input="handleSearch"
                />
              </div>
              <div class="d-flex gap-2 align-items-center flex-wrap">
                <small class="text-medium-emphasis">
                  Total: {{ filteredDevelopers.length }} registros
                </small>
                <CButton color="primary" @click="createDeveloper">
                  <CIcon icon="cil-plus" /> Nuevo
                </CButton>
              </div>
            </div>
          </div>
        </CCardHeader>
        <CCardBody>
          <div v-if="loading" class="text-center">
            <CSpinner color="primary" />
          </div>
          <div v-else class="table-responsive">
            <div class="table-container">
              <CTable hover>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell class="min-width">ID</CTableHeaderCell>
                    <CTableHeaderCell class="min-width-lg">Nombre</CTableHeaderCell>
                    <CTableHeaderCell class="text-center min-width">Dev</CTableHeaderCell>
                    <CTableHeaderCell class="text-center min-width">Build</CTableHeaderCell>
                    <CTableHeaderCell class="text-center min-width">Own</CTableHeaderCell>
                    <CTableHeaderCell class="text-center min-width">U.Own</CTableHeaderCell>
                    <CTableHeaderCell class="min-width">Acciones</CTableHeaderCell>
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
                      <div class="d-flex gap-2">
                        <CButton
                          color="primary"
                          size="sm"
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
                      </div>
                    </CTableDataCell>
                  </CTableRow>
                </CTableBody>
              </CTable>
            </div>

            <nav v-if="totalPages > 1" class="mt-3">
              <CPagination align="center" class="pagination-responsive">
                <CPaginationItem 
                  :disabled="currentPage === 1"
                  @click="changePage(currentPage - 1)"
                >
                  <span class="d-none d-sm-block">Anterior</span>
                  <span class="d-block d-sm-none">&lt;</span>
                </CPaginationItem>
                <CPaginationItem
                  v-for="page in totalPages"
                  :key="page"
                  :active="page === currentPage"
                  @click="changePage(page)"
                  class="d-none d-sm-block"
                >
                  {{ page }}
                </CPaginationItem>
                <CPaginationItem
                  :disabled="currentPage === totalPages"
                  @click="changePage(currentPage + 1)"
                >
                  <span class="d-none d-sm-block">Siguiente</span>
                  <span class="d-block d-sm-none">&gt;</span>
                </CPaginationItem>
              </CPagination>
              <div class="text-center d-block d-sm-none mt-2">
                Página {{ currentPage }} de {{ totalPages }}
              </div>
            </nav>
          </div>
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>
</template>

<style scoped>
.header-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.controls-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.search-box {
  width: 100%;
  max-width: 300px;
}

.table-container {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.min-width {
  min-width: 80px;
}

.min-width-lg {
  min-width: 150px;
}

@media (min-width: 768px) {
  .header-container {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .controls-container {
    flex-direction: row;
    align-items: center;
  }

  .search-box {
    width: auto;
  }
}

.pagination-responsive {
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.25rem;
}

@media (max-width: 576px) {
  .pagination-responsive .page-link {
    padding: 0.375rem 0.75rem;
  }
}
</style> 