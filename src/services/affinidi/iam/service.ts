import {
  AddUserToProjectInput,
  CreateTokenInput,
  CreateProjectInput,
  CreateProjectScopedTokenOutput,
  Api as IamApi,
  TokenDto,
  TokenList,
  PolicyDto,
  ProjectDto,
  UpdateTokenInput,
  UserList,
  WhoamiDto,
} from './iam.api.js'
import { config } from '../../env-config.js'
import { getBFFHeaders } from '../bff-service.js'
import { handleServiceError } from '../errors.js'

class IAMService {
  constructor(
    private readonly client = new IamApi({
      baseURL: `${config.bffHost}/iam`,
      withCredentials: true,
      headers: {
        'Accept-Encoding': 'application/json',
      },
    }),
  ) {}

  public createProject = async (projectInput: CreateProjectInput): Promise<ProjectDto> => {
    const headers = await getBFFHeaders()
    try {
      const result = await this.client.v1.createProject(projectInput, { headers })
      return result.data
    } catch (error) {
      handleServiceError(error)
    }
  }

  public listProjects = async (): Promise<Array<any>> => {
    const headers = await getBFFHeaders()
    try {
      const res = await this.client.v1.listProject({ headers })
      return res.data.projects
    } catch (error) {
      handleServiceError(error)
    }
  }

  public whoAmI = async (): Promise<WhoamiDto> => {
    const headers = await getBFFHeaders()
    try {
      const { data } = await this.client.v1.whoami({ headers })
      return data
    } catch (error) {
      handleServiceError(error)
    }
  }

  public createProjectScopedToken = async (projectId: string): Promise<CreateProjectScopedTokenOutput> => {
    const headers = await getBFFHeaders()
    try {
      const { data } = await this.client.v1.createProjectScopedToken({ projectId }, { headers })
      return data
    } catch (error) {
      handleServiceError(error)
    }
  }

  public listM2MKeys = async (): Promise<TokenList> => {
    const headers = await getBFFHeaders()
    try {
      const { data } = await this.client.v1.listToken({ headers })
      return data
    } catch (error) {
      handleServiceError(error)
    }
  }

  public deleteToken = async (tokenId: string): Promise<void> => {
    const headers = await getBFFHeaders()
    try {
      await this.client.v1.deleteToken(tokenId, { headers })
    } catch (error) {
      handleServiceError(error)
    }
  }

  public getToken = async (tokenId: string): Promise<TokenDto> => {
    const headers = await getBFFHeaders()
    try {
      const { data } = await this.client.v1.getToken(tokenId, { headers })
      return data
    } catch (error) {
      handleServiceError(error)
    }
  }

  public createToken = async (createTokenInput: CreateTokenInput): Promise<TokenDto> => {
    const headers = await getBFFHeaders()
    try {
      const { data } = await this.client.v1.createToken(createTokenInput, { headers })
      return data
    } catch (error) {
      handleServiceError(error)
    }
  }

  public updateToken = async (tokenId: string, updateTokenInput: UpdateTokenInput): Promise<TokenDto> => {
    try {
      const headers = await getBFFHeaders()
      const { data } = await this.client.v1.updateToken(tokenId, updateTokenInput, {
        headers,
      })
      return data
    } catch (error) {
      handleServiceError(error)
    }
  }

  public listPrincipalsOfProject = async (): Promise<UserList> => {
    const headers = await getBFFHeaders()
    try {
      const result = await this.client.v1.listPrincipalsOfProject({ headers })
      return result.data
    } catch (error) {
      handleServiceError(error)
    }
  }

  public addPrincipalToProject = async (addUserToProjectInput: AddUserToProjectInput): Promise<void> => {
    const headers = await getBFFHeaders()
    try {
      await this.client.v1.addPrincipalToProject(addUserToProjectInput, { headers })
    } catch (error) {
      handleServiceError(error)
    }
  }

  public deletePrincipalFromProject = async (principalId: string, principalType: 'user' | 'token'): Promise<void> => {
    const headers = await getBFFHeaders()
    try {
      await this.client.v1.deletePrincipalFromProject(principalId, { principalType }, { headers })
    } catch (error) {
      handleServiceError(error)
    }
  }

  public getPolicies = async (principalId: string, principalType: 'user' | 'token'): Promise<PolicyDto> => {
    const headers = await getBFFHeaders()
    try {
      const result = await this.client.v1.getPolicies(principalId, { principalType }, { headers })
      return result.data
    } catch (error) {
      handleServiceError(error)
    }
  }

  public updatePolicies = async (
    principalId: string,
    principalType: 'user' | 'token',
    data: PolicyDto,
  ): Promise<PolicyDto> => {
    const headers = await getBFFHeaders()
    try {
      const result = await this.client.v1.updatePolicies(principalId, { principalType }, data, { headers })
      return result.data
    } catch (error) {
      handleServiceError(error)
    }
  }
}

export const iamService = new IAMService()
