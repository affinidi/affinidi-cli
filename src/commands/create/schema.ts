import { CliUx, Command, Flags } from '@oclif/core'
import fs from 'fs/promises'

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
  WrongSchemaFileType,
} from '../../errors'

type ScopeType = 'public' | 'unlisted'

export default class Schema extends Command {
  static command = 'affinidi create schema'

  static usage = 'affinidi create schema [schemaName] [FLAGS]'

  static description = 'Use this command to create a new Schema for your verifiable credential.'

  static flags = {
    public: Flags.enum<ScopeType>({
      char: 'p',
      description: 'specifys whether the schema will be public or unlisted',
      options: ['public', 'unlisted'],
      default: 'unlisted',
    }),

    description: Flags.string({ char: 'd', description: 'description of schema', required: true }),
    source: Flags.string({
      char: 's',
      description: 'directory of the json file with schema properties',
      required: true,
    }),
  }

  static args = [{ name: 'schemaName' }]

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(Schema)
    const apiKeyhash = vaultService.get(VAULT_KEYS.projectAPIKey)
    const did = vaultService.get(VAULT_KEYS.projectDID)

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
    const params = {
      apiKey: apiKeyhash,
      authorDid: did,
      scope: flags.public,
      limit: 1,
      skip: 0,
    }
    const [version, revision] = await schemaManagerService.generateNextVersion(
      {
        type: schemaName,
        scope: flags.public,
      },
      params,
    )

    const generateIdInput: Options = {
      namespace: flags.public === 'unlisted' ? did : undefined,
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
      scope: flags.public,
      type: generateIdInput.type,
      authorDid: did,
      description: flags.description,
    }
    CliUx.ux.action.start('Creating Schema')
    const schemaInfo = await schemaManagerService.createSchema(apiKeyhash, createSchemaInput)
    CliUx.ux.action.stop('')
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
