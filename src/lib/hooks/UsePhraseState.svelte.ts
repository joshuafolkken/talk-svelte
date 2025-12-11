import { browser } from '$app/environment'
import { page } from '$app/state'
import type { Phrase, PhrasesModule } from '$lib/data/phrases/phrases'
import { arrays } from '$lib/utils/arrays'

export function use_phrase_state(phrases_module: PhrasesModule): {
	total: number
	current_number: number
	current: Phrase
	next: () => void
	previous: () => void
} {
	function get_collection_index(): number {
		const value = page.params.collection_id
		const int_index = value === undefined || value === '' ? 0 : Number.parseInt(value, 10)
		return int_index >= 0 && int_index < phrases_module.key_collections.length ? int_index : 0
	}

	const INITIAL_INDEX = 0

	let current_index = $state(INITIAL_INDEX)
	let phrases = $state(phrases_module.get_phrases(0))

	$effect(() => {
		if (!browser) return

		const collection_index = get_collection_index()
		phrases = arrays.shuffle(phrases_module.get_phrases(collection_index))
	})

	const total = $derived(phrases.length)
	const current_number = $derived(current_index + 1)
	const current = $derived.by(() => {
		const phrase = phrases[current_index]
		if (phrase === undefined) {
			throw new Error(`Phrase at index ${String(current_index)} not found`)
		}
		return phrase
	})

	const can_go_next = $derived(current_index < total - 1)
	const can_go_previous = $derived(current_index > 0)

	function next(): void {
		if (can_go_next) {
			current_index += 1
		}
	}

	function previous(): void {
		if (can_go_previous) {
			current_index -= 1
		}
	}

	// prettier-ignore
	return {
		// States
		get total() { return total },
		get current_number() { return current_number },
		get current() { return current },
		// Actions
		next,
		previous,
	}
}
