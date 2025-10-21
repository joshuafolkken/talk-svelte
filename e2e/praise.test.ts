import { expect, test } from '@playwright/test'
import { praise_audio_files } from '$lib/data/praise-audio'

const STATUS_CODE_OK = 200

test('all praise audio files are accessible', async ({ page }) => {
	await page.goto('/')

	const results = await Promise.all(
		praise_audio_files.map(async (audio_file) => {
			const response = await page.request.get(`audio/praise/${audio_file}.mp3`)
			return { audio_file, response }
		}),
	)

	for (const { audio_file, response } of results) {
		expect(response.status(), `${audio_file}.mp3 should return 200`).toBe(STATUS_CODE_OK)

		const content_type = response.headers()['content-type']
		expect(content_type, `${audio_file}.mp3 should be audio type`).toContain('audio')
	}
})
