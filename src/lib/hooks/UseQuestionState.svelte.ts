import { browser } from '$app/environment'
import { get_shuffled_questions } from '$lib/data/questions'
import type { Question } from '$lib/types/question'

export function use_question_state(): {
	total_questions: number
	current_question_number: number
	question: Question
	next: () => void
	previous: () => void
} {
	const INITIAL_QUESTION_INDEX = 0

	let current_index = $state(INITIAL_QUESTION_INDEX)
	let questions = $state(get_shuffled_questions())

	$effect(() => {
		if (!browser) return

		questions = get_shuffled_questions()
	})

	const total_questions = $derived(questions.length)
	const current_question_number = $derived(current_index + 1)
	const question = $derived.by(() => {
		const current_question = questions[current_index]
		if (current_question === undefined) {
			throw new Error(`Question at index ${String(current_index)} not found`)
		}
		return current_question
	})

	const can_go_next = $derived(current_index < total_questions - 1)
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
		get total_questions() { return total_questions },
		get current_question_number() { return current_question_number },
		get question() { return question },
		// Actions
		next,
		previous,
	}
}
