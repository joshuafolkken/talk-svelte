export function use_ui_state(): {
	is_transcript_visible: boolean
	is_translation_visible: boolean
	is_liked: boolean
	is_completed: boolean
	toggle_transcript: () => void
	toggle_translation: () => void
	toggle_like: () => void
	toggle_completed: () => void
	reset: () => void
} {
	let is_transcript_visible = $state(false)
	let is_translation_visible = $state(false)
	let is_liked = $state(false)
	let is_completed = $state(false)

	function toggle_transcript(): void {
		is_transcript_visible = !is_transcript_visible
	}

	function toggle_translation(): void {
		is_translation_visible = !is_translation_visible
	}

	function toggle_like(): void {
		is_liked = !is_liked
	}

	function toggle_completed(): void {
		is_completed = !is_completed
	}

	function reset(): void {
		is_transcript_visible = false
		is_translation_visible = false
		is_liked = false
		is_completed = false
	}

	// prettier-ignore
	return {
		// States
		get is_transcript_visible() { return is_transcript_visible },
		get is_translation_visible() { return is_translation_visible },
		get is_liked() { return is_liked },
		get is_completed() { return is_completed },
		// Actions
		toggle_transcript,
		toggle_translation,
		toggle_like,
		toggle_completed,
		reset,
	}
}
