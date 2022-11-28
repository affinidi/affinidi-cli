import { getSession } from '../services/user-management'

export const isAuthenticated = (): boolean => {
  if (getSession()?.accessToken) {
    return true
  }
  return false
}
