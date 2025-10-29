import { defineConfig } from '@playwright/test'

export default defineConfig({
	webServer: {
		// command: 'npm run build && npm run preview',
		command: 'npm run build:static && npm run preview',
		// command: 'npm run dev',
		port: 4173,
	},
	testDir: 'e2e',
	timeout: 5_000,
	use: {
		baseURL: `http://localhost:4173/talk-svelte/`,
	},
	fullyParallel: true,
	// workers: process.env.CI ? 2 : 4,
})
