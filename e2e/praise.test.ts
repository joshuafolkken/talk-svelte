import { expect, test } from '@playwright/test'
import { get_praise_phrases } from '$lib/data/phrases/praise'

const STATUS_CODE_OK = 200

const praise_phrases = get_praise_phrases(0)
const keys = praise_phrases.map((phrase) => phrase.key)

for (const key of keys) {
	test(`praise audio file: ${key}`, async ({ page }) => {
		const response = await page.request.get(`audio/${key}.mp3`)
		expect(response.status(), `${key}.mp3 should return 200`).toBe(STATUS_CODE_OK)

		const content_type = response.headers()['content-type']
		expect(content_type, `${key}.mp3 should be audio type`).toContain('audio')
	})
}
