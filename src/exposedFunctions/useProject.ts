import { ProjectSummary } from '../services/iam/iam.api'
import { iAmService } from '../services'
import { vaultService } from '../services/vault/typedVaultService'

export const useProject = async ({
  token,
  projectId,
}: {
  token: string
  projectId: string
}): Promise<ProjectSummary> => {
  const projectToBeActive = await iAmService.getProjectSummary(token, projectId)
  vaultService.setActiveProject(projectToBeActive)
  return projectToBeActive
}
