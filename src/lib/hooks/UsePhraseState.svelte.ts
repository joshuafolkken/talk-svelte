import { browser } from '$app/environment'
import { page } from '$app/state'
import { get_bttf_phrases, phrase_key_collections } from '$lib/data/phrases/back-to-the-future'
import type { Phrase } from '$lib/data/phrases/common'
import { shuffle_array } from '$lib/utils/arrays'

// eslint-disable-next-line complexity -- complexity is acceptable for this function
function get_collection_index(): number {
	const value = page.url.searchParams.get('collection') ?? undefined
	const int_index = value === undefined || value === '' ? 0 : Number.parseInt(value, 10)
	return int_index >= 0 && int_index < phrase_key_collections.length ? int_index : 0
}

export function use_phrase_state(): {
	total: number
	current_number: number
	current: Phrase
	next: () => void
	previous: () => void
} {
	const INITIAL_INDEX = 0

	let current_index = $state(INITIAL_INDEX)
	let phrases = $state(get_bttf_phrases(0))
	let is_shuffled = $state(false)

	$effect(() => {
		if (!browser || is_shuffled) return

		is_shuffled = true
		const collection_index = get_collection_index()
		phrases = shuffle_array(get_bttf_phrases(collection_index))
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
