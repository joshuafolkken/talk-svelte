import { readFileSync } from 'node:fs'
import { paraglideVitePlugin } from '@inlang/paraglide-js'
import { sveltekit } from '@sveltejs/kit/vite'
import tailwindcss from '@tailwindcss/vite'
// import { playwright } from '@vitest/browser-playwright'
import { defineConfig } from 'vitest/config'

const package_json = JSON.parse(readFileSync('./package.json', 'utf-8'))

export default defineConfig({
	define: {
		'import.meta.env.APP_VERSION': JSON.stringify(package_json.version),
	},
	plugins: [
		tailwindcss(),
		sveltekit(),
		paraglideVitePlugin({
			project: './project.inlang',
			outdir: './src/lib/paraglide',
		}),
	],
	server: {
		allowedHosts: [
			'outspoken-angelique-sepulchrally.ngrok-free.dev',
			'.ngrok-free.dev', // すべてのngrok-free.devサブドメインを許可
		],
	},
	test: {
		expect: { requireAssertions: true },
		projects: [
			// {
			// 	extends: './vite.config.ts',
			// 	test: {
			// 		name: 'client',
			// 		environment: 'browser',
			// 		browser: {
			// 			enabled: true,
			// 			provider: 'playwright',
			// 			instances: [{ browser: 'chromium' }]
			// 		},
			// 		include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
			// 		exclude: ['src/lib/server/**'],
			// 		setupFiles: ['./vitest-setup-client.ts']
			// 	}
			// },
			{
				extends: './vite.config.ts',
				test: {
					name: 'server',
					environment: 'node',
					include: ['src/**/*.{test,spec}.{js,ts}'],
					exclude: ['src/**/*.svelte.{test,spec}.{js,ts}'],
				},
			},
		],
	},
})
