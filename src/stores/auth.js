import { defineStore } from 'pinia'
import { useLocalStorage } from '../composables/useLocalStorage'
import { ref, computed } from 'vue'
import { AUTH_TOKEN, AUTH_USER } from '../constants'

export const useAuthStore = defineStore('auth', () => {
  const { setItem, getItem, removeItem } = useLocalStorage()

  const user = ref(getItem(AUTH_USER) ?? null)
  const token = ref(getItem(AUTH_TOKEN) ?? null)

  const permissions = computed(() => {
    if (
      user.value?.permissions &&
      Array.isArray(user.value?.permissions) &&
      user.value.permissions.length
    ) {
      return new Set(user.value.permissions)
    }
    return new Set()
  })

  function can(...checkPermissions) {
    return checkPermissions.some((permission) => permissions.value.has(permission))
  }

  function setToken(newToken) {
    setItem(AUTH_TOKEN, newToken)
    token.value = newToken
  }

  function setUser(newUser) {
    setItem(AUTH_USER, newUser)
    user.value = newUser
  }

  function destroyAuth() {
    removeItem(AUTH_TOKEN)
    removeItem(AUTH_USER)
    user.value = null
    token.value = null
  }

  return {
    user,
    permissions,
    setUser,
    can,
    token,
    setToken,
    destroyAuth,
  }
})
