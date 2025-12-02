import { browser } from '$app/environment'
import { SpeechToText } from '$lib/utils/speech-to-text'

export function use_recording_state(): {
	is_recording: boolean
	user_transcript: string
	is_correct: boolean
	speech_to_text: SpeechToText | undefined
	start: (lang: string) => void
	stop: () => void
	reset: () => void
	toggle: (lang: string) => boolean
	clear_transcript: () => void
	mark_correct: (transcript: string) => void
} {
	let is_recording = $state(false)
	let user_transcript = $state('')
	let is_correct = $state(false)
	let speech_to_text = $state<SpeechToText | undefined>()

	function reset_transcript(): void {
		user_transcript = ''
		is_correct = false
	}

	function stop(): void {
		speech_to_text?.stop()
		is_recording = false
	}

	function reset(): void {
		stop()
		reset_transcript()
	}

	function start(lang: string): void {
		reset_transcript()
		speech_to_text?.start(lang)
		is_recording = true
	}

	function toggle(lang: string): boolean {
		if (is_recording) {
			stop()
			return false
		}

		start(lang)
		return true
	}

	function clear_transcript(): void {
		reset_transcript()

		if (is_recording && speech_to_text !== undefined) {
			speech_to_text.restart()
		}
	}

	function mark_correct(transcript: string): void {
		stop()
		is_correct = true
		user_transcript = transcript
	}

	// Initialize SpeechToText
	$effect(() => {
		if (!browser) return

		speech_to_text = new SpeechToText(
			(transcript) => {
				if (is_correct) return
				user_transcript = transcript
			},
			(error) => {
				console.error('Speech recognition error:', error)
				is_recording = false
			},
		)

		// eslint-disable-next-line consistent-return
		return (): void => {
			speech_to_text?.destroy()
		}
	})

	// prettier-ignore
	return {
		// States
		get is_recording() { return is_recording },
		get user_transcript() { return user_transcript },
		get is_correct() { return is_correct },
		get speech_to_text() { return speech_to_text },
		// Actions
		start,
		stop,
		reset,
		toggle,
		clear_transcript,
		mark_correct,
	}
}
