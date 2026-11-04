/**
 * Single source of truth for every limit applied when no license is active.
 * Shared by the renderer (UI gates), the fork process and the main process.
 *
 * Count limits: creating a new item is locked once the current count reaches the limit.
 * Use `Infinity` for no limit.
 */
export const LicenseLimits: Record<
  | 'host'
  | 'languageProject'
  | 'customModule'
  | 'customModuleItem'
  | 'codeLibrary'
  | 'cron'
  | 'startupGroup'
  | 'cloudflareTunnel'
  | 'cloudflareTunnelDns',
  number
> = {
  host: Infinity,
  languageProject: Infinity,
  customModule: Infinity,
  customModuleItem: Infinity,
  codeLibrary: Infinity,
  cron: Infinity,
  startupGroup: Infinity,
  cloudflareTunnel: Infinity,
  cloudflareTunnelDns: Infinity
}

export type LicenseLimitKey = keyof typeof LicenseLimits

/**
 * Master switch: when true every license check is skipped — count limits, trials,
 * the startup reminder, the site lock and the plugin install/migration check.
 */
export const LICENSE_CHECK_DISABLED: boolean = true

const DAY_SECONDS = 24 * 60 * 60

/**
 * Trial length (seconds) for AI chat, screen capturer and batch image compress.
 * Use `Infinity` for no trial limit.
 */
export const LICENSE_TRIAL_SECONDS: number = Infinity

/** True when the trial never expires, so no trial needs to be started. */
export const LICENSE_TRIAL_UNLIMITED =
  LICENSE_CHECK_DISABLED || LICENSE_TRIAL_SECONDS === Infinity

/** Delay (seconds) after first launch before the daily license reminder is shown. */
export const LICENSE_REMINDER_SECONDS = 7 * DAY_SECONDS

export function isLicenseLimitReached(key: LicenseLimitKey, count: number) {
  if (LICENSE_CHECK_DISABLED) {
    return false
  }
  return count >= LicenseLimits[key]
}

/**
 * `trialStartTime` and `now` are unix timestamps in seconds.
 * A trial that was never started (0) counts as expired unless the trial is unlimited.
 */
export function isLicenseTrialExpired(trialStartTime: number, now: number) {
  if (LICENSE_TRIAL_UNLIMITED) {
    return false
  }
  return !trialStartTime || trialStartTime + LICENSE_TRIAL_SECONDS < now
}
