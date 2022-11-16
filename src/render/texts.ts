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
    Terms and Conditions: ${chalk.blue('https://build.affinidi.com/dev-tools/terms-of-use.pdf')}
    Privacy Policy: ${chalk.blue('https://build.affinidi.com/dev-tools/privacy-policy.pdf')}
    [y/n]
`

export const listCommandDescription = buildCommandDescription('list', ['schemas', 'projects'])

export const showCommandDescription = buildCommandDescription('show', ['schema', 'project'])

export const useCommandDescription = chalk`
  Use the ${chalk.bgCyanBright('use')} command if you want to select a project you want to work on.
  See the command examples in the help:

  ${chalk.bgWhite(`$ affinidi use --help`)}
`
export const buildGeneratedAppNextStepsMessageBlocks = (
  name: string,
  appPath: string,
): { text: string; styled: string }[] => {
  return [
    {
      text: `Successfully generated ${name} at ${appPath}`,
      styled: `${chalk.green('Successfully')} generated ${chalk.italic(name)} at ${appPath}`,
    },
    {
      text: 'cd inside of this directory and install the dependencies fist by installing the dependencies',
      styled:
        'cd inside of this directory and install the dependencies fist by installing the dependencies',
    },
    {
      text: '$ npm install',
      styled: `  ${chalk.bgWhite('$ npm install')}`,
    },
    {
      text: 'then start the application with the command:',
      styled: 'then start the application with the command:',
    },
    {
      text: '$ npm run start',
      styled: `  ${chalk.bgWhite('$ npm run start')}`,
    },
    {
      text: 'Enjoy the App!',
      styled: 'Enjoy the App!',
    },
  ]
}

export const buildGeneratedAppNextStepsMessage = (name: string, appPath: string): string => {
  return buildGeneratedAppNextStepsMessageBlocks(name, appPath)
    .map((b) => b.styled)
    .join('\n\n')
}
