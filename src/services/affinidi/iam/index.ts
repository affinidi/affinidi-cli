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
import { handleServiceError } from '../errors'
import { config } from '../../env-config'
import { getBFFHeaders } from '../bff-client'

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

  public listProjects = async (): Promise<Array<ProjectDto>> => {
    try {
      const {
        data: { projects },
      } = await this.client.v1.listProject({ headers: getBFFHeaders() })
      return projects
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

  public listM2MKeys = async (): Promise<MachineUserList> => {
    try {
      const { data } = await this.client.v1.listMachineUser({ headers: getBFFHeaders() })
      return data
    } catch (error) {
      handleServiceError(error)
    }
  }

  public deleteMachineUser = async (machineUserId: string): Promise<void> => {
    try {
      await this.client.v1.deleteMachineUser(machineUserId, { headers: getBFFHeaders() })
    } catch (error) {
      handleServiceError(error)
    }
  }

  public getMachineUser = async (machineUserId: string): Promise<MachineUserDto> => {
    try {
      const { data } = await this.client.v1.getMachineUser(machineUserId, { headers: getBFFHeaders() })
      return data
    } catch (error) {
      handleServiceError(error)
    }
  }

  public createMachineUser = async (createMachineUserInput: CreateMachineUserInput): Promise<MachineUserDto> => {
    try {
      const { data } = await this.client.v1.createMachineUser(createMachineUserInput, { headers: getBFFHeaders() })
      return data
    } catch (error) {
      handleServiceError(error)
    }
  }

  public updateMachineUser = async (
    machineUserId: string,
    updateMachineUserInput: UpdateMachineUserInput,
  ): Promise<MachineUserDto> => {
    try {
      const { data } = await this.client.v1.updateMachineUser(machineUserId, updateMachineUserInput, {
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

  public deletePrincipalFromProject = async (
    principalId: string,
    principalType: 'user' | 'machine_user',
  ): Promise<void> => {
    try {
      await this.client.v1.deletePrincipalFromProject(principalId, { principalType }, { headers: getBFFHeaders() })
    } catch (error) {
      handleServiceError(error)
    }
  }

  public getPolicies = async (principalId: string, principalType: 'user' | 'machine_user'): Promise<PolicyDto> => {
    try {
      const result = await this.client.v1.getPolicies(principalId, { principalType }, { headers: getBFFHeaders() })
      return result.data
    } catch (error) {
      handleServiceError(error)
    }
  }

  public updatePolicies = async (
    principalId: string,
    principalType: 'user' | 'machine_user',
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
