import { CliUx, Command, Flags } from '@oclif/core'
import fs from 'fs/promises'
import { StatusCodes } from 'http-status-codes'

import { schemaManagerService } from '../../services/schema-manager'
import { vaultService, VAULT_KEYS } from '../../services'
import { CreateSchemaInputDto } from '../../services/schema-manager/schema-manager.api'
import { enterSchemaName } from '../../user-actions'
import {
  generate,
  generateSchemaFilesMetadata,
  generateSchemaId,
  Options,
} from '../../services/schema-manager/generator/helpers'
import { VcJsonSchema } from '../../services/schema-manager/generator/types'
import { parseSchema } from '../../services/schema-manager/schemaParser/schema-parser'
import {
  CliError,
  getErrorOutput,
  InvalidSchemaName,
  JsonFileSyntaxError,
  Unauthorized,
  WrongSchemaFileType,
} from '../../errors'
import { analyticsService, generateUserMetadata } from '../../services/analytics'
import { EventDTO } from '../../services/analytics/analytics.api'
import { getSession } from '../../services/user-management'
import { isAuthenticated } from '../../middleware/authentication'

export default class Schema extends Command {
  static command = 'affinidi create schema'

  static usage = 'affinidi create schema [schemaName] [FLAGS]'

  static description = 'Use this command to create a new Schema for your verifiable credential.'

  static flags = {
    public: Flags.enum<'true' | 'false'>({
      char: 'p',
      options: ['true', 'false'],
      description: 'To specify if you want to create public or private schemas',
      default: 'false',
    }),

    description: Flags.string({ char: 'd', description: 'description of schema', required: true }),
    source: Flags.string({
      char: 's',
      description: 'path to the json file with schema properties',
      required: true,
    }),
  }

  static args = [{ name: 'schemaName' }]

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(Schema)
    if (!isAuthenticated()) {
      throw new CliError(Unauthorized, StatusCodes.UNAUTHORIZED, 'schema')
    }
    const apiKeyhash = vaultService.get(VAULT_KEYS.projectAPIKey)
    const did = vaultService.get(VAULT_KEYS.projectDID)
    const session = getSession()

    let { schemaName } = args
    if (!(flags.source.split('.').pop() === 'json')) {
      throw new Error(WrongSchemaFileType)
    }

    if (!schemaName) {
      schemaName = await enterSchemaName()
    }
    const regex = new RegExp(/^[0-9a-zA-Z]+$/)
    if (!regex.test(schemaName)) {
      CliUx.ux.error(new Error(InvalidSchemaName))
    }

    const scope = flags.public ? 'public' : 'unlisted'
    const params = {
      apiKey: apiKeyhash,
      authorDid: did,
      scope,
      limit: 1,
      skip: 0,
    }
    const [version, revision] = await schemaManagerService.generateNextVersion(
      { type: schemaName, scope },
      params,
    )

    const generateIdInput: Options = {
      namespace: flags.public ? undefined : did,
      type: schemaName,
      version,
      revision,
    }
    schemaName = generateSchemaId(generateIdInput)
    const { jsonSchemaUrl, jsonLdContextUrl } = generateSchemaFilesMetadata(
      'https://schema-manager.prod.affinity-project.org',
      schemaName,
    )
    const file = await fs.readFile(flags.source, 'utf-8')
    const schemaProperties = JSON.parse(file)
    const schema: VcJsonSchema = {
      title: schemaName,
      description: flags.description,
      $id: schemaName,
      $metadata: {
        discoverable: true,
        version: generateIdInput.version,
        revision: generateIdInput.revision,
        uris: {
          jsonLdContext: jsonLdContextUrl,
          jsonSchema: jsonSchemaUrl,
        },
      },
      properties: {
        credentialSubject: schemaProperties,
      },
    }
    const { header, fields } = parseSchema(schema)
    const { jsonSchema, jsonLdContext } = generate(header, fields)
    const createSchemaInput: CreateSchemaInputDto = {
      jsonLdContext,
      jsonSchema,
      version: generateIdInput.version,
      revision: generateIdInput.revision,
      scope,
      type: generateIdInput.type,
      authorDid: did,
      description: flags.description,
    }
    CliUx.ux.action.start('Creating Schema')
    const schemaInfo = await schemaManagerService.createSchema(apiKeyhash, createSchemaInput)
    CliUx.ux.action.stop('')
    const analyticsData: EventDTO = {
      name: 'VC_SCHEMA_CREATED',
      category: 'APPLICATION',
      component: 'Cli',
      uuid: session?.account?.id,
      metadata: {
        schemaId: schemaInfo?.id,
        commandId: 'affinidi.createSchema',
        ...generateUserMetadata(session?.account?.label),
      },
    }
    await analyticsService.eventsControllerSend(analyticsData)
    CliUx.ux.info(JSON.stringify(schemaInfo, null, ' '))
  }

  async catch(error: CliError) {
    if (error instanceof SyntaxError) {
      CliUx.ux.info(JsonFileSyntaxError)
    } else {
      CliUx.ux.info(getErrorOutput(error, Schema.command, Schema.usage, Schema.description))
    }
  }
}
