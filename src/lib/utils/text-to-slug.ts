function trim_hyphens(input: string): string {
	let result = input

	while (result.startsWith('-')) {
		result = result.slice(1)
	}
	while (result.endsWith('-')) {
		result = result.slice(0, -1)
	}
	return result
}

function add_suffix(slug: string, text: string): string {
	if (text.endsWith('?')) {
		return `${slug}-q`
	}
	if (text.endsWith('!')) {
		return `${slug}-x`
	}
	return slug
}

export function text_to_slug(text: string): string {
	const trimmed = text.trim()

	const slug = trimmed
		.toLowerCase()
		.replaceAll("'", '-')
		.replaceAll(/[^\s\w-]/gu, '')
		.trim()
		.replaceAll(/\s+/gu, '-')
		.replaceAll(/-+/gu, '-')

	const cleaned_slug = trim_hyphens(slug)
	return add_suffix(cleaned_slug, trimmed)
}
