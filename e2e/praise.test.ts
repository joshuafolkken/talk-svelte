import { expect, test } from '@playwright/test'
import { praise } from '$lib/data/phrases/praise'

const STATUS_CODE_OK = 200

const phrases = praise.get_phrases(0)
const keys = phrases.map((phrase) => phrase.key)

for (const key of keys) {
	test(`praise audio file: ${key}`, async ({ page }) => {
		const response = await page.request.get(`audio/${key}.mp3`)
		expect(response.status(), `${key}.mp3 should return 200`).toBe(STATUS_CODE_OK)

		const content_type = response.headers()['content-type']
		expect(content_type, `${key}.mp3 should be audio type`).toContain('audio')
	})
}
