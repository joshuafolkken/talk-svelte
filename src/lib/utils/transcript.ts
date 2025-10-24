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

export function is_transcript_included(expected: string, actual: string): boolean {
	if (expected.length === 0 || actual.length === 0) return false
	const normalized_expected = normalize_transcript(expected)
	const normalized_actual = normalize_transcript(actual)
	return normalized_actual.includes(normalized_expected)
}
