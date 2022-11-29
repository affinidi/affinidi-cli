import { CliUx, Command, Flags, Interfaces } from '@oclif/core'
import { StatusCodes } from 'http-status-codes'

import { getErrorOutput, CliError, Unauthorized } from '../../errors'
import { VAULT_KEYS, vaultService } from '../../services/vault'
import { schemaManagerService } from '../../services/schema-manager'
import { getSession } from '../../services/user-management'
import { analyticsService, generateUserMetadata } from '../../services/analytics'
import { EventDTO } from '../../services/analytics/analytics.api'
import { isAuthenticated } from '../../middleware/authentication'

export type ShowFieldType = 'info' | 'json' | 'jsonld'

export default class Schema extends Command {
  static command = 'affinidi show schema'

  static usage = 'show schema [schema-id]'

  static description = `Fetches the information of a specific schema.`

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
    if (!isAuthenticated()) {
      throw new CliError(Unauthorized, StatusCodes.UNAUTHORIZED, 'schema')
    }
    const session = getSession()

    CliUx.ux.action.start('Fetching schema')

    const apiKey = vaultService.get(VAULT_KEYS.projectAPIKey)
    const schema = await schemaManagerService.getById(args['schema-id'], apiKey)
    const analyticsData: EventDTO = {
      name: 'VC_SCHEMAS_READ',
      category: 'APPLICATION',
      component: 'Cli',
      uuid: session?.account?.id,
      metadata: {
        schemaId: schema?.id,
        commandId: 'affinidi.showSchema',
        ...generateUserMetadata(session?.account?.label),
      },
    }
    await analyticsService.eventsControllerSend(analyticsData)
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

    CliUx.ux.action.stop('')
    CliUx.ux.log(output)
  }

  protected async catch(error: CliError): Promise<void> {
    CliUx.ux.action.stop('failed')
    CliUx.ux.info(getErrorOutput(error, Schema.command, Schema.usage, Schema.description))
  }
}
