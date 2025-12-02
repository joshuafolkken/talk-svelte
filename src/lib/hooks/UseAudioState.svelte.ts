import { AUDIO } from '$lib/constants/audio'
import { audio } from '$lib/utils/audio'

export function use_audio_state(): {
	is_playing: boolean
	audio_url: string | undefined
	play: (url: string) => Promise<void>
	pause: () => void
	stop: () => void
	reset: () => void
	toggle: (url: string) => void
	can_play_through: (is_recording: boolean, url: string) => void
} {
	let is_playing = $state(false)
	let audio_url = $state<string | undefined>()

	async function play(url: string): Promise<void> {
		try {
			await audio.play(url)
			audio_url = url
			is_playing = true
		} catch {
			// エラーは audio.ts で処理済み
			is_playing = false
		}
	}

	function pause(): void {
		audio.stop()
		is_playing = false
	}

	function stop(): void {
		audio.stop()
		is_playing = false
	}

	function reset(): void {
		audio.reset()
		is_playing = false
	}

	function toggle(url: string): void {
		if (is_playing) {
			pause()
		} else {
			void play(url)
		}
	}

	function can_play_through(is_recording: boolean, url: string): void {
		if (is_playing || is_recording) return

		// 録音停止後の再生開始を遅延させる
		setTimeout(() => {
			if (!is_playing) {
				void play(url)
			}
		}, AUDIO.PLAY_DELAY_MS)
	}

	// 再生終了を監視
	$effect(() => {
		audio.set_on_ended(() => {
			is_playing = false
		})

		return () => {
			// eslint-disable-next-line unicorn/no-useless-undefined
			audio.set_on_ended(undefined)
		}
	})

	// prettier-ignore
	return {
		// States
		get is_playing() { return is_playing },
		get audio_url() { return audio_url },
		// Actions
		play,
		pause,
		stop,
		reset,
		toggle,
		can_play_through,
	}
}
