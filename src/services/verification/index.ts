import { CliError, handleErrors } from '../../errors'
import { Api as VerifierApi, VerifyCredentialInput, VerifyCredentialOutput } from './verifier.api'

export const VERIFIER_URL = 'https://affinity-verifier.prod.affinity-project.org/api/v1'
const SERVICE = 'verification'

class VerifierService {
  constructor(
    private readonly client = new VerifierApi({
      baseURL: VERIFIER_URL,
      withCredentials: true,
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
      return handleErrors(new CliError(error?.message, error.response.status, SERVICE))
    }
  }
}

const verfierService = new VerifierService()
export { verfierService }
