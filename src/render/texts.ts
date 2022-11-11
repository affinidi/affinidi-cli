import chalk from 'chalk'

const buildCommandDescription = (command: string, subCommands: string[]): string => {
  return chalk`
  Use the ${chalk.bgCyanBright.black(command)} command if you want to display some of your resources
  like the ${subCommands.join(' or ')} that you've created.
  The current available ressources are:
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
    [y/n]
`

export const listCommandDescription = buildCommandDescription('list', ['schemas', 'projects'])

export const showCommandDescription = buildCommandDescription('show', ['schema', 'project'])

export const useCommandDescription = chalk`
  Use the ${chalk.bgCyanBright.black(
    'use',
  )} command if you want to select a project you want to work on.
  See the command examples in the help:

  ${chalk.bgWhite(`$ affinidi use --help`)}
`
export const buildGeneratedAppNextStepsMessageBlocks = (
  name: string,
  appPath: string,
  withProxy: boolean,
): { text: string; styled: string }[] => {
  return [
    {
      text: `Successfully generated ${name} at ${appPath}`,
      styled: `${chalk.green('Successfully')} generated ${chalk.italic(name)} at ${appPath}`,
    },
    withProxy && {
      text: `Successfully generated ${name}-backend at ${appPath}-backend`,
      styled: `${chalk.green('Successfully')} generated ${chalk.italic(
        `${name}-backend`,
      )} at ${appPath}-backend`,
    },
    withProxy
      ? {
          text: 'open each directory in separate terminals and install the dependencies',
          styled: 'open each directory in separate terminals and install the dependencies',
        }
      : {
          text: 'open this directory in terminal and install the dependencies',
          styled: 'open this directory in terminal and install the dependencies',
        },
    {
      text: '$ npm install',
      styled: `  ${chalk.bgWhite('$ npm install')}`,
    },
    withProxy
      ? {
          text: 'then start both applications with the command:',
          styled: 'then start both applications with the command:',
        }
      : {
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
  ].filter((item) => !!item)
}

export const buildGeneratedAppNextStepsMessage = (
  name: string,
  appPath: string,
  withProxy: boolean,
): string => {
  return buildGeneratedAppNextStepsMessageBlocks(name, appPath, withProxy)
    .map((b) => b.styled)
    .join('\n\n')
}

export const wrapError = (message: string): string => {
  return chalk.red(`Error: ${message}`)
}
