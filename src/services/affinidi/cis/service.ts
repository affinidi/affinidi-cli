import {
  Configuration,
  ConfigurationApi,
  IssuanceConfigListResponse,
  IssuanceConfigDto,
  CreateIssuanceConfigInput,
  UpdateIssuanceConfigInput,
} from '@affinidi-tdk/credential-issuance-client'
import { config } from '../../env-config.js'
import { getBFFHeaders } from '../bff-service.js'
import { handleServiceError } from '../errors.js'

const headers = await getBFFHeaders()
const baseOptions = { headers }
const basePath = `${config.bffHost}/cis`

class IssuanceService {
  constructor(private readonly client = new ConfigurationApi(new Configuration({ basePath, baseOptions }))) {}

  public listIssuanceConfigs = async (): Promise<IssuanceConfigListResponse> => {
    try {
      const response = await this.client.getIssuanceConfigList()

      return response.data
    } catch (error) {
      handleServiceError(error)
    }
  }

  public getIssuanceConfigById = async (configId: string): Promise<IssuanceConfigDto> => {
    try {
      const response = await this.client.getIssuanceConfigById(configId)

      return response.data
    } catch (error) {
      handleServiceError(error)
    }
  }

  public updateIssuanceConfigById = async (
    configId: string,
    input: UpdateIssuanceConfigInput,
  ): Promise<IssuanceConfigDto> => {
    try {
      const response = await this.client.updateIssuanceConfigById(configId, input)

      return response.data
    } catch (error) {
      handleServiceError(error)
    }
  }

  public deleteIssuanceConfigById = async (configId: string): Promise<void> => {
    try {
      await this.client.deleteIssuanceConfigById(configId)
    } catch (error) {
      handleServiceError(error)
    }
  }

  public createIssuanceConfig = async (input: CreateIssuanceConfigInput): Promise<IssuanceConfigDto> => {
    try {
      const response = await this.client.createIssuanceConfig(input)

      return response.data
    } catch (error) {
      handleServiceError(error)
    }
  }
}

const issuanceService = new IssuanceService()

export { issuanceService }
