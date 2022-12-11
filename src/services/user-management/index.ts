import { AxiosResponse } from 'axios'
import { nanoid } from 'nanoid'
import { StatusCodes } from 'http-status-codes'

import { Api as UserManagementApi } from './user-management.api'
import { CliError } from '../../errors'
import { vaultService, VAULT_KEYS } from '../vault'
import { configService } from '../config'

type SessionToken = string
type AuthFlow = 'login' | 'signup'

export const USER_MANAGEMENT_URL = 'https://console-user-management.apse1.affinidi.com/api/v1'
const SERVICE = 'userManagement'

type Session = {
  id: string
  accessToken: string
  account: {
    id: string
    label: string
  }
  scopes: string[]
}

export const parseJwt = (token: string) => {
  try {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
  } catch (error: any) {
    throw new CliError('Invalid login token', StatusCodes.BAD_REQUEST, SERVICE)
  }
}

export const getSession = (): Session => {
  const storageValue = vaultService.get(VAULT_KEYS.session)
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  return storageValue ? (JSON.parse(storageValue) as Session) : undefined
}

export const createSession = (
  accountLabel: string,
  accountId: string,
  accessToken: string,
  scopes: string[] = [],
): Session => {
  const session: Session = {
    id: nanoid(),
    accessToken,
    account: { label: accountLabel, id: accountId },
    scopes,
  }
  vaultService.set(VAULT_KEYS.session, JSON.stringify(session))
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
