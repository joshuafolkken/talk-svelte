interface Phrase {
	key: string
	script: string
	translation: string
}

function create(
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
function get(
	index: number,
	phrase_key_groups: Array<Array<string>>,
	en: Map<string, string>,
	ja: Map<string, string>,
): Array<Phrase> {
	const keys = phrase_key_groups[index]

	if (keys === undefined) {
		throw new Error(`Group at index ${String(index)} not found`)
	}

	return create(keys, en, ja)
}

function get_all(
	phrase_key_groups: Array<Array<string>>,
	en: Map<string, string>,
	ja: Map<string, string>,
): Array<Phrase> {
	const all_keys = phrase_key_groups.flat()
	return create(all_keys, en, ja)
}

export type { Phrase }

export const phrases = {
	create,
	get,
	get_all,
}
