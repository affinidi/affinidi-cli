import chalk from 'chalk'

const isPortableReputationReferenceApp = (useCase: string) => ['career', 'gaming'].includes(useCase)

const buildCommandDescription = (command: string, subCommands: string[]): string => {
  return chalk`
  Use the ${chalk.bgCyanBright.black(command)} command if you want to display some of your resources
  like the ${subCommands.join(' or ')} that you've created.
  The current available resources are:
  ${subCommands.map((sc: string) => `\t- ${chalk.cyanBright(sc)}`).join('\n')}
  See the command examples in the help:

  ${chalk.bgWhite.black(`$ affinidi ${command} --help`)}
  `
}

export const buildInvalidCommandUsage = (
  command: string,
  usage: string,
  summary: string,
  hint?: string[],
): string => {
  return chalk.white`  "${command}" requires at least 1 argument${
    hint ? ` (${hint.join(',')})` : ''
  }.
  See "${command} --help"

  Usage: ${chalk.bold(`$ affinidi ${usage}`)}

  ${summary}
  `
}

export const conditionsAndPolicyMessage = `
    Please confirm that you agree with:
    Terms and Conditions: ${chalk.blue('https://build.affinidi.com/dev-tools/terms-of-use.pdf')}
    Privacy Policy: ${chalk.blue('https://build.affinidi.com/dev-tools/privacy-policy.pdf')}
    [y/N]
`

export const listCommandDescription = buildCommandDescription('list', ['schemas', 'projects'])
export const configCommandDescription = buildCommandDescription('config', ['view'])
export const showCommandDescription = buildCommandDescription('show', ['schema', 'project'])

export const useCommandDescription = chalk`
  Use the ${chalk.bgCyanBright.black(
    'use',
  )} command if you want to select a project you want to work on.
  See the command examples in the help:

  ${chalk.bgWhite(`$ affinidi use --help`)}
`
export const portableReputationNextSteps: { text: string; styled: string }[] = [
  {
    text: 'Read the README file of the generated application to know the next steps.',
    styled: `${chalk.yellowBright(
      'Read the README file of the generated application to know the next steps.',
    )}`,
  },
  {
    text: 'Add github credentials to .env file',
    styled: `${chalk.red('Add github credentials to .env file')}`,
  },
  {
    text: 'open this directory in terminal and install the dependencies',
    styled: 'open this directory in terminal and install the dependencies',
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
    text: '$ npm run dev',
    styled: `  ${chalk.bgWhite('$ npm run dev')}`,
  },
]
export const certificationAndVerificationNextSteps = (): { text: string; styled: string }[] => [
  {
    text: 'open this directory in terminal and install the dependencies',
    styled: 'open this directory in terminal and install the dependencies',
  },
  {
    text: '$ npm install',
    styled: `  ${chalk.bgWhite(chalk.black('$ npm install'))}`,
  },
  {
    text: 'then start the application with the command:',
    styled: 'then start the application with the command:',
  },
  {
    text: '$ npm run start',
    styled: `  ${chalk.bgWhite(chalk.black('$ npm run start'))}`,
  },
]
export const buildGeneratedAppNextStepsMessageBlocks = (
  name: string,
  appPath: string,
  useCase: string,
): { text: string; styled: string }[] => {
  const message = isPortableReputationReferenceApp(useCase)
    ? portableReputationNextSteps
    : certificationAndVerificationNextSteps()
  return [
    {
      text: `Successfully generated ${name} at ${appPath}`,
      styled: `${chalk.green('Successfully')} generated ${chalk.italic(name)} at ${appPath}`,
    },
    ...message,
    {
      text: 'Enjoy the App!',
      styled: 'Enjoy the App!',
    },
  ].filter((item) => !!item)
}

export const buildGeneratedAppNextStepsMessage = (
  name: string,
  appPath: string,
  useCase: string,
): string => {
  return buildGeneratedAppNextStepsMessageBlocks(name, appPath, useCase)
    .map((b) => b.styled)
    .join('\n\n')
}

export const wrapError = (message: string, json: boolean): string => {
  const error = 'Error: '
  return chalk.red(`${json ? '' : error}${message}`)
}

export const welcomeWizard = 'Welcome to the Affinidi Wizard'
export const notAuthenticated = 'You are not authenticated yet.'
export const noActiveProject = 'Active project: no active projects'
