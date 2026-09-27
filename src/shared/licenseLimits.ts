/**
 * Single source of truth for every limit applied when no license is active.
 * Shared by the renderer (UI gates), the fork process and the main process.
 *
 * Count limits: creating a new item is locked once the current count reaches the limit.
 */
export const LicenseLimits = {
  host: 3,
  languageProject: 3,
  customModule: 3,
  customModuleItem: 3,
  codeLibrary: 3,
  cron: 1,
  startupGroup: 1,
  cloudflareTunnel: 1,
  cloudflareTunnelDns: 1
} as const

export type LicenseLimitKey = keyof typeof LicenseLimits

const DAY_SECONDS = 24 * 60 * 60

/** Trial length (seconds) for AI chat, screen capturer and batch image compress. */
export const LICENSE_TRIAL_SECONDS = 3 * DAY_SECONDS

/** Delay (seconds) after first launch before the daily license reminder is shown. */
export const LICENSE_REMINDER_SECONDS = 7 * DAY_SECONDS

export function isLicenseLimitReached(key: LicenseLimitKey, count: number) {
  return count >= LicenseLimits[key]
}

/** `trialStartTime` and `now` are unix timestamps in seconds. */
export function isLicenseTrialExpired(trialStartTime: number, now: number) {
  return trialStartTime + LICENSE_TRIAL_SECONDS < now
}
