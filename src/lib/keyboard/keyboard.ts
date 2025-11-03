const KEYS = {
	A: 'a',
	W: 'w',
	S: 's',
	D: 'd',
	SPACE: ' ',
	R: 'r',
	F: 'f',
	Q: 'q',
	E: 'e',
	V: 'v',
	Z: 'z',
} as const

const keys_set: ReadonlySet<string> = new Set<string>(Object.values(KEYS))

function is_supported(value: string): value is KeyName {
	return keys_set.has(value)
}

export const keyboard = {
	KEYS,
	is_supported,
}

export type KeyName = (typeof KEYS)[keyof typeof KEYS]
