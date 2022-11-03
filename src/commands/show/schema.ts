import { CliUx, Command, Flags, Interfaces } from '@oclif/core'
import { CommandError } from '@oclif/core/lib/interfaces'

import { VAULT_KEYS, vaultService } from '../../services/vault'
import { schemaManagerService, ScopeType } from '../../services/schema-manager'

export type ShowFieldType = 'info' | 'json' | 'jsonld'

export default class Schema extends Command {
  static description = `
    Fetches the information of a specific schema.
  `

  static examples: Interfaces.Example[] = [
    {
      description: 'Shows the url to complete details of the given schema',
      command: '<%= config.bin %> <%= command.id %> [SCHEMA-ID]',
    },
    {
      description: 'Shows the url to the json file of the given schema',
      command: '<%= config.bin %> <%= command.id %> [SCHEMA-ID] --show json',
    },
    {
      description: 'Shows the url to the json-ld-context of the given schema',
      command: '<%= config.bin %> <%= command.id %> [SCHEMA-ID] --show jsonld',
    },
  ]

  static flags = {
    show: Flags.enum<ShowFieldType>({
      char: 's',
      options: ['info', 'json', 'jsonld'],
      description: 'The details of the schema to show',
      default: 'info',
    }),
  }

  static args: Interfaces.Arg[] = [
    {
      name: 'schema-id',
      required: true,
      description: 'id or name of the schema to display',
    },
  ]

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(Schema)

    const apiKey = vaultService.get(VAULT_KEYS.projectAPIKey)
    const schema = await schemaManagerService.getById(args['schema-id'], apiKey)

    let output = ''
    switch (flags.show) {
      case 'json':
        output = schema.jsonSchemaUrl
        break
      case 'jsonld':
        output = schema.jsonLdContextUrl
        break
      default:
        output = JSON.stringify(schema, null, '  ')
    }

    CliUx.ux.log(output)
  }

  protected async catch(err: CommandError): Promise<void> {
    CliUx.ux.info(err.message)
  }
}
