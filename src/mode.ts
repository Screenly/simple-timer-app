import { getSettingWithDefault } from '@screenly/edge-apps'

export const MODES = ['ring', 'digits'] as const

export type TimerMode = (typeof MODES)[number]

export const DEFAULT_MODE: TimerMode = 'ring'

// Settings are free text at the API level, so an instance can hold a value
// this build has never heard of
export function resolveMode(value: string | undefined): TimerMode {
  const normalized = value?.trim().toLowerCase() as TimerMode
  return MODES.includes(normalized) ? normalized : DEFAULT_MODE
}

export function getTimerMode(): TimerMode {
  return resolveMode(getSettingWithDefault<string>('mode', DEFAULT_MODE))
}
