import chalk from 'chalk'

export const conditionsAndPolicyMessage = `
    Please confirm that you agree with:
    Terms and Conditions: ${chalk.blue(
      'https://build.affinidi.com/console-landing-terms-of-use.pdf',
    )}
    Cookie Policy: ${chalk.blue('https://build.affinidi.com/console-landing-cookie-policy.pdf')}
    Privacy Policy: ${chalk.blue('https://build.affinidi.com/console-landing-privacy-policy.pdf')}
    [y/n]
`
