import { error } from '@sveltejs/kit'
import { HTTP_STATUS } from '$lib/constants/http'
import type { PhrasesModule } from '$lib/data/phrases/phrases'

async function load(category_key: string): Promise<PhrasesModule> {
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

export const phrase_module_loader = {
	load,
}
