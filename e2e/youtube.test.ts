import { expect, test } from '@playwright/test'

const data = [
	{ goto_path: '', expected: 'dQw4w9WgXcQ' },
	{ goto_path: '?v=Z4J2ecm8m5k', expected: 'Z4J2ecm8m5k' },
] satisfies Array<{ goto_path: string; expected: string }>

for (const { goto_path, expected } of data) {
	test(`youtube: ${goto_path}`, async ({ page }) => {
		await page.goto(goto_path)

		const youtube_background = page.getByTestId('youtube-background')
		await expect(youtube_background).toBeVisible()

		const source = await youtube_background.getAttribute('src')
		expect(source).toBeTruthy()

		const url = new URL(source ?? '')
		expect(url.hostname).toBe('www.youtube.com')
		expect(url.pathname).toContain('/embed/')

		const youtube_id = url.pathname.split('/embed/')[1]?.split('?')[0]
		expect(youtube_id).toBe(expected)
	})
}
