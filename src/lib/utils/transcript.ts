function normalize(transcript: string): string {
	return transcript
		.replaceAll(/[,.!?…]/gu, '')
		.replaceAll('\u2019', "'")
		.trim()
		.toLowerCase()
		.replaceAll('rock and roll', "rock 'n' roll")
		.replaceAll('okay', 'ok')
		.replaceAll('8:00', "eight o'clock")
		.replaceAll('got to go', 'gotta go')
		.replaceAll('shoes untied', "shoe's untied")
		.replaceAll('god damn', 'goddamn')
		.replaceAll('give me a tab', 'gimme a tab')
		.replaceAll('give me a pepsi free', 'gimme a pepsi-free')
}

function decensor(text: string): string {
	return text.replaceAll('s***', 'shit')
}

function is_correct(expected: string, actual: string): boolean {
	return normalize(expected) === normalize(actual)
}

function is_included(expected: string, actual: string): boolean {
	if (expected.length === 0 || actual.length === 0) return false
	const normalized_expected = normalize(expected)
	const normalized_actual = normalize(decensor(actual))
	return normalized_actual.includes(normalized_expected)
}

export const transcript = {
	normalize,
	decensor,
	is_correct,
	is_included,
}
