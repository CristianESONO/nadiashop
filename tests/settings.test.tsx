import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import React from 'react'
import { SettingsProvider, useSettings } from '../src/context/SettingsContext'

function Probe({ onDone }: { onDone: (vals: any) => void }) {
  const { convertAmount, formatPrice } = useSettings()

  // example: 10000 XAF -> EUR using the example rate 0.0015 => 15 EUR
  const converted = convertAmount(10000, 'XAF', 'EUR')
  const formatted = formatPrice(10000)

  // pass results back to test
  onDone({ converted, formatted })
  return null
}

describe('SettingsContext', () => {
  it('converts and formats correctly', async () => {
    const result = await new Promise<any>((resolve, reject) => {
      const handleDone = (vals: any) => {
        try {
          resolve(vals)
        } catch (err) {
          reject(err)
        }
      }

      render(
        <SettingsProvider>
          <Probe onDone={handleDone} />
        </SettingsProvider>
      )
    })

    expect(result.converted).toBeCloseTo(15, 2)
    expect(typeof result.formatted).toBe('string')
  })
})
