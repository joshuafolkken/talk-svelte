import { pause_audio, play_audio, reset_audio } from '$lib/utils/audio'

// eslint-disable-next-line max-lines-per-function
export function use_audio_state(): {
	is_playing: boolean
	audio_element: HTMLAudioElement | undefined
	stop: () => void
	reset: () => void
	play: (is_recording: boolean, set_recording: (value: boolean) => void) => void
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

	function stop(): void {
		pause_audio(audio_element)
		is_playing = false
	}

	function reset(): void {
		reset_audio(audio_element)
		is_playing = false
	}

	function play(is_recording: boolean, set_recording: (value: boolean) => void): void {
		if (is_recording) {
			set_recording(false)
		}

		if (is_playing) {
			stop()
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
		stop,
		reset,
		play,
		can_play_through,
	}
}
