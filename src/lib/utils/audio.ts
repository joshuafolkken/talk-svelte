export function reset_audio(audioElement?: HTMLAudioElement): void {
	if (!audioElement) return

	audioElement.pause()
	audioElement.currentTime = 0
}

export async function play_audio(audioElement?: HTMLAudioElement): Promise<void> {
	if (!audioElement) return Promise.resolve()

	return audioElement.play().catch((error) => {
		console.error('Failed to play audio:', error)
		throw error
	})
}

export function pause_audio(audioElement?: HTMLAudioElement): void {
	if (!audioElement) return

	audioElement.pause()
}
