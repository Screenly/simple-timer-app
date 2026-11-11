import '@screenly/edge-apps/test'
import { describe, test, expect, beforeEach } from 'bun:test'
import { createProgressRingSVG, updateProgressRing } from './progress-ring'

function elapsedCount(svg: SVGSVGElement): number {
  return svg.querySelectorAll('line.is-elapsed').length
}

describe('createProgressRingSVG', () => {
  test('creates an SVG sized by its viewBox', () => {
    const svg = createProgressRingSVG(400)

    expect(svg).toBeInstanceOf(SVGSVGElement)
    expect(svg.getAttribute('viewBox')).toBe('0 0 400 400')
  })

  test('creates exactly 60 tick lines', () => {
    const svg = createProgressRingSVG(400)
    const ticks = svg.querySelectorAll('line[data-tick]')

    expect(ticks.length).toBe(60)
  })

  test('each tick has its index and geometry', () => {
    const svg = createProgressRingSVG(400)
    const ticks = svg.querySelectorAll('line[data-tick]')

    ticks.forEach((tick, i) => {
      expect(tick.getAttribute('data-tick')).toBe(String(i))
      expect(tick.getAttribute('x1')).not.toBeNull()
      expect(tick.getAttribute('y1')).not.toBeNull()
      expect(tick.getAttribute('x2')).not.toBeNull()
      expect(tick.getAttribute('y2')).not.toBeNull()
    })
  })

  test('creates SVG with different diameter', () => {
    const svg = createProgressRingSVG(500)

    expect(svg.getAttribute('viewBox')).toBe('0 0 500 500')
  })
})

describe('updateProgressRing', () => {
  let svg: SVGSVGElement

  beforeEach(() => {
    svg = createProgressRingSVG(400)
  })

  test('no progress (0%) leaves every tick unelapsed', () => {
    updateProgressRing(svg, 0)

    expect(elapsedCount(svg)).toBe(0)
  })

  test('half progress (50%) marks the first 30 ticks', () => {
    updateProgressRing(svg, 0.5)
    const ticks = svg.querySelectorAll('line[data-tick]')

    for (let i = 0; i < 30; i++) {
      expect(ticks[i].classList.contains('is-elapsed')).toBe(true)
    }
    for (let i = 30; i < 60; i++) {
      expect(ticks[i].classList.contains('is-elapsed')).toBe(false)
    }
  })

  test('partial progress (25%) marks the first 15 ticks', () => {
    updateProgressRing(svg, 0.25)

    expect(elapsedCount(svg)).toBe(15)
    expect(
      svg.querySelectorAll('line')[14].classList.contains('is-elapsed'),
    ).toBe(true)
  })

  test('full progress (100%) marks every tick', () => {
    updateProgressRing(svg, 1)

    expect(elapsedCount(svg)).toBe(60)
  })

  test('progress beyond 100% marks every tick', () => {
    updateProgressRing(svg, 1.5)

    expect(elapsedCount(svg)).toBe(60)
  })

  test('a lower progress clears previously elapsed ticks', () => {
    updateProgressRing(svg, 1)
    updateProgressRing(svg, 0.25)

    expect(elapsedCount(svg)).toBe(15)
  })
})
