export type Question = {
	audio_uri: string
	transcript: string
	translation: string
}

export function create_question(
	audio_uri: string,
	transcript: string,
	translation: string,
): Question {
	return {
		audio_uri,
		transcript,
		translation,
	}
}
