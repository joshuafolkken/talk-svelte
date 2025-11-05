import adapter from '@sveltejs/adapter-node'
import adapter_static from '@sveltejs/adapter-static'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import { mdsvex } from 'mdsvex'

const runes = !process.env.STORYBOOK
const is_static = process.env.ADAPTER === 'static'
const is_production = process.env.NODE_ENV === 'production'
const is_github_pages = process.env.GITHUB_PAGES === 'true'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: [vitePreprocess(), mdsvex()],
	kit: {
		adapter: is_static
			? adapter_static({
					strict: false,
				})
			: adapter(),
		paths: {
			base: is_github_pages ? '/talk-svelte' : '',
		},
	},
	extensions: ['.svelte', '.svx'],
	compilerOptions: {
		runes: runes,
	},
}

export default config
