import { vaultService } from '../services/vault/typedVaultService'
import { schemaManagerService, ScopeType } from '../services/schema-manager'
import { SchemaDto } from '../services/schema-manager/schema-manager.api'
import { selectSchemaId, selectSchemaUrl } from '../user-actions/inquirer'
import { CliError } from '../errors'

export const getSchemaList = async (page: number): Promise<SchemaDto[]> => {
  const {
    apiKey: { apiKeyHash: apiKey },
    wallet: { did },
  } = vaultService.getActiveProject()
  const scope: ScopeType = 'default'
  const params = {
    apiKey,
    authorDid: did,
    did,
    limit: 10,
    scope,
    skip: 10 * page,
  }
  const schemas = await schemaManagerService.search(params)
  return schemas
}

export const getSchemaUrl = async (schemaId: string): Promise<string> => {
  const {
    apiKey: { apiKeyHash: apiKey },
  } = vaultService.getActiveProject()
  const schema = await schemaManagerService.getById(schemaId, apiKey)
  return schema.jsonSchemaUrl
}

export const chooseSchemaId = async (page: number): Promise<string> => {
  const schemas = await getSchemaList(page)
  const maxIdLength = schemas.map((p) => p.id.length).reduce((p, c) => Math.max(p, c), 0)
  const maxDescLength = schemas
    .map((p) => (p.description ? p.description.length : 0))
    .reduce((p, c) => Math.max(p, c), 0)

  const schemaId = await selectSchemaId(schemas, maxIdLength, maxDescLength, page)

  if (schemaId === 'more') return chooseSchemaId(page + 1)
  if (schemaId === 'previous') return chooseSchemaId(page - 1)

  return schemaId
}

export const chooseSchemaUrl = async (page: number): Promise<string> => {
  const schemas = await getSchemaList(page)
  const maxIdLength = schemas.map((p) => p.id.length).reduce((p, c) => Math.max(p, c), 0)
  const maxUrlLength = schemas
    .map((p) => p.jsonSchemaUrl.length)
    .reduce((p, c) => Math.max(p, c), 0)

  const schemaUrl = await selectSchemaUrl(schemas, maxIdLength, maxUrlLength, page)

  if (schemaUrl === 'more') return chooseSchemaUrl(page + 1)
  if (schemaUrl === 'previous') return chooseSchemaUrl(page - 1)

  return schemaUrl
}

export const checkErrorFromWizard = (error: CliError): boolean => error.stack.includes('Start')

export const nextFuncAfterError: (() => void)[] = []
