import { CliUx, Command, Flags, Interfaces } from '@oclif/core'
import { CommandError } from '@oclif/core/lib/interfaces'
import { stringify as csvStringify } from 'csv-stringify'

import { vaultService, VAULT_KEYS } from '../../services'
import { schemaManagerService, ScopeType } from '../../services/schema-manager'

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
  static description = `
    Fetches the schemas from the schema-manager and displays them in different format:
    json, csv or table
  `

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

  protected async catch(err: CommandError): Promise<void> {
    CliUx.ux.info(err.message)
  }
}
