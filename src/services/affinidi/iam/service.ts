import {
  AddUserToProjectInput,
  CreateTokenInput,
  CreateProjectInput,
  CreateProjectScopedTokenOutput,
  StsApi,
  TokensApi,
  ProjectsApi,
  PoliciesApi,
  TokenDto,
  TokenList,
  PolicyDto,
  ProjectDto,
  UpdateTokenInput,
  UserList,
  WhoamiDto,
  Configuration,
  DeletePrincipalFromProjectPrincipalTypeEnum,
} from '@affinidi-tdk/iam-client'
import { config } from '../../env-config.js'
import { getBFFHeaders } from '../bff-service.js'
import { handleServiceError } from '../errors.js'

const headers = await getBFFHeaders()
const baseOptions = { headers }
const basePath = `${config.bffHost}/iam`

class IAMService {
  constructor(
    private readonly stsApiClient = new StsApi(new Configuration({ basePath, baseOptions })),
    private readonly tokensApiClient = new TokensApi(new Configuration({ basePath, baseOptions })),
    private readonly policiesApiClient = new PoliciesApi(new Configuration({ basePath, baseOptions })),
    private readonly projectsApiClient = new ProjectsApi(new Configuration({ basePath, baseOptions })),
  ) {}

  public createProject = async (projectInput: CreateProjectInput): Promise<ProjectDto> => {
    try {
      const result = await this.projectsApiClient.createProject(projectInput)
      return result.data
    } catch (error) {
      handleServiceError(error)
    }
  }

  public listProjects = async (): Promise<Array<any>> => {
    try {
      const res = await this.projectsApiClient.listProject()
      return res.data.projects
    } catch (error) {
      handleServiceError(error)
    }
  }

  public whoAmI = async (): Promise<WhoamiDto> => {
    try {
      const { data } = await this.stsApiClient.whoami()
      return data
    } catch (error) {
      handleServiceError(error)
    }
  }

  public createProjectScopedToken = async (projectId: string): Promise<CreateProjectScopedTokenOutput> => {
    try {
      const { data } = await this.stsApiClient.createProjectScopedToken({ projectId })
      return data
    } catch (error) {
      handleServiceError(error)
    }
  }

  public listM2MKeys = async (): Promise<TokenList> => {
    try {
      const { data } = await this.tokensApiClient.listToken()
      return data
    } catch (error) {
      handleServiceError(error)
    }
  }

  public deleteToken = async (tokenId: string): Promise<void> => {
    try {
      await this.tokensApiClient.deleteToken(tokenId)
    } catch (error) {
      handleServiceError(error)
    }
  }

  public getToken = async (tokenId: string): Promise<TokenDto> => {
    try {
      const { data } = await this.tokensApiClient.getToken(tokenId)
      return data
    } catch (error) {
      handleServiceError(error)
    }
  }

  public createToken = async (createTokenInput: CreateTokenInput): Promise<TokenDto> => {
    try {
      const { data } = await this.tokensApiClient.createToken(createTokenInput)
      return data
    } catch (error) {
      handleServiceError(error)
    }
  }

  public updateToken = async (tokenId: string, updateTokenInput: UpdateTokenInput): Promise<TokenDto> => {
    try {
      const { data } = await this.tokensApiClient.updateToken(tokenId, updateTokenInput)
      return data
    } catch (error) {
      handleServiceError(error)
    }
  }

  public listPrincipalsOfProject = async (): Promise<UserList> => {
    try {
      const result = await this.projectsApiClient.listPrincipalsOfProject()
      return result.data
    } catch (error) {
      handleServiceError(error)
    }
  }

  public addPrincipalToProject = async (addUserToProjectInput: AddUserToProjectInput): Promise<void> => {
    try {
      await this.projectsApiClient.addPrincipalToProject(addUserToProjectInput)
    } catch (error) {
      handleServiceError(error)
    }
  }

  public deletePrincipalFromProject = async (
    principalId: string,
    principalType: DeletePrincipalFromProjectPrincipalTypeEnum,
  ): Promise<void> => {
    try {
      await this.projectsApiClient.deletePrincipalFromProject(principalId, principalType)
    } catch (error) {
      handleServiceError(error)
    }
  }

  public getPolicies = async (
    principalId: string,
    principalType: DeletePrincipalFromProjectPrincipalTypeEnum,
  ): Promise<PolicyDto> => {
    try {
      const result = await this.policiesApiClient.getPolicies(principalId, principalType)
      return result.data
    } catch (error) {
      handleServiceError(error)
    }
  }

  public updatePolicies = async (
    principalId: string,
    principalType: DeletePrincipalFromProjectPrincipalTypeEnum,
    data: PolicyDto,
  ): Promise<PolicyDto> => {
    try {
      const result = await this.policiesApiClient.updatePolicies(principalId, principalType, data)
      return result.data
    } catch (error) {
      handleServiceError(error)
    }
  }
}

export const iamService = new IAMService()
