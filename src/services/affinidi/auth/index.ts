import process from 'process'
import { CLIError } from '@oclif/core/lib/errors'
import chalk from 'chalk'
import { AuthProvider, AuthProviderConfig, OryAuthenticator, OryAuthenticatorPKCE } from './providers'
import { Principal, tokenService } from './token'
import { LoggerAdapter } from '../adapters'
import { iamService } from '../iam'
import { ProjectDto } from '../iam/iam.api'

export type AuthResult = {
  projectScopedToken: string
  activeProject: ProjectDto
  projects: ProjectDto[]
  principalId: string
}

export interface AuthSDK {
  login(params: { projectId?: string; userAccessToken?: string }): Promise<AuthResult>
  logout(): Promise<void>
  getPrincipalId(): string
  getActiveProject(projects: Array<ProjectDto>): ProjectDto
}

const DEFAULT_PROJECT_NAME = 'Default Project'

/**
 * A class representing an authentication model that implements the AuthSDK interface.
 * It provides functionalities to authenticate, fetch user projects, and log out.
 */
export class Auth implements AuthSDK {
  private readonly authProvider: AuthProvider

  private readonly logger: LoggerAdapter

  /**
   * Construct an Auth instance.
   *
   * @param {AuthProviderConfig} config - The configuration object for the AuthProvider.
   */
  constructor(config: AuthProviderConfig) {
    this.logger = config.logger

    // Ory project for prod uses PKCE, meanwhile for dev - doesn't
    this.authProvider =
      process.env.AFFINIDI_CLI_ENVIRONMENT === 'dev' ? new OryAuthenticator(config) : new OryAuthenticatorPKCE(config)
  }

  private async authenticate() {
    this.logger.debug('Authenticating')
    const accessToken = await this.authProvider.authenticate()
    this.logger.debug(`Authenticated successfully!`)
    return accessToken
  }

  private async receivePrincipalId(accessToken: string) {
    this.logger.debug('Receiving principalId')
    const principalId = await iamService.whoAmI(accessToken)
    this.logger.debug(`PrincipalId has been received: ${principalId}`)
    return principalId
  }

  private async fetchProjects(accessToken: string) {
    this.logger.debug('Fetching the list of projects')
    const projects = await iamService.listProjects(accessToken)
    this.logger.debug(`Successfully fetched the list of projects`)
    this.logger.debug(`Projects: ${JSON.stringify(projects)}`)
    return projects
  }

  public getActiveProject(projects: Array<ProjectDto>): ProjectDto {
    const savedProjectId = tokenService.getProjectToken()?.projectId
    this.logger.debug(`Saved projectId: ${savedProjectId}`)
    const savedProject = savedProjectId && projects.find((project) => project.id === savedProjectId)
    return savedProject || projects[0]
  }

  private async createProject(accessToken: string) {
    this.logger.debug(`User doesn't have any project. Creating a project with default name: ${DEFAULT_PROJECT_NAME}`)
    const project = await iamService.createProject(accessToken, {
      name: DEFAULT_PROJECT_NAME,
    })
    this.logger.debug(`Default project successfully created: ${JSON.stringify(project)}`)
    return project
  }

  private async createProjectScopedToken(accessToken: string, projectId: string) {
    this.logger.debug(`Creating a project-scoped token for project ${chalk.underline(projectId)}`)
    const projectScopedToken = await iamService.createProjectScopedToken(accessToken, projectId)
    this.logger.debug(`project-scoped token for project ${chalk.underline(projectId)} has been successfully created`)
    return projectScopedToken
  }

  /**
   * Authenticate a user and return an object containing the user's active project,
   * a list of the user's projects, the user's principalId, and a project-scoped token.
   *
   * @returns {Promise<AuthResult>} - A Promise that resolves to an AuthResult object.
   * @throws Will throw an error if the authentication fails.
   */
  public async login(param: {
    projectId?: string
    userAccessToken?: string
    hideProjectHints?: boolean
  }): Promise<AuthResult> {
    const { projectId, userAccessToken } = param
    const accessToken = (userAccessToken ?? (await this.authenticate())) as string
    if (!param.hideProjectHints) {
      this.logger.info('\nSetting your active project...')
    }
    const principalId = await this.receivePrincipalId(accessToken)
    const principalComponents = principalId.split('/')
    const principal: Principal = {
      id: principalComponents[1],
      type: principalComponents[0],
    }

    let projects = await this.fetchProjects(accessToken)

    let activeProject: ProjectDto | undefined

    // check if specific projectId is provided
    if (projectId) {
      activeProject = projects.find((project) => project.id === projectId)
      if (!activeProject) {
        throw new CLIError(
          `Cannot find project with id ${chalk.underline(projectId)}. Available projects are ${JSON.stringify(
            projects,
          )}`,
        )
      }
    }

    // choose project from available list
    // NOTE: Show project hints only if user has more than 1 project.
    if (!activeProject && projects.length > 0) {
      activeProject = this.getActiveProject(projects)
    }

    // no project available, creating one.
    if (!activeProject) {
      activeProject = await this.createProject(accessToken)
      this.logger.info(`\nCreated default project with ID ${chalk.underline(activeProject.id)}`)
      projects = [activeProject]
    }

    const projectScopedToken = await this.createProjectScopedToken(accessToken, activeProject.id)
    tokenService.setProjectToken(projectScopedToken, activeProject.id, activeProject.name)
    tokenService.setPrincipal(principal)

    if (!param.hideProjectHints) {
      this.logger.info(
        `\nYour active project has been set to the project ${chalk.underline(
          activeProject.name,
        )} with ID ${chalk.underline(activeProject.id)}` +
          '\n\nIf you want to change the active project, please follow these steps:' +
          `\n\n💡 To list all your projects run: ${chalk.inverse('affinidi project list-projects')}` +
          `\n\n💡 To change the active project run: ${chalk.inverse(
            'affinidi project select-project -i <project-id>',
          )}\n`,
      )
    }

    return {
      projectScopedToken: projectScopedToken.accessToken,
      activeProject,
      principalId,
      projects,
    }
  }

  /**
   * Logs out the user.
   *
   * @returns {Promise<void>} - A Promise that resolves when the logout operation has completed.
   * @throws Will throw an error if the logout operation fails.
   */
  public async logout(): Promise<void> {
    return this.authProvider.logout()
  }

  /**
   * Returns PrincipalId
   *
   * @returns {string} - A value of PrincipalId
   */
  public getPrincipalId(): string {
    return tokenService.getPrincipal()?.id
  }
}
