import { StatusCodes } from 'http-status-codes'

import { Api as SchemaManagerApi, SchemaDto } from './schema-manager.api'
import { Unauthorized } from '../../errors'

export const SCHEMA_MANAGER_URL = 'https://affinidi-schema-manager.prod.affinity-project.org/api/v1'

export type ScopeType = 'public' | 'unlisted' | 'default'

class SchemaManagerService {
  constructor(
    private readonly client = new SchemaManagerApi({
      baseURL: SCHEMA_MANAGER_URL,
    }),
  ) {}

  public search = async ({
    scope = 'default',
    skip = 0,
    limit = 10,
  }: {
    scope: ScopeType
    search?: string
    skip: number
    limit: number
  }): Promise<SchemaDto[]> => {
    try {
      const response = await this.client.schemas.searchSchemas({ scope, skip, limit })
      if (response.status !== StatusCodes.OK) {
        return []
      }
      return response.data.schemas
    } catch (err) {
      throw Unauthorized
    }
  }
}

export const schemaManagerService = new SchemaManagerService()
