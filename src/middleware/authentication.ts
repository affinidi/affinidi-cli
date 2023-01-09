import { getSession, userManagementService } from '../services/user-management'

export const isAuthenticated = (): boolean => {
  if (getSession()?.consoleAuthToken) {
    return true
  }
  return false
}

export const isTokenVaild = async (): Promise<boolean> => {
  try {
    const { consoleAuthToken: token } = getSession()
    await userManagementService.me({ token })
    return true
  } catch (error) {
    return false
  }
}
