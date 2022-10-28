import chalk from 'chalk'

const buildCommandDescription = (command: string, subCommands: string[]): string => {
  return chalk`
  Use the ${chalk.bgCyanBright(command)} command if you want to display some of your resources
  like the ${subCommands.join(' or ')} that you've created.
  The current available ressources are:
  ${subCommands.map((sc: string) => `\t- ${chalk.cyanBright(sc)}`).join('\n')}
  See the command examples in the help:

  ${chalk.bgWhite(`$ affinidi ${command} --help`)}
  `
}

export const conditionsAndPolicyMessage = `
    Please confirm that you agree with:
    Terms and Conditions: ${chalk.blue(
      'https://build.affinidi.com/console-landing-terms-of-use.pdf',
    )}
    Cookie Policy: ${chalk.blue('https://build.affinidi.com/console-landing-cookie-policy.pdf')}
    Privacy Policy: ${chalk.blue('https://build.affinidi.com/console-landing-privacy-policy.pdf')}
    [y/n]
`

export const listCommandDescription = buildCommandDescription('list', ['schemas', 'projects'])

export const showCommandDescription = buildCommandDescription('show', ['schema', 'project'])

export const useCommandDescription = chalk`
  Use the ${chalk.bgCyanBright('use')} command if you want to select a project you want to work on.
  See the command examples in the help:

  ${chalk.bgWhite(`$ affinidi use --help`)}
`
