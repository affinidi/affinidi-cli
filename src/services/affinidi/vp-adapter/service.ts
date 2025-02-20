import {
  GroupApi,
  Configuration,
  ConfigurationApi,
  CreateLoginConfigurationInput,
  CreateLoginConfigurationOutput,
  ListLoginConfigurationOutput,
  LoginConfigurationObject,
  UpdateLoginConfigurationInput,
  GroupDto,
  GroupsList,
  GroupUserMappingsList,
  ListGroupUserMappingsSortOrderEnum,
  AddUserToGroupInput,
} from '@affinidi-tdk/login-configuration-client'

import { AxiosError } from 'axios'
import { ServiceResourceIds } from '../../../common/constants.js'
import { config } from '../../env-config.js'
import { getBFFHeaders, bffService } from '../bff-service.js'
import { handleServiceError } from '../errors.js'

const headers = await getBFFHeaders()
const baseOptions = { headers }
const basePath = `${config.bffHost}/vpa`

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
    private readonly configurationApiClient = new ConfigurationApi(new Configuration({ basePath, baseOptions })),
    private readonly groupApiClient = new GroupApi(new Configuration({ basePath, baseOptions })),
  ) {}

  public createLoginConfig = async (
    createLoginConfigInput: CreateLoginConfigurationInput,
  ): Promise<CreateLoginConfigurationOutput> => {
    try {
      const response = await this.configurationApiClient.createLoginConfigurations(createLoginConfigInput)
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
    try {
      const response = await this.configurationApiClient.listLoginConfigurations(undefined)
      return response.data
    } catch (error) {
      handleServiceError(error, vpaErrorMessageHandler)
    }
  }

  public getLoginConfigurationById = async (id: string): Promise<LoginConfigurationObject> => {
    try {
      const response = await this.configurationApiClient.getLoginConfigurationsById(id)
      return response.data
    } catch (error) {
      handleServiceError(error, vpaErrorMessageHandler)
    }
  }

  public deleteLoginConfigurationById = async (id: string): Promise<void> => {
    try {
      await this.configurationApiClient.deleteLoginConfigurationsById(id)
    } catch (error) {
      handleServiceError(error, vpaErrorMessageHandler)
    }
  }

  public updateLoginConfigurationById = async (
    id: string,
    updateLoginConfigurationInput: UpdateLoginConfigurationInput,
  ): Promise<LoginConfigurationObject> => {
    try {
      const response = await this.configurationApiClient.updateLoginConfigurationsById(
        id,
        updateLoginConfigurationInput,
      )
      return response.data
    } catch (error) {
      handleServiceError(error, vpaErrorMessageHandler)
    }
  }

  public createGroup = async (groupName: string): Promise<GroupDto> => {
    try {
      const response = await this.groupApiClient.createGroup({ groupName: groupName })
      return response.data
    } catch (error) {
      handleServiceError(error, vpaErrorMessageHandler)
    }
  }

  public getGroup = async (groupName: string): Promise<GroupDto> => {
    try {
      const response = await this.groupApiClient.getGroupById(groupName)
      return response.data
    } catch (error) {
      handleServiceError(error, vpaErrorMessageHandler)
    }
  }

  public deleteGroup = async (name: string): Promise<void> => {
    try {
      await this.groupApiClient.deleteGroup(name)
    } catch (error) {
      handleServiceError(error, vpaErrorMessageHandler)
    }
  }

  public listGroups = async (): Promise<GroupsList> => {
    try {
      const response = await this.groupApiClient.listGroups()
      return response.data
    } catch (error) {
      handleServiceError(error, vpaErrorMessageHandler)
    }
  }

  public addUserToGroup = async (groupName: string, input: AddUserToGroupInput) => {
    const { userId, name, description } = input
    try {
      const response = await this.groupApiClient.addUserToGroup(groupName, { userId, name, description })
      return response.data
    } catch (error) {
      handleServiceError(error, vpaErrorMessageHandler)
    }
  }

  public removeUserFromGroup = async (groupName: string, userId: string): Promise<void> => {
    try {
      await this.groupApiClient.removeUserFromGroup(groupName, { userId })
    } catch (error) {
      handleServiceError(error, vpaErrorMessageHandler)
    }
  }

  public listGroupUsers = async (
    groupName: string,
    limit?: number,
    exclusiveStartKey?: string,
    sortOrder?: ListGroupUserMappingsSortOrderEnum,
  ): Promise<GroupUserMappingsList> => {
    try {
      const response = await this.groupApiClient.listGroupUserMappings(groupName, limit, exclusiveStartKey, sortOrder)
      return response.data
    } catch (error) {
      handleServiceError(error, vpaErrorMessageHandler)
    }
  }
}

const vpAdapterService = new VPAdapterService()
export { vpAdapterService }
