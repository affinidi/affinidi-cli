import { data } from './commands/login/data'
import { getProjectScopedToken } from './get-project-scoped-token'
import { DeleteLoginConfiguration } from '../../src/commands/login/delete-config'
import { tokenService } from '../../src/services/affinidi/auth/token'

export async function mochaGlobalSetup() {
  const accessToken = await getProjectScopedToken()

  tokenService.getProjectToken().projectAccessToken = accessToken

  // TODO: Ensure all test artifacts are cleaned up so that the tests can start
  //       with a clean state, to prevent:
  //       Error: The resource you are trying to create already exists. Please, make sure the resource identifier is unique
  // console.log('Clean up')
}

export async function mochaGlobalTeardown() {
  /* NOTE: In oclif/test, the tests run only after they are in memory so all delete operations
           have to happen after the commands have run. */
  await DeleteLoginConfiguration.run([`--id=${data.deleteConfigId}`])
}
