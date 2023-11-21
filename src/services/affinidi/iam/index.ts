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
} from './iam.api'
import { config } from '../../env-config'
import { getBFFHeaders } from '../bff-service'
import { handleServiceError } from '../errors'

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
    try {
      const result = await this.client.v1.createProject(projectInput, { headers: getBFFHeaders() })
      return result.data
    } catch (error) {
      handleServiceError(error)
    }
  }

  public listProjects = async (): Promise<Array<any>> => {
    try {
      const res = await this.client.v1.listProject({ headers: getBFFHeaders() })
      console.log(JSON.stringify(res.data))
      return res.data.projects
    } catch (error) {
      handleServiceError(error)
    }
  }

  public whoAmI = async (): Promise<WhoamiDto> => {
    try {
      const { data } = await this.client.v1.whoami({ headers: getBFFHeaders() })
      return data
    } catch (error) {
      handleServiceError(error)
    }
  }

  public createProjectScopedToken = async (projectId: string): Promise<CreateProjectScopedTokenOutput> => {
    try {
      const { data } = await this.client.v1.createProjectScopedToken({ projectId }, { headers: getBFFHeaders() })
      return data
    } catch (error) {
      handleServiceError(error)
    }
  }

  public listM2MKeys = async (): Promise<TokenList> => {
    try {
      const { data } = await this.client.v1.listToken({ headers: getBFFHeaders() })
      return data
    } catch (error) {
      handleServiceError(error)
    }
  }

  public deleteToken = async (tokenId: string): Promise<void> => {
    try {
      await this.client.v1.deleteToken(tokenId, { headers: getBFFHeaders() })
    } catch (error) {
      handleServiceError(error)
    }
  }

  public getToken = async (tokenId: string): Promise<TokenDto> => {
    try {
      const { data } = await this.client.v1.getToken(tokenId, { headers: getBFFHeaders() })
      return data
    } catch (error) {
      handleServiceError(error)
    }
  }

  public createToken = async (createTokenInput: CreateTokenInput): Promise<TokenDto> => {
    try {
      const { data } = await this.client.v1.createToken(createTokenInput, { headers: getBFFHeaders() })
      return data
    } catch (error) {
      handleServiceError(error)
    }
  }

  public updateToken = async (tokenId: string, updateTokenInput: UpdateTokenInput): Promise<TokenDto> => {
    try {
      const { data } = await this.client.v1.updateToken(tokenId, updateTokenInput, {
        headers: getBFFHeaders(),
      })
      return data
    } catch (error) {
      handleServiceError(error)
    }
  }

  public listPrincipalsOfProject = async (): Promise<UserList> => {
    try {
      const result = await this.client.v1.listPrincipalsOfProject({ headers: getBFFHeaders() })
      return result.data
    } catch (error) {
      handleServiceError(error)
    }
  }

  public addPrincipalToProject = async (addUserToProjectInput: AddUserToProjectInput): Promise<void> => {
    try {
      await this.client.v1.addPrincipalToProject(addUserToProjectInput, { headers: getBFFHeaders() })
    } catch (error) {
      handleServiceError(error)
    }
  }

  public deletePrincipalFromProject = async (principalId: string, principalType: 'user' | 'token'): Promise<void> => {
    try {
      await this.client.v1.deletePrincipalFromProject(principalId, { principalType }, { headers: getBFFHeaders() })
    } catch (error) {
      handleServiceError(error)
    }
  }

  public getPolicies = async (principalId: string, principalType: 'user' | 'token'): Promise<PolicyDto> => {
    try {
      const result = await this.client.v1.getPolicies(principalId, { principalType }, { headers: getBFFHeaders() })
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
    try {
      const result = await this.client.v1.updatePolicies(principalId, { principalType }, data, {
        headers: getBFFHeaders(),
      })
      return result.data
    } catch (error) {
      handleServiceError(error)
    }
  }
}

export const iamService = new IAMService()
