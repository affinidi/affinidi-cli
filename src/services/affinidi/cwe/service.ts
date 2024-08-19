import {
  WalletApi,
  WalletDto,
  Configuration,
  WalletsListDto,
  CreateWalletInput,
  UpdateWalletInput,
  CreateWalletResponse,
} from '@affinidi-tdk/wallets-client'
import { config } from '../../env-config.js'
import { getBFFHeaders } from '../bff-service.js'
import { handleServiceError } from '../errors.js'

const headers = await getBFFHeaders()
const baseOptions = { headers }
const basePath = `${config.bffHost}/cwe`

class CweService {
  constructor(private readonly client = new WalletApi(new Configuration({ basePath, baseOptions }))) {}

  public listWallets = async (): Promise<WalletsListDto> => {
    try {
      const response = await this.client.listWallets()

      return response.data
    } catch (error) {
      handleServiceError(error)
    }
  }

  public getWallet = async (id: string): Promise<WalletDto> => {
    try {
      const response = await this.client.getWallet(id)

      return response.data
    } catch (error) {
      handleServiceError(error)
    }
  }

  public updateWallet = async (id: string, input: UpdateWalletInput): Promise<WalletDto> => {
    try {
      const response = await this.client.updateWallet(id, input)

      return response.data
    } catch (error) {
      handleServiceError(error)
    }
  }

  public createWallet = async (input: CreateWalletInput): Promise<CreateWalletResponse> => {
    try {
      const response = await this.client.createWallet(input)

      return response.data
    } catch (error) {
      handleServiceError(error)
    }
  }

  public deleteWallet = async (id: string): Promise<void> => {
    try {
      await this.client.deleteWallet(id)
    } catch (error) {
      handleServiceError(error)
    }
  }
}

const cweService = new CweService()

export { cweService }
