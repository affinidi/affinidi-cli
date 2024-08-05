import { AxiosError } from 'axios'
import { ServiceResourceIds } from '../../../common/constants.js'
import { config } from '../../env-config.js'
import { getBFFHeaders, bffService } from '../bff-service.js'
import { handleServiceError } from '../errors.js'
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
} from './vp-adapter.api.js'

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
    case 'ResourceLimitExceededError': {
      return `You can create a maximum of ${response.data.limit} Login configurations for every project. For any further queries reach out to our Customer support.`
    }
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
      const headers = await getBFFHeaders()
      const response = await this.client.v1.createLoginConfigurations(createLoginConfigInput, {
        headers,
      })
      return response.data
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data?.name === 'ResourceLimitExceededError') {
        const configurationsLimit = await bffService.getActiveProjectLimits(ServiceResourceIds.VPA_CONFIGURATIONS)

        error.response.data.limit = configurationsLimit
        handleServiceError(error, vpaErrorMessageHandler)
      }

      handleServiceError(error, vpaErrorMessageHandler)
    }
  }

  public listLoginConfigurations = async (): Promise<ListLoginConfigurationOutput> => {
    const headers = await getBFFHeaders()
    try {
      const response = await this.client.v1.listLoginConfigurations(undefined, { headers })
      return response.data
    } catch (error) {
      handleServiceError(error, vpaErrorMessageHandler)
    }
  }

  public getLoginConfigurationById = async (id: string): Promise<GetLoginConfigurationOutput> => {
    const headers = await getBFFHeaders()
    try {
      const response = await this.client.v1.getLoginConfigurationsById(id, { headers })
      return response.data
    } catch (error) {
      handleServiceError(error, vpaErrorMessageHandler)
    }
  }

  public deleteLoginConfigurationById = async (id: string): Promise<void> => {
    const headers = await getBFFHeaders()
    try {
      await this.client.v1.deleteLoginConfigurationsById(id, { headers })
    } catch (error) {
      handleServiceError(error, vpaErrorMessageHandler)
    }
  }

  public updateLoginConfigurationById = async (
    id: string,
    updateLoginConfigurationInput: UpdateLoginConfigurationInput,
  ): Promise<UpdateLoginConfigurationOutput> => {
    const headers = await getBFFHeaders()
    try {
      const response = await this.client.v1.updateLoginConfigurationsById(id, updateLoginConfigurationInput, {
        headers,
      })
      return response.data
    } catch (error) {
      handleServiceError(error, vpaErrorMessageHandler)
    }
  }

  public createGroup = async (groupName: string): Promise<GroupDto> => {
    const headers = await getBFFHeaders()
    try {
      const response = await this.client.v1.createGroup({ groupName: groupName }, { headers })
      return response.data
    } catch (error) {
      handleServiceError(error, vpaErrorMessageHandler)
    }
  }

  public getGroup = async (groupName: string): Promise<GroupDto> => {
    const headers = await getBFFHeaders()
    try {
      const response = await this.client.v1.getGroupById(groupName, { headers })
      return response.data
    } catch (error) {
      handleServiceError(error, vpaErrorMessageHandler)
    }
  }

  public deleteGroup = async (name: string): Promise<void> => {
    const headers = await getBFFHeaders()
    try {
      await this.client.v1.deleteGroup(name, { headers })
    } catch (error) {
      handleServiceError(error, vpaErrorMessageHandler)
    }
  }

  public listGroups = async (): Promise<GroupsList> => {
    const headers = await getBFFHeaders()
    try {
      const response = await this.client.v1.listGroups({ headers })
      return response.data
    } catch (error) {
      handleServiceError(error, vpaErrorMessageHandler)
    }
  }

  public addUserToGroup = async (groupName: string, userId: string) => {
    const headers = await getBFFHeaders()
    try {
      const response = await this.client.v1.addUserToGroup(groupName, { userId }, { headers })
      return response.data
    } catch (error) {
      handleServiceError(error, vpaErrorMessageHandler)
    }
  }

  public removeUserFromGroup = async (groupName: string, userId: string): Promise<void> => {
    const headers = await getBFFHeaders()
    try {
      await this.client.v1.removeUserFromGroup(groupName, { userId }, { headers })
    } catch (error) {
      handleServiceError(error, vpaErrorMessageHandler)
    }
  }

  public listGroupUsers = async (
    groupName: string,
    query: { limit?: number; exclusiveStartKey?: string },
  ): Promise<GroupUserMappingsList> => {
    const headers = await getBFFHeaders()
    try {
      const response = await this.client.v1.listGroupUserMappings(groupName, query, { headers })
      return response.data
    } catch (error) {
      handleServiceError(error, vpaErrorMessageHandler)
    }
  }
}

const vpAdapterService = new VPAdapterService()
export { vpAdapterService }
