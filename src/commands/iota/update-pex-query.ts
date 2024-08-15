import { readFile } from 'fs/promises'
import { UpdatePexQueryInput, PexQueryDto } from '@affinidi-tdk/iota-client'
import { ux, Flags } from '@oclif/core'
import { CLIError } from '@oclif/core/errors'
import z from 'zod'
import { BaseCommand } from '../../common/base-command.js'
import { giveFlagInputErrorMessage } from '../../common/error-messages.js'
import { promptRequiredParameters } from '../../common/prompts.js'
import { INPUT_LIMIT, PRESENTATION_DEFINITION_LIMIT, validateInputLength } from '../../common/validators.js'
import { iotaService } from '../../services/affinidi/iota/service.js'

export class UpdatePexQuery extends BaseCommand<typeof UpdatePexQuery> {
  static summary = 'Updates PEX query for your Iota configuration'
  static examples = [
    '<%= config.bin %> <%= command.id %> --configuration-id <value> --query-id <value> -d <value> -f pexQuery.json',
    '<%= config.bin %> <%= command.id %> --configuration-id <value> --query-id <value> --description <value> --file pexQuery.json',
  ]

  static flags = {
    'configuration-id': Flags.string({
      summary: 'ID of the Iota configuration',
    }),
    'query-id': Flags.string({
      summary: 'PEX query ID',
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
    const { flags } = await this.parse(UpdatePexQuery)
    const promptFlags = await promptRequiredParameters(['configuration-id', 'query-id'], flags)

    if (flags['no-input']) {
      if (!flags['query-id']) throw new CLIError(giveFlagInputErrorMessage('query-id'))
      if (!flags['configuration-id']) throw new CLIError(giveFlagInputErrorMessage('configuration-id'))
    }

    const flagsSchema = z.object({
      'configuration-id': z.string().max(INPUT_LIMIT).uuid(),
      'query-id': z.string().max(INPUT_LIMIT).uuid(),
      description: z.string().max(INPUT_LIMIT).optional(),
      file: z.string().optional(),
    })

    const validatedFlags = flagsSchema.parse(promptFlags)

    let data: UpdatePexQueryInput = {}

    if (validatedFlags.file) {
      const rawData = await readFile(validatedFlags.file, 'utf8')

      try {
        data = JSON.parse(rawData)
      } catch (error) {
        throw new CLIError(`Provided file is not a valid JSON\n${(error as Error).message}`)
      }

      const vpDefinition = JSON.stringify(data)
      validateInputLength(vpDefinition, PRESENTATION_DEFINITION_LIMIT)

      data.vpDefinition = vpDefinition
    }

    if (validatedFlags.description) {
      data.description = validatedFlags.description
    }

    const inputSchema = z.object({
      description: z.string().optional(),
      vpDefinition: z.string().optional(),
    })

    const input = inputSchema.parse(data)

    ux.action.start('Updating PEX query')
    const output = await iotaService.updatePexQueryById(
      validatedFlags['configuration-id'],
      validatedFlags['query-id'],
      input,
    )
    ux.action.stop('Updated successfully!')

    if (!this.jsonEnabled()) this.logJson(output)
    return output
  }
}
