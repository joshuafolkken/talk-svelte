import { expect, test } from '@playwright/test'
import { back_to_the_future } from '$lib/data/phrases/back-to-the-future'

const STATUS_CODE_OK = 200

test('audio file exists for displayed phrase', async ({ page }) => {
	await page.goto('/0')
	await page.getByTestId('toggle-script').click()

	const displayed_transcript = await page.getByTestId('script-content').textContent()
	const phrases = back_to_the_future.get_phrases(0)
	const matching_phrase = phrases.find((pr) => pr.script === displayed_transcript)

	if (matching_phrase === undefined) {
		throw new Error(`Matching phrase not found for: ${displayed_transcript ?? ''}`)
	}

	const response = await page.request.get(`audio/${matching_phrase.key}.mp3`)
	expect(response.status()).toBe(STATUS_CODE_OK)
	expect(response.headers()['content-type']).toContain('audio')
})
