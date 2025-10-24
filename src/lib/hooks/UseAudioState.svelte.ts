import { pause_audio, play_audio, reset_audio } from '$lib/utils/audio'

export function use_audio_state(): {
	is_playing: boolean
	audio_element: HTMLAudioElement | undefined
	pause: () => void
	reset: () => void
	toggle: () => void
	can_play_through: (is_recording: boolean) => void
} {
	let is_playing = $state(false)
	let audio_element = $state<HTMLAudioElement | undefined>()

	async function play_safely(): Promise<void> {
		try {
			await play_audio(audio_element)
			is_playing = true
		} catch {
			is_playing = false
		}
	}

	function pause(): void {
		pause_audio(audio_element)
		is_playing = false
	}

	function reset(): void {
		reset_audio(audio_element)
		is_playing = false
	}

	function toggle(): void {
		if (is_playing) {
			pause()
		} else {
			void play_safely()
		}
	}

	function can_play_through(is_recording: boolean): void {
		if (is_playing || is_recording) return
		void play_safely()
	}

	// prettier-ignore
	return {
		// States
    get is_playing() { return is_playing },
    get audio_element() { return audio_element },
    set audio_element(value) { audio_element = value },
		// Actions
		pause,
		reset,
		toggle,
		can_play_through,
	}
}
