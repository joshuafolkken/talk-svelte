export function normalize_transcript(transcript: string): string {
	return transcript
		.replaceAll(/[,.!?…]/gu, '')
		.replaceAll('\u2019', "'")
		.trim()
		.toLowerCase()
}

export function is_transcript_correct(expected: string, actual: string): boolean {
	return normalize_transcript(expected) === normalize_transcript(actual)
}
