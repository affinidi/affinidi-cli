/* eslint-disable max-classes-per-file */
import * as os from 'os'
import * as path from 'path'
import Conf from 'conf'

export type UserToken = {
  access_token: string
  expires_in: number
  id_token: string
  refresh_token: string
  scope: string
  token_type: string
}

export type ProjectToken = {
  projectId: string
  projectName: string
  projectAccessToken: string
  expiresIn: number
  scope: string
}

type CredsType = {
  userToken: UserToken
  projectToken: ProjectToken
  principalId: string
}

export interface CredSetterGetter {
  clear: () => void
  getUserToken: () => UserToken
  setUserToken: (token: UserToken) => void
  getProjectToken: () => ProjectToken
  setProjectToken: (token: ProjectToken) => void
  getPrincipalId: () => string
  setPrincipalId: (principalId: string) => void
}

class TokenService {
  private readonly store: CredSetterGetter

  constructor(storer: CredSetterGetter) {
    this.store = storer
  }

  public getUserToken = (): UserToken => {
    return this.store.getUserToken()
  }

  public getProjectToken = (): ProjectToken => {
    return this.store.getProjectToken()
  }

  public getPrincipalId = (): string => {
    return this.store.getPrincipalId()
  }

  public setUserToken = (token: UserToken): void => {
    this.store.setUserToken(token)
  }

  public setProjectToken = (token: unknown, projectId: string, projectName: string): void => {
    const project = JSON.parse(JSON.stringify(token))
    const projectToken: ProjectToken = {
      projectName,
      projectId,
      projectAccessToken: project.accessToken,
      expiresIn: project.expiresIn,
      scope: project.scope,
    }
    this.store.setProjectToken(projectToken)
  }

  public setPrincipalId = (principalId: string): void => {
    this.store.setPrincipalId(principalId)
  }

  public clear = (): void => {
    this.store.clear()
  }
}

const credentialConf = new Conf<CredsType>({
  cwd: path.join(os.homedir(), '.affinidi'),
  configName: 'oAuthCred',
})

const storer: CredSetterGetter = {
  clear: (): void => {
    credentialConf.clear()
  },
  getUserToken: (): UserToken => {
    return credentialConf.get('userToken')
  },
  setUserToken: (token: UserToken): void => {
    credentialConf.set('userToken', token)
  },
  getProjectToken: (): ProjectToken => {
    return credentialConf.get('projectToken')
  },
  setProjectToken: (token: ProjectToken): void => {
    credentialConf.set('projectToken', token)
  },
  getPrincipalId: (): string => {
    return credentialConf.get('principalId')
  },
  setPrincipalId: (principalId: string): void => {
    credentialConf.set('principalId', principalId)
  },
}

// TODO should be platform-agnostic

export type TokenServiceClass = TokenService

const initUserToken: UserToken = {
  access_token: '',
  expires_in: 0,
  id_token: '',
  refresh_token: '',
  scope: '',
  token_type: '',
}

const initProjectToken: ProjectToken = {
  projectName: '',
  projectId: '',
  projectAccessToken: '',
  expiresIn: 0,
  scope: '',
}

export class MockStorer implements CredSetterGetter {
  private userToken: UserToken = { ...initUserToken }

  private projectToken: ProjectToken = { ...initProjectToken }

  private principalId = 'AwesomePrincipalId'

  public clear(): void {
    this.userToken = { ...initUserToken }
    this.projectToken = { ...initProjectToken }
    this.principalId = 'AwesomePrincipalId'
  }

  public getUserToken(): UserToken {
    return this.userToken
  }

  public setUserToken(token: UserToken): void {
    this.userToken = token
  }

  public getProjectToken(): ProjectToken {
    return this.projectToken
  }

  public setProjectToken(token: ProjectToken): void {
    this.projectToken = token
  }

  public getPrincipalId(): string {
    return this.principalId
  }

  public setPrincipalId(principalId: string): void {
    this.principalId = principalId
  }
}

export const tokenService = new TokenService(process.env.NODE_ENV === 'test' ? new MockStorer() : storer)
