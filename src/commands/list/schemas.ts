import { CliUx, Command, Flags } from '@oclif/core'
import { CommandError } from '@oclif/core/lib/interfaces'

import { schemaManagerService, ScopeType } from '../../services/schema-manager'

type OutputType = 'table' | 'json'

const printData = (
  data: Record<string, unknown>[],
  { extended, output }: { extended: boolean; output: OutputType },
): void => {
  switch (output) {
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
  static description = 'describe the command here'

  static examples = ['<%= config.bin %> <%= command.id %>']

  static flags = {
    ...CliUx.ux.table.flags(),

    limit: Flags.integer({
      char: 'l',
      description: 'The number of schemas to display',
      default: 10,
    }),
    output: Flags.enum<OutputType>({
      char: 'o',
      options: ['json', 'table'],
      description: 'The type of output',
      default: 'json',
    }),
    scope: Flags.enum<ScopeType>({
      char: 'c',
      options: ['default', 'public', 'unlisted'],
      description: 'The type of scope',
      default: 'default',
    }),
    // search: Flags.string({ char: 'q', description: 'The name of the schema to search for' }),
    skip: Flags.integer({ char: 's', description: 'The number of schemas to skip', default: 0 }),
  }

  static args = [{ name: 'file' }]

  public async run(): Promise<void> {
    const { flags } = await this.parse(Schemas)

    const { extended, limit, output, scope, skip } = flags

    const schemas = await schemaManagerService.search({ limit, scope, skip })

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