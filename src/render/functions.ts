import chalk from 'chalk'

const indent = '  '

const bigName = `
█████╗  ███████╗███████╗██╗███╗   ██╗██╗██████╗ ██╗
██╔══██╗██╔════╝██╔════╝██║████╗  ██║██║██╔══██╗██║
███████║█████╗  █████╗  ██║██╔██╗ ██║██║██║  ██║██║
██╔══██║██╔══╝  ██╔══╝  ██║██║╚██╗██║██║██║  ██║██║
██║  ██║██║     ██║     ██║██║ ╚████║██║██████╔╝██║
╚═╝  ╚═╝╚═╝     ╚═╝     ╚═╝╚═╝  ╚═══╝╚═╝╚═════╝ ╚═╝
`

type MessageBlock = { text: string; styled: string }

export const welcomeMessageBlocks: MessageBlock[] = [
  { text: 'Welcome to', styled: 'Welcome to' },
  {
    text: bigName,
    styled: `${chalk.blue(bigName)}`,
  },
  {
    text: 'Start using our privacy-preserving tooling today,',
    styled: 'Start using our privacy-preserving tooling today,',
  },
  {
    text: 'and boilerplate your next privacy-preserving app!',
    styled: 'and boilerplate your next privacy-preserving app!',
  },
  {
    text: "To start using the Affinidi services, you need to create a project to get an Api-Key.\nThe Api-Key is required to access Affinidi's resources.",
    styled: `${chalk.yellow(
      'To start using the Affinidi services, you need to create a project to get an Api-Key.',
    )}\nThe Api-Key is required to access Affinidi's resources.`,
  },
  {
    text: `To create your new project, use the command below:\n${indent}$ affinidi create project PROJECT-NAME`,
    styled: `To create your new project, use the command below:\n${indent}${chalk.bgWhite(
      '$ affinidi create project PROJECT-NAME',
    )}`,
  },
  {
    text: 'Replace PROJECT-NAME with your own project name.',
    styled: `Replace ${chalk.bold('PROJECT-NAME')} with your own project name.`,
  },
]

export const mapStyled = (b: MessageBlock): string => b.styled
export const mapRawText = (b: MessageBlock): string => b.text

const getWelcomeUserMessageByType = (mapFn: (b: MessageBlock) => string): string[] =>
  welcomeMessageBlocks.map(mapFn)

export const getWelcomeUserRawMessages = (): string[] => getWelcomeUserMessageByType(mapRawText)

export const buildWelcomeUserMessageByType = (mapFn: (b: MessageBlock) => string): string => {
  return getWelcomeUserMessageByType(mapFn).join('\n\n')
}

export const WelcomeUserStyledMessage = buildWelcomeUserMessageByType(mapStyled)
export const WelcomeUserRawMessage = buildWelcomeUserMessageByType(mapRawText)
