import { StatusCodes } from 'http-status-codes'
import { getNextVersion } from './generator/helpers'

import { Api as SchemaManagerApi, CreateSchemaInputDto, SchemaDto } from './schema-manager.api'
import { CliError } from '../../errors'

export const SCHEMA_MANAGER_URL = 'https://affinidi-schema-manager.prod.affinity-project.org/api/v1'

export type ScopeType = 'public' | 'unlisted' | 'default'
const SERVICE = 'schema'

class SchemaManagerService {
  constructor(
    private readonly client = new SchemaManagerApi({
      baseURL: SCHEMA_MANAGER_URL,
    }),
  ) {}

  public search = async ({
    apiKey = null,
    // authorDid = null,
    did = null,
    scope = 'default',
    skip = 0,
    limit = 10,
  }: {
    apiKey?: string
    authorDid?: string
    did?: string
    scope: ScopeType
    search?: string
    skip: number
    limit: number
  }): Promise<SchemaDto[]> => {
    try {
      const response = await this.client.schemas.searchSchemas(
        { did, scope, skip, limit },
        {
          headers: {
            'API-KEY': apiKey,
          },
        },
      )
      if (response.status !== StatusCodes.OK) {
        return []
      }
      return response.data.schemas
    } catch (err) {
      throw new CliError(err?.message, err.response.status, SERVICE)
    }
  }

  public getById = async (id: string, apiKey: string): Promise<SchemaDto> => {
    try {
      return (await this.client.schemas.getSchema(id, { headers: { 'API-KEY': apiKey } })).data
    } catch (error: any) {
      throw new CliError(error?.message, error.response.status, SERVICE)
    }
  }

  public createSchema = async (
    apiKey: string,
    schemaInput: CreateSchemaInputDto,
  ): Promise<SchemaDto> => {
    try {
      return (
        await this.client.schemas.createSchema(schemaInput, { headers: { 'API-KEY': apiKey } })
      ).data
    } catch (error: any) {
      throw new CliError(error?.message, error.response.status, SERVICE)
    }
  }

  public generateNextVersion = async (
    { type, scope }: { type: string; scope: ScopeType },
    {
      apiKey = null,
      authorDid = null,
      limit = 1,
      skip = 0,
    }: { apiKey: string; authorDid: string; limit: number; skip: number },
  ) => {
    const schemas = await this.client.schemas.searchSchemas(
      { scope, skip, limit, type, did: authorDid },
      {
        headers: {
          'API-KEY': apiKey,
        },
      },
    )

    return schemas.data.count
      ? getNextVersion({
          version: schemas.data.schemas[0].version,
          revision: schemas.data.schemas[0].revision,
        })
      : [1, 0]
  }
}

export const schemaManagerService = new SchemaManagerService()
