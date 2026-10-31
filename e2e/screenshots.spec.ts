import { test } from '@playwright/test'
import {
  createMockScreenlyForScreenshots,
  getScreenshotsDir,
  RESOLUTIONS,
  setupClockMock,
  setupScreenlyJsMock,
} from '@screenly/edge-apps/test/screenshots'
import path from 'path'

const VARIANTS = [
  { prefix: '', mode: 'ring' },
  { prefix: 'digits-', mode: 'digits' },
]

for (const { prefix, mode } of VARIANTS) {
  const { screenlyJsContent } = createMockScreenlyForScreenshots(
    {},
    {
      display_errors: 'false',
      duration: '60',
      mode,
      override_locale: 'en',
      override_timezone: 'America/New_York',
    },
  )

  for (const { width, height } of RESOLUTIONS) {
    test(`screenshot ${prefix}${width}x${height}`, async ({ browser }) => {
      const screenshotsDir = getScreenshotsDir()

      const context = await browser.newContext({ viewport: { width, height } })
      const page = await context.newPage()

      // Setup mocks
      await setupClockMock(page)
      await setupScreenlyJsMock(page, screenlyJsContent)

      await page.goto('/')
      await page.waitForLoadState('networkidle')

      await page.screenshot({
        path: path.join(screenshotsDir, `${prefix}${width}x${height}.png`),
        fullPage: false,
      })

      await context.close()
    })
  }
}
