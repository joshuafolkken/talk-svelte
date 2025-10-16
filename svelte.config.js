import adapter from '@sveltejs/adapter-node'
import adapter_static from '@sveltejs/adapter-static'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import { mdsvex } from 'mdsvex'

const runes = process.env.STORYBOOK ? false : true
const is_static = process.env.ADAPTER === 'static'

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
	},
	extensions: ['.svelte', '.svx'],
	compilerOptions: {
		runes: runes,
	},
}

export default config
