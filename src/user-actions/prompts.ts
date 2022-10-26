import { CliUx } from '@oclif/core'

export const AnswerNo = 'n'
export const AnswerYes = 'y'

type YesOrNo = 'n' | 'y'

export const enterEmailPrompt = async (
  text: string = 'Enter your Affinidi email address',
): Promise<string> => {
  return CliUx.ux.prompt(text, { required: true })
}

export const enterOTPPrompt = async (): Promise<string> => {
  return CliUx.ux.prompt('Enter the confirmation code we emailed to you', { type: 'mask' })
}

export const confirmSignOut = async (): Promise<YesOrNo> => {
  return CliUx.ux.prompt('Please confirm that you want to sign-out from Affinidi [Y/n]', {
    default: 'y',
  })
}

export const acceptConditionsAndPolicy = async (): Promise<YesOrNo> => {
  return CliUx.ux.prompt(
    `
    Please confirm that you agree with:
    Terms and Conditions: https://build.affinidi.com/console-landing-terms-of-use.pdf
    Cookie Policy: https://build.affinidi.com/console-landing-cookie-policy.pdf
    Privacy Policy: https://build.affinidi.com/console-landing-privacy-policy.pdf
    [y/n]`,
    {
      default: 'n',
    },
  )
}
