import { AxiosResponse } from 'axios'
import { nanoid } from 'nanoid'
import { StatusCodes } from 'http-status-codes'

import { Api as UserManagementApi } from './user-management.api'
import { CliError } from '../../errors'
import { vaultService, SessionType } from '../vault/typedVaultService'
import { configService } from '../config'

type SessionToken = string
type AuthFlow = 'login' | 'signup'

export const USER_MANAGEMENT_URL =
  process.env.NODE_ENV === 'test'
    ? 'https://console-user-management.staging.affinity-project.org/api/v1'
    : 'https://console-user-management.apse1.affinidi.com/api/v1'
const SERVICE = 'userManagement'

export const parseJwt = (token: string) => {
  try {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
  } catch (error: any) {
    throw new CliError('Invalid login token', StatusCodes.BAD_REQUEST, SERVICE)
  }
}

export const getSession = (): SessionType => {
  return vaultService.getSession()
}

export const createSession = (
  accountLabel: string,
  accountId: string,
  accessToken: string,
  scopes: string[] = [],
): SessionType => {
  const session: SessionType = {
    sessionId: nanoid(),
    consoleAuthToken: accessToken,
    account: { label: accountLabel, userId: accountId },
    scopes,
  }
  vaultService.setSession(session)
  return session
}

export const createConfig = ({
  userId,
  projectId = '',
  analyticsOptIn,
}: {
  userId: string
  projectId?: string
  analyticsOptIn?: boolean
}): void => {
  configService.create(userId, projectId, analyticsOptIn)
}

export const createOrUpdateConfig = ({
  userId,
  analyticsOptIn,
}: {
  userId: string
  analyticsOptIn?: boolean
}): void => {
  return configService.createOrUpdate(userId, analyticsOptIn)
}

class UserManagementService {
  constructor(
    private readonly client = new UserManagementApi({
      baseURL: USER_MANAGEMENT_URL,
      withCredentials: true,
      headers: {
        'Accept-Encoding': 'application/json',
      },
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
      throw new CliError(error?.message, error.response.status, SERVICE)
    }
  }

  public signUp = async (username: string): Promise<string> => {
    try {
      const result = await this.client.auth.signupUser({ username })
      return result.data
    } catch (error: any) {
      throw new CliError(error?.message, error.response.status, SERVICE)
    }
  }

  public login = async (username: string): Promise<string> => {
    try {
      const result = await this.client.auth.login({ username })
      return result.data
    } catch (error: any) {
      throw new CliError(error?.message, error.response.status, SERVICE)
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
      throw new CliError(err?.message, err.response.status, SERVICE)
    }
  }

  public signout = async ({ token }: { token: string }): Promise<void> => {
    try {
      await this.client.auth.logout({
        headers: { Cookie: token, 'content-type': 'application/json' },
      })
      return
    } catch (error: any) {
      throw new CliError(error?.message, error.response.status, SERVICE)
    }
  }

  public me = async ({ token }: { token: string }) => {
    try {
      const result = await this.client.auth.me({
        headers: { Cookie: token, 'content-type': 'application/json' },
      })
      return result.data
    } catch (error: any) {
      throw new CliError(error?.message, error.response.status, SERVICE)
    }
  }
}

const userManagementService = new UserManagementService()

export { userManagementService }
