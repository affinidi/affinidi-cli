export const version = 1
export const anonymous = 'anonymous'
export type ViewFormat = 'plaintext' | 'json'

const exit = 'exit'
const logout = 'logout'
const backToMainMenu = 'go back to main menu'
export enum WizardMenus {
  AUTH_MENU = 'authmenu',
  MAIN_MENU = 'mainmenu',
  PROJECT_MENU = 'projectmenu',
  SCHEMA_MENU = 'schemamenu',
  GO_BACK_PROJECT_MENU = 'gobackprojectmenu',
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
      logout,
      exit,
    ],
  ],
  [
    WizardMenus.PROJECT_MENU,
    [
      'change active project',
      'create another project',
      'show active project',
      "show project's details",
      backToMainMenu,
      logout,
      exit,
    ],
  ],
  [
    WizardMenus.SCHEMA_MENU,
    ['show schemas', 'show schema details', 'create schema', backToMainMenu, logout, exit],
  ],
  [WizardMenus.GO_BACK_PROJECT_MENU, ['go back to project managment', backToMainMenu]],
])
