export function useLocalStorage() {
  const getItem = (key) => {
    try {
      const value = localStorage.getItem(key)
      return value ? JSON.parse(value) : null
    } catch (error) {
      console.error(`Error parsing localStorage item "${key}":`, error)
      return null
    }
  }

  const setItem = (key, value) => {
    try {
      const serializedValue = JSON.stringify(value)
      localStorage.setItem(key, serializedValue)
    } catch (error) {
      console.error(`Error setting localStorage item "${key}":`, error)
    }
  }

  const removeItem = (key) => {
    localStorage.removeItem(key)
  }

  return { getItem, setItem, removeItem }
}
