import './css/style.css'

import {
  formatLocalizedDate,
  getLocale,
  getSettingWithDefault,
  getTimeZone,
  isLightColor,
  setupErrorHandling,
  setupTheme,
  signalReady,
} from '@screenly/edge-apps'
// Side-effect import: registers <auto-scaler> as a custom element
import '@screenly/edge-apps/components'
import { getTimerMode } from './mode'
import { createProgressRingSVG, updateProgressRing } from './progress-ring'
import { createTimerState } from './timer'

const DATE_UPDATE_INTERVAL_MS = 60 * 1000
const TIMER_UPDATE_INTERVAL_MS = 1000
const RING_VIEWBOX_SIZE = 400

document.addEventListener('DOMContentLoaded', async () => {
  setupErrorHandling()

  const { primary } = setupTheme()
  document.body.classList.toggle('is-light-brand', isLightColor(primary))

  const mode = getTimerMode()
  document.body.classList.add(`mode-${mode}`)

  const dateEl = document.querySelector('[data-date]')
  const prefixEl = document.querySelector('[data-time-prefix]')
  const secondsEl = document.querySelector('[data-time-seconds]')
  const totalEl = document.querySelector('[data-timer-total]')
  const ringContainer = document.querySelector('[data-progress-ring]')

  const duration = getSettingWithDefault<number>('duration', 60)
  const totalDuration = Math.max(1, Math.floor(duration))

  const timezone = await getTimeZone()
  const locale = await getLocale()

  function updateDate() {
    if (!dateEl) return

    dateEl.textContent = formatLocalizedDate(new Date(), locale, {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      timeZone: timezone,
    })
  }

  // Digits mode never shows the ring, so skip building it
  const ringSvg =
    mode === 'ring' ? createProgressRingSVG(RING_VIEWBOX_SIZE) : null
  if (ringSvg) {
    ringContainer?.appendChild(ringSvg)
  }

  function updateDisplay(state: ReturnType<typeof createTimerState>) {
    if (prefixEl) {
      prefixEl.textContent = `${state.hours}:${state.minutes}:`
    }
    if (secondsEl) {
      secondsEl.textContent = state.seconds
    }
    if (totalEl) {
      totalEl.textContent = state.totalLabel
    }
    if (ringSvg) {
      updateProgressRing(ringSvg, state.progress)
    }
  }

  let elapsedSeconds = 0

  updateDate()
  updateDisplay(createTimerState(totalDuration, elapsedSeconds))

  // Keep the date display fresh in case the app runs across midnight
  setInterval(updateDate, DATE_UPDATE_INTERVAL_MS)

  const intervalId = setInterval(() => {
    elapsedSeconds++
    const state = createTimerState(totalDuration, elapsedSeconds)
    updateDisplay(state)

    if (state.finished) {
      clearInterval(intervalId)
    }
  }, TIMER_UPDATE_INTERVAL_MS)

  signalReady()
})
