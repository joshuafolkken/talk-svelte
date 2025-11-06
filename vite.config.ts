import fs from 'node:fs'
import { paraglideVitePlugin } from '@inlang/paraglide-js'
import { sveltekit } from '@sveltejs/kit/vite'
import tailwindcss from '@tailwindcss/vite'
import devtoolsJson from 'vite-plugin-devtools-json'
import { defineConfig } from 'vitest/config'

const package_json = JSON.parse(fs.readFileSync('package.json', 'utf8'))

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit(),
		devtoolsJson(),
		paraglideVitePlugin({
			project: './project.inlang',
			outdir: './src/lib/paraglide',
		}),
	],
	define: {
		'import.meta.env.APP_VERSION': JSON.stringify(package_json.version),
	},
	build: {
		cssCodeSplit: false, // CSSを1つのファイルに結合してクリティカルリクエストチェーンを短縮
		cssMinify: true, // CSSの最小化を有効化
		rollupOptions: {
			output: {
				manualChunks: undefined, // 手動チャンク分割を無効化（CSSの分割も減らす）
			},
		},
	},
	css: {
		devSourcemap: false, // 開発時のソースマップを無効化してパフォーマンス向上
	},
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
