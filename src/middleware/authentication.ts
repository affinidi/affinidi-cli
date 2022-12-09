import { getSession } from '../services/user-management'

export const isAuthenticated = (): boolean => {
  if (getSession()?.consoleAuthToken) {
    return true
  }
  return false
}
