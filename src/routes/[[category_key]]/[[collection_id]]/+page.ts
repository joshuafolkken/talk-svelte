import { error } from '@sveltejs/kit'
import { HTTP_STATUS } from '$lib/constants/http'
import type { PhrasesModule } from '$lib/data/phrases/phrases'
import type { PageLoad } from './$types'

async function load_phrases_module(category_key: string): Promise<PhrasesModule> {
	const modules = import.meta.glob<{ default: PhrasesModule }>(
		'/src/lib/data/phrases/collections/*.ts',
	)
	const path = `/src/lib/data/phrases/collections/${category_key}.ts`
	const loader = modules[path]

	if (loader === undefined) {
		error(HTTP_STATUS.NOT_FOUND, `Category '${category_key}' not found`)
	}

	const module = await loader()
	return module.default
}

// eslint-disable-next-line no-restricted-syntax
export const load: PageLoad = async ({ params }) => {
	const { category_key, collection_id } = params

	if (category_key === undefined) return {}

	const phrases_module = await load_phrases_module(category_key)

	if (collection_id !== undefined) {
		const id = Number(collection_id)

		if (id >= phrases_module.key_collections.length) {
			error(
				HTTP_STATUS.NOT_FOUND,
				`Collection '${collection_id}' not found in category '${category_key}'`,
			)
		}
	}

	return {
		phrases_module,
	}
}
