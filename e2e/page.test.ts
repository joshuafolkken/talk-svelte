import { expect, test } from '@playwright/test'
import { get_bttf_phrases } from '$lib/data/phrases/back-to-the-future'

test('audio src matches displayed phrase', async ({ page }) => {
	await page.goto('/')
	await page.getByTestId('toggle-script').click()

	const displayed_transcript = await page.getByTestId('script-content').textContent()
	const bttf_phrases = get_bttf_phrases(0)
	const matching_phrase = bttf_phrases.find((pr) => pr.script === displayed_transcript)

	if (matching_phrase === undefined) {
		throw new Error(`Matching phrase not found for: ${displayed_transcript ?? ''}`)
	}

	const source = await page.getByTestId('phrase-audio').getAttribute('src')
	expect(source).toContain(`/audio/${matching_phrase.key}.mp3`)
})
