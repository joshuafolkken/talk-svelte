export const ACTIONS = {
	PREV: 'prev',
	NEXT: 'next',
	TOGGLE_PLAY: 'toggle_play',
	TOGGLE_RECORD: 'toggle_record',
	CLEAR_TRANSCRIPT: 'clear_transcript',
	TOGGLE_TRANSCRIPT: 'toggle_transcript',
	TOGGLE_TRANSLATION: 'toggle_translation',
	RETRY: 'retry',
	MENU: 'menu',
} as const

export type ActionName = (typeof ACTIONS)[keyof typeof ACTIONS]
