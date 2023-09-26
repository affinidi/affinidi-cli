import {
  Api as VPAdapterApi,
  CreateLoginConfigurationInput,
  CreateLoginConfigurationOutput,
  ListLoginConfigurationOutput,
  GetLoginConfigurationOutput,
  UpdateLoginConfigurationOutput,
  UpdateLoginConfigurationInput,
  GroupDto,
  GroupsList,
  GroupUserMappingsList,
} from './vp-adapter.api'
import { VP_ADAPTER_URL } from '../../../services/urls'
import { handleServiceError } from '../errors'

export const VPA_SERVICE = 'vp-adapter'

const vpaErrorMessageHandler = (response: any): string | null => {
  switch (response.data.name) {
    case 'ClientMetadataNotFoundError':
      return response.data.message
    case 'ResourceCreationError':
    case 'LoginConfigurationReadError':
    case 'LoginConfigurationWriteError':
      return `${response.data.message}, Details: ${JSON.stringify(response.data.details)}`
    case 'GroupsPerUserLimitExceededError':
      return `${response.data.message} Details: ${JSON.stringify(
        response.data.details,
      )}\nIf you need to create an additional group, please, delete an existing group using command 'login delete-group'`
    default:
      return null
  }
}

class VPAdapterService {
  constructor(
    private readonly client = new VPAdapterApi({
      baseURL: VP_ADAPTER_URL,
      withCredentials: true,
      headers: {
        'Accept-Encoding': 'application/json',
      },
    }),
  ) {}

  public createLoginConfig = async (
    projectScopedToken: string,
    createLoginConfigInput: CreateLoginConfigurationInput,
  ): Promise<CreateLoginConfigurationOutput> => {
    try {
      const response = await this.client.v1.createLoginConfigurations(createLoginConfigInput, {
        headers: {
          Authorization: `Bearer ${projectScopedToken}`,
        },
      })
      return response.data
    } catch (error) {
      handleServiceError(error, vpaErrorMessageHandler)
    }
  }

  public listLoginConfigurations = async (projectScopedToken: string): Promise<ListLoginConfigurationOutput> => {
    try {
      const response = await this.client.v1.listLoginConfigurations({
        headers: {
          Authorization: `Bearer ${projectScopedToken}`,
        },
      })
      return response.data
    } catch (error) {
      handleServiceError(error, vpaErrorMessageHandler)
    }
  }

  public getLoginConfigurationById = async (
    projectScopedToken: string,
    id: string,
  ): Promise<GetLoginConfigurationOutput> => {
    try {
      const response = await this.client.v1.getLoginConfigurationsById(id, {
        headers: {
          Authorization: `Bearer ${projectScopedToken}`,
        },
      })
      return response.data
    } catch (error) {
      handleServiceError(error, vpaErrorMessageHandler)
    }
  }

  public deleteLoginConfigurationById = async (projectScopedToken: string, id: string): Promise<void> => {
    try {
      await this.client.v1.deleteLoginConfigurationsById(id, {
        headers: {
          Authorization: `Bearer ${projectScopedToken}`,
        },
      })
    } catch (error) {
      handleServiceError(error, vpaErrorMessageHandler)
    }
  }

  public updateLoginConfigurationById = async (
    projectScopedToken: string,
    id: string,
    updateLoginConfigurationInput: UpdateLoginConfigurationInput,
  ): Promise<UpdateLoginConfigurationOutput> => {
    try {
      const response = await this.client.v1.updateLoginConfigurationsById(id, updateLoginConfigurationInput, {
        headers: {
          Authorization: `Bearer ${projectScopedToken}`,
        },
      })
      return response.data
    } catch (error) {
      handleServiceError(error, vpaErrorMessageHandler)
    }
  }

  public createGroup = async (projectScopedToken: string, groupName: string): Promise<GroupDto> => {
    try {
      const response = await this.client.v1.createGroup(
        { groupName: groupName },
        {
          headers: {
            Authorization: `Bearer ${projectScopedToken}`,
          },
        },
      )
      return response.data
    } catch (error) {
      handleServiceError(error, vpaErrorMessageHandler)
    }
  }

  public getGroup = async (projectScopedToken: string, groupName: string): Promise<GroupDto> => {
    try {
      const response = await this.client.v1.getGroupById(groupName, {
        headers: {
          Authorization: `Bearer ${projectScopedToken}`,
        },
      })
      return response.data
    } catch (error) {
      handleServiceError(error, vpaErrorMessageHandler)
    }
  }

  public deleteGroup = async (projectScopedToken: string, name: string): Promise<void> => {
    try {
      await this.client.v1.deleteGroup(name, {
        headers: {
          Authorization: `Bearer ${projectScopedToken}`,
        },
      })
    } catch (error) {
      handleServiceError(error, vpaErrorMessageHandler)
    }
  }

  public listGroups = async (projectScopedToken: string): Promise<GroupsList> => {
    try {
      const response = await this.client.v1.listGroups({
        headers: {
          Authorization: `Bearer ${projectScopedToken}`,
        },
      })
      return response.data
    } catch (error) {
      handleServiceError(error, vpaErrorMessageHandler)
    }
  }

  public addUserToGroup = async (projectScopedToken: string, groupName: string, sub: string) => {
    try {
      const response = await this.client.v1.addUserToGroup(
        groupName,
        { sub },
        {
          headers: {
            Authorization: `Bearer ${projectScopedToken}`,
          },
        },
      )
      return response.data
    } catch (error) {
      handleServiceError(error, vpaErrorMessageHandler)
    }
  }

  public removeUserFromGroup = async (
    projectScopedToken: string,
    groupName: string,
    userMappingId: string,
  ): Promise<void> => {
    try {
      await this.client.v1.removeUserFromGroup(groupName, userMappingId, {
        headers: {
          Authorization: `Bearer ${projectScopedToken}`,
        },
      })
    } catch (error) {
      handleServiceError(error, vpaErrorMessageHandler)
    }
  }

  public listGroupUsers = async (projectScopedToken: string, groupName: string): Promise<GroupUserMappingsList> => {
    try {
      const response = await this.client.v1.listGroupUserMappings(groupName, {
        headers: {
          Authorization: `Bearer ${projectScopedToken}`,
        },
      })
      return response.data
    } catch (error) {
      handleServiceError(error, vpaErrorMessageHandler)
    }
  }
}

const vpAdapterService = new VPAdapterService()
export { vpAdapterService }
