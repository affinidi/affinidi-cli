import {
  PexQueryApi,
  PexQueryDto,
  CreatePexQueryInput,
  UpdatePexQueryInput,
  Configuration,
  ConfigurationsApi,
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
  constructor(
    private readonly configurationsApiClient = new ConfigurationsApi(new Configuration({ basePath, baseOptions })),
    private readonly pexQueryApiClient = new PexQueryApi(new Configuration({ basePath, baseOptions })),
  ) {}

  public listIotaConfigurations = async (): Promise<any> => {
    try {
      const response = await this.configurationsApiClient.listIotaConfigurations()

      return response.data
    } catch (error) {
      handleServiceError(error)
    }
  }

  public getIotaConfigById = async (configurationId: string): Promise<IotaConfigurationDto> => {
    try {
      const response = await this.configurationsApiClient.getIotaConfigurationById(configurationId)

      return response.data
    } catch (error) {
      handleServiceError(error)
    }
  }

  public updateIotaConfigById = async (configurationId: string, input: UpdateConfigurationByIdInput): Promise<any> => {
    try {
      const response = await this.configurationsApiClient.updateIotaConfigurationById(configurationId, input)

      return response.data
    } catch (error) {
      handleServiceError(error)
    }
  }

  public deleteIotaConfigById = async (configurationId: string): Promise<void> => {
    try {
      await this.configurationsApiClient.deleteIotaConfigurationById(configurationId)
    } catch (error) {
      handleServiceError(error)
    }
  }

  public createIotaConfig = async (input: CreateIotaConfigurationInput): Promise<IotaConfigurationDto> => {
    try {
      const response = await this.configurationsApiClient.createIotaConfiguration(input)

      return response.data
    } catch (error) {
      handleServiceError(error)
    }
  }

  public listPexQueries = async (configurationId: string): Promise<any> => {
    try {
      const response = await this.pexQueryApiClient.listPexQueries(configurationId)

      return response.data
    } catch (error) {
      handleServiceError(error)
    }
  }

  public getPexQueryById = async (configurationId: string, queryId: string): Promise<PexQueryDto> => {
    try {
      const response = await this.pexQueryApiClient.getPexQueryById(configurationId, queryId)

      return response.data
    } catch (error) {
      handleServiceError(error)
    }
  }

  public updatePexQueryById = async (
    configurationId: string,
    queryId: string,
    input: UpdatePexQueryInput,
  ): Promise<any> => {
    try {
      const response = await this.pexQueryApiClient.updatePexQueryById(configurationId, queryId, input)

      return response.data
    } catch (error) {
      handleServiceError(error)
    }
  }

  public deletePexQueryById = async (configurationId: string, queryId: string): Promise<void> => {
    try {
      await this.pexQueryApiClient.deletePexQueryById(configurationId, queryId)
    } catch (error) {
      handleServiceError(error)
    }
  }

  public createPexQuery = async (configurationId: string, input: CreatePexQueryInput): Promise<PexQueryDto> => {
    try {
      const response = await this.pexQueryApiClient.createPexQuery(configurationId, input)

      return response.data
    } catch (error) {
      handleServiceError(error)
    }
  }
}

const iotaService = new IotaService()

export { iotaService }
