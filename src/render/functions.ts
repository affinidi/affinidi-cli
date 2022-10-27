import chalk from 'chalk'

export const welcomeMessageBlocks: string[] = [
  'Welcome to',
  'Start using our privacy-preserving tooling today,',
  'and boilerplate your next privacy-preserving app!',
]

export const buildWelcomeUserMessage = (): string => {
  return chalk`
    ${welcomeMessageBlocks[0]}
    {blue 
    █████╗  ███████╗███████╗██╗███╗   ██╗██╗██████╗ ██╗
    ██╔══██╗██╔════╝██╔════╝██║████╗  ██║██║██╔══██╗██║
    ███████║█████╗  █████╗  ██║██╔██╗ ██║██║██║  ██║██║
    ██╔══██║██╔══╝  ██╔══╝  ██║██║╚██╗██║██║██║  ██║██║
    ██║  ██║██║     ██║     ██║██║ ╚████║██║██████╔╝██║
    ╚═╝  ╚═╝╚═╝     ╚═╝     ╚═╝╚═╝  ╚═══╝╚═╝╚═════╝ ╚═╝
    }

    ${welcomeMessageBlocks[1]}
    ${welcomeMessageBlocks[2]}
    `
}
