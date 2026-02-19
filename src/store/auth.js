import { reactive, readonly } from 'vue'

const state = reactive({
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token')
})

const login = (userData, token) => {
  state.user = userData
  state.token = token
  state.isAuthenticated = true
  localStorage.setItem('user', JSON.stringify(userData))
  localStorage.setItem('token', token)
}

const logout = () => {
  state.user = null
  state.token = null
  state.isAuthenticated = false
  localStorage.removeItem('user')
  localStorage.removeItem('token')
}

export const useAuth = () => {
  return {
    state: readonly(state),
    login,
    logout
  }
}
