import z from 'zod'
import { readFile } from 'fs/promises'
import { Flags, ux } from '@oclif/core'
import { CLIError } from '@oclif/core/lib/errors'
import { input } from '@inquirer/prompts'
import checkbox from '@inquirer/checkbox'
import { BaseCommand, IdTokenClaimFormats } from '../../common'
import { promptRequiredParameters } from '../../common/prompts'
import { giveFlagInputErrorMessage } from '../../common/error-messages'
import { INPUT_LIMIT, validateInputLength } from '../../common/validators'
import { bffService } from '../../services/affinidi/bff-service'
import { vpAdapterService } from '../../services/affinidi/vp-adapter'
import { TokenEndpointAuthMethod } from '../../services/affinidi/vp-adapter/vp-adapter.api'

export class ImportGroups extends BaseCommand<typeof ImportGroups> {
  static summary = 'Import groups with its users'
  static examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> --path "../my-groups.json"',
  ]

  static flags = {
    path: Flags.string({
      char: 'p',
      summary: 'Path to file with groups that should be imported',
    }),
  }

  public async run(): Promise<any> {
    const { flags } = await this.parse(ImportGroups)

    if (flags['no-input']) {
      if (!flags.path) throw new CLIError(giveFlagInputErrorMessage('path'))
    }

    const path = flags['path'] ??
      validateInputLength(await input({ message: 'Enter path to file with groups to import' }), INPUT_LIMIT)

    const rawData = await readFile(path, 'utf8')
    const rawDataJson = JSON.parse(rawData)

    const groupSchema = z.object({
      groupName: z.string().min(1).max(INPUT_LIMIT),
      users: z.array(z.string().min(1).max(INPUT_LIMIT)),
    })

    const groupsSchema = z.array(groupSchema)
    groupsSchema.parse(rawDataJson.data.groups)

    ux.action.start('Importing groups')
    const importGroupsOutput = await bffService.importGroups(rawDataJson.data)
    ux.action.stop('Imported successfully!')

    if (!this.jsonEnabled()) this.logJson(importGroupsOutput)
    return importGroupsOutput
  }
}
