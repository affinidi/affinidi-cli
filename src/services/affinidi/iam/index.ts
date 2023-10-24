import {
  AddUserToProjectInput,
  CreateMachineUserInput,
  CreateProjectInput,
  CreateProjectScopedTokenOutput,
  Api as IamApi,
  MachineUserDto,
  MachineUserList,
  PolicyDto,
  ProjectDto,
  UpdateMachineUserInput,
  UserList,
  WhoamiDto,
} from './iam.api'
import { IAM_URL } from '../../../services/urls'
import { handleServiceError } from '../errors'

class IAMService {
  constructor(
    private readonly client = new IamApi({
      baseURL: IAM_URL,
      withCredentials: true,
      headers: {
        'Accept-Encoding': 'application/json',
      },
    }),
  ) {}

  public createProject = async (token: string, projectInput: CreateProjectInput): Promise<ProjectDto> => {
    try {
      const result = await this.client.v1.createProject(projectInput, {
        headers: {
          Authorization: `Bearer ${token}`,
          'content-type': 'application/json',
          Accept: 'application/json',
        },
      })
      return result.data
    } catch (error) {
      handleServiceError(error)
    }
  }

  public listProjects = async (token: string): Promise<Array<ProjectDto>> => {
    try {
      const {
        data: { projects },
      } = await this.client.v1.listProject({
        headers: {
          Authorization: `Bearer ${token}`,
          'content-type': 'application/json',
          Accept: 'application/json',
        },
      })

      return projects
    } catch (error) {
      handleServiceError(error)
    }
  }

  public whoAmI = async (token: string): Promise<WhoamiDto> => {
    try {
      const { data } = await this.client.v1.whoami({
        headers: {
          Authorization: `Bearer ${token}`,
          'content-type': 'application/json',
          Accept: 'application/json',
        },
      })

      return data
    } catch (error) {
      handleServiceError(error)
    }
  }

  public createProjectScopedToken = async (
    token: string,
    projectId: string,
  ): Promise<CreateProjectScopedTokenOutput> => {
    try {
      const { data } = await this.client.v1.createProjectScopedToken(
        { projectId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'content-type': 'application/json',
            Accept: 'application/json',
          },
        },
      )

      return data
    } catch (error) {
      handleServiceError(error)
    }
  }

  public listM2MKeys = async (token: string): Promise<MachineUserList> => {
    try {
      const { data } = await this.client.v1.listMachineUser({
        headers: {
          Authorization: `Bearer ${token}`,
          'content-type': 'application/json',
          Accept: 'application/json',
        },
      })

      return data
    } catch (error) {
      handleServiceError(error)
    }
  }

  public deleteMachineUser = async (token: string, machineUserId: string): Promise<void> => {
    try {
      await this.client.v1.deleteMachineUser(machineUserId, {
        headers: {
          Authorization: `Bearer ${token}`,
          'content-type': 'application/json',
          Accept: 'application/json',
        },
      })
    } catch (error) {
      handleServiceError(error)
    }
  }

  public getMachineUser = async (token: string, machineUserId: string): Promise<MachineUserDto> => {
    try {
      const { data } = await this.client.v1.getMachineUser(machineUserId, {
        headers: {
          Authorization: `Bearer ${token}`,
          'content-type': 'application/json',
          Accept: 'application/json',
        },
      })
      return data
    } catch (error) {
      handleServiceError(error)
    }
  }

  public createMachineUser = async (
    projectScopedToken: string,
    createMachineUserInput: CreateMachineUserInput,
  ): Promise<MachineUserDto> => {
    try {
      const { data } = await this.client.v1.createMachineUser(createMachineUserInput, {
        headers: {
          Authorization: `Bearer ${projectScopedToken}`,
          'content-type': 'application/json',
          Accept: 'application/json',
        },
      })

      return data
    } catch (error) {
      handleServiceError(error)
    }
  }

  public updateMachineUser = async (
    token: string,
    machineUserId: string,
    updateMachineUserInput: UpdateMachineUserInput,
  ): Promise<MachineUserDto> => {
    try {
      const { data } = await this.client.v1.updateMachineUser(machineUserId, updateMachineUserInput, {
        headers: {
          Authorization: `Bearer ${token}`,
          'content-type': 'application/json',
          Accept: 'application/json',
        },
      })

      return data
    } catch (error) {
      handleServiceError(error)
    }
  }

  public listPrincipalsOfProject = async (projectAccessToken: string): Promise<UserList> => {
    try {
      const result = await this.client.v1.listPrincipalsOfProject({
        headers: {
          Authorization: `Bearer ${projectAccessToken}`,
          'content-type': 'application/json',
          Accept: 'application/json',
        },
      })
      return result.data
    } catch (error) {
      handleServiceError(error)
    }
  }

  public addPrincipalToProject = async (
    projectAccessToken: string,
    addUserToProjectInput: AddUserToProjectInput,
  ): Promise<void> => {
    try {
      await this.client.v1.addPrincipalToProject(addUserToProjectInput, {
        headers: {
          Authorization: `Bearer ${projectAccessToken}`,
          'content-type': 'application/json',
          Accept: 'application/json',
        },
      })
    } catch (error) {
      handleServiceError(error)
    }
  }

  public deletePrincipalFromProject = async (
    projectAccessToken: string,
    principalId: string,
    principalType: 'user' | 'machine_user',
  ): Promise<void> => {
    try {
      await this.client.v1.deletePrincipalFromProject(
        principalId,
        { principalType },
        {
          headers: {
            Authorization: `Bearer ${projectAccessToken}`,
            'content-type': 'application/json',
            Accept: 'application/json',
          },
        },
      )
    } catch (error) {
      handleServiceError(error)
    }
  }

  public getPolicies = async (
    token: string,
    principalId: string,
    principalType: 'user' | 'machine_user',
  ): Promise<PolicyDto> => {
    try {
      const result = await this.client.v1.getPolicies(
        principalId,
        { principalType },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'content-type': 'application/json',
            Accept: 'application/json',
          },
        },
      )
      return result.data
    } catch (error) {
      handleServiceError(error)
    }
  }

  public updatePolicies = async (
    token: string,
    principalId: string,
    principalType: 'user' | 'machine_user',
    data: PolicyDto,
  ): Promise<PolicyDto> => {
    try {
      const result = await this.client.v1.updatePolicies(principalId, { principalType }, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'content-type': 'application/json',
          Accept: 'application/json',
        },
      })
      return result.data
    } catch (error) {
      handleServiceError(error)
    }
  }
}

export const iamService = new IAMService()
