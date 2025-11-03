function reset(audio_element?: HTMLAudioElement): void {
	if (audio_element === undefined) return

	audio_element.pause()
	audio_element.currentTime = 0
}

async function play(audio_element?: HTMLAudioElement): Promise<void> {
	if (audio_element === undefined) return

	await audio_element.play().catch((error: unknown) => {
		console.error('Failed to play audio:', error)
		throw error
	})
}

function pause(audio_element?: HTMLAudioElement): void {
	if (audio_element === undefined) return

	audio_element.pause()
}

export const audio = {
	reset,
	play,
	pause,
}
