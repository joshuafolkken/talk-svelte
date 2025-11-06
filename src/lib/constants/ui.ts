export const UI = {
	ICON_SIZES: {
		SM: 'sm',
		MD: 'md',
		LG: 'lg',
	},
	BUTTON_SIZES: {
		MD: 'md',
		LG: 'lg',
	},
	BUTTON_STYLES: {
		RECORDING_ACTIVE: 'recording-active',
		LIKED_ACTIVE: 'liked-active',
		TROPHY_ACTIVE: 'trophy-active',
		KEYBOARD_PRESSED: 'keyboard-pressed',
	},
	SHORTCUT_DELAY: 80,
	ANIMATION_DURATION: 200,
} as const

export type IconSize = (typeof UI.ICON_SIZES)[keyof typeof UI.ICON_SIZES]
export type ButtonSize = (typeof UI.BUTTON_SIZES)[keyof typeof UI.BUTTON_SIZES]
