import { browser } from '$app/environment'
import { asset } from '$app/paths'
import { AUDIO_PATH } from '$lib/constants'
import { AUDIO_PRELOAD_STRATEGY, AUDIO_RESET_TIME } from '$lib/constants/audio'
import { get_praise_audio_file, praise_audio_files } from '$lib/data/praise-audio'
import { SvelteMap } from 'svelte/reactivity'

export function use_praise_audio_state(): {
	initialize: () => void
	play: () => Promise<void>
} {
	const praise_audio_map = new SvelteMap<string, HTMLAudioElement>()

	function initialize(): void {
		if (!browser) return

		for (const filename of praise_audio_files) {
			const audio = new Audio(asset(`/${AUDIO_PATH}/${filename}.mp3`))
			audio.preload = AUDIO_PRELOAD_STRATEGY
			praise_audio_map.set(filename, audio)
		}
	}

	async function play(): Promise<void> {
		const praise_audio_file = get_praise_audio_file()
		if (praise_audio_file.length === 0) return

		const praise_audio = praise_audio_map.get(praise_audio_file)
		if (praise_audio === undefined) return
		praise_audio.currentTime = AUDIO_RESET_TIME
		await praise_audio.play()
	}

	// Initialize audio files
	$effect(() => {
		initialize()
	})

	return {
		initialize,
		play,
	}
}
