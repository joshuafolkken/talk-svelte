export interface Phrase {
	key: string
	script: string
	translation: string
}

export function create_phrase_entries(
	keys: Array<string>,
	en: Map<string, string>,
	ja: Map<string, string>,
): Array<Phrase> {
	const unique_keys = [...new Set(keys)]

	return unique_keys.map((key) => ({
		key,
		script: en.get(key) ?? '',
		translation: ja.get(key) ?? '',
	}))
}

// eslint-disable-next-line max-params
export function get_phrase_entries(
	index: number,
	phrase_key_groups: Array<Array<string>>,
	en: Map<string, string>,
	ja: Map<string, string>,
): Array<Phrase> {
	const keys = phrase_key_groups[index]

	if (keys === undefined) {
		throw new Error(`Group at index ${String(index)} not found`)
	}

	return create_phrase_entries(keys, en, ja)
}

export function get_all_phrase_entries(
	phrase_key_groups: Array<Array<string>>,
	en: Map<string, string>,
	ja: Map<string, string>,
): Array<Phrase> {
	const all_keys = phrase_key_groups.flat()
	return create_phrase_entries(all_keys, en, ja)
}
