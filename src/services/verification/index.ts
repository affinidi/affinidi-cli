import { CliError } from '../../errors'
import { Api as VerifierApi, VerifyCredentialInput, VerifyCredentialOutput } from './verifier.api'

export const VERIFIER_BASE_URL = 'https://affinity-verifier.prod.affinity-project.org'
export const VERIFIER_URL = `${VERIFIER_BASE_URL}/api/v1`
const SERVICE = 'verification'

class VerifierService {
  constructor(
    private readonly client = new VerifierApi({
      baseUrl: VERIFIER_URL,
    }),
  ) {}

  public verifyVC = async (
    apiKey: string,
    verifyVCInput: VerifyCredentialInput,
  ): Promise<VerifyCredentialOutput> => {
    try {
      const resp = await this.client.verifier.verifyCredentials(verifyVCInput, {
        headers: { 'Api-Key': apiKey },
      })
      return resp.data
    } catch (error) {
      throw new CliError(error?.message, error.response.status, SERVICE)
    }
  }
}

const verfierService = new VerifierService()
export { verfierService }
