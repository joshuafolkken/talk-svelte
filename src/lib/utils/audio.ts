export function reset_audio(audio_element?: HTMLAudioElement): void {
	if (audio_element === undefined) return

	audio_element.pause()
	audio_element.currentTime = 0
}

export async function play_audio(audio_element?: HTMLAudioElement): Promise<void> {
	if (audio_element === undefined) return

	await audio_element.play().catch((error: unknown) => {
		console.error('Failed to play audio:', error)
		throw error
	})
}

export function pause_audio(audio_element?: HTMLAudioElement): void {
	if (audio_element === undefined) return

	audio_element.pause()
}
