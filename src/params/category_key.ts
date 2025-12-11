import type { ParamMatcher } from '@sveltejs/kit'
import { CATEGORIES } from '$lib/data/categories'

export const match = ((parameter: string): boolean => {
	return CATEGORIES.has(parameter)
}) satisfies ParamMatcher
