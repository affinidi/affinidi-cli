type StatsProjectScheduledBundleChange = {
  bundleId: string
  bundleName: string
  bundleDescription: string
  startDate: string
  endDate: string
  changeType: string
}

export type StatsProjectResourceLimit = {
  resourceId: string
  initialValue: number
  value: number
  creditCost: number
}

type StatsProject = {
  id: string
  bundle: {
    bundleId: string
    bundleName: string
    bundleDescription: string
  }
  createdAt: string
  credits: number
  initialCredits: number
  scheduledBundleChanges: StatsProjectScheduledBundleChange[]
  limits: StatsProjectResourceLimit[]
}

export type StatsResponseOutput = {
  cachedAt: string
  updatedAt: string
  expiresAt: string
  health: {
    status: number
    message: string
  }
  projects: StatsProject[]
}
