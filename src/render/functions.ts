import chalk from 'chalk'
import { ProjectSummary } from '../services/iam/iam.api'

const indent = '  '

const bigName = `
█████╗  ███████╗███████╗██╗███╗   ██╗██╗██████╗ ██╗
██╔══██╗██╔════╝██╔════╝██║████╗  ██║██║██╔══██╗██║
███████║█████╗  █████╗  ██║██╔██╗ ██║██║██║  ██║██║
██╔══██║██╔══╝  ██╔══╝  ██║██║╚██╗██║██║██║  ██║██║
██║  ██║██║     ██║     ██║██║ ╚████║██║██████╔╝██║
╚═╝  ╚═╝╚═╝     ╚═╝     ╚═╝╚═╝  ╚═══╝╚═╝╚═════╝ ╚═╝
`

export type MessageBlock = { text: string; styled: string }

const nextStepMessageBlocks: MessageBlock[] = [
  {
    text: "To start using the Affinidi services, you need to create a project to get an Api-Key.\nThe Api-Key is required to access Affinidi's resources.",
    styled: `${chalk.yellow(
      'To start using the Affinidi services, you need to create a project to get an Api-Key.',
    )}\nThe Api-Key is required to access Affinidi's resources.`,
  },
  {
    text: `To create your new project, use the command below:\n${indent}$ affinidi create project PROJECT-NAME`,
    styled: `To create your new project, use the command below:\n${indent}${chalk.black.bgWhite(
      '$ affinidi create project PROJECT-NAME',
    )}`,
  },
  {
    text: 'Replace PROJECT-NAME with your own project name.',
    styled: `Replace ${chalk.bold('PROJECT-NAME')} with your own project name.`,
  },
]

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
  ...nextStepMessageBlocks,
]

export const wizardStatus = ({
  breadcrumbs,
  userEmail,
  project,
}: {
  breadcrumbs: string[]
  userEmail?: string
  project?: ProjectSummary
}): MessageBlock[] => {
  const messages: MessageBlock[] = [
    {
      text: 'Welcome to the Affinidi Wizard',
      styled: 'Welcome to the Affinidi Wizard',
    },
  ]

  const authBlock: MessageBlock = {
    text: 'You are not authenticated yet.',
    styled: 'You are not authenticated yet.',
  }
  if (userEmail) {
    authBlock.text = `You are authenticated as: ${userEmail}`
    authBlock.styled = `You are authenticated as: ${userEmail}`
  }
  messages.push(authBlock)
  const projectBlock: MessageBlock = {
    text: 'Active project: no active projects',
    styled: 'Active project: no active projects',
  }
  if (project) {
    projectBlock.text = `Active project: ${project.project.projectId}`
    projectBlock.styled = `Active project: ${project.project.projectId}`
  }
  messages.push(projectBlock)

  const breadcrumbsBlock: MessageBlock = {
    text: breadcrumbs.join(' > '),
    styled: breadcrumbs.join(' > '),
  }
  if (breadcrumbs.length > 0) {
    messages.push(breadcrumbsBlock)
  }

  return messages
}

export const mapStyled = (b: MessageBlock): string => b.styled
export const mapRawText = (b: MessageBlock): string => b.text

const getWelcomeUserMessageByType = (mapFn: (b: MessageBlock) => string): string[] =>
  welcomeMessageBlocks.map(mapFn)
export const getWelcomeUserRawMessages = (): string[] => getWelcomeUserMessageByType(mapRawText)

const getNextStepsMessageByType = (mapFn: (b: MessageBlock) => string): string[] =>
  nextStepMessageBlocks.map(mapFn)
export const getSignupNextStepRawMessages = (): string[] => getNextStepsMessageByType(mapRawText)

export const buildWelcomeUserMessageByType = (mapFn: (b: MessageBlock) => string): string => {
  return getWelcomeUserMessageByType(mapFn).join('\n\n')
}

export const WelcomeUserStyledMessage = buildWelcomeUserMessageByType(mapStyled)
export const WelcomeUserRawMessage = buildWelcomeUserMessageByType(mapRawText)
export const NextStepsRawMessage = nextStepMessageBlocks.map((m) => m.styled).join('\n\n')
