import { CliUx } from '@oclif/core'

import { conditionsAndPolicyMessage } from '../render/texts'

export const AnswerNo = 'n'
export const AnswerYes = 'y'

export const enterEmailPrompt = async (
  text: string = 'Enter your Affinidi email address',
): Promise<string> => {
  return CliUx.ux.prompt(text, { required: true })
}

export const enterOTPPrompt = async (): Promise<string> => {
  return CliUx.ux.prompt('Enter the confirmation code we emailed to you', { type: 'mask' })
}

export const confirmSignOut = async (): Promise<string> => {
  return CliUx.ux.prompt('Please confirm that you want to sign-out from Affinidi [Y/n]', {
    default: 'y',
  })
}

export const acceptConditionsAndPolicy = async (): Promise<string> => {
  return CliUx.ux.prompt(conditionsAndPolicyMessage, {
    default: 'n',
  })
}

export const projectNamePrompt = async (
  text: string = 'Please enter a project name',
): Promise<string> => {
  return CliUx.ux.prompt(text, { required: true })
}

export const enterIssuanceEmailPrompt = async (
  text: string = 'Please enter email the verifiable credential is sent to',
): Promise<string> => {
  return CliUx.ux.prompt(text, { required: true })
}

export const enterSchemaName = async (
  text: string = 'Please enter a name for the schema to be created',
): Promise<string> => {
  return CliUx.ux.prompt(text, { required: true })
}

export const analyticsConsent = async (
  text: string = 'Help us make Affinidi better! Do you accept to send anonymous usage data? [y/N]',
): Promise<boolean> => {
  const prompt = await CliUx.ux.prompt(text, { default: 'n' })
  return prompt.toLowerCase() === 'y'
}
