import { browser } from '$app/environment'
import { asset } from '$app/paths'
import { AUDIO_PATH } from '$lib/constants'
import { AUDIO_PRELOAD_STRATEGY, AUDIO_RESET_TIME } from '$lib/constants/audio'
import { get_praise_phrases, next } from '$lib/data/phrases/praise'
import { SvelteMap } from 'svelte/reactivity'

export function use_praise_audio_state(): {
	initialize: () => void
	play: () => Promise<void>
} {
	const praise_audio_map = new SvelteMap<string, HTMLAudioElement>()

	function initialize(): void {
		if (!browser) return

		for (const prise_phrase of get_praise_phrases(0)) {
			const audio = new Audio(asset(`/${AUDIO_PATH}/${prise_phrase.key}.mp3`))
			audio.preload = AUDIO_PRELOAD_STRATEGY
			praise_audio_map.set(prise_phrase.key, audio)
		}
	}

	async function play(): Promise<void> {
		const praise_phrase_key = next()
		if (praise_phrase_key.length === 0) return

		const praise_audio = praise_audio_map.get(praise_phrase_key)
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
