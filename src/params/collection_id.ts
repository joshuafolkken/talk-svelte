import type { ParamMatcher } from '@sveltejs/kit'
import { back_to_the_future } from '$lib/data/phrases/back-to-the-future'

export const match = ((parameter: string): boolean => {
	const id = Number(parameter)

	if (Number.isNaN(id)) return false
	if (id < 0 || id >= back_to_the_future.key_collections.length) return false

	return true
}) satisfies ParamMatcher
