import { AxiosResponse } from 'axios'

import { Api as UserManagementApi } from './user-management.api'
import { InvalidOrExpiredOTPError, ServiceDownError } from '../../errors'

type SessionToken = string
type AuthFlow = 'login' | 'signup'

export const USER_MANAGEMENT_URL = 'https://console-user-management.apse1.affinidi.com/api/v1'

class UserManagementService {
  constructor(
    private readonly client = new UserManagementApi({
      baseURL: USER_MANAGEMENT_URL,
      withCredentials: true,
    }),
  ) {}

  private readonly confirm = async (
    token: string,
    confirmationCode: string,
    flow: AuthFlow,
  ): Promise<AxiosResponse<void>> => {
    try {
      switch (flow) {
        case 'signup':
          return this.client.auth.signupConfirmation({ token, confirmationCode })
        case 'login':
          return this.client.auth.loginConfirmation({ token, confirmationCode })
        default:
          throw Error(`cannot call the ${flow} method from the user-management service`)
      }
    } catch (error: any) {
      throw new Error(error?.message)
    }
  }

  public signUp = async (username: string): Promise<string> => {
    try {
      const result = await this.client.auth.signupUser({ username })
      return result.data
    } catch (error: any) {
      throw new Error(error?.message)
    }
  }

  public login = async (username: string): Promise<string> => {
    try {
      const result = await this.client.auth.login({ username })
      return result.data
    } catch (error: any) {
      console.log(error)
      throw ServiceDownError
    }
  }

  public confirmAndGetToken = async (
    token: string,
    confirmationCode: string,
    flow: AuthFlow,
  ): Promise<SessionToken> => {
    try {
      const response = await this.confirm(token, confirmationCode, flow)
      const cookies = response.headers['set-cookie']
      const cookie = cookies.pop()
      if (!cookie) {
        throw Error('Empty cookie')
      }
      return cookie
    } catch (err) {
      throw InvalidOrExpiredOTPError
    }
  }

  public signout = async ({ token }: { token: string }): Promise<void> => {
    try {
      await this.client.auth.logout({
        headers: { Cookie: token, 'content-type': 'application/json' },
      })
      return
    } catch (error: any) {
      throw ServiceDownError
    }
  }

  public me = async () => {
    try {
      const result = await this.client.auth.me()
      return result.data
    } catch (error: any) {
      throw new Error(error?.error?.message)
    }
  }
}

const userManagementService = new UserManagementService()

export { userManagementService }
