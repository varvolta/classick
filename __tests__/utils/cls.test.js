import { cls } from '../../src/index.ts'
import { describe, it, expect, vi } from 'vitest'

describe('cls', () => {
	it('returns correct values', () => {
		expect(
			cls('a', {
				b: true
			})
		).toBe('a b')
	})
	it('returns correct values', async () => {
		await vi.waitFor(() => {
			expect(
				cls('a', {
					b: true
				})
			).toBe('a b')
		})
	})
})
