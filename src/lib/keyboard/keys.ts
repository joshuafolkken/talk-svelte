export const KEYS = {
	a: 'a',
	w: 'w',
	s: 's',
	d: 'd',
	space: ' ',
	r: 'r',
	f: 'f',
	q: 'q',
	e: 'e',
	v: 'v',
	z: 'z',
} as const

export type KeyName = (typeof KEYS)[keyof typeof KEYS]

export const KEYS_SET: ReadonlySet<string> = new Set<string>(Object.values(KEYS))

export function is_supported_key(value: string): value is KeyName {
	return KEYS_SET.has(value)
}
