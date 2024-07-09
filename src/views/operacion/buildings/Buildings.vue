<script setup>
import { computed, ref } from 'vue'
import data from './_data'

const selected = ref([2, 3])

const usersData = computed(() =>
  data.map((item, id) => {
    const _selected = selected.value.includes(id)
    return {
      ...item,
      id,
      _selected,
    }
  }),
)

const check = (event, id) => {
  if (event.target.checked) {
    selected.value = [...selected.value, id]
  } else {
    selected.value = selected.value.filter((itemId) => itemId !== id)
  }
}

const columns = [
  { key: 'select', label: '', filter: false, sorter: false },
  { key: 'name1', label: 'Name', filter: false, sorter: false },
  { key: 'registered', label: 'Registered', filter: false, sorter: false },
  { key: 'status', label: 'Status', filter: false, sorter: false },
  { key: 'market', label: 'Marke', filter: false, sorter: false },
  { key: 'subMarket', label: 'SubMarket', filter: false, sorter: false },
  { key: 'industrialPark', label: 'Industria Park', filter: false, sorter: false },
  
]

const getBadge = (status) => {
  switch (status) {
    case 'Available':
      return 'success'
    case 'Absorption':
      return 'danger'
    case 'NegativeAbsoprtion':
      return 'secondary'
    default:
      'primary'
  }
}
</script>

<template>
  Selected: {{ JSON.stringify(selected) }}
  <CSmartTable
    :items="usersData"
    :columns="columns"
    column-filter
    table-filter
    cleaner
    :items-per-page="5"
    column-sorter
    pagination
    :table-props="{
      responsive: true,
    }"
  >
    <template #status="{ item }">
      <td>
        <CBadge :color="getBadge(item.status)">{{ item.status }}</CBadge>
      </td>
    </template>
    <template #select="{ item }">
      <td class="py-2">
        <CFormCheck
          :id="`checkbox${item.id}`"
          :checked="item._selected"
          @change="(event) => check(event, item.id)"
        />
        <CFormLabel variant="custom-checkbox" :for="`checkbox${item.id}`" />
      </td>
    </template>
  </CSmartTable>
</template>
