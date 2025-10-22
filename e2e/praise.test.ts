import { expect, test } from '@playwright/test'
import { praise_audio_files } from '$lib/data/praise-audio'

const STATUS_CODE_OK = 200

for (const audio_file of praise_audio_files) {
	test(`praise audio file: ${audio_file}`, async ({ page }) => {
		const response = await page.request.get(`audio/${audio_file}.mp3`)
		expect(response.status(), `${audio_file}.mp3 should return 200`).toBe(STATUS_CODE_OK)

		const content_type = response.headers()['content-type']
		expect(content_type, `${audio_file}.mp3 should be audio type`).toContain('audio')
	})
}
