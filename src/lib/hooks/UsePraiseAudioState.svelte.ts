import { asset } from '$app/paths'
import { AUDIO } from '$lib/constants/audio'
import { praise } from '$lib/data/phrases/praise'
import { audio } from '$lib/utils/audio'

function initialize(): void {
	// WebAudio APIでは事前初期化不要
}

function play(): void {
	const praise_phrase_key = praise.next()
	if (praise_phrase_key.length === 0) return

	const audio_url = asset(`/${AUDIO.PATH}/${praise_phrase_key}.mp3`)

	setTimeout(() => {
		void audio.play(audio_url)
	}, AUDIO.PLAY_DELAY_MS)
}

export function use_praise_audio_state(): {
	initialize: () => void
	play: () => void
} {
	return {
		initialize,
		play,
	}
}
