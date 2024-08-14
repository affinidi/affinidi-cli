import { readFile } from 'fs/promises'
import { CreatePexQueryInput, PexQueryDto } from '@affinidi-tdk/iota-client'
import { ux, Flags } from '@oclif/core'
import { CLIError } from '@oclif/core/errors'
import z from 'zod'
import { BaseCommand } from '../../common/base-command.js'
import { giveFlagInputErrorMessage } from '../../common/error-messages.js'
import { promptRequiredParameters } from '../../common/prompts.js'
import { INPUT_LIMIT, PRESENTATION_DEFINITION_LIMIT, validateInputLength } from '../../common/validators.js'
import { iotaService } from '../../services/affinidi/iota/service.js'

export class CreatePexQuery extends BaseCommand<typeof CreatePexQuery> {
  static summary = 'Creates Iota configuration in your active project'
  static examples = [
    '<%= config.bin %> <%= command.id %> -i <value> -n <value> -d <value> -f pexQuery.json',
    '<%= config.bin %> <%= command.id %> --configuration-id <value> --name <value> --description <value> --file pexQuery.json',
  ]

  static flags = {
    'configuration-id': Flags.string({
      char: 'i',
      summary: 'ID of the Iota configuration',
    }),
    name: Flags.string({
      char: 'n',
      summary: 'PEX query name',
    }),
    description: Flags.string({
      char: 'd',
      summary: 'PEX query description',
    }),
    file: Flags.string({
      char: 'f',
      summary: 'Location of a json file containing PEX query',
    }),
  }

  public async run(): Promise<PexQueryDto> {
    const { flags } = await this.parse(CreatePexQuery)
    const promptFlags = await promptRequiredParameters(['configuration-id', 'name', 'file'], flags)

    if (flags['no-input']) {
      if (!flags.name) throw new CLIError(giveFlagInputErrorMessage('name'))
      if (!flags.file) throw new CLIError(giveFlagInputErrorMessage('file'))
      if (!flags['configuration-id']) throw new CLIError(giveFlagInputErrorMessage('configuration-id'))
    }

    const flagsSchema = z.object({
      'configuration-id': z.string().max(INPUT_LIMIT).uuid(),
      name: z.string().min(3).max(INPUT_LIMIT),
      description: z.string().min(3).max(INPUT_LIMIT).optional(),
      file: z.string(),
    })
    const validatedFlags = flagsSchema.parse(promptFlags)

    let data: CreatePexQueryInput
    const rawData = await readFile(validatedFlags.file, 'utf8')

    try {
      data = JSON.parse(rawData)
      const vpDefinition = JSON.stringify(data)
      validateInputLength(vpDefinition, PRESENTATION_DEFINITION_LIMIT)

      data.name = validatedFlags.name
      data.vpDefinition = vpDefinition

      if (validatedFlags.description) {
        data.description = validatedFlags.description
      }
    } catch (error) {
      throw new CLIError(`Provided file is not a valid JSON\n${(error as Error).message}`)
    }

    const inputSchema = z.object({
      name: z.string(),
      description: z.string().optional(),
      vpDefinition: z.string(),
    })

    const input = inputSchema.parse(data)

    ux.action.start('Creating PEX query')
    const output = await iotaService.createPexQuery(validatedFlags['configuration-id'], input)
    ux.action.stop('Created successfully!')

    if (!this.jsonEnabled()) this.logJson(output)
    return output
  }
}
