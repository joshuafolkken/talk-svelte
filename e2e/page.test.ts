import { expect, test } from '@playwright/test'
import { questions } from '$lib/data/questions'

test('audio src matches displayed question', async ({ page }) => {
	await page.goto('/')
	await page.getByTestId('toggle-script').click()

	const displayed_transcript = await page.getByTestId('script-content').textContent()
	const matching_question = questions.find((qu) => qu.transcript === displayed_transcript)

	if (matching_question === undefined) {
		throw new Error(`Matching question not found for: ${displayed_transcript ?? ''}`)
	}

	const source = await page.getByTestId('question-audio').getAttribute('src')
	expect(source).toContain(`/audio/${matching_question.audio_uri}.mp3`)
})
