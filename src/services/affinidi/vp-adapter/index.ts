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
import { config } from '../../env-config'
import { getBFFHeaders } from '../bff-service'
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
      baseURL: `${config.bffHost}/vpa`,
      withCredentials: true,
      headers: {
        'Accept-Encoding': 'application/json',
      },
    }),
  ) {}

  public createLoginConfig = async (
    createLoginConfigInput: CreateLoginConfigurationInput,
  ): Promise<CreateLoginConfigurationOutput> => {
    try {
      const response = await this.client.v1.createLoginConfigurations(createLoginConfigInput, {
        headers: getBFFHeaders(),
      })
      return response.data
    } catch (error) {
      handleServiceError(error, vpaErrorMessageHandler)
    }
  }

  public listLoginConfigurations = async (): Promise<ListLoginConfigurationOutput> => {
    try {
      const response = await this.client.v1.listLoginConfigurations({ headers: getBFFHeaders() })
      return response.data
    } catch (error) {
      handleServiceError(error, vpaErrorMessageHandler)
    }
  }

  public getLoginConfigurationById = async (id: string): Promise<GetLoginConfigurationOutput> => {
    try {
      const response = await this.client.v1.getLoginConfigurationsById(id, { headers: getBFFHeaders() })
      return response.data
    } catch (error) {
      handleServiceError(error, vpaErrorMessageHandler)
    }
  }

  public deleteLoginConfigurationById = async (id: string): Promise<void> => {
    try {
      await this.client.v1.deleteLoginConfigurationsById(id, { headers: getBFFHeaders() })
    } catch (error) {
      handleServiceError(error, vpaErrorMessageHandler)
    }
  }

  public updateLoginConfigurationById = async (
    id: string,
    updateLoginConfigurationInput: UpdateLoginConfigurationInput,
  ): Promise<UpdateLoginConfigurationOutput> => {
    try {
      const response = await this.client.v1.updateLoginConfigurationsById(id, updateLoginConfigurationInput, {
        headers: getBFFHeaders(),
      })
      return response.data
    } catch (error) {
      handleServiceError(error, vpaErrorMessageHandler)
    }
  }

  public createGroup = async (groupName: string): Promise<GroupDto> => {
    try {
      const response = await this.client.v1.createGroup({ groupName: groupName }, { headers: getBFFHeaders() })
      return response.data
    } catch (error) {
      handleServiceError(error, vpaErrorMessageHandler)
    }
  }

  public getGroup = async (groupName: string): Promise<GroupDto> => {
    try {
      const response = await this.client.v1.getGroupById(groupName, { headers: getBFFHeaders() })
      return response.data
    } catch (error) {
      handleServiceError(error, vpaErrorMessageHandler)
    }
  }

  public deleteGroup = async (name: string): Promise<void> => {
    try {
      await this.client.v1.deleteGroup(name, { headers: getBFFHeaders() })
    } catch (error) {
      handleServiceError(error, vpaErrorMessageHandler)
    }
  }

  public listGroups = async (): Promise<GroupsList> => {
    try {
      const response = await this.client.v1.listGroups({ headers: getBFFHeaders() })
      return response.data
    } catch (error) {
      handleServiceError(error, vpaErrorMessageHandler)
    }
  }

  public addUserToGroup = async (groupName: string, userId: string) => {
    try {
      const response = await this.client.v1.addUserToGroup(groupName, { userId }, { headers: getBFFHeaders() })
      return response.data
    } catch (error) {
      handleServiceError(error, vpaErrorMessageHandler)
    }
  }

  public removeUserFromGroup = async (groupName: string, userId: string): Promise<void> => {
    try {
      await this.client.v1.removeUserFromGroup(groupName, { userId }, { headers: getBFFHeaders() })
    } catch (error) {
      handleServiceError(error, vpaErrorMessageHandler)
    }
  }

  public listGroupUsers = async (groupName: string): Promise<GroupUserMappingsList> => {
    try {
      const response = await this.client.v1.listGroupUserMappings(groupName, { headers: getBFFHeaders() })
      return response.data
    } catch (error) {
      handleServiceError(error, vpaErrorMessageHandler)
    }
  }
}

const vpAdapterService = new VPAdapterService()
export { vpAdapterService }
