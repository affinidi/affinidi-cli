export const version = 1
export const anonymous = 'anonymous'
export type ViewFormat = 'plaintext' | 'json'

const exit = 'exit'
export enum WizardMenus {
  AUTH_MENU = 'authmenu',
  MAIN_MENU = 'mainmenu',
}

export const wizardMap = new Map<WizardMenus, string[]>([
  [WizardMenus.AUTH_MENU, ['login', 'sign-up', exit]],
  [
    WizardMenus.MAIN_MENU,
    [
      'manage projects',
      'manage schemas',
      'generate an application',
      'issue a vc',
      'verify a vc',
      'logout',
      exit,
    ],
  ],
])
