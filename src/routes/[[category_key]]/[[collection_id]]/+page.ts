import { error } from '@sveltejs/kit'
import { HTTP_STATUS } from '$lib/constants/http'
import { phrase_module_loader } from '$lib/utils/phrase-module-loader'
import type { PageLoad } from './$types'

export const load: PageLoad = async ({ params }) => {
	const { category_key, collection_id } = params

	if (category_key === undefined) return {}

	const phrases_module = await phrase_module_loader.load(category_key)

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
