import { vaultService } from '../services/vault/typedVaultService'
import { schemaManagerService, ScopeType } from '../services/schema-manager'
import { SchemaDto } from '../services/schema-manager/schema-manager.api'
import { selectSchemaId, selectSchemaUrl } from '../user-actions/inquirer'
import { CliError } from '../errors'

export const getSchemaList = async (): Promise<SchemaDto[]> => {
  const {
    apiKey: { apiKeyHash: apiKey },
    wallet: { did },
  } = vaultService.getActiveProject()
  const scope: ScopeType = 'default'
  const params = {
    apiKey,
    authorDid: did,
    did,
    limit: Number.MAX_SAFE_INTEGER,
    scope,
    skip: 0,
  }
  const schemas = await schemaManagerService.search(params)
  return schemas
}

export const chooseSchemaId = async (): Promise<string> => {
  const schemas = await getSchemaList()
  const maxIdLength = schemas.map((p) => p.id.length).reduce((p, c) => Math.max(p, c), 0)
  const maxDescLength = schemas
    .map((p) => (p.description ? p.description.length : 0))
    .reduce((p, c) => Math.max(p, c), 0)
  const schemaId = await selectSchemaId(schemas, maxIdLength, maxDescLength)
  return schemaId
}

export const chooseSchemaUrl = async (): Promise<string> => {
  const schemas = await getSchemaList()
  const maxIdLength = schemas.map((p) => p.id.length).reduce((p, c) => Math.max(p, c), 0)
  const maxUrlLength = schemas
    .map((p) => p.jsonSchemaUrl.length)
    .reduce((p, c) => Math.max(p, c), 0)
  const schemaUrl = await selectSchemaUrl(schemas, maxIdLength, maxUrlLength)
  return schemaUrl
}

export const checkErrorFromWizard = (error: CliError): boolean => error.stack.includes('Start')

export const nextFuncAfterError: (() => void)[] = []
