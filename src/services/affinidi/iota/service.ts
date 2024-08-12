import {
  ConfigurationsApi,
  Configuration,
  IotaConfigurationDto,
  CreateIotaConfigurationInput,
  UpdateConfigurationByIdInput,
} from '@affinidi-tdk/iota-client'
import { config } from '../../env-config.js'
import { getBFFHeaders } from '../bff-service.js'
import { handleServiceError } from '../errors.js'

const headers = await getBFFHeaders()
const baseOptions = { headers }
const basePath = `${config.bffHost}/ais`

class IotaService {
  constructor(private readonly client = new ConfigurationsApi(new Configuration({ basePath, baseOptions }))) {}

  public listIotaConfigurations = async (): Promise<any> => {
    try {
      const response = await this.client.listIotaConfigurations()

      return response.data
    } catch (error) {
      handleServiceError(error)
    }
  }

  public getIotaConfigById = async (configurationId: string): Promise<IotaConfigurationDto> => {
    try {
      const response = await this.client.getIotaConfigurationById(configurationId)

      return response.data
    } catch (error) {
      handleServiceError(error)
    }
  }

  public updateIotaConfigById = async (configurationId: string, input: UpdateConfigurationByIdInput): Promise<any> => {
    try {
      const response = await this.client.updateIotaConfigurationById(configurationId, input)

      return response.data
    } catch (error) {
      handleServiceError(error)
    }
  }

  public deleteIotaConfigById = async (configurationId: string): Promise<void> => {
    try {
      await this.client.deleteIotaConfigurationById(configurationId)
    } catch (error) {
      handleServiceError(error)
    }
  }

  public createIotaConfig = async (input: CreateIotaConfigurationInput): Promise<IotaConfigurationDto> => {
    try {
      const response = await this.client.createIotaConfiguration(input)

      return response.data
    } catch (error) {
      handleServiceError(error)
    }
  }
}

const iotaService = new IotaService()

export { iotaService }
