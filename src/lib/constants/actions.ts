export const ACTIONS = {
	prev: 'prev',
	next: 'next',
	toggle_play: 'toggle_play',
	toggle_record: 'toggle_record',
	clear_transcript: 'clear_transcript',
	toggle_transcript: 'toggle_transcript',
	toggle_translation: 'toggle_translation',
	retry: 'retry',
	menu: 'menu',
} as const

export type ActionName = (typeof ACTIONS)[keyof typeof ACTIONS]
