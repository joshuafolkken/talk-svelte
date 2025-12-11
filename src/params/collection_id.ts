import type { ParamMatcher } from '@sveltejs/kit'

export const match = ((parameter: string): boolean => {
	const id = Number(parameter)

	if (Number.isNaN(id)) return false
	if (!Number.isInteger(id)) return false
	if (id < 0) return false

	return true
}) satisfies ParamMatcher
