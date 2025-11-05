import { expect, test, type Page } from '@playwright/test'

const cases = [
	{ goto_path: '', expected: 'FWG3Dfss3Jc' }, // cspell:disable-line
	{ goto_path: '?v=Z4J2ecm8m5k', expected: 'Z4J2ecm8m5k' },
] satisfies Array<{ goto_path: string; expected: string }>

async function is_animated_visible(page: Page): Promise<boolean> {
	const animated_background = page.getByTestId('animated-background')
	return await animated_background.isVisible()
}

async function get_url(page: Page): Promise<URL> {
	const youtube_background = page.getByTestId('youtube-background')
	await expect(youtube_background).toBeVisible({ timeout: 3000 })

	const source = await youtube_background.getAttribute('src')
	return new URL(source ?? '')
}

for (const { goto_path, expected } of cases) {
	test(`youtube: ${goto_path}`, async ({ page }) => {
		await page.goto(goto_path)

		if (await is_animated_visible(page)) return

		const url = await get_url(page)

		expect(url.hostname).toBe('www.youtube-nocookie.com')
		expect(url.pathname).toContain('/embed/')

		const youtube_id = url.pathname.split('/embed/')[1]?.split('?')[0]
		expect(youtube_id).toBe(expected)
	})
}
