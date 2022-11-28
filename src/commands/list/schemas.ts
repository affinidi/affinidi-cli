import { CliUx, Command, Flags, Interfaces } from '@oclif/core'
import { stringify as csvStringify } from 'csv-stringify'
import { StatusCodes } from 'http-status-codes'

import { getSession } from '../../services/user-management'
import { getErrorOutput, CliError, Unauthorized } from '../../errors'
import { vaultService, VAULT_KEYS } from '../../services'
import { schemaManagerService, ScopeType } from '../../services/schema-manager'
import { EventDTO } from '../../services/analytics/analytics.api'
import { analyticsService, generateUserMetadata } from '../../services/analytics'
import { isAuthenticated } from '../../middleware/authentication'
import { anonymous } from '../../constants'

type OutputType = 'csv' | 'table' | 'json'

const printData = (
  data: Record<string, unknown>[],
  { extended, output }: { extended: boolean; output: OutputType },
): void => {
  switch (output) {
    case 'csv':
      csvStringify(data, { header: true }).pipe(process.stdout)
      break
    case 'table':
      CliUx.ux.table(
        data,
        {
          index: { header: '' },
          id: { header: 'ID' },
          description: { header: 'DESC' },
          createdAt: { header: 'Created', extended: true },
          parentId: { header: 'parent Id', extended: true },
          authorDid: { header: 'author Did', extended: true },
          version: {},
          revision: { extended: true },
          type: {},
          jsonSchemaUrl: { header: 'Schema Url', extended: true },
        },
        {
          extended,
        },
      )
      break
    default:
      CliUx.ux.info(JSON.stringify(data, null, '  '))
  }
}

export default class Schemas extends Command {
  static command = 'affinidi list schemas'

  static usage = 'show schemas [FLAGS]'

  static description = `Fetches and displays the schemas from the schema-manager.`

  static examples: Interfaces.Example[] = [
    {
      description: 'Display in an extended table the schemas from the 5th to the 15th',
      command: '<%= config.bin %> <%= command.id %> --output table --extended --skip 5 --limit 10',
    },
  ]

  static flags = {
    ...CliUx.ux.table.flags(),
    limit: Flags.integer({
      char: 'l',
      description: 'The number of schemas to display',
      default: 10,
    }),
    output: Flags.enum<OutputType>({
      char: 'o',
      options: ['csv', 'json', 'table'],
      description: 'The type of output',
      default: 'json',
    }),
    scope: Flags.enum<ScopeType>({
      char: 'c',
      options: ['default', 'public', 'unlisted'],
      description: 'The type of scope',
      default: 'default',
    }),
    public: Flags.enum<'true' | 'false'>({
      char: 'p',
      options: ['true', 'false'],
      description: 'To specify if you want to get public or private schemas',
      default: 'true',
    }),
    // search: Flags.string({ char: 'q', description: 'The name of the schema to search for' }),
    skip: Flags.integer({ char: 's', description: 'The number of schemas to skip', default: 0 }),
  }

  static args = [{ name: 'file' }]

  public async run(): Promise<void> {
    const { flags } = await this.parse(Schemas)

    const { extended, limit, public: publicFlag, output, scope, skip } = flags
    if (!isAuthenticated() && (scope === 'unlisted' || publicFlag === 'false')) {
      throw new CliError(Unauthorized, StatusCodes.UNAUTHORIZED, 'schema')
    }
    const session = getSession()
    const analyticsData: EventDTO = {
      name: 'VC_SCHEMAS_SEARCHED',
      category: 'APPLICATION',
      component: 'Cli',
      uuid: session ? session.account?.id : anonymous,
      metadata: {
        commandId: 'affinidi.listSchemas',
        ...generateUserMetadata(session?.account?.label),
      },
    }
    const apiKey = vaultService.get(VAULT_KEYS.projectAPIKey)
    const did = vaultService.get(VAULT_KEYS.projectDID)
    const params = {
      apiKey,
      authorDid: did,
      did,
      limit,
      scope: publicFlag === 'false' ? 'unlisted' : scope,
      skip,
    }

    const schemas = await schemaManagerService.search(params)
    await analyticsService.eventsControllerSend(analyticsData)

    const data = schemas
      .map((s, index) => {
        return {
          index,
          id: s.id,
          parentId: s.parentId,
          authorDid: s.authorDid,
          description: s.description,
          createdAt: s.createdAt,
          type: s.type,
          version: s.version,
          revision: s.revision,
          jsonSchemaUrl: s.jsonSchemaUrl,
        }
      })
      .slice(skip, skip + limit)

    printData(data, { extended, output })
  }

  protected async catch(error: CliError): Promise<void> {
    CliUx.ux.action.stop('failed')
    CliUx.ux.info(getErrorOutput(error, Schemas.command, Schemas.usage, Schemas.description))
  }
}
