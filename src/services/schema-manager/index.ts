import { StatusCodes } from 'http-status-codes'

import { Api as SchemaManagerApi, SchemaDto } from './schema-manager.api'
import { ServiceDownError, Unauthorized } from '../../errors'

export const SCHEMA_MANAGER_URL = 'https://affinidi-schema-manager.dev.affinity-project.org/api/v1'

export type ScopeType = 'public' | 'unlisted' | 'default'

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
      throw Unauthorized
    }
  }

  public getById = async (id: string, apiKey: string): Promise<SchemaDto> => {
    try {
      return (await this.client.schemas.getSchema(id, { headers: { 'API-KEY': apiKey } })).data
    } catch (error: any) {
      // TODO: change later to be handled golabally
      switch (error.response.status) {
        case StatusCodes.FORBIDDEN:
        case StatusCodes.UNAUTHORIZED:
          throw Unauthorized
        case StatusCodes.INTERNAL_SERVER_ERROR:
          throw ServiceDownError
        default:
          throw new Error(error?.message)
      }
    }
  }
}

export const schemaManagerService = new SchemaManagerService()
